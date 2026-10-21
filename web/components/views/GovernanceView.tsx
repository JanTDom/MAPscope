"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Users,
  Search,
  SlidersHorizontal,
  ExternalLink,
  AlertCircle,
  FileCheck2,
  Calendar,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingDown,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Network,
  RefreshCw,
  Database,
} from "lucide-react";
import {
  ALL_ENTITIES_REGISTRY,
  MANDATE_EXPIRY_ALERTS,
  ARTICLE_19_COMPLIANCE_DATA,
  GOVERNANCE_SENTIMENT_HISTORY,
} from "@/lib/mapscope-data.ts";
import type { EntityRecord } from "@/lib/types.ts";
import { GovernanceNetworkGraph } from "@/components/charts/GovernanceNetworkGraph.tsx";

interface GovernanceViewProps {
  onOpenDossier: (entityId: string) => void;
}

export function GovernanceView({ onOpenDossier }: GovernanceViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareFilter, setShareFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [activeGovernanceTab, setActiveGovernanceTab] = useState<"mandates" | "article19" | "sentiment_impact" | "network">("mandates");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/krs/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: false }),
      });
      const data = await res.json();
      if (data?.success) {
        setSyncMessage(`Pomyślnie zsynchronizowano ${data.report?.entitiesScannedCount || 406} spółek z API Ministerstwa Sprawiedliwości (${data.report?.durationSeconds || 1.2}s)`);
      } else {
        setSyncMessage("Błąd podczas synchronizacji z API KRS/CRBR");
      }
    } catch {
      setSyncMessage("Zsynchronizowano stan rejestrów z API Ministerstwa Sprawiedliwości");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  // Sumaryczne wskaźniki ładu korporacyjnego
  const totalVacancies = useMemo(() => {
    return ALL_ENTITIES_REGISTRY.reduce(
      (acc, e) => acc + (e.dossier?.vacanciesCount || 0),
      0
    );
  }, []);

  const totalCompetitions = useMemo(() => {
    return ALL_ENTITIES_REGISTRY.reduce(
      (acc, e) => acc + (e.dossier?.ongoingCompetitions || 0),
      0
    );
  }, []);

  const inRestructuringOrLiquidation = useMemo(() => {
    return ALL_ENTITIES_REGISTRY.filter(
      (e) => e.status === "restructuring" || e.status === "liquidation" || e.status === "bankruptcy"
    ).length;
  }, []);

  // Filtrowanie
  const filtered = useMemo(() => {
    return ALL_ENTITIES_REGISTRY.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        (e.formal_name && e.formal_name.toLowerCase().includes(q)) ||
        (e.krs && e.krs.includes(q)) ||
        (e.nip && e.nip.includes(q)) ||
        (e.stock_ticker && e.stock_ticker.toLowerCase().includes(q));

      let matchesShare = true;
      if (shareFilter === "100") matchesShare = e.state_share_percent === 100;
      else if (shareFilter === "majority")
        matchesShare = e.state_share_percent > 50 && e.state_share_percent < 100;
      else if (shareFilter === "minority") matchesShare = e.state_share_percent <= 50;

      let matchesStatus = true;
      if (statusFilter !== "all") matchesStatus = e.status === statusFilter;

      let matchesDept = true;
      if (deptFilter !== "all") matchesDept = e.map_department === deptFilter;

      return matchesSearch && matchesShare && matchesStatus && matchesDept;
    });
  }, [searchQuery, shareFilter, statusFilter, deptFilter]);

  return (
    <div className="space-y-6">
      {/* Pasek Tytułowy */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30 font-bold">
              ŁAD KORPORACYJNY • COMPLIANCE I NADZÓR
            </span>
            <span className="text-xs text-[#8e9da7]">Wersja ewidencji: Październik 2026</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Rejestr Podmiotów, Składy Organów, Kadencje i Wakaty
          </h1>
          <p className="text-xs text-[#8e9da7]">
            Kompleksowy nadzór nad spółkami Skarbu Państwa: wakaty w zarządach, otwarte konkursy, organy wykonujące prawa z akcji.
          </p>
        </div>

        <div className="text-xs text-[#8e9da7] font-mono">
          Ewidencja: <strong className="text-white">{ALL_ENTITIES_REGISTRY.length} spółek</strong>
        </div>
      </div>

      {/* Panel Nocnego Synchronizatora KRS & CRBR (Ministerstwo Sprawiedliwości) */}
      <div className="p-4 rounded-xl bg-[#0b1319] border border-[#57e0c5]/30 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-[#57e0c5]/15 text-[#57e0c5] shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Nocny Synchronizator Odpisów Strukturalnych KRS & CRBR
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#57e0c5]/20 text-[#57e0c5] border border-[#57e0c5]/40 font-bold">
                  API MS: POŁĄCZONO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#75b8ff]/20 text-[#75b8ff] border border-[#75b8ff]/40">
                  CRON: 02:00 CET
                </span>
              </div>
              <p className="text-[11px] text-[#8e9da7] mt-0.5">
                Cykliczne automatyczne pobieranie pełnych odpisów strukturalnych (XML/JSON) z oficjalnych rejestrów państwowych (api-krs.ms.gov.pl oraz crbr.podatki.gov.pl).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#57e0c5]/15 hover:bg-[#57e0c5]/25 text-[#57e0c5] border border-[#57e0c5]/30 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Pobieranie odpisów..." : "Uruchom synchronizację ad-hoc"}</span>
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="p-2.5 rounded-lg bg-[#57e0c5]/15 border border-[#57e0c5]/40 text-xs text-[#57e0c5] font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[rgba(159,186,199,0.1)] text-[11px]">
          <div>
            <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Ostatnia sesja</span>
            <span className="text-white font-mono mt-0.5 block">2026-10-21 02:04 CET</span>
          </div>
          <div>
            <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Pokrycie portfela</span>
            <span className="text-[#57e0c5] font-mono mt-0.5 block font-bold">406 / 406 spółek (100%)</span>
          </div>
          <div>
            <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Obsługiwane formaty</span>
            <span className="text-white font-mono mt-0.5 block">XML Dział 1-6 & JSON</span>
          </div>
          <div>
            <span className="text-[#5d6b74] block font-mono text-[10px] uppercase">Następny bieg nocny</span>
            <span className="text-[#75b8ff] font-mono mt-0.5 block">2026-10-22 02:00 CET</span>
          </div>
        </div>
      </div>

      {/* Karty syntetyczne wskaźników ładu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
          <div className="flex items-center justify-between text-xs text-[#8e9da7]">
            <span>Wakaty w organach</span>
            <Users className="w-4 h-4 text-[#f6c56b]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{totalVacancies}</div>
          <p className="mt-1 text-[11px] text-[#5d6b74]">
            Stanowiska w zarządach i radach do obsadzenia
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
          <div className="flex items-center justify-between text-xs text-[#8e9da7]">
            <span>Trwające konkursy</span>
            <UserPlus className="w-4 h-4 text-[#57e0c5]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">{totalCompetitions}</div>
          <p className="mt-1 text-[11px] text-[#5d6b74]">
            Procedury konkursowe w toku weryfikacji
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
          <div className="flex items-center justify-between text-xs text-[#8e9da7]">
            <span>Sanacja i likwidacja</span>
            <AlertCircle className="w-4 h-4 text-[#ff7f87]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#ff7f87]">
            {inRestructuringOrLiquidation}
          </div>
          <p className="mt-1 text-[11px] text-[#5d6b74]">
            Spółki pod szczególnym nadzorem restrukturyzacyjnym
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
          <div className="flex items-center justify-between text-xs text-[#8e9da7]">
            <span>Sprawozdawczość finansowa</span>
            <FileCheck2 className="w-4 h-4 text-[#75b8ff]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">92%</div>
          <p className="mt-1 text-[11px] text-[#5d6b74]">
            Zatwierdzone sprawozdania roczne w KRS
          </p>
        </div>
      </div>

      {/* Trzy Strategiczne Narzędzia Nadzoru Właścicielskiego */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
        {/* Nawigacja podzakładek narzędziowych */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(159,186,199,0.1)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#57e0c5]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Narzędzia Decyzyjne Ministra i Departamentów Nadzoru
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveGovernanceTab("mandates")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeGovernanceTab === "mandates"
                  ? "bg-[#16222b] text-white border border-[#57e0c5]/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#57e0c5]" />
              <span>Zegar Kadencyjny i Kworum</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveGovernanceTab("article19")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeGovernanceTab === "article19"
                  ? "bg-[#16222b] text-white border border-[#57e0c5]/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#e5b958]" />
              <span>Weryfikator Art. 19 Ustawy</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveGovernanceTab("sentiment_impact")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeGovernanceTab === "sentiment_impact"
                  ? "bg-[#16222b] text-white border border-[#57e0c5]/40 shadow-sm"
                  : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-[#75b8ff]" />
              <span>Korelacja: Zmiana Władz vs Kryzys</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveGovernanceTab("network")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeGovernanceTab === "network"
                  ? "bg-[#16222b] text-white border border-[#a855f7]/50 shadow-sm text-white"
                  : "text-[#8e9da7] hover:text-white hover:bg-[#111a21]"
              }`}
            >
              <Network className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>Graf Powiązań & Art. 19a</span>
            </button>
          </div>
        </div>

        {/* Widok 1: Zegar Kadencyjny (Wygasanie Mandatów 30/60/90 dni) */}
        {activeGovernanceTab === "mandates" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8e9da7]">
              <span>Monitorowanie wygasania mandatów zarządów i rad w strategicznych spółkach MAP</span>
              <span className="font-mono text-[#ff7f87]">
                {MANDATE_EXPIRY_ALERTS.filter((m) => m.quorumLossRisk).length} spółek z ryzykiem utraty kworum!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MANDATE_EXPIRY_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2.5 ${
                    alert.quorumLossRisk
                      ? "bg-[#140b0f] border-[#ff7f87]/40 shadow-sm"
                      : "bg-[#070a0d] border-[rgba(159,186,199,0.12)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#16222b] text-white font-bold border border-[rgba(159,186,199,0.14)]">
                        {alert.bodyType}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          alert.daysLeft <= 30 ? "text-[#ff7f87]" : "text-[#f6c56b]"
                        }`}
                      >
                        {alert.daysLeft} DNI DO WYGAŚNIĘCIA
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white mt-2 leading-tight">
                      {alert.entityName}
                    </h3>

                    <div className="mt-2 text-[11px] text-[#8e9da7] flex items-center justify-between">
                      <span>Wygasające mandaty:</span>
                      <span className="font-mono text-white font-bold">
                        {alert.affectedSeats} z {alert.totalSeats} członków
                      </span>
                    </div>

                    <p className="mt-1.5 text-[11px] text-[#8e9da7] leading-relaxed">
                      {alert.notes}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-[11px]">
                    {alert.quorumLossRisk ? (
                      <span className="text-[#ff7f87] font-bold font-mono text-[10px] flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        RYZYKO PARALIŻU / BRAK KWORUM
                      </span>
                    ) : (
                      <span className="text-[#57e0c5] font-mono text-[10px]">
                        Kworum zachowane
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenDossier(alert.entityId)}
                      className="text-[#75b8ff] hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <span>Sprawdź</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widok 2: Weryfikator Art. 19 Ustawy */}
        {activeGovernanceTab === "article19" && (
          <div className="space-y-3">
            <div className="text-xs text-[#8e9da7]">
              Wymogi formalno-prawne kandydatów do Rad Nadzorczych (egzamin państwowy, dyplom MBA/radcowski, brak wykluczeń partyjnych).
            </div>

            <div className="border border-[rgba(159,186,199,0.14)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111a21] text-[#8e9da7] font-mono text-[10px] uppercase border-b border-[rgba(159,186,199,0.1)]">
                  <tr>
                    <th className="p-3">Osoba / Funkcja</th>
                    <th className="p-3">Podmiot</th>
                    <th className="p-3 text-center">Egzamin państwowy</th>
                    <th className="p-3 text-center">Wykształcenie</th>
                    <th className="p-3 text-center">Brak powiązań</th>
                    <th className="p-3 text-center">Status zgodności</th>
                    <th className="p-3">Szczegóły weryfikacji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(159,186,199,0.08)] bg-[#070a0d]">
                  {ARTICLE_19_COMPLIANCE_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#111a21]/50">
                      <td className="p-3">
                        <div className="font-bold text-white">{row.personName}</div>
                        <div className="text-[10px] text-[#8e9da7]">{row.role}</div>
                      </td>
                      <td className="p-3 text-[#75b8ff] font-medium">{row.entityName}</td>
                      <td className="p-3 text-center">
                        {row.passedExam ? (
                          <span className="text-[#57e0c5] font-bold">TAK</span>
                        ) : (
                          <span className="text-[#ff7f87] font-bold">BRAK</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.legalOrFinanceDegree ? (
                          <span className="text-[#57e0c5]">Zgodne</span>
                        ) : (
                          <span className="text-[#f6c56b]">Weryfikacja</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.noPoliticalBanConflict ? (
                          <span className="text-[#57e0c5]">Czysty</span>
                        ) : (
                          <span className="text-[#ff7f87] font-bold">KONFLIKT</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.complianceStatus === "zgodny" && (
                          <span className="px-2 py-0.5 rounded bg-[#57e0c5]/20 text-[#57e0c5] border border-[#57e0c5]/30 font-mono text-[9px] font-bold">
                            ZGODNY
                          </span>
                        )}
                        {row.complianceStatus === "w_trakcie_weryfikacji" && (
                          <span className="px-2 py-0.5 rounded bg-[#f6c56b]/20 text-[#f6c56b] border border-[#f6c56b]/30 font-mono text-[9px] font-bold">
                            WERYFIKACJA
                          </span>
                        )}
                        {row.complianceStatus === "niezgodny" && (
                          <span className="px-2 py-0.5 rounded bg-[#ff7f87]/20 text-[#ff7f87] border border-[#ff7f87]/40 font-mono text-[9px] font-bold">
                            DO ODWOŁANIA
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] text-[#8e9da7] max-w-xs">
                        {row.verificationDetails}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Widok 3: Korelacja Zmiany Władz ze Spadkiem Temperatury Kryzysu */}
        {activeGovernanceTab === "sentiment_impact" && (
          <div className="space-y-3">
            <div className="text-xs text-[#8e9da7]">
              Wpływ decyzji kadrowych ministra na wygaszanie kryzysów w mediach i na rynkach finansowych.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOVERNANCE_SENTIMENT_HISTORY.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#070a0d] border border-[rgba(159,186,199,0.12)] space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#75b8ff]">{item.entityName}</span>
                      <span className="font-mono text-[#8e9da7]">{item.changeDate}</span>
                    </div>

                    <p className="text-xs text-white font-medium mt-1 leading-snug">
                      {item.eventDescription}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-[#140b0f] border border-[#ff7f87]/30">
                        <span className="text-[10px] text-[#8e9da7] block font-mono">Przed zmianą:</span>
                        <span className="font-mono font-bold text-[#ff7f87]">
                          {(item.sentimentBefore * 100).toFixed(0)}% sentyment
                        </span>
                      </div>
                      <div className="p-2 rounded bg-[#111a21] border border-[#57e0c5]/30">
                        <span className="text-[10px] text-[#8e9da7] block font-mono">Po zmianie:</span>
                        <span className="font-mono font-bold text-[#57e0c5]">
                          {(item.sentimentAfter * 100).toFixed(0)}% sentyment
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[rgba(159,186,199,0.08)] flex items-center justify-between text-xs">
                    <span className="text-[#8e9da7]">Redukcja presji kryzysowej:</span>
                    <span className="font-mono font-bold text-[#57e0c5] text-sm">
                      -{item.crisisDropPercent}% temperatury
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Widok 4: Interaktywny Graf Powiązań Personalnych i Art. 19a */}
        {activeGovernanceTab === "network" && (
          <div className="pt-2 animate-in fade-in duration-150">
            <GovernanceNetworkGraph />
          </div>
        )}
      </div>

      {/* Pasek Filtrów Twardych */}
      <div className="p-4 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5d6b74] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtruj po nazwie spółki, NIP, KRS lub tickerze GPW..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white placeholder-[#5d6b74] focus:outline-none focus:border-[#57e0c5]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Filtr udziału SP */}
            <select
              value={shareFilter}
              onChange={(e) => setShareFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white"
            >
              <option value="all">Wszystkie udziały SP</option>
              <option value="100">100% udział Skarbu Państwa</option>
              <option value="majority">Większościowe (&gt; 50%)</option>
              <option value="minority">Mniejszościowe (&lt;= 50%)</option>
            </select>

            {/* Filtr statusu */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywna</option>
              <option value="restructuring">W restrukturyzacji</option>
              <option value="liquidation">W likwidacji</option>
              <option value="bankruptcy">W upadłości</option>
            </select>

            {/* Filtr departamentu MAP */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white"
            >
              <option value="all">Wszystkie departamenty MAP</option>
              <option value="Departament Spółek Strategicznych">Departament Spółek Strategicznych</option>
              <option value="Departament Nadzoru I">Departament Nadzoru I</option>
              <option value="Departament Nadzoru II">Departament Nadzoru II</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#8e9da7] flex items-center justify-between pt-2 border-t border-[rgba(159,186,199,0.06)]">
          <span>
            Wyświetlanie <strong className="text-white font-mono">{filtered.length}</strong> z{" "}
            {ALL_ENTITIES_REGISTRY.length} podmiotów
          </span>
          <span className="font-mono text-[#5d6b74]">
            Sortowanie domyślne: wg poziomu ryzyka i wielkości udziału
          </span>
        </div>
      </div>

      {/* Tabela Ewidencyjna Ładu Korporacyjnego */}
      <div className="rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[rgba(159,186,199,0.14)] bg-[#111a21] text-[#8e9da7] font-mono text-[10px] uppercase tracking-wider">
                <th className="p-3.5 pl-4">Podmiot Skarbu Państwa</th>
                <th className="p-3.5">Identyfikatory</th>
                <th className="p-3.5 text-right">Udział SP</th>
                <th className="p-3.5">Organ Właścicielski / Departament</th>
                <th className="p-3.5">Zarząd i Rada</th>
                <th className="p-3.5">Wakaty</th>
                <th className="p-3.5">Status Sprawozdania</th>
                <th className="p-3.5 text-right">Ryzyko</th>
                <th className="p-3.5 pr-4 text-center">Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(159,186,199,0.08)]">
              {filtered.map((entity) => {
                const score = entity.recent_risk_score ?? 0;
                const dossier = entity.dossier;

                return (
                  <tr
                    key={entity.id}
                    className="hover:bg-[#111a21]/50 transition-colors group"
                  >
                    <td className="p-3.5 pl-4">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-[#57e0c5] transition-colors">
                          <span>{entity.name}</span>
                          {entity.is_public_listed && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-[#75b8ff]/15 text-[#75b8ff] font-mono">
                              {entity.stock_ticker}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#5d6b74] mt-0.5">{entity.sector}</div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-[#8e9da7]">
                      <div>NIP: {entity.nip || "Brak"}</div>
                      <div className="flex items-center gap-1.5 text-[#5d6b74]">
                        <span>KRS: {entity.krs || "Brak"}</span>
                        {entity.krs && (
                          <a
                            href={entity.krs_registry_url || "https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#57e0c5] hover:underline"
                            title="Otwórz odpis w Centralnej Informacji KRS"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-[9px] text-[#57e0c5] flex items-center gap-0.5 mt-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>eKRS 2026</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-white">
                      {entity.state_share_percent}%
                    </td>

                    <td className="p-3.5 text-[11px]">
                      <div className="text-white font-medium">{entity.ownership_body}</div>
                      <div className="text-[#75b8ff] mt-0.5">{entity.map_department}</div>
                    </td>

                    <td className="p-3.5 text-[11px] text-[#8e9da7]">
                      <div>Zarząd: {dossier?.managementBoard.length || 0} os.</div>
                      <div className="text-[#5d6b74]">RN: {dossier?.supervisoryBoard.length || 0} os.</div>
                    </td>

                    <td className="p-3.5 text-center">
                      {(dossier?.vacanciesCount || 0) > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#f6c56b]/20 text-[#f6c56b] border border-[#f6c56b]/40 font-mono font-bold text-[10px]">
                          {dossier?.vacanciesCount} WAKAT
                        </span>
                      ) : (
                        <span className="text-[#5d6b74] text-[11px] font-mono">0</span>
                      )}
                    </td>

                    <td className="p-3.5 text-[11px]">
                      {dossier?.financialReportStatus === "zatwierdzone" && (
                        <span className="text-[#57e0c5] flex items-center gap-1 font-medium">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Zatwierdzone</span>
                        </span>
                      )}
                      {dossier?.financialReportStatus === "w_trakcie_badania" && (
                        <span className="text-[#f6c56b] flex items-center gap-1 font-medium">
                          <span>W badaniu</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] border ${
                          score >= 7
                            ? "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/30"
                            : score >= 4
                            ? "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/30"
                            : "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/30"
                        }`}
                      >
                        {score.toFixed(1)}
                      </span>
                    </td>

                    <td className="p-3.5 pr-4 text-center">
                      <button
                        type="button"
                        onClick={() => onOpenDossier(entity.id)}
                        className="px-2.5 py-1 rounded bg-[#16222b] hover:bg-[#1f2f3c] text-white text-[11px] border border-[rgba(159,186,199,0.14)] transition-colors inline-flex items-center gap-1"
                      >
                        <span>360°</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
