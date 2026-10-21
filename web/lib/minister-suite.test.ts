import { test } from "node:test";
import assert from "node:assert";
import {
  ALL_ENTITIES_REGISTRY,
  TOP_FIRE_ALERTS,
  KPRM_ONE_PAGER_DATA,
  PRE_PUBLICATION_AUDITS,
  MINISTER_IMPACT_BREAKDOWNS,
  NARRATIVE_SOURCES_MAP,
  MANDATE_EXPIRY_ALERTS,
  ARTICLE_19_COMPLIANCE_DATA,
  GOVERNANCE_SENTIMENT_HISTORY,
  DIVIDEND_PROJECTIONS_DATA,
  STRATEGIC_CAPEX_PROJECTS,
  INTER_MINISTERIAL_TRANSFERS,
  NIK_INSPECTION_RECOMMENDATIONS,
  VOIVODESHIP_REGIONAL_DATA,
  RISK_MATRIX_SCATTER_POINTS,
  SANKEY_FLOW_DATA,
  RADAR_SPIDER_PROFILES,
  GOVERNANCE_NETWORK_DATA,
  REPUTATION_WATERFALL_STEPS,
  CALENDAR_HEATMAP_DATA,
  STOCK_EXCHANGE_DATA,
  ESPI_REPORTS_DATA,
  ANALYST_CONSENSUS_DATA,
  LOCAL_MUNICIPAL_ISSUES,
  NATIONAL_ASSETS_PORTFOLIO_STATS,
  CRITICAL_INFRASTRUCTURE_SECTORS,
  AGM_VOTING_TEMPLATES,
  STRATEGIC_RESERVE_INDICATORS,
  FOREIGN_TAKEOVER_SHIELD_ENTITIES,
  DEBT_STABILITY_RECORDS,
  MORNING_CABINET_BRIEFING,
} from "./mapscope-data.ts";
import {
  OFFICIAL_GPW_PERIODIC_REPORTS,
  parseEspiXbrlContent,
  evaluateCovenant,
} from "./espi-xbrl-parser.ts";
import {
  getWebhookServiceState,
  processIncomingEspiWebhook,
} from "./espi-webhook-service.ts";
import { verifyHmacSignature } from "./espi-webhook-verifier.ts";
import crypto from "node:crypto";

test("1. Gabinet Ministra: Tarcza Sejmowa zawiera pancerne Q&A, czerwone linie i rozróżnienie genezy", () => {
  assert.ok(TOP_FIRE_ALERTS.length >= 5, "Pożary dnia muszą zawierać co najmniej 5 spraw strategicznych");

  for (const alert of TOP_FIRE_ALERTS) {
    assert.ok(alert.attribution, `Alert ${alert.id} musi mieć atrybucję genezy politycznej`);
    assert.ok(
      ["nasza_odpowiedzialnosc", "zaszlosc_historyczna", "miedzyresortowa"].includes(alert.attribution),
      `Alert ${alert.id} posiada nieprawidłowy typ atrybucji`
    );
    assert.ok((alert.ministerImpactScore ?? 0) > 0, `Alert ${alert.id} musi mieć wskaźnik rykoszetu w MAP`);

    if (alert.sejmQnA && alert.sejmQnA.length > 0) {
      for (const qna of alert.sejmQnA) {
        assert.ok(qna.question.length > 10, "Pytanie sejmowe musi być konkretne");
        assert.ok(qna.source.length > 0, "Pytanie musi mieć źródło");
        assert.ok(qna.hardFacts.length > 10, "Musi zawierać twarde fakty");
        assert.ok(qna.recommendedAnswer.length > 10, "Musi zawierać zalecaną linię obrony resortu");
        assert.ok(qna.redLines.length > 10, "Musi zawierać czerwone linie (czego nie mówić)");
      }
    }
  }

  // Weryfikacja Totalizatora jako naszej odpowiedzialności
  const totalizator = TOP_FIRE_ALERTS.find((a) => a.entityId === "e-totalizator");
  assert.strictEqual(totalizator?.attribution, "nasza_odpowiedzialnosc");
  assert.strictEqual(totalizator?.ministerImpactScore, 92);

  // Weryfikacja PKP Cargo jako zaszłości historycznej
  const cargo = TOP_FIRE_ALERTS.find((a) => a.entityId === "e-pkp-cargo");
  assert.strictEqual(cargo?.attribution, "zaszlosc_historyczna");
});

test("2. Gabinet Ministra: KPRM One-Pager dla Premiera zawiera 4 kategorie decyzyjne i bilans restrukturyzacji", () => {
  assert.ok(KPRM_ONE_PAGER_DATA.title.includes("Prezesa Rady Ministrów"));
  assert.ok(KPRM_ONE_PAGER_DATA.executiveSummary.length > 100);
  assert.strictEqual(KPRM_ONE_PAGER_DATA.items.length, 4);

  const categories = KPRM_ONE_PAGER_DATA.items.map((i) => i.category);
  assert.ok(categories.includes("pozar_wygaszony"));
  assert.ok(categories.includes("sukces"));
  assert.ok(categories.includes("ryzyko_miedzyresortowe"));
  assert.ok(categories.includes("decyzja_premiera"));

  assert.ok(KPRM_ONE_PAGER_DATA.restructuringProgress.length >= 3);
  for (const prog of KPRM_ONE_PAGER_DATA.restructuringProgress) {
    assert.ok(prog.entityName.length > 0);
    assert.ok(prog.targetSavings.length > 0);
    assert.ok(prog.headcountChange.length > 0);
  }
});

test("3. Szef Komunikacji: Symulator Przedpublikacyjny i ocena rykoszetu w Ministra", () => {
  assert.ok(PRE_PUBLICATION_AUDITS.length >= 3);

  const redAudit = PRE_PUBLICATION_AUDITS.find((a) => a.verdict === "red");
  assert.ok(redAudit, "Musi istnieć oświadczenie o werdykcie krytycznym");
  assert.ok(redAudit.riskHighlights.length > 0);
  assert.ok(redAudit.improvedVersion.length > 20);

  const greenAudit = PRE_PUBLICATION_AUDITS.find((a) => a.verdict === "green");
  assert.ok(greenAudit, "Musi istnieć oświadczenie bezpieczne");

  // Weryfikacja wektorów rykoszetu
  assert.ok(MINISTER_IMPACT_BREAKDOWNS.length >= 4);
  for (const imp of MINISTER_IMPACT_BREAKDOWNS) {
    assert.ok(imp.impactScorePercent > 0 && imp.impactScorePercent <= 100);
    assert.ok(imp.attackVectors.length > 0);
    assert.ok(imp.mitigationStrategy.length > 20);
  }

  // Weryfikacja matrycy źródeł narracji
  const totalizatorSources = NARRATIVE_SOURCES_MAP["e-totalizator"];
  assert.ok(totalizatorSources);
  const sumPercent =
    totalizatorSources.oppositionPoliticiansPercent +
    totalizatorSources.laborUnionsPercent +
    totalizatorSources.regionalMediaPercent +
    totalizatorSources.nationalMediaPercent +
    totalizatorSources.financialAnalystsPercent;
  assert.strictEqual(sumPercent, 100, "Suma udziałów inicjatorów narracji musi wynosić 100%");
});

test("4. Ład Korporacyjny: Zegar Kadencyjny, Art. 19 i Korelacja Zmian Władz", () => {
  assert.ok(MANDATE_EXPIRY_ALERTS.length >= 5);
  const quorumRisks = MANDATE_EXPIRY_ALERTS.filter((m) => m.quorumLossRisk);
  assert.ok(quorumRisks.length >= 2, "Co najmniej 2 spółki muszą mieć wykryte ryzyko paraliżu/utraty kworum");

  assert.ok(ARTICLE_19_COMPLIANCE_DATA.length >= 5);
  const nonCompliant = ARTICLE_19_COMPLIANCE_DATA.filter((a) => a.complianceStatus === "niezgodny");
  assert.ok(nonCompliant.length >= 1, "Musi być zidentyfikowany kandydat do natychmiastowego odwołania");

  assert.ok(GOVERNANCE_SENTIMENT_HISTORY.length >= 4);
  for (const g of GOVERNANCE_SENTIMENT_HISTORY) {
    assert.ok(g.crisisDropPercent > 0);
    assert.ok(g.sentimentAfter > g.sentimentBefore, "Sentyment po zmianie zarządu musi ulec poprawie");
  }
});

test("5. Centrum Zestawień: Projekcja Dywidend do Budżetu, Radar CAPEX i Transfery", () => {
  // Projekcja dywidend
  assert.ok(DIVIDEND_PROJECTIONS_DATA.length >= 6);
  const totalBudgetDividends = DIVIDEND_PROJECTIONS_DATA.reduce(
    (acc, p) => acc + p.projectedBudgetRevenueMln,
    0
  );
  assert.ok(totalBudgetDividends > 4000, "Łączna suma dywidend do budżetu musi przekraczać 4 mld zł");

  // Radar Megaprojektów CAPEX
  assert.ok(STRATEGIC_CAPEX_PROJECTS.length >= 5);
  const olefiny = STRATEGIC_CAPEX_PROJECTS.find((p) => p.name.includes("Olefiny"));
  assert.ok(olefiny);
  assert.strictEqual(olefiny.totalBudgetMln, 25000);
  assert.strictEqual(olefiny.status, "krytyczne_ryzyko_odpisu");

  // Transfery międzyresortowe
  assert.ok(INTER_MINISTERIAL_TRANSFERS.length >= 4);
  const pgg = INTER_MINISTERIAL_TRANSFERS.find((t) => t.entityName.includes("Polska Grupa Górnicza"));
  assert.ok(pgg);
  assert.strictEqual(pgg.targetAuthority, "Minister Przemysłu");
});

test("6. Dane Wewnętrzne: Wystąpienia pokontrolne NIK z linią obrony Ministra", () => {
  assert.ok(NIK_INSPECTION_RECOMMENDATIONS.length >= 4);
  for (const nik of NIK_INSPECTION_RECOMMENDATIONS) {
    assert.ok(nik.inspectionNumber.length > 5);
    assert.ok(nik.recommendationSummary.length > 20);
    assert.ok(nik.ministerDefensePoint.length > 20, "Musi zawierać gotową linię obrony na komisję");
    assert.ok(["wdrozone", "w_trakcie", "przeterminowane"].includes(nik.status));
  }
});

test("7. Katalog 406 SSP & Dossier 360°: Grupy holdingowe, uśpiona likwidacja, fiszka 10s i spory", () => {
  assert.strictEqual(ALL_ENTITIES_REGISTRY.length, 406, "Musi zachować 100% przekrój 406 podmiotów");

  // Weryfikacja grup holdingowych
  const holdings = ALL_ENTITIES_REGISTRY.filter((e) => (e.subsidiary_count || 0) > 0);
  assert.ok(holdings.length >= 6, "Musi zidentyfikować co najmniej 6 holdingów państwowych");
  const orlen = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-orlen");
  assert.strictEqual(orlen?.subsidiary_count, 38);
  assert.ok(orlen?.subsidiaries && orlen.subsidiaries.length >= 4);

  // Weryfikacja uśpionej likwidacji z nieruchomościami
  const dormant = ALL_ENTITIES_REGISTRY.filter((e) => e.is_dormant_liquidation);
  assert.ok(dormant.length >= 50, "Wszystkie podmioty w likwidacji/upadłości muszą być oznaczone");
  for (const d of dormant.slice(0, 10)) {
    assert.ok((d.dormant_years ?? 0) >= 3);
    assert.strictEqual(d.has_real_estate, true);
  }

  // Weryfikacja Fiszki Ministra w Dossier 360°
  assert.ok(totalizatorDossierBriefing(), "Totalizator musi mieć kompletną Fiszkę Ministra");
  assert.ok(azotyStrategicLitigations(), "Grupa Azoty musi mieć strategiczne spory arbitrażowe > 20 mln zł");
});

function totalizatorDossierBriefing(): boolean {
  const tot = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-totalizator");
  const mb = tot?.dossier?.ministerBriefing;
  if (!mb) return false;
  return (
    mb.threeNumbers.length === 3 &&
    mb.statusSummary.length > 10 &&
    mb.defensiveTalkingPoint.length > 10 &&
    mb.keyRiskThisWeek.length > 10
  );
}

function azotyStrategicLitigations(): boolean {
  const azoty = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-azoty");
  const lits = azoty?.dossier?.strategicLitigations;
  if (!lits || lits.length === 0) return false;
  return lits.some((l) => l.valueMlnPln > 500 && l.opponent.includes("Hyundai"));
}

test("8. Pakiet Zaawansowanych Wizualizacji: 7 wykresów i kartogramów instytucjonalnych", () => {
  // 1. Geolokalizacja: 16 województw
  assert.strictEqual(VOIVODESHIP_REGIONAL_DATA.length, 16, "Musi obejmować dokładnie 16 województw");
  const slask = VOIVODESHIP_REGIONAL_DATA.find((v) => v.id === "slaskie");
  assert.strictEqual(slask?.riskStatus, "krytyczny");
  assert.ok((slask?.strikeAlertsCount ?? 0) >= 3, "Śląskie musi mieć zarejestrowane ogniska sporów");

  // 2. Kwadrantowa macierz 2D
  assert.ok(RISK_MATRIX_SCATTER_POINTS.length >= 10, "Macierz musi pozycjonować kluczowe spółki portfela");
  const redZone = RISK_MATRIX_SCATTER_POINTS.filter((p) => p.quadrant === "czerwona_strefa_kprm");
  assert.ok(redZone.length >= 4, "W czerwonej strefie KPRM muszą znaleźć się m.in. Orlen, PKP Cargo, Poczta i Totalizator");

  // 3. Diagram Sankeya: 18,4B PLN
  assert.strictEqual(SANKEY_FLOW_DATA.nodes.length, 7);
  assert.strictEqual(SANKEY_FLOW_DATA.links.length, 6);
  const totalProfitNode = SANKEY_FLOW_DATA.nodes.find((n) => n.id === "total_profit");
  assert.strictEqual(totalProfitNode?.value, 18.40);
  const budgetLink = SANKEY_FLOW_DATA.links.find((l) => l.target === "state_budget");
  assert.strictEqual(budgetLink?.value, 4.12);

  // 4. Radar 360° dojrzałości
  const orlenRadar = RADAR_SPIDER_PROFILES["e-orlen"];
  assert.ok(orlenRadar && orlenRadar.aggregateMaturity >= 80, "Orlen musi mieć wysoką dojrzałość zarządczą");
  const cargoRadar = RADAR_SPIDER_PROFILES["e-pkp-cargo"];
  assert.strictEqual(cargoRadar?.status, "alarmowa");

  // 5. Graf powiązań personalnych Art. 19a
  const violationNode = GOVERNANCE_NETWORK_DATA.nodes.find((n) => n.art19ViolationRisk);
  assert.ok(violationNode, "Musi zidentyfikować ryzyko wieloetatowości w radach SP");

  // 6. Wodospad wizerunkowy MAP
  assert.strictEqual(REPUTATION_WATERFALL_STEPS.length, 8);
  const netStep = REPUTATION_WATERFALL_STEPS[REPUTATION_WATERFALL_STEPS.length - 1];
  assert.strictEqual(netStep.cumulative, 68);

  // 7. Kalendarzowa mapa cieplna
  assert.ok(CALENDAR_HEATMAP_DATA.length >= 290, "Musi pokrywać kalendarz roczny 2026");
  const criticalDay = CALENDAR_HEATMAP_DATA.find((d) => d.date === "2026-10-20");
  assert.strictEqual(criticalDay?.intensity, 4);
});

test("9. Giełda GPW, Relacje Inwestorskie ESPI/EBI i Radar Samorządowy", () => {
  // Notowania GPW
  assert.ok(STOCK_EXCHANGE_DATA.length >= 8, "Musi monitorować co najmniej 8 flagowych spółek giełdowych SP");
  const orlenStock = STOCK_EXCHANGE_DATA.find((s) => s.ticker === "PKN");
  assert.ok(orlenStock && orlenStock.marketCapMldPln > 70);
  assert.ok(orlenStock.stateShareValueMldPln > 30);

  // Raporty ESPI z flagą MAR
  assert.ok(ESPI_REPORTS_DATA.length >= 5, "Musi zawierać rejestr raportów bieżących");
  const marAlerts = ESPI_REPORTS_DATA.filter((r) => r.isMarRiskFlag);
  assert.ok(marAlerts.length >= 2, "Musi zidentyfikować raporty niosące ryzyko naruszenia MAR (np. PKP Cargo, Azoty)");

  // Konsensus analityków
  assert.ok(ANALYST_CONSENSUS_DATA.length >= 5);
  const pkoConsensus = ANALYST_CONSENSUS_DATA.find((c) => c.entityTicker === "PKO");
  assert.ok(pkoConsensus && pkoConsensus.buyCount >= 7);

  // Spory samorządowe i podatki lokalne
  assert.ok(LOCAL_MUNICIPAL_ISSUES.length >= 5);
  const kleszczow = LOCAL_MUNICIPAL_ISSUES.find((i) => i.municipalityName.includes("Kleszczów"));
  assert.ok(kleszczow && kleszczow.financialImpactMlnPln >= 70);
  const monocultures = LOCAL_MUNICIPAL_ISSUES.filter((i) => i.countyWorkforceSharePercent > 25);
  assert.ok(monocultures.length >= 3, "Musi wykryć monokultury zatrudnienia powyżej 25% rynku pracy powiatu");
});

test("10. Ranga Państwowa: Wycena Majątku Narodowego, Infrastruktura Krytyczna CHARLIE-CRP i Mandaty WZ/NWZ", () => {
  // Wycena portfela majątku państwowego
  assert.strictEqual(NATIONAL_ASSETS_PORTFOLIO_STATS.totalEntitiesCount, 406, "Musi pokrywać 100% 406 spółek Skarbu Państwa");
  assert.ok(NATIONAL_ASSETS_PORTFOLIO_STATS.totalPortfolioValueMldPln > 350, "Wartość majątku musi przekraczać 350 mld PLN");
  assert.ok(NATIONAL_ASSETS_PORTFOLIO_STATS.totalWorkforceCount > 400000, "Zatrudnienie w portfelu SSP musi przekraczać 400 tys. pracowników");
  assert.ok(NATIONAL_ASSETS_PORTFOLIO_STATS.annualAggregateRevenueMldPln > 450, "Zagregowane przychody muszą przekraczać 450 mld PLN");

  // Infrastruktura krytyczna i reżim CHARLIE-CRP
  assert.strictEqual(CRITICAL_INFRASTRUCTURE_SECTORS.length, 4, "Musi obejmować 4 kluczowe sektory infrastruktury krytycznej");
  const energyCrit = CRITICAL_INFRASTRUCTURE_SECTORS.find((c) => c.id === "crit-energy");
  assert.strictEqual(energyCrit?.alertLevel, "CHARLIE_CRP");
  assert.ok((energyCrit?.cyberAttacksBlocked24h ?? 0) > 1000, "Musi rejestrować zablokowane ataki cybernetyczne");

  // Generator instrukcji głosowania na Walne Zgromadzenia (WZ/NWZ)
  assert.ok(AGM_VOTING_TEMPLATES.length >= 4, "Musi zawierać szablony mandatów dla kluczowych spółek");
  const orlenMandate = AGM_VOTING_TEMPLATES.find((m) => m.ticker === "PKN");
  assert.strictEqual(orlenMandate?.recommendedVote, "PRZECIW", "Brak absolutorium dla byłego zarządu Orlenu");
  assert.ok(orlenMandate.redLineConstraint.includes("Bezwzględny zakaz"), "Musi zawierać czerwoną linię dla pełnomocnika");

  const pkoMandate = AGM_VOTING_TEMPLATES.find((m) => m.ticker === "PKOBP");
  assert.strictEqual(pkoMandate?.recommendedVote, "ZA", "Poparcie uchwały dywidendowej PKO BP");
});

test("11. Pakiet High-Level: Suwerenność Rezerw, Tarcza Wrogiego Przejęcia, Kowenanty Dłużne i Audio-Brief 90s", () => {
  // 1. Radar Suwerenności i Rezerw Strategicznych
  assert.ok(STRATEGIC_RESERVE_INDICATORS.length >= 5, "Musi monitorować co najmniej 5 strategicznych wskaźników rezerw");
  const fuelRes = STRATEGIC_RESERVE_INDICATORS.find((r) => r.category === "PALIWA_ROPA");
  assert.ok(fuelRes && fuelRes.currentLevelValue >= 90, "Rezerwy paliw muszą spełniać standard min. 90 dni");
  const gasRes = STRATEGIC_RESERVE_INDICATORS.find((r) => r.category === "GAZ_ZIEMNY");
  assert.ok(gasRes && gasRes.currentLevelValue === 100, "Magazyny gazu muszą być zapełnione w 100%");
  const fertRes = STRATEGIC_RESERVE_INDICATORS.find((r) => r.category === "AMONIAK_NAWOZY");
  assert.strictEqual(fertRes?.status, "OSTRZEGAWCZY", "Sektor nawozowy musi mieć status ostrzegawczy z uwagi na dumping");

  // 2. Tarcza Przed Wrogim Przejęciem (Ustawa o Kontroli Niektórych Inwestycji)
  assert.ok(FOREIGN_TAKEOVER_SHIELD_ENTITIES.length >= 6, "Musi obejmować kluczowe spółki z rejestru 21 podmiotów");
  const orlenShield = FOREIGN_TAKEOVER_SHIELD_ENTITIES.find((e) => e.ticker === "PKN");
  assert.ok(orlenShield?.suspiciousAccumulationAlert, "Musi sygnalizować alert wrogiej akumulacji pakietu akcji Orlenu");
  assert.ok(orlenShield?.ministerialVetoAvailable, "Sprzeciw Ministra musi być aktywny");
  const azotyShield = FOREIGN_TAKEOVER_SHIELD_ENTITIES.find((e) => e.ticker === "ATT");
  assert.ok(azotyShield?.lastTransactionNotice.includes("Acron"), "Musi wskazywać zamrożony pakiet rosyjskiego Acronu");

  // 3. Komitet Stabilności Finansowej i Kowenanty
  assert.ok(DEBT_STABILITY_RECORDS.length >= 6, "Musi monitorować profil zadłużenia co najmniej 6 grup");
  const totalDebt = DEBT_STABILITY_RECORDS.reduce((s, r) => s + r.netDebtMldPln, 0);
  assert.ok(totalDebt > 65, "Zagregowany dług netto kluczowych grup musi przekraczać 65 mld PLN");
  const azotyDebt = DEBT_STABILITY_RECORDS.find((r) => r.ticker === "ATT");
  assert.strictEqual(azotyDebt?.isCovenantBreached, true, "Grupa Azoty musi mieć flagę naruszonego kowenantu");
  assert.ok((azotyDebt?.netDebtToEbitda ?? 0) > 3.5, "Dług/EBITDA w Azotach musi przekraczać limit 3.5x");
  const cargoDebt = DEBT_STABILITY_RECORDS.find((r) => r.ticker === "PKPCARGO");
  assert.strictEqual(cargoDebt?.isCovenantBreached, true, "PKP Cargo musi mieć flagę naruszonego kowenantu");

  // 4. Gabinetowy Audio-Brief (Odprawa Poranna w 90 sekund)
  assert.strictEqual(MORNING_CABINET_BRIEFING.audioDurationSeconds, 92, "Czas odprawy audio musi wynosić ok. 90 sekund");
  assert.ok(MORNING_CABINET_BRIEFING.keyNumberValue.includes("384,5"), "Musi zawierać kluczową liczbę majątku narodowego");
  assert.ok(MORNING_CABINET_BRIEFING.urgentDecisionToSign.includes("standstill"), "Pilna decyzja musi dotyczyć standstill dla Azotów");
  assert.strictEqual(MORNING_CABINET_BRIEFING.top3StrategicEvents.length, 3, "Musi zawierać dokładnie 3 fakty strategiczne");
  assert.ok(MORNING_CABINET_BRIEFING.transcriptText.length > 200, "Transkrypcja musi być kompletna");
});

test("12. Bezpośredni Parser Raportów Okresowych GPW w standardzie XBRL / ESPI", () => {
  assert.ok(
    OFFICIAL_GPW_PERIODIC_REPORTS.length >= 7,
    "Baza musi zawierać raporty dla co najmniej 7 kluczowych SSP (Orlen, Azoty, Cargo, PGE, Tauron, KGHM, JSW)"
  );

  // Raport Grupy Azoty (ESEF iXBRL)
  const azotyReport = OFFICIAL_GPW_PERIODIC_REPORTS.find((r: any) => r.ticker === "ATT");
  assert.ok(azotyReport, "Musi zawierać raport dla Grupy Azoty");
  assert.strictEqual(azotyReport.reportStandard, "ESEF_IXBRL");
  assert.strictEqual(azotyReport.covenant.isBreached, true, "Kowenant Grupy Azoty musi być oznaczony jako naruszony");
  assert.strictEqual(azotyReport.covenant.waiverRequired, true, "Wymagany waiver bankowy");
  assert.ok(azotyReport.calculatedEbitdaMlnPln < 0, "EBITDA Grupy Azoty w Q3 2025 musi być ujemna");
  assert.ok(azotyReport.netDebtMlnPln >= 10000, "Dług netto Grupy Azoty musi wynosić ponad 10 mld PLN");

  // Raport ORLEN (KNF ESPI XML)
  const orlenReport = OFFICIAL_GPW_PERIODIC_REPORTS.find((r: any) => r.ticker === "PKN");
  assert.ok(orlenReport, "Musi zawierać raport dla ORLEN");
  assert.strictEqual(orlenReport.reportStandard, "KNF_ESPI_XML");
  assert.strictEqual(orlenReport.covenant.isBreached, false, "Kowenant ORLENU musi być bezpieczny");
  assert.ok(
    orlenReport.covenant.netDebtToEbitda !== null && orlenReport.covenant.netDebtToEbitda < 1.0,
    "Dług Netto / EBITDA Orlenu musi wynosić < 1.0x"
  );
  assert.ok(orlenReport.calculatedEbitdaMlnPln > 25000, "EBITDA Orlenu musi przekraczać 25 mld PLN");

  // Test dynamicznego parsera na surowym ciągu iXBRL
  const sampleIxbrl = `
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL" xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full">
      <ix:nonNumeric name="ifrs-full:TradingSymbol">TEST_SSP</ix:nonNumeric>
      <ix:nonNumeric name="ifrs-full:DocumentType">SA-Q 3/2025</ix:nonNumeric>
      <ix:nonFraction name="ifrs-full:Revenue" scale="6">5000.00</ix:nonFraction>
      <ix:nonFraction name="ifrs-full:OperatingProfit" scale="6">800.00</ix:nonFraction>
      <ix:nonFraction name="ifrs-full:DepreciationAndAmortisationExpense" scale="6">200.00</ix:nonFraction>
      <ix:nonFraction name="ifrs-full:NoncurrentBorrowings" scale="6">2500.00</ix:nonFraction>
      <ix:nonFraction name="ifrs-full:CurrentBorrowings" scale="6">500.00</ix:nonFraction>
      <ix:nonFraction name="ifrs-full:CashAndCashEquivalents" scale="6">1000.00</ix:nonFraction>
    </html>
  `;

  const parsedDynamic = parseEspiXbrlContent(sampleIxbrl);
  assert.strictEqual(parsedDynamic.ticker, "TEST_SSP");
  assert.strictEqual(parsedDynamic.revenueMlnPln, 5000);
  assert.strictEqual(parsedDynamic.operatingProfitEbitMlnPln, 800);
  assert.strictEqual(parsedDynamic.depreciationMlnPln, 200);
  // EBITDA = 800 + 200 = 1000 mln PLN
  assert.strictEqual(parsedDynamic.calculatedEbitdaMlnPln, 1000);
  // Dług brutto = 2500 + 500 = 3000, Gotówka = 1000, Dług netto = 2000 mln PLN
  assert.strictEqual(parsedDynamic.netDebtMlnPln, 2000);
  // Dług Netto / EBITDA = 2000 / 1000 = 2.0x
  assert.strictEqual(parsedDynamic.covenant.netDebtToEbitda, 2.0);
  assert.strictEqual(parsedDynamic.covenant.isBreached, false);
  assert.strictEqual(parsedDynamic.covenant.status, "BEZPIECZNY");
  assert.ok(parsedDynamic.tagsProvenance.length >= 6, "Musi zachować metadane audytowe tagów taksonomii");

  // Test oceny kowenantowej z naruszeniem limitu
  const evalBreached = evaluateCovenant("TEST", 4000, 1000, 100, 3.5);
  assert.strictEqual(evalBreached.netDebtToEbitda, 4.0);
  assert.strictEqual(evalBreached.isBreached, true);
  assert.strictEqual(evalBreached.status, "KOWENANT_NARUSZONY");
  assert.strictEqual(evalBreached.waiverRequired, true);
});

test("13. Asynchroniczny Nasłuch Webhooków KNF ESPI / PAP Biznes (Zero Polling)", () => {
  // 1. Sprawdzenie stanu usługi webhooka
  const state = getWebhookServiceState();
  assert.strictEqual(state.isListening, true, "Nasłuch webhooka musi być aktywny");
  assert.ok(state.activeSources.includes("KNF_ESPI"), "KNF ESPI musi być aktywnym źródłem");
  assert.ok(state.activeSources.includes("PAP_BIZNES"), "PAP Biznes musi być aktywnym źródłem");
  assert.ok(state.recentTransmissions.length >= 3, "Musi zawierać historię odebranych transmisji");

  // 2. Weryfikacja sygnatury kryptograficznej HMAC-SHA256
  const secret = "test_secret_abc";
  const body = JSON.stringify({ eventId: "test-123", ticker: "PKN" });
  const validSig = crypto.createHmac("sha256", secret).update(body).digest("hex");

  assert.strictEqual(verifyHmacSignature(body, validSig, secret), true, "Prawidłowy podpis musi zostać zaakceptowany");
  assert.strictEqual(verifyHmacSignature(body, "invalid_sig", secret), false, "Sfałszowany podpis musi zostać odrzucony");

  // 3. Przetworzenie przychodzącego webhooka z raportem okresowym (Grupa Azoty)
  const incomingSample = {
    eventId: "webhook-live-test-001",
    source: "KNF_ESPI" as const,
    eventType: "PERIODIC_REPORT_PUBLISHED" as const,
    ticker: "ATT",
    entityName: "Grupa Azoty S.A.",
    reportNumber: "SA-QSr 3/2025",
    rawContent: `
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:ix="http://www.xbrl.org/2013/inlineXBRL" xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full">
        <ix:nonNumeric name="ifrs-full:TradingSymbol">ATT</ix:nonNumeric>
        <ix:nonNumeric name="ifrs-full:DocumentType">SA-QSr 3/2025</ix:nonNumeric>
        <ix:nonFraction name="ifrs-full:Revenue" scale="6">9850.40</ix:nonFraction>
        <ix:nonFraction name="ifrs-full:OperatingProfit" scale="6">-1240.20</ix:nonFraction>
        <ix:nonFraction name="ifrs-full:DepreciationAndAmortisationExpense" scale="6">420.10</ix:nonFraction>
        <ix:nonFraction name="ifrs-full:NoncurrentBorrowings" scale="6">8120.00</ix:nonFraction>
        <ix:nonFraction name="ifrs-full:CurrentBorrowings" scale="6">2850.00</ix:nonFraction>
        <ix:nonFraction name="ifrs-full:CashAndCashEquivalents" scale="6">570.00</ix:nonFraction>
      </html>
    `,
  };

  const processResult = processIncomingEspiWebhook(incomingSample, undefined, false);
  assert.strictEqual(processResult.status, "COVENANT_ALERT");
  assert.strictEqual(processResult.covenantBreached, true, "Musi natychmiast wykryć naruszenie kowenantu bez pollingu");
  assert.strictEqual(processResult.marRiskFlag, true, "Musi oflagować ryzyko MAR");
  assert.strictEqual(processResult.ministerialAlertRequired, true, "Musi zażądać alertu ministerialnego");
  assert.ok(processResult.parsedReport, "Musi zwrócić natychmiast sparsowany raport");
  assert.strictEqual(processResult.parsedReport?.netDebtMlnPln, 10400);

  // 4. Test przetworzenia systemowego sygnału kontrolnego (Heartbeat)
  const heartbeatResult = processIncomingEspiWebhook({
    eventId: "hb-999",
    source: "KNF_ESPI",
    eventType: "SYSTEM_HEARTBEAT",
    ticker: "SYSTEM",
    entityName: "KNF ESPI Gateway",
    reportNumber: "HEARTBEAT",
  });
  assert.strictEqual(heartbeatResult.status, "HEARTBEAT");
});

test("MAPscope Ministerialny Test 14: Rejestr napięć społecznych, spory zbiorowe (Ustawa z 1991 r.) i symulator kompromisu płacowego", async () => {
  const {
    LABOR_DISPUTES_DATABASE,
    SOCIAL_DIALOGUE_CALENDAR,
    getSocialDialogueSummary,
    simulateWageCompromise,
  } = await import("./social-dialogue-data.ts");

  // 1. Sprawdzenie integralności rejestru sporów zbiorowych
  assert.ok(LABOR_DISPUTES_DATABASE.length >= 7, "Rejestr musi zawierać kluczowe spory w SSP");

  const pkpCargo = LABOR_DISPUTES_DATABASE.find((d) => d.ticker === "PKPCARGO");
  assert.ok(pkpCargo, "PKP CARGO musi być w rejestrze");
  assert.strictEqual(pkpCargo?.threatLevel, "KRYTYCZNY");
  assert.strictEqual(pkpCargo?.isZuzpThreatened, true, "ZUZP w PKP CARGO musi być oflagowane");
  assert.strictEqual(pkpCargo?.legalStage, "PROTOKOL_ROZBIEZNOSCI");

  const jsw = LABOR_DISPUTES_DATABASE.find((d) => d.ticker === "JSW");
  assert.ok(jsw, "JSW musi być w rejestrze");
  assert.strictEqual(jsw?.threatLevel, "WYSOKI");
  assert.strictEqual(jsw?.legalStage, "MEDIACJA_MRPIPS");

  const pocztaPolska = LABOR_DISPUTES_DATABASE.find((d) => d.ticker === "POCZTA_POLSKA");
  assert.ok(pocztaPolska, "Poczta Polska musi być w rejestrze");
  assert.strictEqual(pocztaPolska?.threatLevel, "KRYTYCZNY");
  assert.strictEqual(pocztaPolska?.legalStage, "REFERENDUM_STRAJKOWE");

  // 2. Weryfikacja agregacji podsumowania dla kierownictwa MAP
  const summary = getSocialDialogueSummary();
  assert.strictEqual(summary.totalActiveDisputes, LABOR_DISPUTES_DATABASE.length);
  assert.ok(summary.criticalDisputesCount >= 2, "Minimum 2 spory na poziomie krytycznym");
  assert.ok(summary.totalWorkersAffected > 100000, "Ponad 100 tysięcy pracowników w reżimie sporów");
  assert.ok(summary.totalWageDemandsCostMlnPln > 1000, "Łączny koszt żądań płacowych przekracza 1 mld PLN rocznie");
  assert.ok(summary.calendarEventsNext30Days >= 5, "Harmonogram posiedzeń WRDS i mediacji");

  // 3. Weryfikacja kalendarium i posiedzeń WRDS
  assert.ok(SOCIAL_DIALOGUE_CALENDAR.length >= 6);
  const wrdsEvent = SOCIAL_DIALOGUE_CALENDAR.find((e) => e.eventType === "POSIEDZENIE_WRDS");
  assert.ok(wrdsEvent, "Musi zawierać posiedzenie Wojewódzkiej Rady Dialogu Społecznego");
  assert.ok(wrdsEvent?.actionRequiredByMap, "Posiedzenie WRDS musi mieć wytyczną działania dla MAP");

  // 4. Test symulatora kompromisu płacowego (Stress-Test EBITDA i kowenantów)
  // Scenariusz A: Bezpieczny kompromis dla JSW (np. 3.5% + 1 000 PLN premii)
  const simResultSafe = simulateWageCompromise({
    disputeId: "disp-jsw-01",
    proposedWageIncreasePct: 3.5,
    proposedOneOffBonusPln: 1000,
  });

  assert.strictEqual(simResultSafe.disputeId, "disp-jsw-01");
  assert.ok(simResultSafe.simulatedAnnualCostMlnPln > 100 && simResultSafe.simulatedAnnualCostMlnPln < 200);
  assert.strictEqual(simResultSafe.covenantBreached, false, "Kowenant JSW 3.0x nie może być przekroczony przy 3.5%");
  assert.ok(simResultSafe.savingsVsDemandsMlnPln > 100, "Musi wykazać oszczędności względem pierwotnych żądań związków");
  assert.ok(simResultSafe.socialPeaceHorizonMonths >= 12, "Gwarantuje spokój społeczny");

  // Scenariusz B: Nadmierne ustępstwo w Grupie Azoty (gdzie EBITDA bazowa jest ujemna -620 mln)
  const simResultAzoty = simulateWageCompromise({
    disputeId: "disp-grupa-azoty-01",
    proposedWageIncreasePct: 5.0,
    proposedOneOffBonusPln: 2000,
  });

  assert.strictEqual(simResultAzoty.covenantBreached, true, "W Grupie Azoty każde ustępstwo pogłębia stratę i narusza kowenant");
  assert.ok(simResultAzoty.recommendationNote.includes("Ostrzeżenie: Proponowany kompromis narusza kowenanty bankowe"));
});

test("MAPscope Ministerialny Test 15: Strefa MAP (Kierownictwo, Komunikacja i Kryzysy Resortu)", async () => {
  const {
    MAP_LEADERSHIP,
    MAP_DIRECT_CRISES,
    MAP_PRESS_RELEASES,
    MAP_PRESS_INQUIRIES,
    getMapZoneSummary,
  } = await import("./map-zone-data.ts");

  // 1. Sprawdzenie integralności kierownictwa resortu MAP
  assert.ok(MAP_LEADERSHIP.length >= 4, "Musi obejmować całe ścisłe kierownictwo MAP");
  const minister = MAP_LEADERSHIP.find((l) => l.role === "MINISTER");
  assert.ok(minister, "Minister Aktywów Państwowych musi być w rejestrze");
  assert.strictEqual(minister?.name, "Wojciech Balczun");
  assert.ok(minister?.supervisedDepartments.includes("Departament Spółek Strategicznych"));

  const zeidler = MAP_LEADERSHIP.find((l) => l.name.includes("Zeidler"));
  assert.ok(zeidler, "Sekretarz Stanu Eliza Zeidler musi być w rejestrze");
  assert.strictEqual(zeidler?.role, "SEKRETARZ_STANU");

  // 2. Weryfikacja kryzysów bezpośrednio uderzających w gmach i kierownictwo MAP
  assert.ok(MAP_DIRECT_CRISES.length >= 4);
  const kruczaProtest = MAP_DIRECT_CRISES.find((c) => c.streetProtestThreat);
  assert.ok(kruczaProtest, "Musi identyfikować pikietę pod gmachem przy ul. Kruczej 36");
  assert.strictEqual(kruczaProtest?.severity, "KRYTYCZNE");
  assert.ok(kruczaProtest?.protestDetails?.registeredParticipants, "Musi zawierać liczbę uczestników protestu");
  assert.ok(kruczaProtest?.ministerialCounterNarrative, "Musi zawierać rządową linię obrony");

  // 3. Weryfikacja rejestru zapytań dziennikarskich do Biura Prasowego MAP
  assert.ok(MAP_PRESS_INQUIRIES.length >= 4);
  const urgentInquiry = MAP_PRESS_INQUIRIES.find((q) => q.urgency === "PILNE_DO_2H");
  assert.ok(urgentInquiry, "Musi obsługiwać zapytania w trybie pilnym do 2h");
  assert.ok(urgentInquiry?.redLines, "Musi definiować czerwone linie (czego nie wolno mówić)");
  assert.ok(urgentInquiry?.assignedSpokespersonLine, "Musi posiadać autoryzowaną linię rzecznika");

  // 4. Weryfikacja oficjalnych komunikatów i sprostowań resortowych
  assert.ok(MAP_PRESS_RELEASES.length >= 4);
  const rectification = MAP_PRESS_RELEASES.find((r) => r.isRectification);
  assert.ok(rectification, "Musi rejestrować formalne sprostowania prasowe MAP w trybie art. 31a");
  assert.ok(rectification?.targetMediaOutlet, "Sprostowanie musi mieć wskazaną redakcję");

  // 5. Podsumowanie Strefy MAP
  const summary = getMapZoneSummary();
  assert.ok(summary.overallMapTensionIndex > 50, "Wskaźnik napięcia wokół MAP musi być policzony");
  assert.strictEqual(summary.registeredStreetProtestsCount, 1);
  assert.ok(summary.activePressInquiriesCount >= 2);
});

test("MAPscope Ministerialny Test 16: Paszport Źródła KRS, weryfikacja organów i autentyczne zarządy spółek strategicznych", () => {
  // 1. Sprawdzenie, że wszystkie 406 podmiotów posiada metadane weryfikacji z eKRS
  assert.strictEqual(ALL_ENTITIES_REGISTRY.length, 406);
  for (const entity of ALL_ENTITIES_REGISTRY) {
    assert.ok(entity.krs_registry_url, `Podmiot ${entity.id} musi posiadać link do rejestru eKRS`);
    assert.strictEqual(entity.krs_verification_date, "2026-10-21");
    assert.ok(entity.krs_verification_source, `Podmiot ${entity.id} musi posiadać źródło weryfikacji`);
    assert.ok(
      ["verified_krs", "verified_espi"].includes(entity.krs_verification_status || ""),
      `Podmiot ${entity.id} musi posiadać status zweryfikowany`
    );
    if (entity.dossier) {
      assert.strictEqual(entity.dossier.krs_verification_date, "2026-10-21");
      assert.ok(entity.dossier.krs_verification_source);
      // Każdy członek zarządu musi mieć poświadczenie źródła
      for (const member of entity.dossier.managementBoard) {
        assert.ok(member.sourceReference, `Członek zarządu ${member.name} musi mieć wskazane źródło`);
        assert.strictEqual(member.verifiedAt, "2026-10-21");
      }
    }
  }

  // 2. ORLEN S.A. - Prezes Ireneusz Fąfara i zarząd powołany w 2024 r.
  const orlen = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-orlen" || e.stock_ticker === "PKN");
  assert.ok(orlen, "ORLEN S.A. musi istnieć w rejestrze");
  const orlenCeo = orlen?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.ok(orlenCeo, "ORLEN musi mieć Prezesa Zarządu");
  assert.strictEqual(orlenCeo?.name, "Ireneusz Fąfara");
  assert.strictEqual(orlenCeo?.appointedAt, "2024-04-11");
  assert.ok(orlenCeo?.sourceReference?.includes("ESPI 19/2024"));
  assert.ok(orlen?.dossier?.managementBoard.some((m) => m.name === "Witold Literacki"));
  assert.ok(orlen?.dossier?.managementBoard.some((m) => m.name === "Magdalena Bartoś"));

  // 3. KGHM Polska Miedź S.A. - Prezes Andrzej Szydło
  const kghm = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-kghm" || e.stock_ticker === "KGH");
  assert.ok(kghm, "KGHM musi istnieć w rejestrze");
  const kghmCeo = kghm?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(kghmCeo?.name, "Andrzej Szydło");
  assert.strictEqual(kghmCeo?.appointedAt, "2024-03-06");

  // 4. PGE Polska Grupa Energetyczna S.A. - Prezes Dariusz Marzec
  const pge = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-pge" || e.stock_ticker === "PGE");
  assert.ok(pge, "PGE musi istnieć w rejestrze");
  const pgeCeo = pge?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(pgeCeo?.name, "Dariusz Marzec");
  assert.strictEqual(pgeCeo?.appointedAt, "2024-03-18");

  // 5. Grupa Azoty S.A. - Prezes Adam Leszkiewicz
  const azoty = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-azoty" || e.stock_ticker === "ATT");
  assert.ok(azoty, "Grupa Azoty musi istnieć w rejestrze");
  const azotyCeo = azoty?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(azotyCeo?.name, "Adam Leszkiewicz");

  // 6. Poczta Polska S.A. - Prezes Sebastian Mikosz
  const poczta = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-poczta" || e.name.toLowerCase().includes("poczta polska"));
  assert.ok(poczta, "Poczta Polska musi istnieć w rejestrze");
  const pocztaCeo = poczta?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(pocztaCeo?.name, "Sebastian Mikosz");

  // 7. Polskie Koleje Państwowe S.A. (Grupa PKP) - Prezes Alan Beroud
  const pkp = ALL_ENTITIES_REGISTRY.find((e) => e.name.toLowerCase().startsWith("polskie koleje państwowe s.a"));
  assert.ok(pkp, "PKP S.A. musi istnieć w rejestrze");
  const pkpCeo = pkp?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(pkpCeo?.name, "Alan Beroud");

  // 8. Polska Grupa Zbrojeniowa S.A. (PGZ) - Prezes Krzysztof Trofiniak
  const pgz = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-pgz" || e.name.toLowerCase().includes("zbrojeniowa"));
  assert.ok(pgz, "PGZ S.A. musi istnieć w rejestrze");
  const pgzCeo = pgz?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(pgzCeo?.name, "Krzysztof Trofiniak");

  // 9. Totalizator Sportowy - Mariusz Błaszkiewicz
  const totalizator = ALL_ENTITIES_REGISTRY.find((e) => e.id === "e-totalizator" || e.name.toLowerCase().includes("totalizator sportowy"));
  assert.ok(totalizator, "Totalizator Sportowy musi istnieć w rejestrze");
  const totCeo = totalizator?.dossier?.managementBoard.find((m) => m.role.includes("Prezes"));
  assert.strictEqual(totCeo?.name, "Mariusz Błaszkiewicz");
});

test("MAPscope Ministerialny Test 17: Nocny Synchronizator KRS / CRBR (API Ministerstwa Sprawiedliwości)", async () => {
  const {
    getNightlySyncStatus,
    runNightlyKrsSync,
    parseKrsStructuralXml,
    parseKrsStructuralJson,
    KRS_API_BASE_URL,
    CRBR_API_BASE_URL,
  } = await import("./krs-sync-service.ts");

  // 1. Sprawdzenie statusu technicznego synchronizatora
  const status = getNightlySyncStatus();
  assert.strictEqual(status.totalMonitoredEntities, 406);
  assert.strictEqual(status.scheduleCron, "0 2 * * *");
  assert.strictEqual(status.krsApiUrl, KRS_API_BASE_URL);
  assert.strictEqual(status.crbrApiUrl, CRBR_API_BASE_URL);
  assert.strictEqual(status.apiHealth, "operational");
  assert.ok(status.lastRunReport.krsApiConnected);
  assert.ok(status.lastRunReport.crbrApiConnected);

  // 2. Parsowanie odpisu strukturalnego XML z Centralnej Informacji KRS
  const testXml = `<?xml version="1.0" encoding="UTF-8"?>
    <OdpisAktualny>
      <NumerKRS>0000028860</NumerKRS>
      <Reprezentacja>
        <Osoba>
          <Imiona>IRENEUSZ</Imiona>
          <Nazwisko>FĄFARA</Nazwisko>
          <Funkcja>PREZES ZARZĄDU</Funkcja>
        </Osoba>
      </Reprezentacja>
      <OrganNadzoru>
        <Osoba>
          <Imiona>WOJCIECH</Imiona>
          <Nazwisko>POPIOŁEK</Nazwisko>
          <Funkcja>PRZEWODNICZĄCY RADY NADZORCZEJ</Funkcja>
        </Osoba>
      </OrganNadzoru>
    </OdpisAktualny>`;

  const parsedXml = parseKrsStructuralXml(testXml);
  assert.strictEqual(parsedXml.krs, "0000028860");
  assert.strictEqual(parsedXml.managementBoard.length, 1);
  assert.strictEqual(parsedXml.managementBoard[0].name, "IRENEUSZ FĄFARA");
  assert.strictEqual(parsedXml.supervisoryBoard.length, 1);
  assert.strictEqual(parsedXml.supervisoryBoard[0].name, "WOJCIECH POPIOŁEK");

  // 3. Parsowanie odpisu strukturalnego JSON z api-krs.ms.gov.pl
  const testJson = {
    odpis: {
      naglowekA: { numerKRS: "0000023302" },
      dane: {
        dzial2: {
          reprezentacja: {
            sklad: [
              {
                identyfikator: { imiona: "ANDRZEJ", nazwisko: "SZYDŁO" },
                funkcjaWOrganie: "PREZES ZARZĄDU",
              },
            ],
          },
        },
      },
    },
  };

  const parsedJson = parseKrsStructuralJson(testJson);
  assert.strictEqual(parsedJson.krs, "0000023302");
  assert.strictEqual(parsedJson.managementBoard.length, 1);
  assert.strictEqual(parsedJson.managementBoard[0].name, "ANDRZEJ SZYDŁO");

  // 4. Uruchomienie synchronizacji nocnej ad-hoc
  const syncReport = await runNightlyKrsSync({
    dryRun: true,
    targetEntityIds: ["e-orlen", "e-kghm", "e-pge"],
  });

  assert.ok(syncReport.runId.startsWith("krs-sync-manual-"));
  assert.strictEqual(syncReport.entitiesScannedCount, 3);
  assert.strictEqual(syncReport.errorsCount, 0);
  assert.strictEqual(syncReport.krsApiConnected, true);
  assert.strictEqual(syncReport.crbrApiConnected, true);
});







