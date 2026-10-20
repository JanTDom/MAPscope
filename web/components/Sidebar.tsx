"use client";

import React from "react";
import {
  Shield,
  Flame,
  MessageSquareWarning,
  Building2,
  Lock,
  Search,
  ChevronRight,
  Landmark,
  Radio,
  FileSpreadsheet,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/lib/types.ts";

interface SidebarProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  p1Count: number;
  onOpenSearch: () => void;
  internalDataCount: number;
}

export function Sidebar({
  activeRole,
  onSelectRole,
  p1Count,
  onOpenSearch,
  internalDataCount,
}: SidebarProps) {
  const navItems = [
    {
      role: "minister" as UserRole,
      label: "Gabinet Ministra",
      subtitle: "Radar strategiczny i pożary dnia",
      icon: Flame,
      color: "text-[#ff7f87]",
      badge: p1Count > 0 ? `${p1Count} P1` : undefined,
      badgeColor: "bg-[#ff7f87]/20 text-[#ff7f87] border-[#ff7f87]/40",
    },
    {
      role: "communication" as UserRole,
      label: "Szef Komunikacji",
      subtitle: "Audyt oświadczeń i radar mediów",
      icon: MessageSquareWarning,
      color: "text-[#f6c56b]",
    },
    {
      role: "governance" as UserRole,
      label: "Ład Korporacyjny",
      subtitle: "Zarządy, rady, wakaty, konkursy",
      icon: Building2,
      color: "text-[#57e0c5]",
    },
    {
      role: "analytics" as UserRole,
      label: "Centrum Zestawień",
      subtitle: "Portfel 406 SSP, organy i pakiety",
      icon: BarChart3,
      color: "text-[#75b8ff]",
    },
    {
      role: "catalog" as UserRole,
      label: "Katalog Wszystkich SSP",
      subtitle: "100% podmiotów bez wykluczeń",
      icon: Landmark,
      color: "text-[#75b8ff]",
    },
    {
      role: "internal_data" as UserRole,
      label: "Dane Wewnętrzne",
      subtitle: "Skarbiec notatek i spraw MAP",
      icon: FileSpreadsheet,
      color: "text-[#e5b958]",
      badge: internalDataCount > 0 ? `${internalDataCount} akt` : undefined,
      badgeColor: "bg-[#e5b958]/20 text-[#e5b958] border-[#e5b958]/40",
    },
  ];

  return (
    <aside className="w-[288px] border-r border-[rgba(159,186,199,0.14)] bg-[#070a0d] flex flex-col shrink-0 select-none z-30">
      {/* Nagłówek i tożsamość rządowa */}
      <div className="p-4 border-b border-[rgba(159,186,199,0.14)] bg-[#070a0d]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <img
              src="/mapscope-logo-darkmode.png"
              alt="MAPscope Logo"
              className="h-12 w-auto max-w-[215px] object-contain drop-shadow-[0_2px_14px_rgba(87,224,197,0.2)]"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] font-mono border border-[#57e0c5]/30 shrink-0">
              GOV
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8e9da7] leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57e0c5] animate-pulse shrink-0" />
            <span>Nadzór Właścicielski i Radar Ryzyk MAP</span>
          </div>
        </div>

        {/* Globalne wyszukiwanie (Cmd+K) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0d1318] border border-[rgba(159,186,199,0.14)] text-xs text-[#8e9da7] hover:text-white hover:border-[rgba(159,186,199,0.25)] transition-all group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#5d6b74] group-hover:text-[#57e0c5]" />
            <span>Szukaj spółki, sprawy...</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-[10px] font-mono text-[#5d6b74]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Nawigacja perspektyw ról w MAP */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#5d6b74] font-mono">
          Perspektywy Zarządcze (Role)
        </div>

        {navItems.map((item) => {
          const isActive = activeRole === item.role;
          const Icon = item.icon;

          return (
            <button
              key={item.role}
              type="button"
              onClick={() => onSelectRole(item.role)}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? "bg-[#111a21] text-white border border-[rgba(87,224,197,0.3)] shadow-sm"
                  : "text-[#8e9da7] hover:text-white hover:bg-[#0d1318] border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate text-white">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5d6b74] truncate mt-0.5">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dolny status operacyjny */}
      <div className="p-3 border-t border-[rgba(159,186,199,0.14)] bg-[#090d12]">
        <div className="p-2.5 rounded-lg bg-[#0d1318] border border-[rgba(159,186,199,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#57e0c5] animate-pulse" />
            <span className="text-[11px] font-mono text-[#8e9da7]">NASŁUCH 24/7</span>
          </div>
          <span className="text-[10px] font-mono text-[#5d6b74]">v1.0 Fable 5.1</span>
        </div>
      </div>
    </aside>
  );
}
