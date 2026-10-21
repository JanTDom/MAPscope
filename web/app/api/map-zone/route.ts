import { NextResponse } from "next/server";
import {
  MAP_LEADERSHIP,
  MAP_DIRECT_CRISES,
  MAP_PRESS_RELEASES,
  MAP_PRESS_INQUIRIES,
  getMapZoneSummary,
} from "@/lib/map-zone-data.ts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get("tab");

  const summary = getMapZoneSummary();

  if (tab === "leadership") {
    return NextResponse.json({ leadership: MAP_LEADERSHIP });
  }

  if (tab === "crises") {
    return NextResponse.json({ crises: MAP_DIRECT_CRISES });
  }

  if (tab === "releases") {
    return NextResponse.json({ releases: MAP_PRESS_RELEASES });
  }

  if (tab === "inquiries") {
    return NextResponse.json({ inquiries: MAP_PRESS_INQUIRIES });
  }

  return NextResponse.json({
    summary,
    leadership: MAP_LEADERSHIP,
    directCrises: MAP_DIRECT_CRISES,
    pressReleases: MAP_PRESS_RELEASES,
    pressInquiries: MAP_PRESS_INQUIRIES,
  });
}
