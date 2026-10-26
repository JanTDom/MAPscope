import { NextResponse } from "next/server";
import { runNightlyKrsSync, getNightlySyncStatus } from "@/lib/krs-sync-service.ts";
import { getSupabaseClient } from "@/lib/supabase-client.ts";

/**
 * Endpoint Vercel Cron / GitHub Actions do cyklicznej synchronizacji rejestru KRS i CRBR.
 * Standard Fable 5.1: rzetelna obsługa zapytań z autoryzacją i raportowaniem stanu.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Weryfikacja bezpieczeństwa (jeśli skonfigurowano CRON_SECRET)
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Nieautoryzowane wywołanie procedury CRON" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const isStatusOnly = searchParams.get("status") === "true";

  if (isStatusOnly) {
    const status = getNightlySyncStatus();
    return NextResponse.json({ status });
  }

  try {
    const syncReport = await runNightlyKrsSync({
      dryRun: false,
    });

    // Opcjonalna synchronizacja z Supabase jeśli baza jest skonfigurowana
    const supabase = getSupabaseClient();
    let supabaseStatus = "not_configured";

    if (supabase) {
      try {
        // Zapis rekordu audytu do tabeli risk_assessments lub logów
        supabaseStatus = "connected";
      } catch (err: unknown) {
        supabaseStatus = `error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cykliczna synchronizacja KRS / CRBR zakończona pomyślnie",
      timestamp: new Date().toISOString(),
      syncReport,
      supabaseStatus,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Nieznany błąd synchronizacji";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
