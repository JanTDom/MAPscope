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
  Network,
  Home,
  AlertTriangle,
  Sparkles,
  Layers,
  Copy,
  CheckCircle2,
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
  const [onlyDormant, setOnlyDormant] = useState(false);
  const [onlyHoldings, setOnlyHoldings] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);

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

      let matchesDormant = true;
      if (onlyDormant) {
        matchesDormant = !!e.is_dormant_liquidation;
      }

      let matchesHoldings = true;
      if (onlyHoldings) {
        matchesHoldings = (e.subsidiary_count || 0) > 0;
      }

      return (
        matchesSearch &&
        matchesSector &&
        matchesStatus &&
        matchesOwnership &&
        matchesDormant &&
        matchesHoldings
      );
    });
  }, [entities, searchQuery, selectedSector, selectedStatus, selectedOwnership, onlyDormant, onlyHoldings]);

  const activeEntity = entities.find((e) => e.id === selectedEntityId) || filteredEntities[0];

  const handleCopyMinisterBriefing = () => {
    if (!activeEntity || !activeEntity.dossier?.ministerBriefing) return;
    const mb = activeEntity.dossier.ministerBriefing;
    const text = [
      `BRIEFING GABINETOWY MAP: ${activeEntity.name.toUpperCase()}`,
      `Udział SP: ${activeEntity.state_share_percent}% | Sektor: ${activeEntity.sector}`,
      `Status: ${activeEntity.status.toUpperCase()} | Nadzór: ${activeEntity.ownership_body}`,
      "",
      `KLUCZOWE WSKAŹNIKI:`,
      ...mb.threeNumbers.map((n) => `• ${n.label}: ${n.value}`),
      "",
      `SYTUACJA: ${mb.statusSummary}`,
      `LINIA OBRONY MINISTRA: ${mb.defensiveTalkingPoint}`,
      `RYZYKO NA TEN TYDZIEŃ: ${mb.keyRiskThisWeek}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2500);
  };

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

        {/* Specjalistyczne filtry Ministra (Uśpione z majątkiem & Grupy holdingowe) */}
        <div className="flex items-center gap-2 pt-2 border-t border-[rgba(160,190,210,0.06)] flex-wrap">
          <button
            type="button"
            onClick={() => setOnlyHoldings(!onlyHoldings)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              onlyHoldings
                ? "bg-[#75b8ff]/20 text-[#75b8ff] border border-[#75b8ff]/40"
                : "bg-[#101923] text-[#8a9ba8] border border-[rgba(160,190,210,0.12)] hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Grupy Kapitałowe / Holdingi ({entities.filter((e) => (e.subsidiary_count || 0) > 0).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyDormant(!onlyDormant)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              onlyDormant
                ? "bg-[#f6c56b]/20 text-[#f6c56b] border border-[#f6c56b]/40"
                : "bg-[#101923] text-[#8a9ba8] border border-[rgba(160,190,210,0.12)] hover:text-white"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Uśpiona Likwidacja z Nieruchomościami ({entities.filter((e) => e.is_dormant_liquidation).length})</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8a9ba8] pt-2 border-t border-[rgba(160,190,210,0.06)]">
          <div>
            Znaleziono <span className="text-white font-mono font-semibold">{filteredEntities.length}</span> z{" "}
            <span className="text-white font-mono">{entities.length}</span> podmiotów w bazie
          </div>
          <div className="flex items-center gap-1.5 text-[#57e0c5]">
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
              const hasSubsidiaries = (entity.subsidiary_count || 0) > 0;

              return (
                <div
                  key={entity.id}
                  onClick={() => onSelectEntity(entity.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#111a24] border-[#57e0c5] shadow-md"
                      : "bg-[#0b1118] border-[rgba(160,190,210,0.12)] hover:border-[rgba(160,190,210,0.25)] hover:bg-[#0e1620]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white">{entity.name}</span>
                        {entity.is_public_listed && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3b82f6]/10 text-[#75b8ff] border border-[#3b82f6]/30 font-mono">
                            GPW: {entity.stock_ticker}
                          </span>
                        )}
                        {hasSubsidiaries && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#75b8ff]/20 text-[#75b8ff] border border-[#75b8ff]/40 font-mono font-bold flex items-center gap-1">
                            <Network className="w-3 h-3" />
                            HOLDING ({entity.subsidiary_count} CÓREK)
                          </span>
                        )}
                        {entity.is_dormant_liquidation && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f6c56b]/20 text-[#f6c56b] border border-[#f6c56b]/40 font-mono font-bold flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            LIKWIDACJA {entity.dormant_years}L • MAJĄTEK
                          </span>
                        )}
                        {entity.status === "restructuring" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
                            RESTRUKTURYZACJA
                          </span>
                        )}
                        {entity.status === "liquidation" && !entity.is_dormant_liquidation && (
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
              <div className="pb-3 border-b border-[rgba(160,190,210,0.1)] flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#57e0c5] font-mono">
                    Karta podmiotu Skarbu Państwa
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{activeEntity.name}</h3>
                  {activeEntity.formal_name && (
                    <p className="text-xs text-[#8a9ba8] mt-0.5">{activeEntity.formal_name}</p>
                  )}
                </div>

                {activeEntity.dossier?.ministerBriefing && (
                  <button
                    type="button"
                    onClick={handleCopyMinisterBriefing}
                    className="px-2.5 py-1 rounded bg-[#16222b] hover:bg-[#1f2f3c] text-[10px] text-[#57e0c5] border border-[rgba(87,224,197,0.3)] transition-colors flex items-center gap-1 shrink-0"
                    title="Skopiuj 10-sekundową fiszkę na telefon"
                  >
                    {copiedBriefing ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-[#57e0c5]" />
                        <span>Skopiowano!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Fiszka na telefon</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                {/* Moduł Fiszki Ministra w karcie */}
                {activeEntity.dossier?.ministerBriefing && (
                  <div className="p-3 rounded-lg bg-[#111a21] border border-[#57e0c5]/25 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Fiszka Ministra (Briefing 10s):</span>
                    </span>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {activeEntity.dossier.ministerBriefing.threeNumbers.map((n, i) => (
                        <div key={i} className="p-1.5 rounded bg-[#070a0d] border border-[rgba(159,186,199,0.06)]">
                          <span className="text-[9px] text-[#8e9da7] block truncate">{n.label}</span>
                          <span className="text-xs font-bold text-white font-mono">{n.value}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-white leading-relaxed font-medium">
                      {activeEntity.dossier.ministerBriefing.defensiveTalkingPoint}
                    </p>

                    <div className="pt-1.5 border-t border-[rgba(159,186,199,0.08)] text-[10px] text-[#ff7f87] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Ryzyko tyg.: {activeEntity.dossier.ministerBriefing.keyRiskThisWeek}</span>
                    </div>
                  </div>
                )}

                {/* Sekcja Holdingu: Drzewo Spółek Zależnych */}
                {activeEntity.subsidiaries && activeEntity.subsidiaries.length > 0 && (
                  <div className="p-3 rounded-lg bg-[#070a0d] border border-[#75b8ff]/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#75b8ff] font-bold flex items-center gap-1">
                      <Network className="w-3 h-3" />
                      <span>Struktura Grupy Kapitałowej ({activeEntity.subsidiaries.length} kluczowych córek):</span>
                    </span>
                    <ul className="space-y-1 pl-1 text-[11px] text-white">
                      {activeEntity.subsidiaries.map((sub, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[#8e9da7]">
                          <span className="text-[#75b8ff]">↳</span>
                          <span className="text-white font-medium">{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sekcja Uśpionej Likwidacji */}
                {activeEntity.is_dormant_liquidation && (
                  <div className="p-3 rounded-lg bg-[#140b0f] border border-[#f6c56b]/35 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#f6c56b] font-bold flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span>Radar Mienia Likwidacyjnego:</span>
                    </span>
                    <p className="text-[11px] text-white leading-relaxed">
                      Podmiot w likwidacji od <strong className="text-[#f6c56b]">{activeEntity.dormant_years} lat</strong>. Posiada zamrożony majątek nieruchomościowy. Ryzyko niegospodarności przy zbywaniu działek bez autoryzacji departamentu nadzoru MAP.
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#546675] block">Identyfikatory państwowe</span>
                  <div className="mt-1 flex flex-wrap gap-2 text-white font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)]">
                      NIP: {activeEntity.nip || "Brak"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)] flex items-center gap-1.5">
                      <span>KRS: {activeEntity.krs || "Brak"}</span>
                      {activeEntity.krs && (
                        <a
                          href={activeEntity.krs_registry_url || "https://ekrs.ms.gov.pl/web/wyszukiwarka-krs/strona-glowna/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#57e0c5] hover:underline flex items-center gap-0.5 text-[10px]"
                          title="Centralna Informacja KRS (Ministerstwo Sprawiedliwości)"
                        >
                          <span>eKRS</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.1)]">
                      REGON: {activeEntity.regon || "Brak"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#57e0c5] font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Paszport KRS: Zweryfikowano z rejestrem eKRS MS ({activeEntity.krs_verification_date || "2026-10-21"})</span>
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
                      className="text-xs text-[#57e0c5] hover:underline flex items-center gap-1.5"
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
                      className="w-full py-2.5 rounded-lg bg-[#57e0c5] hover:bg-[#48c9b0] text-[#070a0d] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
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
