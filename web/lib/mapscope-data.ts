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
  NationalAssetsPortfolioStats,
  CriticalInfrastructureSector,
  AgmVotingInstructionTemplate,
  StrategicReserveIndicator,
  ForeignTakeoverShieldEntity,
  DebtStabilityRecord,
  MorningCabinetBriefing,
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
import { enrichEntityWithKrsPassport, VERIFIED_STRATEGIC_BOARDS, OFFICIAL_EKRS_BASE_URL } from "./verified-governance-data.ts";
export type { ExecutiveAnalyticsSummary } from "./all-ssp-registry.ts";
export { EXECUTIVE_ANALYTICS, VERIFIED_STRATEGIC_BOARDS, OFFICIAL_EKRS_BASE_URL, enrichEntityWithKrsPassport };

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

  return enrichEntityWithKrsPassport(updated);
});

// ==========================================
// DANE DLA ZAAWANSOWANYCH WIZUALIZACJI MAPSCOPE
// ==========================================

export const VOIVODESHIP_REGIONAL_DATA: VoivodeshipRegionalData[] = [
  {
    id: "mazowieckie",
    name: "Mazowieckie",
    pathData: "M344.22,174.33L349.39,175.11L348.73,171.12L353.84,168.1L353.84,168.1L354.12,168.65L354.12,168.65L353.57,172.1L357.74,174.87L364.98,172.91L367.4,175.14L369.59,174.07L378.11,175.85L382.45,173.28L381.79,168.59L386.63,164.84L392.57,166.96L398.89,164.28L402.65,158.06L410.72,160.08L412.04,157.03L415.22,157.26L414.23,154.47L415.85,153.17L419.66,152.82L423.09,155.74L436.57,145.86L441.91,146.9L447.04,144.78L447.34,142.4L456.33,140.85L456.33,140.85L456.67,142.35L456.67,142.35L456.21,142.35L456.21,142.35L458.81,146.34L457.99,148.19L461.51,152.41L459.62,156.05L462,155.67L464.71,158.07L460.55,158L460.55,158L460.59,157.59L460.59,157.59L459.02,160.78L459.98,163.14L457.92,162.77L461.79,167.95L460.66,168.65L462.87,173.08L462.28,175.87L464.59,178.65L469.1,178.1L472.73,183.57L477.17,182.5L477.17,182.5L476.08,184.09L476.08,184.09L477.16,185.8L474.59,185.09L473.51,188.71L480.75,193.44L480.75,193.44L480.23,193.44L480.23,193.44L482.52,195.72L480.4,197.86L483.17,204.23L493.88,203.44L494.14,200.58L497.17,200.71L497.67,204.32L499.57,203.91L498.71,205.75L495.86,205.81L498.08,211.71L500.29,211.5L501.11,213.68L504.39,211.52L504.26,209.9L508.56,210.71L509.12,224.22L504.83,228.71L508.76,231.45L512.98,237.83L512.04,241.8L514.58,243.62L513.9,247.69L516.18,250.7L523.9,250.78L525.29,253.48L526.69,251.6L532.64,254.14L538.84,252.96L541.62,256.74L544.69,257.41L545.21,261.4L548.75,259.77L550.02,261.42L550.02,261.42L544.34,267.97L546.98,272.23L541.58,271.85L538.55,275.26L540.12,278.19L536.72,278.22L536.28,282.32L532.22,280.68L529.84,281.99L523.91,277.56L520.46,280.86L521.74,283.57L518.9,288.23L511.29,282.45L506.66,287.3L502.07,288L500.03,284.61L497.2,287.41L490.31,285.74L488.78,288.22L483.46,286.11L474.3,291.44L473.48,295.39L475.43,300.63L471.8,304.69L472.62,306.6L476.58,305.44L478.54,309.47L471.69,314.07L475.39,317.71L475.09,319.79L471.4,321.98L471.42,324.6L466.26,325.15L465.57,327.99L459.33,323.29L457.44,327.38L463.27,332.73L469.79,332.61L473.07,341.39L471.04,347.02L468.8,346.01L466.2,348.62L469.04,351.08L470.62,350.51L471.83,353.11L470.12,358.2L468.32,359.02L471.13,359.36L467.98,368.52L469.86,372.42L468.24,375.52L469.08,381.04L469.08,381.04L465.89,383.88L463.07,383.64L461.07,380.12L457.19,380.28L458.32,381.36L453.05,382.93L450.96,381.99L451.26,383.94L448.12,386.33L443.19,383.61L441.29,379.29L429.13,379.73L429.8,375.04L425.35,372.6L427.1,369.44L424.87,366.77L423.39,372.29L419.71,373.51L418.9,371.44L416.62,373.57L413.46,371.06L413.23,374.53L411.22,373.75L411.15,375.33L402.65,370.87L400.71,373.05L401.42,368.62L395.77,363.73L392.58,364.71L391.67,359.06L389.05,357.2L390.36,354.3L384.93,353.46L384.93,353.46L385.35,349.92L389.36,345.75L391.82,339.7L391.29,337.52L386.29,338.41L387.36,333.19L385.22,331.62L382.61,323.12L387.23,319.34L390.46,322.2L396.64,323.52L398.95,319.64L398.94,316.82L394.34,314.59L394.22,308.44L392.77,307.74L396.58,307.41L393.36,300.1L389.66,299.91L388.57,296.99L385.05,294.66L378.24,297.54L377.77,295.12L373.5,295.2L376.42,292.34L376.12,290.65L374.86,287.81L371.52,286.09L374.95,283.36L375.71,278.65L371.1,277.3L369.47,274.49L365.87,274.34L363.61,270.5L364.1,265.68L360.84,262.37L357.66,263.59L357.09,261.07L352.96,258.46L350.4,261.63L347.63,261.16L343.94,263.21L341.08,261.89L338.53,263.88L335.98,260.41L328.67,257.49L328.9,255.68L326.03,254.16L319.38,254.98L315.44,250.26L315.44,250.26L315.8,247.57L315.8,247.57L315.45,247L315.45,247L313.94,245.28L317.09,245.26L321.79,238.91L317.38,237.16L319.08,237.4L319.12,233.23L319.12,233.23L319.93,233.22L319.93,233.22L323.41,230.05L320.2,227.51L323.06,222.91L325.23,222.74L324.65,217.65L329.8,219.44L328.19,216.77L329.67,215.01L328.06,215.08L328.52,213.06L323.63,208.4L326.54,203.55L329.03,203.76L324.9,195.22L330.02,196.21L332.99,193.78L331.64,190.74L339.29,194.22L338.28,191.03L339.89,187.61L337.62,185.91L336.55,178.45L338.44,178.99L339.55,177.3L339.55,177.3L340,177.45L340,177.45z",
    center: [425.6, 256.7],
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
    pathData: "M277.31,382.27L288.97,380.19L290.53,381.76L292.71,378.04L294.69,377.71L301.86,383.88L303.88,383.3L305.94,386.54L307.67,385.77L311.3,388.71L313.99,387.07L313.58,384.34L317.47,383.06L316.95,385.28L319.38,388.25L321.78,386.34L323.07,387.18L327.13,393.1L328.23,398.32L333.81,396.34L338.67,398.85L339.04,401.85L343.61,400.76L343.61,400.76L348.89,404.83L348.67,406.27L346.44,405.33L343.76,411.31L340.87,410.53L342.3,414.51L349.44,415.32L351.52,417.05L349.79,418.16L349.95,420.4L354.08,421.03L353.44,424L350.17,424.17L345.82,430.47L352.72,431.9L353.42,434.49L355.72,435.23L355.72,435.23L357.04,438.07L352.65,438.21L352.57,440.1L349.73,441.49L341.17,440.96L338.03,443.85L334.05,444.58L330.19,443.49L328.11,445.47L328.61,448.09L326.1,447.51L326.1,447.51L325.78,447.61L325.78,447.61L328.25,449.48L327.81,452.48L320.21,452.87L316.8,455.55L317.87,458.59L324.07,461.69L323.39,463.82L318.96,465.52L320.28,467.13L318.75,469.3L314.64,469.88L313.58,472.68L313.3,470.79L313.3,470.79L312.97,470.79L312.97,470.79L310.64,476.07L311.83,476.94L307.95,477.57L304.48,483.41L304.71,486.72L302.82,487.92L304.97,489L304.97,489L305.72,489L305.72,489L306.8,488.96L306.8,488.96L307.45,488.96L307.45,488.96L309.68,487.54L310.81,488.51L308.6,496.3L315.99,495.69L317.97,503.41L325.24,504.58L325.91,507.8L321.3,512.14L327.26,514.57L326.43,519.86L326.43,519.86L320.49,524.02L319.83,526.99L313.8,527.4L311.55,534.63L309.24,536.38L309.61,538.62L305.2,539.46L302.3,538.13L299.92,540.15L296.53,540.19L296.05,530.05L287.76,528.2L289.1,525.71L285.95,513.81L281.95,513.88L279.94,511.19L274.84,509.5L271.49,499.58L273.6,496.41L271.2,494.64L271.62,490.75L266.52,492.39L262.91,489.17L257.03,488.17L258.17,489.51L256.14,491.35L253.59,486.67L249.77,485.96L249.28,483.49L246.06,484.98L243.74,483.83L242.11,479.17L238.75,477.1L238.75,477.1L241.13,472.86L240.47,466.63L242.87,466.04L243.43,467.41L244.09,466.01L251.91,464.66L251.91,464.66L251.53,464.69L251.53,464.69L251.11,462.91L258.23,458.79L262.75,459.77L262.46,457.44L260.73,457.17L261.47,452.55L258.54,449.42L260.75,446.34L258.93,443.47L260.39,441.44L259.87,437.21L266.1,439.57L263.25,431.42L273.69,430.95L273.39,425.67L269.28,423.89L266.56,416.4L272.2,412.2L267.89,407.01L270.87,406.27L271.61,403.2L274.88,400.61L276.21,395.13L274.45,391.39L276.78,389.73L276.71,386.81L279.14,385.57z",
    center: [301.4, 454.2],
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
    pathData: "M51.93,352.21L54.29,352.28L54.58,349.39L58.18,348.99L58.99,346.04L64.94,342.45L73.9,347.82L74.56,341.86L76.79,341.92L76.13,338.84L77.81,336.05L83.13,337.66L83.46,336.32L89.83,341.94L90.25,344.21L97.09,337.24L97.35,333.74L103.76,331.77L105.83,323.45L103.6,322.34L106.56,320.21L106.69,317.22L113.4,314.91L112.64,312.6L115.12,311.87L112.59,310.67L113.81,309.12L116.48,309.2L116.84,311.33L122.71,313.55L125.4,313.01L124.44,318.25L127.76,318.04L131.25,323.05L137.1,317.62L137.72,313.68L140.28,311.05L140.28,311.05L148.01,311.13L152.87,314.45L155.07,318.67L153.58,323.34L161.41,324.59L163.31,329.15L173.41,334.53L179.33,334.48L179.6,332.45L182.24,331.58L188.15,332.37L188.83,326.29L193.85,324.65L204.26,326.62L209.61,330.76L209.61,330.76L209.61,331.56L209.61,331.56L211.05,335.23L206.92,338.45L209.1,348.36L221.04,347.32L219.25,354.06L221.47,355.26L221.27,363.7L224.52,368.97L224.52,368.97L216.52,371.98L212.76,369.21L212.16,371.3L208.97,372.68L211.12,379.62L207.37,381.81L207.09,386.38L208.7,388.46L205.61,388.74L206.95,390.38L201.93,390.77L201.71,396.3L198.12,394.82L197.15,397.24L199.89,398.33L199.09,400.97L195.69,402.11L196.85,408.34L193.03,407.36L191.16,409.6L193.48,412.12L189.22,415.16L191.43,417.43L190.03,418.28L190.62,424.22L183,425.37L179.51,431.59L178.73,438.82L172.67,437.32L172.67,437.32L172.39,437.51L172.39,437.51L170.21,440.71L170.21,440.71L167.07,444.53L170.16,446.28L172.47,453.33L175.88,454.58L177.39,461.52L175.62,462.75L174.25,460.04L172.94,462.17L169.53,462.1L168.53,464.32L166.24,463.65L162.49,469.5L156.78,473.9L150.15,469.7L148.7,462.29L141.21,452.8L137.99,452.05L136.64,447.24L133.2,446.91L131.66,448.42L126.56,442.2L133.67,435.07L136.59,435.56L139.03,433L139.26,429.12L141.69,428.15L135.47,420.15L128.86,419.27L127.89,422.82L125.97,423.47L120.82,420.07L116.06,426.25L113.75,424.84L115.9,423.24L113.97,418.04L106.1,418.98L103.3,411.22L96.61,412.97L90.43,409.19L85.53,409.07L80.31,406.15L76.36,409.1L75.94,403.47L70.46,398.26L70.29,389.64L68.1,387.74L64,388.96L63.86,385.7L61.44,388.59L57.28,385.42L52.64,386.57L51.61,388.55L54.88,390.8L52.9,395.07L53.65,400.48L42.77,400.08L51.33,382.63L55.93,363.83L55.63,359.13z",
    center: [141.4, 382.2],
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
    pathData: "M169.13,122.7L172.56,134.31L175.68,133.72L175.66,137.02L178.86,137L181.49,134.45L185.55,136.08L189.04,135.38L189.04,135.38L190.36,135.32L190.36,135.32L194.2,135.89L195.98,138.56L195.98,138.56L196.22,138.65L196.22,138.65L199.53,139.83L199.53,139.83L190.69,151.26L191.88,154.72L192.78,153.28L196.27,154.45L202.31,162.52L200.83,166.61L195.32,167.87L196.96,169.35L196.32,174.04L199.54,175.35L197.15,176.55L197.8,180.51L195.45,181.95L195.89,187.87L195.89,187.87L195.59,187.93L195.59,187.93L194.11,190.09L195.01,192.27L199.82,191.36L207.3,196.93L206.4,210.99L200.62,211.31L200.29,214.23L205.34,217.03L204.38,221.75L207.56,222.61L210.96,219.36L214.19,218.93L214.1,224.56L217.24,224.99L217.07,229.75L222.23,224.13L222.64,226.43L224.02,224.11L226.8,226.27L229.1,225.72L231.95,231.34L233.14,230.33L235.11,233.28L236.43,232.19L235.95,235.66L242.52,234.72L242.33,238.08L248.66,239.55L249.15,241.73L252.6,241.92L259.12,235.81L260.36,243.07L264.98,242.45L266.59,239.65L268.61,240.2L270.88,243.79L272.87,243.24L276.3,244.99L276.8,247.82L278.41,247.19L278.19,250.03L280.38,250.25L282.75,256.67L292.39,253.35L292.97,249.99L296.24,252.45L295.86,254.36L300.57,256.7L300.57,256.7L299.58,262.75L303.84,263.3L304.13,265.74L302.1,267.11L303.16,269.23L297.32,267.6L293.36,269.18L292.15,274.9L294.32,276.9L293.31,280.79L288.04,280.92L287.17,283.62L281.98,281.85L280.06,283.03L280.88,292.6L284.94,296.35L279.26,303.06L278.7,307.04L273,304.9L268.17,306.07L267.41,303.84L265.57,304.45L265.38,307.51L263.47,307.05L263.76,309.2L261.87,310.49L263.03,313.03L261.4,314.7L261.83,318.7L258.3,323.2L260.01,323.94L257.98,328.89L259.74,329.57L258.49,335.59L259.95,341.27L256.6,346.78L251.19,343.62L248.39,344.41L249.83,346.38L249.06,349.3L245.63,349.68L244.55,352.46L241.79,352.97L243.65,361.72L247.93,361.15L246.46,370.58L246.46,370.58L229.74,377.42L225.77,375.91L227.62,370.53L224.52,368.97L224.52,368.97L221.27,363.7L221.47,355.26L219.25,354.06L221.04,347.32L209.1,348.36L206.92,338.45L211.05,335.23L209.61,331.56L209.61,331.56L209.61,330.76L209.61,330.76L204.26,326.62L193.85,324.65L188.83,326.29L188.15,332.37L182.24,331.58L179.6,332.45L179.33,334.48L173.41,334.53L163.31,329.15L161.41,324.59L153.58,323.34L155.07,318.67L152.87,314.45L148.01,311.13L140.28,311.05L140.28,311.05L138.07,304.5L132.61,299.9L129.61,299.1L126.86,302.61L124.47,300.45L120.79,300.25L123,297.13L122.12,290.45L115.71,292.3L112.06,287.46L113.89,284.9L113.36,282.63L111.11,281.59L109.83,283.3L105.56,278.82L107.41,275.41L105.88,263.87L108.84,251.03L103.29,246.25L104.07,244.5L105.46,247.21L108.56,245.22L107.53,240.87L104.32,237.67L105.75,235.19L101.48,229.05L103.73,222.3L102.57,218.9L111.24,216.88L110.6,209.69L108,208.56L108.82,206.09L113.09,204.03L112.3,193.29L112.3,193.29L112.13,193.17L112.13,193.17L111.66,190.09L111.66,190.09L111.66,189.75L111.66,189.75L112.26,185.59L112.26,185.59L121.71,188.98L130.74,184.65L133.79,185.44L133.06,184.41L136.63,180.93L135.53,177L138.27,175.97L139.45,171.59L140.74,173.08L143.24,170.29L145.8,171.07L146.91,166.36L148.61,166.84L148.73,165.19L153.5,167.27L152.92,161.82L157.83,157.78L153.3,153.51L148.66,152.24L145.47,149.22L143.63,149.81L141.96,141.32L142.4,140.18L144.63,141.86L154.26,140.25L158.68,136.64L160.57,126.32L164.88,124.12L166.05,125.97z",
    center: [198.3, 244],
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
    pathData: "M355.72,435.23L358.04,433.84L375.42,438.63L375.45,442.02L379.53,448.5L376.85,449.69L377.03,452.24L381.26,455.31L379.69,457.33L383.14,460.6L381.77,463.16L383.97,463.42L384.25,465.08L400.15,463.2L406.98,455.81L409.8,457.35L413.33,454.19L423.38,453.17L428.03,449.53L430.6,451.88L432.58,449.51L432.58,449.51L433.18,453.37L428.73,458.58L430.61,462.96L429.13,469.49L431.09,470.04L429.32,470.45L431.87,471.12L432.46,473.86L430.46,474.33L431.69,475.86L429.38,477.58L431.89,480.22L429.3,484.4L431.25,489.79L437.01,490.22L438,492.24L437.2,493.8L434.14,493.63L433.97,496.77L428.35,497.95L430.21,500.29L429.45,503.9L434.9,504.04L436.01,505.99L439.02,506.41L441.51,511.7L442.24,516.66L439.64,521.9L442.58,523.77L441.73,526.14L445.44,530.85L443.61,531.72L444.06,536.62L444.06,536.62L436.66,534.08L432.64,539.54L427.52,536.47L423.1,537.81L426.25,542.06L422.46,543.06L419.33,548.3L415.61,549.31L414.03,546.57L412.2,547.21L411.61,544.67L409.94,545.92L407.54,545.02L408.29,543.69L405.22,542.49L404.04,538.23L398.41,539.64L396.49,538.04L393.95,541.94L387.58,538.28L385.12,538.13L385.21,540.05L384.31,539.07L382.75,540.58L381.62,538.99L379.31,539.38L378.09,544.94L372.39,544.21L368.68,548.66L367.88,547.61L363.98,560.3L355.49,555.13L352.92,555.55L351.1,558.66L345.97,558.45L344.66,555.09L348.09,551.12L346.41,549.03L346.13,538.85L341.68,541.01L336.33,538.97L336.99,534.37L333.47,534.6L330.13,523.64L326.95,522.02L326.43,519.86L326.43,519.86L327.26,514.57L321.3,512.14L325.91,507.8L325.24,504.58L317.97,503.41L315.99,495.69L308.6,496.3L310.81,488.51L309.68,487.54L307.45,488.96L307.45,488.96L306.8,488.96L306.8,488.96L305.72,489L305.72,489L304.97,489L304.97,489L302.82,487.92L304.71,486.72L304.48,483.41L307.95,477.57L311.83,476.94L310.64,476.07L312.97,470.79L312.97,470.79L313.3,470.79L313.3,470.79L313.58,472.68L314.64,469.88L318.75,469.3L320.28,467.13L318.96,465.52L323.39,463.82L324.07,461.69L317.87,458.59L316.8,455.55L320.21,452.87L327.81,452.48L328.25,449.48L325.78,447.61L325.78,447.61L326.1,447.51L326.1,447.51L328.61,448.09L328.11,445.47L330.19,443.49L334.05,444.58L338.03,443.85L341.17,440.96L349.73,441.49L352.57,440.1L352.65,438.21L357.04,438.07z",
    center: [373.6, 494.9],
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
    pathData: "M254.76,0l22.84,13.61l9.27,8.47l-0.74,3.58l-6.45,-9.89L262.46,5.04l-1.71,6.17l4.71,3.71l-0.1,6.56l2.89,-0.88l-0.19,3.28l3.25,6.22l-1.2,1.38l-2.56,-0.86l3.28,1.51l0.32,8.05l3.81,4.16l5.99,0.86l-2.08,0.64l2.63,2.59l9.97,2.94l2.77,-2.08l3.63,2.26l12.67,-0.89l13.08,-3.12l13.69,-6.93l-14.48,8.71l-11.38,3.15l2.12,2.41l0.2,4.05l0,0l3.71,6.59l-4.4,3.62l1.31,2.21l-3.06,8.78l4.45,2.02l-1.14,1.74l1.15,1.85l1.94,-0.94l5.3,2.75l-1.62,3.08l1.48,3.18l11.07,-2.41l-2.99,7.53l0,0v0.33l0,0l-4.04,7.1l1.26,1.07l-1.07,2.95l-2.14,-3.21l-5.66,-1.46l-2.21,1.21l-0.98,6.62l-4.71,5.03l-0.16,5.17l-2.29,0.15l-2.92,3.39l0.45,2.92l0,0l-9.22,-1.2l-5.48,1.93l0.17,-1.83l-8.36,-1.09l-1.84,-3.84l1.82,-5.83l-2.33,1.62l-4.72,-1.14l-1.55,2.21l-3.19,-0.38l0.5,1.85l-1.91,0.44l-2.39,-2.61l0.25,-2.46l-2.75,0.2l-0.71,1.66l-11.98,-1.53l0.25,-4.36l-4.16,-0.14l0,0v-1.09l0,0l-1.93,1.28l-1.09,-2.42l-2.43,0.84l-2.34,-2.48l-4.25,6.08l-3.58,-3.4l-5.3,-0.53l1.95,5.15l-4.5,2.56l-4.47,-0.44l-2.33,5.97l1.01,2.99l-3.92,0.18l0.92,2.94l-3.89,-2.65l-2.05,1.88l-3.03,-0.69l-0.85,-3.63l-5.46,4.04l-1.83,9.57l0,0l-3.31,-1.18l0,0l-0.24,-0.09l0,0l-1.78,-2.67l-3.85,-0.56l0,0l-1.32,0.06l0,0l-3.49,0.7l-4.06,-1.63l-2.63,2.55l-3.2,0.02l0.02,-3.3l-3.11,0.58l-3.44,-11.61l0,0l-2.17,-9.18l5.27,-5.36l-4.44,-3.3l0.03,-3.76l1.34,-1.29l4.65,0.73l0.81,-3.42l-6.46,-3.65l-0.13,-3.64l-2.04,-2.34l-1.54,-0.81l-0.76,2.57l0,0l-0.71,0.06l0,0l-0.35,-4.92l0,0l0.42,-0.51l0,0l1.23,-4.1l-1.89,-2.77l1.32,-1.79l-5.46,-10.1l0.96,-2.11l7.53,-2.85l0.67,-2.34l-3.07,-3.61l-0.48,-4.96l2.7,-0.69l-0.42,-7.69l-1.44,-3.33l-2.93,-1.21l-2.81,-8.19l0,0l10.51,-2.71l8.99,-7.85l13.07,-6.8l42.29,-10.21L254.76,0z",
    center: [242.3, 88.9],
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
    pathData: "M550.02,261.42L552.88,261.59L552.88,261.59L554.34,262.38L554.44,267.28L565.97,269.83L567.8,272.61L572.47,271.94L571.64,274.59L575.36,278.79L578.41,278.1L581.68,281.76L581.08,283.98L583.89,290.57L580.11,294.78L581.26,296.35L579.24,297.96L580.83,300.35L580.35,302.36L578.89,301.94L578.61,305.46L580.95,309.43L574.12,316.43L576.01,319.42L574.72,324.78L576.41,335.51L579.1,336.08L579.79,339.18L582.41,339.96L581.61,344.16L584.84,346.76L583.76,351.72L580.87,355.19L581.42,359.2L584.54,359.2L587.14,366.78L595.13,372.9L594.36,377.86L597.53,380.36L599.08,386.09L597.76,386.5L600.41,388.47L601.26,392.23L606.32,397.96L611.99,400.2L609.55,403L603.29,402.84L600.76,405.46L601.13,409.21L604.5,410.13L604.15,414.17L607.46,414.51L606.95,418.48L608.97,422.59L608.61,429.71L605.1,440.89L602.87,444.14L586.38,446.39L583.77,451.81L575.05,459.67L575.05,459.67L572.91,458.48L573.54,455.21L566.67,454.4L568.37,450.13L568.37,450.13L567.93,450.13L567.93,450.13L564.97,448.12L565.52,444.61L563.78,444.07L557.21,449.12L553.02,445.51L543.04,455.89L518.01,453.9L518.04,452.03L522.74,449.43L511.74,450.55L507.59,445.23L505.36,445.61L506,443.01L508.89,441.9L508.06,439.31L514.14,440.14L516.74,437.68L512.89,437.22L515.93,436.19L515.55,434.8L512.73,434.92L513.26,428.3L509.89,426.84L506.95,427.82L502.71,424.1L497.21,423.62L494.25,419.44L489.99,419.25L494.13,410.67L491.85,406.5L485.44,404.61L482.13,408L475.43,409.1L472.83,405.9L472.83,405.9L471.24,402.97L469.08,381.04L469.08,381.04L468.24,375.52L469.86,372.42L467.98,368.52L471.13,359.36L468.32,359.02L470.12,358.2L471.83,353.11L470.62,350.51L469.04,351.08L466.2,348.62L468.8,346.01L471.04,347.02L473.07,341.39L469.79,332.61L463.27,332.73L457.44,327.38L459.33,323.29L465.57,327.99L466.26,325.15L471.42,324.6L471.4,321.98L475.09,319.79L475.39,317.71L471.69,314.07L478.54,309.47L476.58,305.44L472.62,306.6L471.8,304.69L475.43,300.63L473.48,295.39L474.3,291.44L483.46,286.11L488.78,288.22L490.31,285.74L497.2,287.41L500.03,284.61L502.07,288L506.66,287.3L511.29,282.45L518.9,288.23L521.74,283.57L520.46,280.86L523.91,277.56L529.84,281.99L532.22,280.68L536.28,282.32L536.72,278.22L540.12,278.19L538.55,275.26L541.58,271.85L546.98,272.23L544.34,267.97z",
    center: [534.9, 361],
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
    pathData: "M472.83,405.9L475.43,409.1L482.13,408L485.44,404.61L491.85,406.5L494.13,410.67L489.99,419.25L494.25,419.44L497.21,423.62L502.71,424.1L506.95,427.82L509.89,426.84L513.26,428.3L512.73,434.92L515.55,434.8L515.93,436.19L512.89,437.22L516.74,437.68L514.14,440.14L508.06,439.31L508.89,441.9L506,443.01L505.36,445.61L507.59,445.23L511.74,450.55L522.74,449.43L518.04,452.03L518.01,453.9L543.04,455.89L553.02,445.51L557.21,449.12L563.78,444.07L565.52,444.61L564.97,448.12L567.93,450.13L567.93,450.13L568.37,450.13L568.37,450.13L566.67,454.4L573.54,455.21L572.91,458.48L575.05,459.67L575.05,459.67L559.03,473.49L520.09,527.51L523.58,530.93L526.56,543.26L526.16,553.9L524.65,555.49L526.6,556.91L524.2,560.66L524.9,561.64L527.13,559.97L526.13,562.19L529.18,562.27L531.64,566.54L535.3,567.97L533.81,570.74L535.29,576.23L532.69,576.71L527.99,571.99L522.6,573.28L516.85,567.97L511.43,568.98L506.74,567.73L503.4,563.53L500.41,564.35L494.76,562.73L494.63,559.9L492.53,560.71L483.93,556.76L482.92,550.95L478.62,544.63L475.01,544.42L471.2,540.6L468.51,541.77L468.06,544.02L463.93,538.59L460.1,538.15L458.48,535.26L448.78,538.47L444.06,536.62L444.06,536.62L443.61,531.72L445.44,530.85L441.73,526.14L442.58,523.77L439.64,521.9L442.24,516.66L441.51,511.7L439.02,506.41L436.01,505.99L434.9,504.04L429.45,503.9L430.21,500.29L428.35,497.95L433.97,496.77L434.14,493.63L437.2,493.8L438,492.24L437.01,490.22L431.25,489.79L429.3,484.4L431.89,480.22L429.38,477.58L431.69,475.86L430.46,474.33L432.46,473.86L431.87,471.12L429.32,470.45L431.09,470.04L429.13,469.49L430.61,462.96L428.73,458.58L433.18,453.37L432.58,449.51L432.58,449.51L432.83,449.48L432.83,449.48L433.33,449.12L433.33,449.12L438.97,443.05L447.1,439.75L447.26,436.43L456.42,433.96L460.93,425.3L466.02,421.11L467.93,422.15z",
    center: [487.6, 487.7],
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
    pathData: "M11.44,101.98l4.79,0.56l-2.98,2.15l0.02,2.41L9.72,102L11.44,101.98zM17.34,101.8l0.57,1.34l-2.05,0.97L17.34,101.8zM12.71,100.79l1.72,1.45l-2.8,-0.02L12.71,100.79zM14.89,99.53l-0.09,2.46l-1.22,-1.71L14.89,99.53zM7.71,95.29l1.81,-0.17l-2,2.57l5.6,9.49l-7.62,-6.1l0.09,-3.46l-1.78,-1.3L7.71,95.29zM38.68,90.81l-0.04,1.47l-3.22,0.32l0.43,-3.07L38.68,90.81zM39.3,85.29l-4.4,2.66l0.06,5.87l-3.74,4.45l-2.78,9.59l-1.28,-5.2l-8.61,-1.35l0.56,-4l-0.68,1.87l-2.52,-0.83l-5.74,3.47l0.82,-1.22l-2.85,-2.59l1.73,-2.6l6.88,0.43l6.12,-4.69L39.3,85.29zM158.95,28.15l2.81,8.19l2.93,1.21l1.44,3.33l0.42,7.69l-2.7,0.69l0.48,4.96l3.07,3.61l-0.67,2.34l-7.53,2.85l-0.96,2.11l5.46,10.1l-1.32,1.79l1.89,2.77l-1.23,4.1l0,0l-0.42,0.51l0,0l0.35,4.92l0,0l0.71,-0.06l0,0l0.76,-2.57l1.54,0.81l2.04,2.34l0.13,3.64l6.46,3.65l-0.81,3.42l-4.65,-0.73l-1.34,1.29l-0.03,3.76l4.44,3.3l-5.27,5.36l2.17,9.18l0,0l-3.08,3.27l-1.17,-1.85l-4.3,2.2l-1.9,10.33l-4.41,3.6l-9.63,1.62l-2.23,-1.69l-0.45,1.15l1.68,8.48l1.84,-0.58l3.19,3.01l4.64,1.28l4.52,4.26l-4.91,4.04l0.59,5.45l-4.77,-2.09l-0.12,1.65l-1.7,-0.48l-1.12,4.71l-2.55,-0.77l-2.5,2.78l-1.29,-1.49l-1.18,4.39l-2.73,1.03l1.1,3.94l-3.58,3.48l0.74,1.03l-3.06,-0.79l-9.03,4.32l-9.45,-3.38l0,0l1.5,-6.34l-8.12,-1.94l0.43,2.35l-3.09,1.37l0.54,1.97l-2.52,0.51l1.68,2.15l-3.25,1.32l0.99,2.08l-2.29,1.29l-2.41,-1.22l-2.64,2.23l-5.7,-3.19l-8.18,2.82l-3.33,3.79l-4.55,-1.01l2.15,6.48l-14.94,6.38l-2.21,-2.53l-2.56,1.8l-5.28,-4.38l-2.04,2.75l2.05,1.91l-3.88,1.21l0.78,3.01l-3.97,3.2l-3.25,11.53l-2.26,1.44l-4.71,-2.56l-2.09,1.77l0.07,3.59l0,0l-8.33,-5.51l-6.87,-8.95l-8.13,-6.62L0,206.08l2.31,-4.67l-1,-7.74l12.2,-9.21l2.6,-9l-0.63,-5.94l4.31,-6.45l-2.39,-4.63l-3.31,-18.78l-2.83,-5.34l0.58,-7.55l-2,-1.76l-1.1,-6.51l2.59,-0.63l-1.39,-4.04l2.84,0.9l4.64,5.65l5.85,1.22l5.74,7.4l1.33,-6.18l-2.96,-0.14l-1.95,-4.79l1.67,-6.2l3.01,-0.49l-0.56,-5.58l2.74,-7.54l4.41,-4.58l2.15,1.58l0.27,-4.75l1.42,-0.4L39.2,87.9l2.44,-3.69l-4.76,0.78l34.65,-12.91l12.57,-2.06l21.3,-7.6l15.15,-3.38l10.18,-8.13l15.9,-19.6L158.95,28.15z",
    center: [79.1, 127.9],
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
    pathData: "M315.44,250.26L319.38,254.98L326.03,254.16L328.9,255.68L328.67,257.49L335.98,260.41L338.53,263.88L341.08,261.89L343.94,263.21L347.63,261.16L350.4,261.63L352.96,258.46L357.09,261.07L357.66,263.59L360.84,262.37L364.1,265.68L363.61,270.5L365.87,274.34L369.47,274.49L371.1,277.3L375.71,278.65L374.95,283.36L371.52,286.09L374.86,287.81L376.12,290.65L376.42,292.34L373.5,295.2L377.77,295.12L378.24,297.54L385.05,294.66L388.57,296.99L389.66,299.91L393.36,300.1L396.58,307.41L392.77,307.74L394.22,308.44L394.34,314.59L398.94,316.82L398.95,319.64L396.64,323.52L390.46,322.2L387.23,319.34L382.61,323.12L385.22,331.62L387.36,333.19L386.29,338.41L391.29,337.52L391.82,339.7L389.36,345.75L385.35,349.92L384.93,353.46L384.93,353.46L384.07,356.47L381.45,357.44L382.74,361.43L381.37,364.62L378.99,362.61L377.27,364.24L374.59,362.49L373.5,362.83L374.87,366.83L373.43,367.82L369.73,367.47L368.14,369.19L362.02,366.75L359.15,367.99L360.46,371.05L357.94,373.37L358.04,379.46L362.71,380.92L360.92,390.15L356.72,387.98L351.47,381.84L348.57,388.91L349.45,393.25L349.45,393.25L349.45,394.22L349.45,394.22L348.6,395.62L348.6,395.62L348.51,395.61L348.51,395.61L347.48,396.69L347.48,396.69L347.01,397.04L347.01,397.04L345.97,397.16L345.97,397.16L346.05,397.4L346.05,397.4L343.61,400.76L343.61,400.76L339.04,401.85L338.67,398.85L333.81,396.34L328.23,398.32L327.13,393.1L323.07,387.18L321.78,386.34L319.38,388.25L316.95,385.28L317.47,383.06L313.58,384.34L313.99,387.07L311.3,388.71L307.67,385.77L305.94,386.54L303.88,383.3L301.86,383.88L294.69,377.71L292.71,378.04L290.53,381.76L288.97,380.19L277.31,382.27L277.31,382.27L272.31,379.42L270.16,373.96L268.42,374.19L266.58,378.72L265.09,375.94L255.35,374.51L246.46,370.58L246.46,370.58L247.93,361.15L243.65,361.72L241.79,352.97L244.55,352.46L245.63,349.68L249.06,349.3L249.83,346.38L248.39,344.41L251.19,343.62L256.6,346.78L259.95,341.27L258.49,335.59L259.74,329.57L257.98,328.89L260.01,323.94L258.3,323.2L261.83,318.7L261.4,314.7L263.03,313.03L261.87,310.49L263.76,309.2L263.47,307.05L265.38,307.51L265.57,304.45L267.41,303.84L268.17,306.07L273,304.9L278.7,307.04L279.26,303.06L284.94,296.35L280.88,292.6L280.06,283.03L281.98,281.85L287.17,283.62L288.04,280.92L293.31,280.79L294.32,276.9L292.15,274.9L293.36,269.18L297.32,267.6L303.16,269.23L302.1,267.11L304.13,265.74L303.84,263.3L299.58,262.75L300.57,256.7L300.57,256.7L309.96,254.03L311.19,255.73L310.56,253.49z",
    center: [327.2, 333.4],
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
    pathData: "M199.53,139.83L201.36,130.26L206.82,126.21L207.67,129.85L210.7,130.53L212.75,128.66L216.65,131.3L215.73,128.36L219.65,128.17L218.64,125.19L220.97,119.22L225.44,119.66L229.94,117.1L227.99,111.95L233.29,112.47L236.87,115.87L241.11,109.79L243.46,112.28L245.89,111.43L246.97,113.85L248.9,112.58L248.9,112.58L248.9,113.67L248.9,113.67L253.07,113.81L252.82,118.18L264.79,119.71L265.51,118.05L268.25,117.86L268,120.32L270.4,122.93L272.31,122.49L271.81,120.63L274.99,121.02L276.54,118.8L281.26,119.95L283.59,118.33L281.77,124.16L283.61,128L291.97,129.09L291.8,130.91L297.28,128.99L306.5,130.19L306.5,130.19L309.92,131.72L310.2,137.52L314.39,148.4L316.29,149.77L317.12,147.67L321.42,147.28L325.26,150.54L325.1,152.36L329.03,151.59L330.46,155.3L339.59,154.53L342.29,162.19L339.52,163.57L339.81,165.98L342.97,166.72L343.06,169.12L343.06,169.12L342.74,169.12L342.74,169.12L344.22,174.33L344.22,174.33L340,177.45L340,177.45L339.55,177.3L339.55,177.3L338.44,178.99L336.55,178.45L337.62,185.91L339.89,187.61L338.28,191.03L339.29,194.22L331.64,190.74L332.99,193.78L330.02,196.21L324.9,195.22L329.03,203.76L326.54,203.55L323.63,208.4L328.52,213.06L328.06,215.08L329.67,215.01L328.19,216.77L329.8,219.44L324.65,217.65L325.23,222.74L323.06,222.91L320.2,227.51L323.41,230.05L319.93,233.22L319.93,233.22L319.12,233.23L319.12,233.23L319.08,237.4L317.38,237.16L321.79,238.91L317.09,245.26L313.94,245.28L315.45,247L315.45,247L315.8,247.57L315.8,247.57L315.44,250.26L315.44,250.26L310.56,253.49L311.19,255.73L309.96,254.03L300.57,256.7L300.57,256.7L295.86,254.36L296.24,252.45L292.97,249.99L292.39,253.35L282.75,256.67L280.38,250.25L278.19,250.03L278.41,247.19L276.8,247.82L276.3,244.99L272.87,243.24L270.88,243.79L268.61,240.2L266.59,239.65L264.98,242.45L260.36,243.07L259.12,235.81L252.6,241.92L249.15,241.73L248.66,239.55L242.33,238.08L242.52,234.72L235.95,235.66L236.43,232.19L235.11,233.28L233.14,230.33L231.95,231.34L229.1,225.72L226.8,226.27L224.02,224.11L222.64,226.43L222.23,224.13L217.07,229.75L217.24,224.99L214.1,224.56L214.19,218.93L210.96,219.36L207.56,222.61L204.38,221.75L205.34,217.03L200.29,214.23L200.62,211.31L206.4,210.99L207.3,196.93L199.82,191.36L195.01,192.27L194.11,190.09L195.59,187.93L195.59,187.93L195.89,187.87L195.89,187.87L195.45,181.95L197.8,180.51L197.15,176.55L199.54,175.35L196.32,174.04L196.96,169.35L195.32,167.87L200.83,166.61L202.31,162.52L196.27,154.45L192.78,153.28L191.88,154.72L190.69,151.26z",
    center: [272.2, 186.2],
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
    pathData: "M224.52,368.97L227.62,370.53L225.77,375.91L229.74,377.42L246.46,370.58L246.46,370.58L255.35,374.51L265.09,375.94L266.58,378.72L268.42,374.19L270.16,373.96L272.31,379.42L277.31,382.27L277.31,382.27L279.14,385.57L276.71,386.81L276.78,389.73L274.45,391.39L276.21,395.13L274.88,400.61L271.61,403.2L270.87,406.27L267.89,407.01L272.2,412.2L266.56,416.4L269.28,423.89L273.39,425.67L273.69,430.95L263.25,431.42L266.1,439.57L259.87,437.21L260.39,441.44L258.93,443.47L260.75,446.34L258.54,449.42L261.47,452.55L260.73,457.17L262.46,457.44L262.75,459.77L258.23,458.79L251.11,462.91L251.53,464.69L251.53,464.69L251.91,464.66L251.91,464.66L244.09,466.01L243.43,467.41L242.87,466.04L240.47,466.63L241.13,472.86L238.75,477.1L238.75,477.1L236.93,479.67L239.37,479.88L239.42,482.84L236.94,481.57L228.69,485.9L226.16,482.28L223,481.38L219.46,473.25L215.29,472.75L211.8,468.19L221.9,463.69L222.29,460.87L219.87,458.87L221.54,454.84L219.44,452.8L217.57,452.14L217.63,454.71L213.09,458.01L205.86,457.16L202.48,459.37L199.19,456.4L197.13,458.16L197,452.09L192.95,452.92L187.89,448.63L188.05,446.58L184.37,447.04L182.33,444.75L174.06,443.48L170.21,440.71L170.21,440.71L172.39,437.51L172.39,437.51L172.67,437.32L172.67,437.32L178.73,438.82L179.51,431.59L183,425.37L190.62,424.22L190.03,418.28L191.43,417.43L189.22,415.16L193.48,412.12L191.16,409.6L193.03,407.36L196.85,408.34L195.69,402.11L199.09,400.97L199.89,398.33L197.15,397.24L198.12,394.82L201.71,396.3L201.93,390.77L206.95,390.38L205.61,388.74L208.7,388.46L207.09,386.38L207.37,381.81L211.12,379.62L208.97,372.68L212.16,371.3L212.76,369.21L216.52,371.98z",
    center: [227.8, 427.4],
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
    pathData: "M384.93,353.46L390.36,354.3L389.05,357.2L391.67,359.06L392.58,364.71L395.77,363.73L401.42,368.62L400.71,373.05L402.65,370.87L411.15,375.33L411.22,373.75L413.23,374.53L413.46,371.06L416.62,373.57L418.9,371.44L419.71,373.51L423.39,372.29L424.87,366.77L427.1,369.44L425.35,372.6L429.8,375.04L429.13,379.73L441.29,379.29L443.19,383.61L448.12,386.33L451.26,383.94L450.96,381.99L453.05,382.93L458.32,381.36L457.19,380.28L461.07,380.12L463.07,383.64L465.89,383.88L469.08,381.04L469.08,381.04L471.24,402.97L472.83,405.9L472.83,405.9L467.93,422.15L466.02,421.11L460.93,425.3L456.42,433.96L447.26,436.43L447.1,439.75L438.97,443.05L433.33,449.12L433.33,449.12L432.83,449.48L432.83,449.48L432.58,449.51L432.58,449.51L430.6,451.88L428.03,449.53L423.38,453.17L413.33,454.19L409.8,457.35L406.98,455.81L400.15,463.2L384.25,465.08L383.97,463.42L381.77,463.16L383.14,460.6L379.69,457.33L381.26,455.31L377.03,452.24L376.85,449.69L379.53,448.5L375.45,442.02L375.42,438.63L358.04,433.84L355.72,435.23L355.72,435.23L353.42,434.49L352.72,431.9L345.82,430.47L350.17,424.17L353.44,424L354.08,421.03L349.95,420.4L349.79,418.16L351.52,417.05L349.44,415.32L342.3,414.51L340.87,410.53L343.76,411.31L346.44,405.33L348.67,406.27L348.89,404.83L343.61,400.76L343.61,400.76L346.05,397.4L346.05,397.4L345.97,397.16L345.97,397.16L347.01,397.04L347.01,397.04L347.48,396.69L347.48,396.69L348.51,395.61L348.51,395.61L348.6,395.62L348.6,395.62L349.45,394.22L349.45,394.22L349.45,393.25L349.45,393.25L348.57,388.91L351.47,381.84L356.72,387.98L360.92,390.15L362.71,380.92L358.04,379.46L357.94,373.37L360.46,371.05L359.15,367.99L362.02,366.75L368.14,369.19L369.73,367.47L373.43,367.82L374.87,366.83L373.5,362.83L374.59,362.49L377.27,364.24L378.99,362.61L381.37,364.62L382.74,361.43L381.45,357.44L384.07,356.47z",
    center: [392.5, 402.2],
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
    pathData: "M349.54,42.09L397.31,49.55L447.16,54.74L529.02,49.56L529.02,49.56L530.16,51.83L528.27,57.07L523.66,58.83L520,58.04L519.04,60.02L512.56,62.04L509.92,66.41L514.58,72.33L517.33,71.84L519.93,76.82L518.46,81.22L521.86,83.36L528.8,94.94L529.53,100.02L525.66,104.54L524.75,110.05L521.06,112.93L521.06,112.93L520.29,113.33L520.29,113.33L519.23,112.63L517.93,116.52L516.57,114.79L512.27,118.54L509.03,118.71L509.59,122.01L506.65,120.2L502.73,122.83L482.63,139.05L480.31,136.64L476.28,137.97L472.44,143.16L461.82,139.6L457.05,140.89L457.05,140.89L456.33,140.85L456.33,140.85L447.34,142.4L447.04,144.78L441.91,146.9L436.57,145.86L423.09,155.74L419.66,152.82L415.85,153.17L414.23,154.47L415.22,157.26L412.04,157.03L410.72,160.08L402.65,158.06L398.89,164.28L392.57,166.96L386.63,164.84L381.79,168.59L382.45,173.28L378.11,175.85L369.59,174.07L367.4,175.14L364.98,172.91L357.74,174.87L353.57,172.1L354.12,168.65L354.12,168.65L353.84,168.1L353.84,168.1L348.73,171.12L349.39,175.11L344.22,174.33L344.22,174.33L342.74,169.12L342.74,169.12L343.06,169.12L343.06,169.12L342.97,166.72L339.81,165.98L339.52,163.57L342.29,162.19L339.59,154.53L330.46,155.3L329.03,151.59L325.1,152.36L325.26,150.54L321.42,147.28L317.12,147.67L316.29,149.77L314.39,148.4L310.2,137.52L309.92,131.72L306.5,130.19L306.5,130.19L306.06,127.26L308.98,123.87L311.27,123.72L311.43,118.55L316.14,113.51L317.13,106.9L319.33,105.69L324.99,107.16L327.13,110.36L328.2,107.41L326.94,106.34L330.98,99.24L330.98,99.24L330.98,98.91L330.98,98.91L333.96,91.38L322.89,93.79L321.41,90.61L323.03,87.54L317.72,84.79L315.78,85.73L314.63,83.89L315.77,82.15L311.32,80.12L314.38,71.34L313.07,69.14L317.47,65.51L313.77,58.93L313.77,58.93L320.71,59.96L322.43,58L319.74,64.09L320.79,64.66L322.03,60.11L328.05,54.14L338.74,50.42L343.43,42.43z",
    center: [395.2, 119.2],
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
    pathData: "M533.71,44.88L542.51,47.58L541.5,49.73L545.56,51.62L544.44,54.51L547.42,56.32L550.69,54.64L556.19,60.37L562.48,61.36L571.59,71.68L574.13,80.71L573.93,84.28L571.31,87.58L573.38,91.81L573.88,101.73L575.59,102.84L575.39,111.29L577.42,114.01L582.17,136.83L590.71,162.2L597.88,173.89L595.1,181.63L599.62,193.96L597.8,196.08L599.14,218.74L586.72,229.34L580.84,229.37L570.73,234.7L563.75,242.97L552.88,261.59L552.88,261.59L550.02,261.42L550.02,261.42L548.75,259.77L545.21,261.4L544.69,257.41L541.62,256.74L538.84,252.96L532.64,254.14L526.69,251.6L525.29,253.48L523.9,250.78L516.18,250.7L513.9,247.69L514.58,243.62L512.04,241.8L512.98,237.83L508.76,231.45L504.83,228.71L509.12,224.22L508.56,210.71L504.26,209.9L504.39,211.52L501.11,213.68L500.29,211.5L498.08,211.71L495.86,205.81L498.71,205.75L499.57,203.91L497.67,204.32L497.17,200.71L494.14,200.58L493.88,203.44L483.17,204.23L480.4,197.86L482.52,195.72L480.23,193.44L480.23,193.44L480.75,193.44L480.75,193.44L473.51,188.71L474.59,185.09L477.16,185.8L476.08,184.09L476.08,184.09L477.17,182.5L477.17,182.5L472.73,183.57L469.1,178.1L464.59,178.65L462.28,175.87L462.87,173.08L460.66,168.65L461.79,167.95L457.92,162.77L459.98,163.14L459.02,160.78L460.59,157.59L460.59,157.59L460.55,158L460.55,158L464.71,158.07L462,155.67L459.62,156.05L461.51,152.41L457.99,148.19L458.81,146.34L456.21,142.35L456.21,142.35L456.67,142.35L456.67,142.35L456.33,140.85L456.33,140.85L457.05,140.89L457.05,140.89L461.82,139.6L472.44,143.16L476.28,137.97L480.31,136.64L482.63,139.05L502.73,122.83L506.65,120.2L509.59,122.01L509.03,118.71L512.27,118.54L516.57,114.79L517.93,116.52L519.23,112.63L520.29,113.33L520.29,113.33L521.06,112.93L521.06,112.93L524.75,110.05L525.66,104.54L529.53,100.02L528.8,94.94L521.86,83.36L518.46,81.22L519.93,76.82L517.33,71.84L514.58,72.33L509.92,66.41L512.56,62.04L519.04,60.02L520,58.04L523.66,58.83L528.27,57.07L530.16,51.83L529.02,49.56L529.02,49.56L531.88,45.14z",
    center: [512.4, 155.9],
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
    pathData: "M29.16,229.35L29.09,225.76L31.18,223.99L35.89,226.55L38.16,225.12L41.41,213.59L45.39,210.39L44.6,207.38L48.49,206.17L46.44,204.26L48.47,201.51L53.75,205.88L56.31,204.08L58.52,206.61L73.47,200.23L71.31,193.75L75.86,194.76L79.19,190.97L87.37,188.15L93.07,191.33L95.7,189.11L98.11,190.33L100.4,189.05L99.42,186.97L102.67,185.66L100.99,183.51L103.5,183L102.97,181.04L106.06,179.67L105.64,177.31L113.76,179.25L112.26,185.59L112.26,185.59L111.66,189.75L111.66,189.75L111.66,190.09L111.66,190.09L112.13,193.17L112.13,193.17L112.3,193.29L112.3,193.29L113.09,204.03L108.82,206.09L108,208.56L110.6,209.69L111.24,216.88L102.57,218.9L103.73,222.3L101.48,229.05L105.75,235.19L104.32,237.67L107.53,240.87L108.56,245.22L105.46,247.21L104.07,244.5L103.29,246.25L108.84,251.03L105.88,263.87L107.41,275.41L105.56,278.82L109.83,283.3L111.11,281.59L113.36,282.63L113.89,284.9L112.06,287.46L115.71,292.3L122.12,290.45L123,297.13L120.79,300.25L124.47,300.45L126.86,302.61L129.61,299.1L132.61,299.9L138.07,304.5L140.28,311.05L140.28,311.05L137.72,313.68L137.1,317.62L131.25,323.05L127.76,318.04L124.44,318.25L125.4,313.01L122.71,313.55L116.84,311.33L116.48,309.2L113.81,309.12L112.59,310.67L115.12,311.87L112.64,312.6L113.4,314.91L106.69,317.22L106.56,320.21L103.6,322.34L105.83,323.45L103.76,331.77L97.35,333.74L97.09,337.24L90.25,344.21L89.83,341.94L83.46,336.32L83.13,337.66L77.81,336.05L76.13,338.84L76.79,341.92L74.56,341.86L73.9,347.82L64.94,342.45L58.99,346.04L58.18,348.99L54.58,349.39L54.29,352.28L51.93,352.21L51.93,352.21L50.57,341.88L37.05,335.91L35.93,332.84L39.19,328.44L38.73,323.26L33.34,316.81L31.94,309.95L28.59,307.43L29.75,304.04L34.91,299.49L36.09,289.48L38.82,283.38L34.1,278.23L36.06,266.29L28.65,262.56L25.1,250.5L26.01,246.67L31.27,240.53L29.36,236.65L31.44,232.8z",
    center: [86.9, 265.2],
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

export const NATIONAL_ASSETS_PORTFOLIO_STATS: NationalAssetsPortfolioStats = {
  totalPortfolioValueMldPln: 384.5,
  portfolioValueGrowthYoYMldPln: 14.2,
  totalWorkforceCount: 412850,
  annualAggregateRevenueMldPln: 482.6,
  projectedDividends2026MldPln: 18.4,
  realizedDividends2026MldPln: 8.65,
  totalEntitiesCount: 406,
  listedStrategicEntitiesCount: 21,
  lastSyncTimestamp: "2026-10-20T23:55:00.000Z",
};

export const CRITICAL_INFRASTRUCTURE_SECTORS: CriticalInfrastructureSector[] = [
  {
    id: "crit-energy",
    sectorName: "Energetyka i Paliwa Płynne",
    alertLevel: "CHARLIE_CRP",
    strategicEntities: ["PSE S.A.", "PERN S.A.", "Gaz-System S.A.", "ORLEN S.A. (Rafineria Gdańska)", "PGE Górnictwo i Energetyka Konwencjonalna"],
    operationalContinuityPercent: 99.98,
    cyberAttacksBlocked24h: 1420,
    leadAgency: "ABW / CSIRT GOV / Pełnomocnik ds. Strategicznej Infrastruktury",
    threatSummary: "Zwiększona aktywność obcych dronów rozpoznawczych w rejonie terminali naftowych w Gdańsku oraz prewencyjne wzmocnienie stacji redukcyjnych gazu.",
  },
  {
    id: "crit-transport",
    sectorName: "Logistyka, Szlaki Kolejowe i Porty",
    alertLevel: "CHARLIE_CRP",
    strategicEntities: ["PKP Polskie Linie Kolejowe S.A.", "Zarząd Morskiego Portu Gdańsk", "Zarząd Morskiego Portu Gdynia", "CPK Sp. z o.o."],
    operationalContinuityPercent: 99.4,
    cyberAttacksBlocked24h: 890,
    leadAgency: "Straż Ochrony Kolei / Straż Graniczna / Dowództwo Operacyjne",
    threatSummary: "Ochrona korytarzy transportowych pomocowych (Via Baltica, linie magistralne E20 i LK8) oraz wzmożony nadzór nad nabrzeżami masowymi w portach.",
  },
  {
    id: "crit-cyber",
    sectorName: "Łączność Specjalna i Bezpieczeństwo IT",
    alertLevel: "CHARLIE_CRP",
    strategicEntities: ["Exatel S.A.", "Polska Wytwórnia Papierów Wartościowych S.A.", "Centralny Ośrodek Informatyki"],
    operationalContinuityPercent: 100.0,
    cyberAttacksBlocked24h: 3640,
    leadAgency: "NASK / CSIRT GOV / ABW Departament Bezpieczeństwa Teleinformatycznego",
    threatSummary: "Trwające ataki DDoS typu distributed amplification na rządową sieć łączności OST-11 oraz próby phishingu ukierunkowane na zarządy spółek kluczowych.",
  },
  {
    id: "crit-finance",
    sectorName: "System Bankowy i Rezerwy Płatnicze",
    alertLevel: "BRAVO_CRP",
    strategicEntities: ["PKO Bank Polski S.A.", "Bank Gospodarstwa Krajowego", "Krajowy Depozyt Papierów Wartościowych"],
    operationalContinuityPercent: 100.0,
    cyberAttacksBlocked24h: 420,
    leadAgency: "Komisja Nadzoru Finansowego / NBP / CSIRT KNF",
    threatSummary: "Pełna zgodność z unijnym rozporządzeniem DORA, redundancja węzłów rozliczeniowych Elixir i Swift, brak zakłóceń płynnościowych.",
  },
];

export const AGM_VOTING_TEMPLATES: AgmVotingInstructionTemplate[] = [
  {
    id: "wz-orlen-1",
    entityName: "ORLEN S.A.",
    ticker: "PKN",
    meetingType: "ZWZ",
    agendaItem: "Udzielenie absolutorium członkom Zarządu i Rady Nadzorczej za 2025 r.",
    recommendedVote: "PRZECIW",
    statutoryBasis: "Art. 7 ust. 2 i 3 ustawy z dnia 16 grudnia 2016 r. o zasadach zarządzania mieniem państwowym (Dz.U. z 2024 r. poz. 125)",
    ministerJustification: "Negatywna ocena wykonania obowiązków wynikająca z audytu rozliczeń spółki OTS w Szwajcarii (odpisy na 1,6 mld PLN) oraz toczących się postępowań prokuratorskich.",
    redLineConstraint: "Bezwzględny zakaz poparcia absolutorium dla byłego prezesa i wiceprezesów ds. handlu. Dopuszczalne wstrzymanie się jedynie przy członkach rady nadzorczej powołanych w ostatnich 3 miesiącach kadencji.",
  },
  {
    id: "wz-pko-1",
    entityName: "PKO Bank Polski S.A.",
    ticker: "PKOBP",
    meetingType: "ZWZ",
    agendaItem: "Podział zysku netto i wypłata dywidendy dla akcjonariuszy",
    recommendedVote: "ZA",
    statutoryBasis: "Uchwała Rady Ministrów ws. wytycznych dla spółek z udziałem SP w zakresie polityki dywidendowej",
    ministerJustification: "Bank spełnia z nadwyżką wymogi kapitałowe KNF (TCR i Tier 1) oraz wygenerował rekordowy zysk netto. Rekomendacja przeznaczenia 75% zysku na dywidendę, z czego 3,2 mld PLN zasili dochody budżetu państwa.",
    redLineConstraint: "Nie dopuszczać do obniżenia stopy wypłaty dywidendy poniżej 65% zysku netto bez uprzedniej pisemnej zgody Ministra Aktywów Państwowych.",
  },
  {
    id: "wz-cargo-1",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    ticker: "PKPCARGO",
    meetingType: "NWZ",
    agendaItem: "Podwyższenie kapitału zakładowego i emisja warrantów subskrypcyjnych w toku sanacji",
    recommendedVote: "ZA",
    statutoryBasis: "Art. 7 ust. 1 ustawy o zasadach zarządzania mieniem państwowym w zw. z przepisami Prawa restrukturyzacyjnego",
    ministerJustification: "Konieczność dokapitalizowania przewoźnika w celu uniknięcia upadłości likwidacyjnej i zabezpieczenia taboru o znaczeniu obronnym (przewozy wojskowe NATO).",
    redLineConstraint: "Warunkiem koniecznym poparcia uchwały jest zachowanie przez Skarb Państwa (bezpośrednio i przez PKP S.A.) pakietu kontrolnego powyżej 33% głosów na WZ.",
  },
  {
    id: "wz-azoty-1",
    entityName: "Grupa Azoty S.A.",
    ticker: "ATT",
    meetingType: "NWZ",
    agendaItem: "Zgoda na zbycie istotnych aktywów nieoperacyjnych i restrukturyzację długu wobec konsorcjum banków",
    recommendedVote: "ZA",
    statutoryBasis: "Art. 13 ust. 1 pkt 2 ustawy o zasadach zarządzania mieniem państwowym",
    ministerJustification: "Warunek zawieszający podpisanie umowy standstill z 13 bankami wierzycielami. Pozwala uniknąć natychmiastowego postawienia w stan wymagalności 10 mld PLN zadłużenia.",
    redLineConstraint: "Zbycie może dotyczyć wyłącznie aktywów niemających statusu instalacji o znaczeniu strategicznym dla bezpieczeństwa żywnościowego kraju (zakaz sprzedaży kluczowych linii produkcji amoniaku i mocznika).",
  },
];

export const STRATEGIC_RESERVE_INDICATORS: StrategicReserveIndicator[] = [
  {
    id: "res-fuel",
    resourceName: "Ropa i Paliwa Płynne (Zapasy Interwencyjne)",
    category: "PALIWA_ROPA",
    currentLevelValue: 94,
    unit: "dni rezerw",
    mandatoryMinimumValue: 90,
    status: "BEZPIECZNY",
    supervisingEntity: "PERN S.A. / RARS",
    diagnosis: "Zapasy obowiązkowe w kawernach IKS Solino oraz bazach PERN zabezpieczają 94 dni średniej konsumpcji krajowej. Zdolność rozładunkowa Naftoportu w Gdańsku (36 mln ton/rok) pokrywa 100% popytu rafinerii w Płocku i Gdańsku.",
  },
  {
    id: "res-gas",
    resourceName: "Gaz Ziemny w Magazynach Podziemnych (PMG)",
    category: "GAZ_ZIEMNY",
    currentLevelValue: 100,
    unit: "% napełnienia",
    mandatoryMinimumValue: 80,
    status: "BEZPIECZNY",
    supervisingEntity: "Gaz-System S.A. / Gas Storage Poland",
    diagnosis: "Wszystkie 7 podziemnych magazynów gazu napełnione w 100% (3,25 mld m³ gazu wysokometanowego). Terminal LNG w Świnoujściu oraz gazociąg Baltic Pipe pracują z pełną stabilnością operacyjną.",
  },
  {
    id: "res-coal",
    resourceName: "Węgiel Energetyczny przy Blokach Systemowych",
    category: "WEGIEL_ENERGETYCZNY",
    currentLevelValue: 4.8,
    unit: "mln ton",
    mandatoryMinimumValue: 3.2,
    status: "BEZPIECZNY",
    supervisingEntity: "PGE Górnictwo / Enea / Tauron",
    diagnosis: "Zapasy przy elektrowniach systemowych (Kozienice, Połaniec, Opole, Bełchatów) gwarantują 42 dni nieprzerwanej pracy bloków w reżimie zimowym. Nadpodaż węgla na zwałach kopalń PGG wymaga koordynacji odbiorów.",
  },
  {
    id: "res-fert",
    resourceName: "Amoniak i Nawozy Azotowe (Bezpieczeństwo Rolne)",
    category: "AMONIAK_NAWOZY",
    currentLevelValue: 68,
    unit: "% mocy wytwórczych",
    mandatoryMinimumValue: 75,
    status: "OSTRZEGAWCZY",
    supervisingEntity: "Grupa Azoty S.A. (Puławy, Police, Kędzierzyn)",
    diagnosis: "Instalacje nawozowe pracują na 68% mocy z powodu napływu taniego mocznika i saletry z Rosji i Białorusi przez państwa trzecie. Wymagana interwencja MAP i Ministerstwa Rolnictwa w Brukseli ws. ceł ochronnych.",
  },
  {
    id: "res-med",
    resourceName: "Rezerwy Krytyczne i Agregaty Mobilne RARS",
    category: "REZERWY_MEDYCZNE_RARS",
    currentLevelValue: 100,
    unit: "% gotowości operacyjnej",
    mandatoryMinimumValue: 90,
    status: "BEZPIECZNY",
    supervisingEntity: "Rządowa Agencja Rezerw Strategicznych",
    diagnosis: "Pełna dyspozycyjność mobilnych stacji transformatorowych, wielkich agregatów prądotwórczych dużej mocy oraz rezerw medycznych na wypadek blackoutów regionalnych.",
  },
];

export const FOREIGN_TAKEOVER_SHIELD_ENTITIES: ForeignTakeoverShieldEntity[] = [
  {
    id: "shield-orlen",
    entityName: "ORLEN S.A.",
    ticker: "PKN",
    stateSharePercent: 49.9,
    freeFloatPercent: 50.1,
    foreignCapitalSharePercent: 28.4,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: true,
    lastTransactionNotice: "Wykryto skoordynowane transakcje pakietowe na GPW (pakiet 4,8% akcji) przez dwa fundusze zarejestrowane na Cyprze bez powiadomienia KNF i MAP. Wszczęto postępowanie wyjaśniające z ABW.",
    ministerialVetoAvailable: true,
  },
  {
    id: "shield-azoty",
    entityName: "Grupa Azoty S.A.",
    ticker: "ATT",
    stateSharePercent: 33.0,
    freeFloatPercent: 47.2,
    foreignCapitalSharePercent: 19.8,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: false,
    lastTransactionNotice: "Akcje objęte zarządem przymusowym (pakiet 19,8% rosyjskiego Acronu/Wiaczesława Kantora). Wprowadzono pełną blokadę wykonywania prawa głosu na WZ z rygorem natychmiastowej wykonalności.",
    ministerialVetoAvailable: true,
  },
  {
    id: "shield-kghm",
    entityName: "KGHM Polska Miedź S.A.",
    ticker: "KGHM",
    stateSharePercent: 31.79,
    freeFloatPercent: 68.21,
    foreignCapitalSharePercent: 34.2,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: false,
    lastTransactionNotice: "Rozproszony akcjonariat globalnych funduszy emerytalnych (BlackRock, Vanguard). Brak koncentracji kapitałowej powyżej 5% głosów. Pełna kontrola operacyjna przez Skarb Państwa.",
    ministerialVetoAvailable: true,
  },
  {
    id: "shield-pse",
    entityName: "Polskie Sieci Elektroenergetyczne S.A.",
    ticker: "PSE",
    stateSharePercent: 100.0,
    freeFloatPercent: 0.0,
    foreignCapitalSharePercent: 0.0,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: false,
    lastTransactionNotice: "Operator systemu przesyłowego w 100% kontrolowany przez Skarb Państwa. Ustawowy zakaz jakiejkolwiek prywatyzacji i zbywania akcji.",
    ministerialVetoAvailable: true,
  },
  {
    id: "shield-pern",
    entityName: "PERN S.A.",
    ticker: "PERN",
    stateSharePercent: 100.0,
    freeFloatPercent: 0.0,
    foreignCapitalSharePercent: 0.0,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: false,
    lastTransactionNotice: "Operator rurociągów naftowych i baz magazynowych paliw w 100% państwowy. Zabezpieczenie fizyczne i antyterrorystyczne w reżimie obiektów szczególnej ochrony.",
    ministerialVetoAvailable: true,
  },
  {
    id: "shield-pko",
    entityName: "PKO Bank Polski S.A.",
    ticker: "PKOBP",
    stateSharePercent: 29.43,
    freeFloatPercent: 70.57,
    foreignCapitalSharePercent: 38.6,
    isProtectedByAct: true,
    suspiciousAccumulationAlert: false,
    lastTransactionNotice: "Akcjonariat zdominowany przez krajowe OFE i fundusze powiernicze. Skarb Państwa dysponuje statutową większością na Walnym Zgromadzeniu (ograniczenie prawa głosu innych akcjonariuszy do 10%).",
    ministerialVetoAvailable: true,
  },
];

export const DEBT_STABILITY_RECORDS: DebtStabilityRecord[] = [
  {
    id: "debt-azoty",
    entityName: "Grupa Azoty S.A.",
    ticker: "ATT",
    netDebtMldPln: 9.8,
    ebitdaMldPln: -0.4,
    netDebtToEbitda: 24.5,
    covenantLimit: 3.5,
    isCovenantBreached: true,
    nearestMaturityDate: "2026-12-31",
    nearestMaturityAmountMlnPln: 1450,
    creditorConsortium: "PKO BP, Santander, Pekao S.A., EBI (łącznie 13 banków)",
    stabilizationRecommendation: "Obowiązujące porozumienie standstill. Wymagana restrukturyzacja długu projektu Polimery Police i refinansowanie obligacji podporządkowanych.",
  },
  {
    id: "debt-cargo",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    ticker: "PKPCARGO",
    netDebtMldPln: 5.2,
    ebitdaMldPln: 0.3,
    netDebtToEbitda: 17.3,
    covenantLimit: 3.5,
    isCovenantBreached: true,
    nearestMaturityDate: "2026-11-15",
    nearestMaturityAmountMlnPln: 380,
    creditorConsortium: "Pekao S.A., PKO BP, mBank, konsorcjum leasingowe",
    stabilizationRecommendation: "Ochrona sanacyjna przed egzekucją komorniczą na mocy postanowienia Sądu Rejonowego w Warszawie. Wdrożenie planu redukcji kosztów stałych.",
  },
  {
    id: "debt-jsw",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    ticker: "JSW",
    netDebtMldPln: 1.8,
    ebitdaMldPln: 0.9,
    netDebtToEbitda: 2.0,
    covenantLimit: 3.0,
    isCovenantBreached: false,
    nearestMaturityDate: "2027-03-31",
    nearestMaturityAmountMlnPln: 250,
    creditorConsortium: "PKO BP, BGK, PFR",
    stabilizationRecommendation: "Kowenanty bankowe formalnie bezpieczne, ale fundusz stabilizacyjny FIZ stopniał z 5 mld do 0,4 mld PLN. Wymagane natychmiastowe zamrożenie funduszu premiowego.",
  },
  {
    id: "debt-pge",
    entityName: "Polska Grupa Energetyczna S.A.",
    ticker: "PGE",
    netDebtMldPln: 18.2,
    ebitdaMldPln: 8.6,
    netDebtToEbitda: 2.12,
    covenantLimit: 3.5,
    isCovenantBreached: false,
    nearestMaturityDate: "2027-06-30",
    nearestMaturityAmountMlnPln: 2200,
    creditorConsortium: "Konsorcjum polskich banków i Europejski Bank Inwestycyjny",
    stabilizationRecommendation: "Obsługa zadłużenia w pełni stabilna. Potrzeba pozyskania finansowania projektowego typu non-recourse na budowę morskich farm wiatrowych Baltica.",
  },
  {
    id: "debt-orlen",
    entityName: "ORLEN S.A.",
    ticker: "PKN",
    netDebtMldPln: 24.5,
    ebitdaMldPln: 28.2,
    netDebtToEbitda: 0.87,
    covenantLimit: 3.0,
    isCovenantBreached: false,
    nearestMaturityDate: "2027-05-20",
    nearestMaturityAmountMlnPln: 3500,
    creditorConsortium: "Międzynarodowe konsorcjum Eurobonds i zielonych obligacji",
    stabilizationRecommendation: "Wzorcowy profil płynnościowy i dźwigni finansowej (Dług/EBITDA poniżej 1.0x). Najwyższy rating inwestycyjny w regionie (Fitch BBB+, Moody's Baa2).",
  },
  {
    id: "debt-tauron",
    entityName: "Tauron Polska Energia S.A.",
    ticker: "TPE",
    netDebtMldPln: 11.4,
    ebitdaMldPln: 4.8,
    netDebtToEbitda: 2.38,
    covenantLimit: 3.5,
    isCovenantBreached: false,
    nearestMaturityDate: "2027-04-15",
    nearestMaturityAmountMlnPln: 1100,
    creditorConsortium: "PKO BP, Pekao, BGK, EBI",
    stabilizationRecommendation: "Bezpieczny bufor kowenantowy. Kluczowe jest utrzymanie zysków segmentu Dystrybucja podlegającego taryfowaniu przez Prezesa URE.",
  },
];

export const MORNING_CABINET_BRIEFING: MorningCabinetBriefing = {
  id: "briefing-2026-10-21",
  briefingDate: "21 października 2026 r.",
  keyNumberValue: "384,5 mld PLN",
  keyNumberLabel: "Zagregowana wycena rynkowa i bilansowa portfela Skarbu Państwa (+14,2 mld r/r)",
  urgentDecisionToSign: "Podpisanie zgody właścicielskiej na przedłużenie umowy standstill Grupy Azoty z konsorcjum 13 banków wierzycieli do 31 grudnia 2026 r. (druk MAP-DK-88/2026).",
  audioDurationSeconds: 92,
  top3StrategicEvents: [
    {
      title: "Zabezpieczenie 100% przepustowości Baltic Pipe na sezon zimowy",
      entity: "ORLEN S.A. / Gaz-System S.A.",
      consequenceForMap: "Brak ryzyka braków gazowych; magazyny podziemne napełnione w 100% (3,25 mld m³). Wicepremier może potwierdzić bezpieczeństwo energetyczne na posiedzeniu rządu.",
    },
    {
      title: "Zawarcie porozumienia płacowego w KGHM bez ogłoszenia strajku",
      entity: "KGHM Polska Miedź S.A.",
      consequenceForMap: "Wynegocjowany wzrost stawek na poziomie +4,5% mieści się w założeniach budżetowych spółki. Zażegnano ryzyko blokady szybów wydobywczych w Zagłębiu Miedziowym.",
    },
    {
      title: "Wykrycie próby akumulacji 4,8% akcji Orlenu przez wehikuł cypryjski",
      entity: "ORLEN S.A. / GPW",
      consequenceForMap: "Transakcje skierowane do pilnej weryfikacji ABW na mocy art. 4 ustawy o kontroli niektórych inwestycji. Gotowy projekt decyzji o sprzeciwie Ministra w trybie natychmiastowym.",
    },
  ],
  transcriptText: "Dzień dobry, Panie Ministrze. Raport poranny MAPscope z 21 października 2026 roku. Poziom temperatury kryzysowej w portfelu wynosi 68 punktów – sytuacja jest pod kontrolą, z jednym kluczowym punktem decyzyjnym. Sprawa numer jeden: magazyny gazu ziemnego osiągnęły sto procent napełnienia, a przepustowość Baltic Pipe jest w pełni zakontraktowana, co zdejmuje presję w debacie sejmowej. Sprawa numer dwa: w KGHM podpisano porozumienie płacowe, strajk został zażegnany. Sprawa numer trzy: na giełdzie wykryto podejrzaną akumulację akcji Orlenu przez fundusz z Cypru – Departament Bezpieczeństwa przygotował już wniosek do ABW oraz projekt ministerialnego sprzeciwu. Przed godziną dziesiątą w KPRM konieczne jest złożenie podpisu pod zgodą na porozumienie standstill dla Grupy Azoty, co zabezpieczy spółkę przed roszczeniami banków na kwotę dziesięciu miliardów złotych. Miłego dnia.",
};




