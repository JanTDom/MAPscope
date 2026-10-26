import type {
  MapLeadershipMemberRecord,
  MapPressReleaseRecord,
  MapPressInquiryRecord,
  MapDirectCrisisRecord,
  MapZoneSummaryRecord,
} from "./types.ts";

export const MAP_LEADERSHIP: MapLeadershipMemberRecord[] = [
  {
    id: "lead-minister",
    name: "Wojciech Balczun",
    role: "MINISTER",
    title: "Minister Aktywów Państwowych",
    supervisedDepartments: [
      "Departament Spółek Strategicznych",
      "Departament Nadzoru I",
      "Biuro Ministra",
      "Gabinet Polityczny",
    ],
    assignedSectors: ["Spółki Strategiczne", "Paliwa i Energetyka", "Restrukturyzacja i Nadzór Właścicielski"],
    activeCrisesCount: 3,
    mediaSentimentScore: -0.18,
    currentKeyTopics: [
      "Strategiczna restrukturyzacja zadłużenia Grupy Azoty i projektów polimerowych",
      "Ochrona operacyjna i programy zatrudnieniowe dla PKP CARGO (b. Prezes Zarządu 2008-2013)",
      "Zwiększenie synergii inwestycyjnych i nadzór nad spółkami portfelowymi ARP oraz energetyki",
    ],
    lastMediaAppearance: {
      date: "2026-10-18",
      mediaOutlet: "TVN24 BiS / Rozmowa Dnia",
      topic: "Plan naprawczy dla przemysłu nawozowego i ochrona kowenantów bankowych",
      tone: "neutralny",
    },
  },
  {
    id: "lead-sec-zeidler",
    name: "Eliza Zeidler",
    role: "SEKRETARZ_STANU",
    title: "Sekretarz Stanu w MAP",
    supervisedDepartments: [
      "Departament Nadzoru II",
      "Departament Prawny",
      "Wydział Kontroli i Audytu",
    ],
    assignedSectors: ["Ład Korporacyjny", "Prawo Gospodarcze", "Międzynarodowa Polityka Gospodarcza", "KGHM"],
    activeCrisesCount: 2,
    mediaSentimentScore: -0.25,
    currentKeyTopics: [
      "Wdrożenie rygorystycznego kodeksu etyki i transparentnych konkursów w spółkach Skarbu Państwa",
      "Ujednolicenie procedur prawnych w grupach kapitałowych i nadzór nad spółkami zależnymi",
      "Koordynacja międzynarodowych projektów gospodarczych MAP",
    ],
    lastMediaAppearance: {
      date: "2026-10-19",
      mediaOutlet: "Rzeczpospolita",
      topic: "Nowe standardy doboru kadr i wzmocnienie rad nadzorczych w spółkach państwowych",
      tone: "trudny",
    },
  },
  {
    id: "lead-und-golota",
    name: "Konrad Gołota",
    role: "PODSEKRETARZ_STANU",
    title: "Podsekretarz Stanu w MAP",
    supervisedDepartments: [
      "Departament Projektów Strategicznych",
      "Biuro Współpracy Międzynarodowej",
      "Zespół Dialogu z Rynkiem",
    ],
    assignedSectors: ["Dyplomacja Gospodarcza", "Dialog z Rynkiem Kapitałowym", "Projekty Unijne i Partnerstwa"],
    activeCrisesCount: 1,
    mediaSentimentScore: 0.15,
    currentKeyTopics: [
      "Rozmowy z Komisją Europejską ws. notyfikacji pomocy publicznej dla sektora energetycznego",
      "Pozyskiwanie zagranicznych partnerów technologicznych dla transformacji cyfrowej i przemysłowej",
      "Koordynacja dialogu z inwestorami instytucjonalnymi i bankami wierzycielskimi",
    ],
    lastMediaAppearance: {
      date: "2026-10-15",
      mediaOutlet: "PAP Biznes / Bruksela",
      topic: "Notyfikacja mechanizmów osłonowych dla polskiego przemysłu w Komisji Europejskiej",
      tone: "pozytywny",
    },
  },
  {
    id: "lead-und-wrona",
    name: "Grzegorz Wrona",
    role: "PODSEKRETARZ_STANU",
    title: "Podsekretarz Stanu w MAP",
    supervisedDepartments: [
      "Departament Spółek Infrastrukturalnych",
      "Departament Energetyki i Paliw",
      "Departament Gospodarki Nieruchomościami",
    ],
    assignedSectors: ["Energetyka (b. Wiceprezes Tauron Wytwarzanie)", "Infrastruktura i Transport", "Kolej i Poczta"],
    activeCrisesCount: 3,
    mediaSentimentScore: -0.32,
    currentKeyTopics: [
      "Koordynacja procesu sanacji PKP CARGO oraz programów outplacementowych dla załogi",
      "Stabilizacja finansowa i operacyjna Poczty Polskiej po uruchomieniu rekompensaty",
      "Inwestycje sieciowe i transformacja konwencjonalnych bloków energetycznych",
    ],
    lastMediaAppearance: {
      date: "2026-10-20",
      mediaOutlet: "Polsat News",
      topic: "Sytuacja w PKP CARGO oraz porozumienia zatrudnieniowe z przewoźnikami kolejowymi",
      tone: "trudny",
    },
  },
  {
    id: "lead-dir-ciszak",
    name: "Przemysław Ciszak",
    role: "DYREKTOR_GENERALNY",
    title: "Dyrektor Generalny MAP",
    supervisedDepartments: [
      "Biuro Dyrektora Generalnego",
      "Biuro Budżetowo-Finansowe",
      "Biuro Bezpieczeństwa i Ochrony Informacji Niejawnych",
    ],
    assignedSectors: ["Zarządzanie Gmachem (ul. Krucza 36)", "Budżet i Logistyka Resortu", "Regulacja Rynków"],
    activeCrisesCount: 1,
    mediaSentimentScore: 0.05,
    currentKeyTopics: [
      "Zabezpieczenie ciągłości działania urzędu podczas protestów i zgromadzeń publicznych",
      "Optymalizacja wydatków administracyjnych i zamówień publicznych ministerstwa",
      "Nadzór nad procedurami dostępu do informacji niejawnych i audytem wewnętrznym",
    ],
  },
  {
    id: "lead-spokesperson",
    name: "Biuro Komunikacji i Promocji MAP",
    role: "RZECZNIK_PRASOWY",
    title: "Rzecznik Prasowy Ministerstwa Aktywów Państwowych",
    supervisedDepartments: [
      "Wydział Prasowy",
      "Wydział Komunikacji Społecznej i Social Media",
    ],
    assignedSectors: ["Bieżąca Komunikacja Kryzysowa", "Serwis gov.pl", "Oficjalne Sprostowania Prasowe"],
    activeCrisesCount: 4,
    mediaSentimentScore: -0.15,
    currentKeyTopics: [
      "Autoryzacja odpowiedzi na zapytania redakcyjne TVN24, Business Insider, Rzeczpospolita",
      "Organizacja cotygodniowych briefingów prasowych kierownictwa resortu",
      "Publikacja oficjalnych sprostowań w trybie art. 31a Prawa prasowego",
    ],
  },
];

export const MAP_DIRECT_CRISES: MapDirectCrisisRecord[] = [
  {
    id: "cris-map-krucza-protest",
    title: "Przebieg i realizacja ustaleń po demonstracji związkowej przed gmachem MAP (ul. Krucza 36)",
    severity: "KRYTYCZNE",
    category: "PROTESTY_SPOŁECZNE",
    dateIso: "2026-10-23",
    temporalStatus: "ODBYŁO_SIĘ",
    incidentDate: "2026-10-23 (odbyła się 3 dni temu — petycja przyjęta)",
    affectedLeadership: ["Wojciech Balczun (Minister)", "Grzegorz Wrona (Wiceminister)"],
    summary:
      "Zgromadzenie publiczne 2 500 pracowników PKP CARGO oraz Poczty Polskiej odbyło się w piątek 23.10 przed gmachem MAP przy ul. Kruczej 36. Wydarzenie przebiegło bez incydentów naruszenia bezpieczeństwa; petycja strony społecznej została formalnie odebrana.",
    oppositionAttackVector:
      "Politycy opozycji podnosili w mediach żądania wyjścia kierownictwa resortu do protestujących oraz zarzuty 'likwidacji polskiej kolei przez b. prezesa PKP Cargo'.",
    ministerialCounterNarrative:
      "Minister Wojciech Balczun, który z sukcesem zrestrukturyzował PKP Cargo w latach 2008-2013, doskonale zna wyzwania branży: MAP wyznaczyło zespół kierowniczy na czele z wiceministrem Grzegorzem Wroną, który przyjął delegację związkową w sali konferencyjnej resortu. Sanacja ratuje spółkę przed twardą upadłością likwidacyjną, a 12 innych spółek kolejowych zagwarantowało już zatrudnienie ponad 1 800 odchodzącym pracownikom.",
    streetProtestThreat: true,
    isLiveProtestToday: false,
    postCrisisResolution:
      "Zgromadzenie zakończone. Petycja zarejestrowana w Biurze Ministra; Departament Spółek Strategicznych wdrożył cotygodniowy monitoring realizacji transferów pracowniczych do Polregio, PKP Intercity i Wars.",
    protestDetails: {
      location: "Warszawa, ul. Krucza 36 (plac przed Ministerstwem)",
      registeredParticipants: 2500,
      organizer: "Komitet Protestacyjny NSZZ Solidarność i Federacji ZZK",
      policeCoordination: true,
    },
    parliamentaryControlActive: false,
    actionItemsForCabinet: [
      "Realizacja ustaleń ze spotkania z delegacją związkową w sali konferencyjnej MAP",
      "Publikacja infografiki dla mediów: 'Fakty o porozumieniach zatrudnieniowych dla kolejarzy'",
      "Podsumowanie operacyjne ze Służbą Ochrony Państwa — plac przed gmachem zabezpieczony",
    ],
  },
  {
    id: "cris-map-totalizator-kontrol",
    title: "Kontrola poselska i audyt procedur rekrutacyjnych w Totalizatorze Sportowym",
    severity: "WYSOKIE",
    category: "KONTROLA_SEJMOWA",
    dateIso: "2026-10-17",
    temporalStatus: "W_TOKU",
    incidentDate: "2026-10-17 — w toku (audyt i udostępnianie dokumentów)",
    affectedLeadership: ["Eliza Zeidler (Sekretarz Stanu)", "Wojciech Balczun (Minister)"],
    summary:
      "Czynności kontrolne w Departamencie Nadzoru II w MAP. Resort udostępnia posłom dokumentację korespondencji z Radą Nadzorczą Totalizatora Sportowego oraz uchwały organów spółki.",
    oppositionAttackVector:
      "Zarzut upolitycznienia obsady spółek zależnych i tolerowania zatrudniania działaczy partyjnych bez konkursów na szczeblu dyrekcji terenowych.",
    ministerialCounterNarrative:
      "Ministerstwo Aktywów Państwowych pod kierownictwem Wojciecha Balczuna natychmiast po powzięciu sygnałów zażądało od Rady Nadzorczej audytu wszystkich 17 postępowań w regionach. Sekretarz Stanu Eliza Zeidler przygotowała nowy, rygorystyczny Kodeks Dobrych Praktyk Rekrutacyjnych dla rad nadzorczych.",
    streetProtestThreat: false,
    isLiveProtestToday: false,
    parliamentaryControlActive: true,
    actionItemsForCabinet: [
      "Udostępnienie posłom jawnych dokumentów w czytelni Departamentu Prawnego zgodnie z ustawą o wykonywaniu mandatu posła i senatora",
      "Przygotowanie pisemnej informacji Ministra dla Marszałka Sejmu przed najbliższym posiedzeniem plenarnym",
      "Publikacja na BIP MAP raportu z audytu Rady Nadzorczej z rekomendacjami dyscyplinarnymi",
    ],
  },
  {
    id: "cris-map-azoty-covenants",
    title: "Dialog z bankami komercyjnymi ws. porozumienia standstill i stabilizacji Grupy Azoty",
    severity: "WYSOKIE",
    category: "AUDYT_I_PROKURATURA",
    dateIso: "2026-10-19",
    temporalStatus: "W_TOKU",
    incidentDate: "2026-10-19 — w toku negocjacji standstill",
    affectedLeadership: ["Wojciech Balczun (Minister)", "Konrad Gołota (Wiceminister)"],
    summary:
      "Konsorcjum 13 banków kredytujących projekt Polimery Police prowadzi negocjacje przedłużenia waiveru kowenantowego z udziałem doradców finansowych MAP i PFR.",
    oppositionAttackVector:
      "Oskarżenia o brak sprawczości resortu wobec instytucji finansowych i groźbę utraty kontroli nad strategicznym producentem kaprolaktamu i nawozów.",
    ministerialCounterNarrative:
      "Minister Wojciech Balczun prowadzi konstruktywne rozmowy z wierzycielami. Nie dopuścimy do wrogiego przejęcia majątku, a zarząd wdrożył program optymalizacji kosztowej na 480 mln zł rocznie bez konieczności niekontrolowanej wyprzedaży aktywów.",
    streetProtestThreat: false,
    isLiveProtestToday: false,
    parliamentaryControlActive: false,
    actionItemsForCabinet: [
      "Zamknięta narada z Polskim Funduszem Rozwoju (PFR) i PKO BP w sprawie struktury gwarancji płynnościowych",
      "Powołanie międzyresortowego zespołu doradczego MAP-MF",
    ],
  },
  {
    id: "cris-map-sprostowanie-onet",
    title: "Wyjaśnienie okoliczności zmian w organach statutowych KGHM",
    severity: "SREDNIE",
    category: "KADRY_OBSADA",
    dateIso: "2026-10-16",
    temporalStatus: "ODBYŁO_SIĘ",
    incidentDate: "2026-10-16 (sprawa zamknięta wyjaśnieniem)",
    affectedLeadership: ["Eliza Zeidler (Sekretarz Stanu)"],
    summary:
      "Publikacje sugerujące rzekomy konflikt decyzyjny o nadzór nad spółką miedziową. Rzecznik prasowy MAP przekazał oficjalne dementi.",
    oppositionAttackVector:
      "Próba wywołania wrażenia chaosu zarządczego w kluczowym eksporterze surowcowym GPW.",
    ministerialCounterNarrative:
      "Decyzje kadrowe w KGHM są wyłączną prerogatywą Rady Nadzorczej oceniającej wykonanie wskaźników KPI i planu CAPEX na projektach zagranicznych (Sierra Gorda).",
    streetProtestThreat: false,
    isLiveProtestToday: false,
    parliamentaryControlActive: false,
    actionItemsForCabinet: [
      "Wystosowanie oficjalnego dementi rzecznika prasowego MAP",
      "Bieżący monitoring kursu akcji KGHM na GPW pod kątem manipulacji informacją poufną",
    ],
  },
];

export const MAP_PRESS_RELEASES: MapPressReleaseRecord[] = [
  {
    id: "rel-map-01",
    title: "Oświadczenie MAP w sprawie standardów rekrutacji na stanowiska kierownicze w spółkach portfelowych",
    category: "KOMUNIKAT_PRASOWY",
    publishedAt: "2026-10-20 17:30",
    channel: "gov.pl/aktywa-panstwowe",
    summary:
      "Minister Aktywów Państwowych skierował do wszystkich rad nadzorczych spółek z bezpośrednim udziałem Skarbu Państwa wiążące wytyczne dotyczące jawności konkursów, zakazu nominacji bez profilu kompetencyjnego oraz audytu postępowań w podmiotach zależnych.",
    keyQuotes: [
      "Spółki Skarbu Państwa nie mogą być traktowane jak polityczne lenna. Każde stanowisko kierownicze musi mieć merytoryczne uzasadnienie i przejść otwartą procedurę.",
      "Oczekujemy od rad nadzorczych bezwzględnego egzekwowania prawa i rozliczania zarządów z polityki personalnej.",
    ],
    isRectification: false,
    reachEstimate: 145000,
    defenseStrengthScore: 0.92,
  },
  {
    id: "rel-map-02",
    title: "Sprostowanie MAP do artykułu prasowego 'Tajne plany wyprzedaży majątku kolejowego'",
    category: "SPROSTOWANIE",
    publishedAt: "2026-10-18 11:15",
    channel: "PAP",
    summary:
      "W trybie art. 31a Prawa prasowego MAP zażądało od redakcji sprostowania nieprawdziwych twierdzeń o zamiarze likwidacji spółki PKP CARGO. Postępowanie sanacyjne ma na celu zachowanie płynności i ochrona 10 000 miejsc pracy.",
    keyQuotes: [
      "Nieprawdą jest, że Ministerstwo Aktywów Państwowych przygotowuje prywatyzację taboru PKP CARGO. Prawdziwa informacja brzmi: zarząd realizuje plan restrukturyzacji pod nadzorem sądu upadłościowego.",
    ],
    isRectification: true,
    targetMediaOutlet: "Dziennik Gazeta Prawna",
    reachEstimate: 85000,
    defenseStrengthScore: 0.96,
  },
  {
    id: "rel-map-03",
    title: "Komunikat z posiedzenia Komitetu Sterującego ds. Transformacji Energetycznej",
    category: "KOMUNIKAT_PRASOWY",
    publishedAt: "2026-10-14 15:00",
    channel: "gov.pl/aktywa-panstwowe",
    summary:
      "Kierownictwo resortu potwierdziło harmonogram prac nad nową architekturą rynkową dla elektrowni węglowych. Priorytetem rządu jest bezpieczeństwo dostaw energii dla gospodarstw domowych i przemysłu.",
    keyQuotes: [
      "Żadna elektrownia systemowa nie zostanie wyłączona bez zapewnienia rezerw mocy w systemie KSE.",
    ],
    isRectification: false,
    reachEstimate: 62000,
    defenseStrengthScore: 0.88,
  },
  {
    id: "rel-map-04",
    title: "Briefing prasowy Ministra Wojciecha Balczuna w gmachu resortu",
    category: "BRIEFING",
    publishedAt: "2026-10-11 12:00",
    channel: "X / @MAPSkarbPanstwa",
    summary:
      "Prezentacja wyników finansowych 406 spółek z udziałem Skarbu Państwa za I półrocze oraz założeń do wypłat dywidend w roku budżetowym 2027.",
    keyQuotes: [
      "Dyscyplina finansowa i transparentność to fundamenty, na których budujemy wartość majątku narodowego.",
    ],
    isRectification: false,
    reachEstimate: 210000,
    defenseStrengthScore: 0.89,
  },
];

export const MAP_PRESS_INQUIRIES: MapPressInquiryRecord[] = [
  {
    id: "inq-media-05",
    mediaOutlet: "Polska Agencja Prasowa (PAP Biznes)",
    journalistName: "Tomasz Więcławski",
    receivedAt: "2026-10-26 10:15",
    deadlineAt: "2026-10-26 12:15",
    urgency: "PILNE_DO_2H",
    subject: "Stan wdrożenia wytycznych rekrutacyjnych w grupach kapitałowych po naradzie kierownictwa MAP",
    detailedQuestions: [
      "Kiedy Departament Nadzoru II przedstawi raport z wdrożenia kodeksu rekrutacyjnego w spółkach zależnych?",
      "Czy planowane są dodatkowe kontrole doraźne w radach nadzorczych spółek sektora zbrojeniowego i energetycznego?",
    ],
    politicalRiskScore: 0.52,
    assignedSpokespersonLine:
      "Wytyczne Ministra Wojciecha Balczuna obowiązują wszystkie 406 podmiotów portfelowych. Departament Nadzoru II weryfikuje zgodność procedur konkursowych, a raport z rekomendacjami zostanie przedstawiony na najbliższym posiedzeniu kierownictwa resortu.",
    factsAndFigures: "Wytyczne obejmują 100% grup kapitałowych; do końca roku zaplanowano audyt 42 spółek-córek.",
    redLines: "Nie wskazywać konkretnych podmiotów przed formalnym zakończeniem czynności sprawdzających.",
    status: "W_OPRACOWANIU",
  },
  {
    id: "inq-media-01",
    mediaOutlet: "TVN24 / Fakty",
    journalistName: "Krzysztof Skórzyński",
    receivedAt: "2026-10-21 08:45",
    deadlineAt: "2026-10-21 13:00",
    urgency: "ZREALIZOWANE",
    subject: "Pytanie o planowaną obecność Ministra na demonstracji kolejarzy pod gmachem MAP",
    detailedQuestions: [
      "Czy Minister Wojciech Balczun wyjdzie w piątek do protestujących kolejarzy z PKP CARGO (spółki, którą sam kierował w latach 2008-2013)?",
      "Czy resort rozważa cofnięcie zgody na zwolnienia grupowe?",
      "Jaka jest kwota odpraw wypłaconych dotąd odchodzącym maszynistom?",
    ],
    politicalRiskScore: 0.88,
    assignedSpokespersonLine:
      "Ministerstwo wyznaczyło zespół kierowniczy na czele z wiceministrem Grzegorzem Wroną do spotkania z reprezentacją pracowników w sali konferencyjnej. Zwolnienia grupowe są procedurą zarządu pod nadzorem sędziego-komisarza, a MAP zabezpieczyło programy zatrudnieniowe w innych spółkach kolejowych.",
    factsAndFigures:
      "12 podpisanych listów intencyjnych na transfer 1 850 pracowników; fundusze odprawowe zabezpieczone z FGŚP; sanacja chroni przed likwidacją 10 000 pozostałych etatów.",
    redLines:
      "Nie składać obietnic cofnięcia sanacji, gdyż doprowadziłoby to do upadłości likwidacyjnej w ciągu 14 dni.",
    status: "WYSLANE",
  },
  {
    id: "inq-media-02",
    mediaOutlet: "Business Insider Polska",
    journalistName: "Bartek Godusławski",
    receivedAt: "2026-10-26 11:00",
    deadlineAt: "2026-10-26 16:00",
    urgency: "DZISIAJ",
    subject: "Stan negocjacji z konsorcjum banków finansujących Polimery Police w Grupie Azoty",
    detailedQuestions: [
      "Czy MAP zgodziło się na dokapitalizowanie spółki kwotą 1,2 mld zł?",
      "Czy banki zażądały zmiany prezesa zarządu Grupy Azoty?",
      "Jakie jest ryzyko wypowiedzenia umów kredytowych przed 31 października?",
    ],
    politicalRiskScore: 0.76,
    assignedSpokespersonLine:
      "MAP pozostaje w stałym dialogu z instytucjami finansującymi. Grupa Azoty jest podmiotem o strategicznym znaczeniu gospodarczym i państwo zapewni stabilność funkcjonowania kluczowych instalacji przemysłowych przy zachowaniu dyscypliny rynkowej.",
    factsAndFigures:
      "Zadłużenie netto wynosi 9,8 mld zł; spółka generuje oszczędności z audytu umów handlowych na poziomie 480 mln zł.",
    redLines: "Nie podawać kwot ewentualnego wsparcia przed notyfikacją giełdową ESPI.",
    status: "W_OPRACOWANIU",
  },
  {
    id: "inq-media-03",
    mediaOutlet: "Rzeczpospolita / Dział Ekonomiczny",
    journalistName: "Paweł Rożyński",
    receivedAt: "2026-10-21 07:10",
    deadlineAt: "2026-10-22 12:00",
    urgency: "ZREALIZOWANE",
    subject: "Projekt nowelizacji ustawy o zasadach zarządzania mieniem państwowym (Art. 19)",
    detailedQuestions: [
      "Kiedy projekt trafi do konsultacji międzyresortowych w KPRM?",
      "Czy wymóg pozytywnej opinii Rady ds. Spółek obejmie również spółki-wnuczki?",
    ],
    politicalRiskScore: 0.35,
    assignedSpokespersonLine:
      "Projekt ustawy uszczelniającej nadzór właścicielski został wpisany do wykazu prac legislacyjnych rządu. Naszym celem jest objęcie standardami kompetencyjnymi całych grup kapitałowych, a nie tylko spółek-matek.",
    factsAndFigures: "Obecnie wymóg z art. 19 dotyczy bezpośrednio 406 podmiotów.",
    redLines: "Nie podawać dat posiedzeń Stałego Komitetu Rady Ministrów przed decyzją KPRM.",
    status: "WYSLANE",
  },
  {
    id: "inq-media-04",
    mediaOutlet: "Wirtualna Polska / Money.pl",
    journalistName: "Mateusz Ratajczak",
    receivedAt: "2026-10-19 14:00",
    deadlineAt: "2026-10-20 18:00",
    urgency: "ZREALIZOWANE",
    subject: "Wypłata rekompensaty za świadczenie usługi powszechnej dla Poczty Polskiej",
    detailedQuestions: [
      "Czy środki z budżetu państwa (750 mln zł) wpłynęły już na konto Poczty Polskiej?",
      "Czy zostały one przeznaczone na podwyżki płac dla listonoszy?",
    ],
    politicalRiskScore: 0.42,
    assignedSpokespersonLine:
      "Środki zostały przekazane zgodnie z ustawą po uzyskaniu zgody Urzędu Ochrony Konkurencji i Konsumentów (UOKiK). Posłużą sfinansowaniu kosztu netto usługi powszechnej oraz stabilizacji płynnościowej spółki w okresie transformacji sieci.",
    factsAndFigures: "Kwota 749,8 mln zł za lata 2021-2022 została zrealizowana przez BGK.",
    redLines: "Podkreślać, że to zwrot poniesionych kosztów ustawowych, a nie subsydium operacyjne.",
    status: "WYSLANE",
  },
];

export function getMapZoneSummary(): MapZoneSummaryRecord {
  const leadership = MAP_LEADERSHIP;
  const directCrises = MAP_DIRECT_CRISES;
  const pressInquiries = MAP_PRESS_INQUIRIES;
  const pressReleases = MAP_PRESS_RELEASES;

  const criticalDirectCrisesCount = directCrises.filter((c) => c.severity === "KRYTYCZNE").length;
  const activePressInquiriesCount = pressInquiries.filter(
    (q) => q.status === "NOWE" || q.status === "W_OPRACOWANIU" || q.status === "ZAAKCEPTOWANE_PRZEZ_GABINET"
  ).length;
  const registeredStreetProtestsCount = directCrises.filter((c) => c.streetProtestThreat).length;
  const activeStreetProtestsTodayCount = directCrises.filter((c) => c.isLiveProtestToday === true).length;
  const recentPastProtestsCount = directCrises.filter((c) => c.temporalStatus === "ODBYŁO_SIĘ" && c.category === "PROTESTY_SPOŁECZNE").length;

  return {
    overallMapTensionIndex: 68,
    activePressInquiriesCount,
    criticalDirectCrisesCount,
    pendingParliamentaryInquiriesCount: 14,
    registeredStreetProtestsCount,
    activeStreetProtestsTodayCount,
    recentPastProtestsCount,
    pressReleasesThisMonthCount: pressReleases.length + 15,
    averageSpokespersonResponseTimeHours: 3.2,
  };
}
