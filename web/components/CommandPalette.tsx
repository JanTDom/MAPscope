"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, X, Building2, Flame, ArrowRight, Sparkles, FileQuestion } from "lucide-react";
import type { EntityRecord } from "@/lib/types.ts";
import { executeSemanticSearch } from "@/lib/semantic-search.ts";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  entities: EntityRecord[];
  onSelectEntity: (entityId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  entities,
  onSelectEntity,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const semanticResult = useMemo(() => {
    if (!query.trim()) return null;
    return executeSemanticSearch(query);
  }, [query]);

  const filteredEntities = useMemo(() => {
    if (semanticResult && semanticResult.matchedEntities.length > 0) {
      return semanticResult.matchedEntities.map((m) => m.entity);
    }
    const q = query.toLowerCase().trim();
    if (!q) return entities;
    return entities.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.nip && e.nip.includes(q)) ||
        (e.krs && e.krs.includes(q)) ||
        (e.stock_ticker && e.stock_ticker.toLowerCase().includes(q)) ||
        e.sector.toLowerCase().includes(q)
    );
  }, [query, entities, semanticResult]);

  if (!isOpen) return null;

  const QUICK_INTENTS = [
    { label: "Płynność i zadłużenie", query: "płynność kowenanty" },
    { label: "Spory zbiorowe", query: "strajk związki zawodowe" },
    { label: "Kontrole NIK/CBA", query: "kontrola NIK prokuratura" },
    { label: "Wybory zarządów", query: "odwołanie prezesa konkurs" },
    { label: "Inwestycje strategiczne", query: "inwestycje offshore atom" },
    { label: "Sanacja i likwidacja", query: "likwidacja upadłość sanacja" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-2 sm:px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.24)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[75vh]">
        {/* Pasek wyszukiwania */}
        <div className="p-4 border-b border-[rgba(159,186,199,0.14)] flex items-center gap-3 bg-[#111a21]">
          <Search className="w-5 h-5 text-[#57e0c5] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj podmiotu lub wpisz problem (np. 'spory pracownicze', 'zagrożenie kowenantów', 'kontrole NIK')..."
            className="w-full bg-transparent text-sm text-white placeholder-[#5d6b74] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#8e9da7] hover:text-white hover:bg-[#16222b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chipy szybkich intencji AI */}
        <div className="px-3 py-2 bg-[#090d12] border-b border-[rgba(159,186,199,0.08)] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#5d6b74] font-mono shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#57e0c5]" />
            <span>Intencje AI:</span>
          </span>
          {QUICK_INTENTS.map((qi, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(qi.query)}
              className="px-2 py-0.5 rounded bg-[#111a21] hover:bg-[#192734] text-slate-300 hover:text-white border border-slate-800 shrink-0 transition-colors"
            >
              {qi.label}
            </button>
          ))}
        </div>

        {/* Pasek rozpoznanej intencji semantycznej */}
        {semanticResult && semanticResult.detectedThemes.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border-b border-cyan-500/30 flex items-start gap-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-300 uppercase font-mono text-[10px]">
                  Wykryta intencja semantyczna: {semanticResult.detectedThemes[0]}
                </span>
              </div>
              <p className="text-slate-300 mt-0.5 text-[11px] leading-snug">
                {semanticResult.matchedEntities[0]?.matchReason || "Dopasowano na podstawie korelacji domenowej i rejestrów MAP."}
              </p>
            </div>
          </div>
        )}

        {/* Wyniki wyszukiwania */}
        <div className="p-2 overflow-y-auto flex-1 space-y-2">
          {/* Jeśli znaleziono powiązane pożary dnia */}
          {semanticResult && semanticResult.matchedAlerts.length > 0 && (
            <div className="mb-2 p-2 rounded-lg bg-red-950/20 border border-red-500/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-red-300 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400" />
                <span>Powiązane pożary dnia i sprawy kryzysowe ({semanticResult.matchedAlerts.length}):</span>
              </span>
              <div className="space-y-1">
                {semanticResult.matchedAlerts.map((fa) => (
                  <div
                    key={fa.id}
                    onClick={() => {
                      const match = entities.find((e) => e.name.toLowerCase().includes(fa.entityName.toLowerCase()));
                      if (match) onSelectEntity(match.id);
                      onClose();
                    }}
                    className="p-2 rounded bg-slate-950/80 hover:bg-slate-900 border border-slate-800 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white block">{fa.entityName}: {fa.title}</span>
                      <span className="text-[10px] text-slate-400">{fa.relevanceReason}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jeśli znaleziono powiązane interpelacje Sejmu */}
          {semanticResult && semanticResult.matchedInquiries.length > 0 && (
            <div className="mb-2 p-2 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold flex items-center gap-1">
                <FileQuestion className="w-3 h-3 text-amber-400" />
                <span>Powiązane interpelacje Sejmu RP ({semanticResult.matchedInquiries.length}):</span>
              </span>
              <div className="space-y-1">
                {semanticResult.matchedInquiries.map((inq, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-950/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-200">Interpelacja nr {inq.number}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Sejm RP</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{inq.subject}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista podmiotów */}
          <div className="space-y-1 divide-y divide-[rgba(159,186,199,0.06)]">
            {filteredEntities.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8e9da7]">
                Nie znaleziono spółki pasującej do zapytania "{query}".
              </div>
            ) : (
              filteredEntities.map((e) => {
                const score = e.recent_risk_score ?? 0;
                return (
                  <div
                    key={e.id}
                    onClick={() => {
                      onSelectEntity(e.id);
                      onClose();
                    }}
                    className="p-3 rounded-lg flex items-center justify-between hover:bg-[#111a21] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#16222b] border border-[rgba(159,186,199,0.1)] flex items-center justify-center text-[#75b8ff]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#57e0c5] transition-colors">
                            {e.name}
                          </span>
                          {e.stock_ticker && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#75b8ff]/15 text-[#75b8ff] font-mono">
                              GPW: {e.stock_ticker}
                            </span>
                          )}
                          {e.status === "restructuring" && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f6c56b]/15 text-[#f6c56b] font-mono">
                              Sanacja
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8e9da7] flex items-center gap-2 mt-0.5">
                          <span>{e.sector}</span>
                          <span>•</span>
                          <span>SP: {e.state_share_percent}%</span>
                          {e.krs && <span>• KRS: {e.krs}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                          score >= 7
                            ? "bg-[#ff7f87]/15 text-[#ff7f87] border-[#ff7f87]/30"
                            : score >= 4
                            ? "bg-[#f6c56b]/15 text-[#f6c56b] border-[#f6c56b]/30"
                            : "bg-[#57e0c5]/15 text-[#57e0c5] border-[#57e0c5]/30"
                        }`}
                      >
                        {score.toFixed(1)}/10
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#5d6b74] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stopka podpowiedzi */}
        <div className="p-3 bg-[#090d12] border-t border-[rgba(159,186,199,0.14)] text-[11px] text-[#5d6b74] flex items-center justify-between">
          <span>Naciśnij Esc, aby zamknąć</span>
          <span className="font-mono text-[#8e9da7]">{filteredEntities.length} podmiotów w zasięgu</span>
        </div>
      </div>
    </div>
  );
}
