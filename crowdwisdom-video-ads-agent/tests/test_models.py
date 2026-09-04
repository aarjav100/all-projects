from datetime import date

import pytest
from pydantic import ValidationError

from app.models import CreativeConcept, QualityReport, Scene, WorkingAd


def test_working_ad_score_is_bounded() -> None:
    ad = WorkingAd(
        ad_id="a",
        brand="Demo",
        platform="Meta",
        source_url="https://example.com",
        headline="A hook",
        body="A body",
        cta="Learn more",
        score=80,
        evidence=[],
    )
    assert ad.score == 80


def test_invalid_score_is_rejected() -> None:
    with pytest.raises(ValidationError):
        WorkingAd(
            ad_id="a",
            brand="Demo",
            platform="Meta",
            source_url="https://example.com",
            headline="A hook",
            body="A body",
            cta="Learn more",
            score=101,
        )


def test_concept_duration_and_scene_contract() -> None:
    concept = CreativeConcept(
        concept_id="ad_01",
        title="Test",
        icp="Active trader",
        awareness_level="problem aware",
        central_idea="Noise becomes context.",
        visual_hook="Moving charts",
        verbal_hook="See the signal.",
        emotional_trigger="Relief",
        pain="Noise",
        promise="Context",
        mechanism="Collective intelligence",
        proof="Dated evidence",
        cta="Explore",
        disclaimer_requirements=["Not advice"],
        visual_style="Fintech",
        pacing="Fast",
        music_direction="Pulse",
        estimated_duration=40,
    )
    scene = Scene(
        scene_id=1,
        start=0,
        end=4,
        duration=4,
        visual="Charts",
        camera="Push",
        animation="Move",
        onscreen_text="HOOK",
        voiceover="See more.",
        sfx="Tick",
        music="Pulse",
        transition="Cut",
        asset_requirement="UI",
    )
    assert concept.estimated_duration == 40
    assert scene.end - scene.start == scene.duration


def test_quality_report_pass_field() -> None:
    report = QualityReport(
        ad_id="ad_01",
        hook_score=9,
        clarity_score=9,
        creative_score=9,
        visual_score=9,
        brand_fit_score=9,
        proof_score=8,
        compliance_score=10,
        overall_score=9,
        passed=True,
        findings=[],
    )
    assert report.passed is True