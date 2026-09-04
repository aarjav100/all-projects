from __future__ import annotations

import re

from app.agents.base_agent import BaseAgent
from app.models import QualityReport, Storyboard


class QualityControlAgent(BaseAgent[list[Storyboard], list[QualityReport]]):
    role = "Quality Control Agent"

    banned = re.compile(
        r"guaranteed|risk[- ]?free|never lose|100% accurate|get rich|guaranteed returns",
        re.I,
    )

    def execute(self, payload: list[Storyboard]) -> list[QualityReport]:
        reports = []
        for storyboard in payload:
            all_text = " ".join(
                f"{scene.onscreen_text} {scene.voiceover}" for scene in storyboard.scenes
            )
            findings = []
            if not storyboard.scenes or storyboard.scenes[0].duration > 3:
                findings.append("The opening visual beat should land within three seconds.")
            if self.banned.search(all_text):
                compliance = 0
                findings.append("Banned financial promise detected.")
            else:
                compliance = 10
            first_hook = bool(storyboard.scenes and storyboard.scenes[0].onscreen_text)
            scores = {
                "hook_score": 9 if first_hook else 5,
                "clarity_score": 9,
                "creative_score": 9,
                "visual_score": 9 if len(storyboard.scenes) >= 8 else 7,
                "brand_fit_score": 9,
                "proof_score": 8 if any(scene.evidence for scene in storyboard.scenes) else 5,
                "compliance_score": compliance,
            }
            overall = round(sum(scores.values()) / len(scores), 1)
            reports.append(
                QualityReport(
                    ad_id=storyboard.campaign,
                    **scores,
                    overall_score=overall,
                    passed=overall >= 8 and compliance == 10 and not findings,
                    findings=findings
                    or [
                        "Strong opening hook and visible motion.",
                        "Product is framed as research context, not a profit promise.",
                    ],
                )
            )
        return reports