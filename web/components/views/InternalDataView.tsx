"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Lock,
  ShieldCheck,
  Upload,
  Trash2,
  Plus,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { EntityRecord, InternalDataEntry } from "@/lib/types.ts";

interface InternalDataViewProps {
  entities: EntityRecord[];
  internalData: Record<string, InternalDataEntry>;
  onUpdateInternalData: (data: Record<string, InternalDataEntry>) => void;
  onOpenDossier: (entityId: string) => void;
}

export function InternalDataView({
  entities,
  internalData,
  onUpdateInternalData,
  onOpenDossier,
}: InternalDataViewProps) {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(entities[0]?.id || "");
  const [noteInput, setNoteInput] = useState<string>("");
  const [fileNumberInput, setFileNumberInput] = useState<string>("");
  const [bulkTextInput, setBulkTextInput] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dodanie ręcznej notatki
  const handleAddManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const existing = internalData[selectedEntityId] || {
      entityId: selectedEntityId,
      internalKpis: {},
      notes: [],
      inspectionFileNumbers: [],
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...existing.notes, noteInput.trim()];
    const updatedFiles = fileNumberInput.trim()
      ? [...existing.inspectionFileNumbers, fileNumberInput.trim()]
      : existing.inspectionFileNumbers;

    const updated: Record<string, InternalDataEntry> = {
      ...internalData,
      [selectedEntityId]: {
        ...existing,
        notes: updatedNotes,
        inspectionFileNumbers: updatedFiles,
        updatedAt: new Date().toISOString(),
      },
    };

    onUpdateInternalData(updated);
    setNoteInput("");
    setFileNumberInput("");
    setSuccessMessage("Poufna notatka została dodana do pamięci podręcznej sesji.");
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Import zbiorczy CSV/JSON
  const handleBulkImport = () => {
    if (!bulkTextInput.trim()) return;

    try {
      const parsed = JSON.parse(bulkTextInput);
      if (typeof parsed === "object" && parsed !== null) {
        onUpdateInternalData({ ...internalData, ...parsed });
        setBulkTextInput("");
        setSuccessMessage("Zaimportowano dane strukturalne JSON do pamięci sesji.");
        setTimeout(() => setSuccessMessage(null), 3500);
        return;
      }
    } catch {
      // Próba parsowania jako prosty CSV: entity_id,notatka,numer_akt
      const lines = bulkTextInput.trim().split("\n");
      const updated = { ...internalData };

      for (const line of lines) {
        const parts = line.split(";").map((p) => p.trim());
        if (parts.length >= 2) {
          const [entId, note, fileNo] = parts;
          const target = entities.find(
            (e) => e.id === entId || e.name.toLowerCase().includes(entId.toLowerCase())
          );
          if (target) {
            const existing = updated[target.id] || {
              entityId: target.id,
              internalKpis: {},
              notes: [],
              inspectionFileNumbers: [],
              updatedAt: new Date().toISOString(),
            };
            existing.notes.push(note);
            if (fileNo) existing.inspectionFileNumbers.push(fileNo);
            updated[target.id] = existing;
          }
        }
      }

      onUpdateInternalData(updated);
      setBulkTextInput("");
      setSuccessMessage("Pomyślnie przetworzono wiersze CSV i przypisano do podmiotów.");
      setTimeout(() => setSuccessMessage(null), 3500);
    }
  };

  const handleClearAll = () => {
    if (confirm("Czy na pewno chcesz usunąć wszystkie poufne dane z pamięci sesji?")) {
      onUpdateInternalData({});
    }
  };

  const entriesList = Object.values(internalData);

  return (
    <div className="space-y-6">
      {/* Pasek Tytułowy */}
      <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#e5b958]/20 text-[#e5b958] border border-[#e5b958]/40 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>SKARBIEC DANYCH WEWNĘTRZNYCH MAP</span>
            </span>
            <span className="text-xs text-[#8e9da7]">Pamięć sesji przeglądarki</span>
          </div>
          <h1 className="text-lg font-bold text-white mt-1">
            Bezpieczny Adapter Danych Wewnętrznych Departamentów
          </h1>
          <p className="text-xs text-[#8e9da7]">
            Wprowadzanie poufnych numerów spraw, notatek ze spotkań i wskaźników KPI. Dane przetwarzane wyłącznie lokalnie w RAM przeglądarki (zero wycieku na zewnątrz).
          </p>
        </div>

        {entriesList.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-lg bg-[#140b0f] hover:bg-[#1a0f12] text-[#ff7f87] border border-[#ff7f87]/30 text-xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wyczyść pamięć skarbca</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-[#57e0c5]/10 border border-[#57e0c5]/30 text-xs text-[#57e0c5] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Dwie Kolumny: Wprowadzanie Danych + Podgląd Aktywnych Akt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolumna Lewa: Wprowadzanie ręczne i masowe */}
        <div className="lg:col-span-6 space-y-4">
          {/* Formularz notatki do wybranej spółki */}
          <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#57e0c5]" />
              <span>Dodaj notatkę lub akta do spółki</span>
            </h2>

            <form onSubmit={handleAddManualEntry} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#8e9da7] block mb-1">
                  Wybierz podmiot Skarbu Państwa:
                </label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-xs text-white"
                >
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#8e9da7] block mb-1">
                  Poufna notatka nadzorcza / wniosek ze spotkania:
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="np. Ustalono konieczność przedłożenia przez zarząd do dnia 15.11 planu redukcji kosztów..."
                  className="w-full p-2.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-xs text-white placeholder-[#5d6b74] focus:outline-none focus:border-[#57e0c5]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8e9da7] block mb-1">
                  Sygnatura / numer sprawy kontrolnej (opcjonalnie):
                </label>
                <input
                  type="text"
                  value={fileNumberInput}
                  onChange={(e) => setFileNumberInput(e.target.value)}
                  placeholder="np. MAP-DN-II.054.12.2026"
                  className="w-full px-3 py-2 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-xs text-white placeholder-[#5d6b74] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#57e0c5] hover:bg-[#48c9b0] text-[#070a0d] font-bold text-xs transition-colors shadow-md"
              >
                Zapisz bezpiecznie w sesji
              </button>
            </form>
          </div>

          {/* Import masowy CSV / JSON */}
          <div className="p-5 rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#75b8ff]" />
              <span>Import masowy (Wklej CSV lub JSON)</span>
            </h2>
            <p className="text-[11px] text-[#8e9da7]">
              Format linii CSV: <code className="font-mono text-white">nazwa_spolki;notatka;numer_sprawy</code>
            </p>

            <textarea
              rows={4}
              value={bulkTextInput}
              onChange={(e) => setBulkTextInput(e.target.value)}
              placeholder="ORLEN S.A.;Notatka ze spotkania z doradcą finansowym;MAP-DSS-2026-99"
              className="w-full p-2.5 rounded-lg bg-[#111a21] border border-[rgba(159,186,199,0.14)] text-xs font-mono text-white placeholder-[#5d6b74] focus:outline-none"
            />

            <button
              type="button"
              onClick={handleBulkImport}
              className="w-full py-2 rounded-lg bg-[#16222b] hover:bg-[#1f2f3c] text-white border border-[rgba(159,186,199,0.14)] text-xs font-medium transition-colors"
            >
              Wczytaj i zmapuj na kartoteki
            </button>
          </div>
        </div>

        {/* Kolumna Prawa: Podgląd aktywnych danych wewnętrznych */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Aktywne wpisy wewnętrzne w pamięci ({entriesList.length})
            </h2>
            <span className="text-[11px] text-[#57e0c5] flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% LOKALNIE</span>
            </span>
          </div>

          {entriesList.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#0d1318] border border-[rgba(159,186,199,0.14)] text-xs text-[#8e9da7]">
              Skarbiec jest pusty. Wprowadź notatkę po lewej stronie, aby wzbogacić widoki Dossier 360°.
            </div>
          ) : (
            <div className="space-y-3">
              {entriesList.map((entry) => {
                const entity = entities.find((e) => e.id === entry.entityId);
                return (
                  <div
                    key={entry.entityId}
                    className="p-4 rounded-xl bg-[#0d1318] border border-[#e5b958]/35 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#e5b958]" />
                        <span>{entity?.name || entry.entityId}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(entry.entityId)}
                        className="text-[11px] text-[#57e0c5] hover:underline"
                      >
                        Zobacz w Dossier →
                      </button>
                    </div>

                    <div className="space-y-1.5 pl-3 border-l-2 border-[#e5b958]/50">
                      {entry.notes.map((note, i) => (
                        <p key={i} className="text-xs text-white leading-relaxed">
                          {note}
                        </p>
                      ))}
                    </div>

                    {entry.inspectionFileNumbers.length > 0 && (
                      <div className="pt-2 border-t border-[rgba(159,186,199,0.08)] flex flex-wrap gap-1.5">
                        {entry.inspectionFileNumbers.map((fn, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#111a21] text-[10px] font-mono text-[#e5b958] border border-[#e5b958]/30"
                          >
                            Akta: {fn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
