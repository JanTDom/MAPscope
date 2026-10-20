"use client";

import React, { useState } from "react";
import { CALENDAR_HEATMAP_DATA } from "@/lib/mapscope-data";
import { CalendarHeatmapDay } from "@/lib/types";

export function CalendarHeatmapChart() {
  const [selectedDay, setSelectedDay] = useState<CalendarHeatmapDay>(
    CALENDAR_HEATMAP_DATA[CALENDAR_HEATMAP_DATA.length - 1]
  );
  const [hoveredDay, setHoveredDay] = useState<CalendarHeatmapDay | null>(null);

  const days = CALENDAR_HEATMAP_DATA;
  const dayNames = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return "#ef4444"; // Czerwony - krytyczny P1
      case 3:
        return "#f97316"; // Pomarańczowy - debata / protesty
      case 2:
        return "#eab308"; // Żółty - Sejm RP
      case 1:
        return "#3b82f6"; // Niebieski - monitoring standardowy
      case 0:
      default:
        return "#1e293b"; // Szary - brak zdarzeń
    }
  };

  // Grupowanie w tygodnie (0..41)
  const maxWeek = Math.max(...days.map((d) => d.weekIndex));
  const weeksArray = Array.from({ length: maxWeek + 1 }, (_, i) => i);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Kalendarzowa mapa cieplna natężenia kryzysów (2026)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rozkład incydentów kryzysowych dzień po dniu w korelacji z harmonogramem posiedzeń Sejmu i Rady Ministrów
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Mniej</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className="w-3 h-3 rounded-sm border border-slate-700/60"
                style={{ backgroundColor: getIntensityColor(lvl) }}
              />
            ))}
            <span>Więcej</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 border-l border-slate-800 pl-3">
            <span className="w-3 h-3 border border-white rounded-sm" /> Sejm RP
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Siatka Heatmapy SVG */}
        <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="flex">
              {/* Kolumna dni tygodnia */}
              <div className="flex flex-col justify-between pr-2 text-[9px] text-slate-500 font-mono py-1">
                {dayNames.map((d, i) => (
                  <span key={i} className="h-3.5 leading-none">
                    {i % 2 === 0 ? d : ""}
                  </span>
                ))}
              </div>

              {/* Siatka 52 tygodni */}
              <div className="flex gap-1">
                {weeksArray.map((weekIdx) => {
                  const weekDays = days.filter((d) => d.weekIndex === weekIdx);

                  return (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, dOfWeek) => {
                        const dayData = weekDays.find((d) => d.dayOfWeek === dOfWeek);
                        if (!dayData) {
                          return <div key={dOfWeek} className="w-3 h-3 rounded-xs opacity-0" />;
                        }

                        const isSelected = selectedDay.date === dayData.date;
                        const isHovered = hoveredDay?.date === dayData.date;

                        return (
                          <div
                            key={dayData.date}
                            className={`w-3.5 h-3.5 rounded-xs cursor-pointer transition-all duration-100 relative ${
                              dayData.parliamentSitting ? "ring-1 ring-white/80" : ""
                            }`}
                            style={{
                              backgroundColor: getIntensityColor(dayData.intensity),
                              transform: isSelected || isHovered ? "scale(1.3)" : undefined,
                              zIndex: isSelected || isHovered ? 20 : 1,
                            }}
                            onMouseEnter={() => setHoveredDay(dayData)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => setSelectedDay(dayData)}
                            title={`${dayData.date}: ${dayData.crisisEventsCount} zdarzeń`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-3 px-6">
              <span>Styczeń</span>
              <span>Marzec</span>
              <span>Maj</span>
              <span>Lipiec</span>
              <span>Wrzesień</span>
              <span>Październik (bieżący)</span>
            </div>
          </div>
        </div>

        {/* Fiszka analityczna dnia */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400">
                  Raport dzienny aktywności
                </span>
                <h4 className="text-base font-bold font-mono text-white mt-0.5">{selectedDay.date}</h4>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded font-bold uppercase"
                style={{
                  backgroundColor: `${getIntensityColor(selectedDay.intensity)}25`,
                  color: getIntensityColor(selectedDay.intensity),
                  border: `1px solid ${getIntensityColor(selectedDay.intensity)}60`,
                }}
              >
                Poziom {selectedDay.intensity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Zdarzenia kryzysowe</span>
                <span className="text-xl font-bold font-mono text-white">{selectedDay.crisisEventsCount}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Posiedzenie organu</span>
                <span className="text-xs font-bold text-slate-200">
                  {selectedDay.parliamentSitting ? "Sejm RP" : selectedDay.cabinetMeeting ? "Rada Ministrów" : "Dzień roboczy"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Zarejestrowany incydent lub debata
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                {selectedDay.notableEvent || "Standardowy przebieg monitoringu mediów i spółek Skarbu Państwa."}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
            <span>Cykl polityczny i parlamentarny</span>
            <span className="font-mono">SEJM X KADENCJI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
