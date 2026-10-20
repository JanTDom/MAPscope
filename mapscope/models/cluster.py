"""Modele Pydantic dla klastrów wydarzeń medialno-właścicielskich."""

from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from mapscope.models.enums import ClusterStatus, RiskSeverity


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ClusterItem(BaseModel):
    """Element przypisany do klastra (artykuł prasowy lub oświadczenie spółki)."""

    id: UUID = Field(default_factory=uuid4)
    cluster_id: UUID
    item_type: Literal["article", "disclosure"]
    item_id: UUID
    similarity_score: Optional[float] = None
    added_at: datetime = Field(default_factory=_utc_now)


class StoryCluster(BaseModel):
    """Skonsolidowany klaster wydarzeń skupiony wokół jednego wątku i spółki."""

    id: UUID = Field(default_factory=uuid4)
    title: str = Field(..., min_length=3)
    summary: str
    primary_entity_id: Optional[UUID] = None
    status: ClusterStatus = ClusterStatus.ACTIVE
    severity_level: RiskSeverity = RiskSeverity.LOW
    first_seen_at: datetime = Field(default_factory=_utc_now)
    last_seen_at: datetime = Field(default_factory=_utc_now)
    article_count: int = Field(default=0, ge=0)
    disclosure_count: int = Field(default=0, ge=0)
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_utc_now)
    updated_at: datetime = Field(default_factory=_utc_now)
