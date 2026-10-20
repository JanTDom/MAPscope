# Rejestr Decyzji Architektonicznych (ADR) — MAPscope

Rejestr kluczowych decyzji inżynieryjnych i architektonicznych podjętych przy projektowaniu i rozwoju systemu MAPscope.

---

## ADR-001: Model danych relacyjno-wektorowy (PostgreSQL / Supabase + pgvector)

### Kontekst
MAPscope monitoruje kilkaset podmiotów z udziałem Skarbu Państwa oraz dziesiątki tysięcy publikacji medialnych, oświadczeń korporacyjnych i raportów giełdowych. Wymagane jest błyskawiczne filtrowanie relacyjne (sektory, procenty udziału, organy właścicielskie, status prawny) oraz semantyczne łączenie wątków i oświadczeń spółek wokół klastrów kryzysowych.

### Decyzja
Wybrano PostgreSQL (w architekturze Supabase) z rozszerzeniami:
1. `pg_trgm`: Indeksy GIN na nazwach podmiotów, nazwiskach decydentów i tytułach publikacji, umożliwiające natychmiastowe wyszukiwanie z tolerancją literówek i odmian gramatycznych.
2. `vector` (`pgvector`): Wektorowe indeksy HNSW dla osadzania semantycznego oświadczeń i artykułów, pozwalające na klastrowanie powiązanych materiałów w czasie rzeczywistym.
3. Rygorystyczny podział na encje podstawowe:
   - `entities`: Pełny katalog podmiotów ze śledzeniem historii udziału państwa.
   - `people`: Kluczowe osoby (zarządy, rady nadzorcze, likwidatorzy, rzecznicy).
   - `company_disclosures`: Własna komunikacja podmiotów (oświadczenia prasowe, wywiady, ESPI/EBI, social media).
   - `articles`: Materiały prasowe i internetowe z przypisaniem do źródeł i podmiotów.
   - `story_clusters`: Klastry wątków łączące narracje mediów z reakcją spółki.
   - `risk_assessments`: Oceny ryzyka komunikacyjnego i właścicielskiego.
   - `alerts`: Kolejka powiadomień natychmiastowych.

### Konsekwencje
- Spójność danych gwarantowana kluczami obcymi i transakcjami ACID.
- Eliminacja problemu N+1 dzięki przygotowanym widokom analitycznym i indeksom na każdym kluczu obcym.
- RLS uniemożliwia wyciek danych administracyjnych do klienta webowego.

---

## ADR-002: Wersjonowanie i mechanizm ingestu rejestru podmiotów (Zasada Zero Wykluczeń)

### Kontekst
Zgodnie z regułą kardynalną nr 1 system musi obejmować 100% podmiotów z udziałem Skarbu Państwa. Wykaz ulega okresowym modyfikacjom (przekształcenia, zbycie akcji, komunalizacja, postępowania upadłościowe, fuzje). Ręczne wprowadzanie danych lub selektywne ograniczenie do „najgłośniejszych” spółek jest niedopuszczalne.

### Decyzja
Zaimplementowano dwuetapowy pipeline rejestrowy:
1. **Parser Wykazu BIP MAP / dane.gov.pl:**
   - Ingest oficjalnych zestawień sporządzanych na podstawie art. 33 ust. 1 ustawy o zasadach zarządzania mieniem państwowym.
   - Automatyczna walidacja sum kontrolnych NIP, KRS, REGON.
   - Wersjonowanie w tabeli `entity_registry_snapshots` wraz ze skrótem SHA-256 z pliku źródłowego.
2. **Konektor Rejestru Przedsiębiorców KRS (API Ministerstwa Sprawiedliwości):**
   - Wzbogacanie wpisu o aktualny skład organów zarządzających i nadzorczych (`people`).
   - Weryfikacja statusu prawnego (czy otwarto postępowanie układowe, likwidację lub upadłość).
3. **Silnik różnicowy (Differ):**
   - Rejestrowanie każdego zdarzenia (zmiana % udziału, wykreślenie, zmiana organu wykonującego prawa) jako wpisu w tabeli `audit_events`.

### Konsekwencje
- Gwarancja braku pominięć jakiejkolwiek spółki, niezależnie od jej wielkości i położenia geograficznego.
- Pełna historia zmian właścicielskich dostępna dla analityków MAP.

---

## ADR-003: Dwuetapowy audyt ryzyka komunikacyjnego spółek (Communication Risk Engine)

### Kontekst
Reguła kardynalna nr 2 wymaga oceny zagrożeń wynikających z samej komunikacji spółki. Publikacja oświadczenia nieprzemyślanego, aroganckiego lub sprzecznego z wytycznymi rządu natychmiast uderza w ministra nadzorującego (MAP). Jednocześnie przetwarzanie wszystkich materiałów przez LLM bez preselekcji byłoby kosztowne i generowało opóźnienia.

### Decyzja
Wdrożono dwustopniowy potok analizy:
1. **Etap 1 — Filtracja heurystyczna i deduplikacja MinHash:**
   - Wykrywanie przedruków agencyjnych (MinHash LSH, próg Jaccarda 0.82) — redukcja 70%+ redundantnych publikacji.
   - Regułowa analiza nagłówków i deklaracji spółek (wykrywanie komunikatów kryzysowych, sporów pracowniczych, dymisji, postępowań kontrolnych).
2. **Etap 2 — Audytor AI (Gemini):**
   - Oświadczenia spółek oraz kluczowe artykuły kryzysowe trafiają do modułu analizy ryzyka.
   - AI analizuje treść pod kątem 4 wektorów komunikacyjnych (`BŁĄD_NARRACYJNY`, `ROZDŹWIĘK_Z_RZĄDEM`, `ZAOGNIENIE_KONFLIKTU`, `RYZYKO_REGULACYJNE_MAR`) oraz 5 wektorów właścicielskich (`KADRY_SPORY`, `KONTROLE_ŚLEDZTWA`, `FINANSE_PŁYNNOŚĆ`, `INFRASTRUKTURA_AWARIE`, `NARRACJA_POLITYCZNA`).
   - Obowiązkowe pole analizy: `map_impact_analysis` — wprost określa, jak kryzys w spółce może uderzyć w kierownictwo MAP (np. na posiedzeniu Sejmu, w pytaniach dziennikarzy lub interpelacjach).

### Konsekwencje
- Czas generowania oceny kryzysowej P1 poniżej 2 minut.
- Raporty i alerty są wolne od ogólników AI, skupiając się na twardych skutkach polityczno-właścicielskich.
