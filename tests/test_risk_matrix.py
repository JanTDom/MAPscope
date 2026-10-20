"""Testy matrycy oceny ryzyka komunikacyjnego i właścicielskiego."""

from decimal import Decimal
from uuid import uuid4

import pytest

from mapscope.models.enums import RiskSeverity
from mapscope.risk.matrix import RiskEvaluator


def test_evaluate_triggers_communication_conflict():
    """Wykrycie sporu ze związkami zawodowymi i arogancji w komunikacji."""
    title = "Zarząd odrzuca postulaty płacowe: związki zawodowe grożą pikietą"
    content = "W oświadczeniu zarząd określił postulaty płacowe jako nierealne. Związki zawodowe ogłosiły groźbę strajku i pikietę."

    comm_m, gov_m, triggers = RiskEvaluator.evaluate_text_triggers(title, content)

    assert comm_m.zaognienie_konfliktu is True
    assert triggers >= 1


def test_evaluate_triggers_government_rift():
    """Wykrycie rozbieżności z rządem i MAP."""
    title = "Prezes spółki: MAP nie konsultowało z nami tej decyzji"
    content = "W wywiadzie dla mediów zarząd oświadczył: odmienne zdanie niż minister w sprawie fuzji."

    comm_m, gov_m, triggers = RiskEvaluator.evaluate_text_triggers(title, content)

    assert comm_m.rozdzwiek_z_rzadem is True


def test_evaluate_triggers_governance_investigation():
    """Wykrycie kontroli CBA / NIK i dymisji zarządu."""
    title = "CBA weszło do siedziby spółki. Dymisja wiceprezesa"
    content = "Agenci CBA zabezpieczają dokumenty w sprawie przetargów. Prokuratura wszczęła śledztwo, a rada nadzorcza przyjęła dymisję członka zarządu."

    comm_m, gov_m, triggers = RiskEvaluator.evaluate_text_triggers(title, content)

    assert gov_m.kontrole_sledztwa is True
    assert gov_m.kadry_spory is True


def test_calculate_heuristic_score_critical_p1():
    """Weryfikacja eskalacji do poziomu P1_CRITICAL dla strategicznej spółki."""
    title = "Awaria krytyczna w rafinerii, paraliż dostaw. CBA bada sprawę"
    content = "Doszło do wstrzymania produkcji po awarii. CBA i prokuratura badają podejrzenie sabotażu. Odmienne zdanie niż minister."

    assessment = RiskEvaluator.evaluate_preliminary(
        target_id=uuid4(),
        entity_id=uuid4(),
        entity_name="ORLEN S.A.",
        title=title,
        content=content,
        is_strategic=True,
    )

    assert assessment.severity == RiskSeverity.P1_CRITICAL
    assert assessment.overall_risk_score >= Decimal("7.0")
    assert "MAP" in assessment.map_impact_analysis
    assert assessment.recommended_action is not None
