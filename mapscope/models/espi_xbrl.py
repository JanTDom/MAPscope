"""Modele Pydantic dla raportów okresowych GPW w standardzie XBRL / ESPI."""

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class ReportStandard(str, Enum):
    ESEF_IXBRL = "ESEF_IXBRL"
    KNF_ESPI_XML = "KNF_ESPI_XML"
    XBRL_2_1 = "XBRL_2_1"


class CovenantStatus(str, Enum):
    BEZPIECZNY = "BEZPIECZNY"
    OSTRZEGAWCZY = "OSTRZEGAWCZY"
    KOWENANT_NARUSZONY = "KOWENANT_NARUSZONY"
    KRYTYCZNY = "KRYTYCZNY"


class EspiXbrlLineItem(BaseModel):
    """Pojedyncza pozycja finansowa wyodrębniona z raportu XBRL/ESPI."""

    tag: str = Field(..., description="Oryginalna nazwa tagu z taksonomii (np. ifrs-full:Revenue)")
    label: str = Field(..., description="Czytelna nazwa pozycji po polsku")
    raw_value: str = Field(..., description="Oryginalna wartość tekstowa z dokumentu")
    normalized_value_mln_pln: float = Field(..., description="Wartość znormalizowana w milionach PLN")
    period: str = Field(..., description="Okres raportowania (np. 2025-09-30)")
    unit: str = Field(default="PLN", description="Jednostka walutowa")
    taxonomy: str = Field(default="ifrs-full", description="Identyfikator taksonomii")


class CovenantEvaluation(BaseModel):
    """Wynik oceny stabilności kowenantowej spółki."""

    net_debt_mld_pln: float
    ebitda_mld_pln: float
    net_debt_to_ebitda: Optional[float] = None
    covenant_limit: float
    status: CovenantStatus
    is_breached: bool
    interest_coverage_ratio: Optional[float] = None
    waiver_required: bool
    mar_risk_flag: bool
    ministerial_recommendation: str


class EspiXbrlPeriodicReportModel(BaseModel):
    """Kompletny sparsowany raport okresowy GPW (XBRL/ESPI)."""

    id: UUID = Field(default_factory=uuid4)
    report_number: str = Field(..., description="Symbol i numer raportu (np. SA-QSr 3/2025)")
    entity_name: str
    ticker: str
    nip: Optional[str] = None
    krs: Optional[str] = None
    period_ended: str
    published_at: str
    report_standard: ReportStandard
    currency: str = "PLN"

    # Główne pozycje wynikowe i bilansowe (w mln PLN)
    revenue_mln_pln: float
    operating_profit_ebit_mln_pln: float
    depreciation_mln_pln: float
    calculated_ebitda_mln_pln: float
    net_profit_loss_mln_pln: float
    finance_costs_mln_pln: float

    # Pozycje dłużne i kapitałowe (w mln PLN)
    long_term_borrowings_mln_pln: float
    short_term_borrowings_mln_pln: float
    total_gross_debt_mln_pln: float
    cash_and_equivalents_mln_pln: float
    net_debt_mln_pln: float
    total_equity_mln_pln: float
    total_assets_mln_pln: float

    # Ocena kowenantowa
    covenant: CovenantEvaluation

    # Wykaz wyekstrahowanych tagów taksonomicznych
    tags_provenance: List[EspiXbrlLineItem] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=_utc_now)
