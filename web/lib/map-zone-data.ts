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
    title: "Zgłoszona pikieta ostrzegawcza związków zawodowych przed gmachem MAP przy ul. Kruczej 36",
    severity: "KRYTYCZNE",
    category: "PROTESTY_SPOŁECZNE",
    dateIso: "2026-10-23",
    temporalStatus: "ODBYŁO_SIĘ",
    incidentDate: "2026-10-23 (pikieta ostrzegawcza przed gmachem MAP przy ul. Kruczej 36)",
    affectedLeadership: ["Wojciech Balczun (Minister)", "Grzegorz Wrona (Wiceminister)"],
    summary:
      "Zgłoszona pikieta ostrzegawcza reprezentantów organizacji związkowych przed gmachem Ministerstwa Aktywów Państwowych przy ul. Kruczej 36 w związku z procesem sanacji w PKP CARGO oraz planami restrukturyzacji w Poczcie Polskiej.",
    oppositionAttackVector:
      "Podnoszenie w debacie publicznej kwestii tempa restrukturyzacji i zabezpieczenia socjalnego załogi w procesie sanacji PKP CARGO.",
    ministerialCounterNarrative:
      "MAP pod kierownictwem Wojciecha Balczuna konsekwentnie wdraża mechanizmy osłonowe: postępowanie sanacyjne zabezpiecza płynność spółki i chroni kluczowe aktywa taborowe przed likwidacją, a programy outplacementowe objęły już ponad 1 800 pracowników przechodzących do innych przewoźników kolejowych.",
    streetProtestThreat: true,
    isLiveProtestToday: false,
    postCrisisResolution:
      "Delegacja związkowców została przyjęta przez kierownictwo resortu. Dialog kontynuowany w ramach Trójstronnego Zespołu ds. Kolejnictwa. Departament Spółek Strategicznych prowadzi stały monitoring realizacji umów transferowych.",
    protestDetails: {
      location: "Warszawa, ul. Krucza 36 (przed gmachem MAP)",
      registeredParticipants: 250,
      organizer: "Międzyzakładowy Komitet Koordynacyjny Związków Zawodowych Kolejarzy",
      policeCoordination: true,
    },
    parliamentaryControlActive: false,
    actionItemsForCabinet: [
      "Przegląd wykonania listów intencyjnych na transfer maszynistów i rewidentów taboru",
      "Publikacja oficjalnego komunikatu informacyjnego na gov.pl/aktywa-panstwowe",
      "Koordynacja międzyresortowa z Ministerstwem Infrastruktury i MRPiPS",
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
    title: "Sprostowanie MAP do publikacji prasowej na temat polityki dywidendowej i planów inwestycyjnych w energetyce",
    category: "SPROSTOWANIE",
    publishedAt: "2026-10-18 11:15",
    channel: "gov.pl/aktywa-panstwowe",
    summary:
      "Wniosek o sprostowanie nieścisłych doniesień prasowych sugerujących rzekome cięcia inwestycji strategicznych w spółkach energetycznych na rzecz maksymalizacji wypłat dywidend do budżetu państwa.",
    keyQuotes: [
      "Nieprawdą jest, jakoby Ministerstwo Aktywów Państwowych wymuszało na zarządach spółek energetycznych redukcję planów CAPEX na rzecz bieżących wpłat dywidendowych.",
      "Polityka dywidendowa MAP w pełni uwzględnia potrzeby kapitałowe transformacji energetycznej i stabilność Krajowego Systemu Elektroenergetycznego.",
    ],
    isRectification: true,
    targetMediaOutlet: "Redakcja Dziennika Gazety Prawnej",
    reachEstimate: 110000,
    defenseStrengthScore: 0.94,
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
    title: "Konferencja prasowa kierownictwa MAP: podsumowanie audytu otwarcia i planu nadzoru właścicielskiego",
    category: "BRIEFING",
    publishedAt: "2026-10-11 12:00",
    channel: "gov.pl/aktywa-panstwowe",
    summary:
      "Prezentacja założeń do wzmocnienia nadzoru właścicielskiego nad 406 spółkami z udziałem Skarbu Państwa oraz planu cyfryzacji sprawozdawczości.",
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
    journalistName: "Redakcja PAP Biznes",
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
    mediaOutlet: "TVN24 / Dział Gospodarczy",
    journalistName: "Redakcja TVN24",
    receivedAt: "2026-10-21 08:45",
    deadlineAt: "2026-10-21 13:00",
    urgency: "ZREALIZOWANE",
    subject: "Pytanie o dialog ze związkami zawodowymi w PKP CARGO oraz programy osłonowe",
    detailedQuestions: [
      "Jakie działania podejmuje resort w celu zapewnienia płynnego transferu zwalnianych kolejarzy?",
      "Jaki jest stan realizacji porozumień z przewoźnikami pasażerskimi?",
      "Jaka jest kwota odpraw wypłaconych dotąd odchodzącym pracownikom z FGŚP?",
    ],
    politicalRiskScore: 0.88,
    assignedSpokespersonLine:
      "Ministerstwo wyznaczyło zespół kierowniczy na czele z wiceministrem Grzegorzem Wroną do bieżącego dialogu z reprezentacją pracowników. Sanacja chroni spółkę przed upadłością likwidacyjną, a MAP zabezpieczyło programy zatrudnieniowe w innych spółkach kolejowych.",
    factsAndFigures:
      "12 podpisanych listów intencyjnych na transfer 1 850 pracowników; fundusze odprawowe zabezpieczone z FGŚP; sanacja chroni przed likwidacją 10 000 pozostałych etatów.",
    redLines:
      "Nie składać obietnic cofnięcia sanacji, gdyż doprowadziłoby to do upadłości likwidacyjnej w ciągu 14 dni.",
    status: "WYSLANE",
  },
  {
    id: "inq-media-02",
    mediaOutlet: "Business Insider Polska",
    journalistName: "Redakcja Business Insider Polska",
    receivedAt: "2026-10-26 11:00",
    deadlineAt: "2026-10-26 16:00",
    urgency: "DZISIAJ",
    subject: "Stan negocjacji z konsorcjum banków finansujących Polimery Police w Grupie Azoty",
    detailedQuestions: [
      "Czy MAP prowadzi rozmowy z bankami w sprawie przedłużenia porozumienia standstill?",
      "Jakie działania naprawcze wdrożył zarząd Grupy Azoty?",
      "Jakie jest ryzyko wypowiedzenia umów kredytowych przed końcem kwartału?",
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
    journalistName: "Redakcja Rzeczpospolita",
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
    journalistName: "Redakcja Money.pl",
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
