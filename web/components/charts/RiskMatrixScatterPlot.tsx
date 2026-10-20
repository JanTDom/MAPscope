"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Search,
  ExternalLink,
} from "lucide-react";
import { RISK_MATRIX_SCATTER_POINTS } from "@/lib/mapscope-data";
import { RiskMatrixScatterPoint } from "@/lib/types";

interface RiskMatrixScatterPlotProps {
  onSelectPoint?: (point: RiskMatrixScatterPoint) => void;
}

export function RiskMatrixScatterPlot({ onSelectPoint }: RiskMatrixScatterPlotProps) {
  const [viewMode, setViewMode] = useState<"bento" | "scatter">("bento");
  const [selectedPoint, setSelectedPoint] = useState<RiskMatrixScatterPoint>(RISK_MATRIX_SCATTER_POINTS[0]);
  const [hoveredPoint, setHoveredPoint] = useState<RiskMatrixScatterPoint | null>(null);
  const [selectedQuadrantFilter, setSelectedQuadrantFilter] = useState<string>("all");

  const getCategoryColor = (cat: RiskMatrixScatterPoint["category"]) => {
    switch (cat) {
      case "spór_społeczny":
        return "#ef4444"; // Czerwony
      case "finanse":
        return "#f59e0b"; // Bursztynowy
      case "kadry":
        return "#a855f7"; // Fioletowy
      case "awaria":
        return "#06b6d4"; // Błękitny
      case "regulacje":
        return "#ec4899"; // Różowy
      default:
        return "#3b82f6";
    }
  };

  const getQuadrantColor = (quadrant: RiskMatrixScatterPoint["quadrant"]) => {
    switch (quadrant) {
      case "czerwona_strefa_kprm":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-300 border-red-500/40",
          title: "Czerwona strefa KPRM",
          sub: "Wysokie prawdopodobieństwo eskalacji i krytyczny wpływ na MAP oraz Premiera",
        };
      case "ryzyko_wizerunkowe":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-400",
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          title: "Ryzyko wizerunkowe i giełdowe",
          sub: "Kluczowe spółki rynkowe z umiarkowanym bieżącym prawdopodobieństwem sporu",
        };
      case "konflikt_operacyjny":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          title: "Konflikty operacyjne i regionalne",
          sub: "Napięcia zakładowe i płacowe o ograniczonym rykoszecie ogólnopolskim",
        };
      case "stabilny_monitoring":
      default:
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          title: "Stabilny nadzór i spokój właścicielski",
          sub: "Sytuacja operacyjna i finansowa pod pełną kontrolą zarządczą",
        };
    }
  };

  const handlePointClick = (pt: RiskMatrixScatterPoint) => {
    setSelectedPoint(pt);
    if (onSelectPoint) {
      onSelectPoint(pt);
    }
  };

  // Grupowanie punktów wg kwadrantów
  const redZonePoints = RISK_MATRIX_SCATTER_POINTS.filter((p) => p.quadrant === "czerwona_strefa_kprm");
  const reputationPoints = RISK_MATRIX_SCATTER_POINTS.filter((p) => p.quadrant === "ryzyko_wizerunkowe");
  const conflictPoints = RISK_MATRIX_SCATTER_POINTS.filter((p) => p.quadrant === "konflikt_operacyjny");
  const stablePoints = RISK_MATRIX_SCATTER_POINTS.filter((p) => p.quadrant === "stabilny_monitoring");

  // Wymiary wykresu SVG dla widoku osiowego (rozszerzone i dopasowane do braku kolizji)
  const width = 720;
  const height = 460;
  const padding = { top: 48, right: 48, bottom: 50, left: 65 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xScale = (prob: number) => padding.left + (prob / 100) * innerWidth;
  const yScale = (impact: number) => padding.top + innerHeight - (impact / 100) * innerHeight;

  // Układ antykolizyjny dla etykiet/plakietek - zero nakładania się
  const layoutNodes = useMemo(() => {
    const badgeW = 68;
    const badgeH = 24;

    const nodes = RISK_MATRIX_SCATTER_POINTS.map((pt) => {
      const cx = Math.round(xScale(pt.probability));
      const cy = Math.round(yScale(pt.ministerImpact));
      return {
        ...pt,
        cx,
        cy,
        x: cx,
        y: cy,
        w: badgeW,
        h: badgeH,
      };
    });

    // Relaksacja antykolizyjna (50 iteracji rozpychania nakładających się boksów)
    for (let iter = 0; iter < 50; iter++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minX = (a.w + b.w) / 2 + 8;
          const minY = (a.h + b.h) / 2 + 6;

          if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
            const overlapX = minX - Math.abs(dx);
            const overlapY = minY - Math.abs(dy);

            if (overlapX < overlapY * 1.4) {
              const shift = overlapX / 2;
              if (dx >= 0) {
                b.x += shift;
                a.x -= shift;
              } else {
                b.x -= shift;
                a.x += shift;
              }
            } else {
              const shift = overlapY / 2;
              if (dy >= 0) {
                b.y += shift;
                a.y -= shift;
              } else {
                b.y -= shift;
                a.y += shift;
              }
            }
          }
        }
        // Utrzymanie w granicach bezpiecznych marginesów
        nodes[i].x = Math.max(padding.left + 35, Math.min(width - padding.right - 35, nodes[i].x));
        nodes[i].y = Math.max(padding.top + 20, Math.min(height - padding.bottom - 20, nodes[i].y));
      }
    }

    return nodes;
  }, [innerWidth, innerHeight]);

  return (
    <div className="bg-[#0b1117] border border-slate-800 rounded-xl p-6 shadow-2xl">
      {/* Nagłówek Macierzy */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              Macierz Zagrożeń Właścicielskich MAP (Kwadranty Ryzyka KPRM)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pozycjonowanie 14 kluczowych spółek portfela według prawdopodobieństwa eskalacji kryzysu oraz bezpośredniego wpływu na MAP i Rząd
          </p>
        </div>

        {/* Przełącznik widoków: Kafelkowy (Bento) vs Osiowy 2D */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("bento")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === "bento"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kafle kwadrantów (Bento)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("scatter")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === "scatter"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Kartogram osiowy 2D</span>
          </button>
        </div>
      </div>

      {/* GŁÓWNY WIDOK: KAFELKOWY UKŁAD ZARZĄDCZY (BENTO MATRIX) */}
      {viewMode === "bento" ? (
        <div className="space-y-6 mt-6">
          {/* Siatka 4 Kwadrantów */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 1. CZERWONA STREFA KPRM */}
            <div className="bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-950 border border-red-500/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between pb-3 border-b border-red-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-red-200 uppercase tracking-wider">
                    Czerwona strefa KPRM ({redZonePoints.length} spółki)
                  </h4>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                  Wymaga uwagi Ministra
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Podmioty o krytycznym ryzyku eskalacji politycznej, strajkowej lub zarzutów prokuratorskich uderzających bezpośrednio w resort.
              </p>

              <div className="space-y-3">
                {redZonePoints.map((pt) => {
                  const isSelected = selectedPoint.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => handlePointClick(pt)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-red-950/40 border-red-500 shadow-md ring-1 ring-red-500/50"
                          : "bg-slate-900/80 border-slate-800 hover:border-red-500/40 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            {pt.tickerOrAlias}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {pt.entityName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Ryzyko eskalacji</span>
                            <span className="text-xs font-bold font-mono text-red-400">{pt.probability}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Wpływ na Rząd</span>
                            <span className="text-xs font-bold font-mono text-amber-400">{pt.ministerImpact}%</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePointClick(pt);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 border border-slate-700 transition-colors"
                            title="Szczegóły dossier"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Pasek wskaźnika ryzyka */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
                        <div
                          className="bg-red-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pt.probability}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-2">
                        {pt.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. RYZYKO WIZERUNKOWE I GIEŁDOWE */}
            <div className="bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                    Ryzyko wizerunkowe i giełdowe ({reputationPoints.length} spółki)
                  </h4>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  Nadzór rynkowy
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Kluczowe koncerny o potężnej kapitalizacji, gdzie kryzys miałby dewastujący wpływ, lecz ryzyko wybuchu jest obecnie kontrolowane.
              </p>

              <div className="space-y-3">
                {reputationPoints.map((pt) => {
                  const isSelected = selectedPoint.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => handlePointClick(pt)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50"
                          : "bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            {pt.tickerOrAlias}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {pt.entityName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Prawdopodobieństwo</span>
                            <span className="text-xs font-bold font-mono text-amber-400">{pt.probability}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Wpływ na MAP</span>
                            <span className="text-xs font-bold font-mono text-blue-400">{pt.ministerImpact}%</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePointClick(pt);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-400 border border-slate-700 transition-colors"
                            title="Szczegóły dossier"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pt.probability}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-2">
                        {pt.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. KONFLIKTY OPERACYJNE I REGIONALNE */}
            <div className="bg-gradient-to-br from-blue-950/20 via-slate-900 to-slate-950 border border-blue-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-bold text-blue-200 uppercase tracking-wider">
                    Konflikty operacyjne i regionalne ({conflictPoints.length} spółki)
                  </h4>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                  Napięcia zakładowe
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Spory płacowe, negocjacje układów zbiorowych lub roszczenia bankowe o ograniczonym rezonansie na poziomie centralnym.
              </p>

              <div className="space-y-3">
                {conflictPoints.map((pt) => {
                  const isSelected = selectedPoint.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => handlePointClick(pt)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                          : "bg-slate-900/80 border-slate-800 hover:border-blue-500/40 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            {pt.tickerOrAlias}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {pt.entityName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Prawdopodobieństwo</span>
                            <span className="text-xs font-bold font-mono text-blue-400">{pt.probability}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Wpływ na MAP</span>
                            <span className="text-xs font-bold font-mono text-slate-300">{pt.ministerImpact}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pt.probability}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-2">
                        {pt.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. STABILNY NADZÓR I SPOKÓJ WŁAŚCICIELSKI */}
            <div className="bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-emerald-200 uppercase tracking-wider">
                    Stabilny nadzór i spokój właścicielski ({stablePoints.length} spółki)
                  </h4>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  Sytuacja opanowana
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Podmioty generujące rekordowe zyski, terminowe dywidendy lub bezpieczną realizację strategicznych kontraktów państwowych.
              </p>

              <div className="space-y-3">
                {stablePoints.map((pt) => {
                  const isSelected = selectedPoint.id === pt.id;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => handlePointClick(pt)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50"
                          : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                            {pt.tickerOrAlias}
                          </span>
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {pt.entityName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Prawdopodobieństwo</span>
                            <span className="text-xs font-bold font-mono text-emerald-400">{pt.probability}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Wpływ na MAP</span>
                            <span className="text-xs font-bold font-mono text-slate-300">{pt.ministerImpact}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pt.probability}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed line-clamp-2">
                        {pt.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dedykowana fiszka inspekcyjna wybranej spółki */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Wybrana spółka do pogłębienia
                </span>
                <span className="text-xs text-slate-400">Sektor: {selectedPoint.sector}</span>
              </div>
              <h5 className="text-base font-bold text-white mt-1">
                {selectedPoint.entityName} ({selectedPoint.tickerOrAlias})
              </h5>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
                {selectedPoint.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onSelectPoint) {
                    onSelectPoint(selectedPoint);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Otwórz pełne Dossier 360°</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* WIDOK OSIOWY 2D (KARTOGRAM Z CZYTELNYM ROZŁOŻENIEM) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80 relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-xl">
              {/* Tło kwadrantów */}
              {/* Prawy Górny - Czerwona Strefa KPRM */}
              <rect
                x={padding.left + innerWidth / 2}
                y={padding.top}
                width={innerWidth / 2}
                height={innerHeight / 2}
                fill="#ef4444"
                fillOpacity="0.12"
              />
              {/* Lewy Górny - Ryzyko wizerunkowe */}
              <rect
                x={padding.left}
                y={padding.top}
                width={innerWidth / 2}
                height={innerHeight / 2}
                fill="#f59e0b"
                fillOpacity="0.08"
              />
              {/* Prawy Dolny - Konflikty operacyjne */}
              <rect
                x={padding.left + innerWidth / 2}
                y={padding.top + innerHeight / 2}
                width={innerWidth / 2}
                height={innerHeight / 2}
                fill="#3b82f6"
                fillOpacity="0.06"
              />
              {/* Lewy Dolny - Stabilny monitoring */}
              <rect
                x={padding.left}
                y={padding.top + innerHeight / 2}
                width={innerWidth / 2}
                height={innerHeight / 2}
                fill="#10b981"
                fillOpacity="0.05"
              />

              {/* Linie siatki osiowej */}
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
                y={height - 14}
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

              {/* Nagłówki kwadrantów w chronionych boksach narożnych (zero kolizji z plakietkami) */}
              {/* Prawy Górny - Czerwona Strefa KPRM */}
              <g>
                <rect
                  x={padding.left + innerWidth - 148}
                  y={padding.top + 6}
                  width={142}
                  height={22}
                  rx={4}
                  fill="#15080b"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <text
                  x={padding.left + innerWidth - 77}
                  y={padding.top + 21}
                  textAnchor="middle"
                  fill="#f87171"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="font-mono tracking-wider"
                >
                  CZERWONA STREFA KPRM
                </text>
              </g>

              {/* Lewy Górny - Ryzyko wizerunkowe */}
              <g>
                <rect
                  x={padding.left + 6}
                  y={padding.top + 6}
                  width={140}
                  height={22}
                  rx={4}
                  fill="#171108"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <text
                  x={padding.left + 76}
                  y={padding.top + 21}
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="font-mono tracking-wider"
                >
                  RYZYKO WIZERUNKOWE
                </text>
              </g>

              {/* Prawy Dolny - Konflikty operacyjne */}
              <g>
                <rect
                  x={padding.left + innerWidth - 148}
                  y={padding.top + innerHeight - 28}
                  width={142}
                  height={22}
                  rx={4}
                  fill="#080f18"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <text
                  x={padding.left + innerWidth - 77}
                  y={padding.top + innerHeight - 13}
                  textAnchor="middle"
                  fill="#93c5fd"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="font-mono tracking-wider"
                >
                  KONFLIKTY OPERACYJNE
                </text>
              </g>

              {/* Lewy Dolny - Stabilny monitoring */}
              <g>
                <rect
                  x={padding.left + 6}
                  y={padding.top + innerHeight - 28}
                  width={140}
                  height={22}
                  rx={4}
                  fill="#081510"
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
                <text
                  x={padding.left + 76}
                  y={padding.top + innerHeight - 13}
                  textAnchor="middle"
                  fill="#6ee7b7"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="font-mono tracking-wider"
                >
                  STABILNY MONITORING
                </text>
              </g>

              {/* Plakietki spółek z układem antykolizyjnym (zero nakładania się na siebie) */}
              {layoutNodes.map((node) => {
                const isSelected = selectedPoint.id === node.id;
                const isHovered = hoveredPoint?.id === node.id;
                const color = getCategoryColor(node.category);
                const isDisplaced = Math.hypot(node.x - node.cx, node.y - node.cy) > 3;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(node)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => handlePointClick(node)}
                  >
                    {/* Dyskretna linia łącznikowa, jeśli plakietka została odsunięta dla braku kolizji */}
                    {isDisplaced && (
                      <line
                        x1={node.cx}
                        y1={node.cy}
                        x2={node.x}
                        y2={node.y}
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Precyzyjny punkt współrzędnej matematycznej */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={2.5}
                      fill={color}
                      stroke="#070c12"
                      strokeWidth="1.5"
                    />

                    {/* Zewnętrzna ramka zaznaczenia */}
                    {isSelected && (
                      <rect
                        x={node.x - 37}
                        y={node.y - 14}
                        width={74}
                        height={28}
                        rx={7}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Główna plakietka korporacyjna spółki */}
                    <rect
                      x={node.x - 34}
                      y={node.y - 12}
                      width={68}
                      height={24}
                      rx={5}
                      fill="#070c12"
                      stroke={isSelected ? "#ffffff" : isHovered ? "#93c5fd" : color}
                      strokeWidth={isSelected ? 2 : 1.2}
                      className="drop-shadow-lg"
                    />

                    {/* Boczny pasek kategorii ryzyka */}
                    <rect
                      x={node.x - 34}
                      y={node.y - 12}
                      width={3.5}
                      height={24}
                      rx={1.5}
                      fill={color}
                    />

                    {/* Ticker spółki */}
                    <text
                      x={node.x + 1}
                      y={node.y + 3.5}
                      textAnchor="middle"
                      fill={isSelected ? "#ffffff" : "#f1f5f9"}
                      fontSize="9"
                      fontWeight={isSelected ? "bold" : "600"}
                      className="pointer-events-none font-mono"
                    >
                      {node.tickerOrAlias}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Fiszka analityczna w widoku 2D */}
          <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-red-400">
                    Ocena ryzyka w kwadrancie
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{selectedPoint.entityName}</h4>
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
              <button
                type="button"
                onClick={() => {
                  if (onSelectPoint) {
                    onSelectPoint(selectedPoint);
                  }
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Otwórz dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-500">{selectedPoint.tickerOrAlias}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
