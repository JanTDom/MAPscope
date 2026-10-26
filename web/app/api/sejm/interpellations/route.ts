import { NextResponse } from "next/server";
import { fetchLiveSejmInterpellations } from "@/lib/sejm-client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || "15");

    const inquiries = await fetchLiveSejmInterpellations(limit);
    return NextResponse.json({
      success: true,
      source: "Kancelaria Sejmu RP (api.sejm.gov.pl/sejm/term10)",
      fetchedAt: new Date().toISOString(),
      inquiries,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Błąd pobierania interpelacji";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
