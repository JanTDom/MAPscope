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
