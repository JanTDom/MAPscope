"""Modele Pydantic dla dialogu społecznego, sporów zbiorowych i negocjacji płacowych w SSP."""

from datetime import date, datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DisputeLegalStage(str, Enum):
    ROKOWANIA = "ROKOWANIA"
    PROTOKOL_ROZBIEZNOSCI = "PROTOKOL_ROZBIEZNOSCI"
    MEDIACJA_MRPIPS = "MEDIACJA_MRPIPS"
    STRAJK_OSTRZEGAWCZY = "STRAJK_OSTRZEGAWCZY"
    REFERENDUM_STRAJKOWE = "REFERENDUM_STRAJKOWE"
    POGOTOWIE_STRAJKOWE = "POGOTOWIE_STRAJKOWE"
    STRAJK_GENERALNY = "STRAJK_GENERALNY"
    POROZUMIENIE_ZAWISLE = "POROZUMIENIE_ZAWISLE"


class DisputeThreatLevel(str, Enum):
    KRYTYCZNY = "KRYTYCZNY"
    WYSOKI = "WYSOKI"
    UMIARKOWANY = "UMIARKOWANY"
    MONITOROWANY = "MONITOROWANY"


class LaborDispute(BaseModel):
    """Pojedynczy formalny spór zbiorowy zarejestrowany w podmiocie Skarbu Państwa."""

    id: str = Field(..., description="Unikalny identyfikator sporu")
    entity_name: str
    ticker: str
    voivodeship: str
    facility_location: str
    unions_involved: List[str]
    demand_summary: str
    estimated_annual_cost_mln_pln: float
    workers_affected_count: int
    legal_stage: DisputeLegalStage
    threat_level: DisputeThreatLevel
    is_zuzp_threatened: bool = False
    mediator_assigned: Optional[str] = None
    next_deadline_date: str
    next_deadline_description: str
    ministerial_negotiation_line: str
    map_political_risk: str
    created_at: datetime = Field(default_factory=_utc_now)


class SocialDialogueCalendarItem(BaseModel):
    """Wydarzenie w kalendarzu dialogu społecznego i negocjacji płacowych."""

    id: str
    event_date: str
    entity_ticker: str
    entity_name: str
    voivodeship: str
    event_type: str
    title: str
    description: str
    threat_level: DisputeThreatLevel
    action_required_by_map: Optional[str] = None


class SocialDialogueSummary(BaseModel):
    """Zagregowany bilans dialogu społecznego i napięć płacowych w SSP."""

    total_active_disputes: int
    critical_disputes_count: int
    total_workers_affected: int
    total_wage_demands_cost_mln_pln: float
    disputes_by_voivodeship: Dict[str, int]
    zuzp_threatened_count: int
    calendar_events_next_30_days: int
