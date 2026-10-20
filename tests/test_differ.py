"""Testy silnika różnicowego rejestru spółek (RegistryDiffer)."""

from decimal import Decimal
from uuid import uuid4

import pytest

from mapscope.models.entity import Entity, EntityCreate
from mapscope.models.enums import EntityStatus, OwnershipType
from mapscope.registry.differ import RegistryDiffer


def test_registry_differ_detection():
    """Weryfikacja detekcji dodania, usunięcia, zmiany udziałów i zmiany statusu."""
    # Stan poprzedni: 2 spółki
    prev_e1 = Entity(
        id=uuid4(),
        name="Spółka Paliwowa S.A.",
        krs="0000011111",
        nip="1111111111",
        state_share_percent=Decimal("51.00"),
        ownership_body="Minister Aktywów Państwowych",
        status=EntityStatus.ACTIVE,
        sector="Paliwa",
    )
    prev_e2 = Entity(
        id=uuid4(),
        name="Stara Huta Sp. z o.o.",
        krs="0000022222",
        nip="2222222222",
        state_share_percent=Decimal("100.00"),
        ownership_body="Minister Aktywów Państwowych",
        status=EntityStatus.ACTIVE,
        sector="Hutnictwo",
    )

    # Stan nowy:
    # 1. Spółka Paliwowa ma zwiększony udział do 60% i zmianę organu na MAP
    # 2. Stara Huta przeszła w likwidację
    # 3. Nowa Spółka Energetyczna została dodana
    new_e1 = EntityCreate(
        name="Spółka Paliwowa S.A.",
        krs="0000011111",
        nip="1111111111",
        state_share_percent=Decimal("60.00"),
        ownership_body="Minister Klimatu i Środowiska",
        status=EntityStatus.ACTIVE,
        sector="Paliwa",
    )
    new_e2 = EntityCreate(
        name="Stara Huta Sp. z o.o. w likwidacji",
        krs="0000022222",
        nip="2222222222",
        state_share_percent=Decimal("100.00"),
        ownership_body="Minister Aktywów Państwowych",
        status=EntityStatus.LIQUIDATION,
        sector="Hutnictwo",
    )
    new_e3 = EntityCreate(
        name="Nowa Spółka Energetyczna S.A.",
        krs="0000033333",
        nip="3333333333",
        state_share_percent=Decimal("100.00"),
        ownership_body="Minister Aktywów Państwowych",
        status=EntityStatus.ACTIVE,
        sector="Energetyka",
    )

    delta = RegistryDiffer.compute_diff(
        previous_entities=[prev_e1, prev_e2],
        new_entities=[new_e1, new_e2, new_e3],
    )

    assert delta.has_changes is True
    # Dodana 1 nowa spółka
    assert len(delta.added) == 1
    assert delta.added[0].name == "Nowa Spółka Energetyczna S.A."

    # Zmiana udziałów w Spółce Paliwowej (51% -> 60%)
    assert len(delta.share_changes) == 1
    assert delta.share_changes[0]["difference"] == Decimal("9.00")

    # Zmiana statusu w Starej Hucie (ACTIVE -> LIQUIDATION)
    assert len(delta.status_changes) == 1
    assert delta.status_changes[0]["new_status"] == EntityStatus.LIQUIDATION.value

    # Zmiana organu właścicielskiego
    assert len(delta.body_changes) == 1

    # Weryfikacja zdarzeń audytowych
    assert len(delta.audit_events) == 4
