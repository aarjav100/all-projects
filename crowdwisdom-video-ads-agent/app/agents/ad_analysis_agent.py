from __future__ import annotations

from app.agents.base_agent import BaseAgent
from app.models import AdPattern, AdPatterns, Evidence, WorkingAds


class AdAnalysisAgent(BaseAgent[WorkingAds, AdPatterns]):
    role = "Ad Analysis Agent"

    def execute(self, payload: WorkingAds) -> AdPatterns:
        patterns = []
        for ad in sorted(payload.ads, key=lambda item: item.score, reverse=True):
            patterns.append(
                AdPattern(
                    ad_id=ad.ad_id,
                    visual_hook="Immediate screen motion or a visual convergence moment.",
                    opening_hook=ad.headline,
                    verbal_hook=ad.headline,
                    emotional_trigger="Curiosity mixed with relief from noisy research.",
                    pain_point="Conflicting opinions and too many tabs to validate a trade.",
                    desire="A faster, more transparent way to see what informed traders are watching.",
                    fear="Missing context and reacting to the loudest opinion.",
                    curiosity_gap="What changes when scattered viewpoints are compared together?",
                    icp="Active self-directed stock, index, and crypto traders.",
                    awareness_level="problem aware",
                    promise="Turn market noise into a clearer research starting point.",
                    mechanism="Aggregate and compare trader viewpoints with explicit context.",
                    proof="Use dated, source-labeled examples instead of unsupported performance claims.",
                    credibility="Transparent source mix and a visible research workflow.",
                    objection_handling="A consensus signal is a research input, not a guarantee; manage risk independently.",
                    cta=ad.cta,
                    narrative_structure="interrupt → amplify noise → reveal mechanism → clarify next step",
                    visual_style="high-contrast fintech UI, kinetic type, chart motion",
                    pacing="fast first beat, deliberate reveal, concise close",
                    editing_style="hard cuts, split screens, data particles, clean end card",
                    captions="Short captions with one idea per beat.",
                    pattern_interrupts=["silence after notification barrage", "all opinions collapse into one card"],
                    social_proof="Use aggregate viewpoints only when the source and date are visible.",
                    urgency="Timeliness comes from the dated research context, not fake countdowns.",
                    offer_structure="Show the workflow, then invite the viewer to explore CrowdWisdom.",
                    evidence=ad.evidence
                    + [
                        Evidence(
                            claim="Pattern extracted from the ad's creative framing; success is not asserted.",
                            source=ad.source_url,
                            url=ad.source_url,
                            date=ad.last_seen,
                            retrieved_at=payload.research_date,
                            confidence=0.45,
                        )
                    ],
                )
            )
        return AdPatterns(
            patterns=patterns,
            summary="Recurring creative pattern: use motion and contrast to turn information overload into a visible research mechanism.",
        )