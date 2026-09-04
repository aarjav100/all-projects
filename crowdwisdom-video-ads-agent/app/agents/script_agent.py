from __future__ import annotations

from app.agents.base_agent import BaseAgent
from app.models import CreativeConcepts, Evidence, Scene, VideoScript


class ScriptAgent(BaseAgent[CreativeConcepts, list[VideoScript]]):
    role = "Script Agent"

    def execute(self, payload: CreativeConcepts) -> list[VideoScript]:
        scripts = []
        for concept in payload.concepts:
            beats = [
                (3, concept.visual_hook, concept.verbal_hook),
                (5, "Conflicting feeds, charts, and alerts multiply across the screen.", concept.pain),
                (5, "The frame freezes. A single label asks the viewer to pause.", "What changes when viewpoints meet?"),
                (6, "The clutter folds into a CrowdWisdom research card.", concept.mechanism),
                (6, "Source labels, date, direction, and confidence appear one at a time.", "See the context. Keep the risk visible."),
                (5, "A clean chart and evidence trail replace the noise.", concept.promise),
                (5, "The interface becomes an invitation, not a prediction machine.", "A signal is a starting point, not a guarantee."),
                (5, "CrowdWisdom end card with CTA and disclaimer.", concept.cta),
            ]
            scenes: list[Scene] = []
            cursor = 0.0
            for index, (duration, visual, voiceover) in enumerate(beats, start=1):
                end = cursor + duration
                scenes.append(
                    Scene(
                        scene_id=index,
                        start=cursor,
                        end=end,
                        duration=duration,
                        visual=visual,
                        camera="punch-in" if index < 3 else "smooth push",
                        animation="kinetic type and moving data accents",
                        onscreen_text=self._caption(index, concept),
                        voiceover=voiceover,
                        sfx="notification hit" if index == 2 else "soft data tick",
                        music=concept.music_direction,
                        transition="hard cut" if index < 3 else "data dissolve",
                        asset_requirement="generated motion graphics and product-style UI mock",
                        evidence=concept.evidence,
                    )
                )
                cursor = end
            scripts.append(
                VideoScript(
                    concept_id=concept.concept_id,
                    title=concept.title,
                    duration_seconds=int(cursor),
                    scenes=scenes,
                    cta=concept.cta,
                    disclaimer="CrowdWisdom is a research and market-intelligence tool. Not financial advice. Markets involve risk.",
                )
            )
        return scripts

    @staticmethod
    def _caption(index: int, concept: object) -> str:
        campaign = getattr(concept, "concept_id", "ad_01")
        captions_by_campaign = {
            "ad_01": {
                1: "TOO MUCH NOISE?",
                2: "EVERYONE HAS A TAKE",
                3: "PAUSE THE FEED",
                4: "MEET THE COLLECTIVE VIEW",
                5: "CONTEXT YOU CAN INSPECT",
                6: "CLARITY, NOT CERTAINTY",
                7: "RESEARCH BEFORE REACTION",
                8: "EXPLORE CROW​​DWISDOM",
            },
            "ad_02": {
                1: "SIGNALS NEED CONTEXT",
                2: "WATCH THE CROWD",
                3: "WHAT SHAPED THIS VIEW?",
                4: "CONSENSUS, WITH CONTEXT",
                5: "SOURCE. DATE. CONFIDENCE.",
                6: "SEE THE EVIDENCE",
                7: "RESEARCH BEFORE REACTION",
                8: "SEE THE COLLECTIVE VIEW",
            },
            "ad_03": {
                1: "WHERE DID THE TIME GO?",
                2: "RESEARCH HAS A COST",
                3: "STOP CHASING EVERY TAB",
                4: "ONE FOCUSED MOMENT",
                5: "A REPEATABLE WORKFLOW",
                6: "CLARITY, NOT CERTAINTY",
                7: "RESEARCH BEFORE REACTION",
                8: "MAKE RESEARCH COUNT",
            },
        }
        return captions_by_campaign.get(campaign, captions_by_campaign["ad_01"]).get(
            index, "CROWDWISDOM"
        )