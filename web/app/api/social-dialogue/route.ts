import { NextResponse } from "next/server";
import {
  LABOR_DISPUTES_DATABASE,
  SOCIAL_DIALOGUE_CALENDAR,
  getSocialDialogueSummary,
  simulateWageCompromise,
} from "@/lib/social-dialogue-data.ts";
import type { WageCompromiseSimulationInput } from "@/lib/types.ts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const disputeId = searchParams.get("id");
  const threatLevel = searchParams.get("threat_level");
  const voivodeship = searchParams.get("voivodeship");

  let disputes = [...LABOR_DISPUTES_DATABASE];

  if (disputeId) {
    const single = disputes.find((d) => d.id === disputeId);
    if (!single) {
      return NextResponse.json({ error: "Nie znaleziono sporu" }, { status: 404 });
    }
    return NextResponse.json({ dispute: single });
  }

  if (threatLevel) {
    disputes = disputes.filter((d) => d.threatLevel === threatLevel);
  }

  if (voivodeship) {
    disputes = disputes.filter((d) =>
      d.voivodeship.toLowerCase().includes(voivodeship.toLowerCase())
    );
  }

  const summary = getSocialDialogueSummary();

  return NextResponse.json({
    summary,
    disputes,
    calendar: SOCIAL_DIALOGUE_CALENDAR,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WageCompromiseSimulationInput;

    if (!body.disputeId) {
      return NextResponse.json(
        { error: "Brak parametru disputeId w ciele zapytania" },
        { status: 400 }
      );
    }

    const result = simulateWageCompromise(body);
    return NextResponse.json({ result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Błąd serwera";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
