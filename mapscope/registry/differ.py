"""Silnik porównawczy (Differ) migawek rejestru spółek Skarbu Państwa."""

from decimal import Decimal
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from mapscope.models.entity import Entity, EntityCreate


class RegistryDelta:
    """Zestawienie zmian pomiędzy dwoma stanami rejestru spółek."""

    def __init__(self) -> None:
        self.added: List[EntityCreate] = []
        self.removed: List[Entity] = []
        self.share_changes: List[Dict[str, Any]] = []
        self.status_changes: List[Dict[str, Any]] = []
        self.body_changes: List[Dict[str, Any]] = []
        self.audit_events: List[Dict[str, Any]] = []

    @property
    def has_changes(self) -> bool:
        return bool(
            self.added
            or self.removed
            or self.share_changes
            or self.status_changes
            or self.body_changes
        )


class RegistryDiffer:
    """Weryfikacja różnic i detekcja zdarzeń właścicielskich (ADR-002)."""

    @classmethod
    def _build_key(cls, entity: Union[Entity, EntityCreate]) -> str:
        """Klucz tożsamości podmiotu: priorytet KRS, potem NIP, na końcu znormalizowana nazwa."""
        if entity.krs:
            return f"krs:{entity.krs}"
        if entity.nip:
            return f"nip:{entity.nip}"
        return f"name:{entity.name.strip().lower()}"

    @classmethod
    def compute_diff(
        cls,
        previous_entities: List[Entity],
        new_entities: List[EntityCreate],
        snapshot_id: Optional[UUID] = None,
    ) -> RegistryDelta:
        """Porównuje stany rejestru i generuje listę zdarzeń audytowych."""
        delta = RegistryDelta()

        prev_map: Dict[str, Entity] = {cls._build_key(e): e for e in previous_entities}
        new_map: Dict[str, EntityCreate] = {cls._build_key(e): e for e in new_entities}

        # 1. Wykrywanie nowych spółek
        for key, new_e in new_map.items():
            if key not in prev_map:
                delta.added.append(new_e)
                delta.audit_events.append(
                    {
                        "event_type": "entity_added",
                        "actor": "registry_importer",
                        "payload": {
                            "name": new_e.name,
                            "krs": new_e.krs,
                            "nip": new_e.nip,
                            "state_share_percent": str(new_e.state_share_percent),
                            "ownership_body": new_e.ownership_body,
                            "status": new_e.status.value,
                            "snapshot_id": str(snapshot_id) if snapshot_id else None,
                        },
                    }
                )

        # 2. Wykrywanie spółek usuniętych z rejestru
        for key, prev_e in prev_map.items():
            if key not in new_map:
                delta.removed.append(prev_e)
                delta.audit_events.append(
                    {
                        "event_type": "entity_removed",
                        "entity_id": str(prev_e.id),
                        "actor": "registry_importer",
                        "payload": {
                            "name": prev_e.name,
                            "krs": prev_e.krs,
                            "nip": prev_e.nip,
                            "previous_share_percent": str(prev_e.state_share_percent),
                            "snapshot_id": str(snapshot_id) if snapshot_id else None,
                        },
                    }
                )

        # 3. Wykrywanie modyfikacji w istniejących spółkach
        for key, new_e in new_map.items():
            if key in prev_map:
                prev_e = prev_map[key]

                # Zmiana % udziału Skarbu Państwa
                if new_e.state_share_percent != prev_e.state_share_percent:
                    change_info = {
                        "entity_id": prev_e.id,
                        "name": prev_e.name,
                        "old_share": prev_e.state_share_percent,
                        "new_share": new_e.state_share_percent,
                        "difference": new_e.state_share_percent - prev_e.state_share_percent,
                    }
                    delta.share_changes.append(change_info)
                    delta.audit_events.append(
                        {
                            "event_type": "ownership_percent_changed",
                            "entity_id": str(prev_e.id),
                            "actor": "registry_importer",
                            "payload": {
                                "old_share": str(prev_e.state_share_percent),
                                "new_share": str(new_e.state_share_percent),
                                "difference": str(change_info["difference"]),
                                "snapshot_id": str(snapshot_id) if snapshot_id else None,
                            },
                        }
                    )

                # Zmiana statusu prawnego (np. otwarcie likwidacji lub restrukturyzacji)
                if new_e.status != prev_e.status:
                    status_info = {
                        "entity_id": prev_e.id,
                        "name": prev_e.name,
                        "old_status": prev_e.status.value,
                        "new_status": new_e.status.value,
                    }
                    delta.status_changes.append(status_info)
                    delta.audit_events.append(
                        {
                            "event_type": "status_changed",
                            "entity_id": str(prev_e.id),
                            "actor": "registry_importer",
                            "payload": status_info,
                        }
                    )

                # Zmiana organu wykonującego prawa z akcji
                if new_e.ownership_body.strip() != prev_e.ownership_body.strip():
                    body_info = {
                        "entity_id": prev_e.id,
                        "name": prev_e.name,
                        "old_body": prev_e.ownership_body,
                        "new_body": new_e.ownership_body,
                    }
                    delta.body_changes.append(body_info)
                    delta.audit_events.append(
                        {
                            "event_type": "ownership_body_changed",
                            "entity_id": str(prev_e.id),
                            "actor": "registry_importer",
                            "payload": body_info,
                        }
                    )

        return delta
