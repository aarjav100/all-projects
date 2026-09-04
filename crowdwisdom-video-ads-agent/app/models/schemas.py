from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, ConfigDict


class Evidence(BaseModel):
    model_config = ConfigDict(extra="ignore")

    claim: str
    source: str
    url: str | None = None
    date: str | None = None
    retrieved_at: str
    confidence: float = Field(ge=0, le=1)
    location: str | None = None


class WorkingAd(BaseModel):
    ad_id: str
    brand: str
    platform: str
    source_url: str
    creative_url: str | None = None
    first_seen: str | None = None
    last_seen: str | None = None
    headline: str
    body: str
    cta: str
    media_type: Literal["video", "image", "carousel", "unknown"] = "video"
    score: float = Field(ge=0, le=100)
    evidence: list[Evidence] = Field(default_factory=list)
    demo: bool = False


class WorkingAds(BaseModel):
    research_date: str
    lookback_days: int
    ads: list[WorkingAd]
    adapter_status: str


class AdPattern(BaseModel):
    ad_id: str
    visual_hook: str
    opening_hook: str
    verbal_hook: str
    emotional_trigger: str
    pain_point: str
    desire: str
    fear: str
    curiosity_gap: str
    icp: str
    awareness_level: str
    promise: str
    mechanism: str
    proof: str
    credibility: str
    objection_handling: str
    cta: str
    narrative_structure: str
    visual_style: str
    pacing: str
    editing_style: str
    captions: str
    pattern_interrupts: list[str]
    social_proof: str
    urgency: str
    offer_structure: str
    evidence: list[Evidence] = Field(default_factory=list)


class AdPatterns(BaseModel):
    patterns: list[AdPattern]
    summary: str


class PainPoint(BaseModel):
    pain_point: str
    evidence: str
    source: str
    url: str | None = None
    date: str | None = None
    confidence: float = Field(ge=0, le=1)


class PainResearch(BaseModel):
    research_date: str
    lookback_days: int
    findings: list[PainPoint]
    adapter_status: str


class ProprietaryStatistic(BaseModel):
    metric: str
    value: Any
    source_file: str
    location: str | None = None
    interpretation: str
    confidence: float = Field(ge=0, le=1)


class ProprietaryInsights(BaseModel):
    files_inspected: list[str]
    assets: list[dict[str, Any]]
    statistics: list[ProprietaryStatistic]
    patterns: list[str]
    proof_points: list[str]
    limitations: list[str]


class CreativeConcept(BaseModel):
    concept_id: str
    title: str
    icp: str
    awareness_level: str
    central_idea: str
    visual_hook: str
    verbal_hook: str
    emotional_trigger: str
    pain: str
    promise: str
    mechanism: str
    proof: str
    cta: str
    disclaimer_requirements: list[str]
    visual_style: str
    pacing: str
    music_direction: str
    estimated_duration: int = Field(ge=30, le=60)
    evidence: list[Evidence] = Field(default_factory=list)


class CreativeConcepts(BaseModel):
    concepts: list[CreativeConcept] = Field(min_length=3, max_length=3)


class Scene(BaseModel):
    scene_id: int
    start: float = Field(ge=0)
    end: float = Field(gt=0)
    duration: float = Field(gt=0)
    visual: str
    camera: str
    animation: str
    onscreen_text: str
    voiceover: str
    sfx: str
    music: str
    transition: str
    asset_requirement: str
    evidence: list[Evidence] = Field(default_factory=list)


class VideoScript(BaseModel):
    concept_id: str
    title: str
    duration_seconds: int = Field(ge=30, le=60)
    scenes: list[Scene] = Field(min_length=6)
    cta: str
    disclaimer: str


class Storyboard(BaseModel):
    campaign: str
    duration_seconds: int = Field(ge=30, le=60)
    aspect_ratio: str = "9:16"
    platform: str = "TikTok/Reels/Shorts"
    concept: str
    scenes: list[Scene] = Field(min_length=6)
    cta: str
    disclaimer: str


class VideoMetadata(BaseModel):
    ad_id: str
    path: str
    renderer: str
    width: int
    height: int
    fps: int
    duration_seconds: float
    audio: bool
    status: str


class QualityReport(BaseModel):
    ad_id: str
    hook_score: float = Field(ge=0, le=10)
    clarity_score: float = Field(ge=0, le=10)
    creative_score: float = Field(ge=0, le=10)
    visual_score: float = Field(ge=0, le=10)
    brand_fit_score: float = Field(ge=0, le=10)
    proof_score: float = Field(ge=0, le=10)
    compliance_score: float = Field(ge=0, le=10)
    overall_score: float = Field(ge=0, le=10)
    passed: bool
    findings: list[str]
    revision_cycle: int = 0