import type {
  DisputeLegalStage,
  DisputeThreatLevel,
  LaborDisputeRecord,
  SocialDialogueCalendarRecord,
  SocialDialogueSummaryRecord,
  WageCompromiseSimulationInput,
  WageCompromiseSimulationResult,
} from "./types.ts";

export const LABOR_DISPUTES_DATABASE: LaborDisputeRecord[] = [
  {
    id: "disp-pkp-cargo-01",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    ticker: "PKPCARGO",
    sector: "Transport i Logistyka",
    voivodeship: "Mazowieckie / Ogólnopolskie",
    facilityLocation: "Warszawa, Katowice, Tarnowskie Góry, Poznań, Wrocław",
    unionsInvolved: [
      "NSZZ Solidarność Kolejarzy",
      "Federacja Związków Zawodowych Kolejarzy",
      "Związek Zawodowy Maszynistów Kolejowych w Polsce",
      "Związek Zawodowy Dyspozytorów PKP",
    ],
    demandSummary:
      "Natychmiastowe wycofanie wypowiedzenia Zakładowego Układu Zbiorowego Pracy (ZUZP), wstrzymanie procesu zwolnień grupowych do 4 142 pracowników oraz przywrócenie odpraw i dodatków stażowych.",
    demandedWageIncreasePct: 0.0,
    demandedOneOffBonusPln: 0,
    estimatedAnnualCostMlnPln: 195.4,
    workersAffectedCount: 14200,
    legalStage: "PROTOKOL_ROZBIEZNOSCI",
    threatLevel: "KRYTYCZNY",
    isZuzpThreatened: true,
    mediatorAssigned: "Wyznaczony z listy ministerialnej MRPiPS (radca Jan Kowalski)",
    nextDeadlineDate: "2026-10-28",
    nextDeadlineDescription: "Posiedzenie Wojewódzkiej Rady Dialogu Społecznego w Katowicach z udziałem Zarządu",
    ministerialNegotiationLine:
      "Bezwzględny priorytet utrzymania postępowania sanacyjnego przed sądem upadłościowym. Otwarcie funduszy PFR/ARP na programy outplacementowe i transfer maszynistów do Polregio/Intercity, bez zgody na powrót do archaicznego ZUZP z 2004 r.",
    mapPoliticalRisk:
      "Wysokie ryzyko blokad torowych na magistrali węglowej Śląsk-Porty oraz pikiet przed gmachem MAP przy ul. Kruczej 36.",
    financialBaseline: {
      revenueMlnPln: 4320.0,
      ebitdaMlnPln: 110.0,
      netDebtMlnPln: 2150.0,
      netDebtToEbitda: 19.54,
      maxCovenantRatio: 3.5,
      totalPayrollMlnPln: 1680.0,
    },
  },
  {
    id: "disp-jsw-01",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    ticker: "JSW",
    sector: "Górnictwo i Surowce",
    voivodeship: "Śląskie",
    facilityLocation: "Jastrzębie-Zdrój, Knurów, Pniówek, Borynia-Zofiówka",
    unionsInvolved: [
      "WZZ Sierpień 80",
      "NSZZ Solidarność JSW S.A.",
      "Związek Zawodowy Kadra Górnictwo",
      "Związek Zawodowy Górników w Polsce",
    ],
    demandSummary:
      "Podwyżka stawek płac zasadniczych o wskaźnik inflacji (min. 6.8%), waloryzacja ekwiwalentu za deputat węglowy oraz wypłata jednorazowej premii motywacyjnej za drugie półrocze (4 500 PLN brutto/pracownik).",
    demandedWageIncreasePct: 6.8,
    demandedOneOffBonusPln: 4500,
    estimatedAnnualCostMlnPln: 345.8,
    workersAffectedCount: 21100,
    legalStage: "MEDIACJA_MRPIPS",
    threatLevel: "WYSOKI",
    isZuzpThreatened: false,
    mediatorAssigned: "Ministerialny mediator pracy (dr hab. Marek Zieliński)",
    nextDeadlineDate: "2026-10-31",
    nextDeadlineDescription: "Koniec terminu mediacji przed sporządzeniem protokołu rozbieżności z mediatorem",
    ministerialNegotiationLine:
      "Warunkowanie jakichkolwiek podwyżek redukcją jednostkowego kosztu wydobycia węgla koksowego i odbudową poduszki płynnościowej po spadku cen światowych HCC.",
    mapPoliticalRisk:
      "Wyprowadzenie załóg na ulice Katowic, nacisk śląskich posłów na dymisję członka zarządu ds. pracowniczych.",
    financialBaseline: {
      revenueMlnPln: 12450.0,
      ebitdaMlnPln: 780.0,
      netDebtMlnPln: 1620.0,
      netDebtToEbitda: 2.08,
      maxCovenantRatio: 3.0,
      totalPayrollMlnPln: 3820.0,
    },
  },
  {
    id: "disp-poczta-polska-01",
    entityName: "Poczta Polska S.A.",
    ticker: "POCZTA_POLSKA",
    sector: "Usługi Pocztowe i Logistyka",
    voivodeship: "Ogólnopolskie",
    facilityLocation: "Wszystkie węzły ekspedycyjno-rozdzielcze (WER), placówki pocztowe",
    unionsInvolved: [
      "Organizacja Zakładowa NSZZ Solidarność Pracowników Poczty Polskiej",
      "Związek Zawodowy Pracowników Poczty",
      "Wolny Związek Zawodowy Pracowników Poczty",
    ],
    demandSummary:
      "Wzrost wynagrodzenia zasadniczego o 800 PLN brutto dla każdego pracownika, natychmiastowe podwyższenie płac osób na poziomie płacy minimalnej oraz gwarancje zatrudnienia w ramach rządowego planu transformacji cyfrowej.",
    demandedWageIncreasePct: 14.5,
    demandedOneOffBonusPln: 1500,
    estimatedAnnualCostMlnPln: 412.0,
    workersAffectedCount: 52000,
    legalStage: "REFERENDUM_STRAJKOWE",
    threatLevel: "KRYTYCZNY",
    isZuzpThreatened: true,
    mediatorAssigned: "Mediator MRPiPS zakończył procedurę protokołem rozbieżności",
    nextDeadlineDate: "2026-11-05",
    nextDeadlineDescription: "Ogłoszenie oficjalnych wyników ogólnopolskiego referendum strajkowego",
    ministerialNegotiationLine:
      "Przeznaczenie środków z rekompensaty za świadczenie usługi powszechnej (ustawa o prawie pocztowym) wyłącznie na restrukturyzację sieci i podwyżki dla najniżej uposażonych listonoszy, powiązane z Programem Dobrowolnych Odejść (PDO) w administracji.",
    mapPoliticalRisk:
      "Paraliż doręczania pism sądowych, emerytur i decyzji ZUS w skali całego kraju, bezpośredni atak opozycji na kierownictwo MAP.",
    financialBaseline: {
      revenueMlnPln: 6180.0,
      ebitdaMlnPln: -210.0,
      netDebtMlnPln: 890.0,
      netDebtToEbitda: -4.24,
      maxCovenantRatio: 4.0,
      totalPayrollMlnPln: 4100.0,
    },
  },
  {
    id: "disp-pgg-01",
    entityName: "Polska Grupa Górnicza S.A.",
    ticker: "PGG",
    sector: "Górnictwo Węgla Energetycznego",
    voivodeship: "Śląskie",
    facilityLocation: "Rybnik, Ruda Śląska, Mysłowice, Wesoła, Piast-Ziemowit",
    unionsInvolved: [
      "NSZZ Solidarność Górnicza",
      "Kadra PGG",
      "Związek Zawodowy Górników w Polsce",
      "WZZ Sierpień 80 PGG",
    ],
    demandSummary:
      "Pilna waloryzacja funduszu płac o 7.2% zgodnie z zapisami Umowy Społecznej z 2021 r. oraz gwarancja zachowania harmonogramu dotacji budżetowej na redukcję zdolności produkcyjnych.",
    demandedWageIncreasePct: 7.2,
    demandedOneOffBonusPln: 2000,
    estimatedAnnualCostMlnPln: 288.6,
    workersAffectedCount: 36800,
    legalStage: "ROKOWANIA",
    threatLevel: "WYSOKI",
    isZuzpThreatened: false,
    mediatorAssigned: "Strony w fazie bezpośrednich rokowań zarząd-związki",
    nextDeadlineDate: "2026-11-12",
    nextDeadlineDescription: "Kolejna tura rokowań z udziałem Podsekretarza Stanu w MAP",
    ministerialNegotiationLine:
      "Utrzymanie stabilności dotacji budżetowej notyfikowanej w Komisji Europejskiej, powstrzymanie eskalacji żądań ponad limit wpisany w ustawę budżetową.",
    mapPoliticalRisk:
      "Możliwość zablokowania transportów węgla do elektrowni systemowych Kozienice i Połaniec przed sezonem zimowym.",
    financialBaseline: {
      revenueMlnPln: 11200.0,
      ebitdaMlnPln: 450.0,
      netDebtMlnPln: 3400.0,
      netDebtToEbitda: 7.55,
      maxCovenantRatio: 5.0,
      totalPayrollMlnPln: 4010.0,
    },
  },
  {
    id: "disp-grupa-azoty-01",
    entityName: "Grupa Azoty S.A.",
    ticker: "ATT",
    sector: "Chemia i Nawozy",
    voivodeship: "Małopolskie / Lubelskie / Zachodniopomorskie",
    facilityLocation: "Tarnów, Puławy, Police, Kędzierzyn-Koźle",
    unionsInvolved: [
      "NSZZ Solidarność Zakładów Azotowych Puławy",
      "ZZPRC ZCh Police",
      "MZZ Chemików Tarnów",
    ],
    demandSummary:
      "Wznowienie zawieszonych świadczeń pracowniczych, rezygnacja z planu wygaszania instalacji melaminy i kaprolaktamu, gwarancja nienaruszalności funduszu socjalnego ZFŚS.",
    demandedWageIncreasePct: 3.5,
    demandedOneOffBonusPln: 1000,
    estimatedAnnualCostMlnPln: 98.4,
    workersAffectedCount: 13500,
    legalStage: "POROZUMIENIE_ZAWISLE",
    threatLevel: "UMIARKOWANY",
    isZuzpThreatened: true,
    mediatorAssigned: "Wspólna komisja kryzysowa ds. dialogu branżowego",
    nextDeadlineDate: "2026-11-18",
    nextDeadlineDescription: "Audyt realizacji pakietu oszczędnościowego podpisanego ze związkami w Puławach i Policach",
    ministerialNegotiationLine:
      "Ochrona kowenantów bankowych (Net Debt/EBITDA) - banki kredytujące żądają dyscypliny kosztowej pod rygorem wypowiedzenia umów finansowania Polimerów Police.",
    mapPoliticalRisk:
      "Lokalne protesty w Puławach i Tarnowie, próba interwencji posłów z regionu lubelskiego.",
    financialBaseline: {
      revenueMlnPln: 13500.0,
      ebitdaMlnPln: -620.0,
      netDebtMlnPln: 9840.0,
      netDebtToEbitda: -15.87,
      maxCovenantRatio: 3.5,
      totalPayrollMlnPln: 1450.0,
    },
  },
  {
    id: "disp-pge-giek-01",
    entityName: "PGE Górnictwo i Energetyka Konwencjonalna S.A.",
    ticker: "PGE_GIEK",
    sector: "Energetyka Konwencjonalna",
    voivodeship: "Łódzkie / Dolnośląskie",
    facilityLocation: "Bełchatów, Bogatynia (Turów), Opole, Rybnik",
    unionsInvolved: [
      "Federacja Związków Zawodowych Górników Węgla Brunatnego",
      "MZZ Odkrywka Bełchatów",
      "NSZZ Solidarność Elektrowni Turów",
    ],
    demandSummary:
      "Gwarancje zatrudnienia do 2038 r. w związku z wycofaniem koncepcji NABE, wpisanie mechanizmu osłonowego dla elektrowni węglowych, podwyżka tabel płac o 5.5%.",
    demandedWageIncreasePct: 5.5,
    demandedOneOffBonusPln: 3000,
    estimatedAnnualCostMlnPln: 162.0,
    workersAffectedCount: 16400,
    legalStage: "ROKOWANIA",
    threatLevel: "UMIARKOWANY",
    isZuzpThreatened: false,
    mediatorAssigned: "Negocjacje wewnątrzzakładowe z udziałem zarządu PGE GiEK",
    nextDeadlineDate: "2026-11-25",
    nextDeadlineDescription: "Spotkanie plenarne zespołu trójstronnego ds. energetyki w Warszawie",
    ministerialNegotiationLine:
      "Przygotowanie nowej ustawy o transformacji sektora elektroenergetycznego (tzw. fundusz transformacji) bez gwarancji dożywotnich przywilejów.",
    mapPoliticalRisk:
      "Niepokoje społeczne w Zagłębiu Bełchatowskim, presja na zachowanie wydobycia węgla brunatnego.",
    financialBaseline: {
      revenueMlnPln: 18900.0,
      ebitdaMlnPln: 1450.0,
      netDebtMlnPln: 4200.0,
      netDebtToEbitda: 2.89,
      maxCovenantRatio: 3.5,
      totalPayrollMlnPln: 2950.0,
    },
  },
  {
    id: "disp-hsw-01",
    entityName: "Huta Stalowa Wola S.A. (Grupa PGZ)",
    ticker: "HSW",
    sector: "Przemysł Obronny",
    voivodeship: "Podkarpackie",
    facilityLocation: "Stalowa Wola, Sanok (oddział Autosan)",
    unionsInvolved: [
      "NSZZ Solidarność HSW S.A.",
      "Związek Zawodowy Inżynierów i Techników HSW",
    ],
    demandSummary:
      "Zwiększenie udziału pracowników w marży z kontraktów zbrojeniowych (Krab, Borsuk, Baobab-K), wyrównanie płac konstruktorów do stawek rynkowych w sektorze obronnym (+11%).",
    demandedWageIncreasePct: 11.0,
    demandedOneOffBonusPln: 5000,
    estimatedAnnualCostMlnPln: 54.2,
    workersAffectedCount: 3800,
    legalStage: "ROKOWANIA",
    threatLevel: "MONITOROWANY",
    isZuzpThreatened: false,
    mediatorAssigned: "Brak mediatora zewnętrznego - dialog dwustronny",
    nextDeadlineDate: "2026-12-02",
    nextDeadlineDescription: "Podpisanie protokołu uzgodnień rocznego wskaźnika wzrostu wynagrodzeń na rok 2027",
    ministerialNegotiationLine:
      "Akceptacja umiarkowanego wzrostu stawek dla kluczowych inżynierów i spawaczy pancernych w celu powstrzymania odpływu kadr do prywatnych firm obronnych.",
    mapPoliticalRisk:
      "Niskie ryzyko strajku, wysokie znaczenie strategiczne dla terminowości dostaw uzbrojenia dla Wojska Polskiego.",
    financialBaseline: {
      revenueMlnPln: 2850.0,
      ebitdaMlnPln: 340.0,
      netDebtMlnPln: 480.0,
      netDebtToEbitda: 1.41,
      maxCovenantRatio: 2.5,
      totalPayrollMlnPln: 490.0,
    },
  },
];

export const SOCIAL_DIALOGUE_CALENDAR: SocialDialogueCalendarRecord[] = [
  {
    id: "cal-pkp-01",
    eventDate: "2026-10-28",
    entityTicker: "PKPCARGO",
    entityName: "PKP CARGO S.A. w restrukturyzacji",
    voivodeship: "Śląskie",
    eventType: "POSIEDZENIE_WRDS",
    title: "Nadzwyczajne posiedzenie Wojewódzkiej Rady Dialogu Społecznego w Katowicach",
    description: "Debata plenarna z udziałem Marszałka Województwa, Wojewody, związków kolejowych i zarządu PKP CARGO.",
    threatLevel: "KRYTYCZNY",
    actionRequiredByMap: "Przygotowanie zwięzłego stanowiska MAP ws. funduszy rekonwersji zawodowej dla odchodzących kolejarzy.",
  },
  {
    id: "cal-jsw-01",
    eventDate: "2026-10-31",
    entityTicker: "JSW",
    entityName: "Jastrzębska Spółka Węglowa S.A.",
    voivodeship: "Śląskie",
    eventType: "MEDIACJA",
    title: "Finałowa sesja mediacyjna w sporze płacowym w siedzibie JSW w Jastrzębiu-Zdroju",
    description: "Termin ostateczny na wypracowanie kompromisu wskaźnika wzrostu płac lub sporządzenie protokołu rozbieżności otwierającego drogę do referendum.",
    threatLevel: "WYSOKI",
    actionRequiredByMap: "Bieżący kontakt Departamentu Nadzoru I z przewodniczącym Rady Nadzorczej JSW.",
  },
  {
    id: "cal-poczta-01",
    eventDate: "2026-11-05",
    entityTicker: "POCZTA_POLSKA",
    entityName: "Poczta Polska S.A.",
    voivodeship: "Mazowieckie",
    eventType: "REFERENDUM",
    title: "Podliczenie protokołów ogólnokrajowego referendum strajkowego",
    description: "Ogłoszenie frekwencji i wyniku głosowania załogi Poczty Polskiej ws. przeprowadzenia bezterminowego strajku generalnego.",
    threatLevel: "KRYTYCZNY",
    actionRequiredByMap: "Komitet kryzysowy w MAP i powiadomienie KPRM oraz MSWiA ws. procedur awaryjnych doręczeń.",
  },
  {
    id: "cal-pgg-01",
    eventDate: "2026-11-12",
    entityTicker: "PGG",
    entityName: "Polska Grupa Górnicza S.A.",
    voivodeship: "Śląskie",
    eventType: "ROKOWANIA",
    title: "Rokowania płacowe PGG z udziałem przedstawicieli resortu aktywów",
    description: "Rozmowy na temat aneksu do Umowy Społecznej i dopłat z budżetu państwa.",
    threatLevel: "WYSOKI",
    actionRequiredByMap: "Udział Podsekretarza Stanu w spotkaniu w Śląskim Urzędzie Wojewódzkim.",
  },
  {
    id: "cal-azoty-01",
    eventDate: "2026-11-18",
    entityTicker: "ATT",
    entityName: "Grupa Azoty S.A.",
    voivodeship: "Lubelskie",
    eventType: "TERMIN_ZAWIESZENIA_ZUZP",
    title: "Przegląd realizacji porozumienia o zawieszeniu części praw ZUZP w Puławach",
    description: "Ocena zarządu i związków w zakresie utrzymania dyscypliny płacowej.",
    threatLevel: "UMIARKOWANY",
    actionRequiredByMap: "Monitorowanie wskaźnika zadłużenia netto pod kątem umów z konsorcjum banków.",
  },
  {
    id: "cal-pge-01",
    eventDate: "2026-11-25",
    entityTicker: "PGE_GIEK",
    entityName: "PGE Górnictwo i Energetyka Konwencjonalna S.A.",
    voivodeship: "Mazowieckie",
    eventType: "ROKOWANIA",
    title: "Posiedzenie Zespołu Trójstronnego ds. Branży Energetycznej w Warszawie",
    description: "Konsultacje projektów legislacyjnych dotyczących transformacji węgla brunatnego.",
    threatLevel: "UMIARKOWANY",
    actionRequiredByMap: "Zapewnienie reprezentacji Departamentu Spółek Strategicznych MAP.",
  },
];

export function getSocialDialogueSummary(): SocialDialogueSummaryRecord {
  const disputes = LABOR_DISPUTES_DATABASE;
  const totalActiveDisputes = disputes.length;
  const criticalDisputesCount = disputes.filter((d) => d.threatLevel === "KRYTYCZNY").length;
  const totalWorkersAffected = disputes.reduce((sum, d) => sum + d.workersAffectedCount, 0);
  const totalWageDemandsCostMlnPln = disputes.reduce(
    (sum, d) => sum + d.estimatedAnnualCostMlnPln,
    0
  );
  const zuzpThreatenedCount = disputes.filter((d) => d.isZuzpThreatened).length;

  const disputesByVoivodeship: Record<string, number> = {};
  for (const d of disputes) {
    const key = d.voivodeship.split("/")[0].trim();
    disputesByVoivodeship[key] = (disputesByVoivodeship[key] || 0) + 1;
  }

  return {
    totalActiveDisputes,
    criticalDisputesCount,
    totalWorkersAffected,
    totalWageDemandsCostMlnPln: Math.round(totalWageDemandsCostMlnPln * 10) / 10,
    disputesByVoivodeship,
    zuzpThreatenedCount,
    calendarEventsNext30Days: SOCIAL_DIALOGUE_CALENDAR.length,
  };
}

/**
 * Symuluje wpływ kompromisu płacowego na finanse spółki (EBITDA, Net Debt / EBITDA).
 * Pokazuje ministrowi, o ile wzrosną koszty i czy kowenant bankowy zostanie naruszony.
 */
export function simulateWageCompromise(
  input: WageCompromiseSimulationInput
): WageCompromiseSimulationResult {
  const dispute = LABOR_DISPUTES_DATABASE.find((d) => d.id === input.disputeId);
  if (!dispute) {
    throw new Error(`Nie znaleziono sporu o id: ${input.disputeId}`);
  }

  const base = dispute.financialBaseline;
  const payrollCost = base.totalPayrollMlnPln;

  // Koszt podwyżki procentowej w skali roku
  const wageIncreaseCost = payrollCost * (input.proposedWageIncreasePct / 100);

  // Koszt premii jednorazowej: pracownicy * kwota w PLN / 1_000_000
  const bonusCost = (dispute.workersAffectedCount * input.proposedOneOffBonusPln) / 1_000_000;

  const totalSimulatedCost = Math.round((wageIncreaseCost + bonusCost) * 10) / 10;
  const simulatedEbitda = Math.round((base.ebitdaMlnPln - totalSimulatedCost) * 10) / 10;

  // Obliczenie nowego Net Debt / EBITDA
  let simulatedNetDebtToEbitda: number;
  if (simulatedEbitda <= 0) {
    simulatedNetDebtToEbitda = -99.9; // Wskaźnik ujemny przy ujemnej EBITDA
  } else {
    simulatedNetDebtToEbitda =
      Math.round((base.netDebtMlnPln / simulatedEbitda) * 100) / 100;
  }

  const covenantBreached =
    simulatedEbitda <= 0 || simulatedNetDebtToEbitda > base.maxCovenantRatio;

  const savingsVsDemandsMlnPln =
    Math.round(Math.max(0, dispute.estimatedAnnualCostMlnPln - totalSimulatedCost) * 10) / 10;

  // Horyzont spokoju społecznego: jeśli kompromis bliski żądaniom, to 12-24 mies., jeśli drastycznie poniżej, to 3-6 mies.
  let socialPeaceHorizonMonths = 12;
  if (input.proposedWageIncreasePct >= (dispute.demandedWageIncreasePct || 5.0) * 0.8) {
    socialPeaceHorizonMonths = 24;
  } else if (input.proposedWageIncreasePct < 2.0 && input.proposedOneOffBonusPln === 0) {
    socialPeaceHorizonMonths = 3;
  } else {
    socialPeaceHorizonMonths = 12;
  }

  let recommendationNote = "";
  if (covenantBreached) {
    recommendationNote =
      "Ostrzeżenie: Proponowany kompromis narusza kowenanty bankowe spółki (Net Debt / EBITDA przekracza limit " +
      base.maxCovenantRatio +
      "x). Wymaga klauzuli standstill od konsorcjum banków.";
  } else {
    recommendationNote =
      "Bezpieczny korytarz: Kompromis mieści się w limitach płynnościowych i kowenantach bankowych. Oszczędność względem żądań wynosi " +
      savingsVsDemandsMlnPln +
      " mln PLN rocznie.";
  }

  return {
    disputeId: dispute.id,
    entityName: dispute.entityName,
    baselineEbitdaMlnPln: base.ebitdaMlnPln,
    baselineNetDebtToEbitda: base.netDebtToEbitda,
    simulatedAnnualCostMlnPln: totalSimulatedCost,
    simulatedEbitdaMlnPln: simulatedEbitda,
    simulatedNetDebtToEbitda: simulatedNetDebtToEbitda,
    covenantBreached,
    covenantMaxAllowed: base.maxCovenantRatio,
    savingsVsDemandsMlnPln,
    socialPeaceHorizonMonths,
    recommendationNote,
  };
}
