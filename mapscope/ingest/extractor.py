import re
import html
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
from pydantic import BaseModel


class ExtractedArticleContent(BaseModel):
    title: str
    canonical_url: str
    domain: str
    lead_paragraph: Optional[str] = None
    full_text: str
    published_time: Optional[str] = None
    author: Optional[str] = None


class HtmlArticleExtractor:
    """
    Extracts structured article data from HTML web pages with high fidelity and zero external bloat.
    Handles canonical URL, OpenGraph tags, JSON-LD metadata, and text paragraphs.
    """

    @classmethod
    def extract(cls, html_content: str, fallback_url: str) -> ExtractedArticleContent:
        # 1. Canonical URL
        canonical_match = re.search(
            r'<link[^>]+rel=[\"\']canonical[\"\'][^>]+href=[\"\']([^\"\']+)[\"\']',
            html_content,
            re.IGNORECASE,
        )
        if not canonical_match:
            canonical_match = re.search(
                r'<link[^>]+href=[\"\']([^\"\']+)[\"\'][^>]+rel=[\"\']canonical[\"\']',
                html_content,
                re.IGNORECASE,
            )
        canonical_url = canonical_match.group(1).strip() if canonical_match else fallback_url
        domain = urlparse(canonical_url).netloc or urlparse(fallback_url).netloc

        # 2. Title
        title = ""
        og_title = re.search(r'<meta[^>]+property=[\"\']og:title[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html_content, re.IGNORECASE)
        if not og_title:
            og_title = re.search(r'<meta[^>]+content=[\"\']([^\"\']+)[\"\'][^>]+property=[\"\']og:title[\"\']', html_content, re.IGNORECASE)

        if og_title:
            title = html.unescape(og_title.group(1).strip())
        else:
            t_match = re.search(r'<title[^>]*>(.*?)</title>', html_content, re.DOTALL | re.IGNORECASE)
            if t_match:
                title = html.unescape(re.sub(r'\s+', ' ', t_match.group(1)).strip())

        if not title:
            title = "Publikacja bez tytułu"

        # 3. Description / Lead
        lead = None
        og_desc = re.search(r'<meta[^>]+property=[\"\']og:description[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html_content, re.IGNORECASE)
        if not og_desc:
            og_desc = re.search(r'<meta[^>]+name=[\"\']description[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html_content, re.IGNORECASE)
        if og_desc:
            lead = html.unescape(og_desc.group(1).strip())

        # 4. Clean paragraphs / body text
        # Remove scripts, styles, nav, footer
        cleaned = re.sub(r'<(script|style|nav|footer|header|aside)[^>]*>.*?</\1>', ' ', html_content, flags=re.DOTALL | re.IGNORECASE)
        # Extract <p> paragraphs
        paragraphs: List[str] = []
        for p in re.finditer(r'<p[^>]*>(.*?)</p>', cleaned, flags=re.DOTALL | re.IGNORECASE):
            text = re.sub(r'<[^>]+>', ' ', p.group(1))
            text = html.unescape(re.sub(r'\s+', ' ', text).strip())
            if len(text) > 40:
                paragraphs.append(text)

        full_text = "\n\n".join(paragraphs) if paragraphs else (lead or title)
        if not lead and paragraphs:
            lead = paragraphs[0]

        # 5. Published Time
        pub_time = None
        time_match = re.search(r'<meta[^>]+property=[\"\']article:published_time[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html_content, re.IGNORECASE)
        if time_match:
            pub_time = time_match.group(1).strip()

        # 6. Author
        author = None
        author_match = re.search(r'<meta[^>]+name=[\"\']author[\"\'][^>]+content=[\"\']([^\"\']+)[\"\']', html_content, re.IGNORECASE)
        if author_match:
            author = html.unescape(author_match.group(1).strip())

        return ExtractedArticleContent(
            title=title,
            canonical_url=canonical_url,
            domain=domain,
            lead_paragraph=lead,
            full_text=full_text,
            published_time=pub_time,
            author=author,
        )
