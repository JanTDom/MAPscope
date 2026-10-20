"""Modele Pydantic dla własnej komunikacji spółek (oświadczenia, wywiady, ESPI)."""

from datetime import datetime, timezone
from hashlib import sha256
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, model_validator

from mapscope.models.enums import DisclosureChannel, DisclosureType


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CompanyDisclosureBase(BaseModel):
    """Własny przekaz komunikacyjny podmiotu z udziałem Skarbu Państwa."""

    entity_id: UUID
    disclosure_type: DisclosureType
    title: str = Field(..., min_length=2)
    content: str = Field(..., min_length=5)
    raw_content: Optional[str] = None
    source_url: Optional[str] = None
    channel: DisclosureChannel
    speaker_person_id: Optional[UUID] = None
    published_at: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)


class CompanyDisclosureCreate(CompanyDisclosureBase):
    """Tworzenie nowego materiału komunikacji własnej spółki."""

    content_hash: Optional[str] = None

    @model_validator(mode="after")
    def compute_content_hash(self) -> "CompanyDisclosureCreate":
        if not self.content_hash:
            # Hash z treści, tytułu i daty w celu unikalności
            payload = f"{self.entity_id}:{self.title.strip()}:{self.content.strip()}"
            self.content_hash = sha256(payload.encode("utf-8")).hexdigest()
        return self


class CompanyDisclosure(CompanyDisclosureBase):
    """Zapisane oświadczenie spółki w bazie danych."""

    id: UUID = Field(default_factory=uuid4)
    content_hash: str
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=_utc_now)
