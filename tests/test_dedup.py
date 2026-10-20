"""Testy silnika deduplikacji MinHash LSH."""

import pytest

from mapscope.ingest.dedup import ArticleDeduplicator, tokenize_shingles


def test_tokenize_shingles():
    """Weryfikacja podziału tekstu na k-shingle słowne."""
    text = "Ministerstwo Aktywów Państwowych ogłasza nowy plan nadzoru nad spółkami Skarbu Państwa."
    shingles = tokenize_shingles(text, k=3)
    assert len(shingles) > 0
    assert any("ministerstwo aktywów państwowych" in s for s in shingles)


def test_minhash_duplicate_detection():
    """Wykrywanie przedruków depesz agencyjnych (wysokie podobieństwo Jaccarda)."""
    dedup = ArticleDeduplicator(threshold=0.75)

    depesza_original = """
    Polska Grupa Energetyczna poinformowała o podpisaniu kluczowego kontraktu na rozbudowę sieci przesyłowej wysokiego napięcia.
    Wartość inwestycji wynosi ponad 500 milionów złotych. Wszystkie prace budowlane mają zakończyć się w terminie do końca 2028 roku.
    Projekt otrzymał wsparcie z funduszy europejskich oraz pełną akceptację Ministerstwa Aktywów Państwowych w ramach transformacji sektora.
    Inwestycja ma na celu zwiększenie stabilności zasilania aglomeracji warszawskiej oraz integrację nowych mocy ze źródeł odnawialnych.
    """

    # Przedruk depeszy agencyjnej PAP na portalu branżowym z drobną modyfikacją wstępu
    depesza_przedruk = """
    PGE Polska Grupa Energetyczna poinformowała o podpisaniu kluczowego kontraktu na rozbudowę sieci przesyłowej wysokiego napięcia.
    Wartość inwestycji wynosi ponad 500 milionów złotych. Wszystkie prace budowlane mają zakończyć się w terminie do końca 2028 roku.
    Projekt otrzymał wsparcie z funduszy europejskich oraz pełną akceptację Ministerstwa Aktywów Państwowych w ramach transformacji sektora.
    Inwestycja ma na celu zwiększenie stabilności zasilania aglomeracji warszawskiej oraz integrację nowych mocy ze źródeł odnawialnych.
    """

    inny_artykul = """
    KGHM opublikował wyniki finansowe za trzeci kwartał bieżącego roku. Zysk operacyjny EBITDA wzrósł o dwanaście procent.
    Spółka planuje dalsze inwestycje w złoża zagraniczne oraz modernizację hut miedzi w Głogowie i Legnicy.
    """

    dedup.insert("art_pge_pap", depesza_original)
    dedup.insert("art_kghm", inny_artykul)

    # Sprawdzenie detekcji przedruku
    dups = dedup.find_duplicates(depesza_przedruk)
    assert "art_pge_pap" in dups
    assert "art_kghm" not in dups
