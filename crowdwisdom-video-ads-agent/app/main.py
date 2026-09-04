from __future__ import annotations

import argparse
import logging
import sys

from app.config import settings
from app.orchestrator.pipeline import Pipeline


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="CrowdWisdom Trading Video Ads Agent")
    parser.add_argument(
        "--mode",
        choices=["full", "research", "concepts", "scripts", "video", "qa", "demo"],
        default="demo",
    )
    parser.add_argument("--force-refresh", action="store_true")
    return parser


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )
    args = build_parser().parse_args()
    pipeline = Pipeline()
    try:
        if args.mode in {"full", "demo"}:
            result = pipeline.full(force_refresh=args.force_refresh)
            print(f"Pipeline complete. Report: {result['report']}")
            for video in result["videos"]:
                print(f"Video: {video.path}")
            for report in result["qa"]:
                print(f"QA: {report.ad_id} {report.overall_score:.1f}/10")
        elif args.mode == "research":
            result = pipeline.research(force_refresh=args.force_refresh)
            print(f"Research complete: {len(result['ads'].ads)} ads, {len(result['pains'].findings)} pain findings")
        elif args.mode == "concepts":
            concepts = pipeline.concepts()
            print(f"Generated exactly {len(concepts.concepts)} concepts.")
        elif args.mode == "scripts":
            scripts = pipeline.scripts()
            print(f"Generated {len(scripts)} scripts and storyboards-ready scenes.")
        elif args.mode == "video":
            videos = pipeline.videos()
            print(f"Rendered {len(videos)} videos.")
        elif args.mode == "qa":
            reports = pipeline.qa()
            print(f"Checked {len(reports)} videos.")
    except Exception as exc:
        logging.getLogger("crowdwisdom").exception("Pipeline failed")
        print(f"Pipeline failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()