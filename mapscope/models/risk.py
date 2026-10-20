"""Modele Pydantic dla silnika oceny ryzyka komunikacyjnego i właścicielskiego (Communication Risk Engine)."""

from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from mapscope.models.enums import RiskSeverity


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class CommunicationRiskMatrix(BaseModel):
    """Matryca zagrożeń komunikacyjnych spółki."""

    blad_narracyjny: bool = Field(
        default=False,
        description="Oświadczenie niespójne, merytorycznie słabe, prowokujące dalsze pytania dziennikarzy",
    )
    rozdzwiek_z_rzadem: bool = Field(
        default=False,
        description="Komunikacja sprzeczna z linią MAP, KPRM lub deklaracjami premiera",
    )
    zaognienie_konfliktu: bool = Field(
        default=False,
        description="Arogancja wobec klientów, pasażerów, pracowników lub związków zawodowych",
    )
    ryzyko_regulacyjne_mar: bool = Field(
        default=False,
        description="Podejrzenie przedwczesnego ujawnienia informacji cenotwórczej lub błędu w raporcie ESPI",
    )
    szczegoly: Dict[str, str] = Field(
        default_factory=dict,
        description="Uzasadnienie każdego zidentyfikowanego zagrożenia komunikacyjnego",
    )


class GovernanceRiskMatrix(BaseModel):
    """Matryca zagrożeń właścicielskich i operacyjnych spółki."""

    kadry_spory: bool = Field(
        default=False,
        description="Napięcia w zarządach i radach, dymisje, spory kompetencyjne",
    )
    kontrole_sledztwa: bool = Field(
        default=False,
        description="NIK, CBA, prokuratura, UOKiK, KNF, kontrole poselskie",
    )
    finanse_plynnosc: bool = Field(
        default=False,
        description="Utrata kontraktów, spadek zysków, konieczność dokapitalizowania",
    )
    infrastruktura_awarie: bool = Field(
        default=False,
        description="Incydenty w obiektach strategicznych (rafinerie, sieci, tabor, IT)",
    )
    narracja_polityczna: bool = Field(
        default=False,
        description="Wykorzystanie tematu spółki przez opozycję lub koalicjantów w debacie publicznej",
    )
    szczegoly: Dict[str, str] = Field(
        default_factory=dict,
        description="Uzasadnienie każdego zidentyfikowanego zagrożenia właścicielskiego",
    )


class RiskAssessmentBase(BaseModel):
    """Bazowa ocena ryzyka wygenerowana przez audytora."""

    target_type: Literal["disclosure", "article", "cluster", "entity"]
    target_id: UUID
    entity_id: UUID
    severity: RiskSeverity
    overall_risk_score: Decimal = Field(..., ge=0, le=10, description="Ocena syntetyczna ryzyka od 0.0 do 10.0")
    communication_risks: CommunicationRiskMatrix = Field(default_factory=CommunicationRiskMatrix)
    governance_risks: GovernanceRiskMatrix = Field(default_factory=GovernanceRiskMatrix)
    executive_summary: str = Field(..., min_length=10, description="Konkretne streszczenie faktów i ryzyka")
    map_impact_analysis: str = Field(
        ...,
        min_length=10,
        description="Bezpośredni wpływ i rykoszet polityczny/kontrolny na kierownictwo MAP",
    )
    recommended_action: Optional[str] = Field(
        None,
        description="Rekomendowane działanie prewencyjne dla departamentu nadzorczego MAP",
    )
    model_version: str = "gemini-2.5-pro"


class RiskAssessment(RiskAssessmentBase):
    """Zapisana ocena ryzyka w bazie danych."""

    id: UUID = Field(default_factory=uuid4)
    raw_model_response: Optional[Dict[str, Any]] = None
    assessed_at: datetime = Field(default_factory=_utc_now)
    created_at: datetime = Field(default_factory=_utc_now)
