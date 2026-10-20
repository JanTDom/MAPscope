"use client";

import React, { useState } from "react";
import { OsintSearchResult } from "@/lib/types";

interface OsintSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function OsintSearchModal({ isOpen, onClose, initialQuery = "PKP Cargo restrukturyzacja" }: OsintSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<OsintSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveSource, setLiveSource] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!resp.ok) {
        throw new Error(`Błąd wyszukiwania: ${resp.status}`);
      }
      const data = await resp.json();
      setResults(data.results || []);
      setLiveSource(data.liveSource || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd podczas przeszukiwania sieci.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (preset: string) => {
    setQuery(preset);
    handleSearch(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Nagłówek modalu */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Wyszukiwarka OSINT i nasłuch sieci w czasie rzeczywistym
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Przeszukiwanie otwartego Internetu (Google News RSS PL, PAP, serwisy regionalne, BIP MAP i biura prasowe SSP)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            Zamknij [ESC]
          </button>
        </div>

        {/* Pasek wyszukiwania */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Wpisz nazwę spółki, nazwisko członka zarządu lub frazę kryzysową..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Przeszukiwanie..." : "Szukaj w sieci"}
            </button>
          </form>

          {/* Szybkie presety kryzysowe */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500">Szybkie tematy:</span>
            {[
              "PKP Cargo restrukturyzacja",
              "Poczta Polska pikieta",
              "Orlen audyt Lotos",
              "Totalizator Sportowy zarząd",
              "Grupa Azoty Polimery Police",
              "JSW spór zbiorowy",
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePreset(preset)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700/60 transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Wyniki wyszukiwania */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {liveSource && (
            <div className="flex justify-between items-center text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>
                Kanał ingestu: <strong className="text-blue-400">{liveSource}</strong>
              </span>
              <span>
                Znaleziono: <strong className="text-white font-mono">{results.length}</strong> publikacji
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800 p-4 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm">Przeszukiwanie źródeł otwartych i deduplikacja MinHash...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.urgencyTier === "P1"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : item.urgencyTier === "P2"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {item.urgencyTier}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.riskCategory}
                      </span>
                    </div>

                    <span className="text-xs text-slate-500 font-mono">
                      {item.pubDate ? new Date(item.pubDate).toLocaleString("pl-PL") : item.sourceDomain}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white hover:text-blue-400 transition">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>

                  {item.snippet && <p className="text-xs text-slate-400 leading-relaxed">{item.snippet}</p>}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      Źródło: <strong className="text-slate-300">{item.sourceName}</strong> ({item.sourceDomain})
                    </span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-medium"
                    >
                      Otwórz materiał źródłowy &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              Wpisz zapytanie powyżej lub wybierz jeden z tematów, aby uruchomić silnik przeszukiwania.
            </div>
          )}
        </div>

        {/* Stopka */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-500">
          <span>MAPscope OSINT &bull; Zgodność ze standardem PoliteHttpClient</span>
          <span>Deduplikacja Jaccard/MinHash aktywna</span>
        </div>
      </div>
    </div>
  );
}
