"""Testy jednostkowe modułu dialogu społecznego i rejestru sporów zbiorowych."""

from datetime import datetime, timezone
import pytest

from mapscope.models.social_dialogue import (
    DisputeLegalStage,
    DisputeThreatLevel,
    LaborDispute,
    SocialDialogueCalendarItem,
    SocialDialogueSummary,
)


def test_labor_dispute_creation() -> None:
    dispute = LaborDispute(
        id="disp-pkp-cargo-01",
        entity_name="PKP CARGO S.A. w restrukturyzacji",
        ticker="PKPCARGO",
        voivodeship="Mazowieckie / Ogólnopolskie",
        facility_location="Warszawa, Katowice, Tarnowskie Góry",
        unions_involved=[
            "NSZZ Solidarność",
            "Federacja Związków Zawodowych Kolejarzy",
            "Związek Zawodowy Maszynistów Kolejowych w Polsce",
        ],
        demand_summary="Wstrzymanie zwolnień grupowych i przywrócenie zawieszonych świadczeń z ZUZP",
        estimated_annual_cost_mln_pln=185.0,
        workers_affected_count=4142,
        legal_stage=DisputeLegalStage.PROTOKOL_ROZBIEZNOSCI,
        threat_level=DisputeThreatLevel.KRYTYCZNY,
        is_zuzp_threatened=True,
        mediator_assigned="Wyznaczony z listy MRPiPS (Jan Kowalski)",
        next_deadline_date="2026-10-28",
        next_deadline_description="Posiedzenie Wojewódzkiej Rady Dialogu Społecznego w Katowicach",
        ministerial_negotiation_line="Priorytet utrzymania płynności spółki i procedury sanacyjnej przy minimalizacji kosztu społecznego",
        map_political_risk="Protesty głodowe przed gmachem MAP w Warszawie i blokady torów magistrali węglowej",
    )

    assert dispute.id == "disp-pkp-cargo-01"
    assert dispute.is_zuzp_threatened is True
    assert dispute.legal_stage == DisputeLegalStage.PROTOKOL_ROZBIEZNOSCI
    assert dispute.threat_level == DisputeThreatLevel.KRYTYCZNY
    assert len(dispute.unions_involved) == 3


def test_social_dialogue_calendar_item() -> None:
    event = SocialDialogueCalendarItem(
        id="cal-jsw-01",
        event_date="2026-10-25",
        entity_ticker="JSW",
        entity_name="Jastrzębska Spółka Węglowa S.A.",
        voivodeship="Śląskie",
        event_type="MEDIACJA",
        title="Druga tura mediacji płacowych ws. deputatu węglowego i wskaźnika wzrostu płac",
        description="Mediacje z udziałem Reprezentatywnych Związków Zawodowych JSW i mediatora z listy ministerialnej",
        threat_level=DisputeThreatLevel.WYSOKI,
        action_required_by_map="Wytyczne Departamentu Nadzoru I w MAP odnośnie dopuszczalnego buforu płacowego",
    )

    assert event.entity_ticker == "JSW"
    assert event.threat_level == DisputeThreatLevel.WYSOKI
    assert event.action_required_by_map is not None


def test_social_dialogue_summary_aggregation() -> None:
    summary = SocialDialogueSummary(
        total_active_disputes=7,
        critical_disputes_count=3,
        total_workers_affected=42500,
        total_wage_demands_cost_mln_pln=890.5,
        disputes_by_voivodeship={
            "Śląskie": 3,
            "Mazowieckie": 2,
            "Podkarpackie": 1,
            "Dolnośląskie": 1,
        },
        zuzp_threatened_count=4,
        calendar_events_next_30_days=12,
    )

    assert summary.total_active_disputes == 7
    assert summary.critical_disputes_count == 3
    assert summary.disputes_by_voivodeship["Śląskie"] == 3
