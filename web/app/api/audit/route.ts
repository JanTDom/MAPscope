import { NextResponse } from "next/server";

interface AuditRequestBody {
  entityName?: string;
  sharePercent?: string | number;
  ownershipBody?: string;
  sector?: string;
  materialType?: string;
  speaker?: string;
  title?: string;
  text?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.PPGSCOPE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Brak skonfigurowanego klucza GEMINI_API_KEY w środowisku serwera.",
        },
        { status: 500 }
      );
    }

    const body: AuditRequestBody = await req.json();

    const entityName = body.entityName?.trim() || "Spółka Skarbu Państwa";
    const sharePercent = body.sharePercent ?? "50%+";
    const ownershipBody = body.ownershipBody || "Ministerstwo Aktywów Państwowych";
    const sector = body.sector || "Sektor Strategiczny";
    const materialType = body.materialType || "Oficjalne oświadczenie zarządu";
    const speaker = body.speaker || "Rzecznik / Zarząd";
    const title = body.title?.trim() || "Komunikat spółki";
    const text = body.text?.trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Treść materiału do audytu jest zbyt krótka (wymagane minimum 10 znaków)." },
        { status: 400 }
      );
    }

    const systemPrompt = `Jesteś głównym audytorem ryzyka komunikacyjnego i właścicielskiego w systemie MAPscope dla Ministerstwa Aktywów Państwowych (MAP).

Twoje zadanie:
Audytujesz oświadczenia, wywiady zarządów, posty i artykuły dotyczące Spółek Skarbu Państwa (SSP).
Nie generujesz pustego marketingu ani gładkich korpo-streszczeń.
Szukasz konkretnych zagrożeń: niespójności z rządem, arogancji, błędów formalnych (MAR/ESPI), uderzeń w kierownictwo MAP.

Zasady językowe i redakcyjne (bezwzględne standardu Fable 5.1):
1. Pisz po polsku, konkretnie, twardymi faktami. Zero waty słownej.
2. Zakaz używania klisz AI: "Warto zauważyć", "Kluczowym aspektem jest", "W obliczu wyzwań", "Należy podkreślić".
3. Stosuj naturalną polską interpunkcję i zróżnicowaną długość zdań.
4. Poprawne skrótowce wielkimi literami: MAP, SSP, ESPI, EBI, KNF, NIK, CBA, UOKiK, URE, TK, SN, KRS, UE.
5. Zwracaj wyłącznie poprawny obiekt JSON.`;

    const userPrompt = `Dokonaj rygorystycznego audytu poniższego materiału pod kątem ryzyka dla spółki oraz Ministerstwa Aktywów Państwowych (MAP).

METADANE PODMIOTU:
- Nazwa spółki: ${entityName}
- Udział Skarbu Państwa: ${sharePercent}%
- Organ nadzorczy: ${ownershipBody}
- Sektor: ${sector}

MATERIAŁ DO AUDYTU:
- Typ: ${materialType}
- Autor / wypowiadający się: ${speaker}
- Tytuł: ${title}
- Treść:
"""
${text}
"""

Zwróć poprawny JSON o następującej strukturze pól:
{
  "overall_risk_score": <liczba od 0.0 do 10.0, np. 7.8>,
  "severity": <jeden z: "p1_critical" | "p2_high" | "p3_moderate" | "low" | "neutral">,
  "communication_risks": {
    "blad_narracyjny": <true/false>,
    "rozdzwiek_z_rzadem": <true/false>,
    "zaognienie_konfliktu": <true/false>,
    "ryzyko_regulacyjne_mar": <true/false>,
    "szczegoly": {
      "kluczowy_zarzut": "<krótkie, bezwzględne wskazanie błędu w 1-2 zdaniach>"
    }
  },
  "governance_risks": {
    "kadry_spory": <true/false>,
    "kontrole_sledztwa": <true/false>,
    "finanse_plynnosc": <true/false>,
    "infrastruktura_awarie": <true/false>,
    "narracja_polityczna": <true/false>,
    "szczegoly": {
      "konsekwencje": "<wskazanie skutków właścicielskich w 1-2 zdaniach>"
    }
  },
  "executive_summary": "<suche, bezkompromisowe podsumowanie sytuacji: co powiedziano i na czym polega realny kryzys>",
  "map_impact_analysis": "<jak sprawa uderzy bezpośrednio w kierownictwo resortu MAP i jakie pytania padną w Sejmie/mediach>",
  "recommended_action": "<konkretne polecenie lub rekomendacja dla Departamentu Nadzoru MAP>"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Błąd komunikacji z Google Gemini API: ${response.status}`, details: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: "Model Gemini nie zwrócił poprawnej odpowiedzi tekstowej." },
        { status: 502 }
      );
    }

    const parsedJson = JSON.parse(rawContent);

    return NextResponse.json({
      status: "ok",
      audit: parsedJson,
      engine: "Gemini 2.5 Flash / MAPscope Risk Engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Nieznany błąd";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
