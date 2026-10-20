"""Testy modeli domenowych Pydantic."""

from decimal import Decimal
from uuid import uuid4

import pytest

from mapscope.models.alert import Alert
from mapscope.models.disclosure import CompanyDisclosureCreate
from mapscope.models.entity import EntityCreate
from mapscope.models.enums import (
    AlertPriority,
    AlertStatus,
    DisclosureChannel,
    DisclosureType,
    EntityStatus,
    OwnershipType,
    RiskSeverity,
)
from mapscope.models.risk import (
    CommunicationRiskMatrix,
    GovernanceRiskMatrix,
    RiskAssessmentBase,
)


def test_entity_create_model():
    """Tworzenie encji podmiotu z konwersją procentów i rygorystycznymi polami."""
    entity = EntityCreate(
        name="ORLEN S.A.",
        formal_name="ORLEN Spółka Akcyjna",
        nip="7740001454",
        krs="0000028860",
        regon="610188201",
        state_share_percent="49,90%",
        ownership_body="Minister Aktywów Państwowych",
        sector="Paliwa i Energetyka",
    )
    assert entity.state_share_percent == Decimal("49.90")
    assert entity.status == EntityStatus.ACTIVE
    assert entity.ownership_type == OwnershipType.DIRECT


def test_company_disclosure_hash_computation():
    """Sprawdzenie unikalnego hashowania oświadczeń spółki."""
    entity_id = uuid4()
    disclosure = CompanyDisclosureCreate(
        entity_id=entity_id,
        disclosure_type=DisclosureType.OFFICIAL_STATEMENT,
        title="Oświadczenie Zarządu w sprawie dostaw ropy",
        content="Zarząd spółki informuje, że dostawy surowca do rafinerii przebiegają bez zakłóceń.",
        channel=DisclosureChannel.PRESS_OFFICE,
        published_at="2026-10-20T12:00:00Z",
    )
    assert disclosure.content_hash is not None
    assert len(disclosure.content_hash) == 64


def test_risk_assessment_model():
    """Weryfikacja modelu oceny ryzyka z matrycami komunikacyjną i właścicielską."""
    target_id = uuid4()
    entity_id = uuid4()

    comm_matrix = CommunicationRiskMatrix(
        blad_narracyjny=True,
        rozdzwiek_z_rzadem=False,
        zaognienie_konfliktu=True,
        ryzyko_regulacyjne_mar=False,
        szczegoly={"blad_narracyjny": "Wycofanie pierwotnego oświadczenia"},
    )

    gov_matrix = GovernanceRiskMatrix(
        kadry_spory=False,
        kontrole_sledztwa=True,
        finanse_plynnosc=False,
        infrastruktura_awarie=False,
        narracja_polityczna=True,
    )

    assessment = RiskAssessmentBase(
        target_type="disclosure",
        target_id=target_id,
        entity_id=entity_id,
        severity=RiskSeverity.P2_HIGH,
        overall_risk_score=Decimal("6.5"),
        communication_risks=comm_matrix,
        governance_risks=gov_matrix,
        executive_summary="Spółka opublikowała niespójne oświadczenie w reakcji na kontrolę CBA.",
        map_impact_analysis="Możliwe pytania poselskie do sekretarza stanu w MAP nadzorującego podmiot.",
        recommended_action="Zlecenie audytu komunikacji spółki.",
    )

    assert assessment.severity == RiskSeverity.P2_HIGH
    assert assessment.overall_risk_score == Decimal("6.5")
    assert assessment.communication_risks.blad_narracyjny is True
    assert assessment.governance_risks.kontrole_sledztwa is True


def test_alert_model():
    """Weryfikacja alertu kryzysowego."""
    alert = Alert(
        entity_id=uuid4(),
        priority=AlertPriority.P1,
        title="Krytyczny błąd w komunikacji zarządu",
        summary="Oświadczenie zarządu stoi w bezpośredniej sprzeczności z porannym komunikatem premiera.",
        status=AlertStatus.PENDING,
        dispatched_channels=["telegram", "email"],
    )
    assert alert.priority == AlertPriority.P1
    assert alert.status == AlertStatus.PENDING
