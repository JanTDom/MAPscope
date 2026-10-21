"""Testy jednostkowe modułu Strefy MAP (kierownictwo, zapytania prasowe, komunikacja, kryzysy bezpośrednie)."""

import pytest
from mapscope.models.map_zone import (
    MapCrisisSeverity,
    MapDirectCrisis,
    MapLeadershipMember,
    MapLeadershipRole,
    MapPressInquiry,
    MapPressRelease,
    MapZoneSummary,
    PressInquiryUrgency,
)


def test_map_leadership_member_creation() -> None:
    leader = MapLeadershipMember(
        id="lead-01",
        name="Wojciech Balczun",
        role=MapLeadershipRole.MINISTER,
        title="Minister Aktywów Państwowych",
        supervised_departments=[
            "Departament Spółek Strategicznych",
            "Departament Nadzoru I",
            "Biuro Ministra",
        ],
        assigned_sectors=["Paliwa i Energetyka", "Nadzór Właścicielski Ogólny"],
        active_crises_count=3,
        media_sentiment_score=-0.15,
        current_key_topics=[
            "Restrukturyzacja Grupy Azoty",
            "Sanacja PKP CARGO",
            "Kowenanty energetyczne",
        ],
    )

    assert leader.role == MapLeadershipRole.MINISTER
    assert leader.name == "Wojciech Balczun"
    assert len(leader.supervised_departments) == 3
    assert leader.active_crises_count == 3


def test_map_press_inquiry_and_release() -> None:
    inquiry = MapPressInquiry(
        id="inq-press-01",
        media_outlet="Rzeczpospolita",
        journalist_name="Piotr Mazurkiewicz",
        received_at="2026-10-21 09:30",
        deadline_at="2026-10-21 14:00",
        urgency=PressInquiryUrgency.DZISIAJ,
        subject="Pytanie o planowane dokapitalizowanie Poczty Polskiej",
        detailed_questions=[
            "Czy MAP wnioskuje do KPRM o środki z rezerwy celowej?",
            "Jaka jest opinia UOKiK w kontekście pomocy publicznej UE?",
        ],
        political_risk_score=0.75,
        assigned_spokesperson_line="MAP działa w oparciu o znowelizowaną ustawę o prawie pocztowym i notyfikację KE",
        facts_and_figures="Wypłata rekompensaty za lata 2021-2022 w kwocie 750 mln zł",
        status="W_OPRACOWANIU",
    )

    assert inquiry.media_outlet == "Rzeczpospolita"
    assert inquiry.urgency == PressInquiryUrgency.DZISIAJ
    assert inquiry.political_risk_score == 0.75

    release = MapPressRelease(
        id="rel-01",
        title="Oświadczenie MAP w sprawie standardów rekrutacji w spółkach portfelowych",
        category="KOMUNIKAT_PRASOWY",
        published_at="2026-10-20 18:00",
        channel="gov.pl/aktywa-panstwowe",
        summary="MAP przypomina o wymogu transparentnych postępowań kwalifikacyjnych",
        key_quotes=["Każde stanowisko dyrektorskie musi podlegać otwartej weryfikacji kompetencji"],
        is_rectification=False,
    )

    assert release.is_rectification is False
    assert release.channel == "gov.pl/aktywa-panstwowe"


def test_map_direct_crisis_and_summary() -> None:
    crisis = MapDirectCrisis(
        id="cris-map-01",
        title="Pikieta związkowców pod gmachem MAP przy ul. Kruczej 36",
        severity=MapCrisisSeverity.KRYTYCZNE,
        category="PROTESTY_SPOLECZNE",
        incident_date="2026-10-22",
        affected_leadership=["Minister", "Sekretarz Stanu ds. Dialogu Społecznego"],
        summary="Zapowiedziany protest związkowców z branży kolejowej i pocztowej przed głównym wejściem do ministerstwa.",
        opposition_attack_vector="Zarzut bezduszności społecznej rządu i braku dialogu z reprezentatywnymi związkami.",
        ministerial_counter_narrative="MAP zaprosiło delegację protestujących do sali konferencyjnej, proces sanacyjny ratuje tysiące miejsc pracy.",
        street_protest_threat=True,
        parliamentary_control_active=True,
        action_items_for_cabinet=[
            "Wzmocnienie ochrony gmachu we współpracy ze Służbą Ochrony Państwa i Policją",
            "Wyznaczenie zespołu negocjacyjnego pod przewodnictwem Podsekretarza Stanu",
            "Przygotowanie komunikatów dla mediów z faktami o odprawach i programach outplacementowych",
        ],
    )

    assert crisis.severity == MapCrisisSeverity.KRYTYCZNE
    assert crisis.street_protest_threat is True
    assert len(crisis.action_items_for_cabinet) == 3

    summary = MapZoneSummary(
        overall_map_tension_index=72,
        active_press_inquiries_count=6,
        critical_direct_crises_count=2,
        pending_parliamentary_inquiries_count=14,
        registered_street_protests_count=2,
        press_releases_this_month_count=18,
        average_spokesperson_response_time_hours=3.5,
    )

    assert summary.overall_map_tension_index == 72
    assert summary.active_press_inquiries_count == 6
