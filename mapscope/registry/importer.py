"""Importer i normalizator oficjalnego Wykazu Spółek z udziałem Skarbu Państwa (BIP MAP / dane.gov.pl)."""

import csv
import io
from datetime import date
from decimal import Decimal
from hashlib import sha256
from typing import Any, Dict, List, Optional, Tuple, Union

from mapscope.models.entity import EntityCreate, EntityRegistrySnapshot
from mapscope.models.enums import (
    EntityStatus,
    OwnershipType,
    StrategicImportance,
)
from mapscope.registry.validators import (
    normalize_krs,
    normalize_nip,
    normalize_regon,
)

# Lista strategicznych spółek Skarbu Państwa (wg rozporządzenia Rady Ministrów)
STRATEGIC_ENTITIES_KEYWORDS = {
    "orlen",
    "kghm",
    "pge",
    "tauron",
    "enea",
    "energa",
    "pzu",
    "pko bank polski",
    "pko bp",
    "totalizator sportowy",
    "polska grupa zbrojeniowa",
    "pgz",
    "huta stalowa wola",
    "mesko",
    "grupa azoty",
    "gaz-system",
    "pse",
    "polskie sieci elektroenergetyczne",
    "polskie linie lotnicze lot",
    "pll lot",
    "pkp",
    "pkp cargo",
    "poczta polska",
    "pern",
    "ciech",
    "cpk",
    "centralny port komunikacyjny",
}


def detect_status(name: str, status_text: Optional[str] = None) -> EntityStatus:
    """Określa status prawny spółki na podstawie nazwy i opisu."""
    combined = f"{name} {status_text or ''}".lower()
    if "upadłości" in combined or "upadłość" in combined or "syndyk" in combined:
        return EntityStatus.BANKRUPTCY
    if "likwidacji" in combined or "likwidacja" in combined or "likwidator" in combined:
        return EntityStatus.LIQUIDATION
    if "restrukturyzacji" in combined or "sanacji" in combined or "układow" in combined:
        return EntityStatus.RESTRUCTURING
    if "zawieszon" in combined:
        return EntityStatus.SUSPENDED
    if "wykreślon" in combined or "rozwiązan" in combined:
        return EntityStatus.DISSOLVED
    return EntityStatus.ACTIVE


def detect_ownership_type(share_percent: Decimal) -> OwnershipType:
    """Określa typ własności na podstawie udziału procentowego Skarbu Państwa."""
    if share_percent >= Decimal("100.0"):
        return OwnershipType.WHOLLY_OWNED
    if share_percent > Decimal("50.0"):
        return OwnershipType.MAJORITY
    return OwnershipType.MINORITY


def detect_strategic_importance(name: str, share_percent: Decimal) -> StrategicImportance:
    """Klasyfikuje rangę spółki w portfelu państwa."""
    name_lower = name.lower()
    for kw in STRATEGIC_ENTITIES_KEYWORDS:
        if kw in name_lower:
            return StrategicImportance.STRATEGIC

    if share_percent > Decimal("50.0"):
        return StrategicImportance.KEY
    return StrategicImportance.REGIONAL if "regional" in name_lower or "wojewódz" in name_lower else StrategicImportance.STANDARD


def _clean_header_key(k: str) -> str:
    """Normalizuje nagłówki kolumn usuwając polskie znaki diakrytyczne, spacje i interpunkcję."""
    cleaned = k.strip().lower()
    mapping = {
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        "ó": "o",
        "ś": "s",
        "ź": "z",
        "ż": "z",
        " ": "_",
        "-": "_",
        ".": "",
    }
    for pl, lat in mapping.items():
        cleaned = cleaned.replace(pl, lat)
    return cleaned


class RegistryImporter:
    """Silnik wczytywania i normalizacji oficjalnego wykazu podmiotów Skarbu Państwa."""

    @classmethod
    def parse_raw_record(cls, row: Dict[str, Any]) -> EntityCreate:
        """Przetwarza pojedynczy rekord ze słownika (z pliku CSV, JSON lub API)."""
        # Standaryzacja kluczy (małe litery, bez znaków diakrytycznych, bez spacji)
        norm_keys = {_clean_header_key(k): v for k, v in row.items()}

        raw_name = (
            norm_keys.get("nazwa_spolki")
            or norm_keys.get("firma")
            or norm_keys.get("oznaczenie_spolki")
            or norm_keys.get("nazwa")
            or ""
        ).strip()

        if not raw_name:
            raise ValueError("Brak nazwy spółki w rekordzie")

        raw_nip = norm_keys.get("nip")
        raw_krs = norm_keys.get("krs")
        raw_regon = norm_keys.get("regon")

        raw_share = (
            norm_keys.get("udzial_skarbu_panstwa")
            or norm_keys.get("udzial_sp")
            or norm_keys.get("procent_udzialu")
            or norm_keys.get("udzial")
            or "0"
        )

        ownership_body = (
            norm_keys.get("organ_wykonujacy_prawa")
            or norm_keys.get("organ_nadzorczy")
            or norm_keys.get("organ")
            or "Minister Aktywów Państwowych"
        ).strip()

        sector = (
            norm_keys.get("sektor")
            or norm_keys.get("branza")
            or norm_keys.get("dzialalnosc")
            or "Pozostała działalność gospodarcza"
        ).strip()

        map_department = norm_keys.get("departament_map") or norm_keys.get("departament")
        if map_department:
            map_department = str(map_department).strip()

        status_note = norm_keys.get("status") or norm_keys.get("uwagi")
        status = detect_status(raw_name, str(status_note) if status_note else None)

        share_decimal = EntityCreate.parse_share_percent(raw_share)
        ownership_type = detect_ownership_type(share_decimal)
        importance = detect_strategic_importance(raw_name, share_decimal)

        stock_ticker = norm_keys.get("ticker") or norm_keys.get("symbol_gpw")
        is_public_listed = bool(norm_keys.get("spolka_gieldowa") or stock_ticker)

        return EntityCreate(
            name=raw_name,
            formal_name=raw_name,
            nip=normalize_nip(str(raw_nip)) if raw_nip else None,
            krs=normalize_krs(str(raw_krs)) if raw_krs else None,
            regon=normalize_regon(str(raw_regon)) if raw_regon else None,
            state_share_percent=share_decimal,
            ownership_type=ownership_type,
            ownership_body=ownership_body,
            status=status,
            sector=sector,
            map_department=map_department,
            strategic_importance=importance,
            stock_ticker=str(stock_ticker).strip().upper() if stock_ticker else None,
            is_public_listed=is_public_listed,
            metadata={"raw_row": row},
        )

    @classmethod
    def import_from_csv(
        cls,
        csv_content: Union[str, bytes],
        source_url: str = "https://dane.gov.pl/bip-map",
        source_filename: str = "wykaz_spolek_skarb_panstwa.csv",
        snapshot_date: Optional[date] = None,
    ) -> Tuple[EntityRegistrySnapshot, List[EntityCreate]]:
        """Wczytuje oficjalny wykaz w formacie CSV i generuje wersjonowaną migawkę."""
        if isinstance(csv_content, bytes):
            # Próba dekodowania utf-8, fallback cp1250 (częsty w polskich instytucjach)
            try:
                text = csv_content.decode("utf-8-sig")
            except UnicodeDecodeError:
                text = csv_content.decode("cp1250", errors="replace")
        else:
            text = csv_content

        file_hash = sha256(text.encode("utf-8")).hexdigest()

        # Detekcja dialektu CSV (przecinek lub średnik)
        sample = text[:2048]
        delimiter = ";" if sample.count(";") > sample.count(",") else ","

        reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)
        entities: List[EntityCreate] = []

        for row in reader:
            if not any(row.values()):
                continue
            entity = cls.parse_raw_record(row)
            entities.append(entity)

        snapshot = EntityRegistrySnapshot(
            snapshot_date=snapshot_date or date.today(),
            source_url=source_url,
            source_filename=source_filename,
            file_sha256=file_hash,
            total_entities_count=len(entities),
            metadata={"delimiter": delimiter, "parsed_count": len(entities)},
        )

        # Przypisanie identyfikatora migawki do tworzonych encji
        for e in entities:
            e.last_snapshot_id = snapshot.id

        return snapshot, entities
