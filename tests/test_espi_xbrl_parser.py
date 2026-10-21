"""Testy jednostkowe bezpośredniego parsera raportów okresowych GPW w standardzie XBRL / ESPI."""

import pytest
from mapscope.ingest.espi_xbrl_parser import EspiXbrlParser
from mapscope.models.espi_xbrl import CovenantStatus, ReportStandard


SAMPLE_IXBRL_GRUPA_AZOTY = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
      xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full">
<head>
  <title>Grupa Azoty S.A. - Skonsolidowany raport kwartalny SA-QSr 3/2025</title>
</head>
<body>
  <div style="display:none">
    <ix:nonNumeric name="ifrs-full:EntityRegistrantName">GRUPA AZOTY SPÓŁKA AKCYJNA</ix:nonNumeric>
    <ix:nonNumeric name="ifrs-full:TradingSymbol">ATT</ix:nonNumeric>
    <ix:nonNumeric name="ifrs-full:DocumentType">SA-QSr 3/2025</ix:nonNumeric>
    <ix:nonNumeric name="ifrs-full:PeriodEndDate">2025-09-30</ix:nonNumeric>
    <ix:nonNumeric name="ifrs-full:PublicationDate">2025-11-14</ix:nonNumeric>
  </div>

  <h1>Skrócone skonsolidowane sprawozdanie finansowe za okres 9 miesięcy</h1>

  <table>
    <tr>
      <td>Przychody ze sprzedaży</td>
      <td>
        <ix:nonFraction name="ifrs-full:Revenue" unitRef="PLN" scale="6" decimals="-3">9850.40</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Zysk (strata) z działalności operacyjnej (EBIT)</td>
      <td>
        <ix:nonFraction name="ifrs-full:OperatingProfit" unitRef="PLN" scale="6" decimals="-3">-1240.20</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Amortyzacja</td>
      <td>
        <ix:nonFraction name="ifrs-full:DepreciationAndAmortisationExpense" unitRef="PLN" scale="6" decimals="-3">420.10</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Zysk (strata) netto okresu</td>
      <td>
        <ix:nonFraction name="ifrs-full:ProfitLoss" unitRef="PLN" scale="6" decimals="-3">-1580.60</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Koszty finansowe</td>
      <td>
        <ix:nonFraction name="ifrs-full:FinanceCosts" unitRef="PLN" scale="6" decimals="-3">310.50</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Kredyty i obligacje długoterminowe</td>
      <td>
        <ix:nonFraction name="ifrs-full:NoncurrentBorrowings" unitRef="PLN" scale="6" decimals="-3">8120.00</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Kredyty i pożyczki krótkoterminowe</td>
      <td>
        <ix:nonFraction name="ifrs-full:CurrentBorrowings" unitRef="PLN" scale="6" decimals="-3">2850.00</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Środki pieniężne i ich ekwiwalenty</td>
      <td>
        <ix:nonFraction name="ifrs-full:CashAndCashEquivalents" unitRef="PLN" scale="6" decimals="-3">570.00</ix:nonFraction>
      </td>
    </tr>
    <tr>
      <td>Kapitał własny</td>
      <td>
        <ix:nonFraction name="ifrs-full:Equity" unitRef="PLN" scale="6" decimals="-3">4310.00</ix:nonFraction>
      </td>
    </tr>
  </table>
</body>
</html>
"""


SAMPLE_KNF_ESPI_XML_ORLEN = """<?xml version="1.0" encoding="UTF-8"?>
<RaportOkresowy xmlns="http://www.knf.gov.pl/espi/raporty">
  <Naglowek>
    <NazwaEmitenta>ORLEN SPÓŁKA AKCYJNA</NazwaEmitenta>
    <Skrot>PKN</Skrot>
    <SymbolRaportu>SA-Q 3/2025</SymbolRaportu>
    <KoniecOkresu>2025-09-30</KoniecOkresu>
    <DataPrzekazania>2025-11-20</DataPrzekazania>
    <Waluta>PLN</Waluta>
    <Jednostka>tys</Jednostka>
  </Naglowek>
  <PozycjeFinansowe>
    <!-- Wartości w tys. PLN -->
    <PrzychodyZeSprzedazy>265890000</PrzychodyZeSprzedazy>
    <ZyskOperacyjny>21450000</ZyskOperacyjny>
    <Amortyzacja>7820000</Amortyzacja>
    <ZyskNetto>15630000</ZyskNetto>
    <KosztyFinansowe>1120000</KosztyFinansowe>
    <ZobowiazaniaDlugoterminoweKredytyIPozyczki>19400000</ZobowiazaniaDlugoterminoweKredytyIPozyczki>
    <ZobowiazaniaKrotkoterminoweKredytyIPozyczki>3200000</ZobowiazaniaKrotkoterminoweKredytyIPozyczki>
    <SrodkiPieniezneIIchEkwiwalenty>9400000</SrodkiPieniezneIIchEkwiwalenty>
    <KapitalWlasny>152000000</KapitalWlasny>
    <AktywaRazem>298000000</AktywaRazem>
  </PozycjeFinansowe>
</RaportOkresowy>
"""


SAMPLE_GENERIC_XBRL_PKP_CARGO = """<?xml version="1.0" encoding="utf-8"?>
<xbrli:xbrl xmlns:xbrli="http://www.xbrl.org/2003/instance"
            xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full">
  <EntityRegistrantName>PKP CARGO S.A. w restrukturyzacji</EntityRegistrantName>
  <Ticker>PKP</Ticker>
  <SymbolRaportu>SA-PS 2025</SymbolRaportu>
  <PeriodEndDate>2025-06-30</PeriodEndDate>

  <!-- Wartości w mln PLN (scale=6) -->
  <ifrs-full:Revenue scale="6">3210.50</ifrs-full:Revenue>
  <ifrs-full:OperatingProfit scale="6">-420.30</ifrs-full:OperatingProfit>
  <ifrs-full:DepreciationAndAmortisationExpense scale="6">210.10</ifrs-full:DepreciationAndAmortisationExpense>
  <ifrs-full:ProfitLoss scale="6">-512.40</ifrs-full:ProfitLoss>
  <ifrs-full:NoncurrentBorrowings scale="6">2890.00</ifrs-full:NoncurrentBorrowings>
  <ifrs-full:CurrentBorrowings scale="6">1450.00</ifrs-full:CurrentBorrowings>
  <ifrs-full:CashAndCashEquivalents scale="6">180.00</ifrs-full:CashAndCashEquivalents>
</xbrli:xbrl>
"""


def test_parse_ixbrl_grupa_azoty_breached_covenant():
    """Test parsowania raportu ESEF iXBRL z ujemną EBITDA i naruszeniem kowenantu."""
    parser = EspiXbrlParser()
    report = parser.parse_string(SAMPLE_IXBRL_GRUPA_AZOTY)

    assert report.report_standard == ReportStandard.ESEF_IXBRL
    assert report.ticker == "ATT"
    assert "GRUPA AZOTY" in report.entity_name
    assert report.report_number == "SA-QSr 3/2025"
    assert report.period_ended == "2025-09-30"

    # Sprawdzenie wyodrębnionych pozycji
    assert report.revenue_mln_pln == 9850.40
    assert report.operating_profit_ebit_mln_pln == -1240.20
    assert report.depreciation_mln_pln == 420.10
    # EBITDA = -1240.20 + 420.10 = -820.10 mln PLN
    assert report.calculated_ebitda_mln_pln == -820.10
    assert report.net_profit_loss_mln_pln == -1580.60

    # Sprawdzenie długu
    assert report.long_term_borrowings_mln_pln == 8120.00
    assert report.short_term_borrowings_mln_pln == 2850.00
    # Dług brutto = 8120 + 2850 = 10970.00 mln PLN
    assert report.total_gross_debt_mln_pln == 10970.00
    # Gotówka = 570.00 mln PLN
    assert report.cash_and_equivalents_mln_pln == 570.00
    # Dług netto = 10970 - 570 = 10400.00 mln PLN (10.4 mld PLN)
    assert report.net_debt_mln_pln == 10400.00

    # Ocena kowenantowa
    covenant = report.covenant
    assert covenant.is_breached is True
    assert covenant.status == CovenantStatus.KOWENANT_NARUSZONY
    assert covenant.net_debt_to_ebitda is None  # EBITDA ujemna
    assert covenant.waiver_required is True
    assert covenant.mar_risk_flag is True
    assert "standstill" in covenant.ministerial_recommendation.lower()

    # Sprawdzenie audytowalności tagów
    assert len(report.tags_provenance) >= 8
    tags = [p.tag for p in report.tags_provenance]
    assert any("Revenue" in t for t in tags)
    assert any("NoncurrentBorrowings" in t for t in tags)


def test_parse_knf_espi_xml_orlen_healthy_covenant():
    """Test parsowania raportu KNF ESPI XML z Orlenu z bezpiecznym buforem kowenantowym."""
    parser = EspiXbrlParser()
    report = parser.parse_string(SAMPLE_KNF_ESPI_XML_ORLEN)

    assert report.report_standard == ReportStandard.KNF_ESPI_XML
    assert report.ticker == "PKN"
    assert "ORLEN" in report.entity_name
    assert report.report_number == "SA-Q 3/2025"

    # Wartości w mln PLN (oryginalnie w tys.)
    # Przychody: 265 890 000 tys -> 265 890.00 mln PLN
    assert report.revenue_mln_pln == 265890.00
    # EBIT: 21 450 000 tys -> 21 450.00 mln PLN
    assert report.operating_profit_ebit_mln_pln == 21450.00
    # D&A: 7 820 000 tys -> 7 820.00 mln PLN
    assert report.depreciation_mln_pln == 7820.00
    # EBITDA = 21450 + 7820 = 29270.00 mln PLN (29.27 mld PLN)
    assert report.calculated_ebitda_mln_pln == 29270.00

    # Dług brutto = 19400 + 3200 = 22600.00 mln PLN
    assert report.total_gross_debt_mln_pln == 22600.00
    # Gotówka = 9400.00 mln PLN
    assert report.cash_and_equivalents_mln_pln == 9400.00
    # Dług netto = 22600 - 9400 = 13200.00 mln PLN (13.20 mld PLN)
    assert report.net_debt_mln_pln == 13200.00

    # Kowenant Dług Netto / EBITDA: 13200 / 29270 = 0.45x
    covenant = report.covenant
    assert covenant.is_breached is False
    assert covenant.status == CovenantStatus.BEZPIECZNY
    assert covenant.net_debt_to_ebitda == 0.45
    assert covenant.covenant_limit == 3.50
    assert covenant.waiver_required is False
    assert covenant.mar_risk_flag is False
    assert "Stabilna sytuacja bilansowa" in covenant.ministerial_recommendation


def test_parse_generic_xbrl_pkp_cargo():
    """Test parsowania generycznego dokumentu XBRL 2.1 dla PKP Cargo."""
    parser = EspiXbrlParser()
    report = parser.parse_string(SAMPLE_GENERIC_XBRL_PKP_CARGO)

    assert report.report_standard == ReportStandard.XBRL_2_1
    assert report.ticker == "PKP"
    assert "PKP CARGO" in report.entity_name

    # Przychody: 3210.50 mln PLN
    assert report.revenue_mln_pln == 3210.50
    # EBIT = -420.30, Amortyzacja = 210.10 -> EBITDA = -210.20 mln PLN
    assert report.calculated_ebitda_mln_pln == -210.20

    # Dług brutto: 2890 + 1450 = 4340.00 mln PLN
    # Dług netto: 4340 - 180 = 4160.00 mln PLN
    assert report.net_debt_mln_pln == 4160.00

    # Kowenant naruszony (ujemna EBITDA)
    assert report.covenant.is_breached is True
    assert report.covenant.status == CovenantStatus.KOWENANT_NARUSZONY
    assert report.covenant.waiver_required is True


def test_empty_input_raises_value_error():
    """Test odporności na puste wejście."""
    parser = EspiXbrlParser()
    with pytest.raises(ValueError, match="Raport XBRL/ESPI nie może być pusty"):
        parser.parse_string("   ")
