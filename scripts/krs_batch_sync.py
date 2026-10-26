#!/usr/bin/env python3
"""
Skrypt cyklicznej partii synchronizacyjnej z API KRS i CRBR (Ministerstwo Sprawiedliwości / Ministerstwo Finansów).
Przeznaczony do uruchamiania w środowisku CI/CD (GitHub Actions) lub jako cykliczne zadanie serwerowe.
Zgodny ze standardem jakości Fable 5.1 i regułami kardynalnymi AGENTS.md.
"""

import asyncio
import json
import logging
import os
import sys
from pathlib import Path

# Dodanie katalogu projektu do ścieżki Pythona
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from mapscope.registry.krs_client import KRSClient
from mapscope.registry.crbr_client import CRBRClient
from mapscope.registry.nightly_sync import NightlySyncEngine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MAPscope.KRSBatchSync")

async def run_batch():
    registry_json_path = PROJECT_ROOT / "web" / "lib" / "entities-all.json"
    if not registry_json_path.exists():
        logger.error(f"Nie znaleziono pliku rejestru podmiotów: {registry_json_path}")
        sys.exit(1)

    with open(registry_json_path, encoding="utf-8") as f:
        entities = json.load(f)

    # Wybór podmiotów posiadających KRS (lub partii podmiotów)
    entities_with_krs = [e for e in entities if e.get("krs")]
    logger.info(f"Znaleziono {len(entities_with_krs)} podmiotów z numerem KRS do weryfikacji.")

    # Pobieranie partii (np. 15 spółek na cykl)
    batch_size = int(os.getenv("SYNC_BATCH_SIZE", "15"))
    batch = entities_with_krs[:batch_size]

    krs_client = KRSClient(timeout=10.0, max_retries=2)
    crbr_client = CRBRClient(timeout=10.0, max_retries=2)

    engine = NightlySyncEngine(
        krs_client=krs_client,
        crbr_client=crbr_client,
        concurrency_limit=3,
        polite_delay_seconds=0.1
    )

    logger.info(f"Rozpoczynanie synchronizacji partii {len(batch)} podmiotów...")
    report = await engine.run_nightly_sync(batch, prefer_format="json")

    logger.info(
        f"Synchronizacja zakończona w {report.duration_seconds}s. "
        f"Zeskanowano: {report.entities_scanned_count}, Zaktualizowano: {report.entities_updated_count}, Błędy: {report.errors_count}"
    )

    report_output_path = PROJECT_ROOT / "krs_sync_latest_report.json"
    with open(report_output_path, "w", encoding="utf-8") as f:
        json.dump(report.to_dict(), f, ensure_ascii=False, indent=2)
    logger.info(f"Zapisano raport do: {report_output_path}")

    return report

def main():
    asyncio.run(run_batch())

if __name__ == "__main__":
    main()
