"use client";

import React, { useState } from "react";
import { Lock, ArrowRight, ShieldAlert, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface AuthScreenProps {
  onSuccess: () => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    if (password === "MWB2026") {
      // Celowy brak trwałego zapisu w localStorage / sessionStorage:
      // Każde nowe wejście lub odświeżenie strony bezwzględnie wymaga ponownego wprowadzenia hasła.
      setTimeout(() => {
        setPassword("");
        onSuccess();
      }, 150);
    } else {
      setError(true);
      setErrorMessage("Nieprawidłowe hasło autoryzacyjne. Dostęp zastrzeżony.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070a0d] map-glow-bg select-none p-4">
      {/* Karta autoryzacji */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#0d1318] border border-[rgba(159,186,199,0.18)] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Duże Logo MAPscope */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <img
              src="/mapscope-logo-darkmode.png"
              alt="MAPscope Logo"
              className="h-16 w-auto max-w-[280px] object-contain drop-shadow-[0_4px_24px_rgba(87,224,197,0.25)]"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#57e0c5]/10 border border-[#57e0c5]/25 text-[10px] font-mono text-[#57e0c5] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57e0c5] animate-pulse" />
            <span>Dostęp Niejawny • Ministerstwo Aktywów Państwowych</span>
          </div>

          <p className="text-xs text-[#8e9da7] max-w-xs leading-relaxed">
            Zintegrowany System Nadzoru Właścicielskiego, Radaru Ryzyk i Oceny Komunikacji 406 Spółek Skarbu Państwa.
          </p>
        </div>

        {/* Formularz wprowadzania hasła */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8e9da7] mb-2">
              Klucz dostępu (Hasło strefowe):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-[#5d6b74]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                autoComplete="new-password"
                name="mapscope_access_key"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Wprowadź hasło dostępu..."
                className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#111a21] text-white text-sm font-mono focus:outline-none transition-all ${
                  error
                    ? "border border-[#ff7f87] ring-1 ring-[#ff7f87]"
                    : "border border-[rgba(159,186,199,0.18)] focus:border-[#57e0c5] focus:ring-1 focus:ring-[#57e0c5]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5d6b74] hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-[#ff7f87]/15 border border-[#ff7f87]/30 text-xs text-[#ff7f87] flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full py-3 px-4 rounded-xl bg-[#57e0c5] text-[#070a0d] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#6ef0d7] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#57e0c5]/10"
          >
            <span>Autoryzuj wejście do systemu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Stopka bezpieczeństwa */}
        <div className="pt-4 border-t border-[rgba(159,186,199,0.1)] text-center text-[10px] text-[#5d6b74] font-mono space-y-1">
          <div>PROTOKÓŁ BEZPIECZEŃSTWA MAP • STANDARD FABLE 5.1</div>
          <div>Certyfikowana sesja analityczna Departamentu Nadzoru</div>
        </div>
      </div>
    </div>
  );
}
