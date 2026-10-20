import type {
  EntityRecord,
  CompanyDisclosureRecord,
  TopFireAlert,
  SectorStability,
  ParliamentaryInquiry,
  MediaRadarAnomalies,
} from "./types.ts";

export const OVERALL_CRISIS_TEMPERATURE = 68; // Wskaźnik 0-100 (podwyższona temperatura kryzysowa)

export const SECTOR_STABILITY_DATA: SectorStability[] = [
  {
    name: "Paliwa i Energetyka",
    entitiesCount: 6,
    temperature: 46,
    status: "podwyższone_ryzyko",
    primaryIssue: "Odpisy inwestycyjne w petrochemii oraz finansowanie transformacji sieciowej",
  },
  {
    name: "Transport i Logistyka",
    entitiesCount: 6,
    temperature: 84,
    status: "krytyczny",
    primaryIssue: "Restrukturyzacja PKP CARGO, referendum strajkowe w Poczcie Polskiej",
  },
  {
    name: "Finanse i Bankowość",
    entitiesCount: 3,
    temperature: 22,
    status: "stabilny",
    primaryIssue: "Dobre wyniki odsetkowe, stabilne dywidendy do budżetu państwa",
  },
  {
    name: "Przemysł Obronny",
    entitiesCount: 4,
    temperature: 52,
    status: "podwyższone_ryzyko",
    primaryIssue: "Zdolności produkcyjne amunicji 155 mm i realizacja kontraktów z MON",
  },
  {
    name: "Chemia i Surowce",
    entitiesCount: 3,
    temperature: 71,
    status: "podwyższone_ryzyko",
    primaryIssue: "Wysokie koszty energii i presja importowa tanich nawozów z Rosji/Białorusi",
  },
  {
    name: "Nadzór Ogólny i Restrukturyzacja",
    entitiesCount: 5,
    temperature: 78,
    status: "krytyczny",
    primaryIssue: "Afera nominacyjna w Totalizatorze Sportowym, postępowania likwidacyjne",
  },
];

export const TOP_FIRE_ALERTS: TopFireAlert[] = [
  {
    id: "fire-1",
    priority: "p1",
    entityId: "e-totalizator",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    title: "Eskalacja po oświadczeniu zarządu ws. obsady dyrekcji regionalnych",
    whatHappened:
      "Zarząd opublikował defensywne oświadczenie bagatelizujące zarzuty nepotyzmu, stwierdzając, że 'nie ulega presji mediów'. Komunikat wywołał natychmiastową falę oburzenia i zapowiedź kontroli poselskich.",
    whoResponsible: "Zarząd spółki, rzecznik prasowy, Departament Nadzoru I MAP.",
    governmentRisk:
      "Bezpośrednie uderzenie w premiera i ministra aktywów państwowych. Sprawa traktowana w mediach jako złamanie obietnic transparentnych konkursów w SSP.",
    recommendedAction:
      "Pilne polecenie zwołania rady nadzorczej, zawieszenie kontrowersyjnych powołań i ogłoszenie audytu przez zewnętrzną kancelarię prawną.",
    timestamp: "2026-10-20T18:05:00Z",
  },
  {
    id: "fire-2",
    priority: "p1",
    entityId: "e-pkp-cargo",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    title: "Zawiadomienie do prokuratury i ogłoszenie pogotowia strajkowego",
    whatHappened:
      "Związki zawodowe złożyły zawiadomienie o podejrzeniu popełnienia przestępstwa przez zarządca sanacyjnego w związku ze zwolnieniami grupowymi. Równolegle ogłoszono referendum strajkowe.",
    whoResponsible: "Zarządca sanacyjny PKP CARGO, p.o. Prezesa, Ministerstwo Infrastruktury / MAP.",
    governmentRisk:
      "Ryzyko zablokowania przewozów towarowych o znaczeniu strategicznym (węgiel do elektrowni przed zimą) oraz protestów przed siedzibą MAP.",
    recommendedAction:
      "Spotkanie ostatniej szansy z centralami związkowymi w formule Trójstronnego Zespołu ds. Kolejnictwa w MAP.",
    timestamp: "2026-10-20T16:30:00Z",
  },
  {
    id: "fire-3",
    priority: "p2",
    entityId: "e-poczta",
    entityName: "Poczta Polska S.A.",
    title: "Groźba strajku generalnego w związku z programem dobrowolnych odejść",
    whatHappened:
      "NSZZ 'Solidarność' Poczty Polskiej odrzuciła warunki planu transformacji. Związki żądają podwyżki o 800 zł brutto dla każdego pracownika i grożą wstrzymaniem doręczeń.",
    whoResponsible: "Zarząd Poczty Polskiej, Departament Nadzoru II MAP.",
    governmentRisk:
      "Paraliż usług pocztowych i doręczeń sądowych w IV kwartale oraz konieczność wypłaty rekompensaty za usługę powszechną.",
    recommendedAction:
      "Koordynacja komunikacyjna: publikacja twardych danych o stratach Poczty i konieczności ratowania spółki przed upadłością.",
    timestamp: "2026-10-20T14:15:00Z",
  },
  {
    id: "fire-4",
    priority: "p2",
    entityId: "e-azoty",
    entityName: "Grupa Azoty S.A.",
    title: "Presja płynnościowa i żądanie działań osłonowych na rynku nawozowym",
    whatHappened:
      "Grupa Azoty zamknęła III kwartał z pogłębioną stratą netto. Zarząd wystąpił o wsparcie kapitałowe oraz natychmiastowe nałożenie ceł zaporowych na nawozy z Rosji i Białorusi.",
    whoResponsible: "Zarząd Grupy Azoty, Ministerstwo Rozwoju i Technologii, MAP.",
    governmentRisk:
      "Zarzut bezczynności rządu wobec niszczenia polskiego przemysłu chemicznego przez import zza wschodniej granicy.",
    recommendedAction:
      "Wspólny wniosek MAP i MRiT do Komisji Europejskiej o zastosowanie klauzul ochronnych na rynku nawozowym.",
    timestamp: "2026-10-20T11:20:00Z",
  },
  {
    id: "fire-5",
    priority: "p2",
    entityId: "e-orlen",
    entityName: "ORLEN S.A.",
    title: "Nieautoryzowana wypowiedź prezesa o odpisach inwestycyjnych (ryzyko MAR)",
    whatHappened:
      "W wywiadzie prasowym padły sugestie o możliwym zamrożeniu wielomiliardowych inwestycji w Olefiny III przed oficjalnym raportem ESPI, co wywołało wahania kursu akcji.",
    whoResponsible: "Prezes Zarządu, Dyrektor Biura Relacji Inwestorskich.",
    governmentRisk:
      "Podejrzenie naruszenia art. 17 Rozporządzenia MAR i ryzyko pytań ze strony Komisji Nadzoru Finansowego (KNF).",
    recommendedAction:
      "Natychmiastowe wyjaśnienie z relacjami inwestorskimi ORLEN i publikacja komunikatu korygującego w systemie ESPI.",
    timestamp: "2026-10-20T09:40:00Z",
  },
];

export const PARLIAMENTARY_INQUIRIES: ParliamentaryInquiry[] = [
  {
    id: "inq-4812",
    number: "Interpelacja nr 4812",
    subject: "W sprawie trybu powoływania dyrektorów oddziałów regionalnych w Totalizatorze Sportowym Sp. z o.o.",
    author: "Poseł Jan Kowalski i grupa 14 posłów",
    addressedTo: "Minister Aktywów Państwowych",
    deadline: "2026-10-27 (pozostało 7 dni)",
    status: "W trakcie pilnego opracowania w Departamencie Nadzoru I",
    priority: "critical",
    suggestedAnswerPoints: [
      "Wskazać, że minister natychmiast po doniesieniach zlecił radzie nadzorczej całościowy audyt procedur rekrutacyjnych.",
      "Podkreślić brak bezpośredniego udziału kierownictwa MAP w obsadzie stanowisk szczebla dyrektorskiego w regionach.",
      "Zapowiedzieć wdrożenie nowego, jednolitego kodeksu rekrutacyjnego dla wszystkich spółek portfelowych MAP.",
    ],
  },
  {
    id: "inq-4801",
    number: "Interpelacja nr 4801",
    subject: "W sprawie warunków zatrudnienia i odpraw dla zwalnianych pracowników PKP CARGO S.A.",
    author: "Komisja Infrastruktury Sejmu RP",
    addressedTo: "Minister Aktywów Państwowych / Minister Infrastruktury",
    deadline: "2026-10-31",
    status: "Koordynacja międzyresortowa z Ministerstwem Infrastruktury",
    priority: "high",
    suggestedAnswerPoints: [
      "Wskazać, że postępowanie sanacyjne jest jedyną alternatywą dla natychmiastowej, likwidacyjnej upadłości spółki.",
      "Przedstawić listę 12 porozumień z innymi podmiotami kolejowymi (Polregio, PKP Intercity) w sprawie zatrudnienia zwalnianych kolejarzy.",
    ],
  },
  {
    id: "inq-4755",
    number: "Zapytanie poselskie nr 1194",
    subject: "W sprawie stanu realizacji inwestycji w terminal instalacyjny morskich farm wiatrowych w Świnoujściu",
    author: "Posłowie Ziemi Zachodniopomorskiej",
    addressedTo: "Minister Aktywów Państwowych",
    deadline: "2026-11-04",
    status: "Przekazano do ORLEN Neptun celem przygotowania danych technicznych",
    priority: "standard",
    suggestedAnswerPoints: [
      "Harmonogram prac hydrotechnicznych jest zachowany, pierwszy prąd z farmy Baltic Power popłynie zgodnie z planem w 2026 roku.",
    ],
  },
];

export const MEDIA_RADAR_ANOMALIES: MediaRadarAnomalies[] = [
  {
    entityId: "e-totalizator",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    spikeVolume: 1420,
    baselineVolume: 120,
    negativeRatio: 0.88,
    triggerEvent: "Artykuł śledczy portalu Onet o obsadzie 17 dyrekcji regionalnych bez konkursów",
    timeSeries: [
      { time: "00:00", volume: 15, sentiment: 0.1 },
      { time: "06:00", volume: 85, sentiment: -0.4 },
      { time: "09:00", volume: 340, sentiment: -0.85 },
      { time: "12:00", volume: 620, sentiment: -0.92 },
      { time: "15:00", volume: 890, sentiment: -0.89 },
      { time: "18:00", volume: 1420, sentiment: -0.88 },
      { time: "21:00", volume: 1180, sentiment: -0.84 },
    ],
  },
  {
    entityId: "e-poczta",
    entityName: "Poczta Polska S.A.",
    spikeVolume: 890,
    baselineVolume: 240,
    negativeRatio: 0.74,
    triggerEvent: "Konferencja prasowa centrali związkowych zapowiadająca ogólnopolski strajk",
    timeSeries: [
      { time: "00:00", volume: 20, sentiment: -0.1 },
      { time: "06:00", volume: 50, sentiment: -0.2 },
      { time: "09:00", volume: 180, sentiment: -0.6 },
      { time: "12:00", volume: 450, sentiment: -0.76 },
      { time: "15:00", volume: 720, sentiment: -0.75 },
      { time: "18:00", volume: 890, sentiment: -0.74 },
      { time: "21:00", volume: 610, sentiment: -0.7 },
    ],
  },
  {
    entityId: "e-orlen",
    entityName: "ORLEN S.A.",
    spikeVolume: 2150,
    baselineVolume: 1100,
    negativeRatio: 0.58,
    triggerEvent: "Dyskusja analityków giełdowych wokół opłacalności nakładów na projekt Olefiny III",
    timeSeries: [
      { time: "00:00", volume: 120, sentiment: 0.05 },
      { time: "06:00", volume: 280, sentiment: -0.15 },
      { time: "09:00", volume: 850, sentiment: -0.52 },
      { time: "12:00", volume: 1400, sentiment: -0.62 },
      { time: "15:00", volume: 1950, sentiment: -0.6 },
      { time: "18:00", volume: 2150, sentiment: -0.58 },
      { time: "21:00", volume: 1680, sentiment: -0.55 },
    ],
  },
];

export const COMPANY_DISCLOSURES_DATA: CompanyDisclosureRecord[] = [
  {
    id: "disc-1",
    entity_id: "e-totalizator",
    entity_name: "Totalizator Sportowy Sp. z o.o.",
    disclosure_type: "Oficjalne oświadczenie zarządu",
    title: "Oświadczenie w sprawie doniesień medialnych dotyczących powołań w oddziałach regionalnych",
    content:
      "W związku z nieprawdziwymi publikacjami medialnymi Zarząd Totalizatora Sportowego oświadcza, że wszelkie decyzje kadrowe w oddziałach spółki podejmowane są zgodnie z prawem i wewnętrznymi regulaminami. Spółka nie ulega presji medialnej i uznaje zarzuty za motywowane politycznie.",
    channel: "Serwis prasowy / Profil X",
    speaker_name: "Zarząd Spółki",
    published_at: "2026-10-20T17:45:00Z",
    source_url: "https://www.totalizator.pl/biuro-prasowe/komunikaty",
    risk_assessment: {
      id: "ra-1",
      target_id: "disc-1",
      entity_id: "e-totalizator",
      entity_name: "Totalizator Sportowy Sp. z o.o.",
      severity: "p1_critical",
      overall_risk_score: 8.8,
      communication_risks: {
        blad_narracyjny: true,
        rozdzwiek_z_rzadem: true,
        zaognienie_konfliktu: true,
        ryzyko_regulacyjne_mar: false,
        szczegoly: {
          blad_narracyjny:
            "Arogancki, defensywny ton ('nie ulega presji') bez odniesienia się do twardych faktów i nazwisk ujawnionych w publikacjach.",
          rozdzwiek_z_rzadem:
            "Wypowiedź stoi w ostrej sprzeczności z poranną deklaracją premiera o konieczności natychmiastowego wyjaśnienia i bezwzględnej transparentności w SSP.",
          zaognienie_konfliktu:
            "Sformułowanie 'zarzuty motywowane politycznie' bezpośrednio antagonizuje dziennikarzy śledczych i prowokuje kolejne publikacje.",
        },
      },
      governance_risks: {
        kadry_spory: true,
        kontrole_sledztwa: true,
        finanse_plynnosc: false,
        infrastruktura_awarie: false,
        narracja_polityczna: true,
        szczegoly: {
          kadry_spory: "Żądanie odwołania zarządu przez koalicjantów rządowych.",
          kontrole_sledztwa: "Zawiadomienie do CBA i zapowiedź kontroli poselskich.",
          narracja_polityczna: "Główny temat wydania wiadomości telewizyjnych i debat w parlamencie.",
        },
      },
      narrative_comparison: {
        companyClaim:
          "Wszystkie powołania są zgodne z wewnętrznym regulaminem, spółka jest apolityczna i odporna na naciski.",
        mediaCoverage:
          "Ujawniono listę 17 działaczy powiązanych z partiami rządzącymi bez konkursów na stanowiskach regionalnych.",
        publicReaction:
          "Komentatorzy na X i LinkedIn wskazują na kompromitację standardów etycznych i żądają natychmiastowych dymisji.",
      },
      executive_summary:
        "Oświadczenie Totalizatora Sportowego zaogniło kryzys. Spółka przyjęła postawę konfrontacyjną, zamiast zadeklarować pełną współpracę z organami kontrolnymi i MAP.",
      map_impact_analysis:
        "Bezpośredni rykoszet w kierownictwo MAP: zarzut zaniechania nadzoru właścicielskiego i tolerowania nominacji partyjnych w spółce monopolicie Skarbu Państwa.",
      recommendedAction:
        "Pilne wezwanie Rady Nadzorczej na poranne posiedzenie w MAP, zawieszenie kontrowersyjnych uchwał zarządu i komunikat rzecznika MAP.",
      assessed_at: "2026-10-20T18:02:00Z",
    },
  },
  {
    id: "disc-2",
    entity_id: "e-pkp-cargo",
    entity_name: "PKP CARGO S.A. w restrukturyzacji",
    title: "Stanowisko Zarządcy ws. dialogu ze związkami zawodowymi i zwolnień grupowych",
    content:
      "Zarządca sanacyjny PKP CARGO podkreśla, że redukcja zatrudnienia o 30% jest warunkiem koniecznym zatwierdzenia planu restrukturyzacji przez sąd. Brak porozumienia ze stroną społeczną nie wstrzyma procedury sanacyjnej.",
    disclosure_type: "Komunikat relacji inwestorskich / mediów",
    channel: "Portal ESPI / Serwis prasowy",
    speaker_name: "Zarządca Sanacyjny",
    published_at: "2026-10-20T15:30:00Z",
    source_url: "https://www.pkpcargo.com/pl/relacje-inwestorskie",
    risk_assessment: {
      id: "ra-2",
      target_id: "disc-2",
      entity_id: "e-pkp-cargo",
      entity_name: "PKP CARGO S.A. w restrukturyzacji",
      severity: "p1_critical",
      overall_risk_score: 8.2,
      communication_risks: {
        blad_narracyjny: false,
        rozdzwiek_z_rzadem: false,
        zaognienie_konfliktu: true,
        ryzyko_regulacyjne_mar: false,
        szczegoly: {
          zaognienie_konfliktu:
            "Deklaracja o wdrożeniu zwolnień bez względu na brak porozumienia ze związkami doprowadziła do natychmiastowego ogłoszenia pogotowia strajkowego.",
        },
      },
      governance_risks: {
        kadry_spory: true,
        kontrole_sledztwa: true,
        finanse_plynnosc: true,
        infrastruktura_awarie: true,
        narracja_polityczna: true,
      },
      narrative_comparison: {
        companyClaim:
          "Cięcia kosztów pracowniczych są jedynym sposobem na uniknięcie likwidacji całego narodowego przewoźnika.",
        mediaCoverage:
          "Dramat tysięcy rodzin kolejarskich w regionach, związki zawodowe oskarżają zarządcę o likwidację polskiej kolei.",
        publicReaction:
          "Debata nad odpowiedzialnością poprzednich i obecnych zarządów za wielomiliardowe zadłużenie.",
      },
      executive_summary:
        "Twarda linia zarządcy sanacyjnego doprowadziła do zerwania rozmów ze stroną społeczną i groźby paraliżu przewozów towarowych.",
      map_impact_analysis:
        "Protesty kolejarzy pod gmachem MAP i KPRM. Opozycja żąda debaty sejmowej nad stanem bezpieczeństwa transportowego państwa.",
      recommendedAction:
        "Uruchomienie mediacji rządowej z udziałem wiceministra aktywów państwowych odpowiedzialnego za transport.",
      assessed_at: "2026-10-20T16:05:00Z",
    },
  },
  {
    id: "disc-3",
    entity_id: "e-poczta",
    entity_name: "Poczta Polska S.A.",
    title: "Informacja o postępach w programie transformacji operacyjnej i rozmowach ze związkami",
    content:
      "Zarząd Poczty Polskiej kontynuuje dialog ze stroną społeczną. Realizowany plan transformacji ma na celu przywrócenie rentowności spółki. Program dobrowolnych odejść obejmie wyłącznie pracowników administracji.",
    disclosure_type: "Komunikat do pracowników i mediów",
    channel: "Biuro prasowe",
    speaker_name: "Rzecznik Prasowy",
    published_at: "2026-10-20T14:15:00Z",
    source_url: "https://media.poczta-polska.pl",
    risk_assessment: {
      id: "ra-3",
      target_id: "disc-3",
      entity_id: "e-poczta",
      entity_name: "Poczta Polska S.A.",
      severity: "p2_high",
      overall_risk_score: 6.4,
      communication_risks: {
        blad_narracyjny: false,
        rozdzwiek_z_rzadem: false,
        zaognienie_konfliktu: true,
        ryzyko_regulacyjne_mar: false,
        szczegoly: {
          zaognienie_konfliktu: "Związki zawodowe kwestionują definicję stanowisk administracyjnych.",
        },
      },
      governance_risks: {
        kadry_spory: true,
        kontrole_sledztwa: false,
        finanse_plynnosc: true,
        infrastruktura_awarie: false,
        narracja_polityczna: true,
      },
      narrative_comparison: {
        companyClaim: "Transformacja chroni listonoszy i placówki, tnąc zbędną biurokrację centralną.",
        mediaCoverage: "Kolejne referendum strajkowe i niepewność co do wypłat rekompensaty unijnej.",
        publicReaction: "Obawy obywateli w małych miejscowościach o likwidację lokalnych urzędów pocztowych.",
      },
      executive_summary: "Poczta Polska ogłasza szczegóły programu transformacji. Związki zawodowe odrzucają propozycje zarządu.",
      map_impact_analysis: "Ryzyko masowych pikiet pocztowców przed siedzibą MAP w okresie przedświątecznym.",
      recommendedAction: "Bieżąca koordynacja z Departamentem Nadzoru II w MAP i monitoring frekwencji w referendum strajkowym.",
      assessed_at: "2026-10-20T15:00:00Z",
    },
  },
  {
    id: "disc-4",
    entity_id: "e-orlen",
    entity_name: "ORLEN S.A.",
    title: "Wywiad prezesa na temat efektywności nakładów kapitałowych w segmencie petrochemicznym",
    content:
      "Prezes zarządu odniósł się do opłacalności projektów wodorowych oraz planów rewizji nakładów kapitałowych na petrochemię. Podkreślił konieczność urealnienia wskaźników zwrotu i weryfikacji sensu kontynuacji megaprojektów.",
    disclosure_type: "Wywiad prasowy autoryzowany",
    channel: "Dziennik ekonomiczny",
    speaker_name: "Prezes Zarządu",
    published_at: "2026-10-20T09:30:00Z",
    source_url: "https://www.orlen.pl/pl/relacje-inwestorskie",
    risk_assessment: {
      id: "ra-4",
      target_id: "disc-4",
      entity_id: "e-orlen",
      entity_name: "ORLEN S.A.",
      severity: "p2_high",
      overall_risk_score: 5.9,
      communication_risks: {
        blad_narracyjny: false,
        rozdzwiek_z_rzadem: false,
        zaognienie_konfliktu: false,
        ryzyko_regulacyjne_mar: true,
        szczegoly: {
          ryzyko_regulacyjne_mar:
            "Wypowiedź dotyka potencjalnych odpisów aktualizujących wartość inwestycji przed oficjalnym raportem ESPI.",
        },
      },
      governance_risks: {
        kadry_spory: false,
        kontrole_sledztwa: false,
        finanse_plynnosc: true,
        infrastruktura_awarie: false,
        narracja_polityczna: false,
      },
      narrative_comparison: {
        companyClaim: "Urealniamy harmonogramy i odcinamy nieopłacalne projekty z poprzednich lat.",
        mediaCoverage: "Czy ORLEN odpisze 15 miliardów na Olefiny III? Spadek kursu na GPW.",
        publicReaction: "Inwestorzy instytucjonalni oczekują natychmiastowego raportu bieżącego ESPI.",
      },
      executive_summary: "Wywiad prezesa ORLEN wywołał falę spekulacji analityków na temat skali odpisów kapitałowych.",
      map_impact_analysis: "Wpływ na wycenę akcji Skarbu Państwa i pytania o ewentualne straty majątkowe.",
      recommendedAction: "Uczulenie biura relacji inwestorskich spółki na reżim MAR przed publikacją raportu kwartalnego.",
      assessed_at: "2026-10-20T10:15:00Z",
    },
  },
];

export { ALL_ENTITIES_REGISTRY, EXECUTIVE_ANALYTICS } from "./all-ssp-registry.ts";
export type { ExecutiveAnalyticsSummary } from "./all-ssp-registry.ts";
