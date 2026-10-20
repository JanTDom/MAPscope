"""Walidatory i normalizatory oficjalnych identyfikatorów państwowych (NIP, REGON, KRS)."""

import re
from typing import Optional


def normalize_digits(value: Optional[str]) -> Optional[str]:
    """Usuwa wszelkie znaki niebędące cyframi."""
    if not value:
        return None
    cleaned = re.sub(r"\D", "", str(value).strip())
    return cleaned if cleaned else None


def normalize_nip(nip: Optional[str]) -> Optional[str]:
    """Normalizuje NIP do 10 cyfr."""
    cleaned = normalize_digits(nip)
    if cleaned and len(cleaned) == 10:
        return cleaned
    return None


def normalize_krs(krs: Optional[str]) -> Optional[str]:
    """Normalizuje numer KRS uzupełniając wiodącymi zerami do 10 cyfr."""
    cleaned = normalize_digits(krs)
    if not cleaned:
        return None
    if len(cleaned) <= 10:
        return cleaned.zfill(10)
    return None


def normalize_regon(regon: Optional[str]) -> Optional[str]:
    """Normalizuje REGON (9 lub 14 cyfr)."""
    cleaned = normalize_digits(regon)
    if not cleaned:
        return None
    if len(cleaned) in (8, 9):
        return cleaned.zfill(9)
    if len(cleaned) in (13, 14):
        return cleaned.zfill(14)
    return None


def validate_nip(nip: Optional[str]) -> bool:
    """Walidacja sumy kontrolnej NIP algorytmem wagowym modulo 11."""
    norm = normalize_nip(nip)
    if not norm or len(norm) != 10:
        return False

    weights = [6, 5, 7, 2, 3, 4, 5, 6, 7]
    digits = [int(c) for c in norm]

    checksum = sum(w * d for w, d in zip(weights, digits[:9])) % 11
    if checksum == 10:
        return False
    return checksum == digits[9]


def validate_regon(regon: Optional[str]) -> bool:
    """Walidacja sumy kontrolnej REGON (dla wersji 9- i 14-cyfrowej)."""
    norm = normalize_regon(regon)
    if not norm:
        return False

    if len(norm) == 9:
        weights = [8, 9, 2, 3, 4, 5, 6, 7]
        digits = [int(c) for c in norm]
        checksum = sum(w * d for w, d in zip(weights, digits[:8])) % 11
        control = 0 if checksum == 10 else checksum
        return control == digits[8]

    if len(norm) == 14:
        # Najpierw weryfikacja pierwszych 9 cyfr
        if not validate_regon(norm[:9]):
            return False
        weights14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8]
        digits = [int(c) for c in norm]
        checksum = sum(w * d for w, d in zip(weights14, digits[:13])) % 11
        control = 0 if checksum == 10 else checksum
        return control == digits[13]

    return False


def validate_krs(krs: Optional[str]) -> bool:
    """Weryfikacja formatu KRS (10 cyfr)."""
    norm = normalize_krs(krs)
    if not norm or len(norm) != 10:
        return False
    return True
