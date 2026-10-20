"""Modele Pydantic dla publikacji medialnych i powiązań z podmiotami Skarbu Państwa."""

from datetime import datetime, timezone
from hashlib import sha256
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, model_validator


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ArticleMention(BaseModel):
    """Wzmianka o spółce w artykule medialnym."""

    id: UUID = Field(default_factory=uuid4)
    article_id: UUID
    entity_id: UUID
    mention_count: int = Field(default=1, ge=1)
    is_primary_subject: bool = False
    sentiment_score: Optional[float] = Field(None, ge=-1.0, le=1.0)
    created_at: datetime = Field(default_factory=_utc_now)


class ArticleBase(BaseModel):
    """Podstawowe dane artykułu medialnego z sieci."""

    source_name: str
    source_domain: str
    source_type: str = "general"
    url: str
    title: str = Field(..., min_length=2)
    lead: Optional[str] = None
    body: str = Field(..., min_length=10)
    author: Optional[str] = None
    published_at: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ArticleCreate(ArticleBase):
    """Tworzenie nowego artykułu z automatycznym obliczeniem hasha treści."""

    content_hash: Optional[str] = None
    minhash_signature: Optional[str] = None
    is_reprint: bool = False
    original_article_id: Optional[UUID] = None

    @model_validator(mode="after")
    def compute_content_hash(self) -> "ArticleCreate":
        if not self.content_hash:
            payload = f"{self.source_domain}:{self.title.strip()}:{self.body[:500].strip()}"
            self.content_hash = sha256(payload.encode("utf-8")).hexdigest()
        return self


class Article(ArticleBase):
    """Kompletny artykuł zapisany w bazie danych."""

    id: UUID = Field(default_factory=uuid4)
    content_hash: str
    minhash_signature: Optional[str] = None
    is_reprint: bool = False
    original_article_id: Optional[UUID] = None
    embedding: Optional[List[float]] = None
    created_at: datetime = Field(default_factory=_utc_now)
