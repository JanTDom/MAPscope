"""Modele Pydantic dla zdarzeń webhooków z serwera KNF ESPI oraz PAP Biznes."""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from mapscope.models.espi_xbrl import EspiXbrlPeriodicReportModel


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class WebhookSource(str, Enum):
    KNF_ESPI = "KNF_ESPI"
    PAP_BIZNES = "PAP_BIZNES"


class WebhookEventType(str, Enum):
    PERIODIC_REPORT_PUBLISHED = "PERIODIC_REPORT_PUBLISHED"
    CURRENT_REPORT_PUBLISHED = "CURRENT_REPORT_PUBLISHED"
    REPORT_CORRECTION = "REPORT_CORRECTION"
    SYSTEM_HEARTBEAT = "SYSTEM_HEARTBEAT"


class EspiWebhookPayload(BaseModel):
    """Ciało żądania webhooka przesyłane z serwera KNF ESPI lub PAP Biznes."""

    event_id: str = Field(..., description="Unikalny identyfikator depeszy lub transmisji")
    source: WebhookSource
    event_type: WebhookEventType
    ticker: str
    entity_name: str
    report_number: str
    published_at: str
    raw_content: Optional[str] = Field(None, description="Zawartość sprawozdania XML / iXBRL / depeszy")
    signature: Optional[str] = Field(None, description="Podpis kryptograficzny HMAC-SHA256")
    timestamp: int = Field(..., description="UNIX timestamp nadania żądania")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WebhookProcessingResult(BaseModel):
    """Wynik asynchronicznego przetworzenia webhooka w tle."""

    id: UUID = Field(default_factory=uuid4)
    event_id: str
    source: WebhookSource
    ticker: str
    status: str
    is_periodic_report: bool = False
    covenant_breached: bool = False
    mar_risk_flag: bool = False
    parsed_report: Optional[EspiXbrlPeriodicReportModel] = None
    ministerial_alert_required: bool = False
    message: str
    processed_at: datetime = Field(default_factory=_utc_now)
