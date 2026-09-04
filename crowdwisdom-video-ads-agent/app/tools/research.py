from __future__ import annotations

import json
import urllib.parse
import urllib.request
from datetime import date, timedelta
from typing import Any

from app.config import settings
from app.models import Evidence, PainPoint, PainResearch, WorkingAd, WorkingAds
from app.tools.json_store import cache_path, read_json, write_json


def _request_json(url: str, headers: dict[str, str], body: dict[str, Any] | None = None) -> Any:
    encoded = json.dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(
        url,
        data=encoded,
        headers={**headers, "Content-Type": "application/json"},
        method="POST" if body is not None else "GET",
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        return json.loads(response.read().decode("utf-8"))


class ApifyClient:
    """Adapter for a public Apify actor; actor output is normalized defensively."""

    actor_id = "apify~facebook-ads-library-scraper"

    def collect(self, force_refresh: bool = False) -> WorkingAds:
        key = f"apify:{self.actor_id}:{settings.lookback_days}"
        cached = cache_path(settings.cache_dir, "apify", key)
        if cached.exists() and not force_refresh:
            return read_json(cached, WorkingAds)
        if not settings.apify_api_token:
            result = demo_ads()
            result.adapter_status = "demo: APIFY_API_TOKEN not configured"
            write_json(cached, result)
            return result
        try:
            # Actor/API shapes change, so keep this adapter isolated and normalize
            # only fields the rest of the pipeline needs.
            url = (
                f"https://api.apify.com/v2/acts/{self.actor_id}/run-sync-get-dataset-items"
                f"?token={urllib.parse.quote(settings.apify_api_token)}"
            )
            payload = _request_json(
                url,
                {},
                {
                    "searchQueries": ["trading signals", "market intelligence"],
                    "maxItems": 25,
                    "proxyConfiguration": {"useApifyProxy": True},
                },
            )
            ads: list[WorkingAd] = []
            for index, item in enumerate(payload if isinstance(payload, list) else []):
                ads.append(
                    WorkingAd(
                        ad_id=str(item.get("id", f"apify-{index}")),
                        brand=str(item.get("pageName", item.get("brand", "Unknown"))),
                        platform=str(item.get("platform", "Meta")),
                        source_url=str(item.get("adArchiveUrl", item.get("url", ""))),
                        creative_url=item.get("videoUrl") or item.get("imageUrl"),
                        first_seen=item.get("startDate"),
                        last_seen=item.get("endDate"),
                        headline=str(item.get("headline", "")),
                        body=str(item.get("body", item.get("adText", ""))),
                        cta=str(item.get("callToAction", "Learn more")),
                        media_type="video" if item.get("videoUrl") else "image",
                        score=_score(item),
                        evidence=[],
                    )
                )
            result = WorkingAds(
                research_date=str(date.today()),
                lookback_days=settings.lookback_days,
                ads=ads,
                adapter_status="live: Apify",
            )
            write_json(cached, result)
            return result
        except Exception as exc:
            fallback = demo_ads()
            fallback.adapter_status = f"fallback after Apify failure: {type(exc).__name__}"
            write_json(cached, fallback)
            return fallback


class TavilyClient:
    def search(self, query: str) -> list[dict[str, Any]]:
        if not settings.tavily_api_key:
            return []
        return _request_json(
            "https://api.tavily.com/search",
            {"Authorization": f"Bearer {settings.tavily_api_key}"},
            {
                "api_key": settings.tavily_api_key,
                "query": query,
                "search_depth": "advanced",
                "topic": "news",
                "days": settings.lookback_days,
                "max_results": 8,
            },
        ).get("results", [])


class ExaClient:
    def search(self, query: str) -> list[dict[str, Any]]:
        if not settings.exa_api_key:
            return []
        payload = _request_json(
            "https://api.exa.ai/search",
            {"x-api-key": settings.exa_api_key},
            {
                "query": query,
                "type": "auto",
                "startPublishedDate": str(date.today() - timedelta(days=settings.lookback_days)),
                "numResults": 8,
                "contents": {"highlights": {"maxCharacters": 700}},
            },
        )
        return payload.get("results", [])


class PainResearchAdapter:
    queries = [
        "trader information overload conflicting signals research fatigue",
        "active traders questions signal services trust current market conversation",
        "retail trader emotional trading FOMO validation problem",
    ]

    def collect(self, force_refresh: bool = False) -> PainResearch:
        key = f"pain:{settings.lookback_days}"
        cached = cache_path(settings.cache_dir, "research", key)
        if cached.exists() and not force_refresh:
            return read_json(cached, PainResearch)
        results: list[dict[str, Any]] = []
        status = []
        if settings.tavily_api_key:
            for query in self.queries:
                results.extend(TavilyClient().search(query))
            status.append("Tavily")
        if settings.exa_api_key:
            for query in self.queries:
                results.extend(ExaClient().search(query))
            status.append("Exa")
        if not results:
            result = demo_pain_research()
            result.adapter_status = "demo: Tavily/Exa credentials not configured"
        else:
            findings = []
            for item in results[:15]:
                title = str(item.get("title", "Research result"))
                snippet = str(item.get("content", item.get("snippet", "")))
                url = item.get("url")
                findings.append(
                    {
                        "pain_point": title,
                        "evidence": snippet[:700],
                        "source": "Tavily/Exa",
                        "url": url,
                        "date": item.get("published_date"),
                        "confidence": 0.65,
                    }
                )
            result = PainResearch(
                research_date=str(date.today()),
                lookback_days=settings.lookback_days,
                findings=findings,
                adapter_status=f"live: {', '.join(status)}",
            )
        write_json(cached, result)
        return result


def _score(item: dict[str, Any]) -> float:
    relevance = 25 if any(
        term in json.dumps(item).lower()
        for term in ("trade", "market", "signal", "invest")
    ) else 10
    longevity = 20 if item.get("endDate") else 8
    media = 20 if item.get("videoUrl") else 12
    engagement = min(20, float(item.get("likes", 0) or 0) / 100)
    repeated = 15 if item.get("isActive") else 6
    return min(100, relevance + longevity + media + engagement + repeated)


def demo_ads() -> WorkingAds:
    today = str(date.today())
    evidence = [
        Evidence(
            claim="Demo creative pattern only; no performance success is asserted.",
            source="curated_demo_dataset",
            retrieved_at=today,
            confidence=0.4,
        )
    ]
    ads = [
        WorkingAd(
            ad_id="demo-noise",
            brand="MarketSignal Demo",
            platform="Meta",
            source_url="https://example.com/demo/noise",
            first_seen=today,
            last_seen=today,
            headline="Stop scrolling. Start seeing the signal.",
            body="A fast-cut creative turns conflicting opinions into a single research workflow.",
            cta="Learn more",
            score=78,
            evidence=evidence,
            demo=True,
        ),
        WorkingAd(
            ad_id="demo-proof",
            brand="Consensus Lab Demo",
            platform="YouTube",
            source_url="https://example.com/demo/proof",
            first_seen=today,
            last_seen=today,
            headline="What are thousands of traders watching?",
            body="Animated dots converge around a chart, then reveal the evidence behind a setup.",
            cta="See how it works",
            score=74,
            evidence=evidence,
            demo=True,
        ),
        WorkingAd(
            ad_id="demo-time",
            brand="SignalDesk Demo",
            platform="Instagram",
            source_url="https://example.com/demo/time",
            first_seen=today,
            last_seen=today,
            headline="Make research time count.",
            body="A transformation story compresses a noisy research day into a focused decision ritual.",
            cta="Explore",
            score=70,
            evidence=evidence,
            demo=True,
        ),
    ]
    return WorkingAds(
        research_date=today,
        lookback_days=settings.lookback_days,
        ads=ads,
        adapter_status="demo dataset",
    )


def demo_pain_research() -> PainResearch:
    today = str(date.today())
    findings = [
        PainPoint(
            pain_point="Information overload makes it hard to separate a useful setup from market noise.",
            evidence="Demo finding based on the recurring research theme of conflicting charts, headlines, and opinions.",
            source="curated_demo_research",
            date=today,
            confidence=0.55,
        ),
        PainPoint(
            pain_point="Traders want to validate a thesis without spending the entire day checking every channel.",
            evidence="Demo finding based on the recurring research theme of time pressure and research fatigue.",
            source="curated_demo_research",
            date=today,
            confidence=0.55,
        ),
        PainPoint(
            pain_point="One-sided sentiment can feel persuasive, but traders still need context and explicit risk levels.",
            evidence="Demo finding emphasizes that a signal is not a guarantee and needs transparent context.",
            source="curated_demo_research",
            date=today,
            confidence=0.7,
        ),
        PainPoint(
            pain_point="FOMO and emotional reactions can replace a repeatable research process.",
            evidence="Demo finding based on common active-trader behavior patterns.",
            source="curated_demo_research",
            date=today,
            confidence=0.55,
        ),
    ]
    return PainResearch(
        research_date=today,
        lookback_days=settings.lookback_days,
        findings=findings,
        adapter_status="demo dataset",
    )