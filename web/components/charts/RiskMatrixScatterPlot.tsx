"use client";

import React, { useState } from "react";
import { RISK_MATRIX_SCATTER_POINTS } from "@/lib/mapscope-data";
import { RiskMatrixScatterPoint } from "@/lib/types";

interface RiskMatrixScatterPlotProps {
  onSelectPoint?: (point: RiskMatrixScatterPoint) => void;
}

export function RiskMatrixScatterPlot({ onSelectPoint }: RiskMatrixScatterPlotProps) {
  const [selectedPoint, setSelectedPoint] = useState<RiskMatrixScatterPoint>(RISK_MATRIX_SCATTER_POINTS[0]);
  const [hoveredPoint, setHoveredPoint] = useState<RiskMatrixScatterPoint | null>(null);

  const getCategoryColor = (cat: RiskMatrixScatterPoint["category"]) => {
    switch (cat) {
      case "spór_społeczny":
        return "#ef4444"; // Czerwony
      case "finanse":
        return "#f59e0b"; // Bursztynowy
      case "kadry":
        return "#8b5cf6"; // Fioletowy
      case "awaria":
        return "#06b6d4"; // Błękitny
      case "regulacje":
        return "#ec4899"; // Różowy
      default:
        return "#3b82f6";
    }
  };

  const handlePointClick = (pt: RiskMatrixScatterPoint) => {
    setSelectedPoint(pt);
    if (onSelectPoint) {
      onSelectPoint(pt);
    }
  };

  // Wymiary wykresu SVG
  const width = 640;
  const height = 440;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xScale = (prob: number) => padding.left + (prob / 100) * innerWidth;
  const yScale = (impact: number) => padding.top + innerHeight - (impact / 100) * innerHeight;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Kwadrantowa macierz ryzyka właścicielskiego 2D
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pozycjonowanie spółek według prawdopodobieństwa eskalacji kryzysu oraz bezpośredniego wpływu na MAP i KPRM
          </p>
        </div>

        {/* Legenda kategorii */}
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Spór społeczny
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Finanse i płynność
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Kadry i konkursy
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Awarie i infrastruktura
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Wykres Scatter SVG */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-lg">
            {/* Tło kwadrantów */}
            {/* Prawy Górny - Czerwona Strefa KPRM */}
            <rect
              x={padding.left + innerWidth / 2}
              y={padding.top}
              width={innerWidth / 2}
              height={innerHeight / 2}
              fill="#ef4444"
              fillOpacity="0.08"
            />
            {/* Lewy Górny - Ryzyko wizerunkowe */}
            <rect
              x={padding.left}
              y={padding.top}
              width={innerWidth / 2}
              height={innerHeight / 2}
              fill="#f59e0b"
              fillOpacity="0.05"
            />
            {/* Prawy Dolny - Konflikty operacyjne */}
            <rect
              x={padding.left + innerWidth / 2}
              y={padding.top + innerHeight / 2}
              width={innerWidth / 2}
              height={innerHeight / 2}
              fill="#3b82f6"
              fillOpacity="0.04"
            />
            {/* Lewy Dolny - Stabilny monitoring */}
            <rect
              x={padding.left}
              y={padding.top + innerHeight / 2}
              width={innerWidth / 2}
              height={innerHeight / 2}
              fill="#10b981"
              fillOpacity="0.03"
            />

            {/* Osie siatki */}
            <line
              x1={padding.left + innerWidth / 2}
              y1={padding.top}
              x2={padding.left + innerWidth / 2}
              y2={padding.top + innerHeight}
              stroke="#475569"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top + innerHeight / 2}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight / 2}
              stroke="#475569"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Oś X i Y */}
            <line
              x1={padding.left}
              y1={padding.top + innerHeight}
              x2={padding.left + innerWidth}
              y2={padding.top + innerHeight}
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + innerHeight}
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* Etykiety osi */}
            <text
              x={padding.left + innerWidth / 2}
              y={height - 12}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="600"
            >
              Prawdopodobieństwo wybuchu / eskalacji kryzysu (0% → 100%)
            </text>
            <text
              transform={`rotate(-90)`}
              x={-(padding.top + innerHeight / 2)}
              y={18}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="600"
            >
              Wpływ polityczny na MAP i Rząd (0% → 100%)
            </text>

            {/* Podpisy kwadrantów */}
            <text
              x={padding.left + innerWidth - 10}
              y={padding.top + 20}
              textAnchor="end"
              fill="#f87171"
              fontSize="10"
              fontWeight="bold"
              className="tracking-wider uppercase"
            >
              Czerwona strefa KPRM
            </text>
            <text
              x={padding.left + 10}
              y={padding.top + 20}
              textAnchor="start"
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              className="tracking-wider uppercase"
            >
              Ryzyko wizerunkowe / rezerwa
            </text>
            <text
              x={padding.left + innerWidth - 10}
              y={padding.top + innerHeight - 10}
              textAnchor="end"
              fill="#93c5fd"
              fontSize="10"
              fontWeight="bold"
              className="tracking-wider uppercase"
            >
              Konflikty operacyjne
            </text>
            <text
              x={padding.left + 10}
              y={padding.top + innerHeight - 10}
              textAnchor="start"
              fill="#6ee7b7"
              fontSize="10"
              fontWeight="bold"
              className="tracking-wider uppercase"
            >
              Stabilny monitoring
            </text>

            {/* Punkty bąbelkowe spółek */}
            {RISK_MATRIX_SCATTER_POINTS.map((pt) => {
              const cx = xScale(pt.probability);
              const cy = yScale(pt.ministerImpact);
              const r = 8 + (pt.workforceOrAssetsWeight / 50) * 12;
              const isSelected = selectedPoint.id === pt.id;
              const isHovered = hoveredPoint?.id === pt.id;
              const color = getCategoryColor(pt.category);

              return (
                <g key={pt.id} className="cursor-pointer transition-all duration-150">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? r + 3 : isHovered ? r + 2 : r}
                    fill={color}
                    fillOpacity={isSelected ? 0.9 : 0.65}
                    stroke={isSelected ? "#ffffff" : isHovered ? "#cbd5e1" : color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => handlePointClick(pt)}
                  />
                  <text
                    x={cx}
                    y={cy - r - 4}
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#cbd5e1"}
                    fontSize="9"
                    fontWeight={isSelected ? "bold" : "500"}
                    className="pointer-events-none drop-shadow"
                  >
                    {pt.tickerOrAlias}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Fiszka analityczna wybranej spółki z kwadrantu */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-red-400">
                  Ocena ryzyka w kwadrancie
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">{selectedPoint.entityName}</h4>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded font-bold uppercase"
                style={{
                  backgroundColor: `${getCategoryColor(selectedPoint.category)}20`,
                  color: getCategoryColor(selectedPoint.category),
                  border: `1px solid ${getCategoryColor(selectedPoint.category)}60`,
                }}
              >
                {selectedPoint.category.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Prawdopodobieństwo</span>
                <span className="text-xl font-bold font-mono text-red-400">{selectedPoint.probability}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block uppercase">Wpływ na MAP</span>
                <span className="text-xl font-bold font-mono text-amber-400">{selectedPoint.ministerImpact}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Sektor i kwalifikacja kwadrantu
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded border border-slate-700/60 font-medium">
                    {selectedPoint.sector}
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700/60 font-mono">
                    {selectedPoint.quadrant.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Istota zagrożenia właścicielskiego
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                  {selectedPoint.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
            <span>Kliknij bąbel na wykresie, aby przełączyć analizę</span>
            <span className="font-mono text-slate-500">{selectedPoint.tickerOrAlias}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
