"""Testy integracyjne dla nocnego silnika synchronizacji KRS i CRBR."""

import pytest
from unittest.mock import AsyncMock, patch
from uuid import uuid4

from mapscope.registry.crbr_client import CRBRClient
from mapscope.registry.krs_client import KRSClient
from mapscope.registry.nightly_sync import NightlySyncEngine, NightlySyncReport

SAMPLE_KRS_XML = """<?xml version="1.0" encoding="UTF-8"?>
<OdpisAktualny>
    <NaglowekA>
        <NumerKRS>0000028860</NumerKRS>
        <StanZDnia>2026-10-21</StanZDnia>
    </NaglowekA>
    <Dzial2>
        <Reprezentacja>
            <NazwaOrganu>ZARZĄD</NazwaOrganu>
            <SkladZarzadu>
                <Osoba>
                    <Imiona>IRENEUSZ</Imiona>
                    <Nazwisko>FĄFARA</Nazwisko>
                    <Funkcja>PREZES ZARZĄDU</Funkcja>
                </Osoba>
                <Osoba>
                    <Imiona>WITOLD</Imiona>
                    <Nazwisko>LITERACKI</Nazwisko>
                    <Funkcja>WICEPREZES ZARZĄDU</Funkcja>
                </Osoba>
            </SkladZarzadu>
        </Reprezentacja>
        <OrganNadzoru>
            <NazwaOrganu>RADA NADZORCZA</NazwaOrganu>
            <Osoba>
                <Imiona>WOJCIECH</Imiona>
                <Nazwisko>POPIOŁEK</Nazwisko>
                <Funkcja>PRZEWODNICZĄCY RADY NADZORCZEJ</Funkcja>
            </Osoba>
        </OrganNadzoru>
    </Dzial2>
</OdpisAktualny>
"""

SAMPLE_CRBR_JSON = {
    "zgloszenie": {
        "dataZgloszenia": "2024-05-10T12:00:00Z",
        "beneficjenci": [
            {
                "imiona": "Wojciech",
                "nazwisko": "Popiołek",
                "rodzajUprawnienia": "kontrola_posrednia_msp",
                "obywatelstwo": "PL",
                "osobaEksponowanaPolitycznie": False,
                "wielkoscUdzialu": "49.90%",
            }
        ],
    }
}


def test_extract_people_from_xml():
    """Weryfikacja parsowania urzędowego XML KRS z Działu 2."""
    people = KRSClient.extract_people_from_xml(SAMPLE_KRS_XML, uuid4())
    assert len(people) == 3

    president = next((p for p in people if p.full_name == "IRENEUSZ FĄFARA"), None)
    assert president is not None
    assert president.role.value == "president"

    vice = next((p for p in people if p.full_name == "WITOLD LITERACKI"), None)
    assert vice is not None
    assert vice.role.value == "vice_president"

    rn = next((p for p in people if p.full_name == "WOJCIECH POPIOŁEK"), None)
    assert rn is not None
    assert rn.role.value == "supervisory_board_president"


def test_extract_beneficial_owners_from_crbr():
    """Weryfikacja parsowania beneficjentów z otwartego API CRBR."""
    owners = CRBRClient.extract_beneficial_owners(SAMPLE_CRBR_JSON)
    assert len(owners) == 1
    owner = owners[0]
    assert owner.full_name == "Wojciech Popiołek"
    assert owner.citizenship == "PL"
    assert owner.share_percentage == 49.90
    assert owner.is_pep is False


@pytest.mark.asyncio
async def test_nightly_sync_engine_execution():
    """Weryfikacja pełnego przebiegu nocnej synchronizacji ze strukturalnymi odpisami."""
    mock_krs_client = AsyncMock(spec=KRSClient)
    mock_krs_client.get_current_extract.return_value = SAMPLE_KRS_XML

    mock_crbr_client = AsyncMock(spec=CRBRClient)
    mock_crbr_client.get_beneficiaries.return_value = SAMPLE_CRBR_JSON

    engine = NightlySyncEngine(
        krs_client=mock_krs_client,
        crbr_client=mock_crbr_client,
        concurrency_limit=2,
        polite_delay_seconds=0.0,
    )

    test_entities = [
        {
            "id": "e-orlen",
            "name": "ORLEN S.A.",
            "krs": "0000028860",
            "nip": "7740001454",
            "dossier": {
                "managementBoard": [
                    {"name": "Stary Prezes", "role": "Prezes Zarządu"}
                ]
            },
        },
        {
            "id": "e-empty",
            "name": "Spółka bez KRS",
            "krs": None,
            "nip": None,
        },
    ]

    report = await engine.run_nightly_sync(test_entities, prefer_format="xml")

    assert report.entities_scanned_count == 2
    assert report.errors_count == 0
    assert report.finished_at is not None
    assert report.duration_seconds >= 0

    # Powinno wykryć nowe osoby powołane do zarządu ORLENU (Ireneusz Fąfara, Witold Literacki)
    detected_names = [e.person_name for e in report.events]
    assert "IRENEUSZ FĄFARA" in detected_names
    assert "WITOLD LITERACKI" in detected_names

    # Weryfikacja formatu raportu
    report_dict = report.to_dict()
    assert report_dict["entities_scanned_count"] == 2
    assert report_dict["events_count"] == len(report.events)
    assert report_dict["krs_api_connected"] is True
