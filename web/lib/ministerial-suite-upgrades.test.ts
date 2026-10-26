import test from "node:test";
import assert from "node:assert/strict";

import { generateGovernmentHtmlDocument } from "./government-doc-generator.ts";
import { formatTelegramMarkdown, dispatchP1EmergencyAlert } from "./telegram-alert-service.ts";
import { SSP_PRESS_FEED_CATALOG, auditPressReleaseRisk, fetchLiveSspPressReleases } from "./ssp-press-feeds-service.ts";
import { executeSemanticSearch, SEMANTIC_RULES } from "./semantic-search.ts";
import { SUBSIDIARIES_REGISTRY, getSubsidiariesForEntity } from "./subsidiaries-registry.ts";
import { ALL_ENTITIES_REGISTRY } from "./mapscope-data.ts";

test("Moduł 1: Generator urzędowych dokumentów A4 / PDF (KPRM, Fiszka 30s, Mandat AGM)", () => {
  // 1. KPRM One-Pager
  const kprmHtml = generateGovernmentHtmlDocument({ docType: "KPRM_ONE_PAGER" });
  assert.ok(kprmHtml.toUpperCase().includes("PREZESA RADY MINISTRÓW"), "Musi zawierać nagłówek KPRM");
  assert.ok(kprmHtml.includes("size: A4 portrait;"), "Musi zawierać reguły CSS formatu A4");
  assert.ok(kprmHtml.includes("Restrukturyzacja"), "Musi zawierać bilans restrukturyzacji");

  // 2. Fiszka przedkonferencyjna
  const briefingHtml = generateGovernmentHtmlDocument({ docType: "PRESS_BRIEFING_30S", targetId: "br-totalizator" });
  assert.ok(briefingHtml.toUpperCase().includes("KIESZONKOWA FISZKA PRASOWA DLA MINISTRA"), "Musi zawierać nagłówek Fiszki 30s");
  assert.ok(briefingHtml.includes("OTWARCIE DO KAMER"), "Musi zawierać sekcję otwarcia");
  assert.ok(briefingHtml.includes("CZERWONA LINIA"), "Musi zawierać czerwone linie");

  // 3. Mandat na WZ
  const agmHtml = generateGovernmentHtmlDocument({ docType: "AGM_VOTING_MANDATE", targetId: "agm-orlen" });
  assert.ok(agmHtml.toUpperCase().includes("MANDAT WIĄŻĄCY DLA PEŁNOMOCNIKA SKARBU PAŃSTWA"), "Musi zawierać nagłówek mandatu");
  assert.ok(agmHtml.includes("ORLEN S.A."), "Musi wskazywać spółkę");
  assert.ok(agmHtml.includes("Art. 7 Ustawy"), "Musi zawierać podstawę prawną");
});

test("Moduł 2: Serwis dyspozycji alarmowej P1 Telegram / Oficer dyżurny MAP", async () => {
  const sampleAlert = {
    alertId: "alt-p1-test",
    entityName: "ORLEN S.A.",
    priority: "p1" as const,
    title: "Próba blokady terminala morskiego w Świnoujściu",
    whatHappened: "Protest rybaków blokuje wejście do gazoportu",
    whoResponsible: "Zarząd Morskich Portów Szczecin i Świnoujście",
    governmentRisk: "Wstrzymanie rozładunku LNG i presja medialna na MAP",
    recommendedAction: "Powołać sztab kryzysowy z MI i MSWiA",
    hardFacts: ["Dostawa 120 tys. m3 gazu opóźniona o 4 godziny", "Rezerwy krajowe 98%"],
    redLines: ["Nie obiecywać rekompensat przed analizą prawną"],
  };

  const formattedMsg = formatTelegramMarkdown(sampleAlert);
  assert.ok(formattedMsg.includes("ALARM P1"), "Format Telegramu musi zawierać nagłówek P1");
  assert.ok(formattedMsg.includes("ORLEN S.A."), "Musi zawierać nazwę podmiotu");
  assert.ok(formattedMsg.includes("REKOMENDOWANY KROK MINISTRA"), "Musi zawierać dyspozycję Ministra");

  // Test wysyłki (bezpieczny tryb wewnętrzny w środowisku testowym bez tokena zewnętrznego)
  const dispatchRes = await dispatchP1EmergencyAlert(sampleAlert);
  assert.equal(dispatchRes.success, true, "Wysyłka musi zakończyć się sukcesem (kolejka wewnętrzna)");
  assert.ok(dispatchRes.recipient, "Musi wskazać odbiorcę (Telegram lub Kolejkę Dyżurną MAP)");
});

test("Moduł 3: Bezpośredni nasłuch RSS/Atom biur prasowych 25 spółek SSP", async () => {
  assert.equal(SSP_PRESS_FEED_CATALOG.length, 25, "Katalog musi zawierać dokładnie 25 strategicznych feedów biur prasowych SSP");

  // Test reguł audytu ryzyka
  const criticalAudit = auditPressReleaseRisk("Zawiadomienie do prokuratury w sprawie nieprawidłowości w spółce zależnej OTS", "CBA weszło do biura zarządu");
  assert.equal(criticalAudit.flag, "KRYTYCZNE_P1", "Triggery prokuratury i CBA muszą wymusić flagę KRYTYCZNE_P1");
  assert.ok(criticalAudit.triggers.some((t) => t.includes("prokuratur")), "Musi wykryć trigger prokuratury");

  const warningAudit = auditPressReleaseRisk("Rozpoczęcie procedury zwolnień grupowych i spór ze związkami", "Związki zawodowe odrzucają porozumienie");
  assert.equal(warningAudit.flag, "OSTRZEGAWCZE_P2", "Spór zbiorowy i zwolnienia grupowe muszą wymusić flagę OSTRZEGAWCZE_P2");

  const neutralAudit = auditPressReleaseRisk("Podpisanie umowy na dostawę nowoczesnych transformatorów dla sieci przesyłowej", "Inwestycja modernizacyjna");
  assert.equal(neutralAudit.flag, "STANDARD_NEUTRALNE", "Standardowa umowa musi otrzymać flagę STANDARD_NEUTRALNE");

  // Test pobierania na żywo
  const liveItems = await fetchLiveSspPressReleases();
  assert.ok(liveItems.length >= 10, "Nasłuch musi wygenerować komunikaty dla kluczowych spółek portfelowych");
  assert.ok(liveItems.some((i) => i.entityId === "e-orlen"), "Musi zawierać komunikaty ORLEN");
  assert.ok(liveItems.some((i) => i.entityName.includes("PKP CARGO")), "Musi zawierać komunikaty PKP Cargo");
});

test("Moduł 4: Silnik wyszukiwania semantycznego (AI Intent Search)", () => {
  assert.ok(SEMANTIC_RULES.length >= 6, "Silnik musi zawierać co najmniej 6 reguł intencji domenowych");

  // 1. Intencja płynności i zadłużenia
  const liquidityRes = executeSemanticSearch("spółki mające problem z kowenantami i utratą płynności");
  assert.ok(liquidityRes.detectedThemes.some((t) => t.includes("Płynność finansowa") || t.includes("kowenanty")));
  assert.ok(liquidityRes.matchedEntities.length > 0, "Musi znaleźć dopasowane podmioty");

  // 2. Intencja sporów pracowniczych i strajków
  const unionRes = executeSemanticSearch("gdzie grozi strajk generalny i protesty związków zawodowych");
  assert.ok(unionRes.detectedThemes.some((t) => t.toLowerCase().includes("spory zbiorowe") || t.toLowerCase().includes("związk")));
  assert.ok(unionRes.matchedAlerts.length > 0 || unionRes.matchedEntities.length > 0, "Musi powiązać ze sprawami sporów");

  // 3. Intencja kontroli NIK i prokuratury
  const auditRes = executeSemanticSearch("kontrola NIK CBA prokuratura i nadużycia");
  assert.ok(auditRes.detectedThemes.some((t) => t.includes("Kontrole państwowe") || t.includes("NIK")));
});

test("Moduł 5: Rejestr spółek zależnych II i III szczebla (eliminacja martwych stref nadzoru)", () => {
  assert.ok(SUBSIDIARIES_REGISTRY.length >= 25, "Rejestr musi zawierać co najmniej 25 kluczowych spółek zależnych II i III szczebla");

  const orlenSubs = getSubsidiariesForEntity("e-orlen");
  assert.ok(orlenSubs.length >= 6, "ORLEN musi posiadać co najmniej 6 powiązanych spółek córek/wnuczek");
  assert.ok(orlenSubs.some((s) => s.name.includes("Energa")), "Musi zawierać Grupę Energa");
  assert.ok(orlenSubs.some((s) => s.name.includes("Baltic Power")), "Musi zawierać Baltic Power");
  assert.ok(orlenSubs.some((s) => s.name.includes("Orlen Trading Switzerland")), "Musi zawierać OTS");

  const kghmSubs = getSubsidiariesForEntity("e-kghm");
  assert.ok(kghmSubs.some((s) => s.name.includes("Sierra Gorda")), "KGHM musi zawierać Sierra Gorda S.C.M.");

  const azotySubs = getSubsidiariesForEntity("e-azoty");
  assert.ok(azotySubs.some((s) => s.name.includes("Grupa Azoty Polyolefins")), "Grupa Azoty musi zawierać Polyolefins (Polimery Police)");
});
