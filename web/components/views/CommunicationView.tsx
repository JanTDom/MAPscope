"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareWarning,
  Radio,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  SplitSquareVertical,
  Activity,
  CheckCircle2,
  XCircle,
  FileCheck,
  Send,
  PieChart,
  Users,
  Target,
  Flame,
  Rss,
  RefreshCw,
} from "lucide-react";
import {
  COMPANY_DISCLOSURES_DATA,
  MEDIA_RADAR_ANOMALIES,
  PRE_PUBLICATION_AUDITS,
  MINISTER_IMPACT_BREAKDOWNS,
  NARRATIVE_SOURCES_MAP,
} from "@/lib/mapscope-data.ts";
import type { CompanyDisclosureRecord, MediaRadarAnomalies } from "@/lib/types.ts";
import type { SspPressReleaseItem } from "@/lib/ssp-press-feeds-service.ts";
import { InteractiveGeminiAuditor } from "@/components/InteractiveGeminiAuditor.tsx";
import { ReputationWaterfallChart } from "@/components/charts/ReputationWaterfallChart.tsx";

interface CommunicationViewProps {
  onOpenDossier: (entityId: string) => void;
}

export function CommunicationView({ onOpenDossier }: CommunicationViewProps) {
  const [selectedDisclosureId, setSelectedDisclosureId] = useState<string>(
    COMPANY_DISCLOSURES_DATA[0]?.id || ""
  );

  const [feedMode, setFeedMode] = useState<"live_ssp" | "registered">("live_ssp");
  const [livePressReleases, setLivePressReleases] = useState<SspPressReleaseItem[]>([]);
  const [isLoadingLiveFeeds, setIsLoadingLiveFeeds] = useState<boolean>(false);
  const [selectedLiveFeed, setSelectedLiveFeed] = useState<SspPressReleaseItem | null>(null);

  const fetchLiveFeeds = async () => {
    setIsLoadingLiveFeeds(true);
    try {
      const res = await fetch("/api/press-feeds/sync");
      const data = (await res.json()) as {
        success?: boolean;
        items?: SspPressReleaseItem[];
        releases?: SspPressReleaseItem[];
      };
      const itemsList = data.items || data.releases || [];
      if (data?.success && Array.isArray(itemsList)) {
        setLivePressReleases(itemsList);
        if (itemsList.length > 0 && !selectedLiveFeed) {
          setSelectedLiveFeed(itemsList[0]);
        }
      }
    } catch (e) {
      console.error("Błąd pobierania live RSS SSP:", e);
    } finally {
      setIsLoadingLiveFeeds(false);
    }
  };

  useEffect(() => {
    fetchLiveFeeds();
  }, []);

  const [selectedAnomalyIndex, setSelectedAnomalyIndex] = useState<number>(0);

  // Stan symulatora przedpublikacyjnego (Greenlight/Redlight)
  const [selectedPreAuditIndex, setSelectedPreAuditIndex] = useState<number>(0);
  const [customDraftText, setCustomDraftText] = useState<string>("");

  const activeDisclosure =
    COMPANY_DISCLOSURES_DATA.find((d) => d.id === selectedDisclosureId) ||
    COMPANY_DISCLOSURES_DATA[0];

  const assessment = activeDisclosure?.risk_assessment;
  const activeAnomaly = MEDIA_RADAR_ANOMALIES[selectedAnomalyIndex] || MEDIA_RADAR_ANOMALIES[0];

  const currentPreAudit = PRE_PUBLICATION_AUDITS[selectedPreAuditIndex] || PRE_PUBLICATION_AUDITS[0];
  const activeImpact = MINISTER_IMPACT_BREAKDOWNS.find(
    (b) => b.entityId === activeDisclosure.entity_id || b.entityId === activeAnomaly.entityId
  ) || MINISTER_IMPACT_BREAKDOWNS[0];

  const activeSources = NARRATIVE_SOURCES_MAP[activeAnomaly.entityId] || {
    oppositionPoliticiansPercent: 35,
    laborUnionsPercent: 25,
    regionalMediaPercent: 20,
    nationalMediaPercent: 15,
    financialAnalystsPercent: 5,
    primaryNarrativeDriver: "Dyskusja w mediach społecznościowych i regionalnych",
  };

  return (
    <div className="space-y-6">
      {/* Pasek Tytułowy Modułu Komunikacji */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#f6c56b]/15 text-[#f6c56b] border border-[#f6c56b]/30 font-bold">
              SZEF KOMUNIKACJI • MEDIA INTELLIGENCE
            </span>
            <span className="text-xs text-[#8e9da7]">Silnik audytu oświadczeń i pre-publikacyjny radar</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Communication Risk Engine, Radar Narracji & Symulator Greenlight
          </h1>
          <p className="text-xs text-[#8e9da7]">
            Wykrywanie rykoszetu w Ministra, weryfikacja oświadczeń przed wysłaniem do PAP oraz matryca inicjatorów ataku.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f6c56b] animate-pulse" />
            <span className="font-mono text-white">ANOMALIE AKTYWNE: {MEDIA_RADAR_ANOMALIES.length}</span>
          </div>
        </div>
      </div>

      {/* Symulator Ryzyka Przedpublikacyjnego dla Oświadczeń SSP (Greenlight / Redlight) */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[#57e0c5]/30 space-y-4 shadow-lg shadow-[#57e0c5]/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(159,186,199,0.1)]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#57e0c5]" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Symulator Przedpublikacyjny dla Rzecznika SSP („Greenlight / Redlight”)
              </h2>
              <span className="text-xs text-[#8e9da7]">
                Audyt szkicu komunikatu przed przekazaniem do PAP i mediów społecznościowych.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PRE_PUBLICATION_AUDITS.map((audit, idx) => (
              <button
                key={audit.id}
                type="button"
                onClick={() => {
                  setSelectedPreAuditIndex(idx);
                  setCustomDraftText("");
                }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedPreAuditIndex === idx && !customDraftText
                    ? "bg-[#16222b] text-white border border-[#57e0c5]/50 shadow-sm"
                    : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
                }`}
              >
                {audit.entityName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Szkic testowany */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#8e9da7] font-semibold">
                Szkic oświadczenia do audytu:
              </span>
              <span className="text-[10px] text-[#5d6b74]">
                {currentPreAudit.entityName}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.15)] text-xs text-white leading-relaxed min-h-[100px]">
              "{customDraftText || currentPreAudit.inputText}"
            </div>

            {/* Wykryte punkty zapalne */}
            {currentPreAudit.riskHighlights.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#ff7f87] font-bold block">
                  Wykryte punkty zapalne (Zagrożenia reputacyjne):
                </span>
                {currentPreAudit.riskHighlights.map((hl, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-[#ff7f87]/10 border border-[#ff7f87]/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#ff7f87] font-bold">
                        ⚠️ "{hl.phrase}"
                      </span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#ff7f87]/20 text-[#ff7f87]">
                        {hl.dangerType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8e9da7]">{hl.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Werdykt AI i Wersja Bezpieczna */}
          <div className="lg:col-span-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#8e9da7] font-semibold">
                  Werdykt silnika MAPscope:
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border flex items-center gap-1.5 ${
                    currentPreAudit.verdict === "green"
                      ? "bg-[#57e0c5]/20 text-[#57e0c5] border-[#57e0c5]/40"
                      : "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                  }`}
                >
                  {currentPreAudit.verdict === "green" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{currentPreAudit.verdictLabel}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111a21] border border-[#57e0c5]/30 space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rekomendowana wersja bezpieczna (Clean Copy dla PAP):</span>
                </span>
                <p className="text-xs text-white leading-relaxed font-medium">
                  "{currentPreAudit.improvedVersion}"
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] text-[11px] text-[#8e9da7] flex items-center justify-between">
              <span>Standard audytu: Wytyczne Komunikacji Strategicznej MAP 2026</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(currentPreAudit.improvedVersion);
                  alert("Skopiowano bezpieczną treść komunikatu!");
                }}
                className="px-2 py-0.5 rounded bg-[#16222b] text-[10px] text-[#57e0c5] hover:text-white transition-colors"
              >
                Kopiuj wersję bezpieczną
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wodospad wizerunkowy MAP: bilans zysków i strat sentymentu */}
      <ReputationWaterfallChart />

      {/* Interaktywny Audytor Oświadczeń Gemini AI */}
      <InteractiveGeminiAuditor />

      {/* Wykres dynamiki wzmianek 24h & Radar anomalii */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(159,186,199,0.1)]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#75b8ff]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Radar dynamiki wzmianek i sentymentu (24h)
            </h2>
          </div>

          {/* Przełącznik spółek z anomaliami */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {MEDIA_RADAR_ANOMALIES.map((anom, idx) => (
              <button
                key={anom.entityId}
                type="button"
                onClick={() => setSelectedAnomalyIndex(idx)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedAnomalyIndex === idx
                    ? "bg-[#16222b] text-white border border-[#75b8ff]/40 shadow-sm"
                    : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
                }`}
              >
                {anom.entityName}
              </button>
            ))}
          </div>
        </div>

        {/* Podsumowanie anomalii, wykres SVG i Matryca Inicjatorów */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-3">
            <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#ff7f87] font-bold block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Wykryto nagłą anomalię wolumenu</span>
              </span>
              <div className="text-xl font-bold font-mono text-white">
                +{Math.round((activeAnomaly.spikeVolume / activeAnomaly.baselineVolume) * 100)}%
                <span className="text-xs text-[#8e9da7] font-normal ml-2">
                  wobec średniej 30-dniowej
                </span>
              </div>
              <p className="text-xs text-[#8e9da7] leading-relaxed">
                Zdarzenie wyzwalające: <strong className="text-white">{activeAnomaly.triggerEvent}</strong>
              </p>
              <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-xs">
                <span className="text-[#8e9da7]">Sentyment negatywny:</span>
                <span className="font-mono font-bold text-[#ff7f87]">
                  {Math.round(activeAnomaly.negativeRatio * 100)}%
                </span>
              </div>
            </div>

            {/* Matryca Inicjatorów Narracji */}
            <div className="p-3.5 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.12)] space-y-2.5">
              <span className="text-[10px] font-mono uppercase text-[#75b8ff] font-bold block flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Inicjatorzy Narracji (Kto nakręca kryzys):</span>
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8e9da7]">Posłowie opozycji (Polityka):</span>
                  <span className="font-mono font-bold text-white">
                    {activeSources.oppositionPoliticiansPercent}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#16222b] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${activeSources.oppositionPoliticiansPercent}%` }}
                    className="h-full bg-[#ff7f87]"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#8e9da7]">Centrale związkowe (Pracownicy):</span>
                  <span className="font-mono font-bold text-white">
                    {activeSources.laborUnionsPercent}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#16222b] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${activeSources.laborUnionsPercent}%` }}
                    className="h-full bg-[#f6c56b]"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#8e9da7]">Media regionalne / lokalne:</span>
                  <span className="font-mono font-bold text-white">
                    {activeSources.regionalMediaPercent}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#16222b] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${activeSources.regionalMediaPercent}%` }}
                    className="h-full bg-[#75b8ff]"
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#5d6b74] italic border-t border-[rgba(159,186,199,0.08)] pt-1.5">
                Główny wektor: {activeSources.primaryNarrativeDriver}
              </p>
            </div>
          </div>

          {/* Rysunek interaktywny wykresu SVG */}
          <div className="lg:col-span-8 p-4 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.14)] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-[11px] text-[#5d6b74] font-mono mb-2">
              <span>WOLUMEN PUBLIKACJI (24H)</span>
              <span className="text-[#75b8ff]">Szczyt: {activeAnomaly.spikeVolume} wzmianek/h</span>
            </div>

            <div className="h-36 w-full flex items-end gap-2 pt-4 px-2">
              {activeAnomaly.timeSeries.map((point, index) => {
                const maxVol = Math.max(...activeAnomaly.timeSeries.map((p) => p.volume));
                const heightPercent = Math.max(12, Math.round((point.volume / maxVol) * 100));
                const isNegative = point.sentiment < -0.5;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] font-mono text-[#8e9da7] opacity-0 group-hover:opacity-100 transition-opacity">
                      {point.volume}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all ${
                        isNegative
                          ? "bg-gradient-to-t from-[#ff7f87]/40 to-[#ff7f87]"
                          : "bg-gradient-to-t from-[#75b8ff]/40 to-[#75b8ff]"
                      }`}
                    />
                    <span className="text-[9px] font-mono text-[#5d6b74]">{point.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Wskaźnik Rykoszetu w Ministra dla tej anomalii */}
            {activeImpact && (
              <div className="mt-4 pt-3 border-t border-[rgba(159,186,199,0.1)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff7f87]" />
                  <span className="text-xs text-white font-semibold">
                    Kalkulacja rykoszetu w MAP:
                  </span>
                  <span className="text-xs font-mono font-bold text-[#ff7f87] px-2 py-0.5 rounded bg-[#ff7f87]/15 border border-[#ff7f87]/30">
                    {activeImpact.impactScorePercent}% prawdopodobieństwa uderzenia w ministra
                  </span>
                </div>
                <span className="text-[11px] text-[#8e9da7]">
                  Wektor: {activeImpact.attackVectors[0]?.vector || "Zarzut zaniechania"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Przełącznik Źródła Komunikatów: Nasłuch na żywo (25 spółek RSS) vs Rejestr Archiwalny */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFeedMode("live_ssp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              feedMode === "live_ssp"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-[#111a21] text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <Rss className="w-3.5 h-3.5 text-blue-300" />
            <span>Nasłuch na żywo 25 spółek SSP ({livePressReleases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFeedMode("registered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              feedMode === "registered"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-[#111a21] text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5 text-amber-300" />
            <span>Rejestr analizowanych oświadczeń ({COMPANY_DISCLOSURES_DATA.length})</span>
          </button>
        </div>

        {feedMode === "live_ssp" && (
          <button
            type="button"
            disabled={isLoadingLiveFeeds}
            onClick={fetchLiveFeeds}
            className="px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs text-white border border-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingLiveFeeds ? "animate-spin" : ""}`} />
            <span>{isLoadingLiveFeeds ? "Pobieranie feedów..." : "Odśwież nasłuch"}</span>
          </button>
        )}
      </div>

      {/* Dwie Kolumny: Lista Oświadczeń + Audyt Szczegółowy AI z Porównaniem Narracji */}
      {feedMode === "live_ssp" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolumna lewa: Lista oświadczeń z biur prasowych na żywo */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Oświadczenia biur prasowych (RSS Live)</span>
              </h2>
              <span className="text-xs text-[#8e9da7] font-mono">
                {livePressReleases.length} publikacji
              </span>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {livePressReleases.map((release) => {
                const isSelected = selectedLiveFeed?.id === release.id;
                const isP1 = release.riskFlag === "KRYTYCZNE_P1";
                const isP2 = release.riskFlag === "OSTRZEGAWCZE_P2";

                return (
                  <div
                    key={release.id}
                    onClick={() => setSelectedLiveFeed(release)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#111a21] border-[#57e0c5] shadow-md ring-1 ring-[#57e0c5]/40"
                        : "bg-[#0d1318] border-[rgba(159,186,199,0.14)] hover:border-[rgba(159,186,199,0.25)] hover:bg-[#101923]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#75b8ff] truncate">
                        {release.entityName} {release.ticker ? `(${release.ticker})` : ""}
                      </span>
                      <span className="text-[11px] text-[#5d6b74] font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(release.publishedAt).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                      {release.title}
                    </h3>

                    <div className="mt-3 pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between gap-2 text-[11px]">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded border text-[10px] ${
                          isP1
                            ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                            : isP2
                            ? "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                            : "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/30"
                        }`}
                      >
                        {release.riskFlag}
                      </span>

                      {release.detectedTriggers.length > 0 && (
                        <span className="text-[10px] text-amber-300 font-mono truncate max-w-[170px]" title={release.detectedTriggers.join(", ")}>
                          Trigger: {release.detectedTriggers[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolumna prawa: Szczegóły komunikatu z biura prasowego */}
          <div className="lg:col-span-7">
            {selectedLiveFeed ? (
              <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-5">
                <div className="pb-4 border-b border-[rgba(159,186,199,0.1)] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDossier(selectedLiveFeed.entityId)}
                        className="text-xs font-bold text-[#75b8ff] hover:underline"
                      >
                        {selectedLiveFeed.entityName}
                      </button>
                      <span className="text-xs text-[#5d6b74]">•</span>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(selectedLiveFeed.publishedAt).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {selectedLiveFeed.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={selectedLiveFeed.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>Biuro prasowe</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenDossier(selectedLiveFeed.entityId)}
                      className="px-2.5 py-1 text-xs rounded bg-[#16222b] hover:bg-[#1f2f3c] text-white border border-[rgba(159,186,199,0.14)] flex items-center gap-1"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Streszczenie komunikatu */}
                <div className="p-4 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#8e9da7] font-semibold block">
                    Treść oficjalnego komunikatu:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedLiveFeed.summary}
                  </p>
                </div>

                {/* Ocena Ryzyka Silnika MAPscope */}
                <div className="p-4 rounded-xl bg-[#111a21] border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Audyt Ryzyka Komunikacyjnego Silnika MAPscope</span>
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                        selectedLiveFeed.riskFlag === "KRYTYCZNE_P1"
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : selectedLiveFeed.riskFlag === "OSTRZEGAWCZE_P2"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {selectedLiveFeed.riskFlag}
                    </span>
                  </div>

                  {selectedLiveFeed.detectedTriggers.length > 0 ? (
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                        Zidentyfikowane triggery ryzyka w treści:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedLiveFeed.detectedTriggers.map((trig, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/30 text-xs font-mono font-medium"
                          >
                            ⚠️ {trig}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300">
                      Brak słów kluczowych eskalujących kryzys polityczny lub regulacyjny. Komunikat operacyjny o standardowym profilu.
                    </p>
                  )}

                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                    <span className="font-semibold text-white block">Rekomendacja dla pionu prasowego MAP:</span>
                    <p className="leading-relaxed">
                      {selectedLiveFeed.riskFlag === "KRYTYCZNE_P1"
                        ? "Zalecany natychmiastowy kontakt z rzecznikiem spółki w celu skoordynowania jednolitego przekazu z KPRM i MAP przed pytaniami dziennikarzy."
                        : selectedLiveFeed.riskFlag === "OSTRZEGAWCZE_P2"
                        ? "Wymaga monitorowania pytań redakcji ekonomicznych. Przygotować zwięzłe stanowisko resortu oparte na twardych danych."
                        : "Komunikat neutralny — brak konieczności aktywnej reakcji gabinetu politycznego."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] text-xs text-[#8e9da7]">
                Wybierz oświadczenie z nasłuchu na żywo, aby zobaczyć analizę.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolumna lewa: Lista oświadczeń i wywiadów */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Bieżące komunikaty i oświadczenia spółek
              </h2>
              <span className="text-xs text-[#8e9da7] font-mono">
                {COMPANY_DISCLOSURES_DATA.length} w rejestrze
              </span>
            </div>

            <div className="space-y-3">
              {COMPANY_DISCLOSURES_DATA.map((d) => {
                const isSelected = d.id === selectedDisclosureId;
                const isP1 = d.risk_assessment?.severity === "p1_critical";
                const score = d.risk_assessment?.overall_risk_score ?? 0;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDisclosureId(d.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#111a21] border-[#f6c56b] shadow-md"
                        : "bg-[#0d1318] border-[rgba(159,186,199,0.14)] hover:border-[rgba(159,186,199,0.25)] hover:bg-[#101923]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#75b8ff]">{d.entity_name}</span>
                      <span className="text-[11px] text-[#5d6b74] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(d.published_at).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                      {d.title}
                    </h3>

                    <div className="mt-3 pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[11px]">
                      <span className="text-[#8e9da7]">{d.disclosure_type}</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded border ${
                          isP1
                            ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                            : "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                        }`}
                      >
                        Ryzyko: {score.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolumna prawa: Karta audytu AI i porównanie narracji */}
          <div className="lg:col-span-7">
            {activeDisclosure && assessment ? (
              <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-5">
                {/* Nagłówek audytu */}
                <div className="pb-4 border-b border-[rgba(159,186,199,0.1)] flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDossier(activeDisclosure.entity_id)}
                        className="text-xs font-bold text-[#75b8ff] hover:underline"
                      >
                        {activeDisclosure.entity_name}
                      </button>
                      <span className="text-xs text-[#5d6b74]">•</span>
                      <span className="text-xs text-[#8e9da7]">{activeDisclosure.disclosure_type}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{activeDisclosure.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDossier(activeDisclosure.entity_id)}
                    className="px-2.5 py-1 text-xs rounded bg-[#16222b] hover:bg-[#1f2f3c] text-white border border-[rgba(159,186,199,0.14)] shrink-0 flex items-center gap-1"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Treść oświadczenia */}
                <div className="p-3.5 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)] text-xs text-[#8e9da7] italic leading-relaxed">
                  "{activeDisclosure.content}"
                </div>

                {/* Porównanie narracji: Trójkąt Informacyjny */}
                {assessment.narrative_comparison && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                      <SplitSquareVertical className="w-3.5 h-3.5 text-[#57e0c5]" />
                      <span>Porównanie narracji: Spółka vs Media vs Obywatele (X)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-[#111a21] border border-[rgba(87,224,197,0.25)] space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#57e0c5] uppercase block">
                          1. Co mówi spółka:
                        </span>
                        <p className="text-white leading-relaxed">
                          {assessment.narrative_comparison.companyClaim}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#111a21] border border-[rgba(246,197,107,0.25)] space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#f6c56b] uppercase block">
                          2. Co piszą media:
                        </span>
                        <p className="text-white leading-relaxed">
                          {assessment.narrative_comparison.mediaCoverage}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-[#111a21] border border-[rgba(255,127,135,0.25)] space-y-1">
                        <span className="text-[10px] font-mono font-bold text-[#ff7f87] uppercase block">
                          3. Reakcja na X/LinkedIn:
                        </span>
                        <p className="text-white leading-relaxed">
                          {assessment.narrative_comparison.publicReaction}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matryca Zagrożeń Komunikacyjnych (4 wektory) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Identyfikacja zagrożeń komunikacyjnych (Wektory AI)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      className={`p-3 rounded-lg border ${
                        assessment.communication_risks.blad_narracyjny
                          ? "bg-[#ff7f87]/10 border-[#ff7f87]/30 text-white"
                          : "bg-[#111a21] border-[rgba(159,186,199,0.08)] text-[#5d6b74]"
                      }`}
                    >
                      <span className="font-bold block text-white">Błąd narracyjny</span>
                      {assessment.communication_risks.szczegoly?.blad_narracyjny && (
                        <p className="text-[11px] text-[#8e9da7] mt-1">
                          {assessment.communication_risks.szczegoly.blad_narracyjny}
                        </p>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${
                        assessment.communication_risks.rozdzwiek_z_rzadem
                          ? "bg-[#ff7f87]/15 border-[#ff7f87]/40 text-white font-bold"
                          : "bg-[#111a21] border-[rgba(159,186,199,0.08)] text-[#5d6b74]"
                      }`}
                    >
                      <span className="font-bold block text-white">Rozdźwięk z rządem / MAP</span>
                      {assessment.communication_risks.szczegoly?.rozdzwiek_z_rzadem && (
                        <p className="text-[11px] text-[#ff7f87] mt-1">
                          {assessment.communication_risks.szczegoly.rozdzwiek_z_rzadem}
                        </p>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${
                        assessment.communication_risks.zaognienie_konfliktu
                          ? "bg-[#ff7f87]/10 border-[#ff7f87]/30 text-white"
                          : "bg-[#111a21] border-[rgba(159,186,199,0.08)] text-[#5d6b74]"
                      }`}
                    >
                      <span className="font-bold block text-white">Zaognienie konfliktu</span>
                      {assessment.communication_risks.szczegoly?.zaognienie_konfliktu && (
                        <p className="text-[11px] text-[#8e9da7] mt-1">
                          {assessment.communication_risks.szczegoly.zaognienie_konfliktu}
                        </p>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-lg border ${
                        assessment.communication_risks.ryzyko_regulacyjne_mar
                          ? "bg-[#ff7f87]/10 border-[#ff7f87]/30 text-white"
                          : "bg-[#111a21] border-[rgba(159,186,199,0.08)] text-[#5d6b74]"
                      }`}
                    >
                      <span className="font-bold block text-white">Ryzyko regulacyjne MAR/ESPI</span>
                      {assessment.communication_risks.szczegoly?.ryzyko_regulacyjne_mar && (
                        <p className="text-[11px] text-[#8e9da7] mt-1">
                          {assessment.communication_risks.szczegoly.ryzyko_regulacyjne_mar}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Uderzenie w kierownictwo MAP */}
                <div className="p-4 rounded-lg bg-[#140b0f] border border-[#ff7f87]/40 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#ff7f87] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Ocena uderzenia w kierownictwo MAP (Impact Analysis)</span>
                  </span>
                  <p className="text-xs text-[#f4f7f8] leading-relaxed">
                    {assessment.map_impact_analysis}
                  </p>
                </div>

                {/* Rekomendacja działań */}
                {assessment.recommended_action && (
                  <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(87,224,197,0.3)] space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#57e0c5] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Rekomendacja dla Rzecznika Prasowego MAP:</span>
                    </span>
                    <p className="text-xs text-white leading-relaxed">
                      {assessment.recommended_action}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] text-xs text-[#8e9da7]">
                Wybierz oświadczenie z listy, aby wyświetlić audyt AI.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
