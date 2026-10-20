"use client";

import React, { useState } from "react";
import { REPUTATION_WATERFALL_STEPS } from "@/lib/mapscope-data";
import { ReputationWaterfallStep } from "@/lib/types";

export function ReputationWaterfallChart() {
  const [selectedStep, setSelectedStep] = useState<ReputationWaterfallStep>(
    REPUTATION_WATERFALL_STEPS[REPUTATION_WATERFALL_STEPS.length - 1]
  );
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const steps = REPUTATION_WATERFALL_STEPS;

  // Wymiary SVG
  const width = 760;
  const height = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxVal = 80;
  const minVal = 20;

  const yScale = (val: number) => {
    return padding.top + innerHeight - ((val - minVal) / (maxVal - minVal)) * innerHeight;
  };

  const colWidth = innerWidth / steps.length;
  const barWidth = colWidth * 0.65;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Wodospad wizerunkowy MAP: bilans zysków i strat sentymentu
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Wpływ poszczególnych kryzysów w spółkach oraz skuteczność interwencji naprawczych kierownictwa resortu
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Wskaźnik wyjściowy</span>
            <span className="text-slate-300 font-bold text-sm">64 pkt</span>
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Bilans bieżący</span>
            <span className="text-emerald-400 font-bold text-sm">68 pkt (+4 pkt)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Wykres Waterfall SVG */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[620px] h-auto drop-shadow-md">
            {/* Poziome linie pomocnicze */}
            {[30, 40, 50, 60, 70].map((v) => (
              <g key={v}>
                <line
                  x1={padding.left}
                  y1={yScale(v)}
                  x2={padding.left + innerWidth}
                  y2={yScale(v)}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                <text x={padding.left - 8} y={yScale(v) + 4} textAnchor="end" fill="#64748b" fontSize="9" className="font-mono">
                  {v} pkt
                </text>
              </g>
            ))}

            {/* Słupki kaskadowe */}
            {steps.map((step, i) => {
              const x = padding.left + i * colWidth + (colWidth - barWidth) / 2;
              const isSelected = selectedStep.id === step.id;
              const isHovered = hoveredStep === step.id;

              let barTop = 0;
              let barHeight = 0;
              let barColor = "#3b82f6"; // domyślny niebieski

              if (step.category === "baseline" || step.category === "net_total") {
                barTop = yScale(step.cumulative);
                barHeight = yScale(minVal) - barTop;
                barColor = step.category === "baseline" ? "#3b82f6" : "#10b981";
              } else if (step.category === "negative_event") {
                const prev = steps[i - 1].cumulative;
                barTop = yScale(prev);
                barHeight = yScale(step.cumulative) - barTop;
                barColor = "#ef4444";
              } else if (step.category === "positive_intervention") {
                const prev = steps[i - 1].cumulative;
                barTop = yScale(step.cumulative);
                barHeight = yScale(prev) - barTop;
                barColor = "#22c55e";
              }

              return (
                <g
                  key={step.id}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  onClick={() => setSelectedStep(step)}
                >
                  {/* Słupek */}
                  <rect
                    x={x}
                    y={barTop}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    rx={3}
                    fill={barColor}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.7}
                    stroke={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : barColor}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Wartość delty nad/pod słupkiem */}
                  <text
                    x={x + barWidth / 2}
                    y={barTop - 6}
                    textAnchor="middle"
                    fill={barColor}
                    fontSize="10"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {step.delta > 0 ? `+${step.delta}` : step.delta < 0 ? step.delta : `${step.cumulative} pkt`}
                  </text>

                  {/* Etykieta na osi X */}
                  <text
                    x={x + barWidth / 2}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    fill={isSelected ? "#ffffff" : "#94a3b8"}
                    fontSize="8.5"
                    fontWeight={isSelected ? "bold" : "500"}
                  >
                    {step.label.split(":")[0].substring(0, 12)}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={height - padding.bottom + 30}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="8"
                    className="font-mono"
                  >
                    {step.date.slice(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel boczny ze szczegółami wybranego kroku wodospadu */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-400">
                  Etap weryfikacji wizerunkowej
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedStep.label}</h4>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded font-bold font-mono ${
                  selectedStep.delta > 0
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : selectedStep.delta < 0
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                }`}
              >
                {selectedStep.delta > 0 ? `+${selectedStep.delta} pkt` : selectedStep.delta < 0 ? `${selectedStep.delta} pkt` : "SUMA"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Poziom kumulacyjny</span>
                <span className="text-xl font-bold font-mono text-white">{selectedStep.cumulative} pkt</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Data zdarzenia</span>
                <span className="text-sm font-bold font-mono text-slate-300">{selectedStep.date}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="block text-slate-200 mb-1">Opis incydentu / interwencji:</strong>
              {selectedStep.description}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
            <span>Metryka reputacji kwartalnej</span>
            <span className="font-mono">MAP-SENTIMENT-Q3/Q4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
