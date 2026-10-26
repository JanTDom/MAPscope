"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Users,
  MessageSquareWarning,
  DollarSign,
  Scale,
  HeartHandshake,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  FileCheck2,
  Lock,
  Sparkles,
  Copy,
  CheckCircle2,
  Gavel,
  TrendingUp,
  MapPin,
} from "lucide-react";
import type { EntityRecord, InternalDataEntry } from "@/lib/types.ts";
import { RadarSpiderChart } from "@/components/charts/RadarSpiderChart.tsx";
import {
  STOCK_EXCHANGE_DATA,
  ESPI_REPORTS_DATA,
  ANALYST_CONSENSUS_DATA,
  LOCAL_MUNICIPAL_ISSUES,
} from "@/lib/mapscope-data.ts";
import { getKrsLastSyncDate } from "@/lib/time-service.ts";

interface DossierModalProps {
  entity: EntityRecord | null;
  onClose: () => void;
  internalData?: InternalDataEntry;
}

export function DossierModal({ entity, onClose, internalData }: DossierModalProps) {
  const [activeTab, setActiveTab] = useState<
    "briefing" | "governance" | "communication" | "finance" | "legal" | "social" | "timeline" | "market" | "local"
  >("briefing");
  const [copiedBriefing, setCopiedBriefing] = useState(false);

  if (!entity) return null;

  const d = entity.dossier;
  const score = entity.recent_risk_score ?? 0;
  const mb = d?.ministerBriefing;

  const handleCopyBriefing = () => {
    if (!mb) return;
    const text = [
      `FISZKA MINISTRA MAP — ${entity.name.toUpperCase()}`,
      `Udział SP: ${entity.state_share_percent}% | Sektor: ${entity.sector}`,
      `Nadzór: ${entity.ownership_body} | Status: ${entity.status.toUpperCase()}`,
      "",
      "KLUCZOWE WSKAŹNIKI:",
      ...mb.threeNumbers.map((n) => `• ${n.label}: ${n.value}`),
      "",
      `STAN SPRAWY: ${mb.statusSummary}`,
      `REKOMENDOWANA LINIA OBRONY: ${mb.defensiveTalkingPoint}`,
      `RYZYKO KRYZYSOWE NA TEN TYDZIEŃ: ${mb.keyRiskThisWeek}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-xl sm:rounded-2xl bg-[#0d1318] border border-[rgba(159,186,199,0.24)] shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Belka Tytułowa */}
        <div className="p-3.5 sm:p-5 border-b border-[rgba(159,186,199,0.14)] bg-[#111a21] flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30 font-bold">
                PRZEŚWIETLENIE 360° SPÓŁKI
              </span>
              {entity.is_public_listed && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#75b8ff]/15 text-[#75b8ff] border border-[#75b8ff]/30">
                  GPW: {entity.stock_ticker}
                </span>
              )}
              {internalData && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e5b958]/20 text-[#e5b958] border border-[#e5b958]/40 flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>DANE WEWNĘTRZNE MAP</span>
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-xl font-bold text-white mt-1.5 truncate">{entity.name}</h2>
            <div className="text-xs text-[#8e9da7] flex flex-wrap items-center gap-2 mt-1">
              <span>{entity.sector}</span>
              <span>•</span>
              <span>NIP: <strong className="font-mono text-white">{entity.nip || "Brak"}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span>KRS:</span>
                <strong className="font-mono text-white">{entity.krs || "Brak"}</strong>
                {entity.krs && (
                  <a
                    href={entity.krs_registry_url || "https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#57e0c5] hover:underline bg-[#57e0c5]/10 px-1.5 py-0.5 rounded border border-[#57e0c5]/25"
                    title="Zweryfikuj w Centralnej Informacji KRS (ekrs.ms.gov.pl)"
                  >
                    <span>eKRS MS</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </span>
              <span>•</span>
              <span>Udział Skarbu Państwa: <strong className="font-mono text-[#57e0c5]">{entity.state_share_percent}%</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[#5d6b74] font-mono block">OCENA RYZYKA</span>
              <span
                className={`text-sm sm:text-base font-bold font-mono px-2 py-0.5 rounded border inline-block ${
                  score >= 7
                    ? "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40"
                    : score >= 4
                    ? "bg-[#f6c56b]/20 text-[#f6c56b] border-[#f6c56b]/40"
                    : "bg-[#57e0c5]/20 text-[#57e0c5] border-[#57e0c5]/40"
                }`}
              >
                {score.toFixed(1)}/10
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#16222b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zakładki Filarów + Fiszka Ministra */}
        <div className="flex items-center border-b border-[rgba(159,186,199,0.14)] bg-[#090d12] px-2 sm:px-3 overflow-x-auto scrollbar-none whitespace-nowrap">
          {[
            { id: "briefing", label: "★ Fiszka Ministra (10s)", icon: Sparkles, highlight: true },
            { id: "governance", label: "1. Ład i Własność", icon: Users },
            { id: "communication", label: "2. Ryzyko Komunikacji", icon: MessageSquareWarning },
            { id: "finance", label: "3. Finanse i Inwestycje", icon: DollarSign },
            { id: "legal", label: "4. Prawne i Spory", icon: Scale },
            { id: "social", label: "5. Czynniki Społeczne", icon: HeartHandshake },
            { id: "timeline", label: "6. Oś Czasu", icon: Clock },
            { id: "market", label: "7. Giełda i ESPI", icon: TrendingUp },
            { id: "local", label: "8. Samorządy i Ekologia", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? tab.highlight
                      ? "border-[#57e0c5] text-[#57e0c5] bg-[#0d1318]"
                      : "border-[#75b8ff] text-white bg-[#0d1318]"
                    : tab.highlight
                    ? "border-transparent text-[#57e0c5]/80 hover:text-[#57e0c5] hover:bg-[#0d1318]/50"
                    : "border-transparent text-[#8e9da7] hover:text-white hover:bg-[#0d1318]/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.highlight ? "text-[#57e0c5]" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Treść Zakładek */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Filar 0: Fiszka Ministra (Briefing 10s na smartfon) */}
          {activeTab === "briefing" && mb && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#111a21] border border-[#57e0c5]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#57e0c5] font-bold block">
                    PAKIET GABINETOWY DO BRIEFINGU PRASOWEGO
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Trzy liczby, linia obrony i kluczowe ryzyko na ten tydzień
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBriefing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-xs font-bold text-[#57e0c5] border border-[#57e0c5]/30 transition-colors shrink-0"
                >
                  {copiedBriefing ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#57e0c5]" />
                      <span>Skopiowano do schowka!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj fiszkę na smartfon</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3 Kluczowe Liczby */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mb.threeNumbers.map((num, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.12)] text-center space-y-1"
                  >
                    <span className="text-[10px] font-mono uppercase text-[#8e9da7] block truncate">
                      {num.label}
                    </span>
                    <span className="text-xl font-bold font-mono text-white block">
                      {num.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Sześcioosiowy Radar Dojrzałości Zarządczej Spółki */}
              <RadarSpiderChart entityId={entity.id} />

              {/* Status Sytuacji */}
              <div className="p-4 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.1)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8e9da7] font-semibold block">
                  1. Faktyczny stan sprawy:
                </span>
                <p className="text-xs text-white leading-relaxed">{mb.statusSummary}</p>
              </div>

              {/* Zalecana Linia Obrony */}
              <div className="p-4 rounded-xl bg-[#111a21] border border-[#57e0c5]/30 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-bold block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Rekomendowana linia obrony dla Ministra (Talking Point):</span>
                </span>
                <p className="text-xs text-white font-medium leading-relaxed">
                  "{mb.defensiveTalkingPoint}"
                </p>
              </div>

              {/* Kluczowe Ryzyko */}
              <div className="p-4 rounded-xl bg-[#140b0f] border border-[#ff7f87]/40 space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#ff7f87] font-bold block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>3. Kluczowe ryzyko i wektory uderzenia w tym tygodniu:</span>
                </span>
                <p className="text-xs text-white leading-relaxed">{mb.keyRiskThisWeek}</p>
              </div>
            </div>
          )}

          {/* Filar 1: Ład i Własność */}
          {activeTab === "governance" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Akcjonariat */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Struktura Własnościowa i Akcjonariat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {d?.shareholders.map((sh, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]"
                    >
                      <span className="text-[11px] text-[#8e9da7] block truncate">{sh.name}</span>
                      <span className="text-lg font-bold font-mono text-white mt-1 block">
                        {sh.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paszport Źródła KRS i Proweniencji Danych */}
              <div className="p-4 rounded-xl bg-[#0b1319] border border-[#57e0c5]/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#57e0c5]/15 text-[#57e0c5]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Paszport Weryfikacji Danych Organów (Proweniencja KRS)
                      </h4>
                      <p className="text-[11px] text-[#8e9da7]">
                        Dane organów zarządczych i nadzorczych pochodzą z oficjalnych rejestrów państwowych.
                      </p>
                    </div>
                  </div>

                  <a
                    href={d?.krs_registry_url || entity.krs_registry_url || "https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#57e0c5]/15 hover:bg-[#57e0c5]/25 text-[#57e0c5] border border-[#57e0c5]/30 text-[11px] font-medium transition-colors shrink-0"
                  >
                    <span>Odpis w Centralnej Informacji KRS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[rgba(159,186,199,0.1)] text-[11px]">
                  <div>
                    <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Status weryfikacji</span>
                    <span className="text-[#57e0c5] font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{d?.krs_verification_status === "verified_espi" ? "Zweryfikowano eKRS / ESPI" : "Zweryfikowano z eKRS"}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Data weryfikacji</span>
                    <span className="text-white font-mono mt-0.5 block">{d?.krs_verification_date || getKrsLastSyncDate()}</span>
                  </div>
                  <div>
                    <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Rejestr źródłowy</span>
                    <span className="text-[#8e9da7] truncate mt-0.5 block" title={d?.krs_verification_source || "Rejestr Przedsiębiorców KRS"}>
                      {d?.krs_verification_source || "Rejestr Przedsiębiorców Dział 2"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skład Zarządu */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center justify-between">
                  <span>Skład Zarządu ({d?.managementBoard.length || 0})</span>
                  {d?.vacanciesCount ? (
                    <span className="text-[10px] font-mono text-[#f6c56b]">
                      Wakaty do obsadzenia: {d.vacanciesCount}
                    </span>
                  ) : null}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {d?.managementBoard.map((member, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">{member.name}</span>
                          <span className="text-[11px] text-[#8e9da7]">{member.role}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5d6b74] shrink-0">
                          od {member.appointedAt}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[10px] text-[#5d6b74]">
                        <span className="truncate max-w-[200px]" title={member.sourceReference || "KRS Dział 2 Rubryka 1"}>
                          Źródło: <strong className="text-[#8e9da7] font-normal">{member.sourceReference || "KRS Dz. 2 Rub. 1"}</strong>
                        </span>
                        <span className="font-mono text-[#57e0c5] shrink-0">
                          {member.verifiedAt || getKrsLastSyncDate()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rada Nadzorcza */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                  Rada Nadzorcza ({d?.supervisoryBoard.length || 0})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {d?.supervisoryBoard.map((member, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">{member.name}</span>
                          <span className="text-[11px] text-[#8e9da7]">{member.role}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5d6b74] shrink-0">
                          od {member.appointedAt}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[10px] text-[#5d6b74]">
                        <span className="truncate max-w-[200px]" title={member.sourceReference || "KRS Dział 2 Rubryka 2"}>
                          Źródło: <strong className="text-[#8e9da7] font-normal">{member.sourceReference || "KRS Dz. 2 Rub. 2"}</strong>
                        </span>
                        <span className="font-mono text-[#57e0c5] shrink-0">
                          {member.verifiedAt || getKrsLastSyncDate()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filar 2: Ryzyko Komunikacyjne */}
          {activeTab === "communication" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-[#111a21] border border-[rgba(159,186,199,0.14)] space-y-2">
                <span className="text-xs font-bold text-[#f6c56b] uppercase tracking-wider font-mono">
                  Ocena Strategii Komunikacyjnej przez Silnik MAPscope
                </span>
                <p className="text-xs text-white leading-relaxed">{d?.narrativeSummary}</p>
                <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-xs">
                  <span className="text-[#8e9da7]">Wskaźnik ryzyka narracyjnego:</span>
                  <span className="font-mono font-bold text-white">{d?.narrativeRiskScore}/10</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.1)] text-xs text-[#8e9da7]">
                Szczegółowy audyt poszczególnych wypowiedzi i wywiadów jest dostępny w module{" "}
                <strong className="text-white">Szef Komunikacji</strong>.
              </div>
            </div>
          )}

          {/* Filar 3: Finanse i Inwestycje */}
          {activeTab === "finance" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                    Przychody (mln PLN)
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {d?.revenueMln.toLocaleString("pl-PL")}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                    EBITDA (mln PLN)
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {d?.ebitdaMln.toLocaleString("pl-PL")}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                    Nakłady CAPEX
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {d?.capexMln.toLocaleString("pl-PL")}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[10px] font-mono text-[#8e9da7] uppercase block">
                    Dług netto / EBITDA
                  </span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {d?.netDebtToEbitda}x
                  </span>
                </div>
              </div>

              {d?.dividendProposal && (
                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(87,224,197,0.25)] text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#57e0c5] uppercase block">
                    Rekomendacja Dywidendowa dla MAP:
                  </span>
                  <p className="text-white mt-0.5">{d.dividendProposal}</p>
                </div>
              )}

              {/* Komunikaty ESPI */}
              {d?.recentEspiReports && d.recentEspiReports.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Ostatnie raporty giełdowe ESPI
                  </h3>
                  <div className="space-y-2">
                    {d.recentEspiReports.map((espi, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#75b8ff] font-bold">
                              Raport {espi.number}
                            </span>
                            <span className="text-[#5d6b74]">({espi.date})</span>
                            {espi.isInsideInformation && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ff7f87]/20 text-[#ff7f87] font-mono font-bold">
                                MAR
                              </span>
                            )}
                          </div>
                          <p className="text-white mt-1">{espi.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filar 4: Prawne i Kontrole */}
          {activeTab === "legal" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Trwające postępowania kontrolne, prokuratorskie i sądowe
              </h3>

              {d?.legalCases && d.legalCases.length > 0 ? (
                d.legalCases.map((lc, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#111a21] border border-[rgba(159,186,199,0.14)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-[#ff7f87]">
                        {lc.institution} • Rozpoczęto: {lc.startedAt}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16222b] text-white">
                        {lc.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{lc.title}</h4>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#8e9da7] rounded-lg bg-[#111a21]">
                  Brak zarejestrowanych postępowań organów państwowych.
                </div>
              )}

              {/* Strategiczne Spory Gospodarcze i Arbitraże (> 20 mln PLN) */}
              {d?.strategicLitigations && d.strategicLitigations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[rgba(159,186,199,0.12)] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                    <Gavel className="w-3.5 h-3.5 text-[#e5b958]" />
                    <span>Strategiczne Spory Sądowe i Arbitraże (&gt; 20 mln PLN)</span>
                  </div>

                  <div className="space-y-2">
                    {d.strategicLitigations.map((lit) => (
                      <div
                        key={lit.id}
                        className="p-3.5 rounded-xl bg-[#070a0d] border border-[#e5b958]/30 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            Przeciwnik: {lit.opponent}
                          </span>
                          <span className="font-mono font-bold text-[#e5b958] text-sm">
                            WPS: {lit.valueMlnPln.toLocaleString("pl-PL")} mln zł
                          </span>
                        </div>

                        <p className="text-[11px] text-[#8e9da7]">
                          <strong className="text-white">Przedmiot sporu:</strong> {lit.caseSubject}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-[#5d6b74] pt-1 border-t border-[rgba(159,186,199,0.06)]">
                          <span>Sąd / Trybunał: {lit.court}</span>
                          <span
                            className={
                              lit.contingencyRisk === "wysokie"
                                ? "text-[#ff7f87] font-bold uppercase"
                                : "text-[#57e0c5] uppercase"
                            }
                          >
                            Ryzyko obciążenia: {lit.contingencyRisk}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filar 5: Czynniki Społeczne */}
          {activeTab === "social" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[#8e9da7] block text-[11px]">Związki zawodowe w spółce</span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {d?.laborUnionsCount || 0} organizacji
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)]">
                  <span className="text-[#8e9da7] block text-[11px]">Ryzyko redukcji etatów</span>
                  <span className="text-xs font-bold text-white mt-1 block">{d?.layoffRisk}</span>
                </div>
              </div>

              {d?.activeDisputes && d.activeDisputes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                    Aktywne spory zbiorowe
                  </h3>
                  <div className="space-y-2">
                    {d.activeDisputes.map((disp, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-lg bg-[#140b0f] border border-[#ff7f87]/30 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{disp.unionName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff7f87]/20 text-[#ff7f87] uppercase font-bold">
                            Zagrożenie: {disp.threatLevel}
                          </span>
                        </div>
                        <p className="text-[#8e9da7]">Etap: {disp.disputeStage}</p>
                        <p className="text-white font-medium">Postulaty: {disp.wageDemands}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filar 6: Oś Czasu */}
          {activeTab === "timeline" && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                Chronologiczny rejestr faktów i publikacji
              </h3>
              <div className="space-y-3 pl-2 border-l border-[rgba(159,186,199,0.14)] ml-2">
                {d?.timeline && d.timeline.length > 0 ? (
                  d.timeline.map((ev, i) => (
                    <div key={i} className="relative pl-4 space-y-0.5">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#57e0c5]" />
                      <div className="text-[10px] font-mono text-[#57e0c5] font-bold">
                        {ev.date} • {ev.type.toUpperCase()}
                      </div>
                      <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                      <p className="text-[11px] text-[#8e9da7]">{ev.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-[#8e9da7]">Brak zarejestrowanych zdarzeń.</div>
                )}
              </div>
            </div>
          )}

          {/* Filar 7: Giełda GPW & Relacje Inwestorskie ESPI */}
          {activeTab === "market" && (() => {
            const stock = STOCK_EXCHANGE_DATA.find(
              (s) => s.entityId === entity.id || entity.name.toLowerCase().includes(s.ticker.toLowerCase())
            );
            const espiForEntity = ESPI_REPORTS_DATA.filter((r) => stock && r.entityTicker === stock.ticker);
            const consensusForEntity = ANALYST_CONSENSUS_DATA.find((c) => stock && c.entityTicker === stock.ticker);

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                {stock ? (
                  <>
                    <div className="p-4 rounded-xl bg-[#0d1318] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">
                            GPW: {stock.ticker}
                          </span>
                          <span className="text-xs text-[#8e9da7]">Giełda Papierów Wartościowych w Warszawie</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          Wycena Rynkowa i Pakiet Skarbu Państwa
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#8e9da7] block uppercase">Kurs giełdowy</span>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-xl font-bold font-mono text-white">
                            {stock.currentPricePln.toFixed(2)} PLN
                          </span>
                          <span
                            className={`font-mono text-xs font-bold ${
                              stock.change1dPercent >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {stock.change1dPercent >= 0 ? `+${stock.change1dPercent}%` : `${stock.change1dPercent}%`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wskaźniki Finansowo-Wycenowe */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.12)]">
                        <span className="text-[10px] text-[#8e9da7] uppercase font-mono block">Wartość pakietu SP</span>
                        <span className="text-base font-bold font-mono text-[#57e0c5]">
                          {stock.stateShareValueMldPln.toFixed(2)} mld zł
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.12)]">
                        <span className="text-[10px] text-[#8e9da7] uppercase font-mono block">Kapitalizacja całości</span>
                        <span className="text-base font-bold font-mono text-white">
                          {stock.marketCapMldPln.toFixed(2)} mld zł
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.12)]">
                        <span className="text-[10px] text-[#8e9da7] uppercase font-mono block">Wycena C/Z & C/WK</span>
                        <span className="text-base font-bold font-mono text-slate-200">
                          {stock.peRatio < 0 ? "ujemny" : stock.peRatio} / {stock.pbRatio}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.12)]">
                        <span className="text-[10px] text-[#8e9da7] uppercase font-mono block">Dyskonto polityczne</span>
                        <span className="text-base font-bold font-mono text-amber-400">
                          {stock.politicalDiscountPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Konsensus Analityków (jeśli dostępny) */}
                    {consensusForEntity && (
                      <div className="p-4 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.14)] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                            Konsensus Domów Maklerskich:
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">
                            Średnia cena docelowa: {consensusForEntity.averageTargetPricePln.toFixed(2)} PLN (potencjał {consensusForEntity.upsideDownsidePercent > 0 ? `+${consensusForEntity.upsideDownsidePercent}%` : `${consensusForEntity.upsideDownsidePercent}%`})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                            KUPUJ: {consensusForEntity.buyCount}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                            TRZYMAJ: {consensusForEntity.holdCount}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono">
                            SPRZEDAJ: {consensusForEntity.sellCount}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Raporty Bieżące ESPI/EBI */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Ostatnie raporty bieżące ESPI / EBI:
                      </h4>
                      {espiForEntity.length > 0 ? (
                        <div className="space-y-2">
                          {espiForEntity.map((r) => (
                            <div
                              key={r.id}
                              className={`p-3 rounded-lg bg-[#070a0d] border ${
                                r.isMarRiskFlag ? "border-red-500/40" : "border-[rgba(159,186,199,0.1)]"
                              } space-y-1`}
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono font-bold text-white">{r.reportNumber}</span>
                                <span className="font-mono text-[#8e9da7]">{r.publishedAt}</span>
                              </div>
                              <p className="text-xs text-slate-200 font-medium">{r.title}</p>
                              <p className="text-[11px] text-[#8e9da7]">{r.summary}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 text-xs text-[#8e9da7] bg-[#070a0d] rounded-lg border border-[rgba(159,186,199,0.1)]">
                          Brak krytycznych raportów regulacyjnych w bieżącym okresie sprawozdawczym.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-2 bg-[#070a0d] rounded-xl border border-[rgba(159,186,199,0.12)]">
                    <Building2 className="w-8 h-8 text-[#5d6b74] mx-auto" />
                    <h4 className="text-sm font-bold text-white">Podmiot nienotowany na GPW</h4>
                    <p className="text-xs text-[#8e9da7] max-w-md mx-auto">
                      Spółka funkcjonuje jako spółka z ograniczoną odpowiedzialnością lub niepubliczna spółka akcyjna.
                      Nadzór właścicielski sprawowany jest bezpośrednio przez walne zgromadzenie i radę nadzorczą bez obowiązku raportowania w ESPI/EBI.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Filar 8: Samorządy, Problemy Lokalne & Ekologia */}
          {activeTab === "local" && (() => {
            const localIssues = LOCAL_MUNICIPAL_ISSUES.filter(
              (i) => i.entityId === entity.id || entity.name.toLowerCase().includes(i.entityName.toLowerCase().split(" ")[0])
            );

            return (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-4 rounded-xl bg-[#0d1318] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                      RADAR RELACJI SAMORZĄDOWYCH I SPOŁECZNO-ŚRODOWISKOWYCH
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      Wpływ na gminę, lokalny rynek pracy i spory podatkowe
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#8e9da7]">
                    Zarejestrowane zagadnienia: {localIssues.length}
                  </span>
                </div>

                {localIssues.length > 0 ? (
                  <div className="space-y-3">
                    {localIssues.map((iss) => (
                      <div
                        key={iss.id}
                        className="p-4 rounded-xl bg-[#070a0d] border border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div>
                            <span className="text-xs font-bold text-white">{iss.municipalityName}</span>
                            <span className="text-[10px] text-slate-500 font-mono ml-2">({iss.voivodeship})</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            Wartość sporu: {iss.financialImpactMlnPln} mln PLN
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{iss.description}</p>

                        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                          <span>
                            Udział w rynku pracy powiatu: <strong className="text-blue-400 font-mono">{iss.countyWorkforceSharePercent}%</strong>
                          </span>
                          <span className="font-mono uppercase text-amber-400 font-semibold">
                            Status: {iss.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2 bg-[#070a0d] rounded-xl border border-[rgba(159,186,199,0.12)]">
                    <MapPin className="w-8 h-8 text-[#5d6b74] mx-auto" />
                    <h4 className="text-sm font-bold text-white">Brak otwartych sporów samorządowych</h4>
                    <p className="text-xs text-[#8e9da7] max-w-md mx-auto">
                      Podmiot utrzymuje stabilne relacje z władzami gminy i powiatu.
                      Brak zarejestrowanych protestów mieszkańców, sporów o podatek od nieruchomości lub postępowań środowiskowych.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Sekcja Danych Wewnętrznych (jeśli zostały wstrzyknięte) */}
          {internalData && (
            <div className="p-4 rounded-xl bg-[#161a14] border border-[#e5b958]/40 space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#e5b958] uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Poufne Notatki i Numery Spraw Departamentu MAP:</span>
              </span>
              <ul className="space-y-1 pl-4 list-disc text-xs text-white">
                {internalData.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
              {internalData.inspectionFileNumbers.length > 0 && (
                <div className="pt-2 border-t border-[rgba(229,185,88,0.2)] text-[11px] font-mono text-[#8e9da7]">
                  Akta spraw kontrolnych: {internalData.inspectionFileNumbers.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stopka Modala */}
        <div className="p-4 border-t border-[rgba(159,186,199,0.14)] bg-[#090d12] flex items-center justify-between text-xs text-[#5d6b74]">
          <span>Organ nadzorczy: {entity.ownership_body}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white text-xs border border-[rgba(159,186,199,0.14)] transition-colors"
          >
            Zamknij Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
