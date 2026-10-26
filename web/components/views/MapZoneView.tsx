"use client";

import React, { useState, useMemo } from "react";
import {
  Landmark,
  ShieldAlert,
  Flame,
  MessageSquare,
  FileText,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Send,
  Building,
  Radio,
  FileCheck,
  Scale,
  Calendar,
  Search,
  ExternalLink,
} from "lucide-react";
import type {
  MapLeadershipMemberRecord,
  MapPressInquiryRecord,
  MapDirectCrisisRecord,
  MapPressReleaseRecord,
  PressInquiryUrgency,
  MapCrisisSeverity,
} from "@/lib/types.ts";
import {
  MAP_LEADERSHIP,
  MAP_DIRECT_CRISES,
  MAP_PRESS_RELEASES,
  MAP_PRESS_INQUIRIES,
  getMapZoneSummary,
} from "@/lib/map-zone-data.ts";

export function MapZoneView() {
  const [activeTab, setActiveTab] = useState<
    "crises" | "leadership" | "inquiries" | "releases"
  >("crises");
  const [selectedCrisisCategory, setSelectedCrisisCategory] = useState<string>("all");
  const [selectedInquiryUrgency, setSelectedInquiryUrgency] = useState<string>("all");

  const summary = useMemo(() => getMapZoneSummary(), []);

  const filteredCrises = useMemo(() => {
    return MAP_DIRECT_CRISES.filter((c) => {
      if (selectedCrisisCategory !== "all" && c.category !== selectedCrisisCategory) {
        return false;
      }
      return true;
    });
  }, [selectedCrisisCategory]);

  const filteredInquiries = useMemo(() => {
    return MAP_PRESS_INQUIRIES.filter((q) => {
      if (selectedInquiryUrgency !== "all" && q.urgency !== selectedInquiryUrgency) {
        return false;
      }
      return true;
    });
  }, [selectedInquiryUrgency]);

  const getSeverityBadge = (severity: MapCrisisSeverity) => {
    switch (severity) {
      case "KRYTYCZNE":
        return "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/35";
      case "WYSOKIE":
        return "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/35";
      case "SREDNIE":
        return "bg-[#75b8ff]/15 text-[#75b8ff] border-[#75b8ff]/35";
      case "MONITOROWANE":
        return "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/35";
    }
  };

  const getUrgencyBadge = (urgency: PressInquiryUrgency) => {
    switch (urgency) {
      case "PILNE_DO_2H":
        return "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/35 animate-pulse";
      case "DZISIAJ":
        return "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/35";
      case "USTAWOWE_14DNI":
        return "bg-[#75b8ff]/15 text-[#75b8ff] border-[#75b8ff]/35";
      case "ZREALIZOWANE":
        return "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/35";
    }
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek i tożsamość gmachu resortu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(159,186,199,0.14)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30">
              GMACH GŁÓWNY • UL. KRUCZA 36/WSPÓLNA 6, WARSZAWA
            </span>
            <span className="text-xs text-[#8e9da7] font-mono">
              Radar Instytucjonalny i Komunikacyjny MAP
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Strefa MAP — Kierownictwo, komunikacja i kryzysy bezpośrednie
          </h1>
          <p className="text-xs text-[#8e9da7] mt-1 max-w-3xl">
            Monitoring wizerunku samego ministerstwa, wystąpień medialnych kierownictwa, oficjalnych komunikatów
            i sprostowań w BIP/PAP, zgłoszonych pikiet przed gmachem oraz zapytań redakcyjnych z odliczaniem terminu.
          </p>
        </div>

        {/* Zakładki */}
        <div className="flex items-center gap-1 bg-[#0d1318] p-1 rounded-lg border border-[rgba(159,186,199,0.14)] max-w-full overflow-x-auto scrollbar-none whitespace-nowrap shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("crises")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "crises"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Kryzysy resortu ({MAP_DIRECT_CRISES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leadership")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "leadership"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Kierownictwo ({MAP_LEADERSHIP.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "inquiries"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Zapytania mediów ({summary.activePressInquiriesCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("releases")}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeTab === "releases"
                ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow"
                : "text-[#8e9da7] hover:text-white"
            }`}
          >
            Komunikaty i sprostowania ({MAP_PRESS_RELEASES.length})
          </button>
        </div>
      </div>

      {/* Pasek KPI Strefy MAP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Napięcie wokół MAP</span>
            <Flame className="w-3.5 h-3.5 text-[#ff7f87]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#ff7f87] mt-1">
            {summary.overallMapTensionIndex} <span className="text-xs font-normal">/ 100</span>
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Stan podwyższony</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Kryzysy resortu</span>
            <AlertOctagon className="w-3.5 h-3.5 text-[#f6c56b]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {MAP_DIRECT_CRISES.length}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">
            W tym {summary.criticalDirectCrisesCount} krytyczny
          </div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Pikiety pod gmachem</span>
            <Users className="w-3.5 h-3.5 text-[#57e0c5]" />
          </div>
          <div className="text-xl font-bold font-mono mt-1 text-white">
            0 <span className="text-xs font-normal text-[#8e9da7]">aktywnych</span>
          </div>
          <div className="text-[10px] text-[#57e0c5] mt-0.5">
            Ostatnia: 23.10 (zakończona)
          </div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Otwarte zapytania</span>
            <MessageSquare className="w-3.5 h-3.5 text-[#75b8ff]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.activePressInquiriesCount}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">W Biurze Prasowym</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Kontrole i interpelacje</span>
            <Scale className="w-3.5 h-3.5 text-[#e5b958]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.pendingParliamentaryInquiriesCount}
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Spraw sejmowych</div>
        </div>

        <div className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-3">
          <div className="flex items-center justify-between text-[#8e9da7] text-[11px]">
            <span>Czas reakcji</span>
            <Clock className="w-3.5 h-3.5 text-[#57e0c5]" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {summary.averageSpokespersonResponseTimeHours} <span className="text-xs font-normal">godz.</span>
          </div>
          <div className="text-[10px] text-[#5d6b74] mt-0.5">Średnia odpowiedzi</div>
        </div>
      </div>

      {/* Widok 1: Kryzysy resortu i pikiety */}
      {activeTab === "crises" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1318] p-3 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8e9da7]">Kategoria zagrożenia:</span>
              <select
                aria-label="Kategoria zagrożenia"
                value={selectedCrisisCategory}
                onChange={(e) => setSelectedCrisisCategory(e.target.value)}
                className="bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
              >
                <option value="all">Wszystkie kategorie ({MAP_DIRECT_CRISES.length})</option>
                <option value="PROTESTY_SPOŁECZNE">Protesty społeczne pod gmachem</option>
                <option value="KONTROLA_SEJMOWA">Kontrole poselskie w MAP</option>
                <option value="AUDYT_I_PROKURATURA">Audyty i kowenanty</option>
                <option value="KADRY_OBSADA">Kadry i obsada</option>
              </select>
            </div>
            <span className="text-[11px] font-mono text-[#5d6b74]">
              Wyświetlono {filteredCrises.length} z {MAP_DIRECT_CRISES.length} spraw
            </span>
          </div>

          <div className="space-y-4">
            {filteredCrises.map((crisis) => (
              <div
                key={crisis.id}
                className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 space-y-4 hover:border-[rgba(159,186,199,0.25)] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#111a21] text-[#75b8ff] border border-[rgba(159,186,199,0.15)]">
                        {crisis.category}
                      </span>
                      <h2 className="text-base font-bold text-white">{crisis.title}</h2>
                    </div>
                    <p className="text-xs text-[#8e9da7]">
                      Termin incydentu: <span className="font-mono text-zinc-200">{crisis.incidentDate}</span> •
                      Dotyczy:{" "}
                      <span className="text-[#57e0c5]">
                        {crisis.affectedLeadership.join(", ")}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {crisis.temporalStatus === "ODBYŁO_SIĘ" && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#75b8ff]/15 text-[#75b8ff] border border-[#75b8ff]/35">
                        ODBYŁO SIĘ (3 DNI TEMU)
                      </span>
                    )}
                    {crisis.temporalStatus === "W_TOKU" && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#f6c56b]/15 text-[#f6c56b] border border-[#f6c56b]/35">
                        W TOKU (AUDYT TRWA)
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                        crisis.severity
                      )}`}
                    >
                      {crisis.severity}
                    </span>
                    {crisis.isLiveProtestToday && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ff7f87]/20 text-[#ff7f87] border border-[#ff7f87]/40 animate-pulse">
                        PIKIETA POD RESORTEM DZISIAJ
                      </span>
                    )}
                    {crisis.parliamentaryControlActive && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#e5b958]/20 text-[#e5b958] border border-[#e5b958]/40">
                        KONTROLA W GMACHU
                      </span>
                    )}
                  </div>
                </div>

                {/* Opis sprawy */}
                <div className="p-3 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] text-xs text-zinc-200 leading-relaxed">
                  {crisis.summary}
                </div>

                {/* Rezultat i realizacja ustaleń (post-crisis) */}
                {crisis.postCrisisResolution && (
                  <div className="p-3 rounded bg-[#57e0c5]/10 border border-[#57e0c5]/30 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[#57e0c5] font-bold text-[11px] uppercase font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Rezultat i realizacja ustaleń (post-crisis):</span>
                    </div>
                    <div className="text-zinc-200 leading-relaxed">
                      {crisis.postCrisisResolution}
                    </div>
                  </div>
                )}

                {/* Pikieta szczegóły jeśli występuje */}
                {crisis.protestDetails && (
                  <div className="p-3 rounded bg-zinc-900/60 border border-[rgba(159,186,199,0.18)] text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[#8e9da7] font-bold text-[11px] uppercase font-mono">
                      <div className="flex items-center gap-1.5 text-[#75b8ff]">
                        <Users className="w-3.5 h-3.5" />
                        <span>Parametry zgromadzenia publicznego (odbyte 23.10 pod MAP):</span>
                      </div>
                      <span className="text-[10px] text-[#57e0c5] font-normal normal-case">
                        Zakończone • Petycja przyjęta
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#8e9da7]">
                      <div>
                        Lokalizacja:{" "}
                        <span className="text-white font-semibold">
                          {crisis.protestDetails.location}
                        </span>
                      </div>
                      <div>
                        Deklarowana liczba:{" "}
                        <span className="text-[#ff7f87] font-mono font-bold">
                          {crisis.protestDetails.registeredParticipants.toLocaleString("pl-PL")} osób
                        </span>
                      </div>
                      <div>
                        Organizator:{" "}
                        <span className="text-zinc-200">
                          {crisis.protestDetails.organizer}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wektor ataku opozycji vs rządowa linia MAP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#111a21]/60 border border-[rgba(255,127,135,0.25)] space-y-1">
                    <span className="text-[11px] font-bold text-[#ff7f87] flex items-center gap-1.5 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Wektor ataku politycznego na resort:
                    </span>
                    <p className="text-[11px] text-[#8e9da7] leading-relaxed">
                      {crisis.oppositionAttackVector}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#111a21]/60 border border-[rgba(87,224,197,0.25)] space-y-1">
                    <span className="text-[11px] font-bold text-[#57e0c5] flex items-center gap-1.5 font-mono">
                      <Scale className="w-3.5 h-3.5" />
                      Rządowa linia obrony i fakty MAP:
                    </span>
                    <p className="text-[11px] text-[#8e9da7] leading-relaxed">
                      {crisis.ministerialCounterNarrative}
                    </p>
                  </div>
                </div>

                {/* Zadania dla Gabinetu */}
                <div className="p-3 rounded bg-[#0d1318] border border-[rgba(159,186,199,0.1)] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#75b8ff] font-mono block">
                    Polecenia operacyjne dla Gabinetu i Biura Ministra:
                  </span>
                  <div className="space-y-1">
                    {crisis.actionItemsForCabinet.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#57e0c5] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widok 2: Kierownictwo resortu i podział nadzoru */}
      {activeTab === "leadership" && (
        <div className="space-y-4">
          <div className="bg-[#0d1318] p-4 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <h2 className="text-sm font-bold text-white mb-1">
              Ścisłe kierownictwo Ministerstwa Aktywów Państwowych
            </h2>
            <p className="text-xs text-[#8e9da7]">
              Podział kompetencji nadzorczych, przypisane departamenty i sektory, sentyment medialny oraz
              rejestr ostatnich wystąpień publicznych.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAP_LEADERSHIP.map((leader) => (
              <div
                key={leader.id}
                className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 space-y-4 hover:border-[rgba(159,186,199,0.25)] transition-all"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[rgba(159,186,199,0.1)] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#111a21] text-[#75b8ff] border border-[rgba(159,186,199,0.15)]">
                      {leader.role}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{leader.name}</h3>
                    <p className="text-xs text-[#8e9da7]">{leader.title}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#5d6b74] font-mono block">Sentyment</span>
                    <span
                      className={`text-sm font-mono font-bold ${
                        leader.mediaSentimentScore < -0.2
                          ? "text-[#ff7f87]"
                          : leader.mediaSentimentScore > 0.1
                          ? "text-[#57e0c5]"
                          : "text-[#f6c56b]"
                      }`}
                    >
                      {leader.mediaSentimentScore > 0 ? `+${leader.mediaSentimentScore}` : leader.mediaSentimentScore}
                    </span>
                  </div>
                </div>

                {/* Departamenty i sektory */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#5d6b74] block">
                      Nadzorowane departamenty:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {leader.supervisedDepartments.map((dept) => (
                        <span
                          key={dept}
                          className="text-[10px] bg-[#111a21] text-zinc-300 px-2 py-0.5 rounded border border-[rgba(159,186,199,0.12)]"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#5d6b74] block">
                      Kluczowe sektory i domeny:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {leader.assignedSectors.map((sec) => (
                        <span
                          key={sec}
                          className="text-[10px] bg-[#57e0c5]/10 text-[#57e0c5] px-2 py-0.5 rounded border border-[#57e0c5]/25"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bieżące sprawy na wokandzie */}
                <div className="p-3 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] space-y-1">
                  <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                    Główne tematy na wokandzie:
                  </span>
                  <ul className="text-xs text-zinc-200 space-y-0.5 list-disc list-inside">
                    {leader.currentKeyTopics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>

                {/* Ostatnie wystąpienie medialne */}
                {leader.lastMediaAppearance && (
                  <div className="p-2.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.1)] text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#5d6b74] block font-mono">
                        Ostatnie wystąpienie: {leader.lastMediaAppearance.date}
                      </span>
                      <span className="text-white font-medium">
                        {leader.lastMediaAppearance.mediaOutlet}
                      </span>
                      <p className="text-[11px] text-[#8e9da7] line-clamp-1">
                        „{leader.lastMediaAppearance.topic}”
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                        leader.lastMediaAppearance.tone === "trudny"
                          ? "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/30"
                          : leader.lastMediaAppearance.tone === "pozytywny"
                          ? "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/30"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700"
                      }`}
                    >
                      {leader.lastMediaAppearance.tone}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widok 3: Biuro Prasowe i zapytania dziennikarskie */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1318] p-3 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8e9da7]">Pilność zapytania:</span>
              <select
                aria-label="Pilność zapytania"
                value={selectedInquiryUrgency}
                onChange={(e) => setSelectedInquiryUrgency(e.target.value)}
                className="bg-[#111a21] border border-[rgba(159,186,199,0.2)] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#57e0c5]"
              >
                <option value="all">Wszystkie zapytania ({MAP_PRESS_INQUIRIES.length})</option>
                <option value="PILNE_DO_2H">Pilne (do 2 godzin)</option>
                <option value="DZISIAJ">Dziś</option>
                <option value="USTAWOWE_14DNI">Tryb ustawowy</option>
                <option value="ZREALIZOWANE">Wysłane / Zrealizowane</option>
              </select>
            </div>
            <span className="text-[11px] font-mono text-[#5d6b74]">
              Rejestr Biura Prasowego MAP
            </span>
          </div>

          <div className="space-y-4">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 space-y-4 hover:border-[rgba(159,186,199,0.25)] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.15)]">
                        {inq.mediaOutlet}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-100">{inq.subject}</h3>
                    </div>
                    <p className="text-xs text-[#8e9da7]">
                      Autor: <span className="text-zinc-300 font-semibold">{inq.journalistName}</span> •
                      Wpłynęło: <span className="font-mono">{inq.receivedAt}</span> • Termin:{" "}
                      <span className="font-mono font-bold text-[#ff7f87]">{inq.deadlineAt}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getUrgencyBadge(
                        inq.urgency
                      )}`}
                    >
                      {inq.urgency}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {inq.status}
                    </span>
                  </div>
                </div>

                {/* Zadane pytania */}
                <div className="p-3 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#8e9da7] block">
                    Pytania redakcji:
                  </span>
                  <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                    {inq.detailedQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                {/* Wyznaczona linia rzecznika MAP */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded bg-[#111a21] border border-[rgba(87,224,197,0.2)]">
                    <span className="text-[10px] uppercase font-mono text-[#57e0c5] font-bold block mb-1">
                      Autoryzowana odpowiedź Biura Prasowego MAP:
                    </span>
                    <p className="text-zinc-200 leading-relaxed">{inq.assignedSpokespersonLine}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
                      <span className="text-[#8e9da7] font-semibold block mb-0.5">
                        Twarde dane i liczby:
                      </span>
                      <span className="text-zinc-300">{inq.factsAndFigures}</span>
                    </div>

                    <div className="p-2.5 rounded bg-[#070a0d] border border-red-500/20">
                      <span className="text-red-400 font-semibold block mb-0.5">
                        Czerwone linie (czego nie wolno mówić):
                      </span>
                      <span className="text-zinc-300">{inq.redLines}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widok 4: Oficjalne komunikaty i sprostowania */}
      {activeTab === "releases" && (
        <div className="space-y-4">
          <div className="bg-[#0d1318] p-4 rounded-lg border border-[rgba(159,186,199,0.14)]">
            <h2 className="text-sm font-bold text-white mb-1">
              Oficjalne komunikaty prasowe, sprostowania i briefingi MAP
            </h2>
            <p className="text-xs text-[#8e9da7]">
              Publikacje w serwisie Rzeczypospolitej Polskiej gov.pl/aktywa-panstwowe, Biuletynie Informacji
              Publicznej (BIP) oraz sprostowania w trybie art. 31a Prawa prasowego.
            </p>
          </div>

          <div className="space-y-4">
            {MAP_PRESS_RELEASES.map((rel) => (
              <div
                key={rel.id}
                className="bg-[#0d1318] border border-[rgba(159,186,199,0.14)] rounded-lg p-5 space-y-3 hover:border-[rgba(159,186,199,0.25)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          rel.isRectification
                            ? "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/35"
                            : "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/35"
                        }`}
                      >
                        {rel.category}
                      </span>
                      <span className="text-xs font-mono text-[#8e9da7]">
                        Kanał: <span className="text-white">{rel.channel}</span>
                      </span>
                      <span className="text-xs text-[#5d6b74] font-mono">• {rel.publishedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{rel.title}</h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#5d6b74] font-mono block">Zasięg szacunkowy</span>
                    <span className="text-xs font-mono font-bold text-[#75b8ff]">
                      {rel.reachEstimate.toLocaleString("pl-PL")} odczytów
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{rel.summary}</p>

                {/* Cytaty */}
                <div className="p-3 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#57e0c5] font-bold block">
                    Kluczowe cytaty ministerialne:
                  </span>
                  {rel.keyQuotes.map((quote, idx) => (
                    <p key={idx} className="text-xs text-zinc-300 italic">
                      „{quote}”
                    </p>
                  ))}
                </div>

                {rel.targetMediaOutlet && (
                  <div className="text-[11px] text-[#8e9da7] font-mono">
                    Skierowano do redakcji:{" "}
                    <span className="text-white font-semibold">{rel.targetMediaOutlet}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
