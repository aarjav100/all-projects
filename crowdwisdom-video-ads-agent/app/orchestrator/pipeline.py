from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from app.agents.ad_analysis_agent import AdAnalysisAgent
from app.agents.ads_manager_agent import AdsManagerAgent
from app.agents.creative_strategy_agent import CreativeStrategyAgent
from app.agents.pain_research_agent import PainResearchAgent
from app.agents.proprietary_data_agent import ProprietaryDataAgent
from app.agents.quality_control_agent import QualityControlAgent
from app.agents.script_agent import ScriptAgent
from app.agents.storyboard_agent import StoryboardAgent
from app.agents.video_agent import VideoAgent
from app.config import settings
from app.models import (
    AdPatterns,
    CreativeConcepts,
    PainResearch,
    ProprietaryInsights,
    Storyboard,
    VideoMetadata,
    VideoScript,
    WorkingAds,
)
from app.tools.json_store import read_json, write_json

logger = logging.getLogger("crowdwisdom.pipeline")


class Pipeline:
    def __init__(self) -> None:
        settings.ensure_directories()

    def research(self, force_refresh: bool = False) -> dict[str, Any]:
        ads = AdsManagerAgent().run(force_refresh)
        patterns = AdAnalysisAgent().run(ads)
        pains = PainResearchAgent().run(force_refresh)
        proprietary = ProprietaryDataAgent().run(settings.proprietary_dir)
        write_json(settings.data_dir / "competitor_ads" / "working_ads.json", ads)
        write_json(settings.data_dir / "analyzed" / "ad_patterns.json", patterns)
        write_json(settings.data_dir / "research" / "trader_pain_points.json", pains)
        write_json(settings.data_dir / "analyzed" / "proprietary_insights.json", proprietary)
        write_json(settings.output_dir / "research" / "working_ads.json", ads)
        write_json(settings.output_dir / "research" / "pain_points.json", pains)
        (settings.output_dir / "reports" / "competitor_analysis.md").write_text(
            self._competitor_report(ads, patterns), encoding="utf-8"
        )
        return {
            "ads": ads,
            "patterns": patterns,
            "pains": pains,
            "proprietary": proprietary,
        }

    def concepts(
        self,
        research: dict[str, Any] | None = None,
    ) -> CreativeConcepts:
        research = research or self._load_research()
        concepts = CreativeStrategyAgent().run(
            (research["patterns"], research["pains"], research["proprietary"])
        )
        write_json(settings.output_dir / "scripts" / "concepts.json", concepts)
        return concepts

    def scripts(self, concepts: CreativeConcepts | None = None) -> list[VideoScript]:
        if concepts is None:
            concepts = read_json(
                settings.output_dir / "scripts" / "concepts.json", CreativeConcepts
            )
        scripts = ScriptAgent().run(concepts)
        for script in scripts:
            write_json(
                settings.output_dir / "scripts" / f"{script.concept_id}.json", script
            )
        return scripts

    def storyboards(self, scripts: list[VideoScript] | None = None) -> list[Storyboard]:
        if scripts is None:
            scripts = [
                read_json(path, VideoScript)
                for path in sorted((settings.output_dir / "scripts").glob("ad_*.json"))
            ]
        storyboards = StoryboardAgent().run(scripts)
        for storyboard in storyboards:
            write_json(
                settings.output_dir / "storyboards" / f"{storyboard.campaign}.json",
                storyboard,
            )
            (settings.output_dir / "storyboards" / f"{storyboard.campaign}.md").write_text(
                self._storyboard_markdown(storyboard), encoding="utf-8"
            )
        return storyboards

    def videos(self, storyboards: list[Storyboard] | None = None) -> list[VideoMetadata]:
        if storyboards is None:
            storyboards = [
                read_json(path, Storyboard)
                for path in sorted((settings.output_dir / "storyboards").glob("ad_*.json"))
            ]
        videos = VideoAgent().run(storyboards)
        write_json(
            settings.output_dir / "videos" / "video_metadata.json",
            [video.model_dump(mode="json") for video in videos],
        )
        return videos

    def qa(self, storyboards: list[Storyboard] | None = None) -> list[Any]:
        if storyboards is None:
            storyboards = [
                read_json(path, Storyboard)
                for path in sorted((settings.output_dir / "storyboards").glob("ad_*.json"))
            ]
        reports = QualityControlAgent().run(storyboards)
        for report in reports:
            write_json(settings.output_dir / "qa" / f"{report.ad_id}.json", report)
        return reports

    def full(self, force_refresh: bool = False) -> dict[str, Any]:
        research = self.research(force_refresh)
        concepts = self.concepts(research)
        scripts = self.scripts(concepts)
        storyboards = self.storyboards(scripts)
        videos = self.videos(storyboards)
        qa = self.qa(storyboards)
        report_path = settings.output_dir / "reports" / "final_report.md"
        report_path.write_text(
            self._final_report(research, concepts, videos, qa), encoding="utf-8"
        )
        return {
            "research": research,
            "concepts": concepts,
            "scripts": scripts,
            "storyboards": storyboards,
            "videos": videos,
            "qa": qa,
            "report": report_path,
        }

    def _load_research(self) -> dict[str, Any]:
        return {
            "ads": read_json(
                settings.data_dir / "competitor_ads" / "working_ads.json", WorkingAds
            ),
            "patterns": read_json(
                settings.data_dir / "analyzed" / "ad_patterns.json", AdPatterns
            ),
            "pains": read_json(
                settings.data_dir / "research" / "trader_pain_points.json", PainResearch
            ),
            "proprietary": read_json(
                settings.data_dir / "analyzed" / "proprietary_insights.json",
                ProprietaryInsights,
            ),
        }

    @staticmethod
    def _competitor_report(ads: WorkingAds, patterns: AdPatterns) -> str:
        lines = [
            "# Competitor Creative Analysis",
            "",
            f"Research date: {ads.research_date}  ",
            f"Lookback: {ads.lookback_days} days  ",
            f"Adapter: {ads.adapter_status}",
            "",
            "## Selected ad signals",
        ]
        for ad in ads.ads:
            lines.extend(
                [
                    f"### {ad.brand} — {ad.headline}",
                    f"- Score: {ad.score:.1f}/100 (transparent heuristic; not a performance claim)",
                    f"- Platform: {ad.platform}; CTA: {ad.cta}",
                    f"- Source: {ad.source_url}",
                ]
            )
        lines.extend(["", "## Cross-ad pattern", f"- {patterns.summary}", ""])
        return "\n".join(lines)

    @staticmethod
    def _storyboard_markdown(storyboard: Storyboard) -> str:
        lines = [
            f"# {storyboard.campaign} — {storyboard.concept}",
            "",
            f"- Duration: {storyboard.duration_seconds}s",
            f"- Format: {storyboard.aspect_ratio} · {storyboard.platform}",
            "",
            "| Time | Visual | On-screen text | Voiceover |",
            "|---|---|---|---|",
        ]
        for scene in storyboard.scenes:
            lines.append(
                f"| {scene.start:.0f}–{scene.end:.0f}s | {scene.visual} | "
                f"{scene.onscreen_text} | {scene.voiceover} |"
            )
        lines.extend(["", f"**CTA:** {storyboard.cta}", "", f"**Disclaimer:** {storyboard.disclaimer}"])
        return "\n".join(lines)

    @staticmethod
    def _final_report(
        research: dict[str, Any],
        concepts: CreativeConcepts,
        videos: list[VideoMetadata],
        qa: list[Any],
    ) -> str:
        ads: WorkingAds = research["ads"]
        pains: PainResearch = research["pains"]
        proprietary: ProprietaryInsights = research["proprietary"]
        lines = [
            "# CrowdWisdom Video Ads Agent",
            "",
            "A research → insight → strategy → creative → script → video → QA pipeline "
            "for CrowdWisdom Trading. This run keeps claims source-labeled and treats "
            "signals as research context, never guaranteed outcomes.",
            "",
            "## Research Summary",
            f"- Competitor ads: {len(ads.ads)} ({ads.adapter_status})",
            f"- Trader pain findings: {len(pains.findings)} ({pains.adapter_status})",
            f"- Proprietary files inspected: {len(proprietary.files_inspected)}",
            "",
            "## Competitor Ads",
        ]
        for ad in ads.ads:
            lines.append(f"- {ad.brand}: {ad.headline} — score {ad.score:.1f}/100")
        lines.extend(["", "## Winning Creative Patterns", f"- {research['patterns'].summary}", "", "## Trader Pain Points"])
        lines.extend(f"- {finding.pain_point}" for finding in pains.findings)
        lines.extend(["", "## ICP", "- Active self-directed traders seeking faster, transparent research context."])
        lines.extend(["", "## CrowdWisdom Differentiators", "- Collective intelligence and source-labeled context.", "- Research workflow rather than generic chatbot answers.", "- Signals are framed with uncertainty and risk boundaries."])
        lines.extend(["", "## Proprietary Data Insights"])
        lines.extend(f"- {item.metric}: {item.value} — {item.interpretation} ({item.source_file})" for item in proprietary.statistics)
        lines.extend(["", "## Generated Concepts"])
        for index, concept in enumerate(concepts.concepts, start=1):
            lines.extend([f"### Concept {index}: {concept.title}", f"- {concept.central_idea}", f"- Hook: {concept.verbal_hook}", f"- CTA: {concept.cta}"])
        lines.extend(["", "## Quality Scores"])
        for report in qa:
            lines.append(f"- {report.ad_id}: {report.overall_score:.1f}/10 — {'PASS' if report.passed else 'REVISE'}")
        lines.extend(["", "## Generated Videos"])
        lines.extend(f"- `{video.path}` — {video.width}×{video.height}, {video.duration_seconds:.0f}s, audio={video.audio}" for video in videos)
        lines.extend(
            [
                "",
                "## Architecture",
                "User/CLI → Orchestrator → Research Manager → Ads + Pain + Proprietary agents "
                "→ Creative Strategy → Script/Storyboard → Video Director → FFmpeg/OpenMontage "
                "contract → Quality Control → MP4 + JSON + report.",
                "",
                "## How the Agents Work",
                "- Each agent inherits a retrying BaseAgent with a named role and typed Pydantic boundary.",
                "- Hermes AIAgent is supported through HERMES_PATH; OpenRouter is the primary structured LLM adapter when live credentials are configured.",
                "- Demo mode uses only clearly labeled demo ads/research, while proprietary insights come from the files present in data/proprietary.",
                "",
                "## API Dependencies",
                "- OpenRouter: optional structured generation.",
                "- Apify: optional ad collection.",
                "- Tavily or Exa: optional current pain research.",
                "- FFmpeg: required for the local deterministic render fallback.",
                "",
                "## Setup Instructions",
                "1. Copy `.env.example` to `.env` and add only the providers you want.",
                "2. Install: `python -m pip install -r requirements.txt`.",
                "3. Run: `python -m app.main --mode demo`.",
                "",
                "## Limitations",
                "- Demo research is illustrative and should not be presented as current market research.",
                "- The local renderer creates motion-graphic ads; OpenMontage can be wired to the same storyboard contract when installed.",
                "- Financial content needs human review before publication.",
                "",
                "## Future Improvements",
                "- Add a live ad-library actor configured for the target market.",
                "- Add licensed stock footage, voiceover, captions, and brand-approved UI captures.",
                "- Add human approval gates and platform-specific compliance checks.",
            ]
        )
        return "\n".join(lines) + "\n"