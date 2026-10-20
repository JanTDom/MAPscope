"""Moduł ingestu i deduplikacji danych wieloźródłowych."""

from mapscope.ingest.dedup import (
    ArticleDeduplicator,
    compute_minhash,
    tokenize_shingles,
)

__all__ = [
    "ArticleDeduplicator",
    "compute_minhash",
    "tokenize_shingles",
]
