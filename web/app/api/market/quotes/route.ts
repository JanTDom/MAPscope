import { NextResponse } from "next/server";
import { fetchLiveGpwMarketData } from "@/lib/gpw-market-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchLiveGpwMarketData();
    return NextResponse.json({
      success: true,
      source: "WSE Warsaw Stock Exchange (query2.finance.yahoo.com)",
      fetchedAt: new Date().toISOString(),
      quotes: data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Błąd pobierania notowań";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
