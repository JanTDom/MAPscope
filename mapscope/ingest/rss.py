import xml.etree.ElementTree as ET
from typing import List, Optional
from pydantic import BaseModel


class RssItem(BaseModel):
    title: str
    link: str
    description: Optional[str] = None
    pub_date: Optional[str] = None
    guid: Optional[str] = None
    category: Optional[str] = None
    source_name: Optional[str] = None


class RssChannel(BaseModel):
    title: str
    link: str
    description: Optional[str] = None
    items: List[RssItem] = []


class RssParser:
    """
    Parses RSS 2.0 and Atom XML feeds for MAPscope media ingestion and OSINT discovery.
    """

    @classmethod
    def parse(cls, xml_content: str) -> RssChannel:
        try:
            root = ET.fromstring(xml_content)
        except ET.ParseError as e:
            raise ValueError(f"Błąd parsowania XML RSS: {e}")

        # Check if root is Atom
        tag = root.tag.lower()
        if "feed" in tag:
            return cls._parse_atom(root)
        return cls._parse_rss2(root)

    @classmethod
    def _parse_rss2(cls, root: ET.Element) -> RssChannel:
        channel_elem = root.find("channel")
        if channel_elem is None:
            raise ValueError("Brak elementu <channel> w feedzie RSS")

        c_title = channel_elem.findtext("title", default="").strip()
        c_link = channel_elem.findtext("link", default="").strip()
        c_desc = channel_elem.findtext("description", default="").strip()

        items: List[RssItem] = []
        for item_elem in channel_elem.findall("item"):
            title = item_elem.findtext("title", default="").strip()
            link = item_elem.findtext("link", default="").strip()
            desc = item_elem.findtext("description")
            pub_date = item_elem.findtext("pubDate")
            guid = item_elem.findtext("guid")
            category = item_elem.findtext("category")
            source_elem = item_elem.find("source")
            source_name = source_elem.text.strip() if source_elem is not None and source_elem.text else None

            if title and link:
                items.append(
                    RssItem(
                        title=title,
                        link=link,
                        description=desc.strip() if desc else None,
                        pub_date=pub_date.strip() if pub_date else None,
                        guid=guid.strip() if guid else None,
                        category=category.strip() if category else None,
                        source_name=source_name,
                    )
                )

        return RssChannel(title=c_title, link=c_link, description=c_desc, items=items)

    @classmethod
    def _parse_atom(cls, root: ET.Element) -> RssChannel:
        # Strip XML namespaces
        ns = ""
        if root.tag.startswith("{"):
            ns = root.tag.split("}")[0] + "}"

        c_title = root.findtext(f"{ns}title", default="").strip()
        link_elem = root.find(f"{ns}link")
        c_link = link_elem.get("href", "").strip() if link_elem is not None else ""
        c_desc = root.findtext(f"{ns}subtitle", default="").strip()

        items: List[RssItem] = []
        for entry in root.findall(f"{ns}entry"):
            title = entry.findtext(f"{ns}title", default="").strip()
            e_link = entry.find(f"{ns}link")
            link = e_link.get("href", "").strip() if e_link is not None else ""
            desc = entry.findtext(f"{ns}summary") or entry.findtext(f"{ns}content")
            pub_date = entry.findtext(f"{ns}updated") or entry.findtext(f"{ns}published")
            guid = entry.findtext(f"{ns}id")

            if title and link:
                items.append(
                    RssItem(
                        title=title,
                        link=link,
                        description=desc.strip() if desc else None,
                        pub_date=pub_date.strip() if pub_date else None,
                        guid=guid.strip() if guid else None,
                    )
                )

        return RssChannel(title=c_title, link=c_link, description=c_desc, items=items)
