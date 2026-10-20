"use client";

import React from "react";
import { Shield, Radio, Building2, MessageSquareWarning, Landmark, Bell } from "lucide-react";

interface HeaderProps {
  activeTab: "radar" | "entities" | "communication" | "map_zone";
  onSelectTab: (tab: "radar" | "entities" | "communication" | "map_zone") => void;
  p1AlertCount: number;
}

export function Header({ activeTab, onSelectTab, p1AlertCount }: HeaderProps) {
  return (
    <header className="border-b border-[rgba(160,190,210,0.12)] bg-[#080d14]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo i godło */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#101923] border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">MAPscope</span>
                <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#c59b27]/15 text-[#c59b27] border border-[#c59b27]/30 font-mono">
                  GOV OSINT
                </span>
              </div>
              <p className="text-xs text-[#8a9ba8]">
                Radar ryzyka właścicielskiego i komunikacyjnego MAP
              </p>
            </div>
          </div>

          {/* Nawigacja modułów */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectTab("radar")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === "radar"
                  ? "bg-[#101923] text-white border border-[#c59b27]/50 shadow-sm"
                  : "text-[#8a9ba8] hover:text-white hover:bg-[#0e1620]"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-[#06b6d4]" />
              <span>Centrum dowodzenia</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("entities")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === "entities"
                  ? "bg-[#101923] text-white border border-[#c59b27]/50 shadow-sm"
                  : "text-[#8a9ba8] hover:text-white hover:bg-[#0e1620]"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Katalog wszystkich SSP</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("communication")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === "communication"
                  ? "bg-[#101923] text-white border border-[#c59b27]/50 shadow-sm"
                  : "text-[#8a9ba8] hover:text-white hover:bg-[#0e1620]"
              }`}
            >
              <MessageSquareWarning className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Audytor komunikacji</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("map_zone")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === "map_zone"
                  ? "bg-[#101923] text-white border border-[#c59b27]/50 shadow-sm"
                  : "text-[#8a9ba8] hover:text-white hover:bg-[#0e1620]"
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Strefa MAP</span>
            </button>
          </nav>

          {/* Wskaźnik alertów dyżurnych */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#101923] border border-[rgba(160,190,210,0.12)]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[11px] text-[#8a9ba8] font-mono">NASŁUCH AKTYWNY</span>
            </div>

            {p1AlertCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ef4444]/15 border border-[#ef4444]/40 text-[#ef4444] text-xs font-semibold animate-pulse">
                <Bell className="w-3.5 h-3.5" />
                <span>P1: {p1AlertCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
