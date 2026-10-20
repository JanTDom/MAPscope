"use client";

import React, { useState } from "react";
import { GOVERNANCE_NETWORK_DATA } from "@/lib/mapscope-data";
import { GovernanceNetworkNode, GovernanceNetworkEdge } from "@/lib/types";

export function GovernanceNetworkGraph() {
  const [selectedNode, setSelectedNode] = useState<GovernanceNetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { nodes, edges } = GOVERNANCE_NETWORK_DATA;

  // Koordynaty 2D węzłów w widoku SVG
  const nodePositions: Record<string, { x: number; y: number }> = {
    // Spółki (lewa/środkowa kolumna)
    "comp-orlen": { x: 140, y: 110 },
    "comp-energa": { x: 140, y: 220 },
    "comp-pkp-cargo": { x: 140, y: 330 },
    "comp-poczta": { x: 420, y: 330 },
    "comp-pgz": { x: 420, y: 110 },
    // Osoby (prawa/środkowa kolumna)
    "pers-1": { x: 280, y: 70 },
    "pers-2": { x: 280, y: 160 },
    "pers-3": { x: 280, y: 270 },
    "pers-4": { x: 420, y: 240 },
    "pers-5": { x: 280, y: 220 },
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Graf powiązań personalnych rad nadzorczych i unii holdingowych
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weryfikacja wieloetatowości w organach nadzorczych (Art. 19a) oraz powiązań między spółką dominującą a córkami
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded bg-blue-600 border border-blue-400" /> Spółka Skarbu Państwa
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> Członek RN (zgodny z ustawą)
          </span>
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" /> Ryzyko Art. 19a (&gt;1 rada SP)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Obszar rysowania grafu SVG */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80 relative overflow-hidden">
          <svg viewBox="0 0 560 400" className="w-full h-auto drop-shadow-md">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
              </marker>
            </defs>

            {/* Krawędzie łączące osoby i spółki */}
            {edges.map((edge, i) => {
              const p1 = nodePositions[edge.source];
              const p2 = nodePositions[edge.target];
              if (!p1 || !p2) return null;

              const isHighlighted =
                hoveredNode === edge.source || hoveredNode === edge.target || selectedNode?.id === edge.source;

              return (
                <g key={i}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={edge.source === "pers-2" ? "#ef4444" : isHighlighted ? "#60a5fa" : "#334155"}
                    strokeWidth={isHighlighted ? 2.5 : edge.source === "pers-2" ? 2 : 1.2}
                    strokeDasharray={edge.isHoldingTie ? "4 4" : undefined}
                    className="transition-all duration-150"
                  />
                </g>
              );
            })}

            {/* Węzły */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isPerson = node.type === "person";
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                >
                  {isPerson ? (
                    <>
                      {/* Bąbel osoby */}
                      {node.art19ViolationRisk && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={18}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ animationDuration: "6s" }}
                        />
                      )}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={12}
                        fill={node.art19ViolationRisk ? "#ef4444" : "#10b981"}
                        stroke={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : "#0f172a"}
                        strokeWidth={isSelected ? 3 : 1.5}
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 16}
                        textAnchor="middle"
                        fill={node.art19ViolationRisk ? "#fca5a5" : "#e2e8f0"}
                        fontSize="9.5"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow"
                      >
                        {node.label}
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Prostokąt spółki */}
                      <rect
                        x={pos.x - 55}
                        y={pos.y - 14}
                        width={110}
                        height={28}
                        rx={4}
                        fill="#1e3a8a"
                        stroke={isSelected ? "#ffffff" : isHovered ? "#60a5fa" : "#3b82f6"}
                        strokeWidth={isSelected ? 2.5 : 1}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel boczny z audytem powiązania */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
                  Weryfikator Art. 19a Ustawy
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {selectedNode ? selectedNode.label : "Wybierz węzeł na grafie"}
                </h4>
              </div>
              {selectedNode?.art19ViolationRisk && (
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Alert Art. 19a
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="my-4 space-y-3 text-xs">
                {selectedNode.type === "person" ? (
                  <>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Rola w organie</span>
                      <span className="text-white font-medium">{selectedNode.role || "Członek organu"}</span>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Liczba rad z ramienia SP</span>
                      <span
                        className={`text-lg font-bold font-mono ${
                          selectedNode.art19ViolationRisk ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {selectedNode.entityCount} / 1 dozwolona
                      </span>
                    </div>

                    {selectedNode.art19ViolationRisk && (
                      <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-lg text-red-200 text-xs">
                        <strong className="block font-bold mb-1">Ryzyko nieważności uchwał:</strong>
                        Osoba zasiada jednocześnie w Radzie Nadzorczej ORLEN S.A. oraz Polskiej Grupy Zbrojeniowej S.A.
                        z ramienia Skarbu Państwa. Wymagana pilna rezygnacja z jednego z mandatów.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Spółka z portfela</span>
                    <p className="text-slate-300 mt-1">
                      Podmiot monitorowany pod kątem składu rady nadzorczej i unii personalnych z kadrą menedżerską.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 my-6 text-center leading-relaxed">
                Kliknij dowolną osobę lub spółkę na grafie, aby sprawdzić historię delegacji, powiązania z holdingiem
                i legalność mandatów.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
            <span>Dziennik Ustaw 2024 poz. 125</span>
            <span className="font-mono">ART. 19A RADY SP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
