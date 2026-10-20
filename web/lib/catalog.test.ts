import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_ENTITIES_REGISTRY,
  TOP_FIRE_ALERTS,
  SECTOR_STABILITY_DATA,
  COMPANY_DISCLOSURES_DATA,
  MEDIA_RADAR_ANOMALIES,
  PARLIAMENTARY_INQUIRIES,
} from "./mapscope-data.ts";

test("Katalog podmiotów zawiera 100% przekrój spółek Skarbu Państwa bez wykluczeń", () => {
  assert.ok(ALL_ENTITIES_REGISTRY.length >= 13);

  // Weryfikacja obecności spółki strategicznej (Orlen)
  const orlen = ALL_ENTITIES_REGISTRY.find((e) => e.name === "ORLEN S.A.");
  assert.ok(orlen);
  assert.equal(orlen?.nip, "7740001454");
  assert.equal(orlen?.krs, "0000028860");
  assert.equal(orlen?.state_share_percent, 49.9);
  assert.equal(orlen?.strategic_importance, "strategic");
  assert.equal(orlen?.is_public_listed, true);

  // Weryfikacja spółki w restrukturyzacji (PKP Cargo)
  const pkp = ALL_ENTITIES_REGISTRY.find((e) => e.name.includes("PKP CARGO"));
  assert.ok(pkp);
  assert.equal(pkp?.status, "restructuring");

  // Weryfikacja spółki w upadłości (Fabryka Porcelany Krzysztof)
  const upadlosc = ALL_ENTITIES_REGISTRY.find((e) => e.status === "bankruptcy");
  assert.ok(upadlosc);
  assert.equal(upadlosc?.name, "Fabryka Porcelany 'Krzysztof' w upadłości");

  // Weryfikacja spółki w likwidacji
  const likw = ALL_ENTITIES_REGISTRY.find((e) => e.status === "liquidation");
  assert.ok(likw);
});

test("Każdy podmiot posiada kompletne Dossier 360° z 6 filarami analitycznymi", () => {
  for (const entity of ALL_ENTITIES_REGISTRY) {
    assert.ok(entity.dossier, `Spółka ${entity.name} nie posiada obiektu dossier`);
    const d = entity.dossier!;

    // Filar 1: Ład i własność
    assert.ok(Array.isArray(d.shareholders) && d.shareholders.length > 0);
    assert.ok(Array.isArray(d.managementBoard));
    assert.ok(typeof d.vacanciesCount === "number");

    // Filar 2: Ryzyko komunikacyjne
    assert.ok(typeof d.narrativeRiskScore === "number");
    assert.ok(d.narrativeSummary.length > 0);

    // Filar 3: Finanse
    assert.ok(typeof d.revenueMln === "number");
    assert.ok(typeof d.capexMln === "number");

    // Filar 4: Prawne i kontrole
    assert.ok(Array.isArray(d.legalCases));

    // Filar 5: Czynniki społeczne
    assert.ok(typeof d.laborUnionsCount === "number");

    // Filar 6: Oś czasu
    assert.ok(Array.isArray(d.timeline));
  }
});

test("Pożary dnia P1/P2 zawierają kwartet decyzyjny dla Ministra", () => {
  assert.ok(TOP_FIRE_ALERTS.length >= 3);

  const p1Alert = TOP_FIRE_ALERTS.find((a) => a.priority === "p1");
  assert.ok(p1Alert);
  assert.ok(p1Alert?.whatHappened.length > 10);
  assert.ok(p1Alert?.whoResponsible.length > 3);
  assert.ok(p1Alert?.governmentRisk.length > 10);
  assert.ok(p1Alert?.recommendedAction.length > 10);
});

test("Audytor komunikacji zawiera porównanie narracji (Spółka vs Media vs X)", () => {
  const disclosure = COMPANY_DISCLOSURES_DATA.find(
    (d) => d.risk_assessment?.narrative_comparison !== undefined
  );
  assert.ok(disclosure);
  const comp = disclosure!.risk_assessment!.narrative_comparison!;

  assert.ok(comp.companyClaim.length > 5);
  assert.ok(comp.mediaCoverage.length > 5);
  assert.ok(comp.publicReaction.length > 5);
});

test("Mapa sektorowa obejmuje 6 zdefiniowanych domen gospodarczych", () => {
  assert.equal(SECTOR_STABILITY_DATA.length, 6);
  const transport = SECTOR_STABILITY_DATA.find((s) => s.name === "Transport i Logistyka");
  assert.ok(transport);
  assert.equal(transport?.status, "krytyczny");
  assert.ok(transport!.temperature >= 75);
});

test("Radar medialny rejestruje anomalie wolumenu i rozkład sentymentu", () => {
  assert.ok(MEDIA_RADAR_ANOMALIES.length >= 2);
  const anomaly = MEDIA_RADAR_ANOMALIES[0];
  assert.ok(anomaly.spikeVolume > anomaly.baselineVolume);
  assert.ok(anomaly.negativeRatio > 0.5);
  assert.ok(anomaly.timeSeries.length >= 5);
});

test("Rejestr interpelacji poselskich zawiera wyznaczone linie obrony dla MAP", () => {
  assert.ok(PARLIAMENTARY_INQUIRIES.length >= 2);
  const inq = PARLIAMENTARY_INQUIRIES[0];
  assert.ok(inq.suggestedAnswerPoints.length >= 2);
  assert.ok(inq.author.length > 3);
  assert.ok(inq.deadline.length > 3);
});
