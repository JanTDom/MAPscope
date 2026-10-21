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

---

## ADR-004: Pakiet Wykonawczy High-Level, Suwerenność Surowcowa i Tarcza Przed Wrogim Przejęciem

### Kontekst
Dla kierownictwa resortu MAP i Prezesa Rady Ministrów kluczowa jest synteza strategiczna na najwyższym poziomie państwowym. System musi monitorować stan bezpieczeństwa energetyczno-surowcowego państwa, chronić strategiczne spółki notowane na GPW przed wrogim przejęciem przez kapitał offshore oraz nadzorować stabilność kowenantową zadłużenia bilansowego największych grup przemysłowych.

### Decyzja
Wdrożono cztery zintegrowane moduły wykonawcze:
1. **Radar Suwerenności Gospodarczej i Rezerw Strategicznych RP:** Ciągły monitoring rezerw paliwowych PERN (rezerwy interwencyjne w kawernach i bazach), napełnienia podziemnych magazynów gazu (PMG Gaz-System), zapasów węgla przy blokach systemowych oraz mocy wytwórczych nawozów azotowych Grupy Azoty.
2. **Tarcza Przed Wrogim Przejęciem (Ustawa z dn. 24 lipca 2015 r. o kontroli niektórych inwestycji):** Ciągły monitoring 21 podmiotów podlegających ochronie, detekcja nieautoryzowanej akumulacji akcji na GPW (np. pakiety funduszy cypryjskich na akcjach Orlenu) oraz automatyczny generator decyzji administracyjnej o sprzeciwie Ministra na podstawie art. 4 ust. 1 ustawy.
3. **Komitet Stabilności Finansowej i Kowenantów Bankowych SSP:** Śledzenie długu netto (70,9 mld PLN), relacji Dług/EBITDA w odniesieniu do limitów umownych (3.5x) dla spółek w kryzysie (Grupa Azoty, PKP Cargo) oraz harmonogramu spłat najbliższych transz dłużnych.
4. **Gabinetowy Audio-Brief (Odprawa Poranna w 90 sekund):** Format audio dla Ministra w drodze do KPRM z 1 kluczową liczbą majątku państwowego, 1 pilną dyspozycją do podpisu przed godz. 10:00 oraz 3 faktami do debaty rządowej.

### Konsekwencje
- Przejrzysty wgląd w newralgiczne punkty suwerenności państwa z poziomu głównego pulpitu gabinetu.
- Pełna zgodność z wymogami ustawowymi i eliminacja ryzyka paraliżu finansowego spółek kluczowych.

---

## ADR-005: Bezpośredni parser raportów okresowych GPW w standardzie XBRL / ESPI (ESEF Inline XBRL & KNF XML)

### Kontekst
Wskaźniki zadłużenia i stabilności finansowej spółek Skarbu Państwa notowanych na GPW (np. Grupa Azoty, Orlen, PKP Cargo, PGE, Tauron, KGHM, JSW) opierają się na oficjalnych raportach okresowych (kwartalnych, półrocznych, rocznych) publikowanych w systemie ESPI. Raporty te są przekazywane jako pakiety ESEF Inline XBRL (iXBRL w XHTML) lub pliki XML zgodne z taksonomią KNF ESPI. Do tej pory dane były odświeżane okresowo; istniała konieczność wdrożenia bezpośredniego silnika dekompozycji i audytu, który pozwala na natychmiastowe parsowanie i audytowanie raportu w momencie jego wpłynięcia do systemu ESPI.

### Decyzja
Wdrożono dwuwarstwowy silnik parsowania raportów okresowych GPW (Python backend + TypeScript/Next.js frontend):
1. **Silnik backendowy (`mapscope/ingest/espi_xbrl_parser.py`):**
   - Obsługuje tagi ESEF/iXBRL (`<ix:nonFraction>`, `<ix:nonNumeric>`) oraz taksonomię KNF ESPI XML.
   - Mapuje znaczniki IFRS/MSR (`Revenue`, `OperatingProfit`, `DepreciationAndAmortisationExpense`, `Borrowings`, `CashAndCashEquivalents`, `ProfitLoss`, `Equity`, itp.).
   - Normalizuje jednostki (tys. PLN / mln PLN / PLN), uwzględnia atrybuty skali (`scale`, `decimals`) oraz notację księgową kwot ujemnych.
2. **Kalkulacja kowenantowa i audyt MAR:**
   - Automatycznie oblicza skonsolidowaną EBITDA (`EBIT + D&A`), Dług Brutto oraz Dług Netto (`Dług Brutto - Gotówka`).
   - Oblicza wskaźnik lewarowania Dług Netto / EBITDA oraz wskaźnik pokrycia odsetek (ICR).
   - Porównuje wskaźniki z umownymi progami kowenantów (np. 3.50x lub 3.00x).
   - W przypadku ujemnej EBITDA przy dodatnim długu lub przekroczenia progu wyznacza status `KOWENANT_NARUSZONY`, wymóg porozumienia `waiver/standstill` oraz flagę ryzyka MAR.
3. **Endpoint API oraz widok wykonawczy w panelu Ministra:**
   - Dedykowany endpoint `/api/espi/xbrl-parser` umożliwiający parsowanie i weryfikację raportów online.
   - Wbudowane zindeksowane raporty okresowe dla 7 strategicznych grup GPW z udziałem Skarbu Państwa.
   - Interaktywny podgląd wyekstrahowanych tagów XBRL gwarantujący 100% audytowalności danych.

### Konsekwencje
- Błyskawiczna detekcja naruszeń kowenantów bankowych w dniu publikacji raportu przez spółkę.
- Kierownictwo MAP otrzymuje natychmiastową notę operacyjną z rekomendacją działań wobec konsorcjów bankowych i zarządów spółek.
