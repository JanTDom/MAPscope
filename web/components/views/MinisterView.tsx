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
} from "lucide-react";
import {
  OVERALL_CRISIS_TEMPERATURE,
  SECTOR_STABILITY_DATA,
  TOP_FIRE_ALERTS,
  PARLIAMENTARY_INQUIRIES,
  KPRM_ONE_PAGER_DATA,
} from "@/lib/mapscope-data.ts";

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
            Radar strategiczny, Tarcza Sejmowa i temperatura kryzysowa SSP
          </h1>
          <p className="text-xs text-[#8e9da7]">
            Ochrona przed zaskoczeniem w Sejmie, pożary dnia, rozróżnienie zaszłości od bieżącej odpowiedzialności i briefingi dla Premiera.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Przycisk KPRM One-Pager */}
          <button
            type="button"
            onClick={() => setIsKprmModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white border border-[rgba(159,186,199,0.25)] text-xs font-semibold shadow-sm transition-all hover:border-[#57e0c5]/50 group"
          >
            <FileText className="w-4 h-4 text-[#57e0c5] group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block leading-tight text-white">Raport dla Premiera</span>
              <span className="text-[10px] text-[#8e9da7] font-mono block">KPRM One-Pager</span>
            </div>
          </button>

          {/* Wskaźnik temperatury kryzysowej */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
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
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff7f87]">
                <Flame className="w-3 h-3" />
                <span>STAN PODWYŻSZONY</span>
              </div>
              <p className="text-[10px] text-[#8e9da7]">
                Totalizator, PKP CARGO, Poczta
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
