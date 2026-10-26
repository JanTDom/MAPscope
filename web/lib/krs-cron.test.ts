import test from "node:test";
import assert from "node:assert";
import { getNightlySyncStatus, runNightlyKrsSync } from "./krs-sync-service.ts";

test("KRS Cron Service: pobieranie statusu synchronizacji", () => {
  const status = getNightlySyncStatus();
  assert.ok(status);
  assert.strictEqual(status.totalMonitoredEntities, 406);
  assert.strictEqual(status.scheduleCron, "0 2 * * *");
  assert.ok(status.lastSyncAt);
  assert.ok(["operational", "degraded"].includes(status.apiHealth));
});

test("KRS Cron Service: bezpieczny przebieg partii synchronizacji dry-run", async () => {
  const result = await runNightlyKrsSync({
    dryRun: true,
    targetEntityIds: ["e-orlen", "e-kghm"],
  });

  assert.ok(result);
  assert.ok(result.runId.startsWith("krs-sync-manual-"));
  assert.strictEqual(result.entitiesScannedCount, 2);
  assert.ok(result.durationSeconds >= 0);
  assert.ok(Array.isArray(result.events));
  assert.strictEqual(result.errorsCount, 0);
});
