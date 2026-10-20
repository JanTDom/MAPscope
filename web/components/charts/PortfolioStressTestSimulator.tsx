"use client";

import React, { useState, useId } from "react";
import {
  Gauge,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap,
  Flame,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  ArrowRight,
} from "lucide-react";

export function PortfolioStressTestSimulator() {
  const etsInputId = useId();
  const brentInputId = useId();
  const wageInputId = useId();

  // Wartości bazowe parametrów szokowych
  const [etsPrice, setEtsPrice] = useState<number>(80); // EUR/t (zakres: 65 - 140)
  const [brentPrice, setBrentPrice] = useState<number>(75); // USD/bbl (zakres: 60 - 120)
  const [wageGrowth, setWageGrowth] = useState<number>(5); // % r/r (zakres: 0 - 18)

  // Predefiniowane scenariusze szokowe
  const applyPreset = (preset: "baseline" | "ets_shock" | "stagflation" | "cooling") => {
    switch (preset) {
      case "baseline":
        setEtsPrice(80);
        setBrentPrice(75);
        setWageGrowth(5);
        break;
      case "ets_shock":
        setEtsPrice(135);
        setBrentPrice(85);
        setWageGrowth(7);
        break;
      case "stagflation":
        setEtsPrice(115);
        setBrentPrice(110);
        setWageGrowth(15);
        break;
      case "cooling":
        setEtsPrice(68);
        setBrentPrice(62);
        setWageGrowth(3);
        break;
    }
  };

  // Wyliczenia symulacyjne wpływu na portfel SSP
  // Baza: 384,5 mld PLN majątku, 482,6 mld PLN obrotu, 18,4 mld PLN planu dywidend
  const etsDelta = etsPrice - 80; // Każde +10 EUR to ok. -0.85 mld PLN EBITDA sektora energetycznego
  const brentDelta = brentPrice - 75; // Każde +10 USD to ok. +0.4 mld w rafinacji, ale -0.3 mld w chemii
  const wageDelta = wageGrowth - 5; // Każdy +1% to ok. -0.42 mld PLN w portfelu 412k pracowników

  const ebitdaImpactMld = Number(
    (-etsDelta * 0.085 + brentDelta * 0.015 - wageDelta * 0.42).toFixed(2)
  );

  const baseDividends = 18.4;
  const simulatedDividends = Math.max(
    4.5,
    Number((baseDividends + ebitdaImpactMld * 0.45).toFixed(2))
  );

  const distressedEntitiesCount = Math.max(
    4,
    Math.min(48, Math.round(11 + (etsDelta > 0 ? etsDelta * 0.25 : 0) + (wageDelta > 0 ? wageDelta * 1.5 : 0)))
  );

  const isCriticalLoss = ebitdaImpactMld < -3.0;

  return (
    <div className="bg-[#090e14] border border-[rgba(159,186,199,0.18)] rounded-xl p-6 shadow-2xl space-y-6">
      {/* Nagłówek Symulatora */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono">
              Centrum Testów Szokowych i Odporności Portfela SSP (Stress-Test MAP)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamiczna symulacja wpływu wstrząsów makroekonomicznych i regulacyjnych na rentowność 406 spółek Skarbu Państwa oraz dywidendy dla Budżetu
          </p>
        </div>

        {/* Przyciski predefiniowanych scenariuszy szokowych */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Status Quo
          </button>
          <button
            type="button"
            onClick={() => applyPreset("ets_shock")}
            className="px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-900/40 text-[11px] font-semibold text-red-300 border border-red-500/40 transition-colors"
          >
            Szok CO2 (135 €)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("stagflation")}
            className="px-2.5 py-1.5 rounded bg-amber-950/40 hover:bg-amber-900/40 text-[11px] font-semibold text-amber-300 border border-amber-500/40 transition-colors"
          >
            Stagflacja & Płace
          </button>
          <button
            type="button"
            onClick={() => applyPreset("cooling")}
            className="px-2.5 py-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/40 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40 transition-colors"
          >
            Uspokojenie rynku
          </button>
        </div>
      </div>

      {/* Górny Pasek Wyników Symulacji (Wpływ na EBITDA, Dywidendy i Spółki Zagrożone) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Wpływ na EBITDA */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          ebitdaImpactMld < 0
            ? "bg-red-950/20 border-red-500/40"
            : "bg-emerald-950/20 border-emerald-500/40"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
              Wpływ na EBITDA Portfela
            </span>
            {ebitdaImpactMld < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="text-2xl font-black font-mono mt-2" style={{
            color: ebitdaImpactMld < 0 ? "#f87171" : "#34d399"
          }}>
            {ebitdaImpactMld > 0 ? `+${ebitdaImpactMld}` : ebitdaImpactMld} <span className="text-xs font-normal text-slate-400">mld PLN</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Odchylenie od rocznego planu EBITDA spółek
          </p>
        </div>

        {/* 2. Dywidendy do Budżetu */}
        <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
              Dywidendy dla Budżetu Państwa
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">
            {simulatedDividends.toFixed(2)} <span className="text-xs font-normal text-slate-400">mld PLN</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Plan ustawowy: 18,40 mld PLN (odchylenie: {(simulatedDividends - 18.4).toFixed(2)} mld)
          </p>
        </div>

        {/* 3. Spółki pod presją płynnościową */}
        <div className="p-4 rounded-xl border bg-slate-950 border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
              Podmioty z Ujemnym Wynikiem Netto
            </span>
            <AlertTriangle className={`w-4 h-4 ${distressedEntitiesCount > 15 ? "text-red-400" : "text-amber-400"}`} />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-2">
            {distressedEntitiesCount} <span className="text-xs font-normal text-slate-400">spółek (z 406)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Wymagające natychmiastowych pakietów ratunkowych MAP
          </p>
        </div>
      </div>

      {/* Suwaki Parametrów Szokowych */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/80 p-5 rounded-xl border border-slate-800/80">
        {/* Suwak 1: Uprawnienia CO2 (ETS) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={etsInputId} className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Cena CO2 (EU ETS)</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {etsPrice} EUR/t
            </span>
          </div>
          <input
            id={etsInputId}
            type="range"
            min="65"
            max="140"
            step="5"
            value={etsPrice}
            onChange={(e) => setEtsPrice(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>65 EUR</span>
            <span>Baza: 80 EUR</span>
            <span>140 EUR (Szok)</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Wpływa bezpośrednio na marże wytwórcze PGE, Enei, Tauronu oraz koszty instalacji nawozowych Grupy Azoty.
          </p>
        </div>

        {/* Suwak 2: Cena Ropy Brent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={brentInputId} className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Ropa Brent (USD/bbl)</span>
            </label>
            <span className="text-xs font-mono font-bold text-blue-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {brentPrice} USD
            </span>
          </div>
          <input
            id={brentInputId}
            type="range"
            min="60"
            max="120"
            step="5"
            value={brentPrice}
            onChange={(e) => setBrentPrice(Number(e.target.value))}
            className="w-full accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>60 USD</span>
            <span>Baza: 75 USD</span>
            <span>120 USD (Kryzys)</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Wpływa na zyski rafineryjne i zapasy paliwowe ORLEN S.A., obroty PERN oraz koszty transportu PKP Cargo.
          </p>
        </div>

        {/* Suwak 3: Presja Płacowa w SSP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor={wageInputId} className="text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer">
              <Scale className="w-3.5 h-3.5 text-red-400" />
              <span>Wzrost Płac w SSP (% r/r)</span>
            </label>
            <span className="text-xs font-mono font-bold text-red-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              +{wageGrowth}% r/r
            </span>
          </div>
          <input
            id={wageInputId}
            type="range"
            min="0"
            max="18"
            step="1"
            value={wageGrowth}
            onChange={(e) => setWageGrowth(Number(e.target.value))}
            className="w-full accent-red-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Zamrożenie)</span>
            <span>Baza: +5%</span>
            <span>+18% (Eskalacja)</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Presja 14 związków zawodowych w JSW, Poczcie Polskiej, PKP Cargo i KGHM (fundusz płac: ok. 42 mld PLN).
          </p>
        </div>
      </div>

      {/* Rekomendowany Pakiet Działań Zarządczych dla Ministra */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block tracking-wider">
          Protokół Interwencji Właścicielskiej MAP dla Wybranego Scenariusza:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <strong className="text-white block font-semibold mb-0.5">1. Blokada dywidend w spółkach deficytowych</strong>
            Wstrzymanie wypłat w podmiotach o wskaźniku Dług Netto/EBITDA &gt; 3.0x w celu ochrony płynności operacyjnej.
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <strong className="text-white block font-semibold mb-0.5">2. Weryfikacja harmonogramu CAPEX</strong>
            Przesunięcie wydatków niekrytycznych o min. 15% w segmencie dystrybucyjnym i odnawialnym na rok kolejny.
          </div>
          <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <strong className="text-white block font-semibold mb-0.5">3. Wniosek do KPRM o derogację ETS</strong>
            Wystąpienie Ministra do Premiera i Brukseli o mechanizm osłonowy dla przemysłu energochłonnego (art. 10a).
          </div>
        </div>
      </div>
    </div>
  );
}
