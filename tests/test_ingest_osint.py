import pytest
from mapscope.ingest.client import PoliteHttpClient
from mapscope.ingest.robots import RobotsChecker
from mapscope.ingest.rss import RssParser
from mapscope.ingest.extractor import HtmlArticleExtractor
from mapscope.ingest.osint_search import OsintSearchEngine


SAMPLE_RSS = """<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Wiadomości Gospodarcze - MAPscope Test</title>
    <link>https://wiadomosci.example.pl</link>
    <description>Testowy strumień RSS dla MAPscope</description>
    <item>
      <title>Orlen publikuje wyniki finansowe za IV kwartał: zysk powyżej prognoz</title>
      <link>https://biznes.pap.pl/pl/wiadomosci/orlen-wyniki-q4</link>
      <description>Grupa Orlen przedstawiła skonsolidowane wyniki finansowe za ostatni kwartał.</description>
      <pubDate>Tue, 20 Oct 2026 14:30:00 GMT</pubDate>
      <guid>pap-orlen-12345</guid>
      <source url="https://biznes.pap.pl">Polska Agencja Prasowa</source>
    </item>
    <item>
      <title>PKP Cargo: związki zawodowe ogłaszają pogotowie strajkowe i spór zbiorowy</title>
      <link>https://infotabor.pl/pkp-cargo-spor-zbiorowy</link>
      <description>Solidarność i Federacja Związków Zawodowych Kolejarzy domagają się spotkania z kierownictwem MAP.</description>
      <pubDate>Tue, 20 Oct 2026 15:10:00 GMT</pubDate>
      <guid>pkp-cargo-spor-67890</guid>
      <source url="https://infotabor.pl">InfoTabor</source>
    </item>
    <item>
      <title>Awaria krytyczna w rafinerii w Płocku: interwencja straży pożarnej</title>
      <link>https://plock.naszemiasto.pl/awaria-plock-orlen</link>
      <description>Do zdarzenia doszło w instalacji hydrokrakingu. Trwa akcja służb ratunkowych.</description>
      <pubDate>Tue, 20 Oct 2026 16:00:00 GMT</pubDate>
      <guid>plock-awaria-999</guid>
    </item>
  </channel>
</rss>
"""

SAMPLE_ROBOTS = """
User-agent: *
Disallow: /admin/
Disallow: /internal/
Allow: /wiadomosci/

User-agent: mapscope
Disallow: /tajne/
Allow: /tajne/jawne/
"""

SAMPLE_HTML = """<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>Minister Aktywów Państwowych o planach restrukturyzacji Poczty Polskiej</title>
  <link rel="canonical" href="https://gospodarka.dziennik.pl/artykuly/poczta-polska-plan-map">
  <meta property="og:title" content="Minister MAP: Poczta Polska musi przejść gruntowną cyfryzację">
  <meta property="og:description" content="Szef resortu aktywów państwowych przedstawił założenia planu naprawczego dla operatora narodowego.">
  <meta name="author" content="Piotr Dąbrowski">
  <meta property="article:published_time" content="2026-10-20T11:45:00+02:00">
</head>
<body>
  <nav><a href="/">Strona główna</a></nav>
  <main>
    <h1>Minister MAP: Poczta Polska musi przejść gruntowną cyfryzację</h1>
    <p>Szef resortu aktywów państwowych przedstawił założenia planu naprawczego dla operatora narodowego podczas konferencji prasowej w Warszawie.</p>
    <p>Projekt zakłada modernizację sieci logistycznej, rozszerzenie usług cyfrowych i renegocjację układu zbiorowego pracy przy zachowaniu gwarancji pracowniczych.</p>
    <p>Kluczowe decyzje właścicielskie zapadną na najbliższym posiedzeniu Komitetu Ekonomicznego Rady Ministrów.</p>
  </main>
  <footer>Copyright 2026</footer>
</body>
</html>
"""


def test_rss_parser_extracts_items():
    channel = RssParser.parse(SAMPLE_RSS)
    assert channel.title == "Wiadomości Gospodarcze - MAPscope Test"
    assert len(channel.items) == 3

    orlen_item = channel.items[0]
    assert "Orlen publikuje wyniki" in orlen_item.title
    assert orlen_item.source_name == "Polska Agencja Prasowa"

    pkp_item = channel.items[1]
    assert "PKP Cargo" in pkp_item.title
    assert "spór zbiorowy" in pkp_item.title
    assert "Solidarność" in pkp_item.description


def test_robots_checker_rfc9309():
    checker = RobotsChecker(SAMPLE_ROBOTS)
    # Default bot checks
    assert checker.is_allowed("https://example.com/wiadomosci/artykul-1") is True
    assert checker.is_allowed("https://example.com/admin/login") is False
    # mapscope specific directives
    assert checker.is_allowed("https://example.com/tajne/tajny-plik.pdf") is False
    assert checker.is_allowed("https://example.com/tajne/jawne/dane.csv") is True


def test_html_article_extractor():
    extracted = HtmlArticleExtractor.extract(SAMPLE_HTML, fallback_url="https://fallback.com/art")
    assert extracted.canonical_url == "https://gospodarka.dziennik.pl/artykuly/poczta-polska-plan-map"
    assert extracted.domain == "gospodarka.dziennik.pl"
    assert "Minister MAP" in extracted.title
    assert extracted.author == "Piotr Dąbrowski"
    assert "operatora narodowego" in extracted.lead_paragraph
    assert "Komitetu Ekonomicznego" in extracted.full_text


def test_osint_search_engine_classification():
    engine = OsintSearchEngine()
    # Test urgency classification
    p1_urg, _ = engine.classify_urgency_and_category("Awaria krytyczna w rafinerii ropy")
    assert p1_urg == "P1"

    p2_urg, p2_cat = engine.classify_urgency_and_category("Kontrola NIK w PKP Cargo: żądanie dymisji zarządu")
    assert p2_urg == "P2"
    assert p2_cat == "TRANSPORT_LOGISTYKA"

    p3_urg, p3_cat = engine.classify_urgency_and_category("Konferencja prasowa PGE na temat OZE")
    assert p3_urg == "P3"
    assert p3_cat == "ENERGETYKA"


def test_polite_http_client_user_agent():
    client = PoliteHttpClient()
    assert "MAPscope/1.0" in client.user_agent
    assert "kontakt@mapscope.pl" in client.user_agent
