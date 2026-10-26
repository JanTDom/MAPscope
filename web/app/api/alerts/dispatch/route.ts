import { NextResponse } from "next/server";
import { dispatchP1EmergencyAlert, P1AlertDispatchPayload } from "@/lib/telegram-alert-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<P1AlertDispatchPayload>;

    if (!body.entityName || !body.headline) {
      return NextResponse.json(
        { success: false, error: "Brak wymaganych pól (entityName, headline)" },
        { status: 400 }
      );
    }

    const payload: P1AlertDispatchPayload = {
      alertId: body.alertId || `alt-${Date.now()}`,
      entityName: body.entityName,
      ticker: body.ticker,
      headline: body.headline,
      severity: body.severity === "p2_high" ? "p2_high" : "p1_critical",
      hardNumbers: Array.isArray(body.hardNumbers) ? body.hardNumbers : ["Wskaźniki zweryfikowane w Departamencie Nadzoru"],
      recommendedLine: body.recommendedLine || "Ministerstwo Aktywów Państwowych wdrożyło natychmiastowe czynności kontrolne.",
      recipientChannel: body.recipientChannel || "Telegram Dyżurny Rzecznika MAP",
    };

    const result = await dispatchP1EmergencyAlert(payload);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Błąd dyspozycji alertu";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
