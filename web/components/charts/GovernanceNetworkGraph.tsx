"use client";

import React, { useState } from "react";
import { GOVERNANCE_NETWORK_DATA } from "@/lib/mapscope-data";
import { GovernanceNetworkNode, GovernanceNetworkEdge } from "@/lib/types";
import {
  Users,
  Building2,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  GitBranch,
  ArrowRight,
  Scale,
  FileText,
} from "lucide-react";

export function GovernanceNetworkGraph() {
  const [viewMode, setViewMode] = useState<"matrix" | "diagram">("matrix");
  const [selectedNode, setSelectedNode] = useState<GovernanceNetworkNode>(
    GOVERNANCE_NETWORK_DATA.nodes.find((n) => n.art19ViolationRisk) || GOVERNANCE_NETWORK_DATA.nodes[0]
  );
  const [filterOnlyViolations, setFilterOnlyViolations] = useState(false);

  const { nodes, edges } = GOVERNANCE_NETWORK_DATA;

  const companies = nodes.filter((n) => n.type === "company");
  const people = nodes.filter((n) => n.type === "person");

  // Pobranie przypisań osób do danej spółki
  const getCompanyMembers = (companyId: string) => {
    const relevantEdges = edges.filter((e) => e.target === companyId);
    return relevantEdges.map((e) => {
      const personNode = people.find((p) => p.id === e.source)!;
      return {
        edge: e,
        person: personNode,
      };
    });
  };

  // Pobranie spółek, w których zasiada dana osoba
  const getPersonCompanies = (personId: string) => {
    const relevantEdges = edges.filter((e) => e.source === personId);
    return relevantEdges.map((e) => {
      const companyNode = companies.find((c) => c.id === e.target)!;
      return {
        edge: e,
        company: companyNode,
      };
    });
  };

  const violationCount = people.filter((p) => p.art19ViolationRisk).length;

  return (
    <div className="bg-[#0b1016] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
      {/* Pasek Tytułowy */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono">
              Audyt Wieloetatowości Rad Nadzorczych i Unii Holdingowych (Art. 19a)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weryfikacja ustawowego zakazu zasiadania w więcej niż jednej radzie nadzorczej z ramienia Skarbu Państwa oraz powiązań kapitałowych
          </p>
        </div>

        {/* Przełącznik widoków: Kafelkowa Matryca Rad vs Schemat Blokowy */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "matrix"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Karty spółek i rad</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("diagram")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "diagram"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Schemat powiązań</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFilterOnlyViolations(!filterOnlyViolations)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
              filterOnlyViolations
                ? "bg-red-500 text-white border-red-400 shadow-md shadow-red-500/30"
                : "bg-slate-900 text-red-400 border-red-500/40 hover:bg-red-500/10"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Alerty Art. 19a ({violationCount})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEWA KOLUMNA: GŁÓWNA STRUKTURA NADZORU (BEZ ŻADNYCH KÓŁEK) */}
        <div className="lg:col-span-8 space-y-4">
          {viewMode === "matrix" ? (
            /* WIDOK 1: MATRYCA SPÓŁEK I SKŁADÓW RAD NADZORCZYCH */
            <div className="space-y-4">
              {companies.map((company) => {
                const members = getCompanyMembers(company.id);
                const hasViolation = members.some((m) => m.person.art19ViolationRisk);

                if (filterOnlyViolations && !hasViolation) return null;

                return (
                  <div
                    key={company.id}
                    className={`bg-slate-950 p-4 rounded-xl border transition-all ${
                      hasViolation
                        ? "border-red-500/50 shadow-lg shadow-red-500/5"
                        : "border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <Building2 className={`w-4 h-4 ${hasViolation ? "text-red-400" : "text-blue-400"}`} />
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wide">{company.label}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Podmiot kluczowy Skarbu Państwa • {members.length} monitorowanych członków RN
                          </span>
                        </div>
                      </div>

                      {hasViolation && (
                        <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase font-mono flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3 text-red-400" />
                          <span>Zagrożenie Art. 19a</span>
                        </span>
                      )}
                    </div>

                    {/* Lista członków rady nadzorczej spółki */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      {members.map(({ person, edge }) => {
                        const isSelected = selectedNode.id === person.id;
                        const isViolation = person.art19ViolationRisk;

                        return (
                          <div
                            key={person.id}
                            onClick={() => setSelectedNode(person)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-slate-900 border-blue-500 ring-1 ring-blue-500/50 shadow-md"
                                : isViolation
                                ? "bg-red-950/20 border-red-500/40 hover:bg-red-950/30"
                                : "bg-[#070c12] border-slate-800 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{person.label}</span>
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                  isViolation
                                    ? "bg-red-500/20 text-red-300 border-red-500/40"
                                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                }`}
                              >
                                {person.entityCount ?? 1} {(person.entityCount ?? 1) > 1 ? "rady SP" : "rada SP"}
                              </span>
                            </div>

                            <span className="text-[11px] text-slate-300 font-medium block mt-1">
                              {edge.role}
                            </span>

                            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Organ: {edge.delegatingBody}</span>
                              <span className="font-mono text-slate-500">{edge.sinceDate}</span>
                            </div>

                            {isViolation && (
                              <div className="mt-2 text-[10px] text-red-300 font-semibold flex items-center gap-1 bg-red-950/50 p-1.5 rounded border border-red-500/30">
                                <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                                <span>Łamie limit Art. 19a (zasiada też w innej radzie SP!)</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* WIDOK 2: RELACYJNY SCHEMAT BLOKOWY Z ORTOGONALNYMI ŚCIEŻKAMI (BEZ ŻADNYCH KÓŁEK) */
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block pb-2 border-b border-slate-800">
                Powiązania personalne członków rad nadzorczych z grupami kapitałowymi:
              </span>

              <div className="space-y-3">
                {people.map((person) => {
                  const companyAssignments = getPersonCompanies(person.id);
                  const isViolation = person.art19ViolationRisk;
                  const isSelected = selectedNode.id === person.id;

                  return (
                    <div
                      key={person.id}
                      onClick={() => setSelectedNode(person)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 border-blue-500 ring-1 ring-blue-500/50 shadow-md"
                          : isViolation
                          ? "bg-red-950/20 border-red-500/40 hover:bg-red-950/30"
                          : "bg-[#070c12] border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <Users className={`w-4 h-4 ${isViolation ? "text-red-400" : "text-emerald-400"}`} />
                          <span className="text-xs font-bold text-white">{person.label}</span>
                          <span className="text-[10px] text-slate-400">• {person.role}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border self-start sm:self-auto ${
                            isViolation
                              ? "bg-red-500/20 text-red-300 border-red-500/40"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {isViolation ? "Naruszenie Art. 19a (2 mandaty)" : "Zgodny z ustawą (1 mandat)"}
                        </span>
                      </div>

                      {/* Docelowe spółki i relacje */}
                      <div className="mt-3 space-y-2">
                        {companyAssignments.map(({ company, edge }, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-blue-400" />
                              <strong className="text-slate-200">{company.label}</strong>
                              <span className="text-slate-400 font-mono text-[10px]">({edge.role})</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Delegacja: {edge.delegatingBody}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* PRAWA KOLUMNA: DOSSIER PRAWNE I INSTRUKCJA DLA MINISTRA */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400 font-mono">
                  Dossier Audytowe • Art. 19a
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">{selectedNode.label}</h4>
              </div>

              {selectedNode.art19ViolationRisk ? (
                <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono">
                  Zagrożenie Prawne
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono">
                  Zgodny
                </span>
              )}
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Główna funkcja</span>
                <span className="text-white font-medium text-xs mt-0.5 block">{selectedNode.role || "Przedstawiciel organu nadzorczego"}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Liczba rad nadzorczych z ramienia SP</span>
                <span
                  className={`text-xl font-bold font-mono ${
                    selectedNode.art19ViolationRisk ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {selectedNode.entityCount ?? 1} <span className="text-xs font-normal text-slate-400">/ 1 dopuszczalna</span>
                </span>
              </div>

              {selectedNode.art19ViolationRisk ? (
                <div className="bg-red-950/40 border border-red-800/60 p-3.5 rounded-lg text-red-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-red-300">
                    <Scale className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Ryzyko nieważności podejmowanych uchwał:</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Zgodnie z art. 19a ust. 1 ustawy z dnia 16 grudnia 2016 r. o zasadach zarządzania mieniem państwowym,
                    ta sama osoba może być wskazana jako członek rady nadzorczej tylko w jednej spółce z udziałem Skarbu Państwa.
                    Zasiadanie jednocześnie w radzie ORLEN S.A. oraz Polskiej Grupy Zbrojeniowej S.A. rodzi ryzyko zaskarżenia uchwał obu rad.
                  </p>
                  <div className="pt-2 border-t border-red-500/30 text-[10px] font-bold uppercase text-red-400 font-mono">
                    Rekomendacja dla Ministra: Żądanie natychmiastowego zrzeczenia się jednego mandatu.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-lg text-emerald-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stan prawny w pełni prawidłowy:</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Mandat wykonywany zgodnie z ustawowym limitem. Brak kolizji interesów i brak unii personalnych z podmiotami powiązanymi.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Dziennik Ustaw 2024 poz. 125</span>
            <span>ART. 19A USTAWY O SP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
