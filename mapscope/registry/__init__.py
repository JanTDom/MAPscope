"""Moduł rejestru i synchronizacji podmiotów Skarbu Państwa."""

from mapscope.registry.differ import RegistryDelta, RegistryDiffer
from mapscope.registry.importer import RegistryImporter
from mapscope.registry.krs_client import KRSClient, KRSClientError
from mapscope.registry.validators import (
    normalize_krs,
    normalize_nip,
    normalize_regon,
    validate_krs,
    validate_nip,
    validate_regon,
)

__all__ = [
    "RegistryImporter",
    "RegistryDiffer",
    "RegistryDelta",
    "KRSClient",
    "KRSClientError",
    "normalize_nip",
    "normalize_krs",
    "normalize_regon",
    "validate_nip",
    "validate_krs",
    "validate_regon",
]
