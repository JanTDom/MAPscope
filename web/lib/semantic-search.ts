/**
 * Silnik Wyszukiwania Semantycznego i Analizy Intencji MAPscope
 * Zapewnia precyzyjne odnajdywanie spraw, spółek i precedensów w języku naturalnym.
 */

import { ALL_ENTITIES_REGISTRY } from "./all-ssp-registry.ts";
import { TOP_FIRE_ALERTS, PARLIAMENTARY_INQUIRIES } from "./mapscope-data.ts";
import type { EntityRecord } from "./types.ts";

export interface SemanticSearchResult {
  query: string;
  detectedThemes: string[];
  matchedEntities: Array<{
    entity: EntityRecord;
    matchReason: string;
    relevanceScore: number;
  }>;
  matchedAlerts: Array<{
    id: string;
    title: string;
    entityName: string;
    relevanceReason: string;
  }>;
  matchedInquiries: Array<{
    number: string;
    subject: string;
    relevanceReason: string;
  }>;
}

export interface ThemeRule {
  theme: string;
  keywords: string[];
  entityIds: string[];
  explanation: string;
}

export const SEMANTIC_THEME_RULES: ThemeRule[] = [
  {
    theme: "Płynność finansowa, zadłużenie i kowenanty bankowe",
    keywords: ["płynność", "dług", "kredyt", "kowenant", "standstill", "bank", "waiver", "polimery"],
    entityIds: ["e-azoty", "e8-pkpcargo", "ssp-273"],
    explanation: "Zidentyfikowano zagadnienie ryzyka płynnościowego, negocjacji z konsorcjami bankowymi i ochrony kowenantów dłużnych.",
  },
  {
    theme: "Rekrutacja, konkursy i ład zarządczy w regionach",
    keywords: ["rekrutacj", "konkurs", "dyrektor", "oddział", "nepotyzm", "kadry", "powołan"],
    entityIds: ["ssp-365", "e6-totalizator"],
    explanation: "Zidentyfikowano problematykę procedur konkursowych i audytu zatrudnienia w terenowych jednostkach spółek.",
  },
  {
    theme: "Napięcia społeczne, spory zbiorowe i restrukturyzacja zatrudnienia",
    keywords: ["związk", "strajk", "pikieta", "protest", "zwolnien", "pdo", "odpraw", "kolej"],
    entityIds: ["ssp-272", "ssp-273", "e-jsw"],
    explanation: "Zidentyfikowano obszar dialogu społecznego, sporów zbiorowych z ustaw z 1991 r. oraz programów dobrowolnych odejść.",
  },
  {
    theme: "Inwestycje strategiczne i optymalizacja nakładów CAPEX",
    keywords: ["capex", "inwestycj", "petrochemi", "rafineri", "atom", "wodor", "nakład"],
    entityIds: ["e-orlen", "e-pge", "e-kghm", "e-tauron"],
    explanation: "Zidentyfikowano kluczowe programy inwestycyjne majątku narodowego i dyscyplinę kapitałową.",
  },
  {
    theme: "Uśpiona likwidacja i spółki w stanie upadłości",
    keywords: ["likwidacj", "upadłość", "syndyk", "uśpion", "pks", "nieruchomośc"],
    entityIds: ALL_ENTITIES_REGISTRY.filter((e) => e.status === "liquidation" || e.status === "bankruptcy")
      .slice(0, 10)
      .map((e) => e.id),
    explanation: "Zidentyfikowano portfel spółek uśpionych w restrukturyzacji i likwidacji z mieniem nieruchomym.",
  },
  {
    theme: "Kontrole państwowe, śledztwa i wystąpienia NIK",
    keywords: ["nik", "cba", "prokuratur", "śledztw", "pokontroln", "audyt", "zarzut"],
    entityIds: ["e-orlen", "ssp-365", "ssp-273", "e-azoty"],
    explanation: "Zidentyfikowano postępowania organów kontroli państwowej i wnioski pokontrolne.",
  },
];

export const SEMANTIC_RULES = SEMANTIC_THEME_RULES;

export function executeSemanticSearch(query: string): SemanticSearchResult {
  const normalizedQuery = query.toLowerCase().trim();
  const matchedThemes: ThemeRule[] = [];

  for (const rule of SEMANTIC_THEME_RULES) {
    if (rule.keywords.some((kw) => normalizedQuery.includes(kw))) {
      matchedThemes.push(rule);
    }
  }

  // Dopasowanie podmiotów
  const matchedEntitiesMap = new Map<string, { entity: EntityRecord; matchReason: string; relevanceScore: number }>();

  // 1. Z reguł semantycznych
  for (const th of matchedThemes) {
    for (const entId of th.entityIds) {
      const found = ALL_ENTITIES_REGISTRY.find((e) => e.id === entId);
      if (found) {
        matchedEntitiesMap.set(found.id, {
          entity: found,
          matchReason: th.explanation,
          relevanceScore: 0.95,
        });
      }
    }
  }

  // 2. Bezpośrednie dopasowanie słów w nazwach / branżach
  if (normalizedQuery.length >= 3) {
    for (const ent of ALL_ENTITIES_REGISTRY) {
      if (matchedEntitiesMap.has(ent.id)) continue;
      if (
        ent.name.toLowerCase().includes(normalizedQuery) ||
        ent.sector.toLowerCase().includes(normalizedQuery) ||
        (ent.stock_ticker && ent.stock_ticker.toLowerCase().includes(normalizedQuery))
      ) {
        matchedEntitiesMap.set(ent.id, {
          entity: ent,
          matchReason: `Bezpośrednie trafienie nazwy lub sektora: ${ent.sector}`,
          relevanceScore: 0.85,
        });
      }
    }
  }

  // Dopasowanie pożarów dnia
  const matchedAlerts = TOP_FIRE_ALERTS.filter((al) => {
    const text = `${al.title} ${al.entityName} ${al.whatHappened}`.toLowerCase();
    return (
      matchedThemes.some((th) => th.keywords.some((kw) => text.includes(kw))) ||
      (normalizedQuery.length >= 3 && text.includes(normalizedQuery))
    );
  }).map((al) => ({
    id: al.id,
    title: al.title,
    entityName: al.entityName,
    relevanceReason: "Korelacja tematyczna z zarzewiem kryzysowym w pożarach dnia MAP",
  }));

  // Dopasowanie interpelacji sejmowych
  const matchedInquiries = PARLIAMENTARY_INQUIRIES.filter((inq) => {
    const text = `${inq.number} ${inq.subject} ${inq.author}`.toLowerCase();
    return (
      matchedThemes.some((th) => th.keywords.some((kw) => text.includes(kw))) ||
      (normalizedQuery.length >= 3 && text.includes(normalizedQuery))
    );
  }).map((inq) => ({
    number: inq.number,
    subject: inq.subject,
    relevanceReason: "Zbieżność z oficjalnym rejestrem interpelacji Sejmu RP X kadencji",
  }));

  return {
    query,
    detectedThemes: matchedThemes.map((t) => t.theme),
    matchedEntities: Array.from(matchedEntitiesMap.values()).slice(0, 8),
    matchedAlerts: matchedAlerts.slice(0, 4),
    matchedInquiries: matchedInquiries.slice(0, 4),
  };
}
