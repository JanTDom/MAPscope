"""Silnik deduplikacji artykułów prasowych i depesz agencyjnych (MinHash LSH)."""

import re
from typing import List, Set

from datasketch import MinHash, MinHashLSH

# Domyślne parametry MinHash LSH
DEFAULT_NUM_PERM = 128
DEFAULT_SIMILARITY_THRESHOLD = 0.82


def tokenize_shingles(text: str, k: int = 3) -> Set[str]:
    """Dzieli znormalizowany tekst na k-shingle słowne."""
    # Czyszczenie tekstu i normalizacja małych liter
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    words = [w for w in cleaned.split() if len(w) > 1]
    if len(words) < k:
        return set(words)
    return {" ".join(words[i : i + k]) for i in range(len(words) - k + 1)}


def compute_minhash(text: str, num_perm: int = DEFAULT_NUM_PERM) -> MinHash:
    """Oblicza sygnaturę MinHash dla tekstu publikacji."""
    m = MinHash(num_perm=num_perm)
    shingles = tokenize_shingles(text)
    for s in shingles:
        m.update(s.encode("utf-8"))
    return m


class ArticleDeduplicator:
    """Indeks LSH do natychmiastowego wykrywania przedruków depesz agencyjnych (PAP, IAR)."""

    def __init__(
        self,
        threshold: float = DEFAULT_SIMILARITY_THRESHOLD,
        num_perm: int = DEFAULT_NUM_PERM,
    ):
        self.threshold = threshold
        self.num_perm = num_perm
        self.lsh = MinHashLSH(threshold=threshold, num_perm=num_perm)
        self.indexed_keys: Set[str] = set()

    def insert(self, article_id: str, text: str) -> MinHash:
        """Indeksuje artykuł w strukturze LSH."""
        mh = compute_minhash(text, num_perm=self.num_perm)
        if article_id not in self.indexed_keys:
            self.lsh.insert(article_id, mh)
            self.indexed_keys.add(article_id)
        return mh

    def find_duplicates(self, text: str) -> List[str]:
        """Zwraca identyfikatory artykułów będących przedrukami (Jaccard >= threshold)."""
        mh = compute_minhash(text, num_perm=self.num_perm)
        return self.lsh.query(mh)
