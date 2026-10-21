"""Modele Pydantic dla podmiotów i osób w strukturze Skarbu Państwa."""

from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator

from mapscope.models.enums import (
    EntityStatus,
    OwnershipType,
    PersonRole,
    StrategicImportance,
)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class EntityRegistrySnapshot(BaseModel):
    """Migawka oficjalnego wykazu spółek z udziałem Skarbu Państwa."""

    id: UUID = Field(default_factory=uuid4)
    snapshot_date: date
    source_url: str
    source_filename: str
    file_sha256: str
    total_entities_count: int = Field(ge=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_utc_now)


class Person(BaseModel):
    """Osoba w organach zarządzających, nadzorczych lub reprezentacji SSP."""

    id: UUID = Field(default_factory=uuid4)
    entity_id: UUID
    full_name: str
    role: PersonRole
    role_description: Optional[str] = None
    appointed_at: Optional[date] = None
    dismissed_at: Optional[date] = None
    is_current: bool = True
    social_handles: Dict[str, str] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_utc_now)
    updated_at: datetime = Field(default_factory=_utc_now)


class EntityBase(BaseModel):
    """Bazowe dane podmiotu z udziałem Skarbu Państwa."""

    name: str = Field(..., min_length=2, description="Nazwa handlowa lub skrócona spółki")
    formal_name: Optional[str] = Field(None, description="Pełna nazwa rejestrowa spółki")
    nip: Optional[str] = Field(None, max_length=10, description="Numer Identyfikacji Podatkowej")
    krs: Optional[str] = Field(None, max_length=10, description="Numer w Krajowym Rejestrze Sądowym")
    regon: Optional[str] = Field(None, max_length=14, description="Numer REGON (9 lub 14 cyfr)")
    state_share_percent: Decimal = Field(..., ge=0, le=100, description="Procentowy udział Skarbu Państwa w kapitale")
    ownership_type: OwnershipType = OwnershipType.DIRECT
    ownership_body: str = Field(..., description="Organ wykonujący prawa z akcji (np. Minister Aktywów Państwowych)")
    status: EntityStatus = EntityStatus.ACTIVE
    sector: str = Field(..., description="Branża / sektor gospodarki")
    map_department: Optional[str] = Field(None, description="Właściwy departament w MAP")
    strategic_importance: StrategicImportance = StrategicImportance.STANDARD
    stock_ticker: Optional[str] = Field(None, max_length=10, description="Ticker giełdowy GPW/NewConnect")
    is_public_listed: bool = False
    website_url: Optional[str] = None
    press_office_url: Optional[str] = None
    krs_registry_url: Optional[str] = Field(None, description="Bezpośredni odnośnik do rejestru eKRS Ministerstwa Sprawiedliwości")
    last_krs_sync_date: Optional[date] = Field(None, description="Data weryfikacji i synchronizacji z Centralną Informacją KRS")
    krs_verification_source: Optional[str] = Field(None, description="Źródło poświadczenia danych organów (np. KRS Dział 2 / ESPI)")
    krs_verification_status: Optional[str] = Field("verified_krs", description="Status weryfikacji: verified_krs | verified_espi")
    ir_url: Optional[str] = None
    social_handles: Dict[str, str] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @field_validator("state_share_percent", mode="before")
    @classmethod
    def parse_share_percent(cls, value: Any) -> Decimal:
        if isinstance(value, (int, float, str)):
            # Obsługa formatu polskiego "49,90%" lub "49.9"
            val_str = str(value).replace("%", "").replace(",", ".").strip()
            return Decimal(val_str)
        if isinstance(value, Decimal):
            return value
        raise ValueError(f"Nieprawidłowa wartość udziału: {value}")


class EntityCreate(EntityBase):
    """Tworzenie nowego podmiotu w rejestrze."""

    last_snapshot_id: Optional[UUID] = None


class Entity(EntityBase):
    """Kompletny podmiot w systemie MAPscope."""

    id: UUID = Field(default_factory=uuid4)
    last_snapshot_id: Optional[UUID] = None
    created_at: datetime = Field(default_factory=_utc_now)
    updated_at: datetime = Field(default_factory=_utc_now)
