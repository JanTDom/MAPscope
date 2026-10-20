"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar.tsx";
import { CommandPalette } from "@/components/CommandPalette.tsx";
import { MinisterView } from "@/components/views/MinisterView.tsx";
import { CommunicationView } from "@/components/views/CommunicationView.tsx";
import { GovernanceView } from "@/components/views/GovernanceView.tsx";
import { AnalyticsView } from "@/components/views/AnalyticsView.tsx";
import { EntitiesCatalog } from "@/components/EntitiesCatalog.tsx";
import { InternalDataView } from "@/components/views/InternalDataView.tsx";
import { DossierModal } from "@/components/views/DossierModal.tsx";
import {
  ALL_ENTITIES_REGISTRY,
  TOP_FIRE_ALERTS,
} from "@/lib/mapscope-data.ts";
import type { UserRole, EntityRecord, InternalDataEntry } from "@/lib/types.ts";
import { Search, Flame, Bell, Shield, Radio } from "lucide-react";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<UserRole>("minister");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalData, setInternalData] = useState<Record<string, InternalDataEntry>>({});

  const p1Alerts = TOP_FIRE_ALERTS.filter((a) => a.priority === "p1");

  const handleOpenDossier = (entityId: string) => {
    setSelectedEntityId(entityId);
    setIsDossierOpen(true);
  };

  const handleCloseDossier = () => {
    setIsDossierOpen(false);
  };

  const activeDossierEntity = ALL_ENTITIES_REGISTRY.find(
    (e) => e.id === selectedEntityId
  ) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070a0d] text-[#f4f7f8] map-glow-bg select-none">
      {/* Pasek Boczny (Sidebar) */}
      <Sidebar
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        p1Count={p1Alerts.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        internalDataCount={Object.keys(internalData).length}
      />

      {/* Główny Obszar Roboczy */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Górny Pasek Stanu (Top Bar) */}
        <header className="h-14 border-b border-[rgba(159,186,199,0.14)] bg-[#070a0d]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#5d6b74]">MAPscope</span>
            <span className="text-[#5d6b74]">/</span>
            <span className="text-xs font-bold text-white capitalize">
              {activeRole === "minister" && "Gabinet Ministra (Kokpit Zarządczy)"}
              {activeRole === "communication" && "Szef Komunikacji (Audytor i Media Radar)"}
              {activeRole === "governance" && "Ład Korporacyjny (Władze i Nadzór)"}
              {activeRole === "analytics" && "Centrum Zestawień i Własności (Portfel 406 SSP)"}
              {activeRole === "catalog" && "Katalog Wszystkich Spółek Skarbu Państwa"}
              {activeRole === "internal_data" && "Skarbiec Danych Wewnętrznych MAP"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {p1Alerts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveRole("minister")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ff7f87]/15 border border-[#ff7f87]/35 text-[#ff7f87] text-xs font-mono font-bold hover:bg-[#ff7f87]/25 transition-colors animate-pulse"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>POŻARY P1: {p1Alerts.length}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#111a21] border border-transparent hover:border-[rgba(159,186,199,0.14)] transition-colors"
              title="Szukaj (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamiczny Widok Perspektywy */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeRole === "minister" && (
              <MinisterView onOpenDossier={handleOpenDossier} />
            )}

            {activeRole === "communication" && (
              <CommunicationView onOpenDossier={handleOpenDossier} />
            )}

            {activeRole === "governance" && (
              <GovernanceView onOpenDossier={handleOpenDossier} />
            )}

            {activeRole === "analytics" && (
              <AnalyticsView
                entities={ALL_ENTITIES_REGISTRY}
                onSelectEntity={handleOpenDossier}
              />
            )}

            {activeRole === "catalog" && (
              <EntitiesCatalog
                entities={ALL_ENTITIES_REGISTRY}
                selectedEntityId={selectedEntityId}
                onSelectEntity={(id) => setSelectedEntityId(id)}
                onOpenDossier={handleOpenDossier}
              />
            )}

            {activeRole === "internal_data" && (
              <InternalDataView
                entities={ALL_ENTITIES_REGISTRY}
                internalData={internalData}
                onUpdateInternalData={setInternalData}
                onOpenDossier={handleOpenDossier}
              />
            )}
          </div>
        </main>
      </div>

      {/* Globalne Wyszukiwanie (Cmd+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        entities={ALL_ENTITIES_REGISTRY}
        onSelectEntity={handleOpenDossier}
      />

      {/* Modal Dossier 360° */}
      {isDossierOpen && activeDossierEntity && (
        <DossierModal
          entity={activeDossierEntity}
          onClose={handleCloseDossier}
          internalData={internalData[activeDossierEntity.id]}
        />
      )}
    </div>
  );
}
