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
  FileText,
  AlertTriangle,
  FileCheck2,
  Lock,
} from "lucide-react";
import type { EntityRecord, InternalDataEntry } from "@/lib/types.ts";

interface DossierModalProps {
  entity: EntityRecord | null;
  onClose: () => void;
  internalData?: InternalDataEntry;
}

export function DossierModal({ entity, onClose, internalData }: DossierModalProps) {
  const [activeTab, setActiveTab] = useState<
    "governance" | "communication" | "finance" | "legal" | "social" | "timeline"
  >("governance");

  if (!entity) return null;

  const d = entity.dossier;
  const score = entity.recent_risk_score ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-2xl bg-[#0d1318] border border-[rgba(159,186,199,0.24)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Belka Tytułowa */}
        <div className="p-5 border-b border-[rgba(159,186,199,0.14)] bg-[#111a21] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
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

            <h2 className="text-xl font-bold text-white mt-1.5">{entity.name}</h2>
            <div className="text-xs text-[#8e9da7] flex flex-wrap items-center gap-2 mt-1">
              <span>{entity.sector}</span>
              <span>•</span>
              <span>NIP: <strong className="font-mono text-white">{entity.nip || "Brak"}</strong></span>
              <span>•</span>
              <span>KRS: <strong className="font-mono text-white">{entity.krs || "Brak"}</strong></span>
              <span>•</span>
              <span>Udział Skarbu Państwa: <strong className="font-mono text-[#57e0c5]">{entity.state_share_percent}%</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-[#5d6b74] font-mono block">OCENA RYZYKA</span>
              <span
                className={`text-base font-bold font-mono px-2.5 py-0.5 rounded border inline-block ${
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

        {/* Zakładki 6 Filarów */}
        <div className="flex items-center border-b border-[rgba(159,186,199,0.14)] bg-[#090d12] px-3 overflow-x-auto">
          {[
            { id: "governance", label: "1. Ład i Własność", icon: Users },
            { id: "communication", label: "2. Ryzyko Komunikacji", icon: MessageSquareWarning },
            { id: "finance", label: "3. Finanse i Inwestycje", icon: DollarSign },
            { id: "legal", label: "4. Prawne i Kontrole", icon: Scale },
            { id: "social", label: "5. Czynniki Społeczne", icon: HeartHandshake },
            { id: "timeline", label: "6. Oś Czasu", icon: Clock },
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
                    ? "border-[#57e0c5] text-white bg-[#0d1318]"
                    : "border-transparent text-[#8e9da7] hover:text-white hover:bg-[#0d1318]/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#57e0c5]" : "text-[#5d6b74]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zawartość zakładek */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
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
                      className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{member.name}</span>
                        <span className="text-[11px] text-[#8e9da7]">{member.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#5d6b74]">
                        od {member.appointedAt}
                      </span>
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
                      className="p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.1)] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{member.name}</span>
                        <span className="text-[11px] text-[#8e9da7]">{member.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#5d6b74]">
                        od {member.appointedAt}
                      </span>
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
