import { NextResponse } from "next/server";
import {
  parseEspiXbrlContent,
  OFFICIAL_GPW_PERIODIC_REPORTS,
} from "@/lib/espi-xbrl-parser";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ticker = url.searchParams.get("ticker");

    let reports = OFFICIAL_GPW_PERIODIC_REPORTS;
    if (ticker) {
      reports = reports.filter(
        (r) => r.ticker.toLowerCase() === ticker.toLowerCase()
      );
    }

    return NextResponse.json({
      status: "success",
      count: reports.length,
      reports,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd serwera podczas pobierania raportów.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = body.content as string | undefined;
    const reportId = body.reportId as string | undefined;

    if (reportId) {
      const found = OFFICIAL_GPW_PERIODIC_REPORTS.find((r) => r.id === reportId);
      if (found) {
        return NextResponse.json({
          status: "success",
          report: found,
        });
      }
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Brak zawartości raportu XBRL/ESPI do sparsowania." },
        { status: 400 }
      );
    }

    const parsed = parseEspiXbrlContent(content);

    return NextResponse.json({
      status: "success",
      report: parsed,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd podczas parsowania raportu XBRL/ESPI.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
