"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Landmark,
  Scale,
  FileText,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Copy,
  Check,
  TrendingDown,
  TrendingUp,
  Building2,
  Coins,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Code2,
  Database,
  UploadCloud,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Layers,
} from "lucide-react";
import {
  STRATEGIC_RESERVE_INDICATORS,
  FOREIGN_TAKEOVER_SHIELD_ENTITIES,
  DEBT_STABILITY_RECORDS,
  MORNING_CABINET_BRIEFING,
} from "@/lib/mapscope-data.ts";
import {
  OFFICIAL_GPW_PERIODIC_REPORTS,
  parseEspiXbrlContent,
} from "@/lib/espi-xbrl-parser.ts";
import type {
  StrategicReserveIndicator,
  ForeignTakeoverShieldEntity,
  DebtStabilityRecord,
  EspiXbrlPeriodicReport,
} from "@/lib/types.ts";

interface HighLevelStateSuiteProps {
  onOpenDossier?: (entityId: string) => void;
  onOpenAudioBriefModal?: () => void;
}

export function HighLevelStateSuite({
  onOpenDossier,
  onOpenAudioBriefModal,
}: HighLevelStateSuiteProps) {
  // Stan podnarzędzi wykonawczych pod stale widocznym Radarem
  const [activeToolkitTab, setActiveToolkitTab] = useState<"TARCZA" | "KOWENANTY" | "ODPRAWA" | "DIAGNOZA">("TARCZA");

  // Stan symulacji odtwarzacza audio w odprawie
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [isDecisionSigned, setIsDecisionSigned] = useState(false);
  const [copiedDecision, setCopiedDecision] = useState(false);

  // Stan sprzeciwu ministra w module tarczy
  const [isVetoModalOpen, setIsVetoModalOpen] = useState(false);
  const [selectedVetoEntity, setSelectedVetoEntity] = useState<ForeignTakeoverShieldEntity | null>(null);
  const [vetoJustification, setVetoJustification] = useState(
    "Podejrzenie niejawnego działania na rzecz podmiotu objętego sankcjami międzynarodowymi oraz naruszenie art. 4 ust. 1 ustawy o kontroli niektórych inwestycji."
  );
  const [vetoIssued, setVetoIssued] = useState(false);

  // Stan bezpośredniego parsera raportów okresowych GPW (XBRL/ESPI)
  const [covenantSubTab, setCovenantSubTab] = useState<"PORTFEL" | "PARSER_XBRL">("PORTFEL");
  const [selectedXbrlReportId, setSelectedXbrlReportId] = useState<string>("xbrl-att-20250930");
  const [customXmlInput, setCustomXmlInput] = useState<string>("");
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [parsedCustomReport, setParsedCustomReport] = useState<EspiXbrlPeriodicReport | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [copiedXbrlReport, setCopiedXbrlReport] = useState(false);
  const [showTagsDetails, setShowTagsDetails] = useState(false);

  // Efekt symulujący postęp odtwarzania audio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= MORNING_CABINET_BRIEFING.audioDurationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOpenVeto = (entity: ForeignTakeoverShieldEntity) => {
    setSelectedVetoEntity(entity);
    setIsVetoModalOpen(true);
    setVetoIssued(false);
  };

  const handleExecuteVeto = () => {
    setVetoIssued(true);
    setTimeout(() => {
      setIsVetoModalOpen(false);
    }, 2000);
  };

  const totalNetDebtMldPln = DEBT_STABILITY_RECORDS.reduce((sum, r) => sum + r.netDebtMldPln, 0);
  const breachedCovenantsCount = DEBT_STABILITY_RECORDS.filter((r) => r.isCovenantBreached).length;

  const handleParseCustomXml = () => {
    setParseError(null);
    try {
      if (!customXmlInput.trim()) {
        setParseError("Wklej treść raportu XML lub iXBRL.");
        return;
      }
      const parsed = parseEspiXbrlContent(customXmlInput);
      setParsedCustomReport(parsed);
      setIsCustomInputOpen(false);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Nieprawidłowy format raportu XBRL/ESPI.");
    }
  };

  const activeXbrlReport: EspiXbrlPeriodicReport =
    parsedCustomReport ||
    OFFICIAL_GPW_PERIODIC_REPORTS.find((r) => r.id === selectedXbrlReportId) ||
    OFFICIAL_GPW_PERIODIC_REPORTS[0];

  const handleCopyXbrlReport = () => {
    const text = `MAPscope • AUDYT KOWENANTOWY XBRL/ESPI
Podmiot: ${activeXbrlReport.entityName} (${activeXbrlReport.ticker})
Raport: ${activeXbrlReport.reportNumber} (okres do: ${activeXbrlReport.periodEnded})
Standard: ${activeXbrlReport.reportStandard}
Przychody ze sprzedaży: ${activeXbrlReport.revenueMlnPln.toLocaleString("pl-PL")} mln PLN
Zysk operacyjny (EBIT): ${activeXbrlReport.operatingProfitEbitMlnPln.toLocaleString("pl-PL")} mln PLN
Amortyzacja: ${activeXbrlReport.depreciationMlnPln.toLocaleString("pl-PL")} mln PLN
Skalkulowana EBITDA: ${activeXbrlReport.calculatedEbitdaMlnPln.toLocaleString("pl-PL")} mln PLN
Dług brutto: ${activeXbrlReport.totalGrossDebtMlnPln.toLocaleString("pl-PL")} mln PLN
Środki pieniężne: ${activeXbrlReport.cashAndEquivalentsMlnPln.toLocaleString("pl-PL")} mln PLN
Dług netto: ${activeXbrlReport.netDebtMlnPln.toLocaleString("pl-PL")} mln PLN (${activeXbrlReport.covenant.netDebtMldPln} mld PLN)
Dług Netto / EBITDA: ${activeXbrlReport.covenant.netDebtToEbitda !== null ? activeXbrlReport.covenant.netDebtToEbitda + "x" : "NIEWYZNACZALNY (EBITDA UJEMNA)"}
Status kowenantu: ${activeXbrlReport.covenant.status} (limit: ${activeXbrlReport.covenant.covenantLimit}x)
Wymóg waiver / standstill: ${activeXbrlReport.covenant.waiverRequired ? "TAK" : "NIE"}
Rekomendacja dla MAP: ${activeXbrlReport.covenant.ministerialRecommendation}`;

    navigator.clipboard.writeText(text);
    setCopiedXbrlReport(true);
    setTimeout(() => setCopiedXbrlReport(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. MASTER RADAR SUWERENNOŚCI SUROWCOWEJ I REZERW RP (STALE WIDOCZNY)     */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Pasek Tytułowy Radaru Strategicznego */}
        <div className="p-4 rounded-xl bg-[#0b1116] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                RADAR STRATEGICZNY SUWERENNOŚCI GOSPODARCZEJ RP
              </span>
              <span className="text-xs text-[#8e9da7]">Rezerwy interwencyjne • RARS • PERN • Gaz-System</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" />
              Radar zapasów krytycznych, suwerenności surowcowej i ciągłości gospodarczej
            </h2>
            <p className="text-xs text-[#8e9da7] mt-0.5">
              Ciągły monitoring buforów bezpieczeństwa energetycznego, paliwowego, węglowego i nawozowego Rzeczypospolitej Polskiej.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg font-semibold">
              Standard UE: Min. 90 dni paliw / 80% gazu
            </span>
          </div>
        </div>

        {/* Siatka 5 Wskaźników Radaru (Permanentnie w widoku) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {STRATEGIC_RESERVE_INDICATORS.map((res) => {
            const isWarning = res.status === "OSTRZEGAWCZY";
            const percentOfMin = Math.round((res.currentLevelValue / res.mandatoryMinimumValue) * 100);

            return (
              <div
                key={res.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isWarning
                    ? "bg-[#18120c] border-amber-500/40 shadow-sm"
                    : "bg-[#0d1419] border-[rgba(159,186,199,0.14)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono text-[#8e9da7] uppercase tracking-wider truncate">
                      {res.supervisingEntity.split("/")[0]}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                        isWarning
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2 leading-tight line-clamp-2">
                    {res.resourceName}
                  </h4>

                  {/* Wskaźnik liczbowy i pasek poziomu */}
                  <div className="bg-[#121c23] p-2.5 rounded-lg border border-[rgba(159,186,199,0.1)] mb-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-[#8e9da7]">Stan:</span>
                      <span className="text-base font-bold font-mono text-white">
                        {res.currentLevelValue}{" "}
                        <span className="text-[10px] font-normal text-slate-400">{res.unit}</span>
                      </span>
                    </div>

                    <div className="w-full bg-[#182631] h-2 rounded-full overflow-hidden mt-1.5 relative">
                      {/* Wskaźnik wymogu minimalnego (kreska) */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10"
                        style={{
                          left: `${Math.min(
                            100,
                            (res.mandatoryMinimumValue /
                              Math.max(res.currentLevelValue, res.mandatoryMinimumValue * 1.25)) *
                              100
                          )}%`,
                        }}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? "bg-amber-400" : "bg-cyan-400"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (res.currentLevelValue /
                              Math.max(res.currentLevelValue, res.mandatoryMinimumValue * 1.25)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#8e9da7] mt-1 font-mono">
                      <span>Wymóg: {res.mandatoryMinimumValue}</span>
                      <span>Pokrycie: {percentOfMin}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[10px] text-[#8e9da7]">
                  <span>Status bufora:</span>
                  <span className={`font-semibold ${isWarning ? "text-amber-300" : "text-emerald-400"}`}>
                    {isWarning ? "Ryzyko dumpingu" : "Bufor bezpieczny"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRZEŁĄCZNIK NARZĘDZI GABINETOWYCH POD RADAREM                          */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="p-3.5 rounded-xl bg-[#090e13] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
              NARZĘDZIA WYKONAWCZE GABINETU
            </span>
            <span className="text-xs text-[#8e9da7]">
              Wybierz moduł decyzyjny (Radar powyżej pozostaje stale aktywny)
            </span>
          </div>

          {/* Przyciski Wyboru Narzędzia */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.12)]">
            <button
              type="button"
              onClick={() => setActiveToolkitTab("TARCZA")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeToolkitTab === "TARCZA"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tarcza przed przejęciem</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolkitTab("KOWENANTY")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeToolkitTab === "KOWENANTY"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Kowenanty i dług</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolkitTab("ODPRAWA")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeToolkitTab === "ODPRAWA"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Odprawa audio 90s</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveToolkitTab("DIAGNOZA")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeToolkitTab === "DIAGNOZA"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnoza logistyczna</span>
            </button>
          </div>
        </div>

        {/* MODUŁ: TARCZA PRZED WROGIEM PRZEJĘCIEM (USTAWA O KONTROLI NIEKTÓRYCH INWESTYCJI) */}
        {activeToolkitTab === "TARCZA" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#140f0c] border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    ART. 4 USTAWY Z DNIA 24 LIPCA 2015 R.
                  </span>
                  <span className="text-xs text-amber-200/80">Ochrona integralności suwerenności gospodarczej</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  Rejestr podmiotów chronionych i tarcza przed wrogim przejęciem
                </h3>
                <p className="text-xs text-[#8e9da7] mt-0.5">
                  Monitoring transakcji pakietowych na GPW, przepływów kapitału zagranicznego i uprawnienia do sprzeciwu Ministra.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#1b1511] p-2.5 rounded-lg border border-amber-500/20 shrink-0">
                <Lock className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">21 spółek w rejestrze</span>
                  <span className="text-[10px] text-amber-300/80 font-mono block">Weto Ministra aktywne</span>
                </div>
              </div>
            </div>

            {/* Alert Krytyczny dla Spółki Akumulowanej */}
            {FOREIGN_TAKEOVER_SHIELD_ENTITIES.some((e) => e.suspiciousAccumulationAlert) && (
              <div className="p-4 rounded-xl bg-[#1c0c11] border border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                        Wykryto skoordynowaną próbę wrogiej akumulacji na GPW
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-200 border border-rose-800">
                        ORLEN S.A. (PKN)
                      </span>
                    </div>
                    <p className="text-xs text-rose-100/90 mt-1">
                      Fundusze powiązane kapitałowo z cypryjskim wehikułem inwestycyjnym skupiły w blokach pozasesyjnych 4,8% akcji bez zgłoszenia. Wymagany natychmiastowy wniosek do ABW i KNF oraz ministerialny sprzeciw.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const orlen = FOREIGN_TAKEOVER_SHIELD_ENTITIES.find((e) => e.ticker === "PKN");
                    if (orlen) handleOpenVeto(orlen);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Wydaj Sprzeciw Ministra</span>
                </button>
              </div>
            )}

            {/* Tabela Podmiotów Chronionych */}
            <div className="overflow-x-auto rounded-xl border border-[rgba(159,186,199,0.14)] bg-[#0d1419]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#101920] text-[#8e9da7] uppercase font-mono text-[10px] border-b border-[rgba(159,186,199,0.12)]">
                  <tr>
                    <th className="p-3">Podmiot chroniony</th>
                    <th className="p-3">Udział Skarbu Państwa</th>
                    <th className="p-3">Free Float</th>
                    <th className="p-3">Kapitał zagraniczny</th>
                    <th className="p-3">Status ochrony / Transakcje</th>
                    <th className="p-3 text-right">Działanie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(159,186,199,0.08)]">
                  {FOREIGN_TAKEOVER_SHIELD_ENTITIES.map((ent) => (
                    <tr
                      key={ent.id}
                      className={`hover:bg-[#121c23] transition-colors ${
                        ent.suspiciousAccumulationAlert ? "bg-rose-950/20" : ""
                      }`}
                    >
                      <td className="p-3 font-semibold text-white">
                        <div>
                          <span>{ent.entityName}</span>
                          <span className="text-[10px] font-mono text-[#8e9da7] ml-2">
                            ({ent.ticker})
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-cyan-300">
                        {ent.stateSharePercent}%
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {ent.freeFloatPercent}%
                      </td>
                      <td className="p-3 font-mono text-slate-300">
                        {ent.foreignCapitalSharePercent}%
                      </td>
                      <td className="p-3 text-[11px] text-[#b8c6cf] max-w-md">
                        {ent.suspiciousAccumulationAlert ? (
                          <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {ent.lastTransactionNotice}
                          </span>
                        ) : (
                          <span>{ent.lastTransactionNotice}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenVeto(ent)}
                          className="px-2.5 py-1 rounded bg-[#182631] hover:bg-[#203342] text-xs text-white border border-[rgba(159,186,199,0.2)] font-medium transition-all"
                        >
                          Procedura sprzeciwu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODUŁ: KOMITET STABILNOŚCI FINANSOWEJ SSP (DŁUG, PŁYNNOŚĆ, KOWENANTY) */}
        {activeToolkitTab === "KOWENANTY" && (
          <div className="space-y-4">
            {/* Przełącznik podwidoków: Portfel Kowenantów vs Bezpośredni Parser XBRL/ESPI */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl bg-[#0b1218] border border-[rgba(159,186,199,0.14)]">
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#070d11]">
                <button
                  type="button"
                  onClick={() => setCovenantSubTab("PORTFEL")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${
                    covenantSubTab === "PORTFEL"
                      ? "bg-[#182631] text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-[#8e9da7] hover:text-white"
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  Portfel kowenantów SSP ({DEBT_STABILITY_RECORDS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCovenantSubTab("PARSER_XBRL")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${
                    covenantSubTab === "PARSER_XBRL"
                      ? "bg-[#182631] text-rose-300 border border-rose-500/40 shadow-sm"
                      : "text-[#8e9da7] hover:text-white"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Bezpośredni parser raportów GPW (XBRL / ESPI)
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest font-mono">
                    ESEF / KNF
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3 px-2 text-xs font-mono">
                <span className="text-[#8e9da7]">
                  Dług łączny: <strong className="text-white">{totalNetDebtMldPln.toFixed(1)} mld PLN</strong>
                </span>
                <span className="text-rose-400 font-semibold">
                  Naruszenia: {breachedCovenantsCount}
                </span>
              </div>
            </div>

            {/* WIDOK 1: ZAGREGOWANY PORTFEL KOWENANTÓW */}
            {covenantSubTab === "PORTFEL" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0e161c] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-rose-400" />
                      Komitet stabilności finansowej i kowenantów bankowych SSP
                    </h3>
                    <p className="text-xs text-[#8e9da7] mt-0.5">
                      Nadzór nad zadłużeniem bilansowym, wskaźnikami Dług Netto / EBITDA oraz porozumieniami z konsorcjami banków.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                    <div className="p-2 rounded bg-[#121c23] border border-[rgba(159,186,199,0.12)]">
                      <span className="text-[#8e9da7] text-[10px] block">Zagregowany dług netto:</span>
                      <span className="text-white font-bold text-sm">
                        {totalNetDebtMldPln.toFixed(1)} mld PLN
                      </span>
                    </div>
                    <div className="p-2 rounded bg-rose-950/30 border border-rose-800/40">
                      <span className="text-rose-300 text-[10px] block">Naruszone kowenanty:</span>
                      <span className="text-rose-400 font-bold text-sm">
                        {breachedCovenantsCount} spółki (Azoty, Cargo)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DEBT_STABILITY_RECORDS.map((rec) => {
                    const isBreached = rec.isCovenantBreached;

                    return (
                      <div
                        key={rec.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          isBreached
                            ? "bg-[#180d11] border-rose-500/40 shadow-sm"
                            : "bg-[#0d1419] border-[rgba(159,186,199,0.14)]"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{rec.entityName}</span>
                              <span className="text-[10px] font-mono text-[#8e9da7]">({rec.ticker})</span>
                            </div>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                                isBreached
                                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              }`}
                            >
                              {isBreached ? "KOWENANT NARUSZONY" : "STABILNY"}
                            </span>
                          </div>

                          {/* Metryki Długu */}
                          <div className="grid grid-cols-2 gap-2 bg-[#121c23] p-3 rounded-lg border border-[rgba(159,186,199,0.1)] mb-3">
                            <div>
                              <span className="text-[10px] text-[#8e9da7] block">Dług netto:</span>
                              <span className="text-sm font-bold font-mono text-white">
                                {rec.netDebtMldPln} mld PLN
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#8e9da7] block">EBITDA:</span>
                              <span
                                className={`text-sm font-bold font-mono ${
                                  rec.ebitdaMldPln < 0 ? "text-rose-400" : "text-emerald-400"
                                }`}
                              >
                                {rec.ebitdaMldPln} mld PLN
                              </span>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-[rgba(159,186,199,0.1)] flex items-center justify-between">
                              <span className="text-xs text-[#8e9da7]">Dług / EBITDA:</span>
                              <span
                                className={`text-sm font-bold font-mono ${
                                  isBreached ? "text-rose-400" : "text-cyan-300"
                                }`}
                              >
                                {rec.netDebtToEbitda}x{" "}
                                <span className="text-[10px] font-normal text-slate-400">
                                  (limit: {rec.covenantLimit}x)
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Terminy i Banki */}
                          <div className="space-y-1.5 text-xs text-[#b8c6cf] mb-3">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#8e9da7]">Najbliższa zapadalność:</span>
                              <span className="font-mono text-white">
                                {rec.nearestMaturityDate} ({rec.nearestMaturityAmountMlnPln} mln PLN)
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-[#8e9da7]">Konsorcjum bankowe:</span>
                              <span className="font-mono text-slate-300 text-right truncate max-w-[180px]">
                                {rec.creditorConsortium}
                              </span>
                            </div>
                          </div>

                          {/* Rekomendacja Stabilizacyjna */}
                          <p className="text-xs text-[#b8c6cf] leading-relaxed bg-[#0b1014] p-2.5 rounded border border-[rgba(159,186,199,0.08)]">
                            {rec.stabilizationRecommendation}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[rgba(159,186,199,0.1)] flex items-center justify-between text-[11px]">
                          <span className="text-[#8e9da7]">Status porozumienia:</span>
                          <span className="font-semibold text-white">
                            {isBreached ? "Wymaga zgody na standstill" : "Obsługa bieżąca"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WIDOK 2: BEZPOŚREDNI PARSER RAPORTÓW GPW (XBRL / ESPI) */}
            {covenantSubTab === "PARSER_XBRL" && (
              <div className="space-y-4">
                {/* Pasek Kontrolny Parsera */}
                <div className="p-4 rounded-xl bg-[#0b1218] border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                        BEZPOŚREDNI SILNIK XBRL / ESPI • GPW & KNF
                      </span>
                      <span className="text-xs text-[#8e9da7]">
                        MSR / MSSF / ESEF Inline XBRL • Dekompozycja bilansowa
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-rose-400" />
                      Bezpośredni parser raportów okresowych GPW i audytor kowenantów
                    </h3>
                    <p className="text-xs text-[#8e9da7] mt-0.5">
                      Pobieranie i dekonstrukcja raportów kwartalnych, wyodrębnianie tagów taksonomicznych i natychmiastowa weryfikacja naruszeń umów kredytowych.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCustomInputOpen(!isCustomInputOpen)}
                      className="px-3 py-1.5 rounded-lg bg-[#182631] hover:bg-[#203342] text-xs text-white border border-[rgba(159,186,199,0.2)] font-medium transition-all flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4 text-cyan-400" />
                      {isCustomInputOpen ? "Zamknij edytor" : "Wklej kod XML / iXBRL"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyXbrlReport}
                      className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-xs text-rose-300 border border-rose-700/50 font-medium transition-all flex items-center gap-1.5"
                    >
                      {copiedXbrlReport ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          Skopiowano audyt
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Kopiuj brief dla Ministra
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Edytor Wklejania Własnego Kodu XML / iXBRL */}
                {isCustomInputOpen && (
                  <div className="p-4 rounded-xl bg-[#0e161c] border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        Wklej treść raportu okresowego w standardzie ESEF iXBRL (XHTML) lub KNF ESPI XML:
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsCustomInputOpen(false)}
                        className="text-[#8e9da7] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      value={customXmlInput}
                      onChange={(e) => setCustomXmlInput(e.target.value)}
                      placeholder='Wklej kod XML lub XHTML raportu okresowego (np. zawierający znaczniki <ix:nonFraction name="ifrs-full:Revenue" scale="6">... lub <RaportOkresowy><PozycjeFinansowe>...)'
                      className="w-full h-40 p-3 bg-[#080d11] border border-[rgba(159,186,199,0.2)] rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />

                    {parseError && (
                      <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        {parseError}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#8e9da7]">
                        Wspierane taksonomie: IFRS 2021/2023/2024, ESEF iXBRL, KNF ESPI XML (tys. / mln PLN).
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomXmlInput("");
                            setParsedCustomReport(null);
                            setParseError(null);
                          }}
                          className="px-3 py-1.5 rounded bg-[#152028] text-xs text-[#8e9da7] hover:text-white"
                        >
                          Wyczyść
                        </button>
                        <button
                          type="button"
                          onClick={handleParseCustomXml}
                          className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Parsuj raport w czasie rzeczywistym
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Szybki Selektor Oficjalnych Raportów GPW SSP */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#8e9da7] px-1">
                    <span>Wybierz zindeksowany raport okresowy GPW ze Skarbu Państwa:</span>
                    {parsedCustomReport && (
                      <span className="text-cyan-400 font-semibold font-mono">
                        (Aktywny raport z niestandardowego pliku XML)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {OFFICIAL_GPW_PERIODIC_REPORTS.map((rep) => {
                      const isSelected = !parsedCustomReport && rep.id === selectedXbrlReportId;
                      const isBreached = rep.covenant.isBreached;

                      return (
                        <button
                          key={rep.id}
                          type="button"
                          onClick={() => {
                            setParsedCustomReport(null);
                            setSelectedXbrlReportId(rep.id);
                          }}
                          className={`px-3 py-2 rounded-xl text-left border transition-all shrink-0 font-mono text-xs ${
                            isSelected
                              ? "bg-[#182631] border-cyan-400 text-white shadow-md shadow-cyan-950/40"
                              : "bg-[#0d1419] border-[rgba(159,186,199,0.12)] text-[#8e9da7] hover:text-white hover:bg-[#121c23]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-white">{rep.ticker}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                                isBreached
                                  ? "bg-rose-500/20 text-rose-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {isBreached ? "Naruszenie" : "Stabilny"}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#8e9da7] truncate max-w-[150px]">
                            {rep.entityName}
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {rep.reportNumber} • {rep.periodEnded}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* KARTA WYNIKOWA: ZDEKOMPONOWANY RAPORT XBRL/ESPI */}
                <div className="p-5 rounded-xl bg-[#0d1419] border border-[rgba(159,186,199,0.18)] space-y-5 shadow-xl">
                  {/* Nagłówek raportu i wskaźnik główny */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[rgba(159,186,199,0.12)]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-700/40">
                          {activeXbrlReport.ticker}
                        </span>
                        <span className="text-xs text-white font-bold">
                          {activeXbrlReport.entityName}
                        </span>
                        {activeXbrlReport.nip && (
                          <span className="text-[11px] font-mono text-[#8e9da7]">
                            NIP: {activeXbrlReport.nip}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16222c] text-[#8e9da7] border border-[rgba(159,186,199,0.1)]">
                          Standard: {activeXbrlReport.reportStandard}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        Raport okresowy {activeXbrlReport.reportNumber} (za okres kończący się {activeXbrlReport.periodEnded})
                      </h4>
                      <p className="text-xs text-[#8e9da7]">
                        Opublikowano w systemie ESPI: {activeXbrlReport.publishedAt} • Waluta sprawozdania: {activeXbrlReport.currency}
                      </p>
                    </div>

                    {/* Główny Callout Wskaźnika Kowenantowego */}
                    <div className="flex items-center gap-4 bg-[#121c23] p-3 rounded-xl border border-[rgba(159,186,199,0.14)] shrink-0">
                      <div>
                        <span className="text-[10px] font-mono text-[#8e9da7] block uppercase tracking-wider">
                          Dług Netto / EBITDA:
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`text-2xl font-bold font-mono ${
                              activeXbrlReport.covenant.isBreached
                                ? "text-rose-400"
                                : "text-emerald-400"
                            }`}
                          >
                            {activeXbrlReport.covenant.netDebtToEbitda !== null
                              ? `${activeXbrlReport.covenant.netDebtToEbitda}x`
                              : "NIEWYZNACZALNY"}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            (limit umowny: {activeXbrlReport.covenant.covenantLimit}x)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase ${
                            activeXbrlReport.covenant.isBreached
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {activeXbrlReport.covenant.status}
                        </span>
                        {activeXbrlReport.covenant.waiverRequired && (
                          <span className="text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            Wymóg waiver / standstill
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Siatka 3 Kolumn Dekompozycji Finansowej */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Kolumna 1: Rachunek Zysków i Strat (RZiS) */}
                    <div className="p-3.5 rounded-xl bg-[#090e13] border border-[rgba(159,186,199,0.1)] space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[rgba(159,186,199,0.1)]">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-cyan-400" />
                          Rachunek Wyników (MSR)
                        </span>
                        <span className="text-[10px] font-mono text-[#8e9da7]">mln PLN</span>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-[#b8c6cf]">
                          <span>Przychody ze sprzedaży:</span>
                          <span className="font-bold text-white">
                            {activeXbrlReport.revenueMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#b8c6cf]">
                          <span>Zysk operacyjny (EBIT):</span>
                          <span
                            className={
                              activeXbrlReport.operatingProfitEbitMlnPln < 0
                                ? "text-rose-400 font-bold"
                                : "text-emerald-400 font-bold"
                            }
                          >
                            {activeXbrlReport.operatingProfitEbitMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#b8c6cf]">
                          <span>Amortyzacja (D&A):</span>
                          <span className="text-white">
                            {activeXbrlReport.depreciationMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-cyan-300 pt-1 border-t border-[rgba(159,186,199,0.08)]">
                          <span className="font-bold">Skalkulowana EBITDA:</span>
                          <span
                            className={`font-bold ${
                              activeXbrlReport.calculatedEbitdaMlnPln < 0
                                ? "text-rose-400"
                                : "text-cyan-300"
                            }`}
                          >
                            {activeXbrlReport.calculatedEbitdaMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#8e9da7]">
                          <span>Zysk / strata netto:</span>
                          <span
                            className={
                              activeXbrlReport.netProfitLossMlnPln < 0
                                ? "text-rose-400"
                                : "text-slate-300"
                            }
                          >
                            {activeXbrlReport.netProfitLossMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#8e9da7]">
                          <span>Koszty finansowe (odsetki):</span>
                          <span className="text-slate-300">
                            {activeXbrlReport.financeCostsMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Kolumna 2: Bilans i Dług Netto */}
                    <div className="p-3.5 rounded-xl bg-[#090e13] border border-[rgba(159,186,199,0.1)] space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[rgba(159,186,199,0.1)]">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-rose-400" />
                          Zadłużenie i Płynność (Bilans)
                        </span>
                        <span className="text-[10px] font-mono text-[#8e9da7]">mln PLN</span>
                      </div>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-[#b8c6cf]">
                          <span>Kredyty długoterminowe:</span>
                          <span className="text-white">
                            {activeXbrlReport.longTermBorrowingsMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#b8c6cf]">
                          <span>Kredyty krótkoterminowe:</span>
                          <span className="text-white">
                            {activeXbrlReport.shortTermBorrowingsMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-[rgba(159,186,199,0.08)]">
                          <span>Dług brutto razem:</span>
                          <span className="font-bold text-white">
                            {activeXbrlReport.totalGrossDebtMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>Środki pieniężne (gotówka):</span>
                          <span className="font-bold">
                            {activeXbrlReport.cashAndEquivalentsMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-rose-300 pt-1 border-t border-[rgba(159,186,199,0.08)]">
                          <span className="font-bold">Dług netto:</span>
                          <span className="font-bold">
                            {activeXbrlReport.netDebtMlnPln.toLocaleString("pl-PL")}{" "}
                            <span className="text-[10px] font-normal text-slate-400">
                              ({activeXbrlReport.covenant.netDebtMldPln} mld PLN)
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#8e9da7]">
                          <span>Kapitał własny:</span>
                          <span className="text-slate-300">
                            {activeXbrlReport.totalEquityMlnPln.toLocaleString("pl-PL")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Kolumna 3: Dyspozycja i Ryzyko dla Ministra Aktywów Państwowych */}
                    <div className="p-3.5 rounded-xl bg-[#090e13] border border-[rgba(159,186,199,0.1)] space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-[rgba(159,186,199,0.1)]">
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-amber-400" />
                            Karta Dyspozycji Ministra
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              activeXbrlReport.covenant.isBreached
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {activeXbrlReport.covenant.isBreached ? "Pilna akcja" : "Nadzór rutynowy"}
                          </span>
                        </div>

                        <p className="text-xs text-[#b8c6cf] leading-relaxed mt-2.5 bg-[#0e161c] p-3 rounded-lg border border-[rgba(159,186,199,0.08)]">
                          {activeXbrlReport.covenant.ministerialRecommendation}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-[rgba(159,186,199,0.1)] text-xs font-mono">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8e9da7]">Ryzyko MAR / KNF:</span>
                          <span
                            className={
                              activeXbrlReport.covenant.marRiskFlag
                                ? "text-rose-400 font-bold"
                                : "text-emerald-400 font-bold"
                            }
                          >
                            {activeXbrlReport.covenant.marRiskFlag
                              ? "TAK (ryzyko sankcji)"
                              : "BRAK (zgodność)"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8e9da7]">Pokrycie odsetek (ICR):</span>
                          <span className="text-white">
                            {activeXbrlReport.covenant.interestCoverageRatio !== null
                              ? `${activeXbrlReport.covenant.interestCoverageRatio}x`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rozwijany Rejestr Tagi Taksonomii (100% Audytowalności) */}
                  <div className="pt-2 border-t border-[rgba(159,186,199,0.1)]">
                    <button
                      type="button"
                      onClick={() => setShowTagsDetails(!showTagsDetails)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors"
                    >
                      {showTagsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showTagsDetails
                        ? "Ukryj wyekstrahowane znaczniki XBRL taksonomii"
                        : `Pokaż wyekstrahowane znaczniki XBRL taksonomii (${activeXbrlReport.tagsProvenance.length} pozycji)`}
                    </button>

                    {showTagsDetails && (
                      <div className="mt-3 overflow-x-auto rounded-lg border border-[rgba(159,186,199,0.12)]">
                        <table className="w-full text-left text-xs font-mono">
                          <thead className="bg-[#121c23] text-[#8e9da7] border-b border-[rgba(159,186,199,0.1)]">
                            <tr>
                              <th className="p-2.5">Oryginalny Tag Taksonomii</th>
                              <th className="p-2.5">Pozycja Sprawozdania</th>
                              <th className="p-2.5">Wartość Surowa</th>
                              <th className="p-2.5">Znormalizowana (mln PLN)</th>
                              <th className="p-2.5">Taksonomia</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(159,186,199,0.08)] bg-[#090f14]">
                            {activeXbrlReport.tagsProvenance.map((item, idx) => (
                              <tr key={idx} className="hover:bg-[#121c23]/60 transition-colors">
                                <td className="p-2.5 text-cyan-300 font-semibold">{item.tag}</td>
                                <td className="p-2.5 text-white">{item.label}</td>
                                <td className="p-2.5 text-slate-400">{item.rawValue}</td>
                                <td className="p-2.5 text-emerald-400 font-bold">
                                  {item.normalizedValueMlnPln.toLocaleString("pl-PL")}
                                </td>
                                <td className="p-2.5 text-[#8e9da7] uppercase">{item.taxonomy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODUŁ: GABINETOWY AUDIO-BRIEF (ODPRAWA PORANNA W 90 SEKUND) */}
        {activeToolkitTab === "ODPRAWA" && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#0b1218] border border-emerald-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(159,186,199,0.12)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ODPRAWA GABINETOWA • FORMAT LIMUZYNA / TRASA DO KPRM
                    </span>
                    <span className="text-xs text-emerald-200/80">90 sekund syntezy wykonawczej</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                    Gabinetowy audio-briefing: {MORNING_CABINET_BRIEFING.briefingDate}
                  </h3>
                </div>

                {/* Odtwarzacz Audio */}
                <div className="flex items-center gap-3 bg-[#111a21] p-2.5 rounded-xl border border-[rgba(159,186,199,0.16)] shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#071015] flex items-center justify-center font-bold transition-all shadow-md"
                    aria-label={isPlaying ? "Zatrzymaj audio" : "Odtwórz audio"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <div className="w-40">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8e9da7] mb-1">
                      <span>{formatAudioTime(playbackSeconds)}</span>
                      <span>{formatAudioTime(MORNING_CABINET_BRIEFING.audioDurationSeconds)}</span>
                    </div>
                    <div className="w-full bg-[#182631] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all"
                        style={{
                          width: `${(playbackSeconds / MORNING_CABINET_BRIEFING.audioDurationSeconds) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Przełącznik prędkości */}
                  <div className="flex items-center gap-1 bg-[#0b1014] p-1 rounded-md border border-[rgba(159,186,199,0.1)]">
                    {([1, 1.25, 1.5] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                          playbackSpeed === spd
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "text-[#8e9da7] hover:text-white"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wizualizacja Fali Dźwiękowej w trakcie odtwarzania */}
              {isPlaying && (
                <div className="py-3 flex items-center justify-center gap-1">
                  {[12, 24, 38, 16, 42, 28, 50, 32, 18, 44, 22, 36, 48, 20, 30, 46, 14, 26].map(
                    (height, i) => (
                      <span
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                        }}
                      />
                    )
                  )}
                </div>
              )}

              {/* Dwie karty kluczowe: 1 Liczba i 1 Pilna Decyzja */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Liczba Dnia */}
                <div className="p-4 rounded-xl bg-[#111c24] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-mono font-bold block mb-1">
                    Kluczowa liczba poranka dla Ministra
                  </span>
                  <div className="text-3xl font-bold font-mono text-white">
                    {MORNING_CABINET_BRIEFING.keyNumberValue}
                  </div>
                  <p className="text-xs text-[#b8c6cf] mt-1">
                    {MORNING_CABINET_BRIEFING.keyNumberLabel}
                  </p>
                </div>

                {/* Pilna Decyzja do 10:00 */}
                <div className="p-4 rounded-xl bg-[#18110f] border border-amber-500/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono font-bold block mb-1">
                      Pilna decyzja gabinetowa (wymagana przed 10:00)
                    </span>
                    <p className="text-xs text-amber-100 font-semibold leading-relaxed">
                      {MORNING_CABINET_BRIEFING.urgentDecisionToSign}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between">
                    <span className="text-[11px] text-[#8e9da7]">Status dyspozycji:</span>
                    {isDecisionSigned ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Podpisano elektronicznie
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsDecisionSigned(true)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Zatwierdź podpisem</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Trzy Kluczowe Wątki Strategiczne */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-bold text-[#8e9da7] uppercase tracking-wider font-mono">
                  3 fakty strategiczne do rozmowy z Premierem w KPRM
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {MORNING_CABINET_BRIEFING.top3StrategicEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg bg-[#0e161c] border border-[rgba(159,186,199,0.12)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-cyan-300 font-bold">
                            Fakt #{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-[#8e9da7]">
                            {evt.entity}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white mb-2 leading-tight">
                          {evt.title}
                        </h5>
                        <p className="text-[11px] text-[#b8c6cf] leading-relaxed">
                          {evt.consequenceForMap}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transkrypcja Tekstowa Odprawy */}
              <div className="mt-5 p-4 rounded-xl bg-[#090e12] border border-[rgba(159,186,199,0.1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#8e9da7] uppercase tracking-wider font-bold">
                    Transkrypcja odprawy audio (dla protokołu gabinetu)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(MORNING_CABINET_BRIEFING.transcriptText);
                      setCopiedDecision(true);
                      setTimeout(() => setCopiedDecision(false), 2000);
                    }}
                    className="text-xs text-[#8e9da7] hover:text-white flex items-center gap-1 font-mono"
                  >
                    {copiedDecision ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDecision ? "Skopiowano" : "Kopiuj tekst"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                  „{MORNING_CABINET_BRIEFING.transcriptText}”
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODUŁ: DIAGNOZA SUROWCOWA I LOGISTYCZNA */}
        {activeToolkitTab === "DIAGNOZA" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0d1419] border border-[rgba(159,186,199,0.14)]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                Szczegółowa diagnoza analityczna infrastruktury strategicznej
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STRATEGIC_RESERVE_INDICATORS.map((res) => (
                  <div key={res.id} className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{res.resourceName}</span>
                      <span className="text-[10px] font-mono text-cyan-300">{res.supervisingEntity}</span>
                    </div>
                    <p className="text-xs text-[#b8c6cf] leading-relaxed">
                      {res.diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DECYZJI O SPRZECIWIE MINISTRA (VETO ART. 4) */}
      {isVetoModalOpen && selectedVetoEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b1218] border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(159,186,199,0.14)]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Decyzja Ministra Aktywów Państwowych o sprzeciwie
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVetoModalOpen(false)}
                className="text-[#8e9da7] hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#b8c6cf]">
              <div className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)]">
                <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                  Podstawa prawna:
                </span>
                <p className="font-semibold text-white mt-0.5">
                  Art. 4 ust. 1 w zw. z art. 5 ust. 1 Ustawy z dnia 24 lipca 2015 r. o kontroli niektórych inwestycji (Dz. U. z 2023 r. poz. 415).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#111a21]">
                  <span className="text-[10px] text-[#8e9da7] uppercase block">Podmiot chroniony:</span>
                  <span className="font-bold text-white text-sm">{selectedVetoEntity.entityName}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#111a21]">
                  <span className="text-[10px] text-[#8e9da7] uppercase block">Udział Skarbu Państwa:</span>
                  <span className="font-bold text-cyan-300 text-sm">{selectedVetoEntity.stateSharePercent}%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Uzasadnienie formalne sprzeciwu:
                </label>
                <textarea
                  value={vetoJustification}
                  onChange={(e) => setVetoJustification(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {vetoIssued && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Decyzja o sprzeciwie została podpisana z rygorem natychmiastowej wykonalności i przekazana do KNF oraz ABW.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(159,186,199,0.12)]">
              <button
                type="button"
                onClick={() => setIsVetoModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs font-semibold text-white"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleExecuteVeto}
                disabled={vetoIssued}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {vetoIssued ? "Sprzeciw wydany" : "Podpisz i wydaj decyzję"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
