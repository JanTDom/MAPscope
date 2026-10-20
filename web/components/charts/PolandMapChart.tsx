"use client";

import React, { useState } from "react";
import { VOIVODESHIP_REGIONAL_DATA } from "@/lib/mapscope-data";
import { VoivodeshipRegionalData } from "@/lib/types";

interface PolandMapChartProps {
  onSelectVoivodeship?: (voivodeship: VoivodeshipRegionalData) => void;
  selectedId?: string;
}

export function PolandMapChart({ onSelectVoivodeship, selectedId }: PolandMapChartProps) {
  const [hoveredVoivodeship, setHoveredVoivodeship] = useState<VoivodeshipRegionalData | null>(null);
  const [activeVoivodeship, setActiveVoivodeship] = useState<VoivodeshipRegionalData>(
    VOIVODESHIP_REGIONAL_DATA.find((v) => v.id === selectedId) || VOIVODESHIP_REGIONAL_DATA[0]
  );

  const handleSelect = (v: VoivodeshipRegionalData) => {
    setActiveVoivodeship(v);
    if (onSelectVoivodeship) {
      onSelectVoivodeship(v);
    }
  };

  const getStatusColor = (status: VoivodeshipRegionalData["riskStatus"], isSelected: boolean) => {
    if (isSelected) return "#3b82f6"; // Niebieski akcent wyboru
    switch (status) {
      case "krytyczny":
        return "#ef4444";
      case "podwyższone_ryzyko":
        return "#f59e0b";
      case "stabilny":
      default:
        return "#10b981";
    }
  };

  const totalWorkforce = VOIVODESHIP_REGIONAL_DATA.reduce((acc, v) => acc + v.workforceCount, 0);
  const totalStrikes = VOIVODESHIP_REGIONAL_DATA.reduce((acc, v) => acc + v.strikeAlertsCount, 0);
  const totalLiquidations = VOIVODESHIP_REGIONAL_DATA.reduce((acc, v) => acc + v.liquidationSitesCount, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Geolokalizacja aktywów państwowych i napięć regionalnych (16 województw)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rozmieszczenie 406 spółek Skarbu Państwa, ognisk strajkowych oraz majątku w uśpionej likwidacji
          </p>
        </div>

        {/* Zagregowane KPI regionalne */}
        <div className="flex items-center gap-6 text-xs">
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Zatrudnienie w SSP</span>
            <span className="text-white font-bold font-mono text-sm">{totalWorkforce.toLocaleString("pl-PL")} os.</span>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Aktywne spory zbiorowe</span>
            <span className="text-red-400 font-bold font-mono text-sm">{totalStrikes} ognisk</span>
          </div>
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase">Uśpione likwidacje</span>
            <span className="text-amber-400 font-bold font-mono text-sm">{totalLiquidations} lokalizacji</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Wektorowy kartogram SVG z autentycznymi granicami administracyjnymi */}
        <div className="lg:col-span-7 relative flex justify-center items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/70 overflow-hidden">
          <svg viewBox="0 0 615 580" className="w-full max-w-[540px] h-auto drop-shadow-2xl">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Granice i kształty województw */}
            {VOIVODESHIP_REGIONAL_DATA.map((v) => {
              const isSelected = activeVoivodeship.id === v.id;
              const isHovered = hoveredVoivodeship?.id === v.id;
              const fillColor = getStatusColor(v.riskStatus, isSelected);

              return (
                <g key={v.id} className="cursor-pointer transition-all duration-200">
                  <path
                    d={v.pathData}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.85 : isHovered ? 0.75 : 0.45}
                    stroke={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : "#334155"}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    onMouseEnter={() => setHoveredVoivodeship(v)}
                    onMouseLeave={() => setHoveredVoivodeship(null)}
                    onClick={() => handleSelect(v)}
                    className="hover:scale-[1.01] transform-origin-center transition-transform"
                  />
                  {/* Etykieta liczbowa na środku województwa */}
                  <circle
                    cx={v.center[0]}
                    cy={v.center[1]}
                    r={isSelected ? 14 : 11}
                    fill="#0f172a"
                    stroke={fillColor}
                    strokeWidth={2}
                    className="pointer-events-none"
                  />
                  <text
                    x={v.center[0]}
                    y={v.center[1] + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isSelected ? 11 : 9}
                    fontWeight="bold"
                    className="pointer-events-none font-mono"
                  >
                    {v.entitiesCount}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legenda statusu */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Stan krytyczny (strajki / likwidacje)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Podwyższone ryzyko społeczne</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Sytuacja stabilna</span>
            </div>
          </div>
        </div>

        {/* Szczegółowa fiszka wybranego województwa */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400">
                  Dossier terytorialne MAP
                </span>
                <h4 className="text-xl font-bold text-white mt-0.5">Województwo {activeVoivodeship.name}</h4>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                  activeVoivodeship.riskStatus === "krytyczny"
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : activeVoivodeship.riskStatus === "podwyższone_ryzyko"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {activeVoivodeship.riskStatus.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Podmioty z udziałem SP</span>
                <span className="text-lg font-bold font-mono text-white">{activeVoivodeship.entitiesCount}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Łączne zatrudnienie</span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {activeVoivodeship.workforceCount.toLocaleString("pl-PL")}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Ogniska sporów zbiorowych</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    activeVoivodeship.strikeAlertsCount > 0 ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  {activeVoivodeship.strikeAlertsCount}
                </span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Uśpione likwidacje</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    activeVoivodeship.liquidationSitesCount > 5 ? "text-amber-400" : "text-slate-300"
                  }`}
                >
                  {activeVoivodeship.liquidationSitesCount}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Kluczowe aktywa i spółki flagowe
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeVoivodeship.keyFlagships.map((f, i) => (
                    <span
                      key={i}
                      className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700/60 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Główny problem społeczno-właścicielski
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  {activeVoivodeship.primaryRegionalIssue}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <span>Dotknij dowolnego regionu, aby zaktualizować dane</span>
            <span className="font-mono text-slate-500">ID: {activeVoivodeship.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
