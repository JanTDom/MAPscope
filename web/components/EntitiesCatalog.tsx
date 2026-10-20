"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Building2,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import type { EntityRecord } from "@/lib/types.ts";

interface EntitiesCatalogProps {
  entities: EntityRecord[];
  selectedEntityId?: string | null;
  onSelectEntity: (entityId: string) => void;
  onOpenDossier?: (entityId: string) => void;
}

export function EntitiesCatalog({
  entities,
  selectedEntityId,
  onSelectEntity,
  onOpenDossier,
}: EntitiesCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOwnership, setSelectedOwnership] = useState<string>("all");

  // Unikalne sektory
  const sectors = useMemo(() => {
    const set = new Set(entities.map((e) => e.sector));
    return Array.from(set).sort();
  }, [entities]);

  // Filtrowanie
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        (e.formal_name && e.formal_name.toLowerCase().includes(q)) ||
        (e.nip && e.nip.includes(q)) ||
        (e.krs && e.krs.includes(q)) ||
        (e.stock_ticker && e.stock_ticker.toLowerCase().includes(q));

      const matchesSector = selectedSector === "all" || e.sector === selectedSector;
      const matchesStatus = selectedStatus === "all" || e.status === selectedStatus;

      let matchesOwnership = true;
      if (selectedOwnership === "100") matchesOwnership = e.state_share_percent === 100;
      else if (selectedOwnership === "majority")
        matchesOwnership = e.state_share_percent > 50 && e.state_share_percent < 100;
      else if (selectedOwnership === "minority") matchesOwnership = e.state_share_percent <= 50;

      return matchesSearch && matchesSector && matchesStatus && matchesOwnership;
    });
  }, [entities, searchQuery, selectedSector, selectedStatus, selectedOwnership]);

  const activeEntity = entities.find((e) => e.id === selectedEntityId) || filteredEntities[0];

  return (
    <div className="space-y-6">
      {/* Pasek wyszukiwania i filtrów */}
      <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a9ba8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po nazwie spółki, NIP, KRS lub tickerze GPW..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded bg-[#101923] border border-[rgba(160,190,210,0.14)] text-white placeholder-[#546675] focus:outline-none focus:border-[#c59b27]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-2 text-xs rounded bg-[#101923] border border-[rgba(160,190,210,0.14)] text-white"
            >
              <option value="all">Wszystkie sektory ({sectors.length})</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-2 text-xs rounded bg-[#101923] border border-[rgba(160,190,210,0.14)] text-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywna</option>
              <option value="restructuring">W restrukturyzacji</option>
              <option value="liquidation">W likwidacji</option>
              <option value="bankruptcy">W upadłości</option>
            </select>

            <select
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
              className="px-2.5 py-2 text-xs rounded bg-[#101923] border border-[rgba(160,190,210,0.14)] text-white"
            >
              <option value="all">Udział Skarbu Państwa</option>
              <option value="100">100% udziału</option>
              <option value="majority">Większościowy (&gt; 50%)</option>
              <option value="minority">Mniejszościowy (&lt;= 50%)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8a9ba8] pt-2 border-t border-[rgba(160,190,210,0.06)]">
          <div>
            Znaleziono <span className="text-white font-mono font-semibold">{filteredEntities.length}</span> z{" "}
            <span className="text-white font-mono">{entities.length}</span> podmiotów w bazie
          </div>
          <div className="flex items-center gap-1.5 text-[#c59b27]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zasada zero wykluczeń: 100% spółek Skarbu Państwa</span>
          </div>
        </div>
      </div>

      {/* Siatka: Lista podmiotów + Karta szczegółów */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-2 max-h-[780px] overflow-y-auto pr-2">
          {filteredEntities.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
              <AlertCircle className="w-8 h-8 text-[#8a9ba8] mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white">Brak wyników</h3>
              <p className="text-xs text-[#8a9ba8] mt-1">
                Żaden podmiot nie spełnia kryteriów wyszukiwania. Zresetuj filtry, aby wyświetlić pełen wykaz.
              </p>
            </div>
          ) : (
            filteredEntities.map((entity) => {
              const isSelected = entity.id === selectedEntityId;
              const score = entity.recent_risk_score ?? 0;

              return (
                <div
                  key={entity.id}
                  onClick={() => onSelectEntity(entity.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#111a24] border-[#c59b27] shadow-md"
                      : "bg-[#0b1118] border-[rgba(160,190,210,0.12)] hover:border-[rgba(160,190,210,0.25)] hover:bg-[#0e1620]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{entity.name}</span>
                        {entity.is_public_listed && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3b82f6]/10 text-[#75b8ff] border border-[#3b82f6]/30 font-mono">
                            GPW: {entity.stock_ticker}
                          </span>
                        )}
                        {entity.status === "restructuring" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
                            RESTRUKTURYZACJA
                          </span>
                        )}
                        {entity.status === "liquidation" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">
                            W LIKWIDACJI
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8a9ba8] mt-1 flex flex-wrap items-center gap-2">
                        <span>{entity.sector}</span>
                        <span>•</span>
                        <span>Udział SP: <strong className="text-white">{entity.state_share_percent}%</strong></span>
                        <span>•</span>
                        <span>{entity.ownership_body}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#546675] block">Ryzyko</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {score.toFixed(1)} / 10
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#546675]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Szczegóły podmiotu */}
        <div className="lg:col-span-5">
          {activeEntity ? (
            <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)] sticky top-20 space-y-4">
              <div className="pb-3 border-b border-[rgba(160,190,210,0.1)]">
                <span className="text-[10px] uppercase tracking-wider text-[#c59b27] font-mono">
                  Karta podmiotu Skarbu Państwa
                </span>
                <h3 className="text-base font-bold text-white mt-1">{activeEntity.name}</h3>
                {activeEntity.formal_name && (
                  <p className="text-xs text-[#8a9ba8] mt-0.5">{activeEntity.formal_name}</p>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#546675] block">Identyfikatory państwowe</span>
                  <div className="mt-1 flex flex-wrap gap-2 text-white font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)]">
                      NIP: {activeEntity.nip || "Brak"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)]">
                      KRS: {activeEntity.krs || "Brak"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)]">
                      REGON: {activeEntity.regon || "Brak"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[rgba(160,190,210,0.06)]">
                  <div>
                    <span className="text-[#546675] block">Udział Skarbu Państwa</span>
                    <span className="text-sm font-semibold text-white font-mono">
                      {activeEntity.state_share_percent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[#546675] block">Ranga w portfelu</span>
                    <span className="text-sm font-semibold text-white capitalize">
                      {activeEntity.strategic_importance}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(160,190,210,0.06)]">
                  <span className="text-[#546675] block">Organ wykonujący prawa z akcji</span>
                  <span className="text-white font-medium">{activeEntity.ownership_body}</span>
                </div>

                {activeEntity.map_department && (
                  <div className="pt-2 border-t border-[rgba(160,190,210,0.06)]">
                    <span className="text-[#546675] block">Właściwy departament w MAP</span>
                    <span className="text-[#75b8ff] font-medium">{activeEntity.map_department}</span>
                  </div>
                )}

                {activeEntity.website_url && (
                  <div className="pt-3 border-t border-[rgba(160,190,210,0.06)]">
                    <a
                      href={activeEntity.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#c59b27] hover:underline flex items-center gap-1.5"
                    >
                      <span>Oficjalny serwis spółki</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {onOpenDossier && (
                  <div className="pt-3 border-t border-[rgba(159,186,199,0.1)]">
                    <button
                      type="button"
                      onClick={() => onOpenDossier(activeEntity.id)}
                      className="w-full py-2 rounded-lg bg-[#57e0c5] hover:bg-[#48c9b0] text-[#070a0d] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Otwórz pełne Dossier 360°</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
              <Building2 className="w-8 h-8 text-[#546675] mx-auto mb-2" />
              <p className="text-xs text-[#8a9ba8]">Wybierz spółkę z listy, aby wyświetlić metadane i nadzór MAP.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
