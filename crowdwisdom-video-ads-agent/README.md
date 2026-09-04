# CrowdWisdom Trading Video Ads Agent

An inspectable multi-agent marketing pipeline for CrowdWisdom Trading. It
researches ad patterns and trader pain, inspects dated proprietary JSON inputs,
creates exactly three distinct video campaigns, turns them into production-ready
storyboards, renders real vertical MP4s, and scores them for creative quality
and financial-content safety.

The project is deliberately demo-first: it runs end-to-end without paid API
credentials, while keeping live Apify, Tavily, Exa, OpenRouter, Hermes, and
OpenMontage adapters behind clear boundaries.

## Architecture

```text
                       ┌──────────────────┐
                       │  User / CLI      │
                       └────────┬─────────┘
                                ↓
                       ┌──────────────────┐
                       │  Orchestrator    │
                       └────────┬─────────┘
                                ↓
          ┌─────────────────────┼─────────────────────┐
          ↓                     ↓                     ↓
   Ads Research          Pain / ICP Research    Proprietary Data
          ↓                     ↓                     ↓
          └─────────────────────┼─────────────────────┘
                                ↓
                       Creative Strategy
                                ↓
                         3 Ad Concepts
                                ↓
                       Script / Storyboard
                                ↓
                       Video Director Agent
                                ↓
                  OpenMontage contract / FFmpeg fallback
                                ↓
                          Quality Control
                                ↓
                     MP4 + JSON + final report
```

## Agents

| Agent | Responsibility |
| --- | --- |
| Ads Manager | Collects and scores recent public ad candidates through Apify, or uses a clearly labeled demo dataset. |
| Ad Analysis | Extracts hooks, ICP, emotional triggers, pacing, structure, CTA, proof, and objection patterns without copying creative. |
| Pain / ICP Research | Searches Tavily and/or Exa when configured, otherwise emits labeled research themes. |
| Proprietary Data | Inspects CSV, JSON, XLSX, PDF, and TXT files and preserves source file and location for every extracted statistic. |
| Creative Strategy | Produces exactly three substantially different campaigns: noise interrupt, consensus with context, and research-time transformation. |
| Script | Produces 30–60 second production scripts with visual, camera, animation, VO, captions, SFX, music, transitions, assets, and evidence. |
| Storyboard | Converts scripts into readable JSON and Markdown for video production. |
| Video Director | Uses the storyboard contract, tries the OpenMontage-compatible path, and renders deterministic motion graphics with FFmpeg. |
| Quality Control | Scores hook, clarity, creativity, visual motion, brand fit, proof, compliance, and overall quality. |

Each agent inherits `BaseAgent`, which provides a named role, retries, logging,
and a typed Pydantic input/output boundary. Hermes is supported through the
upstream Python-library API (`run_agent.AIAgent`) when `HERMES_PATH` points at a
Hermes checkout. OpenRouter is the structured-response provider when Hermes is
not available and `OPENROUTER_API_KEY` is set.

## Installation

```bash
python -m pip install -r requirements.txt
cp .env.example .env
```

FFmpeg is required for the local MP4 renderer. The Replit environment already
provides it; on another machine install FFmpeg through the operating system's
package manager.

## Environment variables

```text
OPENROUTER_API_KEY=       # optional live concept/script generation
OPENROUTER_MODEL=         # defaults to anthropic/claude-3.5-sonnet
APIFY_API_TOKEN=          # optional live ad collection
TAVILY_API_KEY=           # optional current web research
EXA_API_KEY=              # optional current web research
HERMES_PATH=              # optional path to a Hermes source checkout
VIDEO_WIDTH=720           # use 1080 for a larger render if resources allow
VIDEO_HEIGHT=1280
VIDEO_FPS=30
```

Secrets are loaded with `python-dotenv` and are never printed. Do not commit
`.env`.

## Run the complete demo

```bash
python -m app.main --mode demo
# equivalent:
python -m app.main --mode full
```

The demo uses `data/proprietary/` as its source of truth. The two assessment
files currently present there are dated Nasdaq-100 and Snowflake JSON analyses
retrieved from the connected Drive inputs. Their contents are not hard-coded
into the agents.

## Selective modes

```bash
python -m app.main --mode research
python -m app.main --mode concepts
python -m app.main --mode scripts
python -m app.main --mode video
python -m app.main --mode qa
python -m app.main --mode research --force-refresh
```

## Expected outputs

```text
data/
├── analyzed/
│   ├── ad_patterns.json
│   └── proprietary_insights.json
├── competitor_ads/working_ads.json
└── research/trader_pain_points.json

outputs/
├── reports/
│   ├── competitor_analysis.md
│   └── final_report.md
├── scripts/
│   ├── concepts.json
│   └── ad_01.json ... ad_03.json
├── storyboards/
│   ├── ad_01.json ... ad_03.json
│   └── ad_01.md ... ad_03.md
├── videos/
│   ├── ad_01.mp4
│   ├── ad_02.mp4
│   ├── ad_03.mp4
│   └── video_metadata.json
└── qa/ad_01.json ... ad_03.json
```

The generated ads are 9:16, 720×1280, 30fps, 40 seconds, and include a
low-volume synthetic audio bed. They are intentionally motion-graphic
performance-ad proofs of concept, not final paid media exports.

## Financial-content safety

The system avoids guaranteed returns, risk-free language, fake testimonials,
fabricated performance, and get-rich-quick claims. Every concept carries
disclaimer requirements. Source-provided prices, targets, and confidence values
are preserved as dated research context and are not rewritten as promises.
Human compliance review is required before publication.

## Tests

```bash
pytest
```

The tests cover configuration defaults, Pydantic validation, cache path
stability, proprietary JSON inspection, exact concept count, storyboard
duration, compliance scoring, and pipeline output contracts.

## Troubleshooting

- **No live API credentials:** use `--mode demo`; adapters fall back without
  pretending that demo data is live.
- **Stale research:** add `--force-refresh` to bypass adapter caches.
- **FFmpeg error:** confirm `ffmpeg -version` works and lower
  `VIDEO_WIDTH`/`VIDEO_HEIGHT` for constrained machines.
- **Hermes unavailable:** leave `HERMES_PATH` empty; the deterministic pipeline
  still works. To use Hermes, clone the upstream source checkout and set
  `HERMES_PATH` to that directory.
- **Malformed provider JSON:** live structured generation is retried and
  validated; the run fails explicitly rather than silently saving malformed
  artifacts.

## Known limitations and next improvements

- The Apify actor response schema differs between actors; the adapter is
  intentionally isolated so an evaluator can swap in a configured actor.
- The FFmpeg fallback uses generated motion graphics rather than licensed stock
  footage, voiceover, or OpenMontage scene primitives.
- Current research fallbacks are illustrative and must not be described as
  current market evidence.
- The next production step is a human approval gate for claims, assets, and
  platform-specific ad policies.