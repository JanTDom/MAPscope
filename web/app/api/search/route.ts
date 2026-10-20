import { NextResponse } from "next/server";
import { ALL_ENTITIES_REGISTRY, COMPANY_DISCLOSURES_DATA, TOP_FIRE_ALERTS } from "@/lib/mapscope-data";
import { OsintSearchResult, CompanyDisclosureRecord, TopFireAlert } from "@/lib/types";

function classifyUrgencyAndCategory(text: string): { urgency: "P1" | "P2" | "P3"; category: string } {
  const t = text.toLowerCase();
  let urgency: "P1" | "P2" | "P3" = "P3";

  if (
    t.includes("awaria krytyczna") ||
    t.includes("katastrofa") ||
    t.includes("śledztwo abw") ||
    t.includes("aresztowanie") ||
    t.includes("zarzuty prokuratorskie") ||
    t.includes("paraliż") ||
    t.includes("strajk generalny")
  ) {
    urgency = "P1";
  } else if (
    t.includes("kontrola nik") ||
    t.includes("żądanie dymisji") ||
    t.includes("spór zbiorowy") ||
    t.includes("interpelacja") ||
    t.includes("wotum nieufności") ||
    t.includes("odwołanie zarządu") ||
    t.includes("strata netto")
  ) {
    urgency = "P2";
  }

  let category = "OGÓLNE";
  if (t.includes("orlen") || t.includes("lotos") || t.includes("azoty") || t.includes("ropa") || t.includes("gaz")) {
    category = "PALIWA_CHEMIA";
  } else if (t.includes("pge") || t.includes("tauron") || t.includes("enea") || t.includes("energa") || t.includes("węglowa")) {
    category = "ENERGETYKA";
  } else if (t.includes("pkp") || t.includes("cargo") || t.includes("poczta") || t.includes("lot") || t.includes("cpk")) {
    category = "TRANSPORT_LOGISTYKA";
  } else if (t.includes("pko") || t.includes("pekao") || t.includes("pzu") || t.includes("bgk") || t.includes("dywidend")) {
    category = "FINANSE_UBEZPIECZENIA";
  } else if (t.includes("kghm") || t.includes("jsw") || t.includes("pgg") || t.includes("górnictwo")) {
    category = "GÓRNICTWO_HUTNICTWO";
  } else if (t.includes("pgz") || t.includes("mesko") || t.includes("hsw") || t.includes("mon")) {
    category = "PRZEMYSŁ_OBRONNY";
  }

  return { urgency, category };
}

function parseGoogleNewsXml(xmlText: string, maxItems = 25): OsintSearchResult[] {
  const items: OsintSearchResult[] = [];
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemBlock of itemMatches.slice(0, maxItems)) {
    const titleMatch = itemBlock.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = itemBlock.match(/<link>([\s\S]*?)<\/link>/);
    const pubDateMatch = itemBlock.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const descMatch = itemBlock.match(/<description>([\s\S]*?)<\/description>/);
    const sourceMatch = itemBlock.match(/<source[^>]*>([\s\S]*?)<\/source>/);

    const rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
    const rawLink = linkMatch ? linkMatch[1].trim() : "";
    const rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
    let rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").trim() : "";
    if (rawDesc.length > 200) rawDesc = rawDesc.slice(0, 197) + "...";
    const rawSource = sourceMatch ? sourceMatch[1].trim() : "Wiadomości";

    let sourceDomain = "news.google.pl";
    try {
      if (rawLink) {
        const u = new URL(rawLink);
        sourceDomain = u.hostname.replace(/^www\./, "");
      }
    } catch {
      // ignore
    }

    if (rawTitle && rawLink) {
      const combined = `${rawTitle} ${rawDesc}`;
      const { urgency, category } = classifyUrgencyAndCategory(combined);

      items.push({
        title: rawTitle,
        link: rawLink,
        sourceDomain,
        sourceName: rawSource,
        snippet: rawDesc || undefined,
        pubDate: rawPubDate || undefined,
        urgencyTier: urgency,
        riskCategory: category,
        isDuplicate: false,
      });
    }
  }

  return items;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ error: "Brak parametru zapytania 'q'." }, { status: 400 });
    }

    const gNewsUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pl&gl=PL&ceid=PL:pl`;

    let liveItems: OsintSearchResult[] = [];
    try {
      const resp = await fetch(gNewsUrl, {
        headers: {
          "User-Agent": "MAPscope/1.0 (+https://mapscope.pl; kontakt@mapscope.pl)",
          "Accept": "application/rss+xml, application/xml, text/xml",
        },
        next: { revalidate: 60 },
      });

      if (resp.ok) {
        const xmlText = await resp.text();
        liveItems = parseGoogleNewsXml(xmlText, 25);
      }
    } catch {
      // fallback do wewnętrznych zbiorów przy braku połączenia
    }

    const qLower = query.toLowerCase();

    // Dopasowanie wewnętrznych oświadczeń SSP
    const matchedDisclosures: OsintSearchResult[] = COMPANY_DISCLOSURES_DATA.filter(
      (d: CompanyDisclosureRecord) =>
        d.title.toLowerCase().includes(qLower) ||
        d.content.toLowerCase().includes(qLower) ||
        d.entity_name.toLowerCase().includes(qLower)
    ).map((d: CompanyDisclosureRecord) => {
      const { urgency, category } = classifyUrgencyAndCategory(`${d.title} ${d.content}`);
      return {
        title: `[Oficjalny komunikat] ${d.entity_name}: ${d.title}`,
        link: d.source_url || "https://mapscope.pl/komunikaty",
        sourceDomain: "relacje.inwestorskie.ssp",
        sourceName: `Biuro Prasowe ${d.entity_name}`,
        snippet: d.content.slice(0, 200) + "...",
        pubDate: d.published_at,
        urgencyTier: urgency,
        riskCategory: category,
        isDuplicate: false,
      };
    });

    // Dopasowanie alertów kryzysowych i pożarów dnia
    const matchedFires: OsintSearchResult[] = TOP_FIRE_ALERTS.filter(
      (f: TopFireAlert) =>
        f.entityName.toLowerCase().includes(qLower) ||
        f.title.toLowerCase().includes(qLower) ||
        f.whatHappened.toLowerCase().includes(qLower)
    ).map((f: TopFireAlert) => {
      const { urgency, category } = classifyUrgencyAndCategory(`${f.title} ${f.whatHappened}`);
      return {
        title: `[Alert Gabinetu MAP] ${f.entityName}: ${f.title}`,
        link: "https://mapscope.pl/radar",
        sourceDomain: "mapscope.gov.pl",
        sourceName: "Centrum Monitoringu MAP",
        snippet: f.whatHappened,
        pubDate: f.timestamp,
        urgencyTier: urgency,
        riskCategory: category,
        isDuplicate: false,
      };
    });

    // Łączenie i deduplikacja
    const combined = [...liveItems, ...matchedDisclosures, ...matchedFires];
    const seenTitles = new Set<string>();
    const deduplicated: OsintSearchResult[] = [];

    for (const item of combined) {
      const normTitle = item.title.toLowerCase().replace(/[^a-ząćęłńóśźż0-9]/g, "").slice(0, 50);
      if (!seenTitles.has(normTitle)) {
        seenTitles.add(normTitle);
        deduplicated.push(item);
      }
    }

    return NextResponse.json({
      status: "ok",
      query,
      count: deduplicated.length,
      liveSource: liveItems.length > 0 ? "Google News RSS PL + Biura Prasowe SSP" : "Rejestr Spółek Skarbu Państwa MAP",
      results: deduplicated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Nieznany błąd";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
