import { NextResponse } from "next/server";
import {
  getWebhookServiceState,
  processIncomingEspiWebhook,
  IncomingWebhookInput,
} from "@/lib/espi-webhook-service";
import { verifyHmacSignature } from "@/lib/espi-webhook-verifier";

export async function GET() {
  try {
    const state = getWebhookServiceState();
    return NextResponse.json({
      status: "success",
      gateway: state.gatewayProtocol,
      isListening: state.isListening,
      endpointUrl: state.endpointUrl,
      activeSources: state.activeSources,
      totalTransmissionsReceived: state.totalTransmissionsReceived,
      lastHeartbeatAt: state.lastHeartbeatAt,
      recentTransmissions: state.recentTransmissions,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd serwera podczas odczytu stanu webhooka.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rawBodyText = await req.text();
    if (!rawBodyText || rawBodyText.trim().length === 0) {
      return NextResponse.json(
        { error: "Puste ciało żądania webhooka." },
        { status: 400 }
      );
    }

    let parsedBody: Record<string, unknown>;
    try {
      parsedBody = JSON.parse(rawBodyText);
    } catch {
      return NextResponse.json(
        { error: "Ciało żądania musi być poprawnym formatem JSON." },
        { status: 400 }
      );
    }

    const signatureHeader =
      req.headers.get("x-knf-espi-signature") ||
      req.headers.get("x-pap-signature") ||
      (parsedBody.signature as string | undefined);

    const input: IncomingWebhookInput = {
      eventId: (parsedBody.eventId as string) || `knf-evt-${Date.now()}`,
      source: (parsedBody.source as any) || "KNF_ESPI",
      eventType: (parsedBody.eventType as any) || "CURRENT_REPORT_PUBLISHED",
      ticker: (parsedBody.ticker as string) || "SSP",
      entityName: (parsedBody.entityName as string) || "Spółka Skarbu Państwa",
      reportNumber: (parsedBody.reportNumber as string) || "RB/2026",
      publishedAt: (parsedBody.publishedAt as string) || new Date().toISOString(),
      rawContent: (parsedBody.rawContent as string) || undefined,
      signature: signatureHeader || undefined,
      timestamp: (parsedBody.timestamp as number) || Math.floor(Date.now() / 1000),
    };

    const enforceSignature = Boolean(process.env.ENFORCE_ESPI_WEBHOOK_SIGNATURE === "true");

    if (enforceSignature) {
      if (!signatureHeader || !verifyHmacSignature(rawBodyText, signatureHeader)) {
        return NextResponse.json(
          { status: "rejected", message: "Odrzucono żądanie: brak lub błędna sygnatura HMAC-SHA256." },
          { status: 401 }
        );
      }
    }

    const result = processIncomingEspiWebhook(input, rawBodyText, false);

    if (result.status === "REJECTED") {
      return NextResponse.json({ status: "rejected", message: result.message }, { status: 401 });
    }

    return NextResponse.json({
      status: "success",
      result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Błąd wewnętrzny podczas przetwarzania webhooka.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
