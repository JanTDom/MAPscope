"""Testy jednostkowe walidacji identyfikatorów państwowych (NIP, REGON, KRS)."""

import pytest

from mapscope.registry.validators import (
    normalize_krs,
    normalize_nip,
    normalize_regon,
    validate_krs,
    validate_nip,
    validate_regon,
)


def test_nip_validation_valid():
    """Weryfikacja poprawnych NIP-ów podmiotów Skarbu Państwa."""
    # ORLEN S.A.
    assert validate_nip("7740001454") is True
    # KGHM Polska Miedź S.A.
    assert validate_nip("692-000-00-13") is True
    # PKO Bank Polski S.A.
    assert validate_nip("PL 5250007738") is True


def test_nip_validation_invalid():
    """Błędna suma kontrolna lub niepoprawna długość."""
    assert validate_nip("7740001455") is False  # Błędna cyfra kontrolna
    assert validate_nip("123456789") is False  # Za krótki
    assert validate_nip("") is False
    assert validate_nip(None) is False


def test_regon_validation_valid():
    """Weryfikacja 9-cyfrowych i 14-cyfrowych numerów REGON."""
    # REGON 9 cyfr (ORLEN)
    assert validate_regon("610188201") is True
    # REGON 9 cyfr (PKO BP)
    assert validate_regon("016298263") is True


def test_regon_validation_invalid():
    """Błędne numery REGON."""
    assert validate_regon("610188202") is False
    assert validate_regon("12345") is False
    assert validate_regon(None) is False


def test_krs_normalization_and_validation():
    """KRS musi być uzupełniany wiodącymi zerami do 10 znaków."""
    assert normalize_krs("28860") == "0000028860"
    assert normalize_krs("0000028860") == "0000028860"
    assert normalize_krs("krs: 28860") == "0000028860"
    assert validate_krs("28860") is True
    assert validate_krs("0000028860") is True
    assert validate_krs("") is False
    assert validate_krs(None) is False
