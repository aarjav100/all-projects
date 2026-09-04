from __future__ import annotations

import csv
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.models import ProprietaryInsights, ProprietaryStatistic


class ProprietaryDataLoader:
    """Inspects files by extension and preserves source locations in findings."""

    supported = {".csv", ".json", ".xlsx", ".pdf", ".txt"}

    def inspect(self, directory: Path) -> ProprietaryInsights:
        files = sorted(path for path in directory.rglob("*") if path.is_file())
        assets: list[dict[str, Any]] = []
        statistics: list[ProprietaryStatistic] = []
        patterns: list[str] = []
        proof_points: list[str] = []
        limitations: list[str] = []
        for path in files:
            if path.suffix.lower() not in self.supported:
                limitations.append(f"Skipped unsupported file: {path.name}")
                continue
            record = self._inspect_one(path)
            assets.append(record["asset"])
            statistics.extend(record["statistics"])
            patterns.extend(record["patterns"])
            proof_points.extend(record["proof_points"])
            limitations.extend(record["limitations"])
        if not files:
            limitations.append("No proprietary files found; run remains safe but has no proprietary proof.")
        return ProprietaryInsights(
            files_inspected=[str(path.relative_to(directory.parent.parent)) for path in files],
            assets=assets,
            statistics=statistics,
            patterns=list(dict.fromkeys(patterns)),
            proof_points=list(dict.fromkeys(proof_points)),
            limitations=limitations,
        )

    def _inspect_one(self, path: Path) -> dict[str, Any]:
        suffix = path.suffix.lower()
        asset = {"file": str(path), "type": suffix[1:], "bytes": path.stat().st_size}
        base = {
            "asset": asset,
            "statistics": [],
            "patterns": [],
            "proof_points": [],
            "limitations": [],
        }
        if suffix == ".json":
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
                if isinstance(payload, dict):
                    ticker = str(payload.get("ticker", path.stem))
                    direction = payload.get("direction")
                    confidence = payload.get("confidence level")
                    if direction:
                        base["patterns"].append(f"{ticker} direction recorded as {direction}.")
                    if confidence is not None:
                        base["statistics"].append(
                            ProprietaryStatistic(
                                metric=f"{ticker} confidence level",
                                value=confidence,
                                source_file=str(path),
                                location="top-level JSON field: confidence level",
                                interpretation="Reported source confidence, not a return forecast.",
                                confidence=0.98,
                            )
                        )
                    for key in ("current price", "target 1", "target 2", "stop 1", "stop 2"):
                        if key in payload:
                            base["statistics"].append(
                                ProprietaryStatistic(
                                    metric=f"{ticker} {key}",
                                    value=payload[key],
                                    source_file=str(path),
                                    location=f"top-level JSON field: {key}",
                                    interpretation="A source-provided level for the dated analysis.",
                                    confidence=0.98,
                                )
                            )
                    if payload.get("title"):
                        base["proof_points"].append(
                            f"{ticker}: {payload['title']} (source file dated {payload.get('date', 'undated')})."
                        )
                    sources = payload.get("sources weights")
                    if isinstance(sources, dict):
                        base["patterns"].append(
                            f"{ticker} source mix is explicitly weighted across "
                            + ", ".join(f"{k} {v}%" for k, v in sources.items())
                            + "."
                        )
            except (json.JSONDecodeError, UnicodeDecodeError) as exc:
                base["limitations"].append(f"Could not parse {path.name}: {exc}")
        elif suffix == ".csv":
            try:
                with path.open(newline="", encoding="utf-8") as handle:
                    rows = list(csv.DictReader(handle))
                asset["rows"] = len(rows)
                if rows:
                    asset["columns"] = list(rows[0].keys())
            except (OSError, UnicodeDecodeError) as exc:
                base["limitations"].append(f"Could not parse {path.name}: {exc}")
        elif suffix == ".txt":
            text = path.read_text(encoding="utf-8", errors="replace")
            asset["characters"] = len(text)
            base["patterns"].append(f"{path.name} contains {len(text)} characters of source notes.")
        elif suffix == ".xlsx":
            try:
                with zipfile.ZipFile(path) as archive:
                    names = archive.namelist()
                asset["zip_entries"] = len(names)
                if "xl/workbook.xml" in names:
                    base["patterns"].append(f"{path.name} is a readable XLSX workbook.")
            except (zipfile.BadZipFile, OSError) as exc:
                base["limitations"].append(f"Could not inspect {path.name}: {exc}")
        elif suffix == ".pdf":
            base["limitations"].append(
                f"{path.name} was catalogued; install PyMuPDF to extract page-level PDF claims."
            )
        return base


def retrieved_at() -> str:
    return datetime.now(timezone.utc).isoformat()