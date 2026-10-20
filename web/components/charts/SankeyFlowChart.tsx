"use client";

import React, { useState } from "react";
import { SANKEY_FLOW_DATA } from "@/lib/mapscope-data";
import { SankeyFlowNode, SankeyFlowLink } from "@/lib/types";

export function SankeyFlowChart() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { nodes, links } = SANKEY_FLOW_DATA;

  // Wymiary SVG
  const width = 840;
  const height = 400;
  const colX = [60, 360, 680];
  const nodeWidth = 24;

  // Pozycjonowanie węzłów w pionie
  const nodeY: Record<string, { y: number; h: number }> = {
    total_profit: { y: 60, h: 260 },
    capex: { y: 40, h: 105 },
    reserves: { y: 160, h: 75 },
    dividend_gross: { y: 250, h: 75 },
    state_budget: { y: 230, h: 58 },
    map_fund: { y: 300, h: 18 },
    minority: { y: 330, h: 12 },
  };

  // Obliczanie ścieżek wstęg Beziera
  const getRibbonPath = (link: SankeyFlowLink) => {
    const srcNode = nodes.find((n) => n.id === link.source)!;
    const tgtNode = nodes.find((n) => n.id === link.target)!;
    const srcPos = nodeY[link.source];
    const tgtPos = nodeY[link.target];

    const x0 = colX[srcNode.column] + nodeWidth;
    const x1 = colX[tgtNode.column];

    let y0_top = srcPos.y;
    let y0_bot = srcPos.y + srcPos.h;

    // Przesunięcia dla wielokrotnych odgałęzień
    if (link.source === "total_profit") {
      if (link.target === "capex") {
        y0_top = srcPos.y;
        y0_bot = srcPos.y + 110;
      } else if (link.target === "reserves") {
        y0_top = srcPos.y + 110;
        y0_bot = srcPos.y + 185;
      } else if (link.target === "dividend_gross") {
        y0_top = srcPos.y + 185;
        y0_bot = srcPos.y + 260;
      }
    } else if (link.source === "dividend_gross") {
      if (link.target === "state_budget") {
        y0_top = srcPos.y;
        y0_bot = srcPos.y + 55;
      } else if (link.target === "map_fund") {
        y0_top = srcPos.y + 55;
        y0_bot = srcPos.y + 68;
      } else if (link.target === "minority") {
        y0_top = srcPos.y + 68;
        y0_bot = srcPos.y + 75;
      }
    }

    const y1_top = tgtPos.y;
    const y1_bot = tgtPos.y + tgtPos.h;

    const dx = (x1 - x0) * 0.5;

    return `
      M ${x0} ${y0_top}
      C ${x0 + dx} ${y0_top}, ${x1 - dx} ${y1_top}, ${x1} ${y1_top}
      L ${x1} ${y1_bot}
      C ${x1 - dx} ${y1_bot}, ${x0 + dx} ${y0_bot}, ${x0} ${y0_bot}
      Z
    `;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Diagram Sankeya: przepływ zysków i strumieni dywidendowych do budżetu
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Od zagregowanego zysku netto 406 spółek SSP, przez inwestycje strategiczne i rezerwy, po dochody budżetowe państwa
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Zysk netto 406 SSP</span>
            <span className="text-blue-400 font-bold text-sm">18,40 mld PLN</span>
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Dochód Budżetu Państwa</span>
            <span className="text-emerald-400 font-bold text-sm">4,12 mld PLN</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[700px] h-auto drop-shadow-md">
          {/* Etykiety kolumn */}
          <text x={colX[0]} y={25} fill="#94a3b8" fontSize="11" fontWeight="bold" className="uppercase tracking-wider">
            I. Wynik finansowy netto
          </text>
          <text x={colX[1]} y={25} fill="#94a3b8" fontSize="11" fontWeight="bold" className="uppercase tracking-wider">
            II. Alokacja zarządcza spółek
          </text>
          <text x={colX[2]} y={25} fill="#94a3b8" fontSize="11" fontWeight="bold" className="uppercase tracking-wider">
            III. Beneficjent końcowy dywidend
          </text>

          {/* Wstęgi przepływów (Links) */}
          {links.map((link, idx) => {
            const isHovered =
              hoveredLink === `${link.source}-${link.target}` ||
              hoveredNode === link.source ||
              hoveredNode === link.target;

            return (
              <g key={idx}>
                <path
                  d={getRibbonPath(link)}
                  fill={link.color || "rgba(100, 116, 139, 0.4)"}
                  fillOpacity={isHovered ? 0.8 : 0.4}
                  stroke="#1e293b"
                  strokeWidth="0.5"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredLink(`${link.source}-${link.target}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              </g>
            );
          })}

          {/* Słupki węzłów (Nodes) */}
          {nodes.map((node) => {
            const pos = nodeY[node.id];
            const isHovered = hoveredNode === node.id;
            const x = colX[node.column];

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Prostokąt węzła */}
                <rect
                  x={x}
                  y={pos.y}
                  width={nodeWidth}
                  height={pos.h}
                  rx={3}
                  fill={node.color}
                  stroke={isHovered ? "#ffffff" : "#0f172a"}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-150 drop-shadow"
                />

                {/* Etykieta tekstowa */}
                <text
                  x={node.column === 0 ? x + nodeWidth + 12 : node.column === 1 ? x + nodeWidth + 10 : x - 12}
                  y={pos.y + Math.min(pos.h / 2, 20) + 4}
                  textAnchor={node.column === 2 ? "end" : "start"}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                <text
                  x={node.column === 0 ? x + nodeWidth + 12 : node.column === 1 ? x + nodeWidth + 10 : x - 12}
                  y={pos.y + Math.min(pos.h / 2, 20) + 18}
                  textAnchor={node.column === 2 ? "end" : "start"}
                  fill={node.color}
                  fontSize="11"
                  fontWeight="bold"
                  className="font-mono"
                >
                  {node.value.toFixed(2)} mld PLN
                </text>
                {node.subtext && (
                  <text
                    x={node.column === 0 ? x + nodeWidth + 12 : node.column === 1 ? x + nodeWidth + 10 : x - 12}
                    y={pos.y + Math.min(pos.h / 2, 20) + 30}
                    textAnchor={node.column === 2 ? "end" : "start"}
                    fill="#94a3b8"
                    fontSize="9.5"
                  >
                    {node.subtext}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800 pt-3">
        <span>Najedź na wstęgę lub węzeł, aby podświetlić relację kapitałową</span>
        <span className="font-mono text-slate-500">Źródło: Raporty okresowe SSP / Wykonanie Budżetu 2026</span>
      </div>
    </div>
  );
}
