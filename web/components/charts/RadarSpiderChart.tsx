"use client";

import React from "react";
import { RadarSpiderMetrics } from "@/lib/types";
import { RADAR_SPIDER_PROFILES } from "@/lib/mapscope-data";

interface RadarSpiderChartProps {
  metrics?: RadarSpiderMetrics;
  entityId?: string;
}

export function RadarSpiderChart({ metrics, entityId }: RadarSpiderChartProps) {
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
    { label: "Ład korporacyjny (Art. 19)", value: activeMetrics.governanceScore, key: "gov" },
    { label: "Dyscyplina komunikacyjna", value: activeMetrics.communicationScore, key: "comm" },
    { label: "Płynność i EBITDA", value: activeMetrics.financeScore, key: "fin" },
    { label: "Terminowość CAPEX", value: activeMetrics.capexScore, key: "cap" },
    { label: "Dialog społeczny", value: activeMetrics.socialScore, key: "soc" },
    { label: "Czystość kontrolna (NIK)", value: activeMetrics.auditScore, key: "aud" },
  ];

  // Geometria radaru SVG
  const size = 340;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / axes.length;

  // Punkty siatki koncentrycznej (poziomy 20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueNormalized;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Ścieżka wypełnienia danych
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Audyt 360° dojrzałości zarządczej
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">Sześcioosiowy radar ryzyka spółki</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${badge.bg}`}>{badge.text}</span>
          <span className="text-sm font-bold font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {activeMetrics.aggregateMaturity.toFixed(1)} / 100
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center my-3 relative">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[300px] h-auto drop-shadow-md">
          {/* Koncentryczne pierścienie siatki */}
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
                strokeDasharray={lvlIdx === levels.length - 1 ? undefined : "2 2"}
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
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Punkty wierzchołków z etykietami */}
          {dataPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#ffffff"
              stroke={badge.color}
              strokeWidth="2"
            />
          ))}

          {/* Podpisy osi na obwodzie */}
          {axes.map((axis, i) => {
            const labelPt = getCoordinates(1.22, i);
            return (
              <text
                key={i}
                x={labelPt.x}
                y={labelPt.y + 4}
                textAnchor="middle"
                fill="#cbd5e1"
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

      {/* Tabela odczytu szczegółowego */}
      <div className="grid grid-cols-3 gap-2 text-[10px] pt-3 border-t border-slate-800">
        {axes.map((axis, i) => (
          <div key={i} className="bg-slate-950 p-1.5 rounded border border-slate-800/80">
            <span className="text-slate-400 block truncate">{axis.label}</span>
            <span
              className={`font-mono font-bold text-xs ${
                axis.value < 40 ? "text-red-400" : axis.value < 70 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {axis.value} pkt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
