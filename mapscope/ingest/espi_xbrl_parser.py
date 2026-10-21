"""Bezpośredni parser raportów okresowych GPW w standardzie XBRL / ESPI (iXBRL / ESEF / XML KNF)."""

import re
import xml.etree.ElementTree as ET
from typing import Any, Dict, List, Optional, Tuple

from mapscope.models.espi_xbrl import (
    CovenantEvaluation,
    CovenantStatus,
    EspiXbrlLineItem,
    EspiXbrlPeriodicReportModel,
    ReportStandard,
)


class EspiXbrlParser:
    """Parser raportów finansowych spółek Skarbu Państwa notowanych na GPW.

    Obsługuje:
    1. Raporty ESEF / iXBRL (Inline XBRL w XHTML)
    2. Raporty XML systemu ESPI Komisji Nadzoru Finansowego (KNF)
    3. Generyczne instancje taksonomii XBRL 2.1 (IFRS/MSR)
    """

    # Słownik mapowania tagów taksonomicznych IFRS / KNF ESPI
    TAG_MAPPINGS: Dict[str, List[str]] = {
        "revenue": [
            "Revenue",
            "RevenueFromContractsWithCustomers",
            "SalesRevenue",
            "PrzychodyZeSprzedazy",
            "PrzychodyNettoZeSprzedazy",
            "PrzychodyZeSprzedazyProduktowTowarowIMaterialow",
        ],
        "ebit": [
            "OperatingProfit",
            "ProfitLossFromOperatingActivities",
            "OperatingIncomeLoss",
            "ZyskOperacyjny",
            "ZyskStrataOperacyjna",
            "EBIT",
        ],
        "depreciation": [
            "DepreciationAndAmortisationExpense",
            "DepreciationExpense",
            "AmortisationExpense",
            "Amortyzacja",
            "OdpisyAmortyzacyjne",
        ],
        "net_profit": [
            "ProfitLoss",
            "ProfitLossForPeriod",
            "NetProfitLoss",
            "ZyskNetto",
            "ZyskStrataNetto",
            "WynikFinansowyNetto",
        ],
        "finance_costs": [
            "FinanceCosts",
            "InterestExpense",
            "KosztyFinansowe",
            "KosztyOdsetkowe",
        ],
        "long_term_debt": [
            "NoncurrentBorrowings",
            "LongtermBorrowings",
            "NoncurrentFinancialLiabilities",
            "ZobowiazaniaDlugoterminoweKredytyIPozyczki",
            "KredytyIPozyczkiDlugoterminowe",
            "ZobowiazaniaDlugoterminoweZRodzajuKredytow",
        ],
        "short_term_debt": [
            "CurrentBorrowings",
            "ShorttermBorrowings",
            "CurrentFinancialLiabilities",
            "ZobowiazaniaKrotkoterminoweKredytyIPozyczki",
            "KredytyIPozyczkiKrotkoterminowe",
            "ZobowiazaniaKrotkoterminoweZRodzajuKredytow",
        ],
        "cash": [
            "CashAndCashEquivalents",
            "CashAndCashEquivalentsAtEndOfPeriod",
            "SrodkiPieniezneIIchEkwiwalenty",
            "SrodkiPieniezne",
        ],
        "equity": [
            "Equity",
            "TotalEquity",
            "EquityAttributableToOwnersOfParent",
            "KapitalWlasny",
            "KapitalWlasnyRazem",
        ],
        "assets": [
            "Assets",
            "TotalAssets",
            "AktywaRazem",
            "Aktywa",
        ],
    }

    # Domyślne limity kowenantowe dla kluczowych grup kapitałowych SSP
    KNOWN_COVENANT_LIMITS: Dict[str, float] = {
        "ATT": 3.50,  # Grupa Azoty
        "PKN": 3.50,  # Orlen
        "PKP": 3.00,  # PKP Cargo
        "PGE": 3.50,  # PGE
        "TPE": 3.50,  # Tauron
        "KGH": 3.50,  # KGHM
        "JSW": 3.00,  # JSW
        "ENA": 3.50,  # Enea
    }

    def __init__(self, default_covenant_limit: float = 3.50):
        self.default_covenant_limit = default_covenant_limit

    @staticmethod
    def _strip_tag_namespace(tag: str) -> str:
        """Usuwa przestrzeń nazw XML w nawiasach klamrowych np. {http://...}Tag -> Tag."""
        if "}" in tag:
            return tag.split("}", 1)[1]
        if ":" in tag:
            return tag.split(":", 1)[1]
        return tag

    @staticmethod
    def _clean_numeric_string(raw: str) -> float:
        """Bezpiecznie konwertuje tekst z notacji polskiej/angielskiej na liczbę zmiennoprzecinkową."""
        if not raw:
            return 0.0
        val = raw.strip()

        # Obsługa notacji księgowej dla liczb ujemnych np. (1 234.50) -> -1234.50
        is_negative = False
        if val.startswith("(") and val.endswith(")"):
            is_negative = True
            val = val[1:-1].strip()
        elif val.startswith("-"):
            is_negative = True
            val = val[1:].strip()

        # Usuwamy spacje twarde i zwykłe
        val = val.replace("\xa0", "").replace(" ", "")

        # Jeśli zawiera przecinek jako separator dziesiętny
        if "," in val and "." in val:
            # np. 1.234,56 -> 1234.56
            if val.rfind(",") > val.rfind("."):
                val = val.replace(".", "").replace(",", ".")
            else:
                # np. 1,234.56
                val = val.replace(",", "")
        elif "," in val:
            val = val.replace(",", ".")

        try:
            num = float(val)
            return -num if is_negative else num
        except ValueError:
            return 0.0

    def parse_string(self, content: str) -> EspiXbrlPeriodicReportModel:
        """Parsuje raport okresowy podany jako ciąg tekstowy (XML, XHTML/iXBRL)."""
        content = content.strip()
        if not content:
            raise ValueError("Raport XBRL/ESPI nie może być pusty.")

        # Wykrycie standardu dokumentu
        if "ix:nonFraction" in content or "ix:nonNumeric" in content or "xmlns:ix=" in content:
            return self._parse_ixbrl(content)
        elif "<RaportOkresowy" in content or "<KNF_ESPI" in content or "<ESPI_RAPORT" in content:
            return self._parse_knf_espi_xml(content)
        else:
            # Domyślnie parsujemy jako uniwersalny XML/XBRL
            return self._parse_generic_xbrl_xml(content)

    def _parse_ixbrl(self, content: str) -> EspiXbrlPeriodicReportModel:
        """Parsuje dokument ESEF Inline XBRL (iXBRL w XHTML)."""
        # Ekstrakcja metadanych nagłówkowych za pomocą wyrażeń regularnych
        entity_name = self._regex_search(r'<ix:nonNumeric[^>]*name="[^"]*(?:EntityRegistrantName|NazwaEmitenta)[^"]*"[^>]*>(.*?)</ix:nonNumeric>', content) or "Emitent GPW (Skarb Państwa)"
        ticker = self._regex_search(r'<ix:nonNumeric[^>]*name="[^"]*(?:Ticker|TradingSymbol)[^"]*"[^>]*>(.*?)</ix:nonNumeric>', content) or "GPW"
        report_number = self._regex_search(r'<ix:nonNumeric[^>]*name="[^"]*(?:DocumentType|SymbolRaportu)[^"]*"[^>]*>(.*?)</ix:nonNumeric>', content) or "SA-QSr 3/2025"
        period_ended = self._regex_search(r'<ix:nonNumeric[^>]*name="[^"]*(?:PeriodEndDate|DataKoncaOkresu)[^"]*"[^>]*>(.*?)</ix:nonNumeric>', content) or "2025-09-30"
        published_at = self._regex_search(r'<ix:nonNumeric[^>]*name="[^"]*(?:PublicationDate|DataPublikacji)[^"]*"[^>]*>(.*?)</ix:nonNumeric>', content) or "2025-11-14"
        currency = self._regex_search(r'unitRef="([A-Z]{3})"', content) or "PLN"

        # Parsowanie tagów <ix:nonFraction>
        extracted_values: Dict[str, float] = {}
        provenance_items: List[EspiXbrlLineItem] = []

        # Wzorzec dopasowujący elementy ix:nonFraction
        pattern = re.compile(
            r'<ix:nonFraction\s+([^>]+)>(.*?)</ix:nonFraction>',
            re.DOTALL | re.IGNORECASE,
        )

        for match in pattern.finditer(content):
            attrs = match.group(1)
            raw_content = match.group(2)

            name_m = re.search(r'name="([^"]+)"', attrs, re.IGNORECASE)
            if not name_m:
                continue
            full_name = name_m.group(1).strip()

            scale_m = re.search(r'scale="?(-?\d+)"?', attrs, re.IGNORECASE)
            scale = int(scale_m.group(1)) if scale_m else 0

            raw_text = re.sub(r"<[^>]+>", "", raw_content).strip()
            local_name = self._strip_tag_namespace(full_name)
            raw_number = self._clean_numeric_string(raw_text)

            multiplier_to_mln = 10 ** (scale - 6)
            value_mln = round(raw_number * multiplier_to_mln, 2)

            self._match_and_store_metric(local_name, value_mln, extracted_values)

            provenance_items.append(
                EspiXbrlLineItem(
                    tag=full_name,
                    label=self._label_for_tag(local_name),
                    raw_value=raw_text,
                    normalized_value_mln_pln=value_mln,
                    period=period_ended,
                    unit=currency,
                    taxonomy=full_name.split(":")[0] if ":" in full_name else "ifrs-full",
                )
            )

        return self._build_report_model(
            entity_name=entity_name,
            ticker=ticker,
            report_number=report_number,
            period_ended=period_ended,
            published_at=published_at,
            standard=ReportStandard.ESEF_IXBRL,
            currency=currency,
            extracted=extracted_values,
            provenance=provenance_items,
        )

    def _find_text_agnostic(self, root: ET.Element, tag_names: List[str]) -> Optional[str]:
        """Szuka tekstu w elemencie niezależnie od przestrzeni nazw XML."""
        tag_names_lower = [t.lower() for t in tag_names]
        for elem in root.iter():
            local = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
            if local.lower() in tag_names_lower and elem.text and elem.text.strip():
                return elem.text.strip()
        return None

    def _parse_knf_espi_xml(self, content: str) -> EspiXbrlPeriodicReportModel:
        """Parsuje oficjalny format XML KNF ESPI (raporty okresowe)."""
        root = ET.fromstring(content)

        entity_name = self._find_text_agnostic(root, ["NazwaEmitenta", "Emitent"]) or "Emitent KNF ESPI"
        ticker = self._find_text_agnostic(root, ["Skrot", "Ticker"]) or "SSP"
        report_number = self._find_text_agnostic(root, ["SymbolRaportu", "NumerRaportu"]) or "SA-Q 3/2025"
        period_ended = self._find_text_agnostic(root, ["KoniecOkresu", "DataBilansu"]) or "2025-09-30"
        published_at = self._find_text_agnostic(root, ["DataPrzekazania", "DataPublikacji"]) or "2025-11-14"
        currency = self._find_text_agnostic(root, ["Waluta"]) or "PLN"
        unit_scale_raw = self._find_text_agnostic(root, ["Jednostka"]) or "tys"

        multiplier = 0.001 if "tys" in unit_scale_raw.lower() else (1.0 if "mln" in unit_scale_raw.lower() else 0.000001)

        extracted_values: Dict[str, float] = {}
        provenance_items: List[EspiXbrlLineItem] = []

        for elem in root.iter():
            tag_name = self._strip_tag_namespace(elem.tag)
            if elem.text and elem.text.strip():
                raw_val = elem.text.strip()
                try:
                    num_val = self._clean_numeric_string(raw_val)
                    if num_val != 0.0:
                        val_mln = round(num_val * multiplier, 2)
                        matched = self._match_and_store_metric(tag_name, val_mln, extracted_values)
                        if matched:
                            provenance_items.append(
                                EspiXbrlLineItem(
                                    tag=elem.tag,
                                    label=self._label_for_tag(tag_name),
                                    raw_value=raw_val,
                                    normalized_value_mln_pln=val_mln,
                                    period=period_ended,
                                    unit=currency,
                                    taxonomy="knf-espi",
                                )
                            )
                except Exception:
                    continue

        return self._build_report_model(
            entity_name=entity_name,
            ticker=ticker,
            report_number=report_number,
            period_ended=period_ended,
            published_at=published_at,
            standard=ReportStandard.KNF_ESPI_XML,
            currency=currency,
            extracted=extracted_values,
            provenance=provenance_items,
        )

    def _parse_generic_xbrl_xml(self, content: str) -> EspiXbrlPeriodicReportModel:
        """Parsuje generyczny dokument instancji XBRL 2.1 (IFRS)."""
        root = ET.fromstring(content)

        entity_name = "Emitent GPW (Skarb Państwa)"
        ticker = "GPW"
        report_number = "SA-Q 3/2025"
        period_ended = "2025-09-30"
        published_at = "2025-11-14"
        currency = "PLN"

        # Szukamy kontekstów lub encji
        for elem in root.iter():
            local = self._strip_tag_namespace(elem.tag)
            if local in ["identifier", "EntityRegistrantName", "NazwaEmitenta"]:
                if elem.text:
                    entity_name = elem.text.strip()
            elif local in ["TradingSymbol", "Ticker"]:
                if elem.text:
                    ticker = elem.text.strip()
            elif local in ["endDate", "PeriodEndDate"]:
                if elem.text:
                    period_ended = elem.text.strip()

        extracted_values: Dict[str, float] = {}
        provenance_items: List[EspiXbrlLineItem] = []

        for elem in root.iter():
            local = self._strip_tag_namespace(elem.tag)
            text = elem.text.strip() if elem.text else ""
            if not text:
                continue

            # Sprawdzamy czy to liczba
            raw_num = self._clean_numeric_string(text)
            if raw_num == 0.0 and text not in ["0", "0.0", "0,0"]:
                continue

            # Skala z atrybutów decimals lub scale
            decimals = elem.attrib.get("decimals")
            scale = elem.attrib.get("scale")

            # Jeśli brak atrybutów, wnioskujemy po rzędzie wielkości
            if scale:
                mult = 10 ** (int(scale) - 6)
            elif decimals and int(decimals) <= -6:
                mult = 1e-6
            elif abs(raw_num) > 10_000_000:
                # Wartość w PLN jednostkowych
                mult = 1e-6
            elif abs(raw_num) > 10_000:
                # Wartość w tys. PLN
                mult = 1e-3
            else:
                mult = 1.0

            val_mln = round(raw_num * mult, 2)
            matched = self._match_and_store_metric(local, val_mln, extracted_values)
            if matched:
                provenance_items.append(
                    EspiXbrlLineItem(
                        tag=elem.tag,
                        label=self._label_for_tag(local),
                        raw_value=text,
                        normalized_value_mln_pln=val_mln,
                        period=period_ended,
                        unit=currency,
                        taxonomy="ifrs-full",
                    )
                )

        return self._build_report_model(
            entity_name=entity_name,
            ticker=ticker,
            report_number=report_number,
            period_ended=period_ended,
            published_at=published_at,
            standard=ReportStandard.XBRL_2_1,
            currency=currency,
            extracted=extracted_values,
            provenance=provenance_items,
        )

    def _match_and_store_metric(self, tag_name: str, val_mln: float, storage: Dict[str, float]) -> bool:
        """Dopasowuje nazwę tagu do kluczowych wskaźników finansowych."""
        tag_lower = tag_name.lower()
        for metric_key, synonyms in self.TAG_MAPPINGS.items():
            for syn in synonyms:
                if tag_lower == syn.lower():
                    # Zapisujemy pierwszą lub bardziej kompletną wartość
                    if metric_key not in storage or storage[metric_key] == 0.0:
                        storage[metric_key] = val_mln
                        return True
        return False

    def _label_for_tag(self, tag_name: str) -> str:
        """Zwraca czytelną polską nazwę pozycji finansowej."""
        mapping = {
            "revenue": "Przychody ze sprzedaży",
            "ebit": "Zysk operacyjny (EBIT)",
            "depreciation": "Amortyzacja (D&A)",
            "net_profit": "Zysk / strata netto",
            "finance_costs": "Koszty finansowe / odsetkowe",
            "long_term_debt": "Kredyty i obligacje długoterminowe",
            "short_term_debt": "Kredyty i pożyczki krótkoterminowe",
            "cash": "Środki pieniężne i ich ekwiwalenty",
            "equity": "Kapitał własny razem",
            "assets": "Aktywa trwałe i obrotowe razem",
        }
        tag_lower = tag_name.lower()
        for metric_key, synonyms in self.TAG_MAPPINGS.items():
            for syn in synonyms:
                if tag_lower == syn.lower():
                    return mapping.get(metric_key, tag_name)
        return tag_name

    def _build_report_model(
        self,
        entity_name: str,
        ticker: str,
        report_number: str,
        period_ended: str,
        published_at: str,
        standard: ReportStandard,
        currency: str,
        extracted: Dict[str, float],
        provenance: List[EspiXbrlLineItem],
    ) -> EspiXbrlPeriodicReportModel:
        """Oblicza syntetyczne agregaty (EBITDA, Dług Netto) i ocenia kowenanty."""
        revenue = extracted.get("revenue", 0.0)
        ebit = extracted.get("ebit", 0.0)
        depreciation = extracted.get("depreciation", 0.0)
        # Kalkulacja EBITDA = EBIT + Amortyzacja
        calculated_ebitda = round(ebit + depreciation, 2)
        net_profit = extracted.get("net_profit", 0.0)
        finance_costs = extracted.get("finance_costs", 0.0)

        long_term_debt = extracted.get("long_term_debt", 0.0)
        short_term_debt = extracted.get("short_term_debt", 0.0)
        total_gross_debt = round(long_term_debt + short_term_debt, 2)
        cash = extracted.get("cash", 0.0)
        net_debt = round(total_gross_debt - cash, 2)

        total_equity = extracted.get("equity", 0.0)
        total_assets = extracted.get("assets", 0.0)

        # Ustalenie limitu kowenantu
        covenant_limit = self.KNOWN_COVENANT_LIMITS.get(ticker.upper(), self.default_covenant_limit)

        # Ocena kowenantowa
        covenant_eval = self._evaluate_covenant(
            ticker=ticker,
            net_debt_mln=net_debt,
            ebitda_mln=calculated_ebitda,
            finance_costs_mln=finance_costs,
            covenant_limit=covenant_limit,
        )

        return EspiXbrlPeriodicReportModel(
            report_number=report_number,
            entity_name=entity_name,
            ticker=ticker,
            period_ended=period_ended,
            published_at=published_at,
            report_standard=standard,
            currency=currency,
            revenue_mln_pln=revenue,
            operating_profit_ebit_mln_pln=ebit,
            depreciation_mln_pln=depreciation,
            calculated_ebitda_mln_pln=calculated_ebitda,
            net_profit_loss_mln_pln=net_profit,
            finance_costs_mln_pln=finance_costs,
            long_term_borrowings_mln_pln=long_term_debt,
            short_term_borrowings_mln_pln=short_term_debt,
            total_gross_debt_mln_pln=total_gross_debt,
            cash_and_equivalents_mln_pln=cash,
            net_debt_mln_pln=net_debt,
            total_equity_mln_pln=total_equity,
            total_assets_mln_pln=total_assets,
            covenant=covenant_eval,
            tags_provenance=provenance,
        )

    def _evaluate_covenant(
        self,
        ticker: str,
        net_debt_mln: float,
        ebitda_mln: float,
        finance_costs_mln: float,
        covenant_limit: float,
    ) -> CovenantEvaluation:
        """Rygorystyczna ocena kowenantów bankowych wg standardu audytu MAPscope."""
        net_debt_mld = round(net_debt_mln / 1000.0, 2)
        ebitda_mld = round(ebitda_mln / 1000.0, 2)

        # Wskaźnik pokrycia odsetek (EBITDA / Koszty finansowe)
        interest_cov: Optional[float] = None
        if finance_costs_mln > 0:
            interest_cov = round(ebitda_mln / finance_costs_mln, 2)

        # Przypadek 1: EBITDA ujemna przy dodatnim długu -> krytyczne naruszenie kowenantów
        if ebitda_mln <= 0 and net_debt_mln > 0:
            return CovenantEvaluation(
                net_debt_mld_pln=net_debt_mld,
                ebitda_mld_pln=ebitda_mld,
                net_debt_to_ebitda=None,
                covenant_limit=covenant_limit,
                status=CovenantStatus.KOWENANT_NARUSZONY,
                is_breached=True,
                interest_coverage_ratio=interest_cov,
                waiver_required=True,
                mar_risk_flag=True,
                ministerial_recommendation=(
                    f"Pilna interwencja w konsorcjum bankowym dla {ticker}. EBITDA ujemna ({ebitda_mld} mld PLN) "
                    f"przy długu netto {net_debt_mld} mld PLN uniemożliwia wyznaczenie wskaźnika. Wymagane natychmiastowe "
                    f"przedłużenie porozumienia standstill/waiver pod rygorem żądania natychmiastowej spłaty wierzytelności."
                ),
            )

        # Przypadek 2: Normalna kalkulacja wskaźnika
        ratio = round(net_debt_mln / ebitda_mln, 2) if ebitda_mln > 0 else 0.0

        if ratio > covenant_limit:
            status = CovenantStatus.KOWENANT_NARUSZONY
            is_breached = True
            waiver = True
            mar_flag = True
            rec = (
                f"Przekroczenie umownego progu kowenantu dla {ticker}: Dług/EBITDA wynosi {ratio}x wobec limitu {covenant_limit}x. "
                f"Ryzyko sankcji MAR w przypadku braku terminowego poinformowania rynku o porozumieniu z wierzycielami."
            )
        elif ratio > covenant_limit * 0.85:
            status = CovenantStatus.OSTRZEGAWCZY
            is_breached = False
            waiver = False
            mar_flag = False
            rec = (
                f"Wskaźnik {ratio}x zbliża się do poziomu krytycznego ({covenant_limit}x). Zalecany monitoring "
                f"przepływów operacyjnych spółki {ticker} i powstrzymanie niekrytycznych wydatków CAPEX."
            )
        else:
            status = CovenantStatus.BEZPIECZNY
            is_breached = False
            waiver = False
            mar_flag = False
            rec = (
                f"Stabilna sytuacja bilansowa spółki {ticker}. Wskaźnik Dług Netto / EBITDA wynosi {ratio}x "
                f"(limit bankowy: {covenant_limit}x). Spółka posiada bezpieczny bufor płynnościowy."
            )

        return CovenantEvaluation(
            net_debt_mld_pln=net_debt_mld,
            ebitda_mld_pln=ebitda_mld,
            net_debt_to_ebitda=ratio,
            covenant_limit=covenant_limit,
            status=status,
            is_breached=is_breached,
            interest_coverage_ratio=interest_cov,
            waiver_required=waiver,
            mar_risk_flag=mar_flag,
            ministerial_recommendation=rec,
        )

    @staticmethod
    def _regex_search(pattern: str, text: str) -> Optional[str]:
        m = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return m.group(1).strip() if m else None
