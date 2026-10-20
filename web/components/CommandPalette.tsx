"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Building2, Flame, AlertTriangle, ExternalLink, ArrowRight } from "lucide-react";
import type { EntityRecord } from "@/lib/types.ts";

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

  if (!isOpen) return null;

  const filtered = entities.filter((e) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      (e.nip && e.nip.includes(q)) ||
      (e.krs && e.krs.includes(q)) ||
      (e.stock_ticker && e.stock_ticker.toLowerCase().includes(q)) ||
      e.sector.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.24)] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Pasek wyszukiwania */}
        <div className="p-4 border-b border-[rgba(159,186,199,0.14)] flex items-center gap-3 bg-[#111a21]">
          <Search className="w-5 h-5 text-[#57e0c5] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj podmiotu Skarbu Państwa po nazwie, NIP, KRS, sektorze..."
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

        {/* Wyniki wyszukiwania */}
        <div className="p-2 overflow-y-auto flex-1 space-y-1 divide-y divide-[rgba(159,186,199,0.06)]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8e9da7]">
              Nie znaleziono spółki pasującej do zapytania "{query}".
            </div>
          ) : (
            filtered.map((e) => {
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

        {/* Stopka podpowiedzi */}
        <div className="p-3 bg-[#090d12] border-t border-[rgba(159,186,199,0.14)] text-[11px] text-[#5d6b74] flex items-center justify-between">
          <span>Naciśnij Esc, aby zamknąć</span>
          <span className="font-mono text-[#8e9da7]">{filtered.length} podmiotów w zasięgu</span>
        </div>
      </div>
    </div>
  );
}
