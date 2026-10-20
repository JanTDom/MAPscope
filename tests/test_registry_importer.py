"""Testy importera oficjalnego rejestru BIP MAP / dane.gov.pl."""

from decimal import Decimal
from pathlib import Path

import pytest

from mapscope.models.enums import (
    EntityStatus,
    OwnershipType,
    StrategicImportance,
)
from mapscope.registry.importer import (
    RegistryImporter,
    detect_ownership_type,
    detect_status,
    detect_strategic_importance,
)


def test_detect_status():
    """Weryfikacja detekcji statusu spółki."""
    assert detect_status("ORLEN S.A.") == EntityStatus.ACTIVE
    assert detect_status("Przedsiębiorstwo Komunalne w likwidacji") == EntityStatus.LIQUIDATION
    assert detect_status("Zakłady Chemiczne S.A. w upadłości") == EntityStatus.BANKRUPTCY
    assert detect_status("PKP CARGO S.A. w restrukturyzacji") == EntityStatus.RESTRUCTURING


def test_detect_ownership_type():
    """Weryfikacja klasyfikacji typu własności."""
    assert detect_ownership_type(Decimal("100.0")) == OwnershipType.WHOLLY_OWNED
    assert detect_ownership_type(Decimal("60.86")) == OwnershipType.MAJORITY
    assert detect_ownership_type(Decimal("49.90")) == OwnershipType.MINORITY
    assert detect_ownership_type(Decimal("29.43")) == OwnershipType.MINORITY


def test_detect_strategic_importance():
    """Weryfikacja klasyfikacji wagi spółki."""
    assert detect_strategic_importance("KGHM Polska Miedź S.A.", Decimal("31.79")) == StrategicImportance.STRATEGIC
    assert detect_strategic_importance("PGE Polska Grupa Energetyczna", Decimal("60.86")) == StrategicImportance.STRATEGIC
    assert detect_strategic_importance("Regionalne Wodociągi Sp. z o.o.", Decimal("100.0")) == StrategicImportance.KEY


def test_import_from_sample_csv():
    """Test importu pełnego oficjalnego wykazu podmiotów z pliku CSV."""
    sample_path = Path(__file__).parent.parent / "data" / "wykaz_spolek_skarb_panstwa_sample.csv"
    assert sample_path.exists(), "Brak pliku z danymi testowymi"

    with open(sample_path, "r", encoding="utf-8") as f:
        content = f.read()

    snapshot, entities = RegistryImporter.import_from_csv(
        csv_content=content,
        source_url="https://map.gov.pl/bip/wykaz",
        source_filename="wykaz_spolek_skarb_panstwa_sample.csv",
    )

    assert snapshot.total_entities_count == 13
    assert len(entities) == 13
    assert snapshot.file_sha256 is not None

    # Weryfikacja ORLEN
    orlen = next(e for e in entities if "ORLEN" in e.name)
    assert orlen.nip == "7740001454"
    assert orlen.krs == "0000028860"
    assert orlen.state_share_percent == Decimal("49.90")
    assert orlen.strategic_importance == StrategicImportance.STRATEGIC
    assert orlen.is_public_listed is True
    assert orlen.stock_ticker == "PKN"

    # Weryfikacja spółki w restrukturyzacji (PKP Cargo)
    cargo = next(e for e in entities if "PKP CARGO" in e.name)
    assert cargo.status == EntityStatus.RESTRUCTURING

    # Weryfikacja spółki w likwidacji (PK Ziemi Lubuskiej)
    likwidacja = next(e for e in entities if "w likwidacji" in e.name)
    assert likwidacja.status == EntityStatus.LIQUIDATION
