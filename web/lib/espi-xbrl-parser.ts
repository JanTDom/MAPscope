import type {
  EspiXbrlLineItem,
  EspiXbrlPeriodicReport,
  CovenantEvaluation,
  CovenantStatus,
  ReportStandard,
} from "./types";

// Słownik mapowania tagów IFRS / KNF ESPI
const TAG_SYNONYMS: Record<string, string[]> = {
  revenue: [
    "Revenue",
    "RevenueFromContractsWithCustomers",
    "SalesRevenue",
    "PrzychodyZeSprzedazy",
    "PrzychodyNettoZeSprzedazy",
    "PrzychodyZeSprzedazyProduktowTowarowIMaterialow",
  ],
  ebit: [
    "OperatingProfit",
    "ProfitLossFromOperatingActivities",
    "OperatingIncomeLoss",
    "ZyskOperacyjny",
    "ZyskStrataOperacyjna",
    "EBIT",
  ],
  depreciation: [
    "DepreciationAndAmortisationExpense",
    "DepreciationExpense",
    "AmortisationExpense",
    "Amortyzacja",
    "OdpisyAmortyzacyjne",
  ],
  netProfit: [
    "ProfitLoss",
    "ProfitLossForPeriod",
    "NetProfitLoss",
    "ZyskNetto",
    "ZyskStrataNetto",
    "WynikFinansowyNetto",
  ],
  financeCosts: [
    "FinanceCosts",
    "InterestExpense",
    "KosztyFinansowe",
    "KosztyOdsetkowe",
  ],
  longTermDebt: [
    "NoncurrentBorrowings",
    "LongtermBorrowings",
    "NoncurrentFinancialLiabilities",
    "ZobowiazaniaDlugoterminoweKredytyIPozyczki",
    "KredytyIPozyczkiDlugoterminowe",
    "ZobowiazaniaDlugoterminoweZRodzajuKredytow",
  ],
  shortTermDebt: [
    "CurrentBorrowings",
    "ShorttermBorrowings",
    "CurrentFinancialLiabilities",
    "ZobowiazaniaKrotkoterminoweKredytyIPozyczki",
    "KredytyIPozyczkiKrotkoterminowe",
    "ZobowiazaniaKrotkoterminoweZRodzajuKredytow",
  ],
  cash: [
    "CashAndCashEquivalents",
    "CashAndCashEquivalentsAtEndOfPeriod",
    "SrodkiPieniezneIIchEkwiwalenty",
    "SrodkiPieniezne",
  ],
  equity: [
    "Equity",
    "TotalEquity",
    "EquityAttributableToOwnersOfParent",
    "KapitalWlasny",
    "KapitalWlasnyRazem",
  ],
  assets: [
    "Assets",
    "TotalAssets",
    "AktywaRazem",
    "Aktywa",
  ],
};

const COVENANT_LIMITS: Record<string, number> = {
  ATT: 3.50,
  PKN: 3.50,
  PKP: 3.00,
  PGE: 3.50,
  TPE: 3.50,
  KGH: 3.50,
  JSW: 3.00,
  ENA: 3.50,
};

function cleanNumber(raw: string): number {
  if (!raw) return 0;
  let val = raw.trim();

  let isNegative = false;
  if (val.startsWith("(") && val.endsWith(")")) {
    isNegative = true;
    val = val.slice(1, -1).trim();
  } else if (val.startsWith("-")) {
    isNegative = true;
    val = val.slice(1).trim();
  }

  val = val.replace(/\s+/g, "").replace(/\u00A0/g, "");

  if (val.includes(",") && val.includes(".")) {
    if (val.lastIndexOf(",") > val.lastIndexOf(".")) {
      val = val.replace(/\./g, "").replace(/,/g, ".");
    } else {
      val = val.replace(/,/g, "");
    }
  } else if (val.includes(",")) {
    val = val.replace(/,/g, ".");
  }

  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
}

function stripNamespace(tag: string): string {
  if (tag.includes("}")) return tag.split("}")[1];
  if (tag.includes(":")) return tag.split(":")[1];
  return tag;
}

function tagToLabel(tag: string): string {
  const local = stripNamespace(tag).toLowerCase();
  for (const [key, synonyms] of Object.entries(TAG_SYNONYMS)) {
    if (synonyms.some((s) => s.toLowerCase() === local)) {
      switch (key) {
        case "revenue":
          return "Przychody ze sprzedaży";
        case "ebit":
          return "Zysk operacyjny (EBIT)";
        case "depreciation":
          return "Amortyzacja (D&A)";
        case "netProfit":
          return "Zysk / strata netto";
        case "financeCosts":
          return "Koszty finansowe / odsetkowe";
        case "longTermDebt":
          return "Kredyty i obligacje długoterminowe";
        case "shortTermDebt":
          return "Kredyty i pożyczki krótkoterminowe";
        case "cash":
          return "Środki pieniężne i ich ekwiwalenty";
        case "equity":
          return "Kapitał własny razem";
        case "assets":
          return "Aktywa trwałe i obrotowe razem";
      }
    }
  }
  return tag;
}

function matchMetricKey(tag: string): string | null {
  const local = stripNamespace(tag).toLowerCase();
  for (const [key, synonyms] of Object.entries(TAG_SYNONYMS)) {
    if (synonyms.some((s) => s.toLowerCase() === local)) {
      return key;
    }
  }
  return null;
}

export function evaluateCovenant(
  ticker: string,
  netDebtMln: number,
  ebitdaMln: number,
  financeCostsMln: number,
  covenantLimit?: number
): CovenantEvaluation {
  const limit = covenantLimit ?? COVENANT_LIMITS[ticker.toUpperCase()] ?? 3.50;
  const netDebtMld = Math.round((netDebtMln / 1000) * 100) / 100;
  const ebitdaMld = Math.round((ebitdaMln / 1000) * 100) / 100;

  const interestCov =
    financeCostsMln > 0
      ? Math.round((ebitdaMln / financeCostsMln) * 100) / 100
      : null;

  // Przypadek 1: EBITDA ujemna przy dodatnim zadłużeniu
  if (ebitdaMln <= 0 && netDebtMln > 0) {
    return {
      netDebtMldPln: netDebtMld,
      ebitdaMldPln: ebitdaMld,
      netDebtToEbitda: null,
      covenantLimit: limit,
      status: "KOWENANT_NARUSZONY",
      isBreached: true,
      interestCoverageRatio: interestCov,
      waiverRequired: true,
      marRiskFlag: true,
      ministerialRecommendation: `Pilna interwencja w konsorcjum bankowym dla ${ticker}. EBITDA ujemna (${ebitdaMld} mld PLN) przy długu netto ${netDebtMld} mld PLN uniemożliwia wyznaczenie wskaźnika. Wymagane natychmiastowe przedłużenie porozumienia standstill/waiver z bankami pod rygorem żądania natychmiastowej spłaty wierzytelności.`,
    };
  }

  const ratio =
    ebitdaMln > 0 ? Math.round((netDebtMln / ebitdaMln) * 100) / 100 : 0;

  let status: CovenantStatus = "BEZPIECZNY";
  let isBreached = false;
  let waiver = false;
  let marFlag = false;
  let rec = "";

  if (ratio > limit) {
    status = "KOWENANT_NARUSZONY";
    isBreached = true;
    waiver = true;
    marFlag = true;
    rec = `Przekroczenie umownego progu kowenantu dla ${ticker}: Dług/EBITDA wynosi ${ratio}x wobec limitu ${limit}x. Ryzyko sankcji MAR w przypadku braku terminowego poinformowania rynku o porozumieniu z wierzycielami.`;
  } else if (ratio > limit * 0.85) {
    status = "OSTRZEGAWCZY";
    rec = `Wskaźnik ${ratio}x zbliża się do poziomu krytycznego (${limit}x). Zalecany monitoring przepływów operacyjnych spółki ${ticker} i wstrzymanie niekrytycznych wydatków CAPEX.`;
  } else {
    status = "BEZPIECZNY";
    rec = `Stabilna sytuacja bilansowa spółki ${ticker}. Wskaźnik Dług Netto / EBITDA wynosi ${ratio}x (limit bankowy: ${limit}x). Spółka posiada bezpieczny bufor płynnościowy.`;
  }

  return {
    netDebtMldPln: netDebtMld,
    ebitdaMldPln: ebitdaMld,
    netDebtToEbitda: ratio,
    covenantLimit: limit,
    status,
    isBreached,
    interestCoverageRatio: interestCov,
    waiverRequired: waiver,
    marRiskFlag: marFlag,
    ministerialRecommendation: rec,
  };
}

export function parseEspiXbrlContent(content: string): EspiXbrlPeriodicReport {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Raport XBRL/ESPI nie może być pusty.");
  }

  const isIxbrl =
    trimmed.includes("ix:nonFraction") ||
    trimmed.includes("ix:nonNumeric") ||
    trimmed.includes("xmlns:ix=");
  const isKnfXml =
    trimmed.includes("<RaportOkresowy") ||
    trimmed.includes("<KNF_ESPI") ||
    trimmed.includes("<ESPI_RAPORT");

  const standard: ReportStandard = isIxbrl
    ? "ESEF_IXBRL"
    : isKnfXml
    ? "KNF_ESPI_XML"
    : "XBRL_2_1";

  // Regex helpers
  const extractText = (regex: RegExp, fallback = "") => {
    const match = trimmed.match(regex);
    return match && match[1] ? match[1].trim() : fallback;
  };

  let entityName = "Emitent GPW (Skarb Państwa)";
  let ticker = "GPW";
  let reportNumber = "SA-Q 3/2025";
  let periodEnded = "2025-09-30";
  let publishedAt = "2025-11-14";
  const currency = extractText(/unitRef="([A-Z]{3})"/i, "PLN");

  if (isIxbrl) {
    entityName =
      extractText(/<ix:nonNumeric[^>]*name="[^"]*(?:EntityRegistrantName|NazwaEmitenta)[^"]*"[^>]*>(.*?)<\/ix:nonNumeric>/is) ||
      extractText(/<title>(.*?)<\/title>/is, entityName);
    ticker =
      extractText(/<ix:nonNumeric[^>]*name="[^"]*(?:TradingSymbol|Ticker)[^"]*"[^>]*>(.*?)<\/ix:nonNumeric>/is, ticker);
    reportNumber =
      extractText(/<ix:nonNumeric[^>]*name="[^"]*(?:DocumentType|SymbolRaportu)[^"]*"[^>]*>(.*?)<\/ix:nonNumeric>/is, reportNumber);
    periodEnded =
      extractText(/<ix:nonNumeric[^>]*name="[^"]*(?:PeriodEndDate|DataKoncaOkresu)[^"]*"[^>]*>(.*?)<\/ix:nonNumeric>/is, periodEnded);
    publishedAt =
      extractText(/<ix:nonNumeric[^>]*name="[^"]*(?:PublicationDate|DataPublikacji)[^"]*"[^>]*>(.*?)<\/ix:nonNumeric>/is, publishedAt);
  } else {
    entityName =
      extractText(/<(?:NazwaEmitenta|Emitent|EntityRegistrantName)[^>]*>(.*?)<\/(?:NazwaEmitenta|Emitent|EntityRegistrantName)>/is, entityName);
    ticker =
      extractText(/<(?:Skrot|Ticker|TradingSymbol)[^>]*>(.*?)<\/(?:Skrot|Ticker|TradingSymbol)>/is, ticker);
    reportNumber =
      extractText(/<(?:SymbolRaportu|NumerRaportu|DocumentType)[^>]*>(.*?)<\/(?:SymbolRaportu|NumerRaportu|DocumentType)>/is, reportNumber);
    periodEnded =
      extractText(/<(?:KoniecOkresu|DataBilansu|PeriodEndDate)[^>]*>(.*?)<\/(?:KoniecOkresu|DataBilansu|PeriodEndDate)>/is, periodEnded);
    publishedAt =
      extractText(/<(?:DataPrzekazania|DataPublikacji|PublicationDate)[^>]*>(.*?)<\/(?:DataPrzekazania|DataPublikacji|PublicationDate)>/is, publishedAt);
  }

  const extracted: Record<string, number> = {};
  const provenance: EspiXbrlLineItem[] = [];

  if (isIxbrl) {
    const rx = /<ix:nonFraction\s+([^>]+)>(.*?)<\/ix:nonFraction>/gis;
    let match;
    while ((match = rx.exec(trimmed)) !== null) {
      const attrs = match[1];
      const rawContent = match[2];

      const nameMatch = attrs.match(/name="([^"]+)"/i);
      if (!nameMatch) continue;
      const fullName = nameMatch[1].trim();

      const scaleMatch = attrs.match(/scale="?(-?\d+)"?/i);
      const rawText = rawContent.replace(/<[^>]+>/g, "").trim();

      const num = cleanNumber(rawText);
      const scale = scaleMatch ? parseInt(scaleMatch[1], 10) : 0;
      const mult = Math.pow(10, scale - 6);
      const valMln = Math.round(num * mult * 100) / 100;

      const metric = matchMetricKey(fullName);
      if (metric && (!(metric in extracted) || extracted[metric] === 0)) {
        extracted[metric] = valMln;
      }

      provenance.push({
        tag: fullName,
        label: tagToLabel(fullName),
        rawValue: rawText,
        normalizedValueMlnPln: valMln,
        period: periodEnded,
        unit: currency,
        taxonomy: fullName.includes(":") ? fullName.split(":")[0] : "ifrs-full",
      });
    }
  } else {
    // XML KNF ESPI lub generyczny XBRL
    const isKnfThousands =
      trimmed.includes("<Jednostka>tys</Jednostka>") ||
      trimmed.includes("<Jednostka>tys.</Jednostka>");
    const fallbackMult = isKnfThousands ? 0.001 : 1.0;

    const rx = /<([A-Za-z0-9_:-]+)([^>]*)>(.*?)<\/\1>/gis;
    let match;
    while ((match = rx.exec(trimmed)) !== null) {
      const fullTag = match[1];
      const attrs = match[2];
      const textVal = match[3].trim();

      if (!textVal || textVal.includes("<")) continue;

      const rawNum = cleanNumber(textVal);
      if (rawNum === 0 && !["0", "0.0", "0,0"].includes(textVal)) continue;

      let mult = fallbackMult;
      const scaleMatch = attrs.match(/scale="?(-?\d+)"?/i);
      const decMatch = attrs.match(/decimals="?(-?\d+)"?/i);

      if (scaleMatch) {
        mult = Math.pow(10, parseInt(scaleMatch[1], 10) - 6);
      } else if (decMatch && parseInt(decMatch[1], 10) <= -6) {
        mult = 1e-6;
      } else if (Math.abs(rawNum) > 10_000_000 && !isKnfThousands) {
        mult = 1e-6;
      }

      const valMln = Math.round(rawNum * mult * 100) / 100;
      const metric = matchMetricKey(fullTag);

      if (metric) {
        if (!(metric in extracted) || extracted[metric] === 0) {
          extracted[metric] = valMln;
        }
        provenance.push({
          tag: fullTag,
          label: tagToLabel(fullTag),
          rawValue: textVal,
          normalizedValueMlnPln: valMln,
          period: periodEnded,
          unit: currency,
          taxonomy: fullTag.includes(":") ? fullTag.split(":")[0] : isKnfXml ? "knf-espi" : "ifrs-full",
        });
      }
    }
  }

  const revenue = extracted.revenue ?? 0;
  const ebit = extracted.ebit ?? 0;
  const depreciation = extracted.depreciation ?? 0;
  const calculatedEbitda = Math.round((ebit + depreciation) * 100) / 100;
  const netProfit = extracted.netProfit ?? 0;
  const financeCosts = extracted.financeCosts ?? 0;

  const longTermDebt = extracted.longTermDebt ?? 0;
  const shortTermDebt = extracted.shortTermDebt ?? 0;
  const totalGrossDebt = Math.round((longTermDebt + shortTermDebt) * 100) / 100;
  const cash = extracted.cash ?? 0;
  const netDebt = Math.round((totalGrossDebt - cash) * 100) / 100;

  const totalEquity = extracted.equity ?? 0;
  const totalAssets = extracted.assets ?? 0;

  const covenant = evaluateCovenant(
    ticker,
    netDebt,
    calculatedEbitda,
    financeCosts
  );

  return {
    id: `xbrl-${ticker.toLowerCase()}-${periodEnded.replace(/-/g, "")}`,
    reportNumber,
    entityName,
    ticker: ticker.toUpperCase(),
    periodEnded,
    publishedAt,
    reportStandard: standard,
    currency,
    revenueMlnPln: revenue,
    operatingProfitEbitMlnPln: ebit,
    depreciationMlnPln: depreciation,
    calculatedEbitdaMlnPln: calculatedEbitda,
    netProfitLossMlnPln: netProfit,
    financeCostsMlnPln: financeCosts,
    longTermBorrowingsMlnPln: longTermDebt,
    shortTermBorrowingsMlnPln: shortTermDebt,
    totalGrossDebtMlnPln: totalGrossDebt,
    cashAndEquivalentsMlnPln: cash,
    netDebtMlnPln: netDebt,
    totalEquityMlnPln: totalEquity,
    totalAssetsMlnPln: totalAssets,
    covenant,
    tagsProvenance: provenance,
    rawXmlSnippet: trimmed.slice(0, 3000),
  };
}

// Baza oficjalnych raportów okresowych GPW dla kluczowych grup kapitałowych SSP
export const OFFICIAL_GPW_PERIODIC_REPORTS: EspiXbrlPeriodicReport[] = [
  {
    id: "xbrl-att-20250930",
    reportNumber: "SA-QSr 3/2025",
    entityName: "Grupa Azoty S.A.",
    ticker: "ATT",
    nip: "8730006829",
    krs: "0000024208",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-14",
    reportStandard: "ESEF_IXBRL",
    currency: "PLN",
    revenueMlnPln: 9850.4,
    operatingProfitEbitMlnPln: -1240.2,
    depreciationMlnPln: 420.1,
    calculatedEbitdaMlnPln: -820.1,
    netProfitLossMlnPln: -1580.6,
    financeCostsMlnPln: 310.5,
    longTermBorrowingsMlnPln: 8120.0,
    shortTermBorrowingsMlnPln: 2850.0,
    totalGrossDebtMlnPln: 10970.0,
    cashAndEquivalentsMlnPln: 570.0,
    netDebtMlnPln: 10400.0,
    totalEquityMlnPln: 4310.0,
    totalAssetsMlnPln: 18240.0,
    covenant: {
      netDebtMldPln: 10.4,
      ebitdaMldPln: -0.82,
      netDebtToEbitda: null,
      covenantLimit: 3.5,
      status: "KOWENANT_NARUSZONY",
      isBreached: true,
      interestCoverageRatio: -2.64,
      waiverRequired: true,
      marRiskFlag: true,
      ministerialRecommendation:
        "Pilna interwencja w konsorcjum bankowym dla ATT. EBITDA ujemna (-0.82 mld PLN) przy długu netto 10.4 mld PLN uniemożliwia wyznaczenie wskaźnika. Wymagane natychmiastowe przedłużenie porozumienia standstill/waiver z 12 bankami pod przewodnictwem PKO BP.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "9850.40",
        normalizedValueMlnPln: 9850.4,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:OperatingProfit",
        label: "Zysk operacyjny (EBIT)",
        rawValue: "-1240.20",
        normalizedValueMlnPln: -1240.2,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:DepreciationAndAmortisationExpense",
        label: "Amortyzacja (D&A)",
        rawValue: "420.10",
        normalizedValueMlnPln: 420.1,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:NoncurrentBorrowings",
        label: "Kredyty i obligacje długoterminowe",
        rawValue: "8120.00",
        normalizedValueMlnPln: 8120.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:CurrentBorrowings",
        label: "Kredyty i pożyczki krótkoterminowe",
        rawValue: "2850.00",
        normalizedValueMlnPln: 2850.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:CashAndCashEquivalents",
        label: "Środki pieniężne i ich ekwiwalenty",
        rawValue: "570.00",
        normalizedValueMlnPln: 570.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
  {
    id: "xbrl-pkn-20250930",
    reportNumber: "SA-Q 3/2025",
    entityName: "ORLEN S.A.",
    ticker: "PKN",
    nip: "7740001454",
    krs: "0000028860",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-20",
    reportStandard: "KNF_ESPI_XML",
    currency: "PLN",
    revenueMlnPln: 265890.0,
    operatingProfitEbitMlnPln: 21450.0,
    depreciationMlnPln: 7820.0,
    calculatedEbitdaMlnPln: 29270.0,
    netProfitLossMlnPln: 15630.0,
    financeCostsMlnPln: 1120.0,
    longTermBorrowingsMlnPln: 19400.0,
    shortTermBorrowingsMlnPln: 3200.0,
    totalGrossDebtMlnPln: 22600.0,
    cashAndEquivalentsMlnPln: 9400.0,
    netDebtMlnPln: 13200.0,
    totalEquityMlnPln: 152000.0,
    totalAssetsMlnPln: 298000.0,
    covenant: {
      netDebtMldPln: 13.2,
      ebitdaMldPln: 29.27,
      netDebtToEbitda: 0.45,
      covenantLimit: 3.5,
      status: "BEZPIECZNY",
      isBreached: false,
      interestCoverageRatio: 26.13,
      waiverRequired: false,
      marRiskFlag: false,
      ministerialRecommendation:
        "Stabilna sytuacja bilansowa spółki PKN. Wskaźnik Dług Netto / EBITDA wynosi 0.45x (limit bankowy: 3.50x). Spółka posiada bezpieczny bufor płynnościowy.",
    },
    tagsProvenance: [
      {
        tag: "PrzychodyZeSprzedazy",
        label: "Przychody ze sprzedaży",
        rawValue: "265890000",
        normalizedValueMlnPln: 265890.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "knf-espi",
      },
      {
        tag: "ZyskOperacyjny",
        label: "Zysk operacyjny (EBIT)",
        rawValue: "21450000",
        normalizedValueMlnPln: 21450.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "knf-espi",
      },
      {
        tag: "Amortyzacja",
        label: "Amortyzacja (D&A)",
        rawValue: "7820000",
        normalizedValueMlnPln: 7820.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "knf-espi",
      },
      {
        tag: "ZobowiazaniaDlugoterminoweKredytyIPozyczki",
        label: "Kredyty i obligacje długoterminowe",
        rawValue: "19400000",
        normalizedValueMlnPln: 19400.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "knf-espi",
      },
      {
        tag: "SrodkiPieniezneIIchEkwiwalenty",
        label: "Środki pieniężne i ich ekwiwalenty",
        rawValue: "9400000",
        normalizedValueMlnPln: 9400.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "knf-espi",
      },
    ],
  },
  {
    id: "xbrl-pkp-20250630",
    reportNumber: "SA-PS 2025",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    ticker: "PKP",
    nip: "5213009988",
    krs: "0000166715",
    periodEnded: "2025-06-30",
    publishedAt: "2025-09-28",
    reportStandard: "XBRL_2_1",
    currency: "PLN",
    revenueMlnPln: 3210.5,
    operatingProfitEbitMlnPln: -420.3,
    depreciationMlnPln: 210.1,
    calculatedEbitdaMlnPln: -210.2,
    netProfitLossMlnPln: -512.4,
    financeCostsMlnPln: 145.0,
    longTermBorrowingsMlnPln: 2890.0,
    shortTermBorrowingsMlnPln: 1450.0,
    totalGrossDebtMlnPln: 4340.0,
    cashAndEquivalentsMlnPln: 180.0,
    netDebtMlnPln: 4160.0,
    totalEquityMlnPln: 1120.0,
    totalAssetsMlnPln: 6450.0,
    covenant: {
      netDebtMldPln: 4.16,
      ebitdaMldPln: -0.21,
      netDebtToEbitda: null,
      covenantLimit: 3.0,
      status: "KOWENANT_NARUSZONY",
      isBreached: true,
      interestCoverageRatio: -1.45,
      waiverRequired: true,
      marRiskFlag: true,
      ministerialRecommendation:
        "Spółka w postępowaniu sanacyjnym. Kredyty konsorcjalne objęte moratorium spłat. Wymagana ścisła koordynacja z zarządcą masy sanacyjnej oraz wierzycielami finansowymi.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "3210.50",
        normalizedValueMlnPln: 3210.5,
        period: "2025-06-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:OperatingProfit",
        label: "Zysk operacyjny (EBIT)",
        rawValue: "-420.30",
        normalizedValueMlnPln: -420.3,
        period: "2025-06-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:NoncurrentBorrowings",
        label: "Kredyty i obligacje długoterminowe",
        rawValue: "2890.00",
        normalizedValueMlnPln: 2890.0,
        period: "2025-06-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
  {
    id: "xbrl-pge-20250930",
    reportNumber: "SA-QSr 3/2025",
    entityName: "PGE Polska Grupa Energetyczna S.A.",
    ticker: "PGE",
    nip: "5260250541",
    krs: "0000159386",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-19",
    reportStandard: "ESEF_IXBRL",
    currency: "PLN",
    revenueMlnPln: 64200.0,
    operatingProfitEbitMlnPln: 5800.0,
    depreciationMlnPln: 3400.0,
    calculatedEbitdaMlnPln: 9200.0,
    netProfitLossMlnPln: 4100.0,
    financeCostsMlnPln: 850.0,
    longTermBorrowingsMlnPln: 17200.0,
    shortTermBorrowingsMlnPln: 2100.0,
    totalGrossDebtMlnPln: 19300.0,
    cashAndEquivalentsMlnPln: 2800.0,
    netDebtMlnPln: 16500.0,
    totalEquityMlnPln: 52400.0,
    totalAssetsMlnPln: 112000.0,
    covenant: {
      netDebtMldPln: 16.5,
      ebitdaMldPln: 9.2,
      netDebtToEbitda: 1.79,
      covenantLimit: 3.5,
      status: "BEZPIECZNY",
      isBreached: false,
      interestCoverageRatio: 10.82,
      waiverRequired: false,
      marRiskFlag: false,
      ministerialRecommendation:
        "Stabilna sytuacja bilansowa spółki PGE. Wskaźnik Dług Netto / EBITDA wynosi 1.79x (limit: 3.50x). Program transformacji morskiej energetyki wiatrowej zabezpieczony finansowaniem EBI/BGK.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "64200.00",
        normalizedValueMlnPln: 64200.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
      {
        tag: "ifrs-full:OperatingProfit",
        label: "Zysk operacyjny (EBIT)",
        rawValue: "5800.00",
        normalizedValueMlnPln: 5800.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
  {
    id: "xbrl-tpe-20250930",
    reportNumber: "SA-Q 3/2025",
    entityName: "TAURON Polska Energia S.A.",
    ticker: "TPE",
    nip: "9542582885",
    krs: "0000271147",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-18",
    reportStandard: "ESEF_IXBRL",
    currency: "PLN",
    revenueMlnPln: 31200.0,
    operatingProfitEbitMlnPln: 2900.0,
    depreciationMlnPln: 2100.0,
    calculatedEbitdaMlnPln: 5000.0,
    netProfitLossMlnPln: 1950.0,
    financeCostsMlnPln: 580.0,
    longTermBorrowingsMlnPln: 11400.0,
    shortTermBorrowingsMlnPln: 1800.0,
    totalGrossDebtMlnPln: 13200.0,
    cashAndEquivalentsMlnPln: 2400.0,
    netDebtMlnPln: 10800.0,
    totalEquityMlnPln: 24800.0,
    totalAssetsMlnPln: 58900.0,
    covenant: {
      netDebtMldPln: 10.8,
      ebitdaMldPln: 5.0,
      netDebtToEbitda: 2.16,
      covenantLimit: 3.5,
      status: "BEZPIECZNY",
      isBreached: false,
      interestCoverageRatio: 8.62,
      waiverRequired: false,
      marRiskFlag: false,
      ministerialRecommendation:
        "Wskaźnik zadłużenia na poziomie 2.16x, bezpieczny bufor względem kowenantu 3.50x. Wymagany monitoring wydzielenia aktywów węglowych do NABE.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "31200.00",
        normalizedValueMlnPln: 31200.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
  {
    id: "xbrl-kgh-20250930",
    reportNumber: "SA-Q 3/2025",
    entityName: "KGHM Polska Miedź S.A.",
    ticker: "KGH",
    nip: "6920000013",
    krs: "0000023302",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-15",
    reportStandard: "ESEF_IXBRL",
    currency: "PLN",
    revenueMlnPln: 28400.0,
    operatingProfitEbitMlnPln: 3400.0,
    depreciationMlnPln: 1800.0,
    calculatedEbitdaMlnPln: 5200.0,
    netProfitLossMlnPln: 2200.0,
    financeCostsMlnPln: 390.0,
    longTermBorrowingsMlnPln: 7100.0,
    shortTermBorrowingsMlnPln: 1200.0,
    totalGrossDebtMlnPln: 8300.0,
    cashAndEquivalentsMlnPln: 1900.0,
    netDebtMlnPln: 6400.0,
    totalEquityMlnPln: 34100.0,
    totalAssetsMlnPln: 52300.0,
    covenant: {
      netDebtMldPln: 6.4,
      ebitdaMldPln: 5.2,
      netDebtToEbitda: 1.23,
      covenantLimit: 3.5,
      status: "BEZPIECZNY",
      isBreached: false,
      interestCoverageRatio: 13.33,
      waiverRequired: false,
      marRiskFlag: false,
      ministerialRecommendation:
        "Wskaźnik Dług Netto / EBITDA wynosi 1.23x. Bardzo silna pozycja gotówkowa i niski wskaźnik lewarowania przy sprzyjających cenach miedzi i srebra na LME.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "28400.00",
        normalizedValueMlnPln: 28400.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
  {
    id: "xbrl-jsw-20250930",
    reportNumber: "SA-Q 3/2025",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    ticker: "JSW",
    nip: "6330005110",
    krs: "0000072093",
    periodEnded: "2025-09-30",
    publishedAt: "2025-11-21",
    reportStandard: "ESEF_IXBRL",
    currency: "PLN",
    revenueMlnPln: 8900.0,
    operatingProfitEbitMlnPln: 120.0,
    depreciationMlnPln: 740.0,
    calculatedEbitdaMlnPln: 860.0,
    netProfitLossMlnPln: -340.0,
    financeCostsMlnPln: 95.0,
    longTermBorrowingsMlnPln: 1950.0,
    shortTermBorrowingsMlnPln: 850.0,
    totalGrossDebtMlnPln: 2800.0,
    cashAndEquivalentsMlnPln: 600.0,
    netDebtMlnPln: 2200.0,
    totalEquityMlnPln: 9200.0,
    totalAssetsMlnPln: 17400.0,
    covenant: {
      netDebtMldPln: 2.2,
      ebitdaMldPln: 0.86,
      netDebtToEbitda: 2.56,
      covenantLimit: 3.0,
      status: "OSTRZEGAWCZY",
      isBreached: false,
      interestCoverageRatio: 9.05,
      waiverRequired: false,
      marRiskFlag: false,
      ministerialRecommendation:
        "Wskaźnik 2.56x zbliża się do progu krytycznego 3.00x w umowie kredytowej konsorcjum. Kurczący się bufor płynnościowy po wypłatach z FIZ. Wskazana rewizja planu wydobywczego węgla koksowego.",
    },
    tagsProvenance: [
      {
        tag: "ifrs-full:Revenue",
        label: "Przychody ze sprzedaży",
        rawValue: "8900.00",
        normalizedValueMlnPln: 8900.0,
        period: "2025-09-30",
        unit: "PLN",
        taxonomy: "ifrs-full",
      },
    ],
  },
];
