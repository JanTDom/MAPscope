"""Asynchroniczny klient Centralnego Rejestru Beneficjentów Rzeczywistych (CRBR)."""

import asyncio
import logging
from typing import Any, Dict, List, Optional

import httpx

from mapscope.registry.validators import normalize_nip

logger = logging.getLogger(__name__)

CRBR_API_BASE_URL = "https://crbr.podatki.gov.pl/adcrbr/api"


class CRBRClientError(Exception):
    """Błąd komunikacji z API CRBR."""


class BeneficialOwner:
    """Beneficjent rzeczywisty według ustawy o przeciwdziałaniu praniu pieniędzy i finansowaniu terroryzmu."""

    def __init__(
        self,
        full_name: str,
        citizenship: str = "PL",
        privilege_type: str = "uprawnienia_wlascicielskie",
        is_pep: bool = False,
        reported_at: Optional[str] = None,
        share_percentage: Optional[float] = None,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.full_name = full_name
        self.citizenship = citizenship
        self.privilege_type = privilege_type
        self.is_pep = is_pep
        self.reported_at = reported_at
        self.share_percentage = share_percentage
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "full_name": self.full_name,
            "citizenship": self.citizenship,
            "privilege_type": self.privilege_type,
            "is_pep": self.is_pep,
            "reported_at": self.reported_at,
            "share_percentage": self.share_percentage,
            "details": self.details,
        }


class CRBRClient:
    """Klient oficjalnego otwartego API CRBR (Ministerstwo Finansów / Sprawiedliwości)."""

    def __init__(
        self,
        base_url: str = CRBR_API_BASE_URL,
        timeout: float = 15.0,
        max_retries: int = 3,
        backoff_factor: float = 1.5,
    ):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor

    async def get_beneficiaries(self, nip: str) -> Optional[Dict[str, Any]]:
        """Pobiera urzędowe dane beneficjentów rzeczywistych dla podanego NIP."""
        norm_nip = normalize_nip(nip)
        if not norm_nip:
            raise ValueError(f"Niepoprawny numer NIP: {nip}")

        url = f"{self.base_url}/beneficjenci/{norm_nip}"
        headers = {
            "Accept": "application/json",
            "User-Agent": "MAPscope-GovernanceEngine/1.0 (+https://map.gov.pl)",
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(1, self.max_retries + 1):
                try:
                    response = await client.get(url, headers=headers)
                    if response.status_code == 200:
                        return response.json()
                    if response.status_code == 404:
                        logger.info(f"Podmiot NIP {norm_nip} brak wpisu w CRBR (możliwe wyłączenie ustawowe).")
                        return None
                    if response.status_code == 429:
                        retry_after = float(response.headers.get("Retry-After", self.backoff_factor * attempt))
                        logger.warning(f"CRBR API rate-limit (429). Oczekiwanie {retry_after}s.")
                        await asyncio.sleep(retry_after)
                        continue

                    response.raise_for_status()
                except (httpx.RequestError, httpx.HTTPStatusError) as exc:
                    if attempt == self.max_retries:
                        raise CRBRClientError(f"Niepowodzenie odpytania CRBR dla NIP {norm_nip}: {exc}") from exc
                    wait_time = self.backoff_factor**attempt
                    logger.warning(f"Błąd sieci CRBR (próba {attempt}/{self.max_retries}). Ponowienie za {wait_time:.1f}s.")
                    await asyncio.sleep(wait_time)

        return None

    @classmethod
    def extract_beneficial_owners(cls, crbr_payload: Dict[str, Any]) -> List[BeneficialOwner]:
        """Ekstrahuje listę osób fizycznych sprawujących kontrolę właścicielską."""
        owners: List[BeneficialOwner] = []
        if not crbr_payload:
            return owners

        # Parsowanie struktury JSON CRBR
        zgloszenie = crbr_payload.get("zgloszenie", crbr_payload)
        pozycje = zgloszenie.get("beneficjenci", zgloszenie.get("pozycja", []))
        if isinstance(pozycje, dict):
            pozycje = [pozycje]

        for item in pozycje:
            imiona = item.get("imie", item.get("imiona", "")).strip()
            nazwisko = item.get("nazwisko", "").strip()
            full_name = f"{imiona} {nazwisko}".strip()
            if not full_name:
                continue

            uprawnienia = item.get("uprawnienia", item.get("rodzajUprawnienia", "bezposrednie"))
            obywatelstwo = item.get("obywatelstwo", "PL")
            is_pep = bool(item.get("pep", False) or item.get("osobaEksponowanaPolitycznie", False))
            data_zgloszenia = item.get("dataZgloszenia", zgloszenie.get("dataZgloszenia"))
            udzial = item.get("wielkoscUdzialu")

            share_pct = None
            if udzial is not None:
                try:
                    share_pct = float(str(udzial).replace("%", "").replace(",", "."))
                except (ValueError, TypeError):
                    share_pct = None

            owners.append(
                BeneficialOwner(
                    full_name=full_name,
                    citizenship=obywatelstwo,
                    privilege_type=str(uprawnienia),
                    is_pep=is_pep,
                    reported_at=str(data_zgloszenia) if data_zgloszenia else None,
                    share_percentage=share_pct,
                    details={"raw": item},
                )
            )

        return owners
