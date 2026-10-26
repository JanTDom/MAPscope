import { NextResponse } from "next/server";
import { executeSemanticSearch } from "@/lib/semantic-search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({
      query: "",
      detectedThemes: [],
      matchedEntities: [],
      matchedAlerts: [],
      matchedInquiries: [],
    });
  }

  const result = executeSemanticSearch(q);
  return NextResponse.json({
    success: true,
    ...result,
  });
}
