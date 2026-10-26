import { NextResponse } from "next/server";
import { generateGovernmentHtmlDocument, GovernmentDocPayload } from "@/lib/government-doc-generator";
import { KPRM_ONE_PAGER_DATA, AGM_VOTING_TEMPLATES } from "@/lib/mapscope-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "kprm";
  const id = searchParams.get("id");

  let payload: GovernmentDocPayload;

  if (type === "kprm") {
    payload = {
      docType: "KPRM_ONE_PAGER",
      title: "Materiały Informacyjne dla Prezesa Rady Ministrów na Posiedzenie Rządu",
      referenceNumber: "MAP-GM-2026/KPRM-01",
      department: "Gabinet Ministra Aktywów Państwowych",
      author: "Minister Aktywów Państwowych",
      recipient: "Prezes Rady Ministrów / Kancelaria Prezesa Rady Ministrów",
      summary: KPRM_ONE_PAGER_DATA.executiveSummary,
      sections: [
        {
          title: "1. Sprawy operacyjne i wnioski o decyzję",
          items: KPRM_ONE_PAGER_DATA.items.map(
            (it) =>
              `[${it.category.toUpperCase()}] ${it.entityName}: ${it.title} — ${it.details}${
                it.actionRequired ? ` (Wniosek: ${it.actionRequired})` : ""
              }`
          ),
        },
        {
          title: "2. Postępy restrukturyzacji flagowych grup kapitałowych",
          items: KPRM_ONE_PAGER_DATA.restructuringProgress.map(
            (r) =>
              `${r.entityName}: docelowe oszczędności ${r.targetSavings}, korekta etatowa ${r.headcountChange} (Stan: ${r.currentStatus})`
          ),
        },
      ],
      legalBasis:
        "Ustawa z dnia 16 grudnia 2016 r. o zasadach zarządzania mieniem państwowym (Dz.U. z 2024 r. poz. 125).",
      signoff: "Gabinet Ministra Aktywów Państwowych",
    };
  } else if (type === "agm") {
    const agm = AGM_VOTING_TEMPLATES.find((a) => a.id === id) || AGM_VOTING_TEMPLATES[0];
    payload = {
      docType: "AGM_VOTING_MANDATE",
      title: `Mandat do Głosowania na Walnym Zgromadzeniu — ${agm.entityName}`,
      referenceNumber: `MAP-DN-${agm.ticker}-2026/WZ`,
      department: "Departament Nadzoru Właścicielskiego",
      author: "Dyrektor Departamentu Nadzoru",
      recipient: `Pełnomocnik Ministra na ${agm.meetingType} ${agm.entityName}`,
      summary: `Wiążąca instrukcja do głosowania dla reprezentanta Skarbu Państwa w sprawie: ${agm.agendaItem}.`,
      sections: [
        {
          title: "Wiążąca dyspozycja głosowania",
          items: [
            `Rekomendacja resortu: GŁOSOWAĆ ${agm.recommendedVote}`,
            `Uzasadnienie właścicielskie: ${agm.ministerJustification}`,
          ],
        },
        {
          title: "Wytyczne negocjacyjne i czerwone linie pełnomocnika",
          items: [
            `Czerwona linia: ${agm.redLineConstraint}`,
            `Podstawa prawna polecenia: ${agm.statutoryBasis}`,
          ],
        },
      ],
      legalBasis: agm.statutoryBasis,
      signoff: "Z upoważnienia Ministra Aktywów Państwowych — Podsekretarz Stanu",
    };
  } else {
    // Fiszka prasowa 30s
    payload = {
      docType: "PRESS_BRIEFING_30S",
      title: "Fiszka Przedkonferencyjna dla Kierownictwa Resortu (30 Sekund)",
      referenceNumber: "MAP-BP-2026/BRIEF-30",
      department: "Biuro Komunikacji i Rzecznika Prasowego MAP",
      author: "Rzecznik Prasowy MAP",
      recipient: "Kierownictwo Ministerstwa Aktywów Państwowych",
      summary: "Oficjalna linia obrony resortu i kluczowe fakty przed wystąpieniem medialnym lub konferencją prasową.",
      sections: [
        {
          title: "Zdanie otwierające (do natychmiastowego zacytowania)",
          items: [
            "Wszystkie postępowania rekrutacyjne i zarządcze w spółkach portfelowych podlegają transparentnym procedurom nadzorczym MAP bez taryfy ulgowej.",
          ],
        },
        {
          title: "Twarde liczby resortu (Hard numbers)",
          items: [
            "100% bazy 406 spółek objęte bieżącym monitoringiem nadzoru",
            "0 tolerancji dla naruszeń kodeksu dobrych praktyk spółek państwowych",
            "Ponad 480 mln zł rocznych oszczędności wygenerowanych programami optymalizacji",
          ],
        },
        {
          title: "Czerwona linia narracyjna (Czego kategorycznie NIE mówić)",
          items: [
            "Kategoryczny zakaz spekulowania o decyzjach prokuratury i organów ścigania przed zakończeniem oficjalnych czynności.",
          ],
        },
      ],
      legalBasis: "Zarządzenie Ministra Aktywów Państwowych w sprawie polityki informacyjnej resortu.",
      signoff: "Rzecznik Prasowy MAP",
    };
  }

  const html = generateGovernmentHtmlDocument(payload);
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
