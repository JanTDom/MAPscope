"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { RadarOverview } from "@/components/RadarOverview";
import { EntitiesCatalog } from "@/components/EntitiesCatalog";
import { CommunicationRiskPanel } from "@/components/CommunicationRiskPanel";
import { MapZonePanel } from "@/components/MapZonePanel";
import {
  SEED_ENTITIES,
  SEED_DISCLOSURES,
  SEED_ALERTS,
  SEED_CLUSTERS,
} from "@/lib/entities-data";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    "radar" | "entities" | "communication" | "map_zone"
  >("radar");

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
    SEED_ENTITIES[0]?.id || null
  );

  const handleSelectEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setActiveTab("entities");
  };

  const p1AlertCount = SEED_ALERTS.filter((a) => a.priority === "p1").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#06090e] text-[#f3f6f9]">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        p1AlertCount={p1AlertCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "radar" && (
          <RadarOverview
            entities={SEED_ENTITIES}
            alerts={SEED_ALERTS}
            clusters={SEED_CLUSTERS}
            onSelectEntity={handleSelectEntity}
            onNavigateToCommunication={() => setActiveTab("communication")}
          />
        )}

        {activeTab === "entities" && (
          <EntitiesCatalog
            entities={SEED_ENTITIES}
            selectedEntityId={selectedEntityId}
            onSelectEntity={(id) => setSelectedEntityId(id)}
          />
        )}

        {activeTab === "communication" && (
          <CommunicationRiskPanel disclosures={SEED_DISCLOSURES} />
        )}

        {activeTab === "map_zone" && <MapZonePanel />}
      </main>

      <footer className="border-t border-[rgba(160,190,210,0.08)] bg-[#080d14] py-4 text-center text-xs text-[#546675]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>MAPscope • System Monitoringu i Wczesnego Ostrzegania dla MAP</span>
          </div>
          <div className="font-mono text-[11px]">
            Wersja 1.0.0 • Standard rzemiosła Fable 5.1
          </div>
        </div>
      </footer>
    </div>
  );
}
