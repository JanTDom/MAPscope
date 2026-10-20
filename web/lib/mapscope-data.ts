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
