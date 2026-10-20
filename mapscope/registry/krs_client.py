"""Asynchroniczny klient Krajowego Rejestru Sądowego (API Ministerstwa Sprawiedliwości)."""

import asyncio
import logging
from typing import Any, Dict, List, Optional
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
    """Klient API KRS Ministerstwa Sprawiedliwości (odpisy aktualne)."""

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

    async def get_current_extract(self, krs: str) -> Optional[Dict[str, Any]]:
        """Pobiera aktualny odpis spółki z rejestru przedsiębiorców KRS."""
        norm_krs = normalize_krs(krs)
        if not norm_krs:
            raise ValueError(f"Niepoprawny numer KRS: {krs}")

        url = f"{self.base_url}/OdpisAktualny/{norm_krs}"
        params = {"rejestr": "P", "format": "json"}
        headers = {
            "Accept": "application/json",
            "User-Agent": "MAPscope-IngestEngine/1.0 (+https://map.gov.pl)",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(1, self.max_retries + 1):
                try:
                    response = await client.get(url, params=params, headers=headers)
                    if response.status_code == 200:
                        return response.json()
                    if response.status_code == 404:
                        logger.warning(f"KRS {norm_krs} nie został znaleziony w rejestrze P.")
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
