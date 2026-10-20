"use client";

import React, { useState } from "react";
import {
  MessageSquareWarning,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { CompanyDisclosureRecord } from "@/lib/types";

interface CommunicationRiskPanelProps {
  disclosures: CompanyDisclosureRecord[];
}

export function CommunicationRiskPanel({ disclosures }: CommunicationRiskPanelProps) {
  const [selectedDisclosureId, setSelectedDisclosureId] = useState<string>(
    disclosures[0]?.id || ""
  );

  const activeDisclosure = disclosures.find((d) => d.id === selectedDisclosureId) || disclosures[0];
  const assessment = activeDisclosure?.risk_assessment;

  return (
    <div className="space-y-6">
      {/* Nagłówek modułu */}
      <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 font-mono">
                REGUŁA KARDYNALNA NR 2
              </span>
              <h2 className="text-sm font-bold text-white">
                Silnik analizy ryzyka komunikacyjnego spółek (Communication Risk Engine)
              </h2>
            </div>
            <p className="text-xs text-[#8a9ba8] mt-1">
              Aktywny audyt własnego przekazu spółek: oświadczenia, wywiady prezesów, social media i raporty ESPI
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8a9ba8]">
            <span>Liczba audytowanych materiałów:</span>
            <span className="font-mono text-white font-semibold">{disclosures.length}</span>
          </div>
        </div>
      </div>

      {/* Siatka: Lista oświadczeń + Szczegółowy audyt AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lista oświadczeń */}
        <div className="lg:col-span-5 space-y-3">
          {disclosures.map((d) => {
            const isSelected = d.id === activeDisclosure?.id;
            const ra = d.risk_assessment;
            const isP1 = ra?.severity === "p1_critical";

            return (
              <div
                key={d.id}
                onClick={() => setSelectedDisclosureId(d.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#111a24] border-[#c59b27] shadow-md"
                    : "bg-[#0b1118] border-[rgba(160,190,210,0.12)] hover:border-[rgba(160,190,210,0.25)] hover:bg-[#0e1620]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#75b8ff]">{d.entity_name}</span>
                  <span className="text-[11px] text-[#546675] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(d.published_at).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <h3 className="text-xs font-medium text-white mt-1.5 line-clamp-2">{d.title}</h3>

                <div className="mt-3 pt-2 border-t border-[rgba(160,190,210,0.06)] flex items-center justify-between text-[11px]">
                  <span className="text-[#8a9ba8] truncate max-w-[200px]">{d.channel}</span>
                  {ra && (
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold ${
                        isP1
                          ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
                          : "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30"
                      }`}
                    >
                      Ocena: {ra.overall_risk_score.toFixed(1)}/10
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel szczegółowego audytu AI */}
        <div className="lg:col-span-7">
          {activeDisclosure && assessment ? (
            <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)] space-y-5">
              {/* Belka oświadczenia */}
              <div className="pb-4 border-b border-[rgba(160,190,210,0.1)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c59b27] uppercase tracking-wider font-mono">
                    {activeDisclosure.entity_name} • {activeDisclosure.disclosure_type}
                  </span>
                  <span className="text-xs text-[#8a9ba8]">
                    Kanał: {activeDisclosure.channel}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{activeDisclosure.title}</h3>
                <div className="mt-3 p-3 rounded bg-[#080d14] border border-[rgba(160,190,210,0.08)] text-xs text-[#8a9ba8] italic">
                  "{activeDisclosure.content}"
                </div>
              </div>

              {/* Matryca Zagrożeń Komunikacyjnych */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                  <MessageSquareWarning className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Matryca zagrożeń komunikacyjnych (Communication Risks)</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2.5 rounded border ${
                      assessment.communication_risks.blad_narracyjny
                        ? "bg-[#ef4444]/10 border-[#ef4444]/30 text-white"
                        : "bg-[#101923] border-[rgba(160,190,210,0.08)] text-[#546675]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      {assessment.communication_risks.blad_narracyjny ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      )}
                      <span>Błąd narracyjny</span>
                    </div>
                    {assessment.communication_risks.szczegoly?.blad_narracyjny && (
                      <p className="mt-1 text-[11px] text-[#8a9ba8]">
                        {assessment.communication_risks.szczegoly.blad_narracyjny}
                      </p>
                    )}
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      assessment.communication_risks.rozdzwiek_z_rzadem
                        ? "bg-[#ef4444]/15 border-[#ef4444]/40 text-white font-bold"
                        : "bg-[#101923] border-[rgba(160,190,210,0.08)] text-[#546675]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      {assessment.communication_risks.rozdzwiek_z_rzadem ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      )}
                      <span>Rozdźwięk z rządem / MAP</span>
                    </div>
                    {assessment.communication_risks.szczegoly?.rozdzwiek_z_rzadem && (
                      <p className="mt-1 text-[11px] text-[#ef4444]">
                        {assessment.communication_risks.szczegoly.rozdzwiek_z_rzadem}
                      </p>
                    )}
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      assessment.communication_risks.zaognienie_konfliktu
                        ? "bg-[#ef4444]/10 border-[#ef4444]/30 text-white"
                        : "bg-[#101923] border-[rgba(160,190,210,0.08)] text-[#546675]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      {assessment.communication_risks.zaognienie_konfliktu ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      )}
                      <span>Zaognienie konfliktu</span>
                    </div>
                    {assessment.communication_risks.szczegoly?.zaognienie_konfliktu && (
                      <p className="mt-1 text-[11px] text-[#8a9ba8]">
                        {assessment.communication_risks.szczegoly.zaognienie_konfliktu}
                      </p>
                    )}
                  </div>

                  <div
                    className={`p-2.5 rounded border ${
                      assessment.communication_risks.ryzyko_regulacyjne_mar
                        ? "bg-[#ef4444]/10 border-[#ef4444]/30 text-white"
                        : "bg-[#101923] border-[rgba(160,190,210,0.08)] text-[#546675]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      {assessment.communication_risks.ryzyko_regulacyjne_mar ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      )}
                      <span>Ryzyko regulacyjne MAR/ESPI</span>
                    </div>
                    {assessment.communication_risks.szczegoly?.ryzyko_regulacyjne_mar && (
                      <p className="mt-1 text-[11px] text-[#8a9ba8]">
                        {assessment.communication_risks.szczegoly.ryzyko_regulacyjne_mar}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sekcja Kluczowa: Rykoszet i Wpływ na Kierownictwo MAP */}
              <div className="p-4 rounded-lg bg-[#1a0f12] border border-[#ef4444]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#ef4444] text-xs font-bold uppercase tracking-wider font-mono">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Ocena uderzenia w kierownictwo MAP (Impact Analysis)</span>
                </div>
                <p className="text-xs text-[#f3f6f9] leading-relaxed">
                  {assessment.map_impact_analysis}
                </p>
              </div>

              {/* Rekomendacja Działań Prewencyjnych */}
              {assessment.recommended_action && (
                <div className="p-4 rounded-lg bg-[#0e1620] border border-[#c59b27]/30 space-y-1.5">
                  <span className="text-[10px] text-[#c59b27] uppercase tracking-wider font-bold font-mono">
                    Rekomendacja dla Departamentu Nadzorczego MAP
                  </span>
                  <p className="text-xs text-white leading-relaxed">
                    {assessment.recommended_action}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
              <p className="text-xs text-[#8a9ba8]">Wybierz oświadczenie, aby wyświetlić audyt ryzyka.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
