from pathlib import Path

from app.agents.creative_strategy_agent import CreativeStrategyAgent
from app.agents.quality_control_agent import QualityControlAgent
from app.config import settings
from app.models import CreativeConcepts, Storyboard
from app.orchestrator.pipeline import Pipeline
from app.tools.data_loader import ProprietaryDataLoader
from app.tools.json_store import cache_path
from app.tools.research import demo_ads, demo_pain_research


def test_cache_key_is_stable() -> None:
    assert cache_path(Path("/tmp/cache"), "research", "same") == cache_path(
        Path("/tmp/cache"), "research", "same"
    )


def test_proprietary_files_are_inspected() -> None:
    insights = ProprietaryDataLoader().inspect(settings.proprietary_dir)
    assert len(insights.files_inspected) >= 2
    assert any("confidence" in item.metric for item in insights.statistics)
    assert any("direction recorded as LONG" in item for item in insights.patterns)


def test_exactly_three_concepts() -> None:
    pipeline = Pipeline()
    ads = demo_ads()
    patterns = __import__("app.agents.ad_analysis_agent", fromlist=["AdAnalysisAgent"]).AdAnalysisAgent().run(ads)
    pains = demo_pain_research()
    proprietary = ProprietaryDataLoader().inspect(settings.proprietary_dir)
    concepts = CreativeStrategyAgent().run((patterns, pains, proprietary))
    assert isinstance(concepts, CreativeConcepts)
    assert len(concepts.concepts) == 3
    assert {concept.concept_id for concept in concepts.concepts} == {"ad_01", "ad_02", "ad_03"}


def test_storyboards_pass_compliance_and_duration() -> None:
    pipeline = Pipeline()
    result = pipeline.full(force_refresh=False)
    storyboards = result["storyboards"]
    reports = result["qa"]
    assert len(storyboards) == 3
    assert all(isinstance(storyboard, Storyboard) for storyboard in storyboards)
    assert all(storyboard.duration_seconds == 40 for storyboard in storyboards)
    assert all(report.passed for report in reports)
    assert all(Path(video.path).exists() for video in result["videos"])