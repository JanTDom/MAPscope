"use client";

import React from "react";
import {
  AlertTriangle,
  Radio,
  Layers,
  Building2,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { AlertRecord, EntityRecord, StoryClusterRecord } from "@/lib/types";

interface RadarOverviewProps {
  entities: EntityRecord[];
  alerts: AlertRecord[];
  clusters: StoryClusterRecord[];
  onSelectEntity: (entityId: string) => void;
  onNavigateToCommunication: () => void;
}

export function RadarOverview({
  entities,
  alerts,
  clusters,
  onSelectEntity,
  onNavigateToCommunication,
}: RadarOverviewProps) {
  const p1Alerts = alerts.filter((a) => a.priority === "p1");
  const p2Alerts = alerts.filter((a) => a.priority === "p2");

  // Posortowane spółki wg wskaźnika ryzyka
  const highRiskEntities = [...entities]
    .sort((a, b) => (b.recent_risk_score ?? 0) - (a.recent_risk_score ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Karty syntetyczne */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
          <div className="flex items-center justify-between text-[#8a9ba8] text-xs font-medium">
            <span>Monitorowane podmioty</span>
            <Building2 className="w-4 h-4 text-[#3b82f6]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{entities.length}</div>
          <div className="mt-1 text-[11px] text-[#546675]">
            100% rejestru BIP MAP i odpisów KRS (zero wykluczeń)
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
          <div className="flex items-center justify-between text-[#8a9ba8] text-xs font-medium">
            <span>Alerty kryzysowe P1 / P2</span>
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ef4444] font-mono">{p1Alerts.length}</span>
            <span className="text-xs text-[#8a9ba8]">P1 krytyczne</span>
            <span className="text-xl font-semibold text-[#f59e0b] font-mono ml-2">
              {p2Alerts.length}
            </span>
            <span className="text-xs text-[#8a9ba8]">P2 wysokie</span>
          </div>
          <div className="mt-1 text-[11px] text-[#546675]">
            Reakcja na sygnał &lt; 2 minuty
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
          <div className="flex items-center justify-between text-[#8a9ba8] text-xs font-medium">
            <span>Klastry narracyjne</span>
            <Layers className="w-4 h-4 text-[#06b6d4]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{clusters.length}</div>
          <div className="mt-1 text-[11px] text-[#546675]">
            Wątki łączące media i oświadczenia spółek
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
          <div className="flex items-center justify-between text-[#8a9ba8] text-xs font-medium">
            <span>Silnik analizy ryzyka</span>
            <Radio className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#10b981]">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>AKTYWNY DUAL-STAGE</span>
          </div>
          <div className="mt-1 text-[11px] text-[#546675]">
            Heurystyka + audytor Gemini 2.5 Pro
          </div>
        </div>
      </div>

      {/* Dwie kolumny: Radar zagrożeń spółek + Ostatnie alerty */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolumna lewa: Radar podmiotów podwyższonego ryzyka */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,210,0.08)]">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Radar spółek podwyższonego ryzyka
                </h2>
                <p className="text-xs text-[#8a9ba8]">
                  Wskaźnik syntetyczny na podstawie komunikacji własnej i doniesień medialnych
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToCommunication}
                className="text-xs text-[#c59b27] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Audyt oświadczeń</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-[rgba(160,190,210,0.06)]">
              {highRiskEntities.map((entity) => {
                const score = entity.recent_risk_score ?? 0;
                let badgeColor = "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30";
                if (score >= 7.0) badgeColor = "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30";
                else if (score >= 4.5) badgeColor = "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30";
                else if (score >= 2.5) badgeColor = "bg-[#06b6d4]/15 text-[#06b6d4] border-[#06b6d4]/30";

                return (
                  <div
                    key={entity.id}
                    className="py-3 flex items-center justify-between hover:bg-[#101923]/40 px-2 rounded transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{entity.name}</span>
                        {entity.status === "restructuring" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
                            RESTRUKTURYZACJA
                          </span>
                        )}
                        {entity.is_public_listed && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3b82f6]/10 text-[#75b8ff] border border-[#3b82f6]/30 font-mono">
                            GPW: {entity.stock_ticker}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#8a9ba8] mt-0.5 flex items-center gap-2">
                        <span>{entity.sector}</span>
                        <span>•</span>
                        <span>SP: {entity.state_share_percent}%</span>
                        <span>•</span>
                        <span>{entity.ownership_body}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${badgeColor}`}
                        >
                          {score.toFixed(1)} / 10
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectEntity(entity.id)}
                        className="px-2.5 py-1 text-xs text-[#8a9ba8] hover:text-white bg-[#101923] hover:bg-[#152331] rounded border border-[rgba(160,190,210,0.12)]"
                      >
                        Karta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Klastry wątków */}
          <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
            <h2 className="text-sm font-semibold text-white mb-1">
              Aktywne klastry medialno-właścicielskie
            </h2>
            <p className="text-xs text-[#8a9ba8] mb-4">
              Połączone publikacje prasowe, depesze i reakcje spółki
            </p>

            <div className="space-y-3">
              {clusters.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded bg-[#101923]/60 border border-[rgba(160,190,210,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{c.title}</span>
                        {c.severity_level === "p1_critical" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 font-semibold">
                            P1 KRYZYS
                          </span>
                        )}
                        {c.severity_level === "p2_high" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                            P2 OSTRZEŻENIE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8a9ba8] mt-1 line-clamp-2">{c.summary}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-[#c59b27] font-mono">
                        {c.article_count} publikacji
                      </span>
                      <div className="text-[10px] text-[#546675] mt-0.5">
                        {c.disclosure_count} oświadczeń
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolumna prawa: Kolejka alertów dyżurnych P1/P2 */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,210,0.08)]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
                <h2 className="text-sm font-semibold text-white">Alerty wczesnego ostrzegania</h2>
              </div>
              <span className="text-xs text-[#8a9ba8] font-mono">{alerts.length} aktywnych</span>
            </div>

            <div className="mt-4 space-y-3">
              {alerts.map((alert) => {
                const isP1 = alert.priority === "p1";
                return (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded border ${
                      isP1
                        ? "bg-[#181114] border-[#ef4444]/40"
                        : "bg-[#151410] border-[#f59e0b]/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono ${
                          isP1
                            ? "bg-[#ef4444]/20 text-[#ef4444]"
                            : "bg-[#f59e0b]/20 text-[#f59e0b]"
                        }`}
                      >
                        {isP1 ? "PRIORYTET P1 — NATYCHMIASTOWY" : "PRIORYTET P2 — OSTRZEŻENIE"}
                      </span>
                      <span className="text-[11px] text-[#8a9ba8] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.created_at).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-white mt-2">{alert.title}</h3>
                    <p className="text-xs text-[#8a9ba8] mt-1">{alert.summary}</p>

                    <div className="mt-3 pt-2 border-t border-[rgba(160,190,210,0.08)] flex items-center justify-between text-[11px]">
                      <span className="text-[#546675]">
                        Kanały: {alert.dispatched_channels.join(", ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono ${
                          alert.status === "pending"
                            ? "bg-[#ef4444]/20 text-[#ef4444]"
                            : "bg-[#101923] text-[#8a9ba8]"
                        }`}
                      >
                        {alert.status === "pending" ? "OCZEKUJE" : "WYSLANO"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
