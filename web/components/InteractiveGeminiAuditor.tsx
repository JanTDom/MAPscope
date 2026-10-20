"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  FileText,
  CornerDownRight,
  TrendingDown,
  Building2,
} from "lucide-react";
import { ALL_ENTITIES_REGISTRY } from "@/lib/all-ssp-registry.ts";

interface AuditResult {
  overall_risk_score: number;
  severity: "p1_critical" | "p2_high" | "p3_moderate" | "low" | "neutral";
  communication_risks: {
    blad_narracyjny: boolean;
    rozdzwiek_z_rzadem: boolean;
    zaognienie_konfliktu: boolean;
    ryzyko_regulacyjne_mar: boolean;
    szczegoly?: Record<string, string>;
  };
  governance_risks: {
    kadry_spory: boolean;
    kontrole_sledztwa: boolean;
    finanse_plynnosc: boolean;
    infrastruktura_awarie: boolean;
    narracja_polityczna: boolean;
    szczegoly?: Record<string, string>;
  };
  executive_summary: string;
  map_impact_analysis: string;
  recommended_action: string;
}

const PRESET_TEMPLATES = [
  {
    label: "PKP Cargo • Spór pracowniczy",
    entity: "PKP CARGO S.A. W RESTRUKTURYZACJI",
    speaker: "Zarząd Spółki",
    materialType: "Oświadczenie zarządu",
    title: "Komunikat w sprawie porozumień ze stroną społeczną",
    text: "Zarząd spółki informuje, że roszczenia płacowe wysuwane przez związki zawodowe są całkowicie bezzasadne i oderwane od realiów rynkowych. Jeżeli strona społeczna nie zrezygnuje z ultimatum do końca tygodnia, spółka jednostronnie zawiesi wypłaty świadczeń socjalnych i skieruje sprawę do prokuratury z zarzutem działania na szkodę przedsiębiorstwa. Nie przewidujemy żadnych dalszych ustępstw.",
  },
  {
    label: "Orlen • Rewizja projektów OZE",
    entity: "ORLEN S.A.",
    speaker: "Rzecznik Prasowy",
    materialType: "Wywiad prasowy",
    title: "Ocena rentowności morskich farm wiatrowych",
    text: "Dotychczasowe deklaracje dotyczące tempa transformacji energetycznej były motywowane politycznie, a nie rachunkiem ekonomicznym. W obecnych warunkach makroekonomicznych realizacja harmonogramu narzuconego przez poprzednie kierownictwo rządu grozi utratą płynności przez grupę. Rozważamy wstrzymanie lub zamrożenie części projektów na Bałtyku bez oglądania się na wytyczne ministerialne.",
  },
  {
    label: "Poczta Polska • Restrukturyzacja placówek",
    entity: "POCZTA POLSKA S.A.",
    speaker: "Prezes Zarządu",
    materialType: "Wpis w mediach społecznościowych",
    title: "Pilna optymalizacja sieci placówek w gminach wiejskich",
    text: "Utrzymywanie deficytowych placówek w małych miejscowościach to anachronizm. Poczta nie może być zakładem opieki społecznej. Od przyszłego miesiąca zamykamy kolejne 120 punktów w Polsce wschodniej, a klienci powinni przyzwyczaić się do korzystania z aplikacji mobilnej. Protesty samorządowców uznajemy za folklor polityczny.",
  },
];

export function InteractiveGeminiAuditor() {
  const [selectedEntityName, setSelectedEntityName] = useState<string>(
    PRESET_TEMPLATES[0].entity
  );
  const [speaker, setSpeaker] = useState<string>(PRESET_TEMPLATES[0].speaker);
  const [materialType, setMaterialType] = useState<string>(
    PRESET_TEMPLATES[0].materialType
  );
  const [title, setTitle] = useState<string>(PRESET_TEMPLATES[0].title);
  const [text, setText] = useState<string>(PRESET_TEMPLATES[0].text);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const matchedEntity = ALL_ENTITIES_REGISTRY.find(
    (e) => e.name.toLowerCase() === selectedEntityName.toLowerCase()
  );

  const handleApplyTemplate = (tmpl: (typeof PRESET_TEMPLATES)[0]) => {
    setSelectedEntityName(tmpl.entity);
    setSpeaker(tmpl.speaker);
    setMaterialType(tmpl.materialType);
    setTitle(tmpl.title);
    setText(tmpl.text);
    setError(null);
  };

  const handleRunAudit = async () => {
    if (!text.trim()) {
      setError("Wprowadź treść materiału do audytu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityName: selectedEntityName,
          sharePercent: matchedEntity?.state_share_percent ? `${matchedEntity.state_share_percent}%` : "50%+",
          ownershipBody: matchedEntity?.ownership_body ?? "Ministerstwo Aktywów Państwowych",
          sector: matchedEntity?.sector ?? "Sektor Strategiczny",
          materialType,
          speaker,
          title,
          text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas analizy.");
      }

      setResult(data.audit as AuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd połączenia z silnikiem AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-5">
      {/* Nagłówek sekcji */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(159,186,199,0.1)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#57e0c5]/10 border border-[#57e0c5]/30 text-[#57e0c5]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Audytor Ryzyka na Żywo (Silnik Gemini 2.5)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#57e0c5]/15 text-[#57e0c5] border border-[#57e0c5]/30">
                LIVE API
              </span>
            </h2>
            <p className="text-xs text-[#8e9da7]">
              Wklej treść nowego oświadczenia lub wywiadu i uruchom natychmiastową weryfikację luk narracyjnych i rykoszetu dla MAP.
            </p>
          </div>
        </div>

        {/* Szablony kryzysowe */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-[#8e9da7] uppercase font-mono mr-1">
            Szablony:
          </span>
          {PRESET_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyTemplate(tmpl)}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-[#8e9da7] hover:text-white hover:border-[#57e0c5]/40 transition-colors whitespace-nowrap"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formularz wejściowy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-[#8e9da7] mb-1 font-mono uppercase text-[10px]">
            Spółka Skarbu Państwa (z 406 podmiotów):
          </label>
          <input
            type="text"
            list="entities-list"
            value={selectedEntityName}
            onChange={(e) => setSelectedEntityName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white focus:outline-none focus:border-[#57e0c5]"
            placeholder="np. ORLEN S.A."
          />
          <datalist id="entities-list">
            {ALL_ENTITIES_REGISTRY.slice(0, 50).map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-[#8e9da7] mb-1 font-mono uppercase text-[10px]">
            Osoba wypowiadająca się / Mówca:
          </label>
          <input
            type="text"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white focus:outline-none focus:border-[#57e0c5]"
            placeholder="np. Prezes Zarządu"
          />
        </div>

        <div>
          <label className="block text-[#8e9da7] mb-1 font-mono uppercase text-[10px]">
            Typ materiału:
          </label>
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white focus:outline-none focus:border-[#57e0c5]"
          >
            <option value="Oświadczenie zarządu">Oświadczenie zarządu</option>
            <option value="Wywiad prasowy">Wywiad prasowy</option>
            <option value="Wpis w mediach społecznościowych">Wpis w mediach społecznościowych (X/LinkedIn)</option>
            <option value="Komunikat giełdowy ESPI">Komunikat giełdowy ESPI</option>
            <option value="Artykuł kryzysowy w mediach">Artykuł kryzysowy w mediach</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[#8e9da7] mb-1 font-mono uppercase text-[10px]">
          Tytuł materiału lub nagłówek oświadczenia:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white text-xs focus:outline-none focus:border-[#57e0c5]"
          placeholder="Wprowadź nagłówek komunikatu..."
        />
      </div>

      <div>
        <label className="block text-[#8e9da7] mb-1 font-mono uppercase text-[10px]">
          Pełna treść komunikatu / oświadczenia:
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-[#57e0c5]"
          placeholder="Wklej tutaj treść oświadczenia prasowego lub wywiadu..."
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-[11px] text-[#8e9da7]">
          Silnik wykorzystuje API Google Gemini z surowym promptem audytora MAPscope.
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleRunAudit}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#57e0c5] text-[#070a0d] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#6ef0d7] transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Audytowanie przez Gemini 2.5...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Uruchom audyt ryzyka Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* Komunikat o błędzie */}
      {error && (
        <div className="p-3 rounded-lg bg-[#ff7f87]/15 border border-[#ff7f87]/30 text-xs text-[#ff7f87] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Karta Wyników Audytu */}
      {result && (
        <div className="p-5 rounded-xl bg-[#111a21] border border-[#57e0c5]/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(159,186,199,0.1)]">
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-mono font-bold px-3 py-1.5 rounded-lg border ${
                  result.overall_risk_score >= 8
                    ? "bg-[#ff7f87]/20 border-[#ff7f87]/40 text-[#ff7f87]"
                    : result.overall_risk_score >= 5
                    ? "bg-[#f6c56b]/20 border-[#f6c56b]/40 text-[#f6c56b]"
                    : "bg-[#57e0c5]/20 border-[#57e0c5]/40 text-[#57e0c5]"
                }`}
              >
                {result.overall_risk_score.toFixed(1)} / 10
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#8e9da7]">
                  Ocena Końcowa Ryzyka Komunikacyjnego
                </div>
                <div className="text-xs font-bold text-white uppercase font-mono">
                  Priorytet: {result.severity.toUpperCase()}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#57e0c5] bg-[#57e0c5]/10 px-2 py-1 rounded border border-[#57e0c5]/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Audyt ukończony przez Gemini 2.5</span>
            </span>
          </div>

          {/* Matryca flag ryzyka */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              className={`p-2.5 rounded-lg border text-xs ${
                result.communication_risks.blad_narracyjny
                  ? "bg-[#ff7f87]/15 border-[#ff7f87]/30 text-[#ff7f87]"
                  : "bg-[#0d1318] border-[rgba(159,186,199,0.1)] text-[#8e9da7]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Błąd narracyjny</div>
              <div className="font-bold font-mono">
                {result.communication_risks.blad_narracyjny ? "WYKRYTO" : "Brak"}
              </div>
            </div>

            <div
              className={`p-2.5 rounded-lg border text-xs ${
                result.communication_risks.rozdzwiek_z_rzadem
                  ? "bg-[#ff7f87]/15 border-[#ff7f87]/30 text-[#ff7f87]"
                  : "bg-[#0d1318] border-[rgba(159,186,199,0.1)] text-[#8e9da7]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Rozdźwięk z rządem/MAP</div>
              <div className="font-bold font-mono">
                {result.communication_risks.rozdzwiek_z_rzadem ? "WYKRYTO" : "Brak"}
              </div>
            </div>

            <div
              className={`p-2.5 rounded-lg border text-xs ${
                result.communication_risks.zaognienie_konfliktu
                  ? "bg-[#ff7f87]/15 border-[#ff7f87]/30 text-[#ff7f87]"
                  : "bg-[#0d1318] border-[rgba(159,186,199,0.1)] text-[#8e9da7]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Zaognienie konfliktu</div>
              <div className="font-bold font-mono">
                {result.communication_risks.zaognienie_konfliktu ? "WYKRYTO" : "Brak"}
              </div>
            </div>

            <div
              className={`p-2.5 rounded-lg border text-xs ${
                result.communication_risks.ryzyko_regulacyjne_mar
                  ? "bg-[#ff7f87]/15 border-[#ff7f87]/30 text-[#ff7f87]"
                  : "bg-[#0d1318] border-[rgba(159,186,199,0.1)] text-[#8e9da7]"
              }`}
            >
              <div className="text-[10px] font-mono uppercase">Ryzyko regulacyjne MAR</div>
              <div className="font-bold font-mono">
                {result.communication_risks.ryzyko_regulacyjne_mar ? "WYKRYTO" : "Brak"}
              </div>
            </div>
          </div>

          {/* Synteza i rykoszet w MAP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#75b8ff] font-bold block">
                Synteza zdarzenia i kryzysu
              </span>
              <p className="text-[#8e9da7] leading-relaxed">
                {result.executive_summary}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0d1318] border border-[#ff7f87]/30 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff7f87] font-bold block flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Bezpośredni rykoszet w MAP i kierownictwo</span>
              </span>
              <p className="text-white leading-relaxed">
                {result.map_impact_analysis}
              </p>
            </div>
          </div>

          {/* Rekomendacja dla departamentu nadzoru */}
          <div className="p-3.5 rounded-lg bg-[#57e0c5]/10 border border-[#57e0c5]/30 flex items-start gap-3">
            <CornerDownRight className="w-4 h-4 text-[#57e0c5] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#57e0c5] font-bold block">
                Rekomendowany krok operacyjny dla Departamentu Nadzoru MAP:
              </span>
              <p className="text-white font-medium leading-relaxed">
                {result.recommended_action}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
