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
} from "lucide-react";
import { ALL_ENTITIES_REGISTRY } from "@/lib/mapscope-data.ts";
import type { EntityRecord } from "@/lib/types.ts";

interface GovernanceViewProps {
  onOpenDossier: (entityId: string) => void;
}

export function GovernanceView({ onOpenDossier }: GovernanceViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [shareFilter, setShareFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

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
                      <div className="text-[#5d6b74]">KRS: {entity.krs || "Brak"}</div>
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
