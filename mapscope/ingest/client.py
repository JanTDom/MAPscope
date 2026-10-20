import time
import asyncio
from typing import Optional, Dict, Any
from urllib.parse import urlparse
import httpx


class PoliteHttpClient:
    """
    Polite HTTP client for MAPscope internet ingestion:
    - Transparent User-Agent with verifiable identity and contact email.
    - Strict per-domain rate limiting (default <= 1 request/sec per domain).
    - Exponential backoff retry on transient errors (429, 500, 502, 503, 504).
    """

    DEFAULT_USER_AGENT = "MAPscope/1.0 (+https://mapscope.pl; kontakt@mapscope.pl)"

    def __init__(
        self,
        user_agent: str = DEFAULT_USER_AGENT,
        rate_limit_per_domain_sec: float = 1.0,
        timeout: float = 10.0,
        max_retries: int = 3,
        backoff_factor: float = 1.5,
    ):
        self.user_agent = user_agent
        self.rate_limit_sec = rate_limit_per_domain_sec
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
        self._last_request_time: Dict[str, float] = {}

    def _throttle(self, domain: str) -> None:
        """Enforces rate limiting per domain synchronously."""
        now = time.time()
        last = self._last_request_time.get(domain, 0.0)
        elapsed = now - last
        if elapsed < self.rate_limit_sec:
            time.sleep(self.rate_limit_sec - elapsed)
        self._last_request_time[domain] = time.time()

    async def _throttle_async(self, domain: str) -> None:
        """Enforces rate limiting per domain asynchronously."""
        now = time.time()
        last = self._last_request_time.get(domain, 0.0)
        elapsed = now - last
        if elapsed < self.rate_limit_sec:
            await asyncio.sleep(self.rate_limit_sec - elapsed)
        self._last_request_time[domain] = time.time()

    def get(self, url: str, headers: Optional[Dict[str, str]] = None) -> httpx.Response:
        """Executes a polite synchronous HTTP GET request with retries and rate limiting."""
        domain = urlparse(url).netloc
        self._throttle(domain)

        req_headers = {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        if headers:
            req_headers.update(headers)

        retries = 0
        while True:
            try:
                with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                    resp = client.get(url, headers=req_headers)
                    if resp.status_code in (429, 500, 502, 503, 504) and retries < self.max_retries:
                        retries += 1
                        time.sleep(self.backoff_factor ** retries)
                        continue
                    return resp
            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                if retries < self.max_retries:
                    retries += 1
                    time.sleep(self.backoff_factor ** retries)
                    continue
                raise exc

    async def get_async(self, url: str, headers: Optional[Dict[str, str]] = None) -> httpx.Response:
        """Executes a polite asynchronous HTTP GET request with retries and rate limiting."""
        domain = urlparse(url).netloc
        await self._throttle_async(domain)

        req_headers = {
            "User-Agent": self.user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        if headers:
            req_headers.update(headers)

        retries = 0
        while True:
            try:
                async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                    resp = await client.get(url, headers=req_headers)
                    if resp.status_code in (429, 500, 502, 503, 504) and retries < self.max_retries:
                        retries += 1
                        await asyncio.sleep(self.backoff_factor ** retries)
                        continue
                    return resp
            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                if retries < self.max_retries:
                    retries += 1
                    await asyncio.sleep(self.backoff_factor ** retries)
                    continue
                raise exc
