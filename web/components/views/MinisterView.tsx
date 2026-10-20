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
} from "lucide-react";
import {
  OVERALL_CRISIS_TEMPERATURE,
  SECTOR_STABILITY_DATA,
  TOP_FIRE_ALERTS,
  PARLIAMENTARY_INQUIRIES,
} from "@/lib/mapscope-data.ts";

interface MinisterViewProps {
  onOpenDossier: (entityId: string) => void;
}

export function MinisterView({ onOpenDossier }: MinisterViewProps) {
  const [expandedInquiryId, setExpandedInquiryId] = useState<string | null>(
    PARLIAMENTARY_INQUIRIES[0]?.id || null
  );

  return (
    <div className="space-y-6">
      {/* Pasek Tytułowy Gabinetu Ministra */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#ff7f87]/15 text-[#ff7f87] border border-[#ff7f87]/30 font-bold">
              GABINET MINISTRA • KOKPIT ZARZĄDCZY
            </span>
            <span className="text-xs text-[#8e9da7]">Aktualizacja: 20 października 2026</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Radar strategiczny i wskaźnik temperatury kryzysowej wokół SSP
          </h1>
          <p className="text-xs text-[#8e9da7]">
            Priorytetowa synteza ryzyk właścicielskich, pożarów dnia oraz uderzeń polityczno-kontrolnych w resort.
          </p>
        </div>

        {/* Wskaźnik temperatury kryzysowej */}
        <div className="flex items-center gap-4 p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Pierścień SVG temperatury */}
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
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
              <span className="text-sm font-bold font-mono text-white">
                {OVERALL_CRISIS_TEMPERATURE}
              </span>
              <span className="text-[8px] text-[#8e9da7] font-mono">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff7f87]">
              <Flame className="w-3.5 h-3.5" />
              <span>STAN PODWYŻSZONY</span>
            </div>
            <p className="text-[11px] text-[#8e9da7] mt-0.5">
              Główne ogniska: Totalizator, PKP CARGO, Poczta
            </p>
          </div>
        </div>
      </div>

      {/* Moduł: Najważniejsze pożary dnia (Top Alerts P1/P2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff7f87]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Najważniejsze pożary dnia (Top Alerts P1/P2)
            </h2>
          </div>
          <span className="text-xs text-[#8e9da7] font-mono">
            {TOP_FIRE_ALERTS.length} pilnych spraw wymagających decyzji
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TOP_FIRE_ALERTS.map((alert) => {
            const isP1 = alert.priority === "p1";
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
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                        isP1
                          ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                          : "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                      }`}
                    >
                      {isP1 ? "ALARM KRYZYSOWY P1" : "OSTRZEŻENIE P2"}
                    </span>
                    <span className="text-[11px] text-[#8e9da7] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleTimeString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
                        Co się stało:
                      </span>
                      <p className="text-white mt-0.5 leading-relaxed">{alert.whatHappened}</p>
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
    </div>
  );
}
