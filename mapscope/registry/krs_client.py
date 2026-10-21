"""Asynchroniczny klient Krajowego Rejestru Sądowego (API Ministerstwa Sprawiedliwości)."""

import asyncio
import logging
import xml.etree.ElementTree as ET
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

import httpx

from mapscope.models.entity import Person
from mapscope.models.enums import PersonRole
from mapscope.registry.validators import normalize_krs

logger = logging.getLogger(__name__)

KRS_API_BASE_URL = "https://api-krs.ms.gov.pl/api/krs"


class KRSClientError(Exception):
    """Błąd komunikacji z API KRS."""


class KRSClient:
    """Klient API KRS Ministerstwa Sprawiedliwości (odpisy aktualne i pełne w formatach JSON/XML)."""

    def __init__(
        self,
        base_url: str = KRS_API_BASE_URL,
        timeout: float = 15.0,
        max_retries: int = 3,
        backoff_factor: float = 1.5,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor

    async def get_current_extract(
        self,
        krs: str,
        format: str = "json",
    ) -> Optional[Union[Dict[str, Any], str]]:
        """Pobiera aktualny odpis spółki z rejestru przedsiębiorców KRS."""
        return await self.get_extract(krs, extract_type="OdpisAktualny", format=format)

    async def get_full_extract(
        self,
        krs: str,
        format: str = "json",
    ) -> Optional[Union[Dict[str, Any], str]]:
        """Pobiera pełny historyczny odpis spółki z rejestru przedsiębiorców KRS."""
        return await self.get_extract(krs, extract_type="OdpisPelny", format=format)

    async def get_extract(
        self,
        krs: str,
        extract_type: str = "OdpisAktualny",
        format: str = "json",
    ) -> Optional[Union[Dict[str, Any], str]]:
        """Pobiera odpis strukturalny (JSON lub XML) z Centralnej Informacji KRS."""
        norm_krs = normalize_krs(krs)
        if not norm_krs:
            raise ValueError(f"Niepoprawny numer KRS: {krs}")

        fmt = format.lower()
        if fmt not in ("json", "xml"):
            raise ValueError(f"Nieobsługiwany format odpisu KRS: {format}. Dozwolone: json, xml.")

        url = f"{self.base_url}/{extract_type}/{norm_krs}"
        params = {"rejestr": "P", "format": fmt}
        accept_header = "application/json" if fmt == "json" else "application/xml"
        headers = {
            "Accept": accept_header,
            "User-Agent": "MAPscope-IngestEngine/1.0 (+https://map.gov.pl)",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(1, self.max_retries + 1):
                try:
                    response = await client.get(url, params=params, headers=headers)
                    if response.status_code == 200:
                        return response.json() if fmt == "json" else response.text
                    if response.status_code == 404:
                        logger.warning(f"KRS {norm_krs} nie został znaleziony w rejestrze P ({extract_type}).")
                        return None
                    if response.status_code == 429:
                        retry_after = float(response.headers.get("Retry-After", self.backoff_factor * attempt))
                        logger.warning(f"KRS API limit zapytań (429). Oczekiwanie {retry_after}s.")
                        await asyncio.sleep(retry_after)
                        continue

                    response.raise_for_status()
                except (httpx.RequestError, httpx.HTTPStatusError) as exc:
                    if attempt == self.max_retries:
                        raise KRSClientError(f"Niepowodzenie odpytania KRS {norm_krs}: {exc}") from exc
                    wait_time = self.backoff_factor**attempt
                    logger.warning(f"Błąd sieci KRS (próba {attempt}/{self.max_retries}). Ponowienie za {wait_time:.1f}s.")
                    await asyncio.sleep(wait_time)

        return None

    @classmethod
    def extract_people(cls, krs_data: Dict[str, Any], entity_id: UUID) -> List[Person]:
        """Ekstrahuje skład zarządu, rady nadzorczej i likwidatorów z odpisu KRS."""
        people: List[Person] = []
        odpis = krs_data.get("odpis", {})
        dane = odpis.get("dane", {})

        # 1. Zarząd i reprezentacja (Dział 2)
        dzial2 = dane.get("dzial2", {})
        reprezentacja = dzial2.get("reprezentacja", {})
        sklad_zarzadu = reprezentacja.get("sklad", [])

        for member in sklad_zarzadu:
            identyfikator = member.get("identyfikator", {})
            imiona = identyfikator.get("imiona", "")
            nazwisko = identyfikator.get("nazwisko", "")
            full_name = f"{imiona} {nazwisko}".strip()
            funkcja = (member.get("funkcjaWOrganie") or "").lower()

            if "prezes" in funkcja and "wice" not in funkcja:
                role = PersonRole.PRESIDENT
            elif "wiceprezes" in funkcja or "zastępca" in funkcja:
                role = PersonRole.VICE_PRESIDENT
            else:
                role = PersonRole.BOARD_MEMBER

            if full_name:
                people.append(
                    Person(
                        entity_id=entity_id,
                        full_name=full_name,
                        role=role,
                        role_description=member.get("funkcjaWOrganie"),
                        is_current=True,
                        metadata={"krs_sklad_id": member.get("identyfikator")},
                    )
                )

        # 2. Rada Nadzorcza (Dział 2 - Organ Nadzoru)
        organ_nadzoru = dzial2.get("organNadzoru", [])
        if isinstance(organ_nadzoru, dict):
            organ_nadzoru = [organ_nadzoru]

        for org in organ_nadzoru:
            sklad_rn = org.get("sklad", [])
            for member in sklad_rn:
                identyfikator = member.get("identyfikator", {})
                imiona = identyfikator.get("imiona", "")
                nazwisko = identyfikator.get("nazwisko", "")
                full_name = f"{imiona} {nazwisko}".strip()
                funkcja = (member.get("funkcjaWOrganie") or "").lower()

                if "przewodnicz" in funkcja:
                    role = PersonRole.SUPERVISORY_BOARD_PRESIDENT
                else:
                    role = PersonRole.SUPERVISORY_BOARD_MEMBER

                if full_name:
                    people.append(
                        Person(
                            entity_id=entity_id,
                            full_name=full_name,
                            role=role,
                            role_description=member.get("funkcjaWOrganie"),
                            is_current=True,
                            metadata={"krs_organ_nadzoru": True},
                        )
                    )

        # 3. Likwidacja i postępowanie upadłościowe (Dział 6)
        dzial6 = dane.get("dzial6", {})
        likwidacja = dzial6.get("likwidacja", {})
        if likwidacja:
            sklad_likw = likwidacja.get("likwidatorzy", {}).get("sklad", [])
            for member in sklad_likw:
                identyfikator = member.get("identyfikator", {})
                imiona = identyfikator.get("imiona", "")
                nazwisko = identyfikator.get("nazwisko", "")
                full_name = f"{imiona} {nazwisko}".strip()
                if full_name:
                    people.append(
                        Person(
                            entity_id=entity_id,
                            full_name=full_name,
                            role=PersonRole.LIQUIDATOR,
                            role_description="Likwidator",
                            is_current=True,
                        )
                    )

        return people

    @classmethod
    def extract_people_from_xml(cls, xml_text: str, entity_id: UUID) -> List[Person]:
        """Ekstrahuje skład zarządu, rady nadzorczej i likwidatorów ze strukturalnego XML KRS."""
        people: List[Person] = []
        if not xml_text or not xml_text.strip():
            return people

        try:
            root = ET.fromstring(xml_text)
        except ET.ParseError as exc:
            logger.error(f"Błąd parsowania XML KRS: {exc}")
            return people

        # Wyszukiwanie reprezentacji / organu zarządzającego
        for member_elem in root.findall(".//reprezentacja/sklad") + root.findall(".//SkladZarzadu/Osoba"):
            imiona = (member_elem.findtext("identyfikator/imiona") or member_elem.findtext("Imiona") or "").strip()
            nazwisko = (member_elem.findtext("identyfikator/nazwisko") or member_elem.findtext("Nazwisko") or "").strip()
            funkcja = (member_elem.findtext("funkcjaWOrganie") or member_elem.findtext("Funkcja") or "").lower()
            full_name = f"{imiona} {nazwisko}".strip()

            if "prezes" in funkcja and "wice" not in funkcja:
                role = PersonRole.PRESIDENT
            elif "wiceprezes" in funkcja or "zastępca" in funkcja:
                role = PersonRole.VICE_PRESIDENT
            else:
                role = PersonRole.BOARD_MEMBER

            if full_name:
                people.append(
                    Person(
                        entity_id=entity_id,
                        full_name=full_name,
                        role=role,
                        role_description=member_elem.findtext("funkcjaWOrganie") or member_elem.findtext("Funkcja"),
                        is_current=True,
                        metadata={"krs_xml_source": True},
                    )
                )

        # Wyszukiwanie organu nadzoru (Rada Nadzorcza)
        for rn_elem in root.findall(".//organNadzoru/sklad") + root.findall(".//OrganNadzoru/Osoba"):
            imiona = (rn_elem.findtext("identyfikator/imiona") or rn_elem.findtext("Imiona") or "").strip()
            nazwisko = (rn_elem.findtext("identyfikator/nazwisko") or rn_elem.findtext("Nazwisko") or "").strip()
            funkcja = (rn_elem.findtext("funkcjaWOrganie") or rn_elem.findtext("Funkcja") or "").lower()
            full_name = f"{imiona} {nazwisko}".strip()

            role = (
                PersonRole.SUPERVISORY_BOARD_PRESIDENT
                if "przewodnicz" in funkcja
                else PersonRole.SUPERVISORY_BOARD_MEMBER
            )

            if full_name:
                people.append(
                    Person(
                        entity_id=entity_id,
                        full_name=full_name,
                        role=role,
                        role_description=rn_elem.findtext("funkcjaWOrganie") or rn_elem.findtext("Funkcja"),
                        is_current=True,
                        metadata={"krs_xml_source": True, "krs_organ_nadzoru": True},
                    )
                )

        return people
