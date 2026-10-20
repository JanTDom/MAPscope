# MAPscope

System Monitoringu, Wczesnego Ostrzegania i Analizy Ryzyka dla Ministerstwa Aktywów Państwowych (MAP) oraz Wszystkich Spółek z Udziałem Skarbu Państwa (SSP).

System klasy OSINT / media intelligence / governance risk radar. Zapewnia ciągły monitoring sieci w czasie zbliżonym do rzeczywistego, wykrywanie zarzewi kryzysów, klastrowanie faktów właścicielskich oraz prewencyjne badanie zagrożeń wynikających ze sposobu komunikacji samych spółek.

---

## Dwa warunki kardynalne projektu

1. **Bezwzględne, pełne pokrycie podmiotowe (Zero wykluczeń):**
   System monitoruje absolutnie wszystkie podmioty z udziałem Skarbu Państwa (od największych grup giełdowych, przez spółki regionalne i infrastrukturalne, po podmioty w restrukturyzacji i likwidacji). Źródłem prawdy jest oficjalny Wykaz spółek z udziałem Skarbu Państwa (BIP MAP / dane.gov.pl) sprzężony z odpisami KRS.
2. **Analiza ryzyka komunikacyjnego spółek (Communication Risk Engine):**
   Aktywne badanie własnego przekazu spółek (oświadczenia, komunikaty, wywiady zarządów, posty social media, raporty ESPI) pod kątem rozbieżności z polityką MAP, arogancji/zaogniania kryzysu, błędów formalno-prawnych (MAR/ESPI) oraz narażenia kierownictwa ministerstwa na ataki polityczne.

---

## Układ repozytorium

| Katalog | Przeznaczenie |
| --- | --- |
| `mapscope/` | Rdzenny pakiet Pythona: importer rejestru BIP MAP, konektor KRS, audytor ryzyka, klastrowanie i MinHash deduplikacja. |
| `web/` | Centrum Dowodzenia i Radar (Next.js 14+ App Router, React, Tailwind CSS). |
| `supabase/` | Migracje bazy PostgreSQL z rozszerzeniami `pg_trgm` i `pgvector`, polityki RLS i indeksy. |
| `data/` | Zrzuty rejestru podmiotów Skarbu Państwa, szablony i dane weryfikacyjne. |
| `tests/` | Testy jednostkowe i integracyjne (`pytest`). |
| `DECISIONS.md` | Rejestr decyzji architektonicznych (ADR). |
| `AGENTS.md` | Zasady projektowe, wytyczne Fable 5.1 i protokół startu sesji. |

---

## Konfiguracja środowiska

### 1. Moduł Pythona (`mapscope`)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

Uruchomienie testów:
```bash
.venv/bin/pytest -v
```

### 2. Panel webowy (`web`)

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Weryfikacja jakości kodu i typów:
```bash
cd web && npm test && npm run lint && npx tsc --noEmit
```

---

## Zmienne środowiskowe

Plik `.env` (serwer / background worker) oraz `web/.env.local` (panel webowy):

| Zmienna | Zastosowanie |
| --- | --- |
| `SUPABASE_URL` | Adres instancji Supabase / PostgreSQL. |
| `SUPABASE_ANON_KEY` | Klucz publiczny do odczytu (wyłącznie bezpieczne widoki z RLS). |
| `SUPABASE_SERVICE_ROLE_KEY` | Klucz administracyjny (wyłącznie po stronie serwera/workera). |
| `GEMINI_API_KEY` | Klucz API Google Gemini dla silnika analizy ryzyka (Communication Risk Engine). |
| `MAPSCOPE_AUTH_SECRET` | Sekret podpisu sesji panelu webowego (min. 32 znaki). |
| `MAPSCOPE_ADMIN_PASSWORD` | Hasło dostępu do panelu analitycznego MAPscope. |
| `TELEGRAM_BOT_TOKEN` | Token bota powiadomień kryzysowych P1/P2 (opcjonalny). |
| `TELEGRAM_ALERT_CHAT_ID` | Identyfikator kanału dyżurnego MAP (opcjonalny). |

Klucze administracyjne i tokeny AI nigdy nie są udostępniane w wiązkach przeglądarki (`NEXT_PUBLIC_`).
