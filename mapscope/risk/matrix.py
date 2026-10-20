"""Matryca oceny ryzyka komunikacyjnego i właścicielskiego (Communication Risk Engine)."""

import re
from decimal import Decimal
from typing import Dict, List, Tuple
from uuid import UUID

from mapscope.models.enums import RiskSeverity
from mapscope.models.risk import (
    CommunicationRiskMatrix,
    GovernanceRiskMatrix,
    RiskAssessmentBase,
)

# Słowa kluczowe zagrożeń komunikacyjnych
COMMUNICATION_KEYWORDS: Dict[str, List[str]] = {
    "blad_narracyjny": [
        "sprostowanie",
        "błąd w komunikacie",
        "nieścisłość",
        "nieprecyzyjne sformułowanie",
        "wycofanie oświadczenia",
        "zła interpretacja",
        "manipulacja słowami",
    ],
    "rozdzwiek_z_rzadem": [
        "wbrew stanowisku rządu",
        "odmienne zdanie niż minister",
        "map nie konsultowało",
        "sprzeciw wobec decyzji premiera",
        "nie zgadzamy się z resortem",
        "niezależność zarządu",
    ],
    "zaognienie_konfliktu": [
        "związki zawodowe",
        "groźba strajku",
        "pikieta",
        "arogancka odpowiedź",
        "lekceważenie klientów",
        "bunt załogi",
        "postulaty płacowe",
        "zwolnienia grupowe",
    ],
    "ryzyko_regulacyjne_mar": [
        "mar",
        "espi",
        "informacja poufna",
        "manipulacja kursem",
        "knf",
        "podejrzenie insider trading",
        "ujawnienie przedwczesne",
    ],
}

# Słowa kluczowe zagrożeń właścicielskich i operacyjnych
GOVERNANCE_KEYWORDS: Dict[str, List[str]] = {
    "kadry_spory": [
        "dymisja",
        "odwołanie prezesa",
        "konflikt w zarządzie",
        "spór kompetencyjny",
        "rezygnacja członka",
        "brak porozumienia w radzie",
    ],
    "kontrole_sledztwa": [
        "cba",
        "nik",
        "abw",
        "prokuratura",
        "akt oskarżenia",
        "zatrzymanie",
        "przeszukanie",
        "uokik",
        "kara uokik",
        "kontrola poselska",
        "audyt śledczy",
    ],
    "finanse_plynnosc": [
        "strata netto",
        "utrata płynności",
        "dokapitalizowanie",
        "pomoc publiczna",
        "zadłużenie",
        "zagrożenie upadłością",
        "restrukturyzacja zadłużenia",
        "niewypłacalność",
    ],
    "infrastruktura_awarie": [
        "awaria krytyczna",
        "wstrzymanie produkcji",
        "wyciek surowca",
        "atak hakerski",
        "cyberatak",
        "sabotaż",
        "wyłączenie bloku",
        "paraliż taboru",
    ],
    "narracja_polityczna": [
        "interpelacja poselska",
        "atak opozycji",
        "komisja śledcza",
        "odpowiedzialność ministra",
        "żądanie dymisji ministra",
        "nepotyzm",
        "polityczny skandal",
    ],
}


class RiskEvaluator:
    """Klasyfikator heurystyczny etapu 1 (filtracja regułowa i kalkulator punktacji)."""

    @classmethod
    def evaluate_text_triggers(cls, title: str, content: str) -> Tuple[CommunicationRiskMatrix, GovernanceRiskMatrix, int]:
        """Bada występowanie wektorów ryzyka w tekście."""
        text = f"{title} {content}".lower()

        comm_flags: Dict[str, bool] = {}
        comm_details: Dict[str, str] = {}
        for category, keywords in COMMUNICATION_KEYWORDS.items():
            matches = [kw for kw in keywords if re.search(r"\b" + re.escape(kw) + r"\b", text)]
            is_active = len(matches) > 0
            comm_flags[category] = is_active
            if is_active:
                comm_details[category] = f"Wykryto słowa kluczowe: {', '.join(matches)}"

        gov_flags: Dict[str, bool] = {}
        gov_details: Dict[str, str] = {}
        for category, keywords in GOVERNANCE_KEYWORDS.items():
            matches = [kw for kw in keywords if re.search(r"\b" + re.escape(kw) + r"\b", text)]
            is_active = len(matches) > 0
            gov_flags[category] = is_active
            if is_active:
                gov_details[category] = f"Wykryto słowa kluczowe: {', '.join(matches)}"

        comm_matrix = CommunicationRiskMatrix(
            blad_narracyjny=comm_flags["blad_narracyjny"],
            rozdzwiek_z_rzadem=comm_flags["rozdzwiek_z_rzadem"],
            zaognienie_konfliktu=comm_flags["zaognienie_konfliktu"],
            ryzyko_regulacyjne_mar=comm_flags["ryzyko_regulacyjne_mar"],
            szczegoly=comm_details,
        )

        gov_matrix = GovernanceRiskMatrix(
            kadry_spory=gov_flags["kadry_spory"],
            kontrole_sledztwa=gov_flags["kontrole_sledztwa"],
            finanse_plynnosc=gov_flags["finanse_plynnosc"],
            infrastruktura_awarie=gov_flags["infrastruktura_awarie"],
            narracja_polityczna=gov_flags["narracja_polityczna"],
            szczegoly=gov_details,
        )

        total_triggers = sum(1 for v in comm_flags.values() if v) + sum(1 for v in gov_flags.values() if v)
        return comm_matrix, gov_matrix, total_triggers

    @classmethod
    def calculate_heuristic_score(
        cls,
        comm_matrix: CommunicationRiskMatrix,
        gov_matrix: GovernanceRiskMatrix,
        is_strategic: bool = False,
    ) -> Tuple[Decimal, RiskSeverity]:
        """Oblicza syntetyczną ocenę punktową 0.0 - 10.0 i przypisuje wagę kryzysową."""
        score = Decimal("0.0")

        # Wagi wektorów komunikacyjnych
        if comm_matrix.rozdzwiek_z_rzadem:
            score += Decimal("2.5")
        if comm_matrix.zaognienie_konfliktu:
            score += Decimal("2.0")
        if comm_matrix.ryzyko_regulacyjne_mar:
            score += Decimal("2.5")
        if comm_matrix.blad_narracyjny:
            score += Decimal("1.5")

        # Wagi wektorów właścicielskich
        if gov_matrix.kontrole_sledztwa:
            score += Decimal("2.5")
        if gov_matrix.infrastruktura_awarie:
            score += Decimal("3.0")
        if gov_matrix.finanse_plynnosc:
            score += Decimal("2.0")
        if gov_matrix.kadry_spory:
            score += Decimal("1.5")
        if gov_matrix.narracja_polityczna:
            score += Decimal("2.0")

        # Mnożnik podwyższonego nadzoru dla spółek strategicznych
        if is_strategic:
            score = score * Decimal("1.25")

        # Ograniczenie do skali 0.0 - 10.0
        final_score = min(score, Decimal("10.0")).quantize(Decimal("0.1"))

        if final_score >= Decimal("7.0"):
            severity = RiskSeverity.P1_CRITICAL
        elif final_score >= Decimal("4.5"):
            severity = RiskSeverity.P2_HIGH
        elif final_score >= Decimal("2.5"):
            severity = RiskSeverity.P3_MODERATE
        elif final_score > Decimal("0.0"):
            severity = RiskSeverity.LOW
        else:
            severity = RiskSeverity.NEUTRAL

        return final_score, severity

    @classmethod
    def evaluate_preliminary(
        cls,
        target_id: UUID,
        entity_id: UUID,
        entity_name: str,
        title: str,
        content: str,
        target_type: str = "disclosure",
        is_strategic: bool = False,
    ) -> RiskAssessmentBase:
        """Szybka ocena heurystyczna dla etapu 1 potoku analitycznego."""
        comm_matrix, gov_matrix, _ = cls.evaluate_text_triggers(title, content)
        score, severity = cls.calculate_heuristic_score(comm_matrix, gov_matrix, is_strategic)

        # Generowanie profesjonalnego, rzeczowego podsumowania faktów
        summary_parts = []
        if comm_matrix.rozdzwiek_z_rzadem:
            summary_parts.append("Wykryto ryzyko rozbieżności z oficjalną linią MAP/rządu.")
        if comm_matrix.zaognienie_konfliktu:
            summary_parts.append("Komunikat niesie ryzyko eskalacji sporu społecznego lub pracowniczego.")
        if gov_matrix.kontrole_sledztwa:
            summary_parts.append("Materiały dotyczą postępowań organów kontrolnych lub śledczych.")
        if gov_matrix.infrastruktura_awarie:
            summary_parts.append("Zdarzenie dotyka ciągłości działania infrastruktury.")

        executive_summary = (
            " ".join(summary_parts)
            if summary_parts
            else f"Bieżący materiał dotyczący spółki {entity_name}. Poziom ryzyka w granicach standardowych operacji."
        )

        map_impact = (
            f"Zdarzenie w {entity_name} może wygenerować zapytania poselskie i pytania dziennikarzy do kierownictwa MAP."
            if score >= Decimal("4.5")
            else f"Brak bezpośredniego zagrożenia wizerunkowego dla kierownictwa MAP na tym etapie."
        )

        return RiskAssessmentBase(
            target_type=target_type,  # type: ignore[arg-type]
            target_id=target_id,
            entity_id=entity_id,
            severity=severity,
            overall_risk_score=score,
            communication_risks=comm_matrix,
            governance_risks=gov_matrix,
            executive_summary=executive_summary,
            map_impact_analysis=map_impact,
            recommended_action=(
                "Pilny kontakt departamentu nadzorczego MAP z biurem prasowym spółki i weryfikacja faktów."
                if score >= Decimal("7.0")
                else None
            ),
            model_version="heuristic-stage-1",
        )
