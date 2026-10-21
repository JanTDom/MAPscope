import { NextRequest, NextResponse } from "next/server";
import {
  getNightlySyncStatus,
  runNightlyKrsSync,
  KRS_API_BASE_URL,
  CRBR_API_BASE_URL,
} from "@/lib/krs-sync-service.ts";

export const dynamic = "force-dynamic";

/**
 * GET /api/krs/sync
 * Pobiera bieżący status techniczny nocnej synchronizacji KRS / CRBR,
 * wskaźniki połączenia z otwartym API Ministerstwa Sprawiedliwości oraz podsumowanie ostatniego biegu.
 */
export async function GET() {
  try {
    const status = getNightlySyncStatus();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      service: "MAPscope Nightly KRS & CRBR Synchronizer",
      endpoints: {
        krsApi: KRS_API_BASE_URL,
        crbrApi: CRBR_API_BASE_URL,
      },
      status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd usługi synchronizatora",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/krs/sync
 * Uruchamia synchronizację nocną ad-hoc (np. wywołaną przez Vercel Cron lub panel operatora MAP).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = Boolean(body?.dryRun);
    const forceAll = Boolean(body?.forceAll);
    const targetEntityIds = Array.isArray(body?.targetEntityIds)
      ? body.targetEntityIds
      : undefined;

    const report = await runNightlyKrsSync({
      dryRun,
      forceAll,
      targetEntityIds,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: dryRun
        ? "Symulacja synchronizacji KRS/CRBR zakończona pomyślnie"
        : "Nocna synchronizacja KRS/CRBR zrealizowana pomyślnie",
      report,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Błąd wykonania zadania synchronizacji",
      },
      { status: 500 }
    );
  }
}
