"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  AlertTriangle,
  Scale,
  Calendar,
  Building2,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  ChevronRight,
  Filter,
  CheckCircle2,
  Briefcase,
  AlertOctagon,
  Calculator,
  ArrowRight,
  Info,
} from "lucide-react";
import type {
  LaborDisputeRecord,
  DisputeLegalStage,
  DisputeThreatLevel,
} from "@/lib/types.ts";
import {
  LABOR_DISPUTES_DATABASE,
  SOCIAL_DIALOGUE_CALENDAR,
  getSocialDialogueSummary,
  simulateWageCompromise,
} from "@/lib/social-dialogue-data.ts";

interface SocialDialogueViewProps {
  onOpenDossier?: (entityId: string) => void;
}

export function SocialDialogueView({ onOpenDossier }: SocialDialogueViewProps) {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState<string>("all");
  const [selectedThreat, setSelectedThreat] = useState<string>("all");
  const [selectedLegalStage, setSelectedLegalStage] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"disputes" | "calendar" | "simulator">(
    "disputes"
  );

  // Stan symulatora kompromisu płacowego
  const [simDisputeId, setSimDisputeId] = useState<string>(
    LABOR_DISPUTES_DATABASE[0]?.id || ""
  );
  const [simWagePct, setSimWagePct] = useState<number>(3.5);
  const [simBonusPln, setSimBonusPln] = useState<number>(1000);

  const summary = useMemo(() => getSocialDialogueSummary(), []);

  // Lista unikalnych województw z bazy sporów
  const voivodeships = useMemo(() => {
    const set = new Set<string>();
    for (const d of LABOR_DISPUTES_DATABASE) {
      const parts = d.voivodeship.split("/");
      for (const p of parts) {
        set.add(p.trim());
      }
    }
    return Array.from(set).sort();
  }, []);

  // Filtrowane spory
  const filteredDisputes = useMemo(() => {
    return LABOR_DISPUTES_DATABASE.filter((d) => {
      if (
        selectedVoivodeship !== "all" &&
        !d.voivodeship.toLowerCase().includes(selectedVoivodeship.toLowerCase())
      ) {
        return false;
      }
      if (selectedThreat !== "all" && d.threatLevel !== selectedThreat) {
        return false;
      }
      if (selectedLegalStage !== "all" && d.legalStage !== selectedLegalStage) {
        return false;
      }
      return true;
    });
  }, [selectedVoivodeship, selectedThreat, selectedLegalStage]);

  // Wynik symulacji
  const simulationResult = useMemo(() => {
    if (!simDisputeId) return null;
    try {
      return simulateWageCompromise({
        disputeId: simDisputeId,
        proposedWageIncreasePct: simWagePct,
        proposedOneOffBonusPln: simBonusPln,
      });
    } catch {
      return null;
    }
  }, [simDisputeId, simWagePct, simBonusPln]);

  const selectedDisputeForSim = useMemo(() => {
    return LABOR_DISPUTES_DATABASE.find((d) => d.id === simDisputeId);
  }, [simDisputeId]);

  const getThreatBadge = (level: DisputeThreatLevel) => {
    switch (level) {
      case "KRYTYCZNY":
        return "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/35";
      case "WYSOKI":
        return "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/35";
      case "UMIARKOWANY":
        return "bg-[#75b8ff]/15 text-[#75b8ff] border-[#75b8ff]/35";
      case "MONITOROWANY":
        return "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/35";
    }
  };

  const getLegalStageBadge = (stage: DisputeLegalStage) => {
    switch (stage) {
      case "ROKOWANIA":
        return { label: "Rokowania dwustronne", color: "text-[#75b8ff] bg-[#75b8ff]/10 border-[#75b8ff]/30" };
      case "PROTOKOL_ROZBIEZNOSCI":
        return { label: "Protokół rozbieżności", color: "text-[#f6c56b] bg-[#f6c56b]/10 border-[#f6c56b]/30" };
      case "MEDIACJA_MRPIPS":
        return { label: "Mediacja MRPiPS", color: "text-[#e5b958] bg-[#e5b958]/10 border-[#e5b958]/30" };
      case "REFERENDUM_STRAJKOWE":
        return { label: "Referendum strajkowe", color: "text-[#ff7f87] bg-[#ff7f87]/15 border-[#ff7f87]/35" };
      case "STRAJK_OSTRZEGAWCZY":
        return { label: "Strajk ostrzegawczy", color: "text-[#ff7f87] bg-[#ff7f87]/20 border-[#ff7f87]/40" };
      case "STRAJK_GENERALNY":
        return { label: "Strajk generalny", color: "text-red-400 bg-red-950 border-red-500" };
      case "POROZUMIENIE_ZAWISLE":
        return { label: "Porozumienie zawisłe", color: "text-[#57e0c5] bg-[#57e0c5]/10 border-[#57e0c5]/30" };
      default:
        return { label: stage, color: "text-zinc-400 bg-zinc-800 border-zinc-700" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek i opis modułu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(159,186,199,0.14)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30">
              MODUŁ RADARU SPOŁECZNEGO
            </span>
            <span className="text-xs text-[#8e9da7] font-mono">
              Ustawa o rozwiązywaniu sporów zbiorowych z 1991 r.
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Rejestr napięć społecznych i negocjacji płacowych w regionach
          </h1>
          <p className="text-xs text-[#8e9da7] mt-1 max-w-3xl">
            Bieżący monitoring postępowań spornych, wypowiedzeń ZUZP, kalendarium Wojewódzkich Rad Dialogu
            Społecznego (WRDS) oraz ocena wpływu żądań płacowych na kowenanty finansowe spółek portfelowych MAP.
          </p>
        </div>

        {/* Zakładki */}
        <div className="flex items-center gap-1 bg-[#0d1318] p-1 rounded-lg border border-[rgba(159,186,199,0.14)] self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("disputes")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "disputes"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Spory zbiorowe ({summary.totalActiveDisputes})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "calendar"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Kalendarium i WRDS ({summary.calendarEventsNext30Days})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "simulator"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Symulator kompromisu
          </button>
        </div>
      </div>

      {/* Pasek KPI Ministra */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Aktywne spory</span>
            <Users className="w-3.5 h-3.5 text-[#75b8ff]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.totalActiveDisputes}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">W podmiotach SSP</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Zagrożenie P1</span>
            <AlertOctagon className="w-3.5 h-3.5 text-[#ff7f87]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#ff7f87] mt-1">
            {summary.criticalDisputesCount}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Stan przedstrajkowy</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Pracownicy objęci</span>
            <Briefcase className="w-3.5 h-3.5 text-[#57e0c5]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.totalWorkersAffected.toLocaleString("pl-PL")}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Etatów w sporach</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Koszt żądań (rok)</span>
            <DollarSign className="w-3.5 h-3.5 text-[#f6c56b]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#f6c56b] mt-1">
            {summary.totalWageDemandsCostMlnPln.toFixed(1)} <span className="text-xs">mln</span>
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Roczne roszczenia</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Układy ZUZP</span>
            <Scale className="w-3.5 h-3.5 text-[#e5b958]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.zuzpThreatenedCount}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Wypowiedziane/zagrożone</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Terminy (30 dni)</span>
            <Calendar className="w-3.5 h-3.5 text-[#75b8ff]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.calendarEventsNext30Days}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Posiedzeń i mediacji</div>
        </div>
      </div>

      {/* Widok 1: Aktywne spory zbiorowe */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          {/* Pasek filtrów */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1318] p-3 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#8e9da7] flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5 text-[#57e0c5]" /> Filtry:
              </span>

              {/* Filtr województwa */}
              <select
                aria-label="Województwo"
                value={selectedVoivodeship}
                onChange={(e) => setSelectedVoivodeship(e.target.value)}
                className="bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
              >
                <option value="all">Wszystkie województwa ({LABOR_DISPUTES_DATABASE.length})</option>
                {voivodeships.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              {/* Filtr poziomu zagrożenia */}
              <select
                aria-label="Poziom zagrożenia"
                value={selectedThreat}
                onChange={(e) => setSelectedThreat(e.target.value)}
                className="bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
              >
                <option value="all">Wszystkie poziomy zagrożenia</option>
                <option value="KRYTYCZNY">Krytyczny (P1)</option>
                <option value="WYSOKI">Wysoki</option>
                <option value="UMIARKOWANY">Umiarkowany</option>
                <option value="MONITOROWANY">Monitorowany</option>
              </select>

              {/* Filtr etapu prawnego */}
              <select
                aria-label="Etap prawny"
                value={selectedLegalStage}
                onChange={(e) => setSelectedLegalStage(e.target.value)}
                className="bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
              >
                <option value="all">Wszystkie etapy prawne</option>
                <option value="ROKOWANIA">Rokowania</option>
                <option value="PROTOKOL_ROZBIEZNOSCI">Protokół rozbieżności</option>
                <option value="MEDIACJA_MRPIPS">Mediacja MRPiPS</option>
                <option value="REFERENDUM_STRAJKOWE">Referendum strajkowe</option>
                <option value="POROZUMIENIE_ZAWISLE">Porozumienie zawisłe</option>
              </select>
            </div>

            <span className="text-[11px] font-mono text-[#5d6b74]">
              Wyświetlono {filteredDisputes.length} z {LABOR_DISPUTES_DATABASE.length} sporów
            </span>
          </div>

          {/* Karty sporów */}
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => {
              const stageBadge = getLegalStageBadge(dispute.legalStage);
              return (
                <div
                  key={dispute.id}
                  className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 hover:border-[rgba(159,186,199,0.25)] transition-all space-y-4"
                >
                  {/* Nagłówek karty */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.15)] text-[#75b8ff] font-bold">
                          {dispute.ticker}
                        </span>
                        <h2 className="text-base font-bold text-white">{dispute.entityName}</h2>
                        <span className="text-xs text-[#8e9da7] font-mono">
                          • {dispute.sector}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e9da7]">
                        Region: <span className="text-zinc-200">{dispute.voivodeship}</span> ({dispute.facilityLocation})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getThreatBadge(
                          dispute.threatLevel
                        )}`}
                      >
                        {dispute.threatLevel}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${stageBadge.color}`}
                      >
                        {stageBadge.label}
                      </span>
                      {dispute.isZuzpThreatened && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ZAGROŻENIE ZUZP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Treść żądań i związki */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#070a0d] p-3 rounded border border-[rgba(159,186,199,0.08)]">
                    <div className="md:col-span-2 space-y-1">
                      <div className="text-[11px] font-semibold text-[#8e9da7]">
                        Żądania związkowe i przedmiot sporu:
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        {dispute.demandSummary}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-[#5d6b74]">Zaangażowane centrale:</span>
                        {dispute.unionsInvolved.map((union) => (
                          <span
                            key={union}
                            className="text-[10px] bg-[#111a21] text-zinc-300 px-1.5 py-0.5 rounded border border-[rgba(159,186,199,0.12)]"
                          >
                            {union}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[rgba(159,186,199,0.08)] pt-2 md:pt-0 md:pl-3">
                      <div>
                        <span className="text-[10px] text-[#5d6b74] block">Liczba załogi w sporze:</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {dispute.workersAffectedCount.toLocaleString("pl-PL")} osób
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5d6b74] block">Szacowany koszt żądań:</span>
                        <span className="text-xs font-mono font-bold text-[#f6c56b]">
                          {dispute.estimatedAnnualCostMlnPln.toFixed(1)} mln PLN / rok
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5d6b74] block">Mediator:</span>
                        <span className="text-[11px] text-[#8e9da7] line-clamp-1">
                          {dispute.mediatorAssigned || "Brak (etap przedmediacyjny)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Linia negocjacyjna MAP i ryzyko polityczne */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-[#111a21]/60 border border-[rgba(87,224,197,0.15)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#57e0c5] mb-1">
                        <Scale className="w-3.5 h-3.5" />
                        <span>Rządowa linia negocjacyjna MAP</span>
                      </div>
                      <p className="text-[11px] text-[#8e9da7] leading-relaxed">
                        {dispute.ministerialNegotiationLine}
                      </p>
                    </div>

                    <div className="p-2.5 rounded bg-[#111a21]/60 border border-[rgba(255,127,135,0.2)]">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#ff7f87] mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Ryzyko wizerunkowe i polityczne dla resortu</span>
                      </div>
                      <p className="text-[11px] text-[#8e9da7] leading-relaxed">
                        {dispute.mapPoliticalRisk}
                      </p>
                    </div>
                  </div>

                  {/* Stopka karty z terminem i przyciskami */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[rgba(159,186,199,0.08)]">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-[#75b8ff] shrink-0" />
                      <span className="font-mono text-[#75b8ff] font-bold">
                        {dispute.nextDeadlineDate}:
                      </span>
                      <span className="text-[#8e9da7] line-clamp-1">
                        {dispute.nextDeadlineDescription}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSimDisputeId(dispute.id);
                          setActiveTab("simulator");
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#57e0c5]/15 text-[#57e0c5] text-xs font-semibold hover:bg-[#57e0c5]/25 border border-[#57e0c5]/30 transition-all"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>Symuluj kompromis</span>
                      </button>

                      {onOpenDossier && (
                        <button
                          type="button"
                          onClick={() => onOpenDossier(dispute.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#111a21] text-[#8e9da7] text-xs font-medium hover:text-white border border-[rgba(159,186,199,0.15)] transition-all"
                        >
                          <span>Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Widok 2: Kalendarium i posiedzenia WRDS */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="bg-[#0d1318] p-4 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <h2 className="text-sm font-bold text-white mb-1">
              Harmonogram posiedzeń Wojewódzkich Rad Dialogu Społecznego i terminów mediacji
            </h2>
            <p className="text-xs text-[#8e9da7]">
              Kluczowe daty wynikające z terminów ustawowych ustawy o rozwiązywaniu sporów zbiorowych oraz sesji WRDS
              z udziałem Wojewodów i Pełnomocników MAP.
            </p>
          </div>

          <div className="relative border-l border-[rgba(159,186,199,0.2)] ml-4 space-y-6 py-2">
            {SOCIAL_DIALOGUE_CALENDAR.map((event) => (
              <div key={event.id} className="relative pl-6">
                {/* Kropka osi czasu */}
                <div
                  className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 bg-[#070a0d] flex items-center justify-center ${
                    event.threatLevel === "KRYTYCZNY"
                      ? "border-[#ff7f87]"
                      : event.threatLevel === "WYSOKI"
                      ? "border-[#f6c56b]"
                      : "border-[#75b8ff]"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      event.threatLevel === "KRYTYCZNY"
                        ? "bg-[#ff7f87]"
                        : event.threatLevel === "WYSOKI"
                        ? "bg-[#f6c56b]"
                        : "bg-[#75b8ff]"
                    }`}
                  />
                </div>

                <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#57e0c5] px-2 py-0.5 rounded bg-[#57e0c5]/10 border border-[#57e0c5]/25">
                        {event.eventDate}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {event.entityName} ({event.entityTicker})
                      </span>
                      <span className="text-[11px] text-[#8e9da7] font-mono">
                        • {event.voivodeship}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border self-start sm:self-auto ${getThreatBadge(
                        event.threatLevel
                      )}`}
                    >
                      {event.threatLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-100">{event.title}</h3>
                  <p className="text-xs text-[#8e9da7]">{event.description}</p>

                  {event.actionRequiredByMap && (
                    <div className="p-2.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.12)] text-xs flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-[#57e0c5] mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#57e0c5] font-mono block">
                          Rekomendowane działanie MAP:
                        </span>
                        <span className="text-zinc-200">{event.actionRequiredByMap}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widok 3: Symulator kompromisu płacowego i kowenantów */}
      {activeTab === "simulator" && (
        <div className="space-y-6">
          <div className="bg-[#0d1318] p-4 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#57e0c5]" />
              <h2 className="text-sm font-bold text-white">
                Symulator kompromisu płacowego i ocena kowenantów bankowych
              </h2>
            </div>
            <p className="text-xs text-[#8e9da7] mt-1">
              Przetestuj scenariusz ustępstwa płacowego wobec żądań związków zawodowych. Silnik natychmiast
              przelicza roczny koszt propozycji, wpływ na marżę EBITDA, nowy wskaźnik Net Debt / EBITDA oraz
              weryfikuje, czy spółka nie naruszy progów w umowach kredytowych z bankami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel wejściowy symulatora */}
            <div className="lg:col-span-5 bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#57e0c5] font-mono">
                Parametry propozycji negocjacyjnej
              </h3>

              {/* Wybór sporu / podmiotu */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Wybierz spółkę i spór zbiorowy:
                </label>
                <select
                  aria-label="Wybierz spółkę i spór zbiorowy"
                  value={simDisputeId}
                  onChange={(e) => setSimDisputeId(e.target.value)}
                  className="w-full bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
                >
                  {LABOR_DISPUTES_DATABASE.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.entityName} ({d.ticker}) - żądanie: {d.demandedWageIncreasePct > 0 ? `+${d.demandedWageIncreasePct}%` : `${d.estimatedAnnualCostMlnPln} mln PLN`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDisputeForSim && (
                <div className="p-3 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] space-y-1 text-xs">
                  <div className="text-[11px] text-[#5d6b74]">Pierwotne żądanie związków:</div>
                  <div className="font-semibold text-zinc-200">
                    {selectedDisputeForSim.demandSummary}
                  </div>
                  <div className="text-[11px] text-[#8e9da7] pt-1">
                    Baza funduszu płac:{" "}
                    <span className="font-mono text-white">
                      {selectedDisputeForSim.financialBaseline.totalPayrollMlnPln} mln PLN
                    </span>{" "}
                    • Załoga:{" "}
                    <span className="font-mono text-white">
                      {selectedDisputeForSim.workersAffectedCount.toLocaleString("pl-PL")} osób
                    </span>
                  </div>
                </div>
              )}

              {/* Suwak podwyżki procentowej */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">
                    Proponowany wzrost płac zasadniczych:
                  </label>
                  <span className="font-mono font-bold text-[#57e0c5] text-sm">
                    {simWagePct.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={simWagePct}
                  onChange={(e) => setSimWagePct(parseFloat(e.target.value))}
                  className="w-full accent-[#57e0c5] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#5d6b74] font-mono">
                  <span>0% (zamrożenie)</span>
                  <span>5% (umiarkowany)</span>
                  <span>10% (wysoki)</span>
                  <span>15% (radykalny)</span>
                </div>
              </div>

              {/* Dodatkowa premia jednorazowa */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">
                    Premia jednorazowa na pracownika:
                  </label>
                  <span className="font-mono font-bold text-[#f6c56b] text-sm">
                    {simBonusPln.toLocaleString("pl-PL")} PLN
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8000"
                  step="250"
                  value={simBonusPln}
                  onChange={(e) => setSimBonusPln(parseInt(e.target.value, 10))}
                  className="w-full accent-[#f6c56b] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#5d6b74] font-mono">
                  <span>0 PLN</span>
                  <span>2 000 PLN</span>
                  <span>4 000 PLN</span>
                  <span>8 000 PLN</span>
                </div>
              </div>

              {/* Szybkie presety */}
              <div className="space-y-1.5 pt-2 border-t border-[rgba(159,186,199,0.1)]">
                <span className="text-[10px] font-mono text-[#5d6b74] uppercase block">
                  Scenariusze referencyjne:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimWagePct(2.0);
                      setSimBonusPln(500);
                    }}
                    className="p-1.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.15)] text-[10px] text-zinc-300 hover:text-white hover:border-[#57e0c5] text-center"
                  >
                    Konserwatywny (2%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimWagePct(4.5);
                      setSimBonusPln(2000);
                    }}
                    className="p-1.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.15)] text-[10px] text-zinc-300 hover:text-white hover:border-[#57e0c5] text-center"
                  >
                    Kompromis MAP (4.5%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDisputeForSim) {
                        setSimWagePct(selectedDisputeForSim.demandedWageIncreasePct || 8.0);
                        setSimBonusPln(selectedDisputeForSim.demandedOneOffBonusPln || 0);
                      }
                    }}
                    className="p-1.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.15)] text-[10px] text-[#ff7f87] hover:border-[#ff7f87] text-center"
                  >
                    100% Żądań
                  </button>
                </div>
              </div>
            </div>

            {/* Wyniki symulacji */}
            <div className="lg:col-span-7 space-y-4">
              {simulationResult ? (
                <>
                  {/* Główny werdykt kowenantowy */}
                  <div
                    className={`p-4 rounded-lg border ${
                      simulationResult.covenantBreached
                        ? "bg-[#ff7f87]/10 border-[#ff7f87]/40 text-[#ff7f87]"
                        : "bg-[#57e0c5]/10 border-[#57e0c5]/40 text-[#57e0c5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {simulationResult.covenantBreached ? (
                        <AlertOctagon className="w-5 h-5 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      )}
                      <div>
                        <div className="text-sm font-bold">
                          {simulationResult.covenantBreached
                            ? "NARUSZENIE KOWENANTU BANKOWEGO"
                            : "BEZPIECZNY HORYZONT FINANSOWY"}
                        </div>
                        <p className="text-xs text-zinc-200 mt-0.5">
                          {simulationResult.recommendationNote}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Szczegółowe metryki po symulacji */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
                      <span className="text-[10px] text-[#5d6b74] uppercase font-mono block">
                        Roczny koszt propozycji
                      </span>
                      <div className="text-lg font-bold font-mono text-white mt-1">
                        {simulationResult.simulatedAnnualCostMlnPln.toFixed(1)} <span className="text-xs">mln</span>
                      </div>
                      <span className="text-[10px] text-[#8e9da7] mt-0.5 block">
                        Oszczędność: {simulationResult.savingsVsDemandsMlnPln.toFixed(1)} mln PLN
                      </span>
                    </div>

                    <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
                      <span className="text-[10px] text-[#5d6b74] uppercase font-mono block">
                        Nowa EBITDA spółki
                      </span>
                      <div
                        className={`text-lg font-bold font-mono mt-1 ${
                          simulationResult.simulatedEbitdaMlnPln < 0
                            ? "text-[#ff7f87]"
                            : "text-[#57e0c5]"
                        }`}
                      >
                        {simulationResult.simulatedEbitdaMlnPln.toFixed(1)} <span className="text-xs">mln</span>
                      </div>
                      <span className="text-[10px] text-[#8e9da7] mt-0.5 block">
                        Baza: {simulationResult.baselineEbitdaMlnPln.toFixed(1)} mln
                      </span>
                    </div>

                    <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
                      <span className="text-[10px] text-[#5d6b74] uppercase font-mono block">
                        Net Debt / EBITDA
                      </span>
                      <div
                        className={`text-lg font-bold font-mono mt-1 ${
                          simulationResult.covenantBreached ? "text-[#ff7f87]" : "text-white"
                        }`}
                      >
                        {simulationResult.simulatedNetDebtToEbitda > 0
                          ? `${simulationResult.simulatedNetDebtToEbitda.toFixed(2)}x`
                          : "Ujemna"}
                      </div>
                      <span className="text-[10px] text-[#8e9da7] mt-0.5 block">
                        Limit: {simulationResult.covenantMaxAllowed}x
                      </span>
                    </div>

                    <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
                      <span className="text-[10px] text-[#5d6b74] uppercase font-mono block">
                        Spokój społeczny
                      </span>
                      <div className="text-lg font-bold font-mono text-[#75b8ff] mt-1">
                        ~{simulationResult.socialPeaceHorizonMonths} <span className="text-xs">mies.</span>
                      </div>
                      <span className="text-[10px] text-[#8e9da7] mt-0.5 block">
                        Szacowany horyzont
                      </span>
                    </div>
                  </div>

                  {/* Porównanie graficzne Baza vs Symulacja */}
                  <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Bilans wpływu na finanse spółki
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#8e9da7]">
                            Stopień pokrycia roszczeń związkowych (koszt kompromisu vs żądania):
                          </span>
                          <span className="font-mono text-white">
                            {selectedDisputeForSim && selectedDisputeForSim.estimatedAnnualCostMlnPln > 0
                              ? `${Math.round(
                                  (simulationResult.simulatedAnnualCostMlnPln /
                                    selectedDisputeForSim.estimatedAnnualCostMlnPln) *
                                    100
                                )}%`
                              : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 bg-[#070a0d] rounded-full overflow-hidden border border-[rgba(159,186,199,0.1)]">
                          <div
                            className="h-full bg-gradient-to-r from-[#57e0c5] to-[#f6c56b]"
                            style={{
                              width: `${Math.min(
                                100,
                                selectedDisputeForSim && selectedDisputeForSim.estimatedAnnualCostMlnPln > 0
                                  ? (simulationResult.simulatedAnnualCostMlnPln /
                                      selectedDisputeForSim.estimatedAnnualCostMlnPln) *
                                      100
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-[#8e9da7]">
                            Wykorzystanie limitu długu (Net Debt / EBITDA vs Kowenant {simulationResult.covenantMaxAllowed}x):
                          </span>
                          <span className="font-mono text-white">
                            {simulationResult.simulatedNetDebtToEbitda > 0
                              ? `${Math.round(
                                  (simulationResult.simulatedNetDebtToEbitda /
                                    simulationResult.covenantMaxAllowed) *
                                    100
                                )}%`
                              : "Przekroczone"}
                          </span>
                        </div>
                        <div className="h-2 bg-[#070a0d] rounded-full overflow-hidden border border-[rgba(159,186,199,0.1)]">
                          <div
                            className={`h-full ${
                              simulationResult.covenantBreached
                                ? "bg-[#ff7f87]"
                                : "bg-[#57e0c5]"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                simulationResult.simulatedNetDebtToEbitda > 0
                                  ? (simulationResult.simulatedNetDebtToEbitda /
                                      simulationResult.covenantMaxAllowed) *
                                      100
                                  : 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-8 text-center text-xs text-[#8e9da7]">
                  Wybierz spółkę i skonfiguruj parametry propozycji negocjacyjnej, aby wyświetlić wynik symulacji.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
