"use client";

import React from "react";
import { Landmark, FileQuestion, ShieldAlert, CheckCircle, Scale, Building } from "lucide-react";

export function MapZonePanel() {
  const departments = [
    {
      name: "Departament Spółek Strategicznych",
      scope: "ORLEN S.A., KGHM Polska Miedź S.A., PGE S.A., PZU S.A., PKO Bank Polski S.A., HSW S.A.",
      activeAlerts: 1,
      status: "Nadzór podwyższony (komunikacja MAR / inwestycje)",
      color: "border-[#f59e0b]/40 bg-[#f59e0b]/5",
    },
    {
      name: "Departament Nadzoru I",
      scope: "Totalizator Sportowy Sp. z o.o., Krajowa Grupa Spożywcza S.A., Kopalnia Soli 'Wieliczka' S.A.",
      activeAlerts: 1,
      status: "Stan alarmowy P1 (kontrola poselska, dymisje)",
      color: "border-[#ef4444]/40 bg-[#ef4444]/10",
    },
    {
      name: "Departament Nadzoru II",
      scope: "Poczta Polska S.A., PKP CARGO S.A. w restrukturyzacji, spółki regionalne w likwidacji",
      activeAlerts: 2,
      status: "Stan ostrzegawczy P2 (spory ze związkami, restrukturyzacja)",
      color: "border-[#f59e0b]/40 bg-[#f59e0b]/5",
    },
  ];

  const inquiries = [
    {
      id: "int-1",
      number: "Interpelacja nr 4812",
      subject: "W sprawie trybu powoływania dyrektorów regionalnych w Totalizatorze Sportowym",
      author: "Posłowie Klubu Parlamentarnego",
      addressed_to: "Minister Aktywów Państwowych",
      deadline: "2026-10-27 (7 dni do odpowiedzi)",
      status: "Wymaga pilnego przygotowania stanowiska MAP",
      severity: "critical",
    },
    {
      id: "int-2",
      number: "Zapytanie poselskie nr 1198",
      subject: "W sprawie ochrony praw pracowniczych w toku restrukturyzacji PKP CARGO S.A.",
      author: "Komisja Infrastruktury",
      addressed_to: "Minister Aktywów Państwowych / Minister Infrastruktury",
      deadline: "2026-10-31",
      status: "Koordynacja z Ministerstwem Infrastruktury",
      severity: "high",
    },
    {
      id: "int-3",
      number: "Kontrola NIK w toku",
      subject: "Prawidłowość nadzoru właścicielskiego nad realizacją kluczowych inwestycji w spółkach energetycznych",
      author: "Najwyższa Izba Kontroli (NIK)",
      addressed_to: "Kierownictwo MAP i Departament Spółek Strategicznych",
      deadline: "Raport w I kwartale 2027",
      status: "Przekazano dokumentację nadzorczą",
      severity: "standard",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Nagłówek strefy */}
      <div className="p-4 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#101923] border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27]">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Strefa MAP — Ochrona Nadzoru Właścicielskiego i Kierownictwa Resortu
            </h2>
            <p className="text-xs text-[#8a9ba8]">
              Monitorowanie zapytań sejmowych, kontroli NIK/CBA oraz przygotowanie prewencyjnych linii obrony
            </p>
          </div>
        </div>
      </div>

      {/* Podział na departamenty nadzoru MAP */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Stan nadzoru w departamentach MAP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div
              key={dept.name}
              className={`p-4 rounded-lg border ${dept.color} space-y-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white">{dept.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101923] text-white">
                  {dept.activeAlerts} alerty
                </span>
              </div>
              <p className="text-[11px] text-[#8a9ba8]">{dept.scope}</p>
              <div className="pt-2 border-t border-[rgba(160,190,210,0.08)] text-[11px] font-medium text-white">
                {dept.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interpelacje poselskie i kontrole uderzające w MAP */}
      <div className="p-5 rounded-lg bg-[#0b1118] border border-[rgba(160,190,210,0.12)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(160,190,210,0.08)]">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-[#c59b27]" />
            <h3 className="text-sm font-semibold text-white">
              Interpelacje sejmowe i postępowania kontrolne
            </h3>
          </div>
          <span className="text-xs text-[#8a9ba8] font-mono">
            {inquiries.length} aktywnych spraw
          </span>
        </div>

        <div className="space-y-3">
          {inquiries.map((inq) => {
            const isCritical = inq.severity === "critical";
            return (
              <div
                key={inq.id}
                className="p-3.5 rounded bg-[#101923] border border-[rgba(160,190,210,0.08)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#c59b27]">
                      {inq.number}
                    </span>
                    <span className="text-[11px] text-[#8a9ba8]">
                      Wnioskodawca: {inq.author}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isCritical
                        ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
                        : "bg-[#f59e0b]/20 text-[#f59e0b]"
                    }`}
                  >
                    {inq.deadline}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-white">{inq.subject}</h4>

                <div className="pt-2 border-t border-[rgba(160,190,210,0.06)] flex items-center justify-between text-[11px]">
                  <span className="text-[#8a9ba8]">Adresat: {inq.addressed_to}</span>
                  <span className="text-[#75b8ff] font-medium">{inq.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
