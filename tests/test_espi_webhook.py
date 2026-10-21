"""Testy jednostkowe asynchronicznego nasłuchu webhooków z serwerów KNF ESPI oraz PAP Biznes."""

import hashlib
import hmac
import time
import pytest

from mapscope.ingest.espi_webhook_handler import EspiWebhookHandler
from mapscope.models.webhook import (
    EspiWebhookPayload,
    WebhookEventType,
    WebhookSource,
)


SECRET_KEY = "test_espi_secret_key_123"


SAMPLE_IXBRL_PAYLOAD = """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ix="http://www.xbrl.org/2013/inlineXBRL"
      xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full">
<body>
  <ix:nonNumeric name="ifrs-full:TradingSymbol">ATT</ix:nonNumeric>
  <ix:nonNumeric name="ifrs-full:DocumentType">SA-QSr 3/2025</ix:nonNumeric>
  <ix:nonFraction name="ifrs-full:Revenue" scale="6">9850.40</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:OperatingProfit" scale="6">-1240.20</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:DepreciationAndAmortisationExpense" scale="6">420.10</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:NoncurrentBorrowings" scale="6">8120.00</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:CurrentBorrowings" scale="6">2850.00</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:CashAndCashEquivalents" scale="6">570.00</ix:nonFraction>
</body>
</html>
"""


def compute_sig(secret: str, data: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), data, hashlib.sha256).hexdigest()


def test_webhook_valid_signature_and_covenant_alert():
    """Test odbioru webhooka z poprawnym podpisem HMAC i detekcją naruszenia kowenantu."""
    handler = EspiWebhookHandler(webhook_secret=SECRET_KEY)
    now = int(time.time())
    event_id = "knf-espi-evt-001"

    body_bytes = event_id.encode("utf-8")
    sig = compute_sig(SECRET_KEY, body_bytes)

    payload = EspiWebhookPayload(
        event_id=event_id,
        source=WebhookSource.KNF_ESPI,
        event_type=WebhookEventType.PERIODIC_REPORT_PUBLISHED,
        ticker="ATT",
        entity_name="Grupa Azoty S.A.",
        report_number="SA-QSr 3/2025",
        published_at="2025-11-14T08:30:00Z",
        raw_content=SAMPLE_IXBRL_PAYLOAD,
        signature=sig,
        timestamp=now,
    )

    result = handler.process_webhook(payload, raw_body_bytes=body_bytes, enforce_signature=True)

    assert result.status == "PROCESSED_SUCCESSFULLY"
    assert result.covenant_breached is True
    assert result.mar_risk_flag is True
    assert result.ministerial_alert_required is True
    assert result.parsed_report is not None
    assert result.parsed_report.calculated_ebitda_mln_pln == -820.10
    assert result.parsed_report.net_debt_mln_pln == 10400.00


def test_webhook_invalid_signature_rejected():
    """Test odrzucenia webhooka ze sfałszowanym podpisem HMAC."""
    handler = EspiWebhookHandler(webhook_secret=SECRET_KEY)
    now = int(time.time())
    event_id = "knf-espi-evt-002"

    payload = EspiWebhookPayload(
        event_id=event_id,
        source=WebhookSource.KNF_ESPI,
        event_type=WebhookEventType.CURRENT_REPORT_PUBLISHED,
        ticker="PKN",
        entity_name="ORLEN S.A.",
        report_number="RB 42/2026",
        published_at="2026-10-21T08:00:00Z",
        signature="invalid_fake_signature_abc123",
        timestamp=now,
    )

    result = handler.process_webhook(payload, raw_body_bytes=event_id.encode("utf-8"), enforce_signature=True)

    assert result.status == "REJECTED_INVALID_SIGNATURE"
    assert "Błędna sygnatura" in result.message


def test_webhook_expired_timestamp_rejected():
    """Test odrzucenia webhooka ze zbyt starym timestampem (ochrona przed replay)."""
    handler = EspiWebhookHandler(webhook_secret=SECRET_KEY)
    old_time = int(time.time()) - 400  # Ponad 5 minut temu
    event_id = "knf-espi-evt-003"

    payload = EspiWebhookPayload(
        event_id=event_id,
        source=WebhookSource.PAP_BIZNES,
        event_type=WebhookEventType.CURRENT_REPORT_PUBLISHED,
        ticker="JSW",
        entity_name="JSW S.A.",
        report_number="RB 18/2026",
        published_at="2026-10-21T07:00:00Z",
        signature="valid",
        timestamp=old_time,
    )

    result = handler.process_webhook(payload, enforce_signature=False)

    assert result.status == "REJECTED_EXPIRED_TIMESTAMP"
    assert "Przeterminowany timestamp" in result.message


def test_webhook_idempotency_deduplication():
    """Test deduplikacji identycznych zdarzeń agencyjnych."""
    handler = EspiWebhookHandler(webhook_secret=SECRET_KEY)
    now = int(time.time())
    event_id = "pap-biznes-evt-repeat-999"

    payload = EspiWebhookPayload(
        event_id=event_id,
        source=WebhookSource.PAP_BIZNES,
        event_type=WebhookEventType.CURRENT_REPORT_PUBLISHED,
        ticker="PGE",
        entity_name="PGE S.A.",
        report_number="RB 33/2026",
        published_at="2026-10-21T08:15:00Z",
        signature="valid",
        timestamp=now,
    )

    # Pierwsze przetworzenie
    res1 = handler.process_webhook(payload, enforce_signature=False)
    assert res1.status == "PROCESSED_SUCCESSFULLY"

    # Drugie przetworzenie tego samego event_id
    res2 = handler.process_webhook(payload, enforce_signature=False)
    assert res2.status == "IGNORED_DUPLICATE"
    assert "zostało już wcześniej przetworzone" in res2.message


def test_webhook_heartbeat_acknowledged():
    """Test potwierdzenia systemowego sygnału kontrolnego (heartbeat)."""
    handler = EspiWebhookHandler(webhook_secret=SECRET_KEY)
    now = int(time.time())
    event_id = "knf-heartbeat-001"

    payload = EspiWebhookPayload(
        event_id=event_id,
        source=WebhookSource.KNF_ESPI,
        event_type=WebhookEventType.SYSTEM_HEARTBEAT,
        ticker="SYSTEM",
        entity_name="KNF ESPI Gateway",
        report_number="HEARTBEAT",
        published_at="2026-10-21T08:30:00Z",
        signature="valid",
        timestamp=now,
    )

    res = handler.process_webhook(payload, enforce_signature=False)
    assert res.status == "HEARTBEAT_ACKNOWLEDGED"
