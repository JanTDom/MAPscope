# AGENTS.md — MAPscope (System Monitoringu, Wczesnego Ostrzegania i Analizy Ryzyka dla MAP oraz Wszystkich SSP)

Jesteś głównym architektem i inżynierem oprogramowania odpowiedzialnym za budowę i rozwój MAPscope.
Projekt jest systemem klasy OSINT / media intelligence / governance risk radar dedykowanym Ministerstwu Aktywów Państwowych (MAP) oraz wszystkim podmiotom z udziałem Skarbu Państwa.

Celem systemu jest ciągły monitoring sieci w czasie zbliżonym do rzeczywistego, wykrywanie zarzewi kryzysów, klastrowanie faktów właścicielskich oraz badanie zagrożeń wynikających ze sposobu komunikacji samych spółek.

---

## 1. Dwa bezwzględne warunki projektowe (Reguły kardynalne)

1. **Bezwzględne, pełne pokrycie podmiotowe (Zero wykluczeń):**
   - System nie ogranicza się do kilkunastu największych grup (jak Orlen czy KGHM). Musi monitorować absolutnie wszystkie Spółki Skarbu Państwa (SSP) oraz wszystkie spółki, w których Skarb Państwa posiada jakiekolwiek udziały lub akcje (bezpośrednie i pośrednie, większościowe i mniejszościowe, strategiczne, regionalne, a także podmioty w restrukturyzacji i likwidacji).
   - Źródłem prawdy dla bazy podmiotów jest oficjalny Wykaz spółek z udziałem Skarbu Państwa (BIP MAP / dane.gov.pl) oraz integracja z odpisami KRS. Baza podmiotów musi być wersjonowana i automatycznie aktualizowana.

2. **Analiza ryzyka komunikacyjnego spółek (Communication Risk Engine):**
   - System nie tylko bada, co media piszą o spółkach, ale aktywnie analizuje własną komunikację spółek (oficjalne komunikaty prasowe, wpisy w social media, wypowiedzi członków zarządów, wywiady, sprostowania, odpowiedzi na kryzysy).
   - Zadaniem silnika AI jest ocena zagrożeń, jakie rodzi dany przekaz:
     - Niespójność z polityką właścicielską i deklaracjami rządu / MAP.
     - Ryzyko wizerunkowe i polityczne (arogancja, potęgowanie kryzysu, antagonizowanie grup społecznych lub klientów).
     - Błędy formalno-prawne (ryzyko zarzutu manipulacji kursem, naruszenie obowiązków informacyjnych MAR/ESPI, przedwczesne ujawnienie planów).
     - Ryzyko narażenia kierownictwa MAP na atak polityczny lub pytania kontrolne.

---

## 2. Architektura i stos technologiczny

System czerpie ze sprawdzonych wzorców projektu PPGscope, rozwijając je na skalę kilkuset podmiotów gospodarczych:

1. **Baza danych i model relacyjno-wektorowy (Supabase / PostgreSQL):**
   - `entities`: pełny rejestr podmiotów (nazwa, NIP, KRS, REGON, % udziału Skarbu Państwa, organ wykonujący prawa z akcji, status: aktywna/likwidacja/upadłość, sektor, przypisany departament w MAP).
   - `people`: członkowie zarządów, rad nadzorczych, likwidatorzy, kluczowi rzecznicy.
   - `company_disclosures`: własna komunikacja spółek (komunikaty prasowe, tweety/posty oficjalne, wywiady prezesów, raporty ESPI/EBI).
   - `articles`: publikacje medialne z sieci (ogólnopolskie, regionalne, branżowe).
   - `story_clusters`: skonsolidowane wydarzenia i wątki łączące doniesienia mediów z reakcją spółki i giełdy.
   - `risk_assessments`: oceny ryzyka komunikacyjnego i właścicielskiego wygenerowane przez AI.
   - `alerts`: powiadomienia natychmiastowe P1/P2/P3.

2. **Wieloźródłowy silnik ingestu (Python 3.11+ async / background workers):**
   - Rejestr podmiotów: automatyczny importer i synchronizator wykazu MAP oraz bazy KRS.
   - Nasłuch własnej komunikacji SSP: scrapery biur prasowych spółek, feedy RSS sekcji relacji inwestorskich, oficjalne konta X/LinkedIn spółek i członków zarządów.
   - Giełda (ESPI/EBI): komunikaty bieżące i okresowe dla spółek giełdowych.
   - Media i internet: media ogólnopolskie, portale ekonomiczne, prasa regionalna (bardzo ważna dla mniejszych SSP w regionach), serwisy branżowe.
   - Instytucje i legislacja: BIP MAP, RCL, Sejm (interpelacje i zapytania poselskie), NIK, KNF, UOKiK, URE, prokuratury.

3. **Deduplikacja, klastrowanie i analiza AI:**
   - MinHash LSH do eliminacji przedruków depesz agencyjnych.
   - Semantyczne grupowanie powiązanych materiałów wokół jednego wątku (`pgvector`).
   - Klasyfikator dwuetapowy:
     - Etap 1 (Szybka filtracja): odsianie czystego spamu handlowo-marketingowego przy zachowaniu czujności na komunikację korporacyjną.
     - Etap 2 (Audyt ryzyka komunikacyjnego i właścicielskiego - Gemini): analiza pod kątem kryzysowym, badanie intencji i możliwych rykoszetów politycznych dla MAP.

4. **Frontend i Dashboard operacyjny (Next.js 14+ App Router, React, Tailwind CSS):**
   - Centrum Dowodzenia / Radar: natychmiastowy podgląd spółek, gdzie generowane jest ryzyko (anomalie w wolumenie publikacji, negatywny sentyment, niefortunna komunikacja własna).
   - Katalog Wszystkich SSP: pełna, filtrowana wyszukiwarka podmiotów z udziałem Skarbu Państwa (alfabetycznie, sektorowo, wg % udziału Skarbu Państwa, wg poziomu ryzyka).
   - Moduł Oceny Komunikacji: dedykowany widok analizujący oświadczenia spółek wraz z uwagami AI („Zagrożenia wizerunkowe i luki w narracji”).
   - Strefa MAP: monitoring publikacji i interpelacji uderzających wprost w kierownictwo ministerstwa.

5. **Powiadomienia i szybka ścieżka (Real-Time Alerts):**
   - Webhooki, boty Telegram / Signal oraz powiadomienia e-mail dla sytuacji alarmowych (raport P1 generowany w < 2 minuty od pojawienia się sygnału).

---

## 3. Typologia zagrożeń i wektorów ryzyka (Matryca Oceny)

Silnik analityczny ocenia każdy materiał oraz oświadczenie spółki w następujących kategoriach:

1. **Zagrożenia komunikacyjne spółki:**
   - `BŁĄD_NARRACYJNY`: oświadczenie niespójne, merytorycznie słabe, prowokujące dalsze pytania dziennikarzy.
   - `ROZDŹWIĘK_Z_RZĄDEM`: komunikacja sprzeczna z linią MAP, KPRM lub deklaracjami premiera.
   - `ZAOGNIENIE_KONFLIKTU`: arogancja wobec klientów, pasażerów, pracowników lub związków zawodowych.
   - `RYZYKO_REGULACYJNE_MAR`: podejrzenie przedwczesnego ujawnienia informacji cenotwórczej lub błędu w raporcie ESPI.

2. **Zagrożenia właścicielskie i operacyjne:**
   - `KADRY_SPORY`: napięcia w zarządach i radach, dymisje, spory kompetencyjne.
   - `KONTROLE_ŚLEDZTWA`: NIK, CBA, prokuratura, UOKiK, KNF, kontrole poselskie.
   - `FINANSE_PŁYNNOŚĆ`: utrata kontraktów, spadek zysków, konieczność dokapitalizowania ze strony państwa.
   - `INFRASTRUKTURA_AWARIE`: incydenty w obiektach strategicznych (rafinerie, sieci przesyłowe, tabor, IT).
   - `NARRACJA_POLITYCZNA`: wykorzystanie tematu spółki przez opozycję lub koalicjantów w debacie publicznej.

---

## 4. Standardy inżynieryjne (Fable 5.1)

1. **Jakość produkcyjna:**
   - Zero atrap, placeholderów i makiet. Kod od pierwszego wdrożenia operuje na prawdziwym schemacie bazy i wykonuje realne zapytania.
   - TypeScript w najostrzejszym rygorze (`strict: true`, zakaz `any`, wyłącznie `unknown` ze zwężaniem typów).
   - Python z pełnym typowaniem, obsługą ponowień (`retry-after`, exponential backoff) i bezpiecznym przetwarzaniem współbieżnym.

2. **Wydajność bazy przy pełnym katalogu SSP:**
   - Baza obejmuje setki podmiotów. Wszelkie wyszukiwania tekstowe i filtrowania muszą opierać się na indeksach B-tree, GIN (`pg_trgm`) oraz IVFFlat/HNSW (`pgvector`). Zapytania N+1 są bezwzględnie eliminowane.

3. **Styl i ton raportów:**
   - Język naturalny, profesjonalny, konkretny. Bez ozdobników, bez stylistyki typowej dla AI („Warto zauważyć”, „Kluczowym aspektem jest”). Czyste fakty: data, źródło, podmiot, treść komunikatu, zidentyfikowane ryzyko dla MAP.
   - Zero emoji w interfejsie i raportach.
   - Polskie nagłówki formatowane sentence-case.
   - Zachowanie poprawnych skrótowców: **TK**, **SN**, **KRS**, **PKW**, **TVP**, **PiS**, **PO**, **UE**, **MSWiA**, **KAS**, **MAP**, **SSP**, **ESPI**, **EBI**, **UOKiK**, **URE**, **KNF**, **NIK**, **CBA**.

---

## 5. Protokół startu sesji

Przed rozpoczęciem prac programistycznych:
1. Sprawdź stan repozytorium: `git status`, bieżąca gałąź (praca na gałęzi funkcjonalnej, nigdy bezpośrednio na `main`).
2. Sprawdź zgodność ze schematem bazy w `supabase/migrations/`.
3. Uruchom istniejące testy:
   ```bash
   .venv/bin/pytest -v
   cd web && npm test && npx tsc --noEmit
   ```
4. Zapoznaj się z rejestrem decyzji architektonicznych w `DECISIONS.md`.

---

## 6. Etapy realizacji

- **Faza 1 — Rejestr SSP i schemat bazy:** Ingest oficjalnego wykazu spółek z udziałem Skarbu Państwa (BIP MAP / dane.gov.pl), model relacyjny w Supabase, struktura ról i uprawnień.
- **Faza 2 — Ingest wieloźródłowy:** Konektor biur prasowych SSP, konektor ESPI/EBI, konektory mediów ogólnych i regionalnych.
- **Faza 3 — Silnik AI i Audytor Komunikacji:** Implementacja promptów analizujących treść oświadczeń pod kątem luk narracyjnych i zagrożeń dla MAP.
- **Faza 4 — Interfejs Radaru i Katalogu Podmiotów:** Panel Next.js z wyszukiwarką wszystkich spółek, filtrami ryzyka i widokiem klastrów.
- **Faza 5 — Moduł Alertów Kryzysowych:** Spięcie z botem komunikatora i testy obciążeniowe na pełnym katalogu podmiotów.
