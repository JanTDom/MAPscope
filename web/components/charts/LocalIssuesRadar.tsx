"use client";

import React, { useState } from "react";
import { LOCAL_MUNICIPAL_ISSUES } from "@/lib/mapscope-data";
import { LocalMunicipalIssue } from "@/lib/types";

interface LocalIssuesRadarProps {
  onSelectEntity?: (entityId: string) => void;
}

export function LocalIssuesRadar({ onSelectEntity }: LocalIssuesRadarProps) {
  const [selectedIssue, setSelectedIssue] = useState<LocalMunicipalIssue>(LOCAL_MUNICIPAL_ISSUES[0]);
  const [filterType, setFilterType] = useState<string>("all");

  const issues = LOCAL_MUNICIPAL_ISSUES.filter(
    (item) => filterType === "all" || item.issueType === filterType
  );

  const totalDisputedAmountMln = LOCAL_MUNICIPAL_ISSUES.reduce((acc, i) => acc + i.financialImpactMlnPln, 0);
  const highMonocultureCount = LOCAL_MUNICIPAL_ISSUES.filter((i) => i.countyWorkforceSharePercent >= 25).length;

  const getTypeLabel = (type: LocalMunicipalIssue["issueType"]) => {
    switch (type) {
      case "PODATEK_LOKALNY":
        return { text: "Podatek od nieruchomości", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "ŚRODOWISKO_ODORY":
        return { text: "Środowisko i uciążliwości", color: "text-red-400 bg-red-500/10 border-red-500/30" };
      case "ZATRUDNIENIE_RYNEK_PRACY":
        return { text: "Monokultura zatrudnienia", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
      case "SPÓR_PLANISTYCZNY":
      default:
        return { text: "Spór planistyczny / szkody", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Radar problemów lokalnych, samorządowych i ekologicznych
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Spory z wójtami i burmistrzami o podatki lokalne, uciążliwości środowiskowe oraz monokultury zatrudnienia w powiatach
          </p>
        </div>

        {/* Trzy wskaźniki samorządowe */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Sporne podatki gminne</span>
            <span className="text-amber-400 font-bold text-sm">
              {totalDisputedAmountMln.toFixed(1)} mln PLN
            </span>
          </div>
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Powiaty monokulturowe (&gt;25% załogi)</span>
            <span className="text-blue-400 font-bold text-sm">
              {highMonocultureCount} regiony
            </span>
          </div>
          <div className="bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px] uppercase font-sans">Otwarte spory prawne</span>
            <span className="text-red-400 font-bold text-sm">
              {LOCAL_MUNICIPAL_ISSUES.filter((i) => i.status === "otwarty_spór").length} jednostki
            </span>
          </div>
        </div>
      </div>

      {/* Pasek filtrów typu sporu */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "Wszystkie zagadnienia lokalne" },
            { id: "PODATEK_LOKALNY", label: "Podatki gminne i opłaty" },
            { id: "ŚRODOWISKO_ODORY", label: "Środowisko i emisje" },
            { id: "ZATRUDNIENIE_RYNEK_PRACY", label: "Lokalny rynek pracy" },
            { id: "SPÓR_PLANISTYCZNY", label: "Szkody górnicze i plany" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? "bg-slate-800 text-white border border-amber-500/50 shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Wyświetlanie: {issues.length} z {LOCAL_MUNICIPAL_ISSUES.length} spraw
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tabela spraw samorządowych */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Samorząd / Województwo</th>
                <th className="p-3">Spółka z portfela MAP</th>
                <th className="p-3">Kategoria</th>
                <th className="p-3 text-right">Kwota / Wpływ</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {issues.map((item) => {
                const isSelected = selectedIssue.id === item.id;
                const typeInfo = getTypeLabel(item.issueType);

                return (
                  <tr
                    key={item.id}
                    className={`cursor-pointer transition ${
                      isSelected ? "bg-slate-900/90 border-l-2 border-l-amber-500" : "hover:bg-slate-900/50"
                    }`}
                    onClick={() => setSelectedIssue(item)}
                  >
                    <td className="p-3">
                      <span className="font-bold text-white block">{item.municipalityName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.voivodeship}</span>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-200 block truncate max-w-[200px]">
                        {item.entityName}
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono">
                        {item.countyWorkforceSharePercent}% rynku pracy
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${typeInfo.color}`}>
                        {typeInfo.text}
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-amber-400">
                      {item.financialImpactMlnPln.toFixed(1)} mln zł
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          item.status === "otwarty_spór"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : item.status === "negocjacje"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Szczegółowa fiszka wybranej sprawy samorządowej */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400 block">
                  Dossier samorządowe MAP
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedIssue.municipalityName}</h4>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${getTypeLabel(selectedIssue.issueType).color}`}>
                {getTypeLabel(selectedIssue.issueType).text}
              </span>
            </div>

            <div className="my-3 space-y-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Podmiot zaangażowany</span>
                <span className="font-semibold text-white block mt-0.5">{selectedIssue.entityName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Roszczenie finansowe</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {selectedIssue.financialImpactMlnPln.toFixed(1)} mln PLN
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Wpływ na zatrudnienie</span>
                  <span className="font-mono font-bold text-blue-400 text-sm">
                    {selectedIssue.countyWorkforceSharePercent}% w powiecie
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Opis i istota sporu:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedIssue.description}</p>
              </div>

              <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-lg text-amber-200">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
                  Rekomendacja dla Ministra przed wizytą w regionie:
                </span>
                <p className="text-xs leading-relaxed text-amber-100">
                  Podkreślać kluczowe znaczenie zakładu dla miejsc pracy w powiecie. Zaproponować powołanie wspólnego
                  zespołu roboczego z udziałem wojewody i prezydenta miasta, unikając obietnic budżetowych przed audytem prawnym.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
            <span>Relacje samorządowe i dialog społeczny</span>
            <button
              type="button"
              onClick={() => onSelectEntity && onSelectEntity(selectedIssue.entityId)}
              className="text-blue-400 hover:underline font-medium"
            >
              Otwórz Dossier podmiotu &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
