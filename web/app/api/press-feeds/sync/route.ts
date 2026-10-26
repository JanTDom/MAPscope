import { NextResponse } from "next/server";
import { fetchLiveSspPressReleases, SSP_PRESS_FEED_CATALOG } from "@/lib/ssp-press-feeds-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "10");

    const releases = await fetchLiveSspPressReleases(limit);
    return NextResponse.json({
      success: true,
      source: "Oficjalne Biura Prasowe i Kanały Relacji Inwestorskich SSP",
      monitoredFeedsCount: SSP_PRESS_FEED_CATALOG.length,
      fetchedAt: new Date().toISOString(),
      releases,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Błąd synchronizacji biur prasowych";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
