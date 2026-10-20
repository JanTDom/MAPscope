"use client";

import React, { useState } from "react";
import { RadarSpiderMetrics } from "@/lib/types";
import { RADAR_SPIDER_PROFILES } from "@/lib/mapscope-data";
import { BarChart3, Hexagon, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";

interface RadarSpiderChartProps {
  metrics?: RadarSpiderMetrics;
  entityId?: string;
}

export function RadarSpiderChart({ metrics, entityId }: RadarSpiderChartProps) {
  const [viewMode, setViewMode] = useState<"pillars" | "polygon">("pillars");

  // Pobieranie profilu lub profilu domyślnego
  const activeMetrics: RadarSpiderMetrics =
    metrics ||
    (entityId && RADAR_SPIDER_PROFILES[entityId]) || {
      entityId: entityId || "unknown",
      governanceScore: 75,
      communicationScore: 70,
      financeScore: 65,
      capexScore: 60,
      socialScore: 68,
      auditScore: 72,
      aggregateMaturity: 68.3,
      status: "bezpieczna",
    };

  const axes = [
    {
      label: "Ład korporacyjny (Art. 19)",
      value: activeMetrics.governanceScore,
      key: "gov",
      desc: "Zgodność składu RN i procedur nominacyjnych",
    },
    {
      label: "Dyscyplina komunikacyjna",
      value: activeMetrics.communicationScore,
      key: "comm",
      desc: "Spójność z polityką właścicielską rządu",
    },
    {
      label: "Płynność i EBITDA",
      value: activeMetrics.financeScore,
      key: "fin",
      desc: "Obsługa zadłużenia i zdolność dywidendowa",
    },
    {
      label: "Terminowość CAPEX",
      value: activeMetrics.capexScore,
      key: "cap",
      desc: "Realizacja inwestycji strategicznych w terminie",
    },
    {
      label: "Dialog społeczny",
      value: activeMetrics.socialScore,
      key: "soc",
      desc: "Relacje ze związkami i ryzyko strajkowe",
    },
    {
      label: "Czystość kontrolna (NIK)",
      value: activeMetrics.auditScore,
      key: "aud",
      desc: "Zalecenia pokontrolne NIK, KAS i prokuratury",
    },
  ];

  // Geometria dla opcjonalnego widoku wielokątnego
  const size = 320;
  const center = size / 2;
  const radius = size * 0.36;
  const angleStep = (2 * Math.PI) / axes.length;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueNormalized;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = axes.map((axis, i) => getCoordinates(axis.value / 100, i));
  const polygonPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const getStatusBadge = () => {
    switch (activeMetrics.status) {
      case "alarmowa":
        return {
          text: "Stan alarmowy",
          bg: "bg-red-500/20 text-red-400 border border-red-500/40",
          color: "#ef4444",
        };
      case "wymaga_nadzoru":
        return {
          text: "Wymaga nadzoru",
          bg: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
          color: "#f59e0b",
        };
      case "bezpieczna":
      default:
        return {
          text: "Dojrzałość stabilna",
          bg: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
          color: "#10b981",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-[#0b1016] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
      {/* Nagłówek panelu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
            Audyt 360° Dojrzałości Zarządczej Spółki
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">Sześciofilarowy wskaźnik ryzyka korporacyjnego</h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Przełącznik widoku: Słupkowy Filarowy vs Wielokątny */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("pillars")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === "pillars"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Czytelny widok wskaźników filarowych"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Wskaźniki filarowe</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("polygon")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === "polygon"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Widok wielokątny"
            >
              <Hexagon className="w-3.5 h-3.5" />
              <span>Wielokąt</span>
            </button>
          </div>

          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${badge.bg}`}>{badge.text}</span>
          <span className="text-sm font-bold font-mono text-white bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
            {activeMetrics.aggregateMaturity.toFixed(1)} / 100
          </span>
        </div>
      </div>

      {/* GŁÓWNY WIDOK: CZYTELNE WSKAŹNIKI FILAROWE (BEZ ŻADNYCH KÓŁEK) */}
      {viewMode === "pillars" ? (
        <div className="space-y-3.5 my-4">
          {axes.map((axis, i) => {
            const isCritical = axis.value < 40;
            const isWarning = axis.value >= 40 && axis.value < 70;
            const barColor = isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
            const textColor = isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400";
            const statusText = isCritical ? "Krytyczny" : isWarning ? "Podwyższone ryzyko" : "Wzorcowy";

            return (
              <div key={i} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{axis.label}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">• {axis.desc}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${textColor} bg-slate-900 border border-slate-800`}>
                      {statusText}
                    </span>
                    <span className={`text-xs font-bold ${textColor}`}>
                      {axis.value} <span className="text-[10px] text-slate-500">/ 100</span>
                    </span>
                  </div>
                </div>

                {/* Pasek postępu ze wskaźnikiem średniej resortowej (60 pkt) */}
                <div className="relative w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  {/* Linia referencyjna 60 pkt */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-slate-600 z-10" title="Średnia MAP: 60 pkt" />
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${axis.value}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono">
            <span>Pionowa kreska na pasku oznacza poziom referencyjny MAP (60 pkt)</span>
            <span>Skala: 0 (zapaść) → 100 (wzorzec)</span>
          </div>
        </div>
      ) : (
        /* WIDOK WIELOKĄTNY (BEZ ŻADNYCH KÓŁEK - PROSTOKĄTNE ZNACZNIKI I PEŁNE ETYKIETY) */
        <div className="flex flex-col items-center justify-center my-3 relative">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] h-auto drop-shadow-md">
            {/* Siatka wielokątów referencyjnych */}
            {levels.map((level, lvlIdx) => {
              const levelPoints = axes
                .map((_, i) => {
                  const pt = getCoordinates(level, i);
                  return `${pt.x},${pt.y}`;
                })
                .join(" ");

              return (
                <polygon
                  key={lvlIdx}
                  points={levelPoints}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx === levels.length - 1 ? undefined : "3 3"}
                />
              );
            })}

            {/* Linie promieniowe osi */}
            {axes.map((_, i) => {
              const edgePt = getCoordinates(1.0, i);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={edgePt.x}
                  y2={edgePt.y}
                  stroke="#475569"
                  strokeWidth="1"
                />
              );
            })}

            {/* Wypełniony poligon danych podmiotu */}
            <polygon
              points={polygonPath}
              fill={badge.color}
              fillOpacity="0.25"
              stroke={badge.color}
              strokeWidth="2"
              className="transition-all duration-300"
            />

            {/* Wierzchołki jako mikro-plakietki prostokątne zamiast kółek */}
            {dataPoints.map((pt, i) => (
              <rect
                key={i}
                x={pt.x - 3}
                y={pt.y - 3}
                width={6}
                height={6}
                rx={1}
                fill="#ffffff"
                stroke={badge.color}
                strokeWidth="1.5"
              />
            ))}

            {/* Podpisy osi z wartością */}
            {axes.map((axis, i) => {
              const labelPt = getCoordinates(1.22, i);
              return (
                <text
                  key={i}
                  x={labelPt.x}
                  y={labelPt.y + 4}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="9"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow"
                >
                  {axis.label.split(" ")[0]} ({axis.value})
                </text>
              );
            })}
          </svg>
        </div>
      )}

      {/* Tabela odczytu syntetycznego */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] pt-3 border-t border-slate-800">
        {axes.map((axis, i) => (
          <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800/80">
            <span className="text-slate-400 block truncate">{axis.label}</span>
            <div className="flex items-center justify-between mt-0.5">
              <span
                className={`font-mono font-bold text-xs ${
                  axis.value < 40 ? "text-red-400" : axis.value < 70 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {axis.value} pkt
              </span>
              <span className="text-[9px] text-slate-500">
                {axis.value >= 70 ? "Stabilnie" : axis.value >= 40 ? "Uwaga" : "Alert"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
