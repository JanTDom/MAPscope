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
} from "./mapscope-data.ts";

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


