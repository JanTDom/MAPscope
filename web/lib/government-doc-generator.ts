/**
 * Generator Urzędowych Dokumentów Rządowych MAPscope
 * Standard Fable 5.1: Profesjonalne formatowanie A4 dla Rady Ministrów i Sejmu RP.
 */

import { formatPolishDateTime, formatPolishDate } from "./time-service.ts";

export type GovernmentDocType = "KPRM_ONE_PAGER" | "PRESS_BRIEFING_30S" | "AGM_VOTING_MANDATE";

export interface GovernmentDocPayload {
  docType: GovernmentDocType;
  title: string;
  referenceNumber: string;
  department: string;
  author: string;
  recipient: string;
  summary: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
  legalBasis?: string;
  signoff?: string;
}

export function generateGovernmentHtmlDocument(
  payload: Partial<GovernmentDocPayload> & { docType: GovernmentDocType; targetId?: string }
): string {
  const currentDate = formatPolishDateTime();
  const dateShort = formatPolishDate();

  const department = payload.department || "Gabinet Ministra Aktywów Państwowych";
  const author = payload.author || "Minister Aktywów Państwowych";
  const recipient =
    payload.recipient ||
    (payload.docType === "KPRM_ONE_PAGER"
      ? "Kancelaria Prezesa Rady Ministrów / Prezes Rady Ministrów"
      : payload.docType === "AGM_VOTING_MANDATE"
      ? "Pełnomocnik Ministra na Walne Zgromadzenie"
      : "Kierownictwo Ministerstwa Aktywów Państwowych");

  const title =
    payload.title ||
    (payload.docType === "KPRM_ONE_PAGER"
      ? "Materiały Informacyjne dla Prezesa Rady Ministrów (One-Pager)"
      : payload.docType === "AGM_VOTING_MANDATE"
      ? "Mandat Wiążący dla Pełnomocnika Skarbu Państwa na Walne Zgromadzenie (WZ/NWZ)"
      : "Kieszonkowa Fiszka Prasowa dla Ministra (Briefing 30s)");

  const referenceNumber =
    payload.referenceNumber || `MAP-GM-2026/${payload.docType}-01`;

  const summary =
    payload.summary ||
    "Dokument urzędowy sporządzony w systemie MAPscope w trybie nadzoru właścicielskiego i monitoringu ryzyka.";

  const sections =
    payload.sections && payload.sections.length > 0
      ? payload.sections
      : payload.docType === "KPRM_ONE_PAGER"
      ? [
          {
            title: "1. Sprawy bieżące i pilne decyzje właścicielskie",
            items: [
              "Program restrukturyzacji PKP CARGO postępuje zgodnie z harmonogramem sanacyjnym.",
              "Totalizator Sportowy: zakończenie 17 postępowań kontrolnych KAS i wdrożenie transparentnych konkursów.",
            ],
          },
          {
            title: "2. Restrukturyzacja i dialog społeczny",
            items: [
              "Poczta Polska: utrzymanie wypłat i ciągłości placówek na terenach wiejskich.",
              "Podpisanie porozumień transferowych dla pracowników chronionych.",
            ],
          },
        ]
      : payload.docType === "PRESS_BRIEFING_30S"
      ? [
          {
            title: "OTWARCIE DO KAMER (Główne zdanie przekazu)",
            items: [
              "Wszystkie postępowania rekrutacyjne i zarządcze w spółkach portfelowych podlegają transparentnym procedurom nadzorczym MAP bez taryfy ulgowej.",
            ],
          },
          {
            title: "TWARDE LICZBY (Fakty nie do podważenia)",
            items: [
              "100% bazy 406 spółek objęte bieżącym monitoringiem nadzoru",
              "Ponad 480 mln zł rocznych oszczędności wygenerowanych programami optymalizacji",
            ],
          },
          {
            title: "CZERWONA LINIA (Czego kategorycznie NIE mówić)",
            items: [
              "Kategoryczny zakaz komentowania nazwisk przed zakończeniem czynności prokuratorskich.",
            ],
          },
        ]
      : [
          {
            title: "Dyspozycja głosowania Skarbu Państwa (ORLEN S.A.)",
            items: [
              "GŁOSOWAĆ ZA UCHWAŁĄ w sprawie zatwierdzenia sprawozdania finansowego",
              "Uzasadnienie: Ochrona interesu majątkowego Skarbu Państwa i stabilność ratingu kredytowego",
            ],
          },
          {
            title: "Podstawa formalnoprawna i granice pełnomocnictwa",
            items: [
              "Art. 7 Ustawy z dnia 16 grudnia 2016 r. o zasadach zarządzania mieniem państwowym",
              "Bezwzględna ochrona klauzul strategicznych umów dostaw",
            ],
          },
        ];

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>${title} — ${referenceNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 18mm 18mm 18mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .header-bar {
      border-bottom: 2px solid #991b1b;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .emblem-title {
      font-weight: 800;
      font-size: 13pt;
      letter-spacing: 0.5px;
      color: #111827;
      text-transform: uppercase;
    }
    .department {
      font-size: 9pt;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    .doc-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #374151;
      font-family: monospace;
    }
    .classification-stamp {
      display: inline-block;
      border: 1.5px solid #dc2626;
      color: #dc2626;
      font-weight: 800;
      font-size: 8pt;
      padding: 2px 8px;
      border-radius: 3px;
      text-transform: uppercase;
      margin-bottom: 4px;
      letter-spacing: 1px;
    }
    .doc-title {
      font-size: 15pt;
      font-weight: 800;
      color: #111827;
      margin: 16px 0 6px 0;
      line-height: 1.25;
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 14px 0 20px 0;
      padding: 10px 14px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      font-size: 9.5pt;
    }
    .summary-box {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 12px 14px;
      margin-bottom: 20px;
      font-size: 10.5pt;
      line-height: 1.45;
      font-weight: 500;
    }
    .section-title {
      font-size: 10.5pt;
      font-weight: 800;
      color: #1f2937;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      margin: 18px 0 8px 0;
    }
    ul.item-list {
      margin: 0 0 14px 0;
      padding-left: 20px;
    }
    ul.item-list li {
      margin-bottom: 6px;
      font-size: 10pt;
      color: #1f2937;
    }
    .legal-basis {
      font-size: 8.5pt;
      color: #6b7280;
      border-top: 1px dashed #d1d5db;
      padding-top: 8px;
      margin-top: 24px;
      font-style: italic;
    }
    .signoff-box {
      margin-top: 36px;
      display: flex;
      justify-content: flex-end;
      text-align: right;
    }
    .signature-line {
      width: 240px;
      border-top: 1px solid #4b5563;
      padding-top: 6px;
      font-size: 9pt;
      font-weight: 600;
      color: #111827;
    }
    .print-button {
      position: fixed;
      top: 16px;
      right: 16px;
      padding: 10px 20px;
      background: #1e3a8a;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 10pt;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    }
    @media print {
      .print-button {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">Drukuj / Pobierz PDF</button>

  <div class="header-bar">
    <div>
      <div class="emblem-title">Rzeczpospolita Polska</div>
      <div style="font-weight: 700; font-size: 10pt; color: #991b1b; text-transform: uppercase;">
        Ministerstwo Aktywów Państwowych
      </div>
      <div class="department">${department}</div>
    </div>
    <div class="doc-meta">
      <div class="classification-stamp">DOKUMENT SŁUŻBOWY MAP</div>
      <div>Sygn.: <strong>${referenceNumber}</strong></div>
      <div>Warszawa, ${dateShort}</div>
      <div>Zarejestrowano w MAPscope</div>
    </div>
  </div>

  <div class="doc-title">${title}</div>

  <div class="parties-grid">
    <div>
      <span style="color: #6b7280; font-size: 8pt; text-transform: uppercase; display: block;">Sporządzający:</span>
      <strong>${author}</strong>
    </div>
    <div>
      <span style="color: #6b7280; font-size: 8pt; text-transform: uppercase; display: block;">Adresat:</span>
      <strong>${recipient}</strong>
    </div>
  </div>

  <div class="summary-box">
    ${summary}
  </div>

  ${sections
    .map(
      (sec) => `
    <div class="section-title">${sec.title}</div>
    <ul class="item-list">
      ${(sec.items || []).map((it) => `<li>${it}</li>`).join("")}
    </ul>
  `
    )
    .join("")}

  ${
    payload.legalBasis
      ? `<div class="legal-basis">Podstawa prawna: ${payload.legalBasis}</div>`
      : ""
  }

  <div class="signoff-box">
    <div class="signature-line">
      ${payload.signoff || "Z upoważnienia Ministra Aktywów Państwowych"}<br>
      <span style="font-weight: normal; font-size: 8pt; color: #6b7280;">Wydruk certyfikowany systemem MAPscope (${currentDate})</span>
    </div>
  </div>
</body>
</html>`;
}
