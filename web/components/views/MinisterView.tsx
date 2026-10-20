"use client";

import React, { useState } from "react";
import {
  Flame,
  ShieldAlert,
  AlertTriangle,
  Layers,
  FileQuestion,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  FileText,
  Copy,
  Printer,
  X,
  Target,
  AlertOctagon,
  Scale,
  Maximize2,
  Minimize2,
  Vote,
  Building2,
  Users,
  Coins,
  Lock,
  Server,
  Wifi,
  Radio,
  Check,
  FileCheck,
  ShieldCheck,
  Activity,
  PieChart,
  AlertCircle,
  ExternalLink,
  Volume2,
} from "lucide-react";
import {
  OVERALL_CRISIS_TEMPERATURE,
  SECTOR_STABILITY_DATA,
  TOP_FIRE_ALERTS,
  PARLIAMENTARY_INQUIRIES,
  KPRM_ONE_PAGER_DATA,
  NATIONAL_ASSETS_PORTFOLIO_STATS,
  CRITICAL_INFRASTRUCTURE_SECTORS,
  AGM_VOTING_TEMPLATES,
  STOCK_EXCHANGE_DATA,
  VOIVODESHIP_REGIONAL_DATA,
} from "@/lib/mapscope-data.ts";
import { RiskMatrixScatterPlot } from "@/components/charts/RiskMatrixScatterPlot.tsx";
import { CalendarHeatmapChart } from "@/components/charts/CalendarHeatmapChart.tsx";
import { PortfolioStressTestSimulator } from "@/components/charts/PortfolioStressTestSimulator.tsx";
import { HighLevelStateSuite } from "@/components/views/HighLevelStateSuite.tsx";

interface MinisterViewProps {
  onOpenDossier: (entityId: string) => void;
}

export function MinisterView({ onOpenDossier }: MinisterViewProps) {
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(
    PARLIAMENTARY_INQUIRIES[0]?.id || null
  );
  const [expandedQnAId, setExpandedQnAId] = useState<string | null>(
    TOP_FIRE_ALERTS[0]?.id || null
  );
  const [isKprmModalOpen, setIsKprmModalOpen] = useState(false);
  const [copiedAlertId, setCopiedAlertId] = useState<string | null>(null);

  // Nowy stan: Sala Narad KPRM (Tryb Wielkoekranowy), Generator Mandatów WZ/NWZ oraz Fiszka 30s
  const [isBigScreenOpen, setIsBigScreenOpen] = useState(false);
  const [isAgmModalOpen, setIsAgmModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [selectedBriefingId, setSelectedBriefingId] = useState<string>("br-totalizator");
  const [copiedBriefingText, setCopiedBriefingText] = useState(false);

  const [selectedAgmId, setSelectedAgmId] = useState<string>(AGM_VOTING_TEMPLATES[0].id);
  const [activeVoteChoice, setActiveVoteChoice] = useState<"ZA" | "PRZECIW" | "WSTRZYMUJĘ_SIĘ">(
    AGM_VOTING_TEMPLATES[0].recommendedVote
  );
  const [copiedAgm, setCopiedAgm] = useState(false);

  const WAR_ROOM_BRIEFINGS = [
    {
      id: "br-totalizator",
      entity: "Totalizator Sportowy Sp. z o.o.",
      ticker: "TOTALIZATOR",
      openingStatement: "Wszystkie postępowania rekrutacyjne w spółce zostały objęte natychmiastowym audytem, a stanowiska w oddziałach regionalnych zostaną obsadzone w otwartych, transparentnych konkursach.",
      hardNumbers: [
        "17 oddziałów regionalnych objętych równoległą kontrolą KAS",
        "0 tolerancji dla nepotyzmu w spółkach Skarbu Państwa",
        "Ponad 3,2 mld PLN rocznego wkładu do Funduszu Rozwoju Kultury Fizycznej",
      ],
      redLineConstraint: "Kategoryczny zakaz komentowania nazwisk b. dyrektorów przed zakończeniem czynności prokuratorskich. Nie wchodzić w wątki prywatnych relacji.",
      attributionPush: "Przez 8 lat rządów poprzedników w Totalizatorze nie przeprowadzono ani jednego otwartego konkursu na dyrektora oddziału.",
    },
    {
      id: "br-cargo",
      entity: "PKP CARGO S.A. w restrukturyzacji",
      ticker: "PKPCARGO",
      openingStatement: "Ratujemy narodowego przewoźnika towarowego przed upadłością likwidacyjną, do której doprowadziły zaniechania poprzedników i polityczna decyzja węglowa z 2022 roku.",
      hardNumbers: [
        "5,2 mld PLN zadłużenia odziedziczonego po poprzednich zarządach",
        "4 100 pracowników w programie osłonowym z gwarancją pracy w PKP Intercity i Polregio",
        "100% strategicznego taboru do przewozów wojskowych NATO zabezpieczone",
      ],
      redLineConstraint: "Zakaz używania sformułowania 'likwidacja'; konsekwentnie używać pojęcia 'sanacja prawna i ochrona przed upadłością'.",
      attributionPush: "Raport NIK z 2023 r. czarno na białym wykazał, że zniszczenie rentowności PKP Cargo to bezpośredni skutek decyzji premiera Morawieckiego.",
    },
    {
      id: "br-poczta",
      entity: "Poczta Polska S.A.",
      ticker: "POCZTA",
      openingStatement: "Przeprowadzamy plan transformacji Poczty Polskiej w nowoczesnego operatora cyfrowo-kurierskiego, gwarantując terminową wypłatę pensji dla listonoszy i ciągłość usług powszechnych.",
      hardNumbers: [
        "620 mln PLN straty netto za 2023 rok pozostawionej przez poprzedników",
        "850 mln PLN rekompensaty za świadczenie usług powszechnych odblokowane w KE",
        "0 zamkniętych placówek pocztowych na terenach wiejskich",
      ],
      redLineConstraint: "Nie wchodzić w spory personalne ze związkami zawodowymi przed kamerami; stale ponawiać zaproszenie do dialogu przy stole negocjacyjnym.",
      attributionPush: "Poprzednicy przez 8 lat ignorowali unijne wytyczne o finansowaniu usług powszechnych, doprowadzając Pocztę na skraj zapaści.",
    },
    {
      id: "br-orlen",
      entity: "ORLEN S.A.",
      ticker: "PKN",
      openingStatement: "Orlen stabilizuje rynek paliwowy, rozwija morskie farmy wiatrowe i odzyskuje wiarygodność u partnerów zagranicznych, a straty na szwajcarskiej spółce OTS wyjaśnia prokuratura.",
      hardNumbers: [
        "1,6 mld PLN odpisu na straty szwajcarskiej spółki OTS z czasów Obajtka",
        "14,2 mld PLN realnych inwestycji w morską energetykę wiatrową Baltic Power",
        "Rekordowe 38 mld PLN łącznych podatków i opłat odprowadzonych do budżetu",
      ],
      redLineConstraint: "Bezwzględna ochrona klauzul poufności kontraktów długoterminowych na dostawy ropy saudyjskiej (Saudi Aramco).",
      attributionPush: "Wszystkie zawiadomienia do prokuratury dotyczą umów i zaliczek wypłaconych bez zabezpieczeń za kadencji poprzedniego zarządu.",
    },
  ];

  const selectedBriefing =
    WAR_ROOM_BRIEFINGS.find((b) => b.id === selectedBriefingId) || WAR_ROOM_BRIEFINGS[0];

  const handleCopyBriefing = () => {
    const text = [
      `KIESZONKOWA FISZKA PRASOWA DLA MINISTRA (BRIEFING 30s)`,
      `Sprawa: ${selectedBriefing.entity} (${selectedBriefing.ticker})`,
      `--------------------------------------------------------------------------------`,
      `OTWARCIE DO KAMER (1 ZDANIE):\n"${selectedBriefing.openingStatement}"`,
      "",
      `3 TWARDE LICZBY (FAKTY):\n${selectedBriefing.hardNumbers.map((n) => `• ${n}`).join("\n")}`,
      "",
      `CZERWONA LINIA (CZEGO NIE MÓWIĆ):\n${selectedBriefing.redLineConstraint}`,
      "",
      `PRZERZUCENIE PIŁKI (POPRZEDNICY/RESORTY):\n${selectedBriefing.attributionPush}`,
      `--------------------------------------------------------------------------------`,
      `Gabinet Polityczny MAP • 20 października 2026 r.`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedBriefingText(true);
    setTimeout(() => setCopiedBriefingText(false), 3000);
  };

  const selectedAgmTemplate =
    AGM_VOTING_TEMPLATES.find((t) => t.id === selectedAgmId) || AGM_VOTING_TEMPLATES[0];

  const handleCopyAgmMandate = () => {
    const text = [
      `RZECZPOSPOLITA POLSKA • MINISTERSTWO AKTYWÓW PAŃSTWOWYCH`,
      `DEPARTAMENT NADZORU I • WYDZIAŁ KONTROLI WŁAŚCICIELSKIEJ`,
      `MANDAT WIĄŻĄCY DLA PEŁNOMOCNIKA SKARBU PAŃSTWA NA WALNE ZGROMADZENIE`,
      `--------------------------------------------------------------------------------`,
      `Spółka: ${selectedAgmTemplate.entityName} (Ticker GPW: ${selectedAgmTemplate.ticker})`,
      `Rodzaj Zgromadzenia: ${selectedAgmTemplate.meetingType === "ZWZ" ? "Zwyczajne Walne Zgromadzenie (ZWZ)" : "Nadzwyczajne Walne Zgromadzenie (NWZ)"}`,
      `Punkt Porządku Obrad: ${selectedAgmTemplate.agendaItem}`,
      `Dyspozycja Głosowania: ${activeVoteChoice}`,
      `Podstawa Prawna: ${selectedAgmTemplate.statutoryBasis}`,
      `Uzasadnienie Instrukcji Ministra:\n${selectedAgmTemplate.ministerJustification}`,
      `Czerwone Linie i Granice Pełnomocnictwa:\n${selectedAgmTemplate.redLineConstraint}`,
      `--------------------------------------------------------------------------------`,
      `Z upoważnienia Ministra Aktywów Państwowych: Podsekretarz Stanu`,
      `Sporządzono w MAP • Data: 20 października 2026 r.`,
    ].join("\n\n");

    navigator.clipboard.writeText(text);
    setCopiedAgm(true);
    setTimeout(() => setCopiedAgm(false), 3000);
  };

  const handleCopyQnA = (alertId: string) => {
    const alert = TOP_FIRE_ALERTS.find((a) => a.id === alertId);
    if (!alert || !alert.sejmQnA) return;

    const text = [
      `TARCZA SEJMOWA MAP — ${alert.entityName.toUpperCase()}`,
      `ID Sprawy: ${alert.id.toUpperCase()} | Rykoszet w MAP: ${alert.ministerImpactScore || 50}%`,
      `Geneza: ${alert.attribution === "nasza_odpowiedzialnosc" ? "Nasza odpowiedzialność (bieżąca kadencja)" : alert.attribution === "zaszlosc_historyczna" ? "Zaszłość historyczna (poprzednicy)" : "Sprawa międzyresortowa"}`,
      `Ustalenia: ${alert.attributionDetails || alert.whatHappened}`,
      "",
      ...alert.sejmQnA.map(
        (q, i) =>
          `[PYTANIE ${i + 1}]: "${q.question}"\n• ŹRÓDŁO: ${q.source}\n• FAKTY: ${q.hardFacts}\n• LINIA RESORTU: ${q.recommendedAnswer}\n• CZERWONE LINIE (NIE MÓWIĆ): ${q.redLines}\n`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedAlertId(alertId);
    setTimeout(() => setCopiedAlertId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Pasek Tytułowy Gabinetu Ministra (Układ odporny na szerokość ekranu) */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
        {/* Rząd 1: Tytuł i Barometr Kryzysowy */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#ff7f87]/15 text-[#ff7f87] border border-[#ff7f87]/30 font-bold">
                GABINET MINISTRA • KOKPIT ZARZĄDCZY
              </span>
              <span className="text-xs text-[#8e9da7]">Aktualizacja: 20 października 2026, 23:55</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1">
              Radar strategiczny, Tarcza Sejmowa i temperatura kryzysowa SSP
            </h1>
            <p className="text-xs text-[#8e9da7] mt-0.5 max-w-2xl">
              Ciągły nadzór nad portfelem 406 spółek, ochrona przed zaskoczeniem w Sejmie i odprawy gabinetowe dla Premiera.
            </p>
          </div>

          {/* Barometr temperatury kryzysowej */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111a21] border border-[rgba(159,186,199,0.14)] shrink-0 self-start lg:self-auto">
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#16222b]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#ff7f87]"
                  strokeDasharray={`${OVERALL_CRISIS_TEMPERATURE}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold font-mono text-white">
                  {OVERALL_CRISIS_TEMPERATURE}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#ff7f87]">
                <Flame className="w-3 h-3" />
                <span>STAN PODWYŻSZONY</span>
              </div>
              <p className="text-[10px] text-[#8e9da7]">
                Totalizator, Cargo, Poczta
              </p>
            </div>
          </div>
        </div>

        {/* Rząd 2: Pasek narzędziowy Gabinetu Ministra (Responsywna siatka 5 przycisków, zero overflow) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 pt-3 border-t border-[rgba(159,186,199,0.12)]">
          {/* Przycisk Tryb Sali Narad KPRM */}
          <button
            type="button"
            onClick={() => setIsBigScreenOpen(true)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111a21] hover:bg-[#1a2630] text-white border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all hover:border-cyan-400 group"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left min-w-0">
              <span className="block leading-tight text-white font-medium truncate">Sala Narad KPRM</span>
              <span className="text-[10px] text-cyan-300 font-mono block truncate">Tryb wielkoekranowy</span>
            </div>
          </button>

          {/* Przycisk Generator Mandatów WZ/NWZ */}
          <button
            type="button"
            onClick={() => setIsAgmModalOpen(true)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111a21] hover:bg-[#1a2630] text-white border border-amber-500/30 text-xs font-semibold shadow-sm transition-all hover:border-amber-400 group"
          >
            <Vote className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left min-w-0">
              <span className="block leading-tight text-white font-medium truncate">Mandat na WZ/NWZ</span>
              <span className="text-[10px] text-amber-300 font-mono block truncate">Instrukcja głosu</span>
            </div>
          </button>

          {/* Przycisk KPRM One-Pager */}
          <button
            type="button"
            onClick={() => setIsKprmModalOpen(true)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white border border-[rgba(159,186,199,0.25)] text-xs font-semibold shadow-sm transition-all hover:border-[#57e0c5]/50 group"
          >
            <FileText className="w-4 h-4 text-[#57e0c5] group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left min-w-0">
              <span className="block leading-tight text-white truncate">Raport Premiera</span>
              <span className="text-[10px] text-[#8e9da7] font-mono block truncate">KPRM One-Pager</span>
            </div>
          </button>

          {/* Przycisk Kieszonkowa Fiszka dla Mediów (30s) */}
          <button
            type="button"
            onClick={() => setIsBriefingModalOpen(true)}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111a21] hover:bg-[#1a2630] text-white border border-rose-500/30 text-xs font-semibold shadow-sm transition-all hover:border-rose-400 group"
          >
            <Radio className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left min-w-0">
              <span className="block leading-tight text-white font-medium truncate">Fiszka dla Mediów</span>
              <span className="text-[10px] text-rose-300 font-mono block truncate">Briefing 30s</span>
            </div>
          </button>

          {/* Przycisk Odprawa Poranna Audio (90s) */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("high-level-suite-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-[#111a21] hover:bg-[#1a2630] text-white border border-emerald-500/30 text-xs font-semibold shadow-sm transition-all hover:border-emerald-400 group col-span-2 sm:col-span-1"
          >
            <Volume2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <div className="text-left min-w-0">
              <span className="block leading-tight text-white font-medium truncate">Odprawa Audio</span>
              <span className="text-[10px] text-emerald-300 font-mono block truncate">90s dla Ministra</span>
            </div>
          </button>
        </div>
      </div>

      {/* Licznik Wartości Majątku Narodowego i Portfela SSP */}
      <div className="bg-[#090e13] border border-[rgba(159,186,199,0.18)] rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-bold font-mono tracking-widest uppercase text-white">
              Portfel Aktywów Skarbu Państwa • Wycena i Zasoby Strategiczne
            </h2>
          </div>
          <span className="text-[11px] text-[#8e9da7] font-mono">
            Wycena GPW & KRS: 20 października 2026, 23:55 • 406 podmiotów bez wykluczeń
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* 1. Wartość Portfela */}
          <div className="bg-[#0e161c] p-4 rounded-xl border border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8e9da7] uppercase font-semibold">Wartość portfela SSP</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">+{NATIONAL_ASSETS_PORTFOLIO_STATS.portfolioValueGrowthYoYMldPln} mld r/r</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {NATIONAL_ASSETS_PORTFOLIO_STATS.totalPortfolioValueMldPln.toLocaleString("pl-PL", { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-400">mld PLN</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Kapitalizacja giełdowa + aktywa nienotowane
            </p>
          </div>

          {/* 2. Zatrudnienie */}
          <div className="bg-[#0e161c] p-4 rounded-xl border border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8e9da7] uppercase font-semibold">Łączne zatrudnienie</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">16 województw</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {NATIONAL_ASSETS_PORTFOLIO_STATS.totalWorkforceCount.toLocaleString("pl-PL")} <span className="text-xs font-normal text-slate-400">etatów</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              W tym 142k na Śląsku i 185k na Mazowszu
            </p>
          </div>

          {/* 3. Przychody */}
          <div className="bg-[#0e161c] p-4 rounded-xl border border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8e9da7] uppercase font-semibold">Roczne przychody SSP</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">Wkład w PKB</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {NATIONAL_ASSETS_PORTFOLIO_STATS.annualAggregateRevenueMldPln.toLocaleString("pl-PL", { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-400">mld PLN</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Zagregowane obroty roczne 406 spółek
            </p>
          </div>

          {/* 4. Dywidendy do Budżetu */}
          <div className="bg-[#0e161c] p-4 rounded-xl border border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8e9da7] uppercase font-semibold">Dywidendy dla Budżetu</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Wykonanie: 47%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {NATIONAL_ASSETS_PORTFOLIO_STATS.projectedDividends2026MldPln.toLocaleString("pl-PL", { minimumFractionDigits: 1 })} <span className="text-xs font-normal text-slate-400">mld PLN</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Zaksięgowano: {NATIONAL_ASSETS_PORTFOLIO_STATS.realizedDividends2026MldPln} mld PLN na dochodach MF
            </p>
          </div>
        </div>
      </div>

      {/* Pakiet Strategiczny High-Level: Rezerwy Surowcowe, Tarcza Wrogiego Przejęcia, Kowenanty i Odprawa 90s */}
      <div id="high-level-suite-section">
        <HighLevelStateSuite onOpenDossier={onOpenDossier} />
      </div>

      {/* Kwadrantowa macierz ryzyka właścicielskiego 2D */}
      <RiskMatrixScatterPlot
        onSelectPoint={(pt) => {
          // Jeśli spółka ma odpowiednik w katalogu, otwieramy jej dossier
          const match = TOP_FIRE_ALERTS.find((a) =>
            a.entityName.toLowerCase().includes(pt.tickerOrAlias.toLowerCase())
          );
          if (match) {
            onOpenDossier(match.entityId);
          }
        }}
      />

      {/* Centrum Testów Szokowych i Odporności Portfela SSP (Stress-Test Simulator) */}
      <PortfolioStressTestSimulator />

      {/* Moduł: Najważniejsze pożary dnia (Top Alerts P1/P2) z Tarczą Sejmową */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff7f87]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Najważniejsze pożary dnia i Tarcza Sejmowa
            </h2>
          </div>
          <span className="text-xs text-[#8e9da7] font-mono">
            {TOP_FIRE_ALERTS.length} pilnych spraw wymagających decyzji
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TOP_FIRE_ALERTS.map((alert) => {
            const isP1 = alert.priority === "p1";
            const isQnAExpanded = expandedQnAId === alert.id;
            const hasQnA = alert.sejmQnA && alert.sejmQnA.length > 0;

            let attributionBadge = {
              text: "ZASZŁOŚĆ HISTORYCZNA",
              bg: "bg-[#75b8ff]/15 text-[#75b8ff] border-[#75b8ff]/30",
            };
            if (alert.attribution === "nasza_odpowiedzialnosc") {
              attributionBadge = {
                text: "NASZA ODPOWIEDZIALNOŚĆ",
                bg: "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40",
              };
            } else if (alert.attribution === "miedzyresortowa") {
              attributionBadge = {
                text: "SPRAWA MIĘDZYRESORTOWA",
                bg: "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40",
              };
            }

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isP1
                    ? "bg-[#140b0f] border-[#ff7f87]/40 shadow-lg shadow-[#ff7f87]/5"
                    : "bg-[#12110c] border-[#f6c56b]/35 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                          isP1
                            ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                            : "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                        }`}
                      >
                        {isP1 ? "ALARM KRYZYSOWY P1" : "OSTRZEŻENIE P2"}
                      </span>
                      <span
                        className={`text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${attributionBadge.bg}`}
                      >
                        {attributionBadge.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {alert.ministerImpactScore && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16222b] text-[#ff7f87] font-bold border border-[#ff7f87]/25">
                          RYKOSZET: {alert.ministerImpactScore}%
                        </span>
                      )}
                      <span className="text-[11px] text-[#8e9da7] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => onOpenDossier(alert.entityId)}
                      className="text-xs font-semibold text-[#75b8ff] hover:text-[#57e0c5] transition-colors flex items-center gap-1 text-left"
                    >
                      <span>{alert.entityName}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                      {alert.title}
                    </h3>
                  </div>

                  {/* Kwartet analityczny */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#070a0d]/80 border border-[rgba(159,186,199,0.08)]">
                      <span className="text-[10px] font-mono uppercase text-[#8e9da7] font-semibold block">
                        Co się stało & Geneza polityczna:
                      </span>
                      <p className="text-white mt-0.5 leading-relaxed">{alert.whatHappened}</p>
                      {alert.attributionDetails && (
                        <p className="text-[11px] text-[#75b8ff] mt-1 italic border-t border-[rgba(159,186,199,0.1)] pt-1">
                          {alert.attributionDetails}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-[#070a0d]/80 border border-[rgba(159,186,199,0.08)]">
                        <span className="text-[10px] font-mono uppercase text-[#8e9da7] font-semibold block">
                          Kto odpowiada:
                        </span>
                        <p className="text-white mt-0.5">{alert.whoResponsible}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#070a0d]/80 border border-[rgba(159,186,199,0.08)]">
                        <span className="text-[10px] font-mono uppercase text-[#ff7f87] font-semibold block">
                          Ryzyko dla rządu / MAP:
                        </span>
                        <p className="text-white mt-0.5">{alert.governmentRisk}</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#111a21] border border-[rgba(87,224,197,0.3)]">
                      <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Rekomendowany krok dla Ministra:</span>
                      </span>
                      <p className="text-white font-medium mt-0.5 leading-relaxed">
                        {alert.recommendedAction}
                      </p>
                    </div>

                    {/* Moduł Tarczy Sejmowej per Alert */}
                    {hasQnA && (
                      <div className="mt-3 pt-3 border-t border-[rgba(159,186,199,0.12)]">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setExpandedQnAId(isQnAExpanded ? null : alert.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#e5b958] hover:text-white transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Tarcza Sejmowa & Pancerne Q&A ({alert.sejmQnA?.length} pytania)</span>
                            {isQnAExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyQnA(alert.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-[#16222b] hover:bg-[#1f2f3c] text-[10px] text-[#8e9da7] hover:text-white border border-[rgba(159,186,199,0.14)] transition-colors"
                            title="Kopiuj do schowka telefonu"
                          >
                            {copiedAlertId === alert.id ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-[#57e0c5]" />
                                <span className="text-[#57e0c5]">Skopiowano!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Kopiuj na telefon</span>
                              </>
                            )}
                          </button>
                        </div>

                        {isQnAExpanded && (
                          <div className="mt-2.5 space-y-2.5 pl-2 border-l-2 border-[#e5b958]/40 animate-in fade-in duration-150">
                            {alert.sejmQnA?.map((q, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-lg bg-[#070a0d] border border-[#e5b958]/20 space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-white leading-tight">
                                    💬 {q.question}
                                  </span>
                                  <span className="text-[9px] font-mono text-[#8e9da7] shrink-0 px-1.5 py-0.5 rounded bg-[#111a21]">
                                    {q.source}
                                  </span>
                                </div>

                                <div className="text-[11px] text-[#8e9da7] bg-[#111a21]/50 p-2 rounded">
                                  <strong className="text-white">Twarde fakty:</strong> {q.hardFacts}
                                </div>

                                <div className="text-[11px] text-[#57e0c5] bg-[#57e0c5]/10 border border-[#57e0c5]/20 p-2 rounded leading-relaxed">
                                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider text-[#57e0c5]">
                                    Zalecana linia obrony resortu:
                                  </strong>
                                  {q.recommendedAnswer}
                                </div>

                                <div className="text-[11px] text-[#ff7f87] bg-[#ff7f87]/10 border border-[#ff7f87]/25 p-2 rounded leading-relaxed">
                                  <strong className="text-white block font-mono text-[9px] uppercase tracking-wider text-[#ff7f87] flex items-center gap-1">
                                    <AlertOctagon className="w-3 h-3" />
                                    Czerwone linie (Czego kategorycznie NIE mówić):
                                  </strong>
                                  {q.redLines}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(159,186,199,0.1)] flex items-center justify-between">
                  <span className="text-[11px] text-[#5d6b74]">
                    ID sprawy: {alert.id.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenDossier(alert.entityId)}
                    className="px-3 py-1 rounded bg-[#16222b] hover:bg-[#1f2f3c] text-xs text-white border border-[rgba(159,186,199,0.14)] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Otwórz Dossier 360°</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dwie kolumny: Mapa sektorowa stabilności + Rejestr interpelacji i ataków */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mapa sektorowa */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#75b8ff]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Mapa sektorowa stabilności
              </h2>
            </div>
            <span className="text-xs text-[#8e9da7] font-mono">6 sektorów kluczowych</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SECTOR_STABILITY_DATA.map((sector) => {
              let statusBorder = "border-[rgba(159,186,199,0.14)]";
              let statusText = "text-[#57e0c5]";
              let statusBg = "bg-[#0d1318]";

              if (sector.status === "krytyczny") {
                statusBorder = "border-[#ff7f87]/40";
                statusText = "text-[#ff7f87]";
                statusBg = "bg-[#140b0f]";
              } else if (sector.status === "podwyższone_ryzyko") {
                statusBorder = "border-[#f6c56b]/35";
                statusText = "text-[#f6c56b]";
                statusBg = "bg-[#12110c]";
              }

              return (
                <div
                  key={sector.name}
                  className={`p-4 rounded-xl border ${statusBorder} ${statusBg} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{sector.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#16222b] text-[#8e9da7]">
                        {sector.entitiesCount} SSP
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-[11px] text-[#8e9da7]">Temperatura:</span>
                      <span className={`text-base font-bold font-mono ${statusText}`}>
                        {sector.temperature}/100
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-[#8e9da7] line-clamp-2">
                      {sector.primaryIssue}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[10px]">
                    <span className="text-[#5d6b74] uppercase font-mono tracking-wider">
                      Status sektora
                    </span>
                    <span className={`font-bold uppercase font-mono ${statusText}`}>
                      {sector.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejestr interpelacji poselskich i postępowań kontrolnych */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-[#e5b958]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Interpelacje i uderzenia w kierownictwo MAP
              </h2>
            </div>
            <span className="text-xs text-[#8e9da7] font-mono">
              {PARLIAMENTARY_INQUIRIES.length} aktywne sprawy
            </span>
          </div>

          <div className="space-y-3">
            {PARLIAMENTARY_INQUIRIES.map((inq) => {
              const isExpanded = expandedInquiryId === inq.id;
              const isCritical = inq.priority === "critical";

              return (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#e5b958]">
                          {inq.number}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            isCritical
                              ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                              : "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                          }`}
                        >
                          {inq.deadline}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white mt-1 leading-snug">
                        {inq.subject}
                      </h3>
                      <p className="text-[11px] text-[#8e9da7] mt-0.5">
                        Wnioskodawca: {inq.author} • Adresat: {inq.addressedTo}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedInquiryId(isExpanded ? null : inq.id)}
                      className="p-1 rounded text-[#8e9da7] hover:text-white hover:bg-[#16222b]"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 border-t border-[rgba(159,186,199,0.1)] space-y-2 animate-in fade-in duration-150">
                      <div className="text-[11px] text-[#57e0c5] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Rekomendowane linie odpowiedzi dla Ministra:</span>
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#8e9da7]">
                        {inq.suggestedAnswerPoints.map((point, i) => (
                          <li key={i} className="leading-relaxed">
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 text-[10px] text-[#5d6b74] font-mono">
                        Status roboczy: {inq.status}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Moduł: Infrastruktura Krytyczna i Bezpieczeństwo Państwa (RCB / ABW / CSIRT GOV) */}
      <div className="bg-[#090e13] border border-[rgba(159,186,199,0.18)] rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-slate-800/80 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Infrastruktura Krytyczna i Bezpieczeństwo Państwa (Art. 5b Ustawy o ZK)
              </h3>
            </div>
            <p className="text-xs text-[#8e9da7] mt-0.5">
              Ciągłość operacyjna instalacji strategicznych Skarbu Państwa oraz odporność cybernetyczna w reżimie CHARLIE-CRP
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-pulse">
              STOPIEŃ ALARMOWY: CHARLIE-CRP
            </span>
            <span className="text-[10px] font-mono text-[#8e9da7] px-2 py-1 rounded bg-[#111a21] border border-slate-800">
              Zarządzenie Premiera nr 142/2026
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRITICAL_INFRASTRUCTURE_SECTORS.map((sector) => (
            <div
              key={sector.id}
              className="bg-[#0e161c] p-4 rounded-xl border border-[rgba(159,186,199,0.12)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-xs font-bold text-white">{sector.sectorName}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                    {sector.alertLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="bg-[#070a0d] p-2 rounded border border-slate-800/60">
                    <span className="text-[9px] text-[#8e9da7] block uppercase">Ciągłość operacyjna</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{sector.operationalContinuityPercent}%</span>
                  </div>
                  <div className="bg-[#070a0d] p-2 rounded border border-slate-800/60">
                    <span className="text-[9px] text-[#8e9da7] block uppercase">Zablokowane ataki 24h</span>
                    <span className="text-sm font-mono font-bold text-blue-400">{sector.cyberAttacksBlocked24h.toLocaleString("pl-PL")}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070a0d] p-2.5 rounded border border-slate-800/60">
                  {sector.threatSummary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-[#8e9da7]">
                <span className="text-slate-400 block font-semibold">Jednostka wiodąca:</span>
                <span className="font-mono text-slate-300">{sector.leadAgency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kalendarzowa mapa cieplna aktywności kryzysowej i posiedzeń Sejmu */}
      <CalendarHeatmapChart />

      {/* Modal KPRM One-Pager dla Premiera */}
      {isKprmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b1014] border border-[rgba(159,186,199,0.2)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Nagłówek Modalu */}
            <div className="p-6 border-b border-[rgba(159,186,199,0.14)] bg-[#0e161c] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#57e0c5]/20 text-[#57e0c5] border border-[#57e0c5]/40 font-bold">
                    DOKUMENT RZĄDOWY • DLA PREZESA RADY MINISTRÓW
                  </span>
                  <span className="text-xs text-[#8e9da7] font-mono">
                    {KPRM_ONE_PAGER_DATA.targetCabinetMeetingDate}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  {KPRM_ONE_PAGER_DATA.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs text-white border border-[rgba(159,186,199,0.2)] flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-[#75b8ff]" />
                  <span>Drukuj / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsKprmModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#16222b] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Treść Dokumentu KPRM */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-[#111a21] border border-[#57e0c5]/30">
                <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-bold block mb-1">
                  Syntetyczny meldunek dla Premiera:
                </span>
                <p className="text-white leading-relaxed text-xs sm:text-sm">
                  {KPRM_ONE_PAGER_DATA.executiveSummary}
                </p>
              </div>

              {/* Cztery kluczowe punkty decyzyjne */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-[#8e9da7] font-bold tracking-wider">
                  Kluczowe sprawy operacyjne i wnioski o decyzję:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {KPRM_ONE_PAGER_DATA.items.map((item, idx) => {
                    let catLabel = "INFORMACJA";
                    let catStyle = "bg-[#75b8ff]/20 text-[#75b8ff] border-[#75b8ff]/40";
                    if (item.category === "pozar_wygaszony") {
                      catLabel = "POŻAR WYGASZONY";
                      catStyle = "bg-[#57e0c5]/20 text-[#57e0c5] border-[#57e0c5]/40";
                    } else if (item.category === "sukces") {
                      catLabel = "SUKCES OPERACYJNY";
                      catStyle = "bg-[#57e0c5]/20 text-[#57e0c5] border-[#57e0c5]/40";
                    } else if (item.category === "ryzyko_miedzyresortowe") {
                      catLabel = "RYZYKO MIĘDZYRESORTOWE";
                      catStyle = "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40";
                    } else if (item.category === "decyzja_premiera") {
                      catLabel = "WYMAGANA DECYZJA PREMIERA";
                      catStyle = "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40";
                    }

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.12)] space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${catStyle}`}
                            >
                              {catLabel}
                            </span>
                            <span className="text-[10px] text-[#8e9da7] font-mono">
                              {item.entityName}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-2 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-[#8e9da7] mt-1 leading-relaxed">
                            {item.details}
                          </p>
                        </div>

                        {item.actionRequired && (
                          <div className="mt-2 pt-2 border-t border-[rgba(159,186,199,0.1)] text-[11px] text-[#ff7f87] font-medium flex items-start gap-1">
                            <Target className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>Wniosek: {item.actionRequired}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabela restrukturyzacji flagowych spółek */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-[#8e9da7] font-bold tracking-wider">
                  Postępy restrukturyzacji flagowych grup kapitałowych:
                </h3>
                <div className="border border-[rgba(159,186,199,0.14)] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111a21] text-[#8e9da7] font-mono text-[10px] uppercase border-b border-[rgba(159,186,199,0.1)]">
                      <tr>
                        <th className="p-3">Podmiot</th>
                        <th className="p-3">Docelowe oszczędności</th>
                        <th className="p-3">Korekta etatowa / osłony</th>
                        <th className="p-3">Stan bieżący</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(159,186,199,0.08)] bg-[#070a0d]">
                      {KPRM_ONE_PAGER_DATA.restructuringProgress.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#111a21]/50">
                          <td className="p-3 font-semibold text-white">{row.entityName}</td>
                          <td className="p-3 text-[#57e0c5] font-mono">{row.targetSavings}</td>
                          <td className="p-3 text-[#f6c56b]">{row.headcountChange}</td>
                          <td className="p-3 text-[#8e9da7]">{row.currentStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Stopka Modalu */}
            <div className="p-4 border-t border-[rgba(159,186,199,0.14)] bg-[#0e161c] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#5d6b74] font-mono">
                System MAPscope • Wersja gabinetowa v1.4
              </span>
              <button
                type="button"
                onClick={() => setIsKprmModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white transition-colors"
              >
                Zamknij podgląd
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generatora Mandatów na Walne Zgromadzenie (WZ / NWZ) */}
      {isAgmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b1014] border border-[rgba(159,186,199,0.2)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Nagłówek Modalu */}
            <div className="p-6 border-b border-[rgba(159,186,199,0.14)] bg-[#0e161c] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    NADZÓR WŁAŚCICIELSKI • KODEKS SPÓŁEK HANDLOWYCH
                  </span>
                  <span className="text-xs text-[#8e9da7] font-mono">
                    Art. 7 Ustawy o zasadach zarządzania mieniem państwowym
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Generator Wiążących Mandatów dla Pełnomocnika Skarbu Państwa na WZ/NWZ
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAgmMandate}
                  className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs text-white border border-[rgba(159,186,199,0.2)] flex items-center gap-1.5 transition-colors"
                >
                  {copiedAgm ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Skopiowano</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#75b8ff]" />
                      <span>Kopiuj mandat</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAgmModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#16222b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ciało Modalu */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Wybór spółki z listy spraw strategicznych */}
              <div>
                <span className="text-xs font-mono uppercase text-[#8e9da7] font-bold block mb-2">
                  1. Wybierz spółkę i punkt porządku obrad:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AGM_VOTING_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedAgmId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedAgmId(tmpl.id);
                          setActiveVoteChoice(tmpl.recommendedVote);
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/50"
                            : "bg-[#070a0d] border-[rgba(159,186,199,0.12)] hover:border-amber-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{tmpl.entityName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111a21] text-amber-300 border border-slate-700 font-bold">
                            {tmpl.meetingType} • {tmpl.ticker}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                          {tmpl.agendaItem}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dyspozycja głosowania */}
              <div className="p-5 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.14)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#8e9da7] font-bold">
                    2. Wiążąca dyspozycja głosowania Ministra:
                  </span>
                  <span className="text-xs text-slate-400">
                    Spółka: <strong className="text-white">{selectedAgmTemplate.entityName}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveVoteChoice("ZA")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      activeVoteChoice === "ZA"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30"
                        : "bg-[#111a21] text-slate-300 border-slate-800 hover:border-emerald-500/50"
                    }`}
                  >
                    GŁOSOWAĆ ZA UCHWAŁĄ
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVoteChoice("PRZECIW")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      activeVoteChoice === "PRZECIW"
                        ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30"
                        : "bg-[#111a21] text-slate-300 border-slate-800 hover:border-red-500/50"
                    }`}
                  >
                    GŁOSOWAĆ PRZECIW UCHWALE
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVoteChoice("WSTRZYMUJĘ_SIĘ")}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                      activeVoteChoice === "WSTRZYMUJĘ_SIĘ"
                        ? "bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30"
                        : "bg-[#111a21] text-slate-300 border-slate-800 hover:border-amber-500/50"
                    }`}
                  >
                    WSTRZYMAĆ SIĘ OD GŁOSU
                  </button>
                </div>

                {/* Uzasadnienie i Podstawa prawna */}
                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-[#8e9da7] uppercase font-semibold block mb-1">
                      Podstawa prawna polecenia:
                    </span>
                    <p className="text-xs font-mono text-cyan-300 bg-[#0e161c] p-2.5 rounded border border-slate-800">
                      {selectedAgmTemplate.statutoryBasis}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#8e9da7] uppercase font-semibold block mb-1">
                      Merytoryczne uzasadnienie decyzji właścicielskiej:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed bg-[#0e161c] p-3 rounded border border-slate-800">
                      {selectedAgmTemplate.ministerJustification}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-red-400 uppercase font-semibold block mb-1">
                      Czerwona linia pełnomocnika (Granice swobody decyzji):
                    </span>
                    <p className="text-xs text-red-200 leading-relaxed bg-red-950/30 p-3 rounded border border-red-500/30">
                      {selectedAgmTemplate.redLineConstraint}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stopka Modalu */}
            <div className="p-4 border-t border-[rgba(159,186,199,0.14)] bg-[#0e161c] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#5d6b74] font-mono">
                Mandat prawny MAP • Sygnatura: MAP-DW-WZ/2026/088
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyAgmMandate}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Zatwierdź i kopiuj do wysłania</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAgmModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white transition-colors"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sala Narad KPRM — Pełnoekranowy Tryb Wielkoekranowy */}
      {isBigScreenOpen && (
        <div className="fixed inset-0 z-[100] bg-[#04070a] p-6 text-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
          {/* Wielkoekranowy Pasek Tytułowy */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold block">
                  RZECZPOSPOLITA POLSKA • GABINET MINISTRA AKTYWÓW PAŃSTWOWYCH
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  Centrum Dowodzenia KPRM • Kokpit Operacyjny Sali Narad
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Czas systemowy</span>
                <span className="text-sm font-mono font-bold text-white">20 października 2026 r. • 23:59 CEST</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs font-mono flex items-center gap-2">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>TEMPERATURA: {OVERALL_CRISIS_TEMPERATURE}/100</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBigScreenOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Wyjdź z trybu sali narad</span>
              </button>
            </div>
          </div>

          {/* Centralny Układ Trójkolumnowy dla Sali Narad */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 flex-1">
            {/* Kolumna Lewa: Wycena Majątku i Czerwona Strefa KPRM */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                  Zagregowana wartość portfela Skarbu Państwa
                </span>
                <div className="text-4xl font-black font-mono text-emerald-400 mt-1">
                  384,5 <span className="text-lg font-normal text-slate-300">mld PLN</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Zatrudnienie SSP</span>
                    <span className="font-mono font-bold text-white text-base">412 850 os.</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Dywidendy dla MF</span>
                    <span className="font-mono font-bold text-emerald-400 text-base">18,40 mld PLN</span>
                  </div>
                </div>
              </div>

              {/* Pożary Czerwonej Strefy KPRM */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-red-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-red-500/20">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Czerwona strefa KPRM (Pilna uwaga)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-red-300 font-bold">4 podmioty</span>
                </div>

                <div className="space-y-2.5">
                  {TOP_FIRE_ALERTS.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white truncate block">
                          {alert.entityName}
                        </span>
                        <p className="text-[11px] text-slate-400 truncate">
                          {alert.title}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block uppercase">Rykoszet</span>
                        <span className="text-xs font-mono font-bold text-red-400">
                          {alert.ministerImpactScore || 85}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolumna Środkowa: Rozkład Regionalny (16 Województw) */}
            <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-blue-400 tracking-wider">
                      Geolokalizacja aktywów i napięć
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      16 Województw — Ogniska sporów zbiorowych
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">406 podmiotów</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {VOIVODESHIP_REGIONAL_DATA.slice(0, 8).map((v) => (
                    <div
                      key={v.id}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        v.riskStatus === "krytyczny"
                          ? "bg-red-950/20 border-red-500/40 text-red-200"
                          : v.riskStatus === "podwyższone_ryzyko"
                          ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{v.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          {v.workforceCount.toLocaleString("pl-PL")} pracowników
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {v.entitiesCount} SSP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
                <span>Stan gotowości strajkowej na Śląsku: JSW i PGG</span>
                <span className="font-mono text-emerald-400">Tryb operacyjny aktywny</span>
              </div>
            </div>

            {/* Kolumna Prawa: Infrastruktura Krytyczna i Tarcza Sejmowa */}
            <div className="lg:col-span-3 space-y-5">
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Infrastruktura Krytyczna</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                    CHARLIE-CRP
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-200">PSE / PERN / Gaz-System</span>
                      <span className="font-mono text-emerald-400">99.98%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Ochrona terminali morskich</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-200">PKP PLK / Port Gdańsk</span>
                      <span className="font-mono text-emerald-400">99.40%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Korytarze wojskowe i tranzyt</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-200">Exatel / PWPW / COI</span>
                      <span className="font-mono text-blue-400">3 640 DDoS</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Zablokowane ataki 24h</span>
                  </div>
                </div>
              </div>

              {/* Tarcza Sejmowa */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-amber-400 block tracking-wider font-bold">
                  Najbliższe posiedzenie Sejmu
                </span>
                <h4 className="text-xs font-bold text-white">
                  Interpelacje priorytetowe z gotową linią resortu
                </h4>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-semibold text-amber-300">Interpelacja 4118 (Totalizator Sportowy)</div>
                  <div className="text-[10px] text-slate-400">Linia: Niezależny audyt postępowań rekrutacyjnych i kontrola KAS.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dolny Pasek Notowań Giełdowych WIG-SSP w Czasie Rzeczywistym */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
            <span className="text-slate-400 font-semibold uppercase text-[10px] shrink-0">
              Notowania GPW na żywo:
            </span>
            <div className="flex items-center gap-6 overflow-x-auto text-[11px]">
              {STOCK_EXCHANGE_DATA.slice(0, 8).map((st) => (
                <div key={st.ticker} className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-white">{st.ticker}:</span>
                  <span className="text-slate-200">{st.currentPricePln.toFixed(2)} PLN</span>
                  <span className={st.change1dPercent >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {st.change1dPercent >= 0 ? `+${st.change1dPercent}%` : `${st.change1dPercent}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Kieszonkowa Fiszka Przedkonferencyjna w 30 Sekund */}
      {isBriefingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b1014] border border-rose-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Nagłówek Modalu */}
            <div className="p-6 border-b border-rose-500/20 bg-[#12080c] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    GABINET POLITYCZNY MAP • OCHRONA PRZED MIKROFONAMI
                  </span>
                  <span className="text-xs text-[#8e9da7] font-mono">
                    Briefing przedkonferencyjny w 30 sekund
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Kieszonkowa Fiszka Prasowa Ministra: {selectedBriefing.entity}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBriefing}
                  className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs text-white border border-[rgba(159,186,199,0.2)] flex items-center gap-1.5 transition-colors"
                >
                  {copiedBriefingText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Skopiowano</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-400" />
                      <span>Kopiuj SMS / Signal</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBriefingModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#16222b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Ciało Fiszki */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Wybór tematu kryzysowego */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#8e9da7] font-bold block mb-2">
                  Wybierz sprawę pod presją dziennikarzy:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WAR_ROOM_BRIEFINGS.map((b) => {
                    const isSelected = selectedBriefingId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBriefingId(b.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/50"
                            : "bg-[#070a0d] border-slate-800 hover:border-rose-500/30"
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-white block">
                          {b.ticker}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          {b.entity.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1. Otwarcie do kamer */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-950 border border-rose-500/30 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">
                  1. Otwarcie do kamer (Główne zdanie przekazu — linia twarda):
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  &ldquo;{selectedBriefing.openingStatement}&rdquo;
                </p>
              </div>

              {/* 2. Trzy twarde liczby */}
              <div className="p-4 rounded-xl bg-[#070a0d] border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                  2. Trzy twarde liczby (Pancerny kwartet faktów — nie do podważenia):
                </span>
                <div className="space-y-1.5">
                  {selectedBriefing.hardNumbers.map((num, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Czerwona linia */}
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-red-300 font-bold">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>3. Czerwona linia (Czego kategorycznie NIE mówić przed kamerami):</span>
                </div>
                <p className="text-xs text-red-200 leading-relaxed font-medium">
                  {selectedBriefing.redLineConstraint}
                </p>
              </div>

              {/* 4. Przerzucenie piłki */}
              <div className="p-4 rounded-xl bg-[#070a0d] border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                  4. Przerzucenie piłki (Geneza i zaszłości poprzedników):
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedBriefing.attributionPush}
                </p>
              </div>
            </div>

            {/* Stopka Modalu */}
            <div className="p-4 border-t border-slate-800 bg-[#0e161c] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#5d6b74] font-mono">
                MAPscope • Błyskawiczny pulpit briefingowy
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyBriefing}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopiuj do schowka telefonu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBriefingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white transition-colors"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
