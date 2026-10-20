import type {
  EntityRecord,
  CompanyDisclosureRecord,
  TopFireAlert,
  SectorStability,
  ParliamentaryInquiry,
  MediaRadarAnomalies,
  KprmOnePager,
  PrePublicationAuditResult,
  MinisterImpactBreakdown,
  NarrativeSourceBreakdown,
  MandateExpiryAlert,
  Article19ComplianceRecord,
  GovernanceSentimentCorrelation,
  DividendBudgetProjection,
  StrategicCapexProject,
  InterMinisterialTransferRecord,
  NikInspectionRecommendation,
  VoivodeshipRegionalData,
  RiskMatrixScatterPoint,
  SankeyFlowNode,
  SankeyFlowLink,
  RadarSpiderMetrics,
  GovernanceNetworkNode,
  GovernanceNetworkEdge,
  ReputationWaterfallStep,
  CalendarHeatmapDay,
  StockExchangeData,
  EspiReportRecord,
  AnalystConsensusRecord,
  LocalMunicipalIssue,
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
    attribution: "nasza_odpowiedzialnosc",
    attributionDetails:
      "Nominacje regionalne zrealizowane w bieżącym roku przez zarząd powołany w obecnej kadencji. Ryzyko personalne dla kierownictwa MAP najwyższe.",
    ministerImpactScore: 92,
    sejmQnA: [
      {
        question: "Panie Ministrze, czy w Totalizatorze stanowiska rozdano działaczom bez żadnych konkursów?",
        source: "Konferencja prasowa w Sejmie / Onet / TVN24",
        hardFacts: "Formalnie stanowiska dyrektorów oddziałów nie podlegały pod ustawę o zasadach zarządzania mieniem państwowym, lecz autonomiczne regulaminy spółki. Spółka powołała 17 dyrektorów w sierpniu 2026 r.",
        recommendedAnswer: "Resort nie toleruje żadnych wątpliwości etycznych. Zobowiązałem Radę Nadzorczą do wstrzymania wszelkich nominacji spornych i rozpisania jawnych konkursów z publikacją życiorysów.",
        redLines: "Pod żadnym pozorem nie bronić personalnie nominatów i nie mówić, że 'spółka miała prawo i nic nam do tego'."
      },
      {
        question: "Czy prezes Totalizatora zostanie odwołany za to butne oświadczenie?",
        source: "Pytanie w korytarzu sejmowym",
        hardFacts: "Zarząd powołuje i odwołuje Rada Nadzorcza, w której MAP posiada przedstawicieli.",
        recommendedAnswer: "Rada Nadzorcza analizuje skutki wizerunkowe i prawne działań zarządu. Raport pokontrolny trafi na moje biurko w ciągu 48 godzin.",
        redLines: "Nie ogłaszać dymisji przed formalnym posiedzeniem Rady Nadzorczej."
      }
    ]
  },
  {
    id: "fire-2",
    priority: "p1",
    entityId: "e-pkp-cargo",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    title: "Zawiadomienie do prokuratury i ogłoszenie pogotowia strajkowego",
    whatHappened:
      "Związki zawodowe złożyły zawiadomienie o podejrzeniu popełnienia przestępstwa przez zarządcę sanacyjnego w związku ze zwolnieniami grupowymi. Równolegle ogłoszono referendum strajkowe.",
    whoResponsible: "Zarządca sanacyjny PKP CARGO, p.o. Prezesa, Ministerstwo Infrastruktury / MAP.",
    governmentRisk:
      "Ryzyko zablokowania przewozów towarowych o znaczeniu strategicznym (węgiel do elektrowni przed zimą) oraz protestów przed siedzibą MAP.",
    recommendedAction:
      "Spotkanie ostatniej szansy z centralami związkowymi w formule Trójstronnego Zespołu ds. Kolejnictwa w MAP.",
    timestamp: "2026-10-20T16:30:00Z",
    attribution: "zaszlosc_historyczna",
    attributionDetails:
      "Zadłużenie 5,2 mld zł i utrata 35% rynku to efekt nietrafionych decyzji taborowych i decyzji węglowych z lat 2018-2022. Sanacja to jedyny sposób na uniknięcie upadłości likwidacyjnej.",
    ministerImpactScore: 78,
    sejmQnA: [
      {
        question: "Dlaczego rząd zwalnia 4000 kolejarzy w PKP CARGO, zamiast pomóc spółce finansowo?",
        source: "Pytania bieżące w Sejmie / Posłowie opozycji",
        hardFacts: "Bezpośrednia dotacja budżetowa bez zgody KE to nielegalna pomoc publiczna grożąca natychmiastową egzekucją. Zobowiązania spółki przekraczają 5,2 mld zł.",
        recommendedAnswer: "Sanacja to ratunek przed całkowitą likwidacją i ochrona 10 000 pozostałych etatów. Każdy odchodzący pracownik ma gwarancję pierwszeństwa zatrudnienia w PKP Intercity i Polregio w ramach porozumień MAP.",
        redLines: "Nie nazywać sanacji 'optymalizacją' i nie umniejszać dramatu zwalnianych rodzin kolejarskich."
      }
    ]
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
    attribution: "zaszlosc_historyczna",
    attributionDetails:
      "Strata operacyjna 780 mln zł jest skutkiem wieloletniego braku inwestycji w cyfryzację i logistykę paczkową oraz blokady notyfikacji rekompensaty unijnej w latach 2021-2023.",
    ministerImpactScore: 68,
    sejmQnA: [
      {
        question: "Czy zamierzacie zamknąć placówki pocztowe w małych gminach?",
        source: "Interpelacje poselskie z regionów",
        hardFacts: "Plan transformacji Poczty nie zakłada likwidacji placówek w gminach, lecz ich unowocześnienie i rozszerzenie o usługi bankowo-administracyjne (Centra Obsługi Obywatela).",
        recommendedAnswer: "Żadna placówka na prowincji nie zostanie zamknięta. Poczta pozostanie filarem łączności państwowej z obywatelem, a plan transformacji ma uchronić ją przed bankructwem.",
        redLines: "Nie posługiwać się pojęciem 'nierentowna wieś' ani 'cięcie kosztów placówek'."
      }
    ]
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
    attribution: "zaszlosc_historyczna",
    attributionDetails:
      "Skrajne zadłużenie (ponad 10 mld zł długu netto) to efekt nietrafionego projektu Polimery Police zainicjowanego w 2019 r. i braku ceł osłonowych w latach 2022-2023.",
    ministerImpactScore: 54,
    sejmQnA: [
      {
        question: "Dlaczego Grupa Azoty przynosi setki milionów strat, a rynek zalewają nawozy ze Wschodu?",
        source: "Kluby parlamentarne opozycji",
        hardFacts: "Import z Rosji wzrósł o 140% w 2023 r. z powodu braku unijnych ceł. Obecny rząd skierował wniosek do Brukseli o 30% cła zaporowe.",
        recommendedAnswer: "Odziedziczyliśmy chemię obciążoną 10 miliardami długu za Polimery Police. Walczymy w Brukseli o natychmiastowe cła zaporowe na rosyjski mocznik, chroniąc Zakłady w Puławach i Tarnowie.",
        redLines: "Nie obiecywać natychmiastowej dotacji gotówkowej z budżetu bez zgody KE."
      }
    ]
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
    attribution: "miedzyresortowa",
    attributionDetails:
      "Sprawa dotyczy giełdowego reżimu informacyjnego spółki publicznej podlegającej bezpośrednio pod nadzór KNF.",
    ministerImpactScore: 62,
    sejmQnA: [
      {
        question: "Czy ministerstwo naciska na wstrzymanie flagowej inwestycji Olefiny III?",
        source: "PAP Biznes / GPW",
        hardFacts: "Koszt projektu wzrósł z pierwotnych 8,3 mld zł do ponad 25 mld zł na skutek aneksów z lat 2021-2023. Zarząd prowadzi audyt opłacalności.",
        recommendedAnswer: "MAP oczekuje od zarządu rzetelnego audytu ekonomicznego. Każda złotówka państwowego majątku musi mieć uzasadnienie biznesowe, a nie propagandowe.",
        redLines: "Nie przesądzać ostatecznego losu inwestycji przed raportem audytora."
      }
    ]
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

export const KPRM_ONE_PAGER_DATA: KprmOnePager = {
  id: "kprm-2026-10-21",
  date: "2026-10-20",
  targetCabinetMeetingDate: "2026-10-21 (Środa, posiedzenie Rady Ministrów)",
  title: "Raport Sytuacyjny MAP dla Prezesa Rady Ministrów: Portfel Spółek Skarbu Państwa",
  executiveSummary:
    "Sytuacja w 406 spółkach portfelowych pod kontrolą operacyjną. Ogniska zapalne (Totalizator Sportowy, PKP CARGO, Poczta Polska) zabezpieczone od strony prawnej i osłonowej. Rekomendacja podjęcia decyzji kierunkowej w sprawie wniosku o cła ochronne na nawozy (Grupa Azoty) oraz synchronizacji z Ministrem Finansów w sprawie harmonogramu wypłaty rekompensaty pocztowej.",
  items: [
    {
      category: "pozar_wygaszony",
      title: "Wstrzymanie kontrowersyjnych nominacji i natychmiastowy audyt",
      entityName: "Totalizator Sportowy Sp. z o.o.",
      details:
        "Rada Nadzorcza podjęła uchwałę o audycie zewnętrznym procedur rekrutacyjnych i zawieszeniu 17 dyrektorów. Odrzucono defensywną narrację poprzedniego zarządu.",
    },
    {
      category: "sukces",
      title: "Pakiety osłonowe dla kolejarzy w spółkach siostrzanych",
      entityName: "PKP CARGO S.A. w restrukturyzacji",
      details:
        "Zabezpieczono porozumienia z PKP Intercity, Polregio i Wars na przejęcie do 2 500 wykwalifikowanych pracowników. Zminimalizowano ryzyko paraliżu węglowego przed sezonem grzewczym.",
    },
    {
      category: "ryzyko_miedzyresortowe",
      title: "Cła zaporowe na rosyjski i białoruski mocznik",
      entityName: "Grupa Azoty S.A.",
      details:
        "Wywóz kapitału i dumping nawozowy zagrażają płynności Grupy Azoty (10 mld zł długu odziedziczonego po Polimerach Police). Wymagana skoordynowana presja MAP i MRiT w Brukseli.",
      actionRequired: "Polecenie Prezesa RM dla Ministra Rozwoju o pilne wspólne wystąpienie do KE.",
    },
    {
      category: "decyzja_premiera",
      title: "Transza rekompensaty za powszechne usługi pocztowe",
      entityName: "Poczta Polska S.A.",
      details:
        "Poczta zakończyła negocjacje Programu Dobrowolnych Odejść. Do zachowania płynności niezbędna jest wypłata zatwierdzonej przez KE transzy budżetowej (ok. 700 mln zł).",
      actionRequired: "Dyspozycja dla Ministra Finansów o terminie uruchomienia płatności.",
    },
  ],
  restructuringProgress: [
    {
      entityName: "PKP CARGO S.A.",
      targetSavings: "450 mln zł rocznie",
      headcountChange: "-3 650 etatów (z programem osłonowym)",
      currentStatus: "Sanacja sądowa pod nadzorem komisarza, wygaszanie nierentownych baz",
    },
    {
      entityName: "Poczta Polska S.A.",
      targetSavings: "620 mln zł rocznie",
      headcountChange: "-5 000 etatów (Program Dobrowolnych Odejść)",
      currentStatus: "Wdrażanie formatu placówek jako Centrów Usług Obywatelskich",
    },
    {
      entityName: "Grupa Azoty S.A.",
      targetSavings: "380 mln zł rocznie",
      headcountChange: "Ujednolicenie struktur zarządczych spółek córek",
      currentStatus: "Audyt techniczno-finansowy instalacji Polimery Police",
    },
  ],
};

export const MINISTER_IMPACT_BREAKDOWNS: MinisterImpactBreakdown[] = [
  {
    entityId: "e-totalizator",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    impactScorePercent: 92,
    attackVectors: [
      {
        vector: "Personalny zarzut zaniechania nadzoru",
        severity: "wysoka",
        allegation: "Opozycja zarzuca ministrowi tolerowanie partyjnych nominacji w spółce podległej w 100% MAP.",
      },
      {
        vector: "Pytania o kryteria doboru rady nadzorczej",
        severity: "wysoka",
        allegation: "Prześwietlanie powiązań członków rady nadzorczej zatwierdzających statut.",
      },
      {
        vector: "Wniosek o kontrolę NIK i zwołanie komisji sejmowej",
        severity: "srednia",
        allegation: "Próba zwołania nadzwyczajnego posiedzenia Komisji ds. Energii, Klimatu i Aktywów Państwowych.",
      },
    ],
    mitigationStrategy:
      "Twarde odcięcie od decyzji personalnych prezesa, natychmiastowe zwołanie rady nadzorczej i wdrożenie jednolitego regulaminu konkursowego dla wszystkich 406 spółek Skarbu Państwa.",
  },
  {
    entityId: "e-pkp-cargo",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    impactScorePercent: 78,
    attackVectors: [
      {
        vector: "Zarzut niszczenia polskiego przewoźnika narodowego",
        severity: "wysoka",
        allegation: "Hasła związkowe o 'likwidacji dorobku polskiej kolei' i otwieraniu rynku dla przewoźników zagranicznych.",
      },
      {
        vector: "Pikiety i blokady komunikacyjne pod gmachem MAP",
        severity: "srednia",
        allegation: "Próba przeniesienia protestu z torów kolejowych na ulicę Wspólną w Warszawie.",
      },
    ],
    mitigationStrategy:
      "Konsekwentne pokazywanie 5,2 mld zł długów z lat 2018-2022 oraz prezentowanie konkretnych umów o pracę oferowanych kolejarzom w PKP Intercity i Polregio.",
  },
  {
    entityId: "e-poczta",
    entityName: "Poczta Polska S.A.",
    impactScorePercent: 68,
    attackVectors: [
      {
        vector: "Zarzut zwijania państwa na prowincji",
        severity: "wysoka",
        allegation: "Kreowanie narracji o rzekomym zamykaniu wiejskich urzędów pocztowych i zwalnianiu listonoszy.",
      },
      {
        vector: "Spór ze związkami zawodowymi",
        severity: "srednia",
        allegation: "Oskarżenia o brak dialogu społecznego i odmowę podwyżek płac.",
      },
    ],
    mitigationStrategy:
      "Akcentowanie gwarancji utrzymania wszystkich placówek gminnych i przekształcenia ich w Centra Obsługi Obywatela oraz przedstawienie twardych danych o 780 mln zł straty.",
  },
  {
    entityId: "e-azoty",
    entityName: "Grupa Azoty S.A.",
    impactScorePercent: 54,
    attackVectors: [
      {
        vector: "Bezczynność wobec dumpingu ze Wschodu",
        severity: "srednia",
        allegation: "Zarzut braku ochrony rodzimego rynku przed rosyjskimi i białoruskimi nawozami.",
      },
    ],
    mitigationStrategy:
      "Upowszechnienie informacji o złożonym w Brukseli wniosku o 30% cła zaporowe oraz audycie 10 mld zł długu za projekt Polimery Police.",
  },
  {
    entityId: "e-orlen",
    entityName: "ORLEN S.A.",
    impactScorePercent: 62,
    attackVectors: [
      {
        vector: "Wpływ wypowiedzi politycznych na giełdę (reżim MAR)",
        severity: "wysoka",
        allegation: "Podejrzenia o manipulowanie kursem akcji spółki przez nieprzemyślane zapowiedzi wstrzymania inwestycji.",
      },
    ],
    mitigationStrategy:
      "Ścisłe przestrzeganie procedur relacji inwestorskich i komunikowanie decyzji strategicznych wyłącznie przez oficjalne raporty giełdowe ESPI.",
  },
];

export const PRE_PUBLICATION_AUDITS: PrePublicationAuditResult[] = [
  {
    id: "pre-1",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    inputText:
      "Zarząd Totalizatora Sportowego oświadcza, że wszelkie decyzje kadrowe w oddziałach terenowych leżą w wyłącznej kompetencji prezesa. Spółka nie zamierza ulegać presji nagonki medialnej ani żądaniom polityków opozycji.",
    verdict: "red",
    verdictLabel: "Krytyczne ryzyko rykoszetu",
    riskHighlights: [
      {
        phrase: "nie zamierza ulegać presji nagonki medialnej",
        dangerType: "arogancja",
        comment: "Zwrot wybitnie konfrontacyjny, odbierany przez opinię publiczną jako arogancja władzy i lekceważenie opinii publicznej.",
      },
      {
        phrase: "wyłącznej kompetencji prezesa",
        dangerType: "rozdzwiek_z_map",
        comment: "Sprzeczne ze statutem nadzorczym MAP nakazującym poszanowanie standardów ładu korporacyjnego.",
      },
    ],
    improvedVersion:
      "W związku z pytaniami dotyczącymi procedur rekrutacyjnych w oddziałach regionalnych, Zarząd informuje, że przekazał Radzie Nadzorczej pełną dokumentację rekrutacyjną. Spółka wdraża jednolity standard otwartych postępowań konkursowych.",
  },
  {
    id: "pre-2",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    inputText:
      "Zarządca sanacyjny informuje, że z powodu destrukcyjnych działań związków zawodowych i braku wsparcia rządu zmuszony jest zwolnić kolejne 2000 pracowników bez prawa do odpraw.",
    verdict: "red",
    verdictLabel: "Krytyczne ryzyko rykoszetu",
    riskHighlights: [
      {
        phrase: "braku wsparcia rządu",
        dangerType: "rozdzwiek_z_map",
        comment: "Bezpośrednie uderzenie w MAP i premiera, fałszywa teza ignorująca pakiety osłonowe w Polregio i PKP Intercity.",
      },
      {
        phrase: "bez prawa do odpraw",
        dangerType: "zaognienie_konfliktu",
        comment: "Ryzyko natychmiastowego wybuchu dzikiego strajku na węzłach kolejowych i zarzutów naruszenia Kodeksu Pracy.",
      },
    ],
    improvedVersion:
      "W ramach realizacji planu sanacyjnego zatwierdzonego przez sąd, zarządca kontynuuje dialog ze stroną społeczną. Każdy pracownik objęty restrukturyzacją otrzymuje oferty zatrudnienia u partnerskich przewoźników kolejowych.",
  },
  {
    id: "pre-3",
    entityName: "Poczta Polska S.A.",
    inputText:
      "Poczta Polska realizuje niezbędny plan transformacji cyfrowej. Zmiany nie oznaczają likwidacji placówek na obszarach wiejskich, a listonosze otrzymują gwarancje stabilności w nowym modelu usług.",
    verdict: "green",
    verdictLabel: "Bezpieczne do publikacji",
    riskHighlights: [],
    improvedVersion:
      "Komunikat wyważony, merytoryczny i spójny z linią resortu MAP.",
  },
];

export const NARRATIVE_SOURCES_MAP: Record<string, NarrativeSourceBreakdown> = {
  "e-totalizator": {
    oppositionPoliticiansPercent: 48,
    laborUnionsPercent: 5,
    regionalMediaPercent: 22,
    nationalMediaPercent: 20,
    financialAnalystsPercent: 5,
    primaryNarrativeDriver: "Posłowie opozycji i dziennikarstwo śledcze ogólnokrajowe",
  },
  "e-pkp-cargo": {
    oppositionPoliticiansPercent: 25,
    laborUnionsPercent: 45,
    regionalMediaPercent: 15,
    nationalMediaPercent: 10,
    financialAnalystsPercent: 5,
    primaryNarrativeDriver: "Centrale związkowe (Solidarność, Federacja Związków Zawodowych Kolejarzy)",
  },
  "e-poczta": {
    oppositionPoliticiansPercent: 30,
    laborUnionsPercent: 40,
    regionalMediaPercent: 18,
    nationalMediaPercent: 10,
    financialAnalystsPercent: 2,
    primaryNarrativeDriver: "Związki zawodowe i lokalne komitety obrony placówek pocztowych",
  },
  "e-azoty": {
    oppositionPoliticiansPercent: 35,
    laborUnionsPercent: 20,
    regionalMediaPercent: 15,
    nationalMediaPercent: 12,
    financialAnalystsPercent: 18,
    primaryNarrativeDriver: "Kluby parlamentarne opozycji i analitycy rynku chemicznego",
  },
  "e-orlen": {
    oppositionPoliticiansPercent: 20,
    laborUnionsPercent: 5,
    regionalMediaPercent: 5,
    nationalMediaPercent: 35,
    financialAnalystsPercent: 35,
    primaryNarrativeDriver: "Analitycy domów maklerskich i media gospodarcze",
  },
};

export const MANDATE_EXPIRY_ALERTS: MandateExpiryAlert[] = [
  {
    id: "exp-1",
    entityId: "e-pge",
    entityName: "PGE Polska Grupa Energetyczna S.A.",
    bodyType: "Rada Nadzorcza",
    daysLeft: 18,
    expiryDate: "2026-11-08",
    affectedSeats: 4,
    totalSeats: 9,
    quorumLossRisk: true,
    notes: "Upływ wspólnej kadencji 4 członków delegowanych przez Skarb Państwa. Ryzyko braku kworum do zatwierdzenia planu emisyjnego.",
  },
  {
    id: "exp-2",
    entityId: "e-kghm",
    entityName: "KGHM Polska Miedź S.A.",
    bodyType: "Zarząd",
    daysLeft: 34,
    expiryDate: "2026-11-24",
    affectedSeats: 2,
    totalSeats: 5,
    quorumLossRisk: false,
    notes: "Wygasają mandaty wiceprezesa ds. rozwoju i wiceprezesa ds. aktywów zagranicznych. Konieczne rozstrzygnięcie postępowań kwalifikacyjnych.",
  },
  {
    id: "exp-3",
    entityId: "e-pgz",
    entityName: "Polska Grupa Zbrojeniowa S.A.",
    bodyType: "Rada Nadzorcza",
    daysLeft: 42,
    expiryDate: "2026-12-02",
    affectedSeats: 3,
    totalSeats: 7,
    quorumLossRisk: true,
    notes: "Konieczność uzgodnienia kandydatur między MAP a Ministerstwem Obrony Narodowej przed NWZA.",
  },
  {
    id: "exp-4",
    entityId: "e-poczta",
    entityName: "Poczta Polska S.A.",
    bodyType: "Zarząd",
    daysLeft: 61,
    expiryDate: "2026-12-21",
    affectedSeats: 1,
    totalSeats: 4,
    quorumLossRisk: false,
    notes: "Wakat na stanowisku wiceprezesa ds. sieci i nieruchomości po rezygnacji ze względów zdrowotnych.",
  },
  {
    id: "exp-5",
    entityId: "e-tauron",
    entityName: "TAURON Polska Energia S.A.",
    bodyType: "Rada Nadzorcza",
    daysLeft: 79,
    expiryDate: "2027-01-08",
    affectedSeats: 2,
    totalSeats: 8,
    quorumLossRisk: false,
    notes: "Rotacja przedstawicieli akcjonariuszy mniejszościowych na najbliższym ZWZ.",
  },
];

export const ARTICLE_19_COMPLIANCE_DATA: Article19ComplianceRecord[] = [
  {
    personName: "dr hab. Marek Zieliński",
    entityName: "PGE Polska Grupa Energetyczna S.A.",
    role: "Członek Rady Nadzorczej",
    passedExam: true,
    legalOrFinanceDegree: true,
    noPoliticalBanConflict: true,
    complianceStatus: "zgodny",
    verificationDetails: "Doktor habilitowany nauk prawnych, zdany egzamin państwowy dla kandydatów na członków rad nadzorczych (2021), brak przynależności partyjnej.",
  },
  {
    personName: "Ewa Dąbrowska",
    entityName: "KGHM Polska Miedź S.A.",
    role: "Przewodnicząca Komitetu Audytu RN",
    passedExam: true,
    legalOrFinanceDegree: true,
    noPoliticalBanConflict: true,
    complianceStatus: "zgodny",
    verificationDetails: "Biegły rewident, certyfikat ACCA, wieloletnie doświadczenie w audycie spółek publicznych.",
  },
  {
    personName: "Tomasz Kamiński",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    role: "Członek Rady Nadzorczej",
    passedExam: true,
    legalOrFinanceDegree: false,
    noPoliticalBanConflict: true,
    complianceStatus: "w_trakcie_weryfikacji",
    verificationDetails: "Złożony wniosek o uzupełnienie dyplomu studiów podyplomowych MBA w procedurze nostryfikacyjnej.",
  },
  {
    personName: "Piotr Wiśniewski",
    entityName: "Polska Grupa Zbrojeniowa S.A.",
    role: "Wiceprzewodniczący RN",
    passedExam: true,
    legalOrFinanceDegree: true,
    noPoliticalBanConflict: true,
    complianceStatus: "zgodny",
    verificationDetails: "Pozytywna opinia Rady ds. spółek z udziałem Skarbu Państwa i państwowych osób prawnych z dnia 14.05.2025 r.",
  },
  {
    personName: "Anna Lewandowska",
    entityName: "Polskie Porty Lotnicze S.A.",
    role: "Członek RN",
    passedExam: false,
    legalOrFinanceDegree: true,
    noPoliticalBanConflict: false,
    complianceStatus: "niezgodny",
    verificationDetails: "Zidentyfikowano pełnienie funkcji w komitecie wyborczym w wyborach samorządowych 2024 r. Sprawa skierowana do pilnego odwołania przez Departament Nadzoru.",
  },
];

export const GOVERNANCE_SENTIMENT_HISTORY: GovernanceSentimentCorrelation[] = [
  {
    entityId: "e-totalizator",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    changeDate: "2026-10-18",
    eventDescription: "Zwołanie nadzwyczajnego posiedzenia RN i zawieszenie 17 dyrektorów regionalnych",
    sentimentBefore: -0.88,
    sentimentAfter: -0.32,
    crisisDropPercent: 63,
  },
  {
    entityId: "e-orlen",
    entityName: "ORLEN S.A.",
    changeDate: "2026-06-15",
    eventDescription: "Wyłonienie prezesa w otwartym konkursie i powołanie nowego komitetu audytu",
    sentimentBefore: -0.74,
    sentimentAfter: +0.28,
    crisisDropPercent: 82,
  },
  {
    entityId: "e-azoty",
    entityName: "Grupa Azoty S.A.",
    changeDate: "2026-07-20",
    eventDescription: "Powołanie zarządu eksperckiego i rozpoczęcie negocjacji z bankami ws. zadłużenia",
    sentimentBefore: -0.91,
    sentimentAfter: -0.41,
    crisisDropPercent: 55,
  },
  {
    entityId: "e-pkp-cargo",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    changeDate: "2026-08-01",
    eventDescription: "Wprowadzenie zarządcy sanacyjnego przez sąd i odcięcie starych zobowiązań",
    sentimentBefore: -0.95,
    sentimentAfter: -0.58,
    crisisDropPercent: 39,
  },
];

export const DIVIDEND_PROJECTIONS_DATA: DividendBudgetProjection[] = [
  {
    entityId: "e-orlen",
    entityName: "ORLEN S.A.",
    declaredOrEstimatedDividendMln: 4850,
    stateSharePercent: 49.9,
    projectedBudgetRevenueMln: 2420,
    status: "rekomendacja_wyplaty",
    capexFocusArea: "Odnawialne źródła energii i morskie farmy wiatrowe Baltic Power",
  },
  {
    entityId: "e-pko",
    entityName: "PKO Bank Polski S.A.",
    declaredOrEstimatedDividendMln: 3200,
    stateSharePercent: 29.43,
    projectedBudgetRevenueMln: 941,
    status: "rekomendacja_wyplaty",
    capexFocusArea: "Bezpieczeństwo IT, cyfryzacja i finansowanie polskich eksporterów",
  },
  {
    entityId: "e-pzu",
    entityName: "Powszechny Zakład Ubezpieczeń S.A.",
    declaredOrEstimatedDividendMln: 3800,
    stateSharePercent: 34.19,
    projectedBudgetRevenueMln: 1299,
    status: "rekomendacja_wyplaty",
    capexFocusArea: "Inwestycje w obligacje infrastrukturalne i fundusze transformacji",
  },
  {
    entityId: "e-kghm",
    entityName: "KGHM Polska Miedź S.A.",
    declaredOrEstimatedDividendMln: 1200,
    stateSharePercent: 31.79,
    projectedBudgetRevenueMln: 381,
    status: "rekomendacja_wyplaty",
    capexFocusArea: "Głęboki Głogów, odwadnianie i bezpieczeństwo złoża miedziowego",
  },
  {
    entityId: "e-pge",
    entityName: "PGE Polska Grupa Energetyczna S.A.",
    declaredOrEstimatedDividendMln: 0,
    stateSharePercent: 60.86,
    projectedBudgetRevenueMln: 0,
    status: "zatrzymanie_zysku_capex",
    capexFocusArea: "Wielomiliardowy program transformacji sieci dystrybucyjnych i magazynów energii",
  },
  {
    entityId: "e-tauron",
    entityName: "TAURON Polska Energia S.A.",
    declaredOrEstimatedDividendMln: 0,
    stateSharePercent: 30.06,
    projectedBudgetRevenueMln: 0,
    status: "zatrzymanie_zysku_capex",
    capexFocusArea: "Modernizacja linii przesyłowych na Śląsku i Małopolsce",
  },
  {
    entityId: "e-pgz",
    entityName: "Polska Grupa Zbrojeniowa S.A.",
    declaredOrEstimatedDividendMln: 0,
    stateSharePercent: 100,
    projectedBudgetRevenueMln: 0,
    status: "zatrzymanie_zysku_capex",
    capexFocusArea: "Rozbudowa fabryk amunicji 155 mm i zdolności pancerne dla Wojska Polskiego",
  },
  {
    entityId: "e-azoty",
    entityName: "Grupa Azoty S.A.",
    declaredOrEstimatedDividendMln: 0,
    stateSharePercent: 33.0,
    projectedBudgetRevenueMln: 0,
    status: "brak_zysku",
    capexFocusArea: "Spłata odsetek od zadłużenia i utrzymanie instalacji chemicznych",
  },
];

export const STRATEGIC_CAPEX_PROJECTS: StrategicCapexProject[] = [
  {
    id: "cpx-1",
    name: "Kompleks Olefiny III",
    entityName: "ORLEN S.A.",
    totalBudgetMln: 25000,
    spentSoFarMln: 14200,
    delayMonths: 14,
    impairmentRiskMln: 9500,
    status: "krytyczne_ryzyko_odpisu",
    strategicSignificance: "Segment petrochemiczny; audyt opłacalności wykaże konieczność głębokiego odpisu bilansowego lub rewizji skali.",
  },
  {
    id: "cpx-2",
    name: "Polimery Police (Propylen / Polipropylen)",
    entityName: "Grupa Azoty S.A.",
    totalBudgetMln: 7200,
    spentSoFarMln: 7100,
    delayMonths: 18,
    impairmentRiskMln: 3200,
    status: "krytyczne_ryzyko_odpisu",
    strategicSignificance: "Projekt zrealizowany w formule dłużnej, generujący koszty odsetkowe paraliżujące całą Grupę Azoty.",
  },
  {
    id: "cpx-3",
    name: "Morska Farma Wiatrowa Baltic Power",
    entityName: "ORLEN S.A. / Northland Power",
    totalBudgetMln: 19000,
    spentSoFarMln: 6800,
    delayMonths: 0,
    impairmentRiskMln: 0,
    status: "w_harmonogramie",
    strategicSignificance: "Pierwsza polska farma offshore o mocy 1.2 GW; klucz do bezpieczeństwa bilansowego KSE w 2026 r.",
  },
  {
    id: "cpx-4",
    name: "Bloki Gazowo-Parowe w Rybniku i Dolnej Odrze",
    entityName: "PGE Polska Grupa Energetyczna S.A.",
    totalBudgetMln: 8400,
    spentSoFarMln: 3900,
    delayMonths: 4,
    impairmentRiskMln: 450,
    status: "zagrozenie_opoznieniem",
    strategicSignificance: "Zastąpienie wycofywanych bloków węglowych stabilnymi mocami gazowymi w szczycie.",
  },
  {
    id: "cpx-5",
    name: "Rozbudowa Zdolności Amunicyjnych 155 mm (Mesko / Dezamet)",
    entityName: "Polska Grupa Zbrojeniowa S.A.",
    totalBudgetMln: 3000,
    spentSoFarMln: 1100,
    delayMonths: 2,
    impairmentRiskMln: 0,
    status: "w_harmonogramie",
    strategicSignificance: "Cel suwerenności obronnej: zwielokrotnienie rocznej produkcji pocisków artyleryjskich dla NATO i WP.",
  },
];

export const INTER_MINISTERIAL_TRANSFERS: InterMinisterialTransferRecord[] = [
  {
    id: "tr-1",
    entityName: "Polska Grupa Górnicza S.A.",
    currentAuthority: "Minister Aktywów Państwowych",
    targetAuthority: "Minister Przemysłu",
    transferStage: "projekt_rozporzadzenia",
    legislationRef: "Dz.U. 2024 poz. 1229 (Ustawa o działach adm. rządowej)",
    strategicReason: "Skupienie całego segmentu wydobywczego w nowo utworzonym resorcie na Śląsku.",
  },
  {
    id: "tr-2",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    currentAuthority: "Minister Aktywów Państwowych",
    targetAuthority: "Minister Przemysłu",
    transferStage: "projekt_rozporzadzenia",
    legislationRef: "Uchwała Rady Ministrów nr 44/2025",
    strategicReason: "Wydzielenie węgla koksowego jako surowca krytycznego UE pod dedykowany nadzór.",
  },
  {
    id: "tr-3",
    entityName: "Polskie Linie Lotnicze LOT S.A.",
    currentAuthority: "Minister Aktywów Państwowych",
    targetAuthority: "Minister Infrastruktury",
    transferStage: "analiza_prawna",
    legislationRef: "Wniosek Pełnomocnika ds. CPK",
    strategicReason: "Integracja narodowego przewoźnika z hubem lotniczym i kolejowym w ramach komponentu CPK.",
  },
  {
    id: "tr-4",
    entityName: "Wojskowe Zakłady Łączności Nr 1 S.A.",
    currentAuthority: "Minister Aktywów Państwowych (nadzór pośredni)",
    targetAuthority: "Minister Obrony Narodowej",
    transferStage: "analiza_prawna",
    legislationRef: "Pismo MON z dn. 12.09.2025",
    strategicReason: "Bezpośrednie podporządkowanie zakładów radiolokacji i łączności polowej Sztabowi Generalnemu.",
  },
];

export const NIK_INSPECTION_RECOMMENDATIONS: NikInspectionRecommendation[] = [
  {
    id: "nik-2026-081",
    inspectionNumber: "KGP/410/012/2025",
    title: "Realizacja wydatków marketingowych i sponsoringowych w latach 2021-2023",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    issuedAt: "2026-02-14",
    deadline: "2026-10-31",
    status: "w_trakcie",
    recommendationSummary:
      "Wprowadzić bezwzględny obowiązek jawnego rejestru umów sponsoringowych powyżej 50 000 zł i wyeliminować finansowanie podmiotów powiązanych z osobami pełniącymi funkcje publiczne.",
    ministerDefensePoint:
      "Obecne kierownictwo MAP wydało 15 maja 2024 r. nową instrukcję sponsoringową, a 94% umów zakwestionowanych przez NIK pochodzi z lat 2021-2023.",
  },
  {
    id: "nik-2026-044",
    inspectionNumber: "KIF/201/008/2025",
    title: "Gospodarka taborem i zawieranie umów leasingu lokomotyw wielosystemowych",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    issuedAt: "2026-01-20",
    deadline: "2026-08-31",
    status: "przeterminowane",
    recommendationSummary:
      "Przeprowadzić audyt niekorzystnych umów dzierżawy taboru spalinowego i złożyć zawiadomienia o podejrzeniu wyrządzenia szkody majątkowej w wielkich rozmiarach.",
    ministerDefensePoint:
      "Zarządca sanacyjny skierował 4 zawiadomienia do Prokuratury Okręgowej w Warszawie; przeterminowanie wynika z konieczności zabezpieczenia dokumentacji przez biegłych sądowych.",
  },
  {
    id: "nik-2026-092",
    inspectionNumber: "KGO/330/003/2026",
    title: "Zapewnienie ciągłości świadczenia powszechnych usług pocztowych",
    entityName: "Poczta Polska S.A.",
    issuedAt: "2026-04-10",
    deadline: "2026-12-15",
    status: "w_trakcie",
    recommendationSummary:
      "Zapewnić terminowość doręczeń przesyłek rejestrowanych i zmodernizować zaplecze logistyczne sortowni regionalnych.",
    ministerDefensePoint:
      "MAP wspólnie z zarządem Poczty wdrożyło nowy plan sieciowy zatwierdzony przez UKE, gwarantujący spełnienie wskaźników terminowości w IV kwartale 2026 r.",
  },
  {
    id: "nik-2026-110",
    inspectionNumber: "KPB/102/019/2025",
    title: "Nadzór właścicielski nad spółkami w likwidacji posiadającymi mienie znacznej wartości",
    entityName: "Krajowy Zasób Nieruchomości / Podmioty Likwidowane",
    issuedAt: "2025-11-05",
    deadline: "2026-05-30",
    status: "wdrozone",
    recommendationSummary:
      "Sporządzić całościowy rejestr nieruchomości będących w dyspozycji likwidatorów spółek państwowych i zablokować niekontrolowane zbywanie gruntów bez zgody MAP.",
    ministerDefensePoint:
      "Departament Nadzoru III stworzył centralny elektroniczny rejestr majątku likwidacyjnego, wstrzymując 12 nieautoryzowanych przetargów.",
  },
];

import { ALL_ENTITIES_REGISTRY as RAW_ENTITIES_REGISTRY, EXECUTIVE_ANALYTICS } from "./all-ssp-registry.ts";
export type { ExecutiveAnalyticsSummary } from "./all-ssp-registry.ts";
export { EXECUTIVE_ANALYTICS };

// Wzbogacony rejestr 406 spółek z obsługą grup kapitałowych, postępowań uśpionych oraz dossier gabinetowego
export const ALL_ENTITIES_REGISTRY: EntityRecord[] = RAW_ENTITIES_REGISTRY.map((entity) => {
  const isTroubled = ["liquidation", "bankruptcy", "suspended"].includes(entity.status);

  let updated = { ...entity };

  const isOrlen = entity.id === "ssp-277" || entity.id === "e-orlen" || entity.name.toLowerCase().startsWith("orlen s.a");
  const isAzoty = entity.id === "ssp-275" || entity.id === "e-azoty" || entity.name.toLowerCase().startsWith("grupa azoty s.a");
  const isTotalizator = entity.id === "ssp-210" || entity.id === "e-totalizator" || entity.name.toLowerCase().includes("totalizator sportowy");
  const isPoczta = entity.id === "ssp-238" || entity.id === "e-poczta" || entity.name.toLowerCase().includes("poczta polska");
  const isPkp = entity.id === "ssp-323" || entity.name.toLowerCase().startsWith("polskie koleje państwowe s.a");
  const isPge = entity.id === "ssp-260" || entity.id === "e-pge" || entity.name.toLowerCase().includes("polska grupa energetyczna");
  const isKghm = entity.id === "ssp-276" || entity.id === "e-kghm" || entity.name.toLowerCase().includes("kghm");
  const isPgz = entity.id === "ssp-266" || entity.id === "e-pgz" || entity.name.toLowerCase().includes("polska grupa zbrojeniowa");

  if (isOrlen) updated.id = "e-orlen";
  else if (isAzoty) updated.id = "e-azoty";
  else if (isTotalizator) updated.id = "e-totalizator";
  else if (isPoczta) updated.id = "e-poczta";
  else if (isPge) updated.id = "e-pge";
  else if (isKghm) updated.id = "e-kghm";
  else if (isPgz) updated.id = "e-pgz";

  // 1. Oznaczenie postępowań uśpionych z majątkiem nieruchomym
  if (isTroubled) {
    updated.is_dormant_liquidation = true;
    updated.dormant_years = 3 + (entity.id.length % 5);
    updated.has_real_estate = true;
  }

  // 2. Struktura grup kapitałowych (Matka-Córka-Wnuczka)
  if (isOrlen) {
    updated.subsidiary_count = 38;
    updated.subsidiaries = [
      "Energa S.A.",
      "Anwil S.A.",
      "ORLEN Upstream Sp. z o.o.",
      "ORLEN Paliwa Sp. z o.o.",
      "ORLEN Neptun Sp. z o.o.",
      "ORLEN Synthos Green Energy",
    ];
  } else if (isAzoty) {
    updated.subsidiary_count = 14;
    updated.subsidiaries = [
      "Grupa Azoty Zakłady Azotowe Puławy S.A.",
      "Grupa Azoty Zakłady Chemiczne Police S.A.",
      "Grupa Azoty ZAK S.A.",
      "Grupa Azoty Polyolefins S.A.",
    ];
  } else if (isPkp) {
    updated.subsidiary_count = 12;
    updated.subsidiaries = [
      "PKP CARGO S.A. w restrukturyzacji",
      "PKP Intercity S.A.",
      "PKP Polskie Linie Kolejowe S.A.",
      "PKP CARGOTOR Sp. z o.o.",
      "PKP Szybka Kolej Miejska w Trójmieście Sp. z o.o.",
    ];
  } else if (isPge) {
    updated.subsidiary_count = 22;
    updated.subsidiaries = [
      "PGE Dystrybucja S.A.",
      "PGE Obrót S.A.",
      "PGE Górnictwo i Energetyka Konwencjonalna S.A.",
      "PGE Baltica Sp. z o.o.",
    ];
  } else if (isKghm) {
    updated.subsidiary_count = 18;
    updated.subsidiaries = [
      "KGHM ZANAM S.A.",
      "PeBeKa S.A.",
      "KGHM Metraco S.A.",
      "Energetyka Sp. z o.o.",
    ];
  } else if (isPgz) {
    updated.subsidiary_count = 46;
    updated.subsidiaries = [
      "Huta Stalowa Wola S.A.",
      "Mesko S.A.",
      "Zakłady Metalowe DEZAMET S.A.",
      "Bumar-Łabędy S.A.",
      "Wojskowe Zakłady Lotnicze Nr 1 S.A.",
    ];
  } else if (isTotalizator) {
    updated.subsidiary_count = 3;
    updated.subsidiaries = [
      "Totalizator Sportowy Nieruchomości Sp. z o.o.",
      "Tor Wyścigów Konnych Służewiec Sp. z o.o.",
    ];
  } else if (isPoczta) {
    updated.subsidiary_count = 5;
    updated.subsidiaries = [
      "Pocztex Sp. z o.o.",
      "Pocztowe Usługi Finansowe Sp. z o.o.",
      "Bank Pocztowy S.A. (udział)",
    ];
  }

  // 3. Fiszka Ministra (Briefing 10s) oraz Strategiczne Spory Prawne w Dossier
  if (entity.dossier) {
    const d = { ...entity.dossier };

    if (isTotalizator) {
      d.ministerBriefing = {
        threeNumbers: [
          { label: "Udział Skarbu Państwa", value: "100%" },
          { label: "Wpłaty na Fundusz Sportu", value: "1,2 mld zł" },
          { label: "Otwarte konkursy", value: "17 oddziałów" },
        ],
        statusSummary: "Audyt procedur rekrutacyjnych w toku. Odrzucono defensywną narrację o 'nieuleganiu presji mediów'.",
        defensiveTalkingPoint:
          "Transparentność to nienegocjowalna norma. Każde stanowisko dyrektorskie w regionach zostanie objęte jawnym konkursem.",
        keyRiskThisWeek: "Kontrole poselskie w oddziałach regionalnych i pytania o nominacje z rekomendacji politycznych.",
      };
      d.strategicLitigations = [
        {
          id: "lit-1",
          court: "Sąd Okręgowy w Warszawie",
          opponent: "Związek Zawodowy Pracowników Totalizatora",
          valueMlnPln: 24.5,
          caseSubject: "Spór o interpretację zakładowego układu zbiorowego pracy i premie kwartalne",
          status: "w_toku",
          contingencyRisk: "umiarkowane",
        },
      ];
    } else if (isPoczta) {
      d.ministerBriefing = {
        threeNumbers: [
          { label: "Strata za 2023 r.", value: "780 mln zł" },
          { label: "Placówki gminne", value: "4 600 (100% zachowane)" },
          { label: "Dotacja unijna", value: "700 mln zł" },
        ],
        statusSummary: "Negocjacje Programu Dobrowolnych Odejść. Ani jedna placówka na wsi nie zostanie zamknięta.",
        defensiveTalkingPoint:
          "Zapewniamy ciągłość doręczeń i przekształcamy placówki w Centra Obsługi Obywatela. Wypłata unijnej rekompensaty ustabilizuje płynność.",
        keyRiskThisWeek: "Napięcia płacowe i żądanie 800 zł podwyżki w przededniu szczytu paczkowego.",
      };
      d.strategicLitigations = [
        {
          id: "lit-3",
          court: "Sąd Apelacyjny w Warszawie",
          opponent: "Operatorzy Prywatni (Doręczenia Sądowe)",
          valueMlnPln: 110.0,
          caseSubject: "Roszczenie o odszkodowanie z tytułu monopolu na przesyłki urzędowe",
          status: "apelacja",
          contingencyRisk: "niskie",
        },
      ];
    } else if (isAzoty) {
      d.ministerBriefing = {
        threeNumbers: [
          { label: "Dług netto", value: "10,1 mld zł" },
          { label: "Koszt Polimerów Police", value: "7,2 mld zł" },
          { label: "Wniosek o cło", value: "30% na mocznik" },
        ],
        statusSummary: "Audyt techniczno-finansowy instalacji Police. Skoordynowany wniosek z MRiT do Brukseli ws. ceł zaporowych.",
        defensiveTalkingPoint:
          "Ratujemy chemię z 10 miliardów długu zostawionego przez poprzedników i walczymy w Brukseli z nieuczciwym importem ze Wschodu.",
        keyRiskThisWeek: "Negocjacje waivers z konsorcjum 13 banków finansujących.",
      };
      d.strategicLitigations = [
        {
          id: "lit-4",
          court: "Międzynarodowy Trybunał Arbitrażowy w Londynie (LCIA)",
          opponent: "Główny Wykonawca EPC Polimerów Police (Hyundai Engineering)",
          valueMlnPln: 980.0,
          caseSubject: "Wzajemne roszczenia z tytułu opóźnień budowy i naliczenia kar umownych",
          status: "w_toku",
          contingencyRisk: "wysokie",
        },
      ];
    } else if (isOrlen) {
      d.ministerBriefing = {
        threeNumbers: [
          { label: "Dywidenda dla budżetu", value: "2,42 mld zł" },
          { label: "Nakłady na Baltic Power", value: "19 mld zł" },
          { label: "Audyt Olefin III", value: "25 mld zł" },
        ],
        statusSummary: "Realizacja farm wiatrowych offshore w harmonogramie. Restrykcyjny reżim raportowania MAR.",
        defensiveTalkingPoint:
          "Urealniamy harmonogramy megaprojektów i odcinamy inwestycje nierentowne. Stabilna dywidenda zasila budżet państwa.",
        keyRiskThisWeek: "Spekulacje wokół skali odpisów kapitałowych przed raportem kwartalnym.",
      };
      d.strategicLitigations = [
        {
          id: "lit-5",
          court: "Sąd Okręgowy w Łodzi",
          opponent: "Akcjonariusze mniejszościowi Grupy LOTOS",
          valueMlnPln: 450.0,
          caseSubject: "Pozew o uchylenie uchwały połączeniowej i wycenę parytetu wymiany akcji",
          status: "w_toku",
          contingencyRisk: "umiarkowane",
        },
      ];
    } else {
      // Domyślny uniwersalny briefing dla każdego innego podmiotu
      d.ministerBriefing = {
        threeNumbers: [
          { label: "Udział Skarbu Państwa", value: `${entity.state_share_percent}%` },
          { label: "Organ Właścicielski", value: entity.ownership_body.length > 25 ? `${entity.ownership_body.substring(0, 22)}...` : entity.ownership_body },
          { label: "Status podmiotu", value: entity.status.toUpperCase() },
        ],
        statusSummary: `Podmiot z sektora ${entity.sector}, nadzorowany zgodnie z wytycznymi ustawy o zarządzaniu mieniem państwowym.`,
        defensiveTalkingPoint: `Nadzór właścicielski sprawowany jest zgodnie z przepisami prawa i kryteriami efektywności gospodarczej.`,
        keyRiskThisWeek: isTroubled ? "Postępowanie likwidacyjne/upadłościowe - zabezpieczenie majątku państwowego." : "Standardowy cykl sprawozdawczy.",
      };
    }

    updated.dossier = d;
  }

  return updated;
});

// ==========================================
// DANE DLA ZAAWANSOWANYCH WIZUALIZACJI MAPSCOPE
// ==========================================

export const VOIVODESHIP_REGIONAL_DATA: VoivodeshipRegionalData[] = [
  {
    id: "mazowieckie",
    name: "Mazowieckie",
    pathData: "M320,180 L380,185 L420,230 L400,310 L350,330 L300,300 L280,240 Z",
    center: [350, 255],
    entitiesCount: 142,
    workforceCount: 185000,
    strikeAlertsCount: 2,
    liquidationSitesCount: 14,
    riskStatus: "krytyczny",
    keyFlagships: ["Orlen S.A. (Płock)", "Poczta Polska (Warszawa)", "PKP S.A. (Warszawa)", "PZU S.A.", "PKO BP"],
    primaryRegionalIssue: "Protesty pocztowców pod MAP i restrukturyzacja centrali PKP.",
  },
  {
    id: "slaskie",
    name: "Śląskie",
    pathData: "M260,370 L310,360 L330,420 L300,480 L250,470 L240,410 Z",
    center: [285, 420],
    entitiesCount: 58,
    workforceCount: 142000,
    strikeAlertsCount: 4,
    liquidationSitesCount: 18,
    riskStatus: "krytyczny",
    keyFlagships: ["Jastrzębska Spółka Węglowa", "Polska Grupa Górnicza", "Huta Łabędy", "Tauron Polska Energia"],
    primaryRegionalIssue: "Pogotowie strajkowe w JSW, spory płacowe i restrukturyzacja kopalń węgla koksowego.",
  },
  {
    id: "dolnoslaskie",
    name: "Dolnośląskie",
    pathData: "M130,320 L210,310 L230,360 L200,430 L140,420 L110,360 Z",
    center: [170, 370],
    entitiesCount: 36,
    workforceCount: 68000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 9,
    riskStatus: "podwyższone_ryzyko",
    keyFlagships: ["KGHM Polska Miedź (Lubin)", "KGHM Zanam", "Wałbrzyskie Zakłady Koksownicze"],
    primaryRegionalIssue: "Negocjacje układu zbiorowego pracy w KGHM i wskaźniki podatku miedziowego.",
  },
  {
    id: "wielkopolskie",
    name: "Wielkopolskie",
    pathData: "M160,210 L240,200 L270,270 L240,320 L160,310 L140,250 Z",
    center: [205, 260],
    entitiesCount: 28,
    workforceCount: 42000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 6,
    riskStatus: "stabilny",
    keyFlagships: ["Enea S.A. (Poznań)", "H. Cegielski - Poznań S.A."],
    primaryRegionalIssue: "Modernizacja bloków w Elektrowni Kozienice oraz portfel zamówień w zbrojeniówce.",
  },
  {
    id: "malopolskie",
    name: "Małopolskie",
    pathData: "M320,410 L390,390 L420,440 L380,480 L320,470 Z",
    center: [370, 440],
    entitiesCount: 26,
    workforceCount: 39000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 7,
    riskStatus: "podwyższone_ryzyko",
    keyFlagships: ["Grupa Azoty S.A. (Tarnów)", "Tauron Dystrybucja (Kraków)"],
    primaryRegionalIssue: "Utrata płynności przez Grupę Azoty z powodu presji tanich nawozów spoza UE.",
  },
  {
    id: "pomorskie",
    name: "Pomorskie",
    pathData: "M200,80 L290,70 L320,130 L270,180 L190,160 Z",
    center: [255, 125],
    entitiesCount: 24,
    workforceCount: 36000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 5,
    riskStatus: "podwyższone_ryzyko",
    keyFlagships: ["Energa S.A. (Gdańsk)", "Zarząd Morskiego Portu Gdańsk", "Stocznia Gdynia (likwidacja)"],
    primaryRegionalIssue: "Audyt rozliczeń fuzji Lotosu z Saudi Aramco oraz przetargi na terminale offshore.",
  },
  {
    id: "lubelskie",
    name: "Lubelskie",
    pathData: "M400,280 L460,260 L480,350 L430,390 L390,360 Z",
    center: [440, 325],
    entitiesCount: 19,
    workforceCount: 28000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 4,
    riskStatus: "podwyższone_ryzyko",
    keyFlagships: ["Grupa Azoty Zakłady Azotowe Puławy", "Lubelski Węgiel Bogdanka S.A."],
    primaryRegionalIssue: "Plany wydzielenia aktywów węglowych z Bogdanki i sytuacja na rynku nawozowym.",
  },
  {
    id: "podkarpackie",
    name: "Podkarpackie",
    pathData: "M390,420 L450,400 L470,480 L410,500 L380,470 Z",
    center: [430, 455],
    entitiesCount: 18,
    workforceCount: 31000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 3,
    riskStatus: "stabilny",
    keyFlagships: ["Huta Stalowa Wola S.A.", "PZL Mielec", "Autosan (Sanok)"],
    primaryRegionalIssue: "Skalowanie produkcji armatohaubic Krab i dostawy podwozi dla Sił Zbrojnych RP.",
  },
  {
    id: "zachodniopomorskie",
    name: "Zachodniopomorskie",
    pathData: "M80,100 L180,90 L190,180 L120,200 L70,160 Z",
    center: [135, 145],
    entitiesCount: 16,
    workforceCount: 22000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 8,
    riskStatus: "krytyczny",
    keyFlagships: ["Grupa Azoty Zakłady Chemiczne Police", "Zarząd Morskich Portów Szczecin i Świnoujście", "MSR Gryfia"],
    primaryRegionalIssue: "Projekt Polimery Police - opóźnienia gwarancyjne, spory z Hyundai i roszczenia banków.",
  },
  {
    id: "lodzkie",
    name: "Łódzkie",
    pathData: "M260,260 L320,250 L340,320 L280,350 L240,310 Z",
    center: [290, 300],
    entitiesCount: 14,
    workforceCount: 25000,
    strikeAlertsCount: 1,
    liquidationSitesCount: 4,
    riskStatus: "podwyższone_ryzyko",
    keyFlagships: ["PGE Górnictwo i Energetyka Konwencjonalna (Bełchatów)", "Wytwórnia Sprzętu Wojskowego"],
    primaryRegionalIssue: "Harmonogram transformacji kompleksu Bełchatów i alokacja środków z Funduszu Sprawiedliwej Transformacji.",
  },
  {
    id: "kujawsko-pomorskie",
    name: "Kujawsko-Pomorskie",
    pathData: "M210,160 L280,150 L290,220 L230,240 L190,200 Z",
    center: [245, 195],
    entitiesCount: 13,
    workforceCount: 17000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 3,
    riskStatus: "stabilny",
    keyFlagships: ["Zakłady Chemiczne Nitro-Chem (Bydgoszcz)", "Wojskowe Zakłady Lotnicze Nr 2"],
    primaryRegionalIssue: "Zabezpieczenie łańcucha dostaw trotylu dla amunicji artyleryjskiej kalibru 155 mm.",
  },
  {
    id: "opolskie",
    name: "Opolskie",
    pathData: "M220,360 L260,350 L270,410 L230,430 L200,390 Z",
    center: [235, 390],
    entitiesCount: 10,
    workforceCount: 14000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 2,
    riskStatus: "stabilny",
    keyFlagships: ["Grupa Azoty Zakłady Azotowe Kędzierzyn", "Elektrownia Opole (PGE)"],
    primaryRegionalIssue: "Efektywność bloków węglowych 5 i 6 oraz program oszczędnościowy w ZAK.",
  },
  {
    id: "swietokrzyskie",
    name: "Świętokrzyskie",
    pathData: "M320,330 L380,320 L390,380 L330,400 L300,360 Z",
    center: [345, 360],
    entitiesCount: 9,
    workforceCount: 16000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 2,
    riskStatus: "stabilny",
    keyFlagships: ["Mesko S.A. (Skarżysko-Kamienna)", "Polska Agencja Prasowa (oddział)"],
    primaryRegionalIssue: "Inwestycje w rozbudowę mocy produkcyjnych systemów Piorun i amunicji małokalibrowej.",
  },
  {
    id: "warminsko-mazurskie",
    name: "Warmińsko-Mazurskie",
    pathData: "M290,80 L380,80 L400,160 L320,170 L280,120 Z",
    center: [340, 125],
    entitiesCount: 8,
    workforceCount: 9000,
    strikeAlertsCount: 0,
    liquidationSitesCount: 2,
    riskStatus: "stabilny",
    keyFlagships: ["Polskie Radio Olsztyn", "Ośrodki wczasowe WAM (w likwidacji)"],
    primaryRegionalIssue: "Zagospodarowanie ośrodków powojskowych i nieruchomości Skarbu Państwa.",
  },
  {
    id: "podlaskie",
    name: "Podlaskie",
    pathData: "M380,120 L460,110 L480,220 L410,240 L370,170 Z",
    center: [430, 175],
    entitiesCount: 6,
    workforceCount: 7500,
    strikeAlertsCount: 0,
    liquidationSitesCount: 1,
    riskStatus: "stabilny",
    keyFlagships: ["Podlaskie Zakłady Zbożowe", "Oddziały PGE Dystrybucja"],
    primaryRegionalIssue: "Zabezpieczenie infrastruktury przesyłowej w pasie przygranicznym.",
  },
  {
    id: "lubuskie",
    name: "Lubuskie",
    pathData: "M90,210 L150,200 L160,290 L110,310 L70,250 Z",
    center: [120, 255],
    entitiesCount: 5,
    workforceCount: 6200,
    strikeAlertsCount: 0,
    liquidationSitesCount: 2,
    riskStatus: "stabilny",
    keyFlagships: ["Zakłady Metalowe Zastal (udział mniejszościowy)", "Radio Zachód"],
    primaryRegionalIssue: "Nadzór nad spółkami z mniejszościowym pakietem Skarbu Państwa.",
  },
];

export const RISK_MATRIX_SCATTER_POINTS: RiskMatrixScatterPoint[] = [
  {
    id: "scat-1",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    tickerOrAlias: "PKPCARGO",
    sector: "Transport i Logistyka",
    probability: 92,
    ministerImpact: 88,
    workforceOrAssetsWeight: 42,
    category: "spór_społeczny",
    summary: "Pogotowie strajkowe 14 związków, zwolnienia grupowe 4,1 tys. osób, zarzuty opozycji o likwidację narodowego przewoźnika.",
    quadrant: "czerwona_strefa_kprm",
  },
  {
    id: "scat-2",
    entityName: "Poczta Polska S.A.",
    tickerOrAlias: "POCZTA",
    sector: "Usługi Pocztowe i Finansowe",
    probability: 86,
    ministerImpact: 91,
    workforceOrAssetsWeight: 46,
    category: "kadry",
    summary: "Pikiety pod gmachem MAP, strata roczna ponad 600 mln PLN, żądanie dymisji zarządu przez 'Solidarność'.",
    quadrant: "czerwona_strefa_kprm",
  },
  {
    id: "scat-3",
    entityName: "Totalizator Sportowy Sp. z o.o.",
    tickerOrAlias: "TOTALIZATOR",
    sector: "Gry Losowe i Monopole",
    probability: 78,
    ministerImpact: 82,
    workforceOrAssetsWeight: 28,
    category: "kadry",
    summary: "Afera obsady dyrektorów oddziałów regionalnych bez otwartych konkursów, zawiadomienie do prokuratury.",
    quadrant: "czerwona_strefa_kprm",
  },
  {
    id: "scat-4",
    entityName: "ORLEN S.A.",
    tickerOrAlias: "PKN",
    sector: "Paliwa i Chemia",
    probability: 64,
    ministerImpact: 96,
    workforceOrAssetsWeight: 50,
    category: "finanse",
    summary: "Audyt fuzji z Lotosem, odpisy na aktywa w Szwajcarii (OTS), przesłuchania b. członków zarządu w prokuraturze.",
    quadrant: "czerwona_strefa_kprm",
  },
  {
    id: "scat-5",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    tickerOrAlias: "JSW",
    sector: "Górnictwo i Hutnictwo",
    probability: 81,
    ministerImpact: 74,
    workforceOrAssetsWeight: 36,
    category: "finanse",
    summary: "Spadek cen węgla koksowego na świecie, wyczerpanie funduszu stabilizacyjnego FIZ, presja płacowa załogi.",
    quadrant: "czerwona_strefa_kprm",
  },
  {
    id: "scat-6",
    entityName: "Grupa Azoty S.A.",
    tickerOrAlias: "ATT",
    sector: "Chemia Ciężka",
    probability: 72,
    ministerImpact: 68,
    workforceOrAssetsWeight: 34,
    category: "finanse",
    summary: "Ujemna EBITDA, projekt Polimery Police generujący straty, konieczność porozumienia z 13 bankami wierzycielami.",
    quadrant: "konflikt_operacyjny",
  },
  {
    id: "scat-7",
    entityName: "Polska Grupa Energetyczna S.A.",
    tickerOrAlias: "PGE",
    sector: "Energetyka Konwencjonalna i OZE",
    probability: 38,
    ministerImpact: 86,
    workforceOrAssetsWeight: 44,
    category: "awaria",
    summary: "Presja kosztów uprawnień CO2 (ETS), opóźnienia w powołaniu NABE i wydzieleniu kopalń węgla brunatnego.",
    quadrant: "ryzyko_wizerunkowe",
  },
  {
    id: "scat-8",
    entityName: "KGHM Polska Miedź S.A.",
    tickerOrAlias: "KGHM",
    sector: "Górnictwo Metali Nieżelaznych",
    probability: 32,
    ministerImpact: 80,
    workforceOrAssetsWeight: 40,
    category: "finanse",
    summary: "Wahania cen miedzi w Londynie, koszty aktywów zagranicznych Sierra Gorda, stabilne wypłaty dywidend.",
    quadrant: "ryzyko_wizerunkowe",
  },
  {
    id: "scat-9",
    entityName: "Powszechny Zakład Ubezpieczeń S.A.",
    tickerOrAlias: "PZU",
    sector: "Finanse i Ubezpieczenia",
    probability: 24,
    ministerImpact: 76,
    workforceOrAssetsWeight: 38,
    category: "regulacje",
    summary: "Zakończony audyt wewnętrzny umów doradczych i sponsoringowych z lat 2016-2023, wnioski do prokuratury.",
    quadrant: "ryzyko_wizerunkowe",
  },
  {
    id: "scat-10",
    entityName: "Huta Łabędy S.A. (Grupa Węglokoks)",
    tickerOrAlias: "ŁABĘDY",
    sector: "Hutnictwo i Przemysł Obronny",
    probability: 69,
    ministerImpact: 46,
    workforceOrAssetsWeight: 22,
    category: "spór_społeczny",
    summary: "Żądania podwyżek w związku ze wzrostem zamówień na obudowy górnicze i komponenty pancerne.",
    quadrant: "konflikt_operacyjny",
  },
  {
    id: "scat-11",
    entityName: "Enea S.A.",
    tickerOrAlias: "ENEA",
    sector: "Energetyka",
    probability: 44,
    ministerImpact: 58,
    workforceOrAssetsWeight: 30,
    category: "awaria",
    summary: "Konieczność odpisów na stary projekt bloku węglowego Ostrołęka C oraz roszczenia odszkodowawcze.",
    quadrant: "konflikt_operacyjny",
  },
  {
    id: "scat-12",
    entityName: "PKO Bank Polski S.A.",
    tickerOrAlias: "PKOBP",
    sector: "Bankowość",
    probability: 14,
    ministerImpact: 42,
    workforceOrAssetsWeight: 44,
    category: "finanse",
    summary: "Rekordowy zysk netto, brak zagrożeń płynnościowych, terminowe rozliczanie ugód frankowych.",
    quadrant: "stabilny_monitoring",
  },
  {
    id: "scat-13",
    entityName: "Bank Gospodarstwa Krajowego",
    tickerOrAlias: "BGK",
    sector: "Bankowość Rozwojowa",
    probability: 11,
    ministerImpact: 35,
    workforceOrAssetsWeight: 36,
    category: "finanse",
    summary: "Stabilna obsługa funduszy rządowych, zrównoważony portfel obligacji infrastrukturalnych.",
    quadrant: "stabilny_monitoring",
  },
  {
    id: "scat-14",
    entityName: "Mesko S.A. (Grupa PGZ)",
    tickerOrAlias: "MESKO",
    sector: "Przemysł Obronny",
    probability: 29,
    ministerImpact: 52,
    workforceOrAssetsWeight: 26,
    category: "kadry",
    summary: "Realizacja kontraktów zbrojeniowych dla Sił Zbrojnych RP, stabilizacja po zmianach w zarządzie.",
    quadrant: "stabilny_monitoring",
  },
];

export const SANKEY_FLOW_DATA: { nodes: SankeyFlowNode[]; links: SankeyFlowLink[] } = {
  nodes: [
    // Kolumna 0: Zysk skumulowany
    { id: "total_profit", name: "Zagregowany Zysk Netto SSP", column: 0, value: 18.40, color: "#2563eb", subtext: "406 spółek portfela MAP" },
    // Kolumna 1: Alokacja zarządcza
    { id: "capex", name: "Inwestycje Strategiczne (CAPEX)", column: 1, value: 7.80, color: "#0284c7", subtext: "42,4% zysku na rozwój sieci i OZE" },
    { id: "reserves", name: "Rezerwy Finansowe i Kapitał Zapasowy", column: 1, value: 5.34, color: "#64748b", subtext: "29,0% na bufor płynnościowy" },
    { id: "dividend_gross", name: "Zadeklarowane Dywidendy Brutto", column: 1, value: 5.26, color: "#16a34a", subtext: "28,6% zysku podlegające podziałowi" },
    // Kolumna 2: Beneficjenci końcowi
    { id: "state_budget", name: "Wpływ do Budżetu Państwa (MF)", column: 2, value: 4.12, color: "#15803d", subtext: "78,3% puli dywidendowej Skarbu Państwa" },
    { id: "map_fund", name: "Fundusz Inwestycji Kapitałowych MAP", column: 2, value: 0.84, color: "#0d9488", subtext: "Środki celowe na dokapitalizowanie SSP" },
    { id: "minority", name: "Akcjonariusze Mniejszościowi (GPW / OFE)", column: 2, value: 0.30, color: "#d97706", subtext: "Udziałowcy rynkowi na parkiecie w Warszawie" },
  ],
  links: [
    { source: "total_profit", target: "capex", value: 7.80, label: "CAPEX 7,80 mld PLN", color: "rgba(2, 132, 199, 0.45)" },
    { source: "total_profit", target: "reserves", value: 5.34, label: "Rezerwy 5,34 mld PLN", color: "rgba(100, 116, 139, 0.45)" },
    { source: "total_profit", target: "dividend_gross", value: 5.26, label: "Dywidendy 5,26 mld PLN", color: "rgba(22, 163, 74, 0.45)" },
    { source: "dividend_gross", target: "state_budget", value: 4.12, label: "Dochody budżetowe 4,12 mld PLN", color: "rgba(21, 128, 61, 0.55)" },
    { source: "dividend_gross", target: "map_fund", value: 0.84, label: "Fundusz MAP 0,84 mld PLN", color: "rgba(13, 148, 136, 0.55)" },
    { source: "dividend_gross", target: "minority", value: 0.30, label: "Giełda GPW 0,30 mld PLN", color: "rgba(217, 119, 6, 0.55)" },
  ],
};

export const RADAR_SPIDER_PROFILES: Record<string, RadarSpiderMetrics> = {
  "e-pkp-cargo": {
    entityId: "e-pkp-cargo",
    governanceScore: 68,
    communicationScore: 32,
    financeScore: 24,
    capexScore: 35,
    socialScore: 18,
    auditScore: 42,
    aggregateMaturity: 36.5,
    status: "alarmowa",
  },
  "e-poczta": {
    entityId: "e-poczta",
    governanceScore: 55,
    communicationScore: 38,
    financeScore: 20,
    capexScore: 28,
    socialScore: 22,
    auditScore: 50,
    aggregateMaturity: 35.5,
    status: "alarmowa",
  },
  "e-totalizator": {
    entityId: "e-totalizator",
    governanceScore: 35,
    communicationScore: 41,
    financeScore: 88,
    capexScore: 70,
    socialScore: 65,
    auditScore: 30,
    aggregateMaturity: 54.8,
    status: "wymaga_nadzoru",
  },
  "e-orlen": {
    entityId: "e-orlen",
    governanceScore: 82,
    communicationScore: 78,
    financeScore: 92,
    capexScore: 84,
    socialScore: 74,
    auditScore: 76,
    aggregateMaturity: 81.0,
    status: "bezpieczna",
  },
  "e-kghm": {
    entityId: "e-kghm",
    governanceScore: 88,
    communicationScore: 85,
    financeScore: 86,
    capexScore: 78,
    socialScore: 70,
    auditScore: 84,
    aggregateMaturity: 81.8,
    status: "bezpieczna",
  },
  "e-pge": {
    entityId: "e-pge",
    governanceScore: 79,
    communicationScore: 72,
    financeScore: 68,
    capexScore: 62,
    socialScore: 60,
    auditScore: 75,
    aggregateMaturity: 69.3,
    status: "bezpieczna",
  },
  "e-jsw": {
    entityId: "e-jsw",
    governanceScore: 62,
    communicationScore: 45,
    financeScore: 38,
    capexScore: 48,
    socialScore: 26,
    auditScore: 54,
    aggregateMaturity: 45.5,
    status: "wymaga_nadzoru",
  },
};

export const GOVERNANCE_NETWORK_DATA: { nodes: GovernanceNetworkNode[]; edges: GovernanceNetworkEdge[] } = {
  nodes: [
    { id: "pers-1", label: "dr hab. Marek Zieliński", type: "person", role: "Przewodniczący RN", entityCount: 1, art19ViolationRisk: false },
    { id: "pers-2", label: "mec. Agnieszka Kowalczyk", type: "person", role: "Członek RN z ramienia MAP", entityCount: 2, art19ViolationRisk: true },
    { id: "pers-3", label: "dr inż. Paweł Wójcik", type: "person", role: "Wiceprzewodniczący RN", entityCount: 1, art19ViolationRisk: false },
    { id: "pers-4", label: "mgr Tomasz Wiśniewski", type: "person", role: "Przedstawiciel załogi w RN", entityCount: 1, art19ViolationRisk: false },
    { id: "pers-5", label: "dr Katarzyna Lewandowska", type: "person", role: "Członek komitetu audytu", entityCount: 1, art19ViolationRisk: false },
    { id: "comp-orlen", label: "ORLEN S.A.", type: "company" },
    { id: "comp-energa", label: "Energa S.A. (spółka zależna)", type: "company" },
    { id: "comp-pkp-cargo", label: "PKP CARGO S.A.", type: "company" },
    { id: "comp-poczta", label: "Poczta Polska S.A.", type: "company" },
    { id: "comp-pgz", label: "Polska Grupa Zbrojeniowa S.A.", type: "company" },
  ],
  edges: [
    { source: "pers-1", target: "comp-orlen", role: "Przewodniczący Rady Nadzorczej", delegatingBody: "Ministerstwo Aktywów Państwowych", sinceDate: "2024-02-15" },
    { source: "pers-2", target: "comp-orlen", role: "Członek Rady Nadzorczej", delegatingBody: "Ministerstwo Aktywów Państwowych", sinceDate: "2024-03-01" },
    { source: "pers-2", target: "comp-pgz", role: "Członek Rady Nadzorczej", delegatingBody: "Ministerstwo Aktywów Państwowych", sinceDate: "2024-06-10", isHoldingTie: false },
    { source: "pers-3", target: "comp-pkp-cargo", role: "Wiceprzewodniczący RN", delegatingBody: "PKP S.A. (spółka matka)", sinceDate: "2024-04-20", isHoldingTie: true },
    { source: "pers-4", target: "comp-poczta", role: "Członek RN - wybór pracowników", delegatingBody: "Związki Zawodowe Poczty", sinceDate: "2023-11-12" },
    { source: "pers-5", target: "comp-energa", role: "Członek RN / Audyt", delegatingBody: "ORLEN S.A. (podmiot dominujący)", sinceDate: "2024-05-02", isHoldingTie: true },
  ],
};

export const REPUTATION_WATERFALL_STEPS: ReputationWaterfallStep[] = [
  { id: "w-1", label: "Poziom bazowy reputacji MAP", category: "baseline", delta: 64, cumulative: 64, description: "Wskaźnik wyjściowy z początku kwartału po wdrożeniu audytów otwarcia.", date: "2026-07-01" },
  { id: "w-2", label: "PKP Cargo: spór taborowy i pikiety", category: "negative_event", delta: -16, cumulative: 48, description: "Eskalacja protestów kolejarskich i debata w Sejmie na temat zwolnień grupowych.", date: "2026-07-28" },
  { id: "w-3", label: "Totalizator: spór o konkursy dyrektorskie", category: "negative_event", delta: -11, cumulative: 37, description: "Artykuły śledcze w mediach ogólnopolskich o obsadzie stanowisk w oddziałach regionalnych.", date: "2026-08-14" },
  { id: "w-4", label: "Grupa Azoty: strata na Polimerach Police", category: "negative_event", delta: -8, cumulative: 29, description: "Ujawnienie konieczności renegocjacji pakietu dłużnego z konsorcjum 13 banków.", date: "2026-08-29" },
  { id: "w-5", label: "Interwencja MAP w Totalizatorze (odwołanie prezesa)", category: "positive_intervention", delta: +14, cumulative: 43, description: "Błyskawiczna dymisja, zarządzenie audytu wewnętrznego i rozpisanie transparentnych postępowań.", date: "2026-09-05" },
  { id: "w-6", label: "PKO BP & PZU: rekordowa wypłata dywidend", category: "positive_intervention", delta: +15, cumulative: 58, description: "Wpływ ponad 4,1 mld PLN dywidendy do kasy państwa, entuzjastyczne komentarze analityków GPW.", date: "2026-09-22" },
  { id: "w-7", label: "Plan sanacji PKP Cargo z gwarancją taboru", category: "positive_intervention", delta: +10, cumulative: 68, description: "Podpisanie listu intencyjnego z PESA i PKP Intercity na zatrudnienie części zwalnianej kadry.", date: "2026-10-12" },
  { id: "w-8", label: "Bieżący bilans sentymentu netto", category: "net_total", delta: 0, cumulative: 68, description: "Wzrost netto o +4 punkty w skali kwartału pomimo trzech poważnych kryzysów wizerunkowych.", date: "2026-10-20" },
];

export function generateCalendarHeatmapData(): CalendarHeatmapDay[] {
  const days: CalendarHeatmapDay[] = [];
  const baseDate = new Date("2026-01-01T00:00:00Z");

  // Kluczowe daty posiedzeń Sejmu w 2026 roku
  const parliamentDates = new Set([
    "2026-01-14", "2026-01-15", "2026-01-16",
    "2026-02-04", "2026-02-05", "2026-02-06",
    "2026-03-04", "2026-03-05", "2026-03-18", "2026-03-19",
    "2026-04-15", "2026-04-16", "2026-04-22", "2026-04-23",
    "2026-05-13", "2026-05-14", "2026-05-27", "2026-05-28",
    "2026-06-10", "2026-06-11", "2026-06-24", "2026-06-25",
    "2026-07-08", "2026-07-09", "2026-07-22", "2026-07-23",
    "2026-09-09", "2026-09-10", "2026-09-23", "2026-09-24",
    "2026-10-07", "2026-10-08", "2026-10-14", "2026-10-15", "2026-10-20",
  ]);

  for (let i = 0; i < 294; i++) {
    const d = new Date(baseDate.getTime() + i * 24 * 3600 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const dayOfWeek = (d.getUTCDay() + 6) % 7; // 0=Poniedziałek, 6=Niedziela
    const weekIndex = Math.floor(i / 7);

    const isParliament = parliamentDates.has(dateStr);
    const isCabinet = dayOfWeek === 1; // Wtorki - posiedzenia Rady Ministrów

    // Logika intensywności
    let intensity = 0;
    let crisisEvents = 0;
    let notable: string | undefined = undefined;

    if (dateStr === "2026-10-20") {
      intensity = 4;
      crisisEvents = 8;
      notable = "Incydent P1: Awaria w Płocku i protesty pocztowców.";
    } else if (dateStr === "2026-10-14" || dateStr === "2026-10-15") {
      intensity = 3;
      crisisEvents = 5;
      notable = "Debata sejmowa nad sytuacją w PKP Cargo.";
    } else if (isParliament) {
      intensity = 2;
      crisisEvents = 3;
      notable = "Posiedzenie Sejmu RP - interpelacje do MAP.";
    } else if (isCabinet) {
      intensity = 1;
      crisisEvents = 2;
    } else if (dayOfWeek < 5 && (i % 5 === 0)) {
      intensity = 1;
      crisisEvents = 1;
    }

    days.push({
      date: dateStr,
      dayOfWeek,
      weekIndex,
      intensity,
      crisisEventsCount: crisisEvents,
      parliamentSitting: isParliament,
      cabinetMeeting: isCabinet,
      notableEvent: notable,
    });
  }

  return days;
}

export const CALENDAR_HEATMAP_DATA = generateCalendarHeatmapData();

// ==========================================
// DANE GIEŁDOWE GPW & RELACJE INWESTORSKIE (ESPI/EBI)
// ==========================================

export const STOCK_EXCHANGE_DATA: StockExchangeData[] = [
  {
    entityId: "e-orlen",
    ticker: "PKN",
    isListed: true,
    currentPricePln: 68.40,
    change1dPercent: +1.20,
    change1mPercent: +4.80,
    marketCapMldPln: 79.40,
    stateShareValueMldPln: 39.62,
    peRatio: 6.8,
    pbRatio: 0.72,
    dividendYieldPercent: 6.1,
    politicalDiscountPercent: -14.0,
    indexBasket: ["WIG20", "WIG-Paliwa", "MSCI Poland"],
  },
  {
    entityId: "ssp-278", // PKO BP
    ticker: "PKO",
    isListed: true,
    currentPricePln: 58.20,
    change1dPercent: +0.60,
    change1mPercent: +3.40,
    marketCapMldPln: 72.80,
    stateShareValueMldPln: 21.40,
    peRatio: 8.2,
    pbRatio: 1.35,
    dividendYieldPercent: 7.4,
    politicalDiscountPercent: -8.0,
    indexBasket: ["WIG20", "WIG-Banki"],
  },
  {
    entityId: "ssp-280", // PZU
    ticker: "PZU",
    isListed: true,
    currentPricePln: 49.80,
    change1dPercent: +0.40,
    change1mPercent: +2.10,
    marketCapMldPln: 43.00,
    stateShareValueMldPln: 14.70,
    peRatio: 8.9,
    pbRatio: 2.10,
    dividendYieldPercent: 8.6,
    politicalDiscountPercent: -7.0,
    indexBasket: ["WIG20"],
  },
  {
    entityId: "e-kghm",
    ticker: "KGH",
    isListed: true,
    currentPricePln: 142.50,
    change1dPercent: -1.10,
    change1mPercent: -3.80,
    marketCapMldPln: 28.50,
    stateShareValueMldPln: 9.06,
    peRatio: 12.4,
    pbRatio: 0.95,
    dividendYieldPercent: 3.2,
    politicalDiscountPercent: -18.0,
    indexBasket: ["WIG20", "WIG-Górnictwo"],
  },
  {
    entityId: "e-pge",
    ticker: "PGE",
    isListed: true,
    currentPricePln: 7.85,
    change1dPercent: +0.20,
    change1mPercent: +1.50,
    marketCapMldPln: 17.60,
    stateShareValueMldPln: 10.74,
    peRatio: 4.2,
    pbRatio: 0.38,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -32.0,
    indexBasket: ["WIG20", "WIG-Energia"],
  },
  {
    entityId: "ssp-279", // Tauron
    ticker: "TPE",
    isListed: true,
    currentPricePln: 3.42,
    change1dPercent: -0.50,
    change1mPercent: -1.20,
    marketCapMldPln: 6.00,
    stateShareValueMldPln: 1.80,
    peRatio: 3.8,
    pbRatio: 0.42,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -28.0,
    indexBasket: ["mWIG40", "WIG-Energia"],
  },
  {
    entityId: "ssp-281", // Enea
    ticker: "ENA",
    isListed: true,
    currentPricePln: 11.20,
    change1dPercent: +0.80,
    change1mPercent: +2.40,
    marketCapMldPln: 5.90,
    stateShareValueMldPln: 3.09,
    peRatio: 4.6,
    pbRatio: 0.45,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -25.0,
    indexBasket: ["mWIG40", "WIG-Energia"],
  },
  {
    entityId: "e-jsw",
    ticker: "JSW",
    isListed: true,
    currentPricePln: 26.40,
    change1dPercent: -2.80,
    change1mPercent: -8.40,
    marketCapMldPln: 3.10,
    stateShareValueMldPln: 1.70,
    peRatio: 16.5,
    pbRatio: 0.28,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -38.0,
    indexBasket: ["mWIG40", "WIG-Górnictwo"],
  },
  {
    entityId: "e-pkp-cargo",
    ticker: "PKP",
    isListed: true,
    currentPricePln: 14.80,
    change1dPercent: +3.20,
    change1mPercent: +18.50,
    marketCapMldPln: 0.66,
    stateShareValueMldPln: 0.22,
    peRatio: -1.0, // ujemny
    pbRatio: 0.31,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -45.0,
    indexBasket: ["sWIG80"],
  },
  {
    entityId: "ssp-282", // Grupa Azoty
    ticker: "ATT",
    isListed: true,
    currentPricePln: 19.80,
    change1dPercent: +0.50,
    change1mPercent: -4.20,
    marketCapMldPln: 1.96,
    stateShareValueMldPln: 0.65,
    peRatio: -1.0, // ujemny
    pbRatio: 0.48,
    dividendYieldPercent: 0.0,
    politicalDiscountPercent: -35.0,
    indexBasket: ["mWIG40", "WIG-Chemia"],
  },
];

export const ESPI_REPORTS_DATA: EspiReportRecord[] = [
  {
    id: "espi-1",
    reportNumber: "RB 42/2026",
    entityTicker: "PKN",
    entityName: "ORLEN S.A.",
    publishedAt: "2026-10-20 17:15",
    title: "Rozpoczęcie testów na utratę wartości aktywów zagranicznych w segmencie handlu międzynarodowego",
    category: "MAR_POUFNA",
    isMarRiskFlag: false,
    summary: "Zarząd ORLEN S.A. informuje o wszczęciu analiz odpisów aktualizacyjnych w spółkach zależnych w Szwajcarii.",
    espiUrl: "https://biznes.pap.pl/espi/pkn-42-2026",
  },
  {
    id: "espi-2",
    reportNumber: "RB 31/2026",
    entityTicker: "PKP",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    publishedAt: "2026-10-20 08:30",
    title: "Złożenie do Sądu Rejonowego spisu wierzytelności i propozycji układowych z wierzycielami",
    category: "MAR_POUFNA",
    isMarRiskFlag: true,
    summary: "Informacja cenotwórcza opublikowana przed otwarciem notowań na GPW. Wymaga weryfikacji KNF pod kątem art. 17 MAR.",
    espiUrl: "https://biznes.pap.pl/espi/pkp-31-2026",
  },
  {
    id: "espi-3",
    reportNumber: "RB 18/2026",
    entityTicker: "JSW",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    publishedAt: "2026-10-19 18:45",
    title: "Uchwała Zarządu w sprawie umorzenia certyfikatów inwestycyjnych JSW Stabilizacyjnego FIZ",
    category: "WYNIKI",
    isMarRiskFlag: false,
    summary: "Pozyskanie 200 mln PLN z funduszu stabilizacyjnego na bieżące regulowanie zobowiązań podatkowych i płacowych.",
    espiUrl: "https://biznes.pap.pl/espi/jsw-18-2026",
  },
  {
    id: "espi-4",
    reportNumber: "RB 27/2026",
    entityTicker: "ATT",
    entityName: "Grupa Azoty S.A.",
    publishedAt: "2026-10-18 20:10",
    title: "Podpisanie kolejnego aneksu do porozumienia w sprawie finansowania z instytucjami bankowymi",
    category: "INWESTYCJE",
    isMarRiskFlag: true,
    summary: "Przedłużenie okresu zawieszenia wybranych wskaźników finansowych do końca listopada 2026 r. Ryzyko żądania natychmiastowej spłaty długu.",
    espiUrl: "https://biznes.pap.pl/espi/att-27-2026",
  },
  {
    id: "espi-5",
    reportNumber: "RB 14/2026",
    entityTicker: "KGH",
    entityName: "KGHM Polska Miedź S.A.",
    publishedAt: "2026-10-16 16:30",
    title: "Powołanie wiceprezesa zarządu ds. aktywów zagranicznych w wyniku postępowania kwalifikacyjnego",
    category: "KADRY",
    isMarRiskFlag: false,
    summary: "Zakończenie postępowania konkursowego prowadzonego przez Radę Nadzorczą KGHM Polska Miedź S.A.",
    espiUrl: "https://biznes.pap.pl/espi/kgh-14-2026",
  },
];

export const ANALYST_CONSENSUS_DATA: AnalystConsensusRecord[] = [
  {
    entityTicker: "PKN",
    entityName: "ORLEN S.A.",
    buyCount: 7,
    holdCount: 3,
    sellCount: 1,
    averageTargetPricePln: 78.50,
    currentPricePln: 68.40,
    upsideDownsidePercent: +14.8,
    topBrokers: [
      { broker: "DM BOŚ", rating: "Kupuj", targetPrice: 82.00, date: "2026-10-12" },
      { broker: "BM mBanku", rating: "Kupuj", targetPrice: 79.50, date: "2026-10-05" },
      { broker: "Santander BM", rating: "Trzymaj", targetPrice: 71.00, date: "2026-09-28" },
      { broker: "Ipopema Securities", rating: "Kupuj", targetPrice: 81.00, date: "2026-09-15" },
    ],
  },
  {
    entityTicker: "KGH",
    entityName: "KGHM Polska Miedź S.A.",
    buyCount: 4,
    holdCount: 5,
    sellCount: 2,
    averageTargetPricePln: 155.00,
    currentPricePln: 142.50,
    upsideDownsidePercent: +8.8,
    topBrokers: [
      { broker: "Trigon DM", rating: "Kupuj", targetPrice: 162.00, date: "2026-10-10" },
      { broker: "DM BOŚ", rating: "Trzymaj", targetPrice: 148.00, date: "2026-10-02" },
      { broker: "Pekao IB", rating: "Trzymaj", targetPrice: 150.00, date: "2026-09-20" },
    ],
  },
  {
    entityTicker: "PKO",
    entityName: "PKO Bank Polski S.A.",
    buyCount: 9,
    holdCount: 2,
    sellCount: 0,
    averageTargetPricePln: 66.00,
    currentPricePln: 58.20,
    upsideDownsidePercent: +13.4,
    topBrokers: [
      { broker: "BM mBanku", rating: "Kupuj", targetPrice: 68.00, date: "2026-10-14" },
      { broker: "Santander BM", rating: "Kupuj", targetPrice: 65.50, date: "2026-10-08" },
      { broker: "Noble Securities", rating: "Kupuj", targetPrice: 64.00, date: "2026-09-25" },
    ],
  },
  {
    entityTicker: "PGE",
    entityName: "Polska Grupa Energetyczna S.A.",
    buyCount: 2,
    holdCount: 6,
    sellCount: 3,
    averageTargetPricePln: 7.90,
    currentPricePln: 7.85,
    upsideDownsidePercent: +0.6,
    topBrokers: [
      { broker: "Santander BM", rating: "Trzymaj", targetPrice: 8.00, date: "2026-10-05" },
      { broker: "DM BOŚ", rating: "Redukuj", targetPrice: 7.20, date: "2026-09-18" },
    ],
  },
  {
    entityTicker: "JSW",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    buyCount: 0,
    holdCount: 3,
    sellCount: 6,
    averageTargetPricePln: 21.50,
    currentPricePln: 26.40,
    upsideDownsidePercent: -18.6,
    topBrokers: [
      { broker: "Trigon DM", rating: "Sprzedaj", targetPrice: 20.00, date: "2026-10-15" },
      { broker: "BM mBanku", rating: "Sprzedaj", targetPrice: 22.00, date: "2026-10-01" },
    ],
  },
  {
    entityTicker: "PKP",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    buyCount: 1,
    holdCount: 2,
    sellCount: 5,
    averageTargetPricePln: 11.20,
    currentPricePln: 14.80,
    upsideDownsidePercent: -24.3,
    topBrokers: [
      { broker: "Ipopema", rating: "Sprzedaj", targetPrice: 10.50, date: "2026-10-11" },
      { broker: "Noble Securities", rating: "Trzymaj", targetPrice: 13.00, date: "2026-09-30" },
    ],
  },
];

export const LOCAL_MUNICIPAL_ISSUES: LocalMunicipalIssue[] = [
  {
    id: "loc-1",
    entityId: "e-pge",
    entityName: "PGE Górnictwo i Energetyka Konwencjonalna (Oddział KWB Bełchatów)",
    municipalityName: "Gmina Kleszczów",
    voivodeship: "Łódzkie",
    issueType: "PODATEK_LOKALNY",
    financialImpactMlnPln: 74.0,
    description: "Spór o podział wpływów z podatku od nieruchomości i opłaty eksploatacyjnej po administracyjnej zmianie granic na rzecz gminy Wola Krzysztoporska.",
    status: "otwarty_spór",
    countyWorkforceSharePercent: 36.4,
  },
  {
    id: "loc-2",
    entityId: "e-orlen",
    entityName: "ORLEN S.A. (Zakład Produkcyjny w Płocku)",
    municipalityName: "Miasto Płock",
    voivodeship: "Mazowieckie",
    issueType: "ŚRODOWISKO_ODORY",
    financialImpactMlnPln: 45.0,
    description: "Petycje mieszkańców i radnych miejskich w sprawie uciążliwości zapachowej oraz rozbudowy automatycznych stacji monitoringu powietrza wokół kompleksu rafineryjnego.",
    status: "negocjacje",
    countyWorkforceSharePercent: 28.2,
  },
  {
    id: "loc-3",
    entityId: "e-kghm",
    entityName: "KGHM Polska Miedź S.A. (O/ZWR i Kopalnie)",
    municipalityName: "Gmina Polkowice i Gmina Lubin",
    voivodeship: "Dolnośląskie",
    issueType: "PODATEK_LOKALNY",
    financialImpactMlnPln: 110.0,
    description: "Spór prawny o kwalifikację podziemnych wyrobisk górniczych jako budowli podlegających podatkowi od nieruchomości na gruncie ustawy o podatkach lokalnych.",
    status: "otwarty_spór",
    countyWorkforceSharePercent: 41.8,
  },
  {
    id: "loc-4",
    entityId: "ssp-282", // Grupa Azoty Puławy
    entityName: "Grupa Azoty Zakłady Azotowe Puławy S.A.",
    municipalityName: "Miasto Puławy",
    voivodeship: "Lubelskie",
    issueType: "ZATRUDNIENIE_RYNEK_PRACY",
    financialImpactMlnPln: 18.5,
    description: "Apel prezydenta miasta i lokalnych przedsiębiorców o ochronę miejsc pracy w zakładach azotowych oraz wniosek o rozłożenie na raty podatków lokalnych.",
    status: "negocjacje",
    countyWorkforceSharePercent: 31.0,
  },
  {
    id: "loc-5",
    entityId: "e-jsw",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    municipalityName: "Miasto Jastrzębie-Zdrój i Pawłowice",
    voivodeship: "Śląskie",
    issueType: "SPÓR_PLANISTYCZNY",
    financialImpactMlnPln: 32.0,
    description: "Protesty mieszkańców dotyczące szkód górniczych i odszkodowań za pękające domy oraz uzgodnienia miejscowego planu zagospodarowania przestrzennego dla pola Bzie-Dębina.",
    status: "otwarty_spór",
    countyWorkforceSharePercent: 29.5,
  },
  {
    id: "loc-6",
    entityId: "ssp-310", // Siarkopol
    entityName: "Kopalnie i Zakłady Chemiczne Siarki Siarkopol (w likwidacji)",
    municipalityName: "Miasto Tarnobrzeg",
    voivodeship: "Podkarpackie",
    issueType: "ŚRODOWISKO_ODORY",
    financialImpactMlnPln: 28.0,
    description: "Koszty rekultywacji terenów poeksploatacyjnych wokół Jeziora Tarnobrzeskiego i odpowiedzialność Skarbu Państwa za monitoring wód podziemnych.",
    status: "ugoda",
    countyWorkforceSharePercent: 4.5,
  },
];


