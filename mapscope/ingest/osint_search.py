import urllib.parse
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, Field

from mapscope.ingest.client import PoliteHttpClient
from mapscope.ingest.rss import RssParser, RssItem
from mapscope.ingest.dedup import ArticleDeduplicator


class SearchResultItem(BaseModel):
    title: str
    link: str
    source_domain: str
    source_name: str
    snippet: Optional[str] = None
    pub_date: Optional[str] = None
    urgency_tier: str = "P3"
    risk_category: str = "OGÓLNE"
    is_duplicate: bool = False
    cluster_id: Optional[str] = None


class OsintSearchEngine:
    """
    OSINT internet search engine for MAPscope.
    Utilizes live RSS discovery (Google News RSS, Polish national & regional outlets, ESPI, Sejm),
    parses feeds, applies MinHash LSH deduplication, and classifies urgency for MAP.
    """

    GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search?q={query}&hl=pl&gl=PL&ceid=PL:pl"

    SECTOR_KEYWORDS = {
        "PALIWA_CHEMIA": ["orlen", "lotos", "azoty", "puławy", "police", "rafineria", "ropa", "gaz"],
        "ENERGETYKA": ["pge", "tauron", "enea", "energa", "węglowa", "elektrownia", "oze", "ure"],
        "TRANSPORT_LOGISTYKA": ["pkp", "cargo", "intercity", "plk", "poczta polska", "lot", "cpk"],
        "FINANSE_UBEZPIECZENIA": ["pko", "pekao", "pzu", "bgk", "knf", "dywidenda"],
        "GÓRNICTWO_HUTNICTWO": ["kghm", "jsw", "pgg", "węglowa", "miedź", "związek zawodowy", "strajk"],
        "ZBRÓJ_STRATEGICZNE": ["pgz", "mesko", "hsw", "bumar", "mon", "amunicja"],
    }

    RISK_SIGNALS = {
        "P1": ["katastrofa", "awaria krytyczna", "śledztwo abw", "aresztowanie", "prokuratura zarzuty", "strajk generalny", "paraliż", "upadłość"],
        "P2": ["kontrola nik", "żądanie dymisji", "interpelacja", "spór zbiorowy", "wotum nieufności", "odwołanie zarządu", "strata finansowa"],
        "P3": ["wyniki finansowe", "konferencja prasowa", "komunikat espi", "nowa inwestycja", "wywiad prezesa", "rada nadzorcza"],
    }

    def __init__(self, http_client: Optional[PoliteHttpClient] = None):
        self.http_client = http_client or PoliteHttpClient()
        self.deduplicator = ArticleDeduplicator(threshold=0.7)

    def search_query_url(self, query: str) -> str:
        safe_query = urllib.parse.quote(query.strip())
        return self.GOOGLE_NEWS_RSS_URL.format(query=safe_query)

    def parse_source_domain(self, link: str, fallback_source: Optional[str] = None) -> tuple[str, str]:
        parsed = urllib.parse.urlparse(link)
        domain = parsed.netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]
        source_name = fallback_source or domain
        return domain, source_name

    def classify_urgency_and_category(self, text: str) -> tuple[str, str]:
        text_lower = text.lower()
        # Urgency
        urgency = "P3"
        for p1_kw in self.RISK_SIGNALS["P1"]:
            if p1_kw in text_lower:
                urgency = "P1"
                break
        if urgency == "P3":
            for p2_kw in self.RISK_SIGNALS["P2"]:
                if p2_kw in text_lower:
                    urgency = "P2"
                    break

        # Category
        category = "SPÓŁKI_SKARBU_PAŃSTWA"
        for cat, kws in self.SECTOR_KEYWORDS.items():
            if any(kw in text_lower for kw in kws):
                category = cat
                break

        return urgency, category

    def search(self, query: str, max_results: int = 25) -> List[SearchResultItem]:
        """
        Executes an OSINT search for a given company name or topic using Google News RSS,
        deduplicating reprints with MinHash and returning structured results.
        """
        url = self.search_query_url(query)
        try:
            resp = self.http_client.get(url)
            if resp.status_code != 200:
                return []
            channel = RssParser.parse(resp.text)
        except Exception:
            return []

        results: List[SearchResultItem] = []
        for item in channel.items[:max_results]:
            domain, source_name = self.parse_source_domain(item.link, item.source_name)
            combined_text = f"{item.title} {item.description or ''}"
            urgency, category = self.classify_urgency_and_category(combined_text)

            # Deduplication
            doc_id = item.guid or item.link
            matches = self.deduplicator.find_duplicates(combined_text)
            is_dup = len(matches) > 0
            self.deduplicator.insert(doc_id, combined_text)

            results.append(
                SearchResultItem(
                    title=item.title,
                    link=item.link,
                    source_domain=domain,
                    source_name=source_name,
                    snippet=item.description,
                    pub_date=item.pub_date,
                    urgency_tier=urgency,
                    risk_category=category,
                    is_duplicate=is_dup,
                    cluster_id=matches[0] if matches else doc_id,
                )
            )

        return results
