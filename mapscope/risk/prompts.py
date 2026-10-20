"""Szablony promptów audytora AI dla Google Gemini (Communication Risk Engine)."""

SYSTEM_PROMPT_COMMUNICATION_AUDITOR = """Jesteś głównym audytorem ryzyka komunikacyjnego i właścicielskiego w systemie MAPscope dla Ministerstwa Aktywów Państwowych (MAP).

Twoje zadanie:
Audytujesz oświadczenia, wywiady zarządów, posty i artykuły dotyczące Spółek Skarbu Państwa (SSP).
Nie generujesz pustego marketingu ani gładkich korpo-streszczeń.
Szukasz konkretnych zagrożeń: niespójności z rządem, arogancji, błędów formalnych (MAR/ESPI), uderzeń w kierownictwo MAP.

Zasady językowe i redakcyjne (bezwzględne):
1. Pisz po polsku, konkretnie, twardymi faktami. Zero waty słownej.
2. Zakaz używania klisz AI: "Warto zauważyć", "Kluczowym aspektem jest", "W obliczu wyzwań", "Należy podkreślić".
3. Stosuj naturalną polską interpunkcję i zróżnicowaną długość zdań.
4. Poprawne skrótowce wielkimi literami: MAP, SSP, ESPI, EBI, KNF, NIK, CBA, UOKiK, URE, TK, SN, KRS, UE.
5. Zwracaj wyłącznie poprawny obiekt JSON zgodny z wymaganym schematem.
"""


def build_risk_audit_prompt(
    entity_name: str,
    share_percent: str,
    ownership_body: str,
    sector: str,
    strategic_importance: str,
    material_type: str,
    title: str,
    content: str,
    channel: str = "oficjalny",
    speaker_info: str = "Brak wskazanego rzecznika",
) -> str:
    """Buduje prompt audytora AI dla oświadczenia lub artykułu kryzysowego."""
    return f"""Dokonaj rygorystycznego audytu poniższego materiału pod kątem ryzyka dla spółki oraz Ministerstwa Aktywów Państwowych (MAP).

METADANE PODMIOTU:
- Nazwa spółki: {entity_name}
- Udział Skarbu Państwa: {share_percent}%
- Organ nadzorczy: {ownership_body}
- Sektor: {sector}
- Znaczenie: {strategic_importance}

MATERIAŁ DO AUDYTU:
- Typ: {material_type} (kanał: {channel})
- Autor / wypowiadający się: {speaker_info}
- Tytuł: {title}
- Treść:
\"\"\"
{content}
\"\"\"

Zwróć wynik w formacie JSON z następującymi polami:
{{
  "overall_risk_score": <liczba od 0.0 do 10.0, np. 7.5>,
  "severity": <jeden z: "p1_critical" | "p2_high" | "p3_moderate" | "low" | "neutral">,
  "communication_risks": {{
    "blad_narracyjny": <true/false>,
    "rozdzwiek_z_rzadem": <true/false>,
    "zaognienie_konfliktu": <true/false>,
    "ryzyko_regulacyjne_mar": <true/false>,
    "szczegoly": {{
      "<nazwa_zagrozenia>": "<konkretne wyjaśnienie w 1-2 zdaniach>"
    }}
  }},
  "governance_risks": {{
    "kadry_spory": <true/false>,
    "kontrole_sledztwa": <true/false>,
    "finanse_plynnosc": <true/false>,
    "infrastruktura_awarie": <true/false>,
    "narracja_polityczna": <true/false>,
    "szczegoly": {{
      "<nazwa_zagrozenia>": "<konkretne wyjaśnienie w 1-2 zdaniach>"
    }}
  }},
  "executive_summary": "<suche, reporterskie podsumowanie sytuacji: co się stało, kto co powiedział, w czym leży problem>",
  "map_impact_analysis": "<bezpośredni rykoszet w MAP: jak sprawa uderzy w ministra, jakie padną pytania posłów/mediów, jak spółka wystawiła resort>",
  "recommended_action": "<konkretna rekomendacja dla departamentu nadzorczego MAP: co zrobić w najbliższych godzinach>"
}}
"""
