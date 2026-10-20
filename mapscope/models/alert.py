"""Modele Pydantic dla alertów wczesnego ostrzegania (P1/P2/P3)."""

from datetime import datetime, timezone
from typing import List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from mapscope.models.enums import AlertPriority, AlertStatus


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class AlertBase(BaseModel):
    """Podstawowe dane alertu kryzysowego."""

    entity_id: UUID
    risk_assessment_id: Optional[UUID] = None
    priority: AlertPriority
    title: str = Field(..., min_length=5)
    summary: str = Field(..., min_length=10)
    status: AlertStatus = AlertStatus.PENDING
    dispatched_channels: List[str] = Field(default_factory=list)


class Alert(AlertBase):
    """Kompletny alert w bazie danych."""

    id: UUID = Field(default_factory=uuid4)
    dispatched_at: Optional[datetime] = None
    acknowledged_at: Optional[datetime] = None
    acknowledged_by: Optional[str] = None
    created_at: datetime = Field(default_factory=_utc_now)
