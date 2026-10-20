import test from "node:test";
import assert from "node:assert/strict";
import { SEED_ENTITIES, SEED_DISCLOSURES, SEED_ALERTS } from "./entities-data.ts";

test("Katalog podmiotów zawiera wyłącznie zweryfikowane spółki Skarbu Państwa", () => {
  assert.equal(SEED_ENTITIES.length, 13);

  // Weryfikacja obecności spółki strategicznej (Orlen)
  const orlen = SEED_ENTITIES.find((e) => e.name === "ORLEN S.A.");
  assert.ok(orlen);
  assert.equal(orlen?.nip, "7740001454");
  assert.equal(orlen?.krs, "0000028860");
  assert.equal(orlen?.state_share_percent, 49.9);
  assert.equal(orlen?.strategic_importance, "strategic");

  // Weryfikacja spółki w restrukturyzacji (PKP Cargo)
  const pkp = SEED_ENTITIES.find((e) => e.name.includes("PKP CARGO"));
  assert.ok(pkp);
  assert.equal(pkp?.status, "restructuring");

  // Weryfikacja spółki regionalnej w likwidacji (zero wykluczeń)
  const likw = SEED_ENTITIES.find((e) => e.name.includes("w likwidacji"));
  assert.ok(likw);
  assert.equal(likw?.status, "liquidation");
});

test("Moduł audytu komunikacji analizuje wektory ryzyka i uderzenie w MAP", () => {
  const criticalDisclosure = SEED_DISCLOSURES.find(
    (d) => d.risk_assessment?.severity === "p1_critical"
  );
  assert.ok(criticalDisclosure);
  assert.ok(criticalDisclosure?.risk_assessment);

  const ra = criticalDisclosure!.risk_assessment!;
  assert.equal(ra.communication_risks.rozdzwiek_z_rzadem, true);
  assert.equal(ra.communication_risks.blad_narracyjny, true);
  assert.ok(ra.map_impact_analysis.includes("Minister Aktywów Państwowych"));
  assert.ok(ra.overall_risk_score >= 8.0);
});

test("Kolejka alertów kryzysowych zawiera zgłoszenia P1 o wysokim priorytecie", () => {
  const p1 = SEED_ALERTS.filter((a) => a.priority === "p1");
  assert.equal(p1.length, 1);
  assert.equal(p1[0].status, "pending");
  assert.ok(p1[0].title.includes("P1 ALARM"));
});
