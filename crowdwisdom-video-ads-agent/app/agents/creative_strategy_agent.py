from __future__ import annotations

from datetime import date

from app.agents.base_agent import BaseAgent
from app.models import (
    AdPatterns,
    CreativeConcept,
    CreativeConcepts,
    Evidence,
    PainResearch,
    ProprietaryInsights,
)


class CreativeStrategyAgent(
    BaseAgent[tuple[AdPatterns, PainResearch, ProprietaryInsights], CreativeConcepts]
):
    role = "Creative Strategy Agent"

    def execute(
        self, payload: tuple[AdPatterns, PainResearch, ProprietaryInsights]
    ) -> CreativeConcepts:
        ad_patterns, pains, proprietary = payload
        pain = pains.findings[0].pain_point if pains.findings else "research noise"
        proof = proprietary.proof_points[0] if proprietary.proof_points else "Use source-labeled research context."
        evidence = [
            Evidence(
                claim="Concept informed by the research and proprietary inputs stored in this run.",
                source="pipeline inputs",
                retrieved_at=str(date.today()),
                confidence=0.8,
            )
        ]
        concepts = [
            CreativeConcept(
                concept_id="ad_01",
                title="The Noise Cut",
                icp="Active traders drowning in charts, feeds, and conflicting takes.",
                awareness_level="problem aware",
                central_idea="Make information overload physically collapse into a calmer research card.",
                visual_hook="A wall of live-looking windows multiplies until the frame cannot hold it.",
                verbal_hook="More information is not the same as more clarity.",
                emotional_trigger="Overwhelm turning into relief.",
                pain=pain,
                promise="See a research starting point without chasing every opinion.",
                mechanism="CrowdWisdom compares collective trader intelligence with transparent context.",
                proof=proof,
                cta="Explore the collective view.",
                disclaimer_requirements=["Research tool only; no guarantee of outcomes.", "Use risk controls independently."],
                visual_style="rapid UI montage, hard cuts, then a crisp emerald data reveal",
                pacing="aggressive 0–5s hook, breath at 6s, steady proof, sharp CTA",
                music_direction="glitch percussion that resolves into a confident pulse",
                estimated_duration=40,
                evidence=evidence,
            ),
            CreativeConcept(
                concept_id="ad_02",
                title="Consensus, With Context",
                icp="Evidence-seeking traders who want to validate a thesis before acting.",
                awareness_level="solution aware",
                central_idea="Turn many trader viewpoints into an explorable signal card, not a magic answer.",
                visual_hook="Thousands of particles move in opposite directions, then form a dated setup with levels.",
                verbal_hook="A signal is more useful when you can see what shaped it.",
                emotional_trigger="Skepticism becoming informed confidence.",
                pain="One-sided sentiment can feel persuasive while context stays hidden.",
                promise="Start with the direction, then inspect the evidence and the risk boundaries.",
                mechanism="Source-weighted collective intelligence surfaces alignment and uncertainty.",
                proof=proof,
                cta="See the evidence behind the view.",
                disclaimer_requirements=["Not financial advice.", "Past or source-reported performance is not a guarantee."],
                visual_style="data particles, clean chart overlays, editorial labels, measured motion",
                pacing="slow visual hook, quick explanation, proof-forward close",
                music_direction="low synth bed with a precise percussive lift",
                estimated_duration=40,
                evidence=evidence,
            ),
            CreativeConcept(
                concept_id="ad_03",
                title="Buy Back Your Research Time",
                icp="Time-poor active traders who research across multiple communities.",
                awareness_level="solution aware",
                central_idea="Compress the ritual of checking every channel into one focused moment of orientation.",
                visual_hook="A clock made from browser tabs spins wildly, then rewinds into one clear workflow.",
                verbal_hook="How much of your week disappears looking for the same answer?",
                emotional_trigger="Time anxiety becoming control.",
                pain="Traders want validation without spending the entire day checking every channel.",
                promise="Use a repeatable research workflow before you decide what deserves attention.",
                mechanism="CrowdWisdom organizes collective trader viewpoints into actionable context.",
                proof=proof,
                cta="Make your next research session count.",
                disclaimer_requirements=["A faster workflow does not remove market risk.", "Do your own due diligence."],
                visual_style="time-lapse browser chaos, elastic transitions, clean end-frame",
                pacing="whip-pan opening, compressed montage, slow confident reveal",
                music_direction="ticking textures that resolve into a warm, focused groove",
                estimated_duration=40,
                evidence=evidence,
            ),
        ]
        return CreativeConcepts(concepts=concepts)