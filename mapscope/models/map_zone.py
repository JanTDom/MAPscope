"""Modele Pydantic dla Strefy MAP: kierownictwo, komunikacja resortowa i kryzysy bezpośrednie."""

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class MapLeadershipRole(str, Enum):
    MINISTER = "MINISTER"
    SEKRETARZ_STANU = "SEKRETARZ_STANU"
    PODSEKRETARZ_STANU = "PODSEKRETARZ_STANU"
    DYREKTOR_GENERALNY = "DYREKTOR_GENERALNY"
    RZECZNIK_PRASOWY = "RZECZNIK_PRASOWY"


class PressInquiryUrgency(str, Enum):
    PILNE_DO_2H = "PILNE_DO_2H"
    DZISIAJ = "DZISIAJ"
    USTAWOWE_14DNI = "USTAWOWE_14DNI"
    ZREALIZOWANE = "ZREALIZOWANE"


class MapCrisisSeverity(str, Enum):
    KRYTYCZNE = "KRYTYCZNE"
    WYSOKIE = "WYSOKIE"
    SREDNIE = "SREDNIE"
    MONITOROWANE = "MONITOROWANE"


class MapLeadershipMember(BaseModel):
    """Członek ścisłego kierownictwa Ministerstwa Aktywów Państwowych."""

    id: str
    name: str
    role: MapLeadershipRole
    title: str
    supervised_departments: List[str]
    assigned_sectors: List[str]
    active_crises_count: int
    media_sentiment_score: float = Field(..., ge=-1.0, le=1.0)
    current_key_topics: List[str]


class MapPressRelease(BaseModel):
    """Oficjalny komunikat prasowy lub sprostowanie opublikowane przez MAP."""

    id: str
    title: str
    category: str
    published_at: str
    channel: str
    summary: str
    key_quotes: List[str]
    is_rectification: bool = False
    target_media_outlet: Optional[str] = None
    defense_strength_score: float = Field(default=0.85, ge=0.0, le=1.0)


class MapPressInquiry(BaseModel):
    """Zapytanie dziennikarskie skierowane do Biura Prasowego MAP."""

    id: str
    media_outlet: str
    journalist_name: str
    received_at: str
    deadline_at: str
    urgency: PressInquiryUrgency
    subject: str
    detailed_questions: List[str]
    political_risk_score: float = Field(..., ge=0.0, le=1.0)
    assigned_spokesperson_line: str
    facts_and_figures: str
    status: str


class MapDirectCrisis(BaseModel):
    """Kryzys wizerunkowy, kontrola lub incydent uderzający bezpośrednio w MAP."""

    id: str
    title: str
    severity: MapCrisisSeverity
    category: str
    incident_date: str
    affected_leadership: List[str]
    summary: str
    opposition_attack_vector: str
    ministerial_counter_narrative: str
    street_protest_threat: bool = False
    parliamentary_control_active: bool = False
    action_items_for_cabinet: List[str]


class MapZoneSummary(BaseModel):
    """Zbiorczy stan bezpieczeństwa wizerunkowego i operacyjnego Ministerstwa Aktywów Państwowych."""

    overall_map_tension_index: int = Field(..., ge=0, le=100)
    active_press_inquiries_count: int
    critical_direct_crises_count: int
    pending_parliamentary_inquiries_count: int
    registered_street_protests_count: int
    press_releases_this_month_count: int
    average_spokesperson_response_time_hours: float
