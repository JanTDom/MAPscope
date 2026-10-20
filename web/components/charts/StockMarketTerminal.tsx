"use client";

import React, { useState } from "react";
import {
  STOCK_EXCHANGE_DATA,
  ESPI_REPORTS_DATA,
  ANALYST_CONSENSUS_DATA,
} from "@/lib/mapscope-data";
import { StockExchangeData, EspiReportRecord, AnalystConsensusRecord } from "@/lib/types";

interface StockMarketTerminalProps {
  onSelectEntity?: (entityId: string) => void;
}

export function StockMarketTerminal({ onSelectEntity }: StockMarketTerminalProps) {
  const [activeTab, setActiveTab] = useState<"stocks" | "espi" | "analysts">("stocks");
  const [filterMarOnly, setFilterMarOnly] = useState(false);

  const stocks = STOCK_EXCHANGE_DATA;
  const espiReports = filterMarOnly
    ? ESPI_REPORTS_DATA.filter((r) => r.isMarRiskFlag)
    : ESPI_REPORTS_DATA;
  const consensus = ANALYST_CONSENSUS_DATA;

  // Łączna wartość pakietów Skarbu Państwa na GPW
  const totalStatePortfolioValueMld = stocks.reduce((acc, s) => acc + s.stateShareValueMldPln, 0);
  const totalMarketCapMld = stocks.reduce((acc, s) => acc + s.marketCapMldPln, 0);
  const avgPoliticalDiscount =
    stocks.reduce((acc, s) => acc + s.politicalDiscountPercent, 0) / stocks.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Pasek Tytułowy Terminala GPW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Terminal giełdowy GPW i relacje inwestorskie (ESPI / EBI)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Notowania spółek Skarbu Państwa na Giełdzie Papierów Wartościowych w Warszawie, wyceny rynkowe i raporty regulacyjne
          </p>
        </div>

        {/* Trzy kluczowe wskaźniki rynkowe */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Portfel Skarbu Państwa</span>
            <span className="text-emerald-400 font-bold text-sm">
              {totalStatePortfolioValueMld.toFixed(2)} mld PLN
            </span>
          </div>
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Kapitalizacja rynkowa SSP</span>
            <span className="text-blue-400 font-bold text-sm">
              {totalMarketCapMld.toFixed(2)} mld PLN
            </span>
          </div>
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Średnie dyskonto polityczne</span>
            <span className="text-amber-400 font-bold text-sm">
              {avgPoliticalDiscount.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Nawigacja zakładek terminala */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("stocks")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "stocks"
                ? "bg-slate-800 text-white border border-emerald-500/50 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Notowania i wyceny spółek ({stocks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("espi")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "espi"
                ? "bg-slate-800 text-white border border-emerald-500/50 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Raporty bieżące ESPI/EBI ({espiReports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analysts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "analysts"
                ? "bg-slate-800 text-white border border-emerald-500/50 shadow"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Konsensus analityków i wyceny docelowe ({consensus.length})
          </button>
        </div>

        {activeTab === "espi" && (
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={filterMarOnly}
              onChange={(e) => setFilterMarOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-red-500 focus:ring-0"
            />
            <span className="text-red-400 font-medium">Tylko alerty ryzyka regulacyjnego MAR</span>
          </label>
        )}
      </div>

      {/* Widok 1: Tabela Notowań GPW */}
      {activeTab === "stocks" && (
        <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Ticker / Spółka</th>
                <th className="p-3 text-right">Kurs bieżący</th>
                <th className="p-3 text-right">Zmiana 1D</th>
                <th className="p-3 text-right">Zmiana 1M</th>
                <th className="p-3 text-right">Kapitalizacja</th>
                <th className="p-3 text-right">Pakiet Skarbu Państwa</th>
                <th className="p-3 text-center">C/Z (P/E)</th>
                <th className="p-3 text-center">C/WK (P/B)</th>
                <th className="p-3 text-center">Stopa Dyw.</th>
                <th className="p-3 text-center">Dyskonto polityczne</th>
                <th className="p-3 text-right">Indeksy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {stocks.map((s) => (
                <tr
                  key={s.ticker}
                  className="hover:bg-slate-900/60 transition cursor-pointer"
                  onClick={() => onSelectEntity && onSelectEntity(s.entityId)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {s.ticker}
                      </span>
                      <span className="font-semibold text-slate-200">
                        {s.ticker === "PKN"
                          ? "ORLEN S.A."
                          : s.ticker === "PKO"
                          ? "PKO Bank Polski S.A."
                          : s.ticker === "PZU"
                          ? "PZU S.A."
                          : s.ticker === "KGH"
                          ? "KGHM Polska Miedź S.A."
                          : s.ticker === "PGE"
                          ? "Polska Grupa Energetyczna S.A."
                          : s.ticker === "TPE"
                          ? "Tauron Polska Energia S.A."
                          : s.ticker === "ENA"
                          ? "Enea S.A."
                          : s.ticker === "JSW"
                          ? "Jastrzębska Spółka Węglowa S.A."
                          : s.ticker === "PKP"
                          ? "PKP CARGO S.A. w restrukturyzacji"
                          : "Grupa Azoty S.A."}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-white text-sm">
                    {s.currentPricePln.toFixed(2)} PLN
                  </td>

                  <td className={`p-3 text-right font-mono font-bold ${s.change1dPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {s.change1dPercent >= 0 ? `+${s.change1dPercent.toFixed(2)}%` : `${s.change1dPercent.toFixed(2)}%`}
                  </td>

                  <td className={`p-3 text-right font-mono ${s.change1mPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {s.change1mPercent >= 0 ? `+${s.change1mPercent.toFixed(2)}%` : `${s.change1mPercent.toFixed(2)}%`}
                  </td>

                  <td className="p-3 text-right font-mono text-slate-200">
                    {s.marketCapMldPln.toFixed(2)} mld zł
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-blue-400">
                    {s.stateShareValueMldPln.toFixed(2)} mld zł
                  </td>

                  <td className="p-3 text-center font-mono text-slate-300">
                    {s.peRatio < 0 ? "ujemny" : s.peRatio.toFixed(1)}
                  </td>

                  <td className="p-3 text-center font-mono text-slate-300">
                    {s.pbRatio.toFixed(2)}
                  </td>

                  <td className="p-3 text-center font-mono text-slate-300">
                    {s.dividendYieldPercent > 0 ? `${s.dividendYieldPercent.toFixed(1)}%` : "—"}
                  </td>

                  <td className="p-3 text-center font-mono font-semibold text-amber-400">
                    {s.politicalDiscountPercent.toFixed(1)}%
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      {s.indexBasket.map((idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                          {idx}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Widok 2: Raporty Bieżące ESPI/EBI */}
      {activeTab === "espi" && (
        <div className="space-y-3">
          {espiReports.map((espi) => (
            <div
              key={espi.id}
              className={`p-4 rounded-xl bg-slate-950 border transition ${
                espi.isMarRiskFlag
                  ? "border-red-500/40 bg-red-950/10 shadow-lg shadow-red-500/5"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">
                    {espi.reportNumber}
                  </span>
                  <span className="font-bold text-sm text-white">{espi.entityName}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {espi.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {espi.isMarRiskFlag && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Ryzyko MAR (Art. 17)
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-500">{espi.publishedAt}</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-200 mt-2 hover:text-blue-400 transition">
                <a href={espi.espiUrl} target="_blank" rel="noopener noreferrer">
                  {espi.title}
                </a>
              </h4>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{espi.summary}</p>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-between items-center text-[11px] text-slate-500">
                <span>Elektroniczny System Przekazywania Informacji (ESPI / KNF)</span>
                <a
                  href={espi.espiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-medium"
                >
                  Oryginalny komunikat giełdowy &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Widok 3: Konsensus Analityków i Rekomendacje */}
      {activeTab === "analysts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consensus.map((c) => (
            <div key={c.entityTicker} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700">
                    {c.entityTicker}
                  </span>
                  <span className="font-bold text-sm text-white">{c.entityName}</span>
                </div>

                <span
                  className={`text-xs font-mono font-bold ${
                    c.upsideDownsidePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {c.upsideDownsidePercent >= 0
                    ? `+${c.upsideDownsidePercent.toFixed(1)}% potencjał`
                    : `${c.upsideDownsidePercent.toFixed(1)}% potencjał`}
                </span>
              </div>

              {/* Bilans rekomendacji */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-[10px] text-slate-400 block uppercase">Kupuj</span>
                  <span className="font-mono font-bold text-emerald-400 text-base">{c.buyCount}</span>
                </div>
                <div className="p-2 rounded bg-amber-950/20 border border-amber-800/30">
                  <span className="text-[10px] text-slate-400 block uppercase">Trzymaj</span>
                  <span className="font-mono font-bold text-amber-400 text-base">{c.holdCount}</span>
                </div>
                <div className="p-2 rounded bg-red-950/20 border border-red-800/30">
                  <span className="text-[10px] text-slate-400 block uppercase">Sprzedaj</span>
                  <span className="font-mono font-bold text-red-400 text-base">{c.sellCount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400">Średnia cena docelowa:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {c.averageTargetPricePln.toFixed(2)} PLN (kurs: {c.currentPricePln.toFixed(2)} PLN)
                </span>
              </div>

              {/* Ostatnie rekomendacje biur maklerskich */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">
                  Ostatnie wyceny domów maklerskich:
                </span>
                <div className="space-y-1">
                  {c.topBrokers.map((b, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-[11px] bg-slate-900/40 px-2 py-1 rounded border border-slate-800/60"
                    >
                      <span className="text-slate-300 font-medium">{b.broker}</span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-semibold ${
                            b.rating === "Kupuj"
                              ? "text-emerald-400"
                              : b.rating === "Trzymaj"
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {b.rating}
                        </span>
                        <span className="font-mono font-bold text-white">{b.targetPrice.toFixed(2)} zł</span>
                        <span className="font-mono text-slate-500 text-[10px]">{b.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
