"""Silnik nocnej synchronizacji rejestrów państwowych (KRS & CRBR) dla podmiotów Skarbu Państwa."""

import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from mapscope.models.entity import Person
from mapscope.models.enums import PersonRole
from mapscope.registry.crbr_client import BeneficialOwner, CRBRClient
from mapscope.registry.krs_client import KRSClient

logger = logging.getLogger(__name__)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class GovernanceSyncEvent:
    """Zdarzenie wykryte podczas synchronizacji organu zarządzającego lub nadzorczego."""

    def __init__(
        self,
        event_type: str,
        entity_id: str,
        entity_name: str,
        person_name: str,
        role: str,
        source: str = "api-krs.ms.gov.pl",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.id = str(uuid4())
        self.timestamp = _utc_now()
        self.event_type = event_type
        self.entity_id = entity_id
        self.entity_name = entity_name
        self.person_name = person_name
        self.role = role
        self.source = source
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),
            "event_type": self.event_type,
            "entity_id": self.entity_id,
            "entity_name": self.entity_name,
            "person_name": self.person_name,
            "role": self.role,
            "source": self.source,
            "details": self.details,
        }


class NightlySyncReport:
    """Raport z przebiegu cyklicznej nocnej synchronizacji KRS / CRBR."""

    def __init__(
        self,
        run_id: Optional[str] = None,
        started_at: Optional[datetime] = None,
    ):
        self.run_id = run_id or str(uuid4())
        self.started_at = started_at or _utc_now()
        self.finished_at: Optional[datetime] = None
        self.entities_scanned_count: int = 0
        self.entities_updated_count: int = 0
        self.errors_count: int = 0
        self.events: List[GovernanceSyncEvent] = []
        self.errors: List[Dict[str, str]] = []
        self.krs_api_connected: bool = True
        self.crbr_api_connected: bool = True

    @property
    def duration_seconds(self) -> float:
        if not self.finished_at:
            return (_utc_now() - self.started_at).total_seconds()
        return (self.finished_at - self.started_at).total_seconds()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "run_id": self.run_id,
            "started_at": self.started_at.isoformat(),
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "duration_seconds": round(self.duration_seconds, 2),
            "entities_scanned_count": self.entities_scanned_count,
            "entities_updated_count": self.entities_updated_count,
            "errors_count": self.errors_count,
            "events_count": len(self.events),
            "events": [e.to_dict() for e in self.events],
            "errors": self.errors,
            "krs_api_connected": self.krs_api_connected,
            "crbr_api_connected": self.crbr_api_connected,
        }


class NightlySyncEngine:
    """Asynchroniczny koordynator nocnego pobierania odpisów strukturalnych (XML/JSON)."""

    def __init__(
        self,
        krs_client: Optional[KRSClient] = None,
        crbr_client: Optional[CRBRClient] = None,
        concurrency_limit: int = 4,
        polite_delay_seconds: float = 0.05,
    ):
        self.krs_client = krs_client or KRSClient()
        self.crbr_client = crbr_client or CRBRClient()
        self.semaphore = asyncio.Semaphore(concurrency_limit)
        self.polite_delay_seconds = polite_delay_seconds

    async def sync_single_entity(
        self,
        entity_dict: Dict[str, Any],
        report: NightlySyncReport,
        prefer_format: str = "json",
    ) -> Dict[str, Any]:
        """Pobiera odpis z KRS i CRBR dla pojedynczej spółki oraz rejestruje ewentualne rozbieżności."""
        async with self.semaphore:
            if self.polite_delay_seconds > 0:
                await asyncio.sleep(self.polite_delay_seconds)

            entity_id = entity_dict.get("id", str(uuid4()))
            entity_name = entity_dict.get("name", "Nieznana spółka")
            krs = entity_dict.get("krs")
            nip = entity_dict.get("nip")

            result: Dict[str, Any] = {
                "entity_id": entity_id,
                "entity_name": entity_name,
                "krs": krs,
                "nip": nip,
                "status": "skipped",
                "extracted_people": [],
                "beneficiaries": [],
            }

            if not krs:
                return result

            # 1. Pobranie odpisu z API KRS (JSON lub XML)
            try:
                extract = await self.krs_client.get_current_extract(krs, format=prefer_format)
                if extract:
                    if prefer_format == "xml" and isinstance(extract, str):
                        people = KRSClient.extract_people_from_xml(extract, UUID(int=0))
                    elif isinstance(extract, dict):
                        people = KRSClient.extract_people(extract, UUID(int=0))
                    else:
                        people = []

                    result["extracted_people"] = people
                    result["status"] = "synced_krs"

                    # Detekcja zmian w składzie zarządu
                    known_members = entity_dict.get("dossier", {}).get("managementBoard", [])
                    known_names = {m.get("name") for m in known_members if isinstance(m, dict)}

                    for p in people:
                        if p.full_name not in known_names and "Zarząd Spółki" not in p.full_name:
                            event = GovernanceSyncEvent(
                                event_type="person_detected_in_krs",
                                entity_id=entity_id,
                                entity_name=entity_name,
                                person_name=p.full_name,
                                role=p.role.value if hasattr(p.role, "value") else str(p.role),
                                source="api-krs.ms.gov.pl/OdpisAktualny",
                                details={"role_description": p.role_description},
                            )
                            report.events.append(event)
                            report.entities_updated_count += 1
            except Exception as exc:
                logger.error(f"Błąd synchronizacji KRS dla {entity_name} ({krs}): {exc}")
                report.errors_count += 1
                report.errors.append({"entity_id": entity_id, "krs": str(krs), "error": str(exc)})

            # 2. Pobranie beneficjentów z API CRBR (jeśli podano NIP)
            if nip:
                try:
                    crbr_data = await self.crbr_client.get_beneficiaries(nip)
                    if crbr_data:
                        owners = CRBRClient.extract_beneficial_owners(crbr_data)
                        result["beneficiaries"] = owners
                        result["status"] = "synced_krs_crbr"
                except Exception as exc:
                    logger.warning(f"Błąd zapytania CRBR dla {entity_name} (NIP {nip}): {exc}")

            return result

    async def run_nightly_sync(
        self,
        entities: List[Dict[str, Any]],
        prefer_format: str = "json",
    ) -> NightlySyncReport:
        """Uruchamia pełną nocną synchronizację dla wskazanego zbioru spółek Skarbu Państwa."""
        report = NightlySyncReport()
        report.entities_scanned_count = len(entities)

        tasks = [
            self.sync_single_entity(entity, report, prefer_format=prefer_format)
            for entity in entities
        ]

        await asyncio.gather(*tasks, return_exceptions=True)
        report.finished_at = _utc_now()
        return report
