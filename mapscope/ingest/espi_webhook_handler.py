"""Obsługa przychodzących webhooków z serwera KNF ESPI oraz PAP Biznes."""

import hmac
import hashlib
import time
from typing import Optional, Set

from mapscope.ingest.espi_xbrl_parser import EspiXbrlParser
from mapscope.models.webhook import (
    EspiWebhookPayload,
    WebhookEventType,
    WebhookProcessingResult,
    WebhookSource,
)


class EspiWebhookHandler:
    """Asynchroniczny odbiornik i procesor webhooków KNF ESPI / PAP Biznes.

    Eliminuje konieczność odpytywania okresowego (polling).
    Zapewnia:
    1. Weryfikację sygnatury kryptograficznej HMAC-SHA256
    2. Ochronę przed atakami powtórzeniowymi (replay attack prevention)
    3. Idempotentną deduplikację zdarzeń agencyjnych
    4. Natychmiastowe parsowanie raportów okresowych i alarmowanie kierownictwa MAP.
    """

    MAX_TIMESTAMP_DRIFT_SECONDS = 300  # 5 minut

    def __init__(
        self,
        webhook_secret: str = "mapscope_knf_espi_secret_key_2026",
        parser: Optional[EspiXbrlParser] = None,
    ):
        self.webhook_secret = webhook_secret.encode("utf-8")
        self.parser = parser or EspiXbrlParser()
        self._processed_event_ids: Set[str] = set()

    def verify_signature(self, payload_bytes: bytes, signature_hex: str) -> bool:
        """Weryfikuje podpis kryptograficzny HMAC-SHA256."""
        if not signature_hex:
            return False
        expected_sig = hmac.new(self.webhook_secret, payload_bytes, hashlib.sha256).hexdigest()
        return hmac.compare_digest(expected_sig.lower(), signature_hex.lower())

    def process_webhook(
        self,
        payload: EspiWebhookPayload,
        raw_body_bytes: Optional[bytes] = None,
        enforce_signature: bool = True,
    ) -> WebhookProcessingResult:
        """Przetwarza przychodzący webhook w tle."""
        # 1. Weryfikacja timestampu (ochrona przed powtórzeniem)
        current_time = int(time.time())
        if abs(current_time - payload.timestamp) > self.MAX_TIMESTAMP_DRIFT_SECONDS:
            return WebhookProcessingResult(
                event_id=payload.event_id,
                source=payload.source,
                ticker=payload.ticker,
                status="REJECTED_EXPIRED_TIMESTAMP",
                message=f"Przeterminowany timestamp zdarzenia: różnica {abs(current_time - payload.timestamp)}s przekracza limit 300s.",
            )

        # 2. Weryfikacja podpisu HMAC (jeśli wymagana)
        if enforce_signature:
            body_to_verify = raw_body_bytes or payload.event_id.encode("utf-8")
            sig = payload.signature or ""
            if not self.verify_signature(body_to_verify, sig):
                return WebhookProcessingResult(
                    event_id=payload.event_id,
                    source=payload.source,
                    ticker=payload.ticker,
                    status="REJECTED_INVALID_SIGNATURE",
                    message="Błędna sygnatura kryptograficzna HMAC-SHA256 nadawcy KNF ESPI/PAP.",
                )

        # 3. Idempotentna deduplikacja zdarzeń
        if payload.event_id in self._processed_event_ids:
            return WebhookProcessingResult(
                event_id=payload.event_id,
                source=payload.source,
                ticker=payload.ticker,
                status="IGNORED_DUPLICATE",
                message=f"Zdarzenie {payload.event_id} zostało już wcześniej przetworzone.",
            )

        self._processed_event_ids.add(payload.event_id)

        # 4. Obsługa heartbeatów systemowych
        if payload.event_type == WebhookEventType.SYSTEM_HEARTBEAT:
            return WebhookProcessingResult(
                event_id=payload.event_id,
                source=payload.source,
                ticker=payload.ticker,
                status="HEARTBEAT_ACKNOWLEDGED",
                message="Pomyślnie odebrano i potwierdzono heartbeat połączenia KNF ESPI.",
            )

        # 5. Bezpośrednie parsowanie raportów okresowych (XBRL/ESPI)
        is_periodic = payload.event_type == WebhookEventType.PERIODIC_REPORT_PUBLISHED
        parsed_report = None
        covenant_breached = False
        mar_flag = False
        ministerial_alert = False

        if payload.raw_content and (is_periodic or "ix:nonFraction" in payload.raw_content or "<RaportOkresowy" in payload.raw_content):
            try:
                parsed_report = self.parser.parse_string(payload.raw_content)
                is_periodic = True
                covenant_breached = parsed_report.covenant.is_breached
                mar_flag = parsed_report.covenant.mar_risk_flag

                if covenant_breached or mar_flag:
                    ministerial_alert = True
            except Exception as e:
                return WebhookProcessingResult(
                    event_id=payload.event_id,
                    source=payload.source,
                    ticker=payload.ticker,
                    status="PARSING_FAILED",
                    is_periodic_report=True,
                    message=f"Błąd podczas natychmiastowego parsowania XBRL: {str(e)}",
                )

        msg = (
            f"Odebrano transmisję {payload.event_type} dla {payload.ticker} ({payload.report_number}). "
            f"Kowenant: {'NARUSZONY' if covenant_breached else 'STABILNY'}, Alert MAP: {'TAK' if ministerial_alert else 'NIE'}."
        )

        return WebhookProcessingResult(
            event_id=payload.event_id,
            source=payload.source,
            ticker=payload.ticker,
            status="PROCESSED_SUCCESSFULLY",
            is_periodic_report=is_periodic,
            covenant_breached=covenant_breached,
            mar_risk_flag=mar_flag,
            parsed_report=parsed_report,
            ministerial_alert_required=ministerial_alert,
            message=msg,
        )
