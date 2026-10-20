"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  BarChart3,
  TrendingDown,
  Building,
  Scale,
  MapPin,
  Download,
  Search,
  Filter,
  Layers,
  FileSpreadsheet,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { EntityRecord } from "@/lib/types.ts";
import { EXECUTIVE_ANALYTICS } from "@/lib/mapscope-data.ts";

interface AnalyticsViewProps {
  entities: EntityRecord[];
  onSelectEntity: (entityId: string) => void;
}

export function AnalyticsView({ entities, onSelectEntity }: AnalyticsViewProps) {
  const [selectedOrgan, setSelectedOrgan] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedShareTier, setSelectedShareTier] = useState<string>("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof EntityRecord>("state_share_percent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const stats = EXECUTIVE_ANALYTICS;

  // Filtrowanie spółek
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      // Filtr organu
      if (selectedOrgan !== "all" && e.ownership_body !== selectedOrgan) return false;

      // Filtr statusu
      if (selectedStatus === "active" && e.status !== "active") return false;
      if (selectedStatus === "liquidation" && e.status !== "liquidation") return false;
      if (selectedStatus === "bankruptcy" && e.status !== "bankruptcy") return false;
      if (selectedStatus === "suspended" && e.status !== "suspended") return false;
      if (selectedStatus === "troubled" && !["liquidation", "bankruptcy", "suspended"].includes(e.status)) return false;

      // Filtr pakietu
      if (selectedShareTier === "100" && e.state_share_percent < 100) return false;
      if (selectedShareTier === "majority" && (e.state_share_percent < 50 || e.state_share_percent >= 100)) return false;
      if (selectedShareTier === "minority" && (e.state_share_percent < 20 || e.state_share_percent >= 50)) return false;
      if (selectedShareTier === "fractional" && e.state_share_percent >= 20) return false;

      // Filtr sektora
      if (selectedSector !== "all" && e.sector !== selectedSector) return false;

      // Wyszukiwarka tekstowa
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = e.name.toLowerCase().includes(q);
        const matchesNip = (e.nip ?? "").includes(q);
        const matchesCity = (e.city ?? "").toLowerCase().includes(q);
        const matchesOrgan = e.ownership_body.toLowerCase().includes(q);
        if (!matchesName && !matchesNip && !matchesCity && !matchesOrgan) return false;
      }

      return true;
    });
  }, [entities, selectedOrgan, selectedStatus, selectedShareTier, selectedSector, searchQuery]);

  // Sortowanie
  const sortedEntities = useMemo(() => {
    return [...filteredEntities].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") aVal = (aVal || "").toLowerCase();
      if (typeof bVal === "string") bVal = (bVal || "").toLowerCase();

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredEntities, sortField, sortOrder]);

  // Paginacja
  const totalPages = Math.ceil(sortedEntities.length / pageSize) || 1;
  const paginatedEntities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEntities.slice(start, start + pageSize);
  }, [sortedEntities, currentPage, pageSize]);

  const toggleSort = (field: keyof EntityRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Eksport do pliku CSV
  const handleExportCsv = () => {
    const headers = [
      "Lp.",
      "Nazwa Spółki",
      "NIP",
      "KRS",
      "Siedziba",
      "Status",
      "Udział % Skarbu Państwa",
      "Organ Nadzorujący",
      "Sektor",
    ];

    const rows = sortedEntities.map((e, idx) => [
      idx + 1,
      `"${e.name.replace(/"/g, '""')}"`,
      e.nip ?? "",
      e.krs ?? "",
      `"${(e.city ?? "").replace(/"/g, '""')}"`,
      `"${e.status_label ?? e.status}"`,
      e.state_share_percent,
      `"${e.ownership_body.replace(/"/g, '""')}"`,
      `"${e.sector.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `wykaz_spolek_skarb_panstwa_mapscope_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Eksport do JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedEntities, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mapscope_spolki_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Nagłówek widoku analitycznego */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30">
                Oficjalny rejestr państwowy (stan: 31.03.2025 r.)
              </span>
              <span className="text-xs text-[#8e9da7] font-mono">100% pokrycia BIP MAP / dane.gov.pl</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-2">
              Centrum zestawień i analiz właścicielskich portfela Skarbu Państwa
            </h1>
            <p className="text-xs text-[#8e9da7] mt-1 max-w-3xl">
              Kompleksowy radar zarządczy obejmujący wszystkie 406 podmiotów z bezpośrednim lub pośrednim udziałem państwa,
              rozkład pakietów własnościowych, monitor postępowań upadłościowych oraz podział kompetencyjny 17 organów.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111a21] hover:bg-[#16222b] text-[#57e0c5] border border-[rgba(87,224,197,0.3)] text-xs font-semibold transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksportuj CSV ({sortedEntities.length})</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111a21] hover:bg-[#16222b] text-[#75b8ff] border border-[rgba(117,184,255,0.3)] text-xs font-semibold transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Eksportuj JSON</span>
            </button>
          </div>
        </div>

        {/* Hero KPIs Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-[rgba(159,186,199,0.12)]">
          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">Wszystkie podmioty</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{stats.total_count}</div>
            <span className="text-[10px] text-[#57e0c5] font-mono">100% bazy państwowej</span>
          </div>

          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">Spółki aktywne</span>
            <div className="text-2xl font-bold text-[#57e0c5] font-mono mt-1">{stats.active_count}</div>
            <span className="text-[10px] text-[#8e9da7] font-mono">
              {((stats.active_count / stats.total_count) * 100).toFixed(1)}% portfela
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">Pakiety 100% SP</span>
            <div className="text-2xl font-bold text-[#75b8ff] font-mono mt-1">
              {stats.shares_distribution.wholly}
            </div>
            <span className="text-[10px] text-[#8e9da7] font-mono">Jednoosobowe SP</span>
          </div>

          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">W likwidacji</span>
            <div className="text-2xl font-bold text-[#f6c56b] font-mono mt-1">{stats.liquidation_count}</div>
            <span className="text-[10px] text-[#f6c56b] font-mono">Odzyskiwanie mienia</span>
          </div>

          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">W upadłości</span>
            <div className="text-2xl font-bold text-[#ff7f87] font-mono mt-1">{stats.bankruptcy_count}</div>
            <span className="text-[10px] text-[#ff7f87] font-mono">Syndycy / sądy</span>
          </div>

          <div className="p-3 rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
            <span className="text-[11px] text-[#8e9da7]">Organy nadzoru</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{stats.organs.length}</div>
            <span className="text-[10px] text-[#8e9da7] font-mono">Resorty i agencje</span>
          </div>
        </div>
      </div>

      {/* Bento Grid: 2 kolumny zestawień analitycznych */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lewa kolumna: Zestawienie wg 17 organów reprezentujących państwo */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#57e0c5]" />
              <h2 className="text-sm font-semibold text-white">
                Struktura nadzoru wg organów wykonujących prawa z akcji (17 instytucji)
              </h2>
            </div>
            <span className="text-[11px] text-[#8e9da7] font-mono">Kliknij organ, aby przefiltrować</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {stats.organs.map((org) => {
              const isSelected = selectedOrgan === org.name;
              return (
                <button
                  type="button"
                  key={org.name}
                  onClick={() => setSelectedOrgan(isSelected ? "all" : org.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#111a21] border-[#57e0c5] shadow-sm ring-1 ring-[#57e0c5]/20"
                      : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)] hover:bg-[#111a21]/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold truncate ${isSelected ? "text-[#57e0c5]" : "text-white"}`}>
                        {org.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-white shrink-0 ml-2">
                        {org.count} {org.count === 1 ? "spółka" : "spółek"}
                      </span>
                    </div>

                    {/* Wizualny pasek udziału */}
                    <div className="w-full bg-[#16222b] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          org.name.includes("Aktywów Państwowych")
                            ? "bg-[#57e0c5]"
                            : org.name.includes("Rozwoju Przemysłu")
                            ? "bg-[#75b8ff]"
                            : org.name.includes("Nieruchomości")
                            ? "bg-[#f6c56b]"
                            : "bg-[#8e9da7]"
                        }`}
                        style={{ width: `${Math.min(100, org.percentage * 3.5)}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#8e9da7] shrink-0 w-12 text-right">
                    {org.percentage}%
                  </span>
                </button>
              );
            })}
          </div>

          {selectedOrgan !== "all" && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#57e0c5]">
                Aktywny filtr: <strong className="text-white">{selectedOrgan}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrgan("all")}
                className="text-xs text-[#8e9da7] hover:text-white underline"
              >
                Wyczyść filtr organu
              </button>
            </div>
          )}
        </div>

        {/* Prawa kolumna: Pakiety własnościowe i monitor likwidacji */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rozkład pakietów własnościowych */}
          <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[rgba(159,186,199,0.12)]">
              <Scale className="w-4 h-4 text-[#75b8ff]" />
              <h2 className="text-sm font-semibold text-white">Wielkość pakietów Skarbu Państwa</h2>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedShareTier(selectedShareTier === "100" ? "all" : "100")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedShareTier === "100"
                    ? "bg-[#111a21] border-[#57e0c5]"
                    : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)]"
                }`}
              >
                <div className="text-[11px] text-[#8e9da7]">Jednoosobowe SP (100%)</div>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {stats.shares_distribution.wholly}
                </div>
                <div className="text-[10px] text-[#57e0c5] mt-0.5">Pełna odpowiedzialność MAP</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedShareTier(selectedShareTier === "majority" ? "all" : "majority")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedShareTier === "majority"
                    ? "bg-[#111a21] border-[#75b8ff]"
                    : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)]"
                }`}
              >
                <div className="text-[11px] text-[#8e9da7]">Większościowe (50–99.9%)</div>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {stats.shares_distribution.majority}
                </div>
                <div className="text-[10px] text-[#75b8ff] mt-0.5">Kontrola operacyjna</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedShareTier(selectedShareTier === "minority" ? "all" : "minority")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedShareTier === "minority"
                    ? "bg-[#111a21] border-[#f6c56b]"
                    : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)]"
                }`}
              >
                <div className="text-[11px] text-[#8e9da7]">Mniejszościowe (20–49.9%)</div>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {stats.shares_distribution.minority}
                </div>
                <div className="text-[10px] text-[#f6c56b] mt-0.5">Mniejszość blokująca / Orlen / KGHM</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedShareTier(selectedShareTier === "fractional" ? "all" : "fractional")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedShareTier === "fractional"
                    ? "bg-[#111a21] border-[#8e9da7]"
                    : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)]"
                }`}
              >
                <div className="text-[11px] text-[#8e9da7]">Ułamkowe / Resztkowe (&lt;20%)</div>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {stats.shares_distribution.fractional}
                </div>
                <div className="text-[10px] text-[#8e9da7] mt-0.5">Pakiety pasywne / restrukturyzacja</div>
              </button>
            </div>
          </div>

          {/* Monitor Likwidacji i Upadłości (95 spółek) */}
          <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(255,127,135,0.25)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,127,135,0.15)]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff7f87]" />
                <h2 className="text-sm font-semibold text-white">Monitor spółek w procedurach (95 podmiotów)</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStatus(selectedStatus === "troubled" ? "all" : "troubled")}
                className="text-[11px] px-2 py-0.5 rounded bg-[#ff7f87]/15 text-[#ff7f87] border border-[#ff7f87]/30 hover:bg-[#ff7f87]/25 font-mono"
              >
                Pokaż tylko problemowe
              </button>
            </div>

            <p className="text-xs text-[#8e9da7]">
              Łącznie 95 podmiotów z udziałem Skarbu Państwa znajduje się w stanie likwidacji, upadłości pod nadzorem syndyka
              bądź nie prowadzi działalności operacyjnej. Wymagają one bieżącej weryfikacji zabezpieczenia mienia i zaspokajania
              roszczeń budżetu państwa.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
              <div className="p-2 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
                <div className="text-sm font-bold text-[#f6c56b]">{stats.liquidation_count}</div>
                <div className="text-[10px] text-[#8e9da7]">Likwidacja</div>
              </div>
              <div className="p-2 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
                <div className="text-sm font-bold text-[#ff7f87]">{stats.bankruptcy_count}</div>
                <div className="text-[10px] text-[#8e9da7]">Upadłość</div>
              </div>
              <div className="p-2 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.1)]">
                <div className="text-sm font-bold text-[#8e9da7]">{stats.suspended_count}</div>
                <div className="text-[10px] text-[#8e9da7]">Zawieszone</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sektorowa macierz i rozkład miast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sektory */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#75b8ff]" />
              <h2 className="text-sm font-semibold text-white">Rozkład branżowo-sektorowy (12 domen)</h2>
            </div>
            <span className="text-[11px] text-[#8e9da7] font-mono">Liczba podmiotów</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {stats.sectors.map((sec) => {
              const isSelected = selectedSector === sec.name;
              return (
                <button
                  type="button"
                  key={sec.name}
                  onClick={() => setSelectedSector(isSelected ? "all" : sec.name)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-[#111a21] border-[#75b8ff] shadow-sm"
                      : "bg-[#070a0d] border-[rgba(159,186,199,0.1)] hover:border-[rgba(159,186,199,0.25)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold truncate ${isSelected ? "text-[#75b8ff]" : "text-white"}`}>
                      {sec.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-white ml-2">{sec.count}</span>
                  </div>
                  <div className="text-[10px] text-[#8e9da7] font-mono mt-1">{sec.percentage}% całego rejestru</div>
                </button>
              );
            })}
          </div>

          {selectedSector !== "all" && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#75b8ff]">
                Aktywny sektor: <strong className="text-white">{selectedSector}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedSector("all")}
                className="text-xs text-[#8e9da7] hover:text-white underline"
              >
                Wyczyść filtr sektora
              </button>
            </div>
          )}
        </div>

        {/* Główne ośrodki miejskie */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(159,186,199,0.12)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f6c56b]" />
              <h2 className="text-sm font-semibold text-white">Główne ośrodki (Siedziby)</h2>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {stats.top_cities.map((city) => (
              <div
                key={city.city}
                className="flex items-center justify-between p-2 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.08)]"
              >
                <span className="text-xs text-white">{city.city}</span>
                <span className="text-xs font-mono font-bold text-[#f6c56b]">{city.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Główna tabela danych wszystkich 406 spółek z filtrami i paginacją */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[rgba(159,186,199,0.12)]">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Szczegółowa baza danych ({sortedEntities.length} z {entities.length} spółek)
            </h2>
            <p className="text-xs text-[#8e9da7] mt-0.5">
              Kliknij dowolny wiersz tabeli, aby otworzyć pełne Dossier 360° podmiotu
            </p>
          </div>

          {/* Szybka wyszukiwarka tabeli */}
          <div className="flex items-center gap-2">
            <div className="relative w-64 sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5d6b74]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Szukaj po nazwie, NIP, mieście lub organie..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-[#070a0d] border border-[rgba(159,186,199,0.14)] text-white placeholder-[#5d6b74] focus:outline-none focus:border-[#57e0c5]"
              />
            </div>

            {(selectedOrgan !== "all" || selectedStatus !== "all" || selectedShareTier !== "all" || selectedSector !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOrgan("all");
                  setSelectedStatus("all");
                  setSelectedShareTier("all");
                  setSelectedSector("all");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#111a21] text-xs text-[#ff7f87] hover:bg-[#16222b] border border-[#ff7f87]/30 transition-all shrink-0"
              >
                Resetuj filtry
              </button>
            )}
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg border border-[rgba(159,186,199,0.12)]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070a0d] text-[#8e9da7] font-mono border-b border-[rgba(159,186,199,0.12)] select-none">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">Lp.</th>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nazwa Spółki</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("nip")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>NIP</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("city")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Siedziba</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("status")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("state_share_percent")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Udział SP %</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("ownership_body")}
                  className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Organ Nadzorujący</span>
                    <ArrowUpDown className="w-3 h-3 text-[#5d6b74]" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Akcja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(159,186,199,0.06)] bg-[#0d1318]">
              {paginatedEntities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#8e9da7]">
                    Brak spółek spełniających wybrane kryteria filtrów.
                  </td>
                </tr>
              ) : (
                paginatedEntities.map((e, index) => {
                  const globalIdx = (currentPage - 1) * pageSize + index + 1;
                  const isWholly = e.state_share_percent === 100;
                  const isMajority = e.state_share_percent >= 50 && e.state_share_percent < 100;
                  const isTroubled = ["liquidation", "bankruptcy", "suspended"].includes(e.status);

                  return (
                    <tr
                      key={e.id}
                      onClick={() => onSelectEntity(e.id)}
                      className="hover:bg-[#111a21] cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 px-3 text-center text-[#5d6b74] font-mono">{globalIdx}</td>
                      <td className="py-2.5 px-3 font-semibold text-white group-hover:text-[#57e0c5] transition-colors max-w-xs truncate">
                        {e.name}
                      </td>
                      <td className="py-2.5 px-3 text-[#8e9da7] font-mono">{e.nip || "—"}</td>
                      <td className="py-2.5 px-3 text-[#8e9da7]">{e.city || "—"}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${
                            e.status === "active"
                              ? "bg-[#57e0c5]/10 text-[#57e0c5] border-[#57e0c5]/30"
                              : e.status === "bankruptcy"
                              ? "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/40"
                              : e.status === "liquidation"
                              ? "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/40"
                              : "bg-[#8e9da7]/15 text-[#8e9da7] border-[#8e9da7]/30"
                          }`}
                        >
                          {e.status_label ?? e.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span
                          className={
                            isWholly
                              ? "text-[#57e0c5]"
                              : isMajority
                              ? "text-[#75b8ff]"
                              : e.state_share_percent >= 20
                              ? "text-[#f6c56b]"
                              : "text-[#8e9da7]"
                          }
                        >
                          {e.state_share_percent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#8e9da7] max-w-[220px] truncate" title={e.ownership_body}>
                        {e.ownership_body}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[11px] text-[#57e0c5] group-hover:underline">Dossier →</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginacja */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-[#8e9da7]">
          <div className="flex items-center gap-2">
            <span>Wyświetlaj:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#070a0d] border border-[rgba(159,186,199,0.14)] rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value={25}>25 wierszy</option>
              <option value={50}>50 wierszy</option>
              <option value={100}>100 wierszy</option>
              <option value={406}>Wszystkie (406)</option>
            </select>
            <span>
              Strona <strong className="text-white">{currentPage}</strong> z{" "}
              <strong className="text-white">{totalPages}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.14)] disabled:opacity-40 hover:bg-[#111a21] text-white flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Poprzednia</span>
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.14)] disabled:opacity-40 hover:bg-[#111a21] text-white flex items-center gap-1"
            >
              <span>Następna</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
