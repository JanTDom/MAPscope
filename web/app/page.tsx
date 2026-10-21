"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar.tsx";
import { CommandPalette } from "@/components/CommandPalette.tsx";
import { MinisterView } from "@/components/views/MinisterView.tsx";
import { CommunicationView } from "@/components/views/CommunicationView.tsx";
import { GovernanceView } from "@/components/views/GovernanceView.tsx";
import { AnalyticsView } from "@/components/views/AnalyticsView.tsx";
import { EntitiesCatalog } from "@/components/EntitiesCatalog.tsx";
import { InternalDataView } from "@/components/views/InternalDataView.tsx";
import { SocialDialogueView } from "@/components/views/SocialDialogueView.tsx";
import { MapZoneView } from "@/components/views/MapZoneView.tsx";
import { DossierModal } from "@/components/views/DossierModal.tsx";
import { AuthScreen } from "@/components/AuthScreen.tsx";
import { OsintSearchModal } from "@/components/OsintSearchModal.tsx";
import {
  ALL_ENTITIES_REGISTRY,
  TOP_FIRE_ALERTS,
} from "@/lib/mapscope-data.ts";
import type { UserRole, EntityRecord, InternalDataEntry } from "@/lib/types.ts";
import { Search, Flame, Bell, Shield, Radio, LogOut, Menu, Building2, Landmark } from "lucide-react";

export default function HomePage() {
  // Bezwzględny wymóg: za każdym wejściem lub odświeżeniem strony wymagane jest podanie hasła
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<UserRole>("minister");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOsintOpen, setIsOsintOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalData, setInternalData] = useState<Record<string, InternalDataEntry>>({});

  useEffect(() => {
    try {
      localStorage.removeItem("mapscope_authenticated");
      sessionStorage.removeItem("mapscope_authenticated");
    } catch {
      // Ignored
    }
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("mapscope_authenticated");
      localStorage.removeItem("mapscope_authenticated");
    } catch {
      // Ignored
    }
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

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
      {/* Pasek Boczny (Sidebar) - Desktop + Mobile Slide-Over Drawer */}
      <Sidebar
        activeRole={activeRole}
        onSelectRole={(role) => {
          setActiveRole(role);
          setIsMobileMenuOpen(false);
        }}
        p1Count={p1Alerts.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        internalDataCount={Object.keys(internalData).length}
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Główny Obszar Roboczy */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Górny Pasek Stanu (Top Bar) */}
        <header className="h-14 border-b border-[rgba(159,186,199,0.14)] bg-[#070a0d]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Przycisk menu mobilnego (Hamburger) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#111a21] border border-[rgba(159,186,199,0.14)] md:hidden shrink-0"
              aria-label="Otwórz menu nawigacji"
            >
              <Menu className="w-4 h-4 text-[#57e0c5]" />
            </button>

            <span className="text-[11px] font-mono text-[#57e0c5] font-bold shrink-0">MAPscope</span>
            <span className="text-[#5d6b74] shrink-0">/</span>
            <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-md lg:max-w-none">
              {activeRole === "minister" && "Gabinet Ministra"}
              {activeRole === "map_zone" && "Strefa MAP"}
              {activeRole === "communication" && "Szef Komunikacji"}
              {activeRole === "governance" && "Ład Korporacyjny"}
              {activeRole === "analytics" && "Centrum Zestawień"}
              {activeRole === "catalog" && "Katalog SSP"}
              {activeRole === "social_dialogue" && "Dialog Społeczny"}
              {activeRole === "internal_data" && "Dane Wewnętrzne MAP"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {p1Alerts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveRole("minister")}
                className="flex items-center gap-1 px-2 py-1 rounded bg-[#ff7f87]/15 border border-[#ff7f87]/35 text-[#ff7f87] text-[11px] font-mono font-bold hover:bg-[#ff7f87]/25 transition-colors animate-pulse"
                title="Przejdź do spraw krytycznych P1"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">POŻARY:</span>
                <span>{p1Alerts.length} P1</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOsintOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 hover:text-white transition-all shadow-sm"
              title="Przeszukaj otwarty Internet i media w czasie rzeczywistym"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
              <span className="hidden sm:inline">Nasłuch OSINT</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-lg text-[#8e9da7] hover:text-white hover:bg-[#111a21] border border-transparent hover:border-[rgba(159,186,199,0.14)] transition-colors"
              title="Szukaj (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono text-[#8e9da7] hover:text-[#ff7f87] hover:bg-[#ff7f87]/10 border border-transparent hover:border-[#ff7f87]/30 transition-colors"
              title="Zablokuj sesję i wyloguj"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wyloguj</span>
            </button>
          </div>
        </header>

        {/* Dynamiczny Widok Perspektywy */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            <div className={activeRole === "minister" ? "block" : "hidden"}>
              <MinisterView onOpenDossier={handleOpenDossier} />
            </div>

            <div className={activeRole === "map_zone" ? "block" : "hidden"}>
              <MapZoneView />
            </div>

            <div className={activeRole === "communication" ? "block" : "hidden"}>
              <CommunicationView onOpenDossier={handleOpenDossier} />
            </div>

            <div className={activeRole === "governance" ? "block" : "hidden"}>
              <GovernanceView onOpenDossier={handleOpenDossier} />
            </div>

            <div className={activeRole === "analytics" ? "block" : "hidden"}>
              <AnalyticsView
                entities={ALL_ENTITIES_REGISTRY}
                onSelectEntity={handleOpenDossier}
              />
            </div>

            <div className={activeRole === "catalog" ? "block" : "hidden"}>
              <EntitiesCatalog
                entities={ALL_ENTITIES_REGISTRY}
                selectedEntityId={selectedEntityId}
                onSelectEntity={(id) => setSelectedEntityId(id)}
                onOpenDossier={handleOpenDossier}
              />
            </div>

            <div className={activeRole === "social_dialogue" ? "block" : "hidden"}>
              <SocialDialogueView onOpenDossier={handleOpenDossier} />
            </div>

            <div className={activeRole === "internal_data" ? "block" : "hidden"}>
              <InternalDataView
                entities={ALL_ENTITIES_REGISTRY}
                internalData={internalData}
                onUpdateInternalData={setInternalData}
                onOpenDossier={handleOpenDossier}
              />
            </div>
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

      {/* Modal Wyszukiwarki OSINT w Sieci */}
      <OsintSearchModal
        isOpen={isOsintOpen}
        onClose={() => setIsOsintOpen(false)}
      />

      {/* Modal Dossier 360° */}
      {isDossierOpen && activeDossierEntity && (
        <DossierModal
          entity={activeDossierEntity}
          onClose={handleCloseDossier}
          internalData={internalData[activeDossierEntity.id]}
        />
      )}

      {/* Mobilny Dolny Pasek Nawigacji (Mobile Bottom Bar) */}
      <nav className="fixed bottom-0 inset-x-0 h-14 bg-[#070a0d]/95 backdrop-blur-md border-t border-[rgba(159,186,199,0.14)] z-30 md:hidden flex items-center justify-around px-1">
        <button
          type="button"
          onClick={() => setActiveRole("minister")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeRole === "minister" ? "text-[#ff7f87]" : "text-[#8e9da7] hover:text-white"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">Gabinet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole("map_zone")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeRole === "map_zone" ? "text-[#57e0c5]" : "text-[#8e9da7] hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">MAP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole("governance")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeRole === "governance" ? "text-[#57e0c5]" : "text-[#8e9da7] hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">Ład</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveRole("catalog")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeRole === "catalog" ? "text-[#75b8ff]" : "text-[#8e9da7] hover:text-white"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">Katalog</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[#8e9da7] hover:text-white transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[9px] font-semibold mt-0.5">Więcej</span>
        </button>
      </nav>
    </div>
  );
}
