from __future__ import annotations

import os
import platform
import shutil
import subprocess
import textwrap
from pathlib import Path

from app.config import settings
from app.models import Storyboard, VideoMetadata


def _find_font() -> str:
    """Return an escaped font path suitable for FFmpeg drawtext on any OS."""
    if platform.system() == "Windows":
        font = Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "arial.ttf"
        if font.exists():
            return str(font).replace("\\", "/").replace(":", "\\:")
    for candidate in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                      "/System/Library/Fonts/Helvetica.ttc"):
        if Path(candidate).exists():
            return candidate
    return ""


class VideoRenderer:
    """OpenMontage-compatible facade rendering high-impact 9:16 visual trading video ads via FFmpeg."""

    def __init__(self) -> None:
        self.ffmpeg = shutil.which("ffmpeg") or self._find_ffmpeg()

    @staticmethod
    def _find_ffmpeg() -> str | None:
        """Search common Windows install paths when ffmpeg is not on PATH."""
        if platform.system() != "Windows":
            return None
        local_app = os.environ.get("LOCALAPPDATA", "")
        search_roots = [
            Path(local_app) / "Microsoft" / "WinGet" / "Links",
            Path(os.environ.get("ProgramFiles", r"C:\Program Files")),
            Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")),
            Path(local_app) / "Programs",
        ]
        for root in search_roots:
            if not root.exists():
                continue
            candidate = root / "ffmpeg.exe"
            if candidate.exists():
                return str(candidate)
            for child in root.iterdir():
                if child.is_dir():
                    candidate = child / "bin" / "ffmpeg.exe"
                    if candidate.exists():
                        return str(candidate)
        winget_pkgs = Path(local_app) / "Microsoft" / "WinGet" / "Packages"
        if winget_pkgs.exists():
            for match in winget_pkgs.glob("**/ffmpeg.exe"):
                return str(match)
        return None

    def render(self, storyboard: Storyboard, output_path: Path) -> VideoMetadata:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.ffmpeg:
            raise RuntimeError("FFmpeg is required for video rendering.")

        ad_id = output_path.stem
        asset_dir = settings.output_dir / "assets" / ad_id
        asset_dir.mkdir(parents=True, exist_ok=True)

        font = _find_font()
        font_opt = f":fontfile='{font}'" if font else ""
        theme = self._get_theme(ad_id)

        w = settings.video_width
        h = settings.video_height
        duration = storyboard.duration_seconds

        filters = [
            # Background Color
            f"color=c={theme['bg_hex']}:s={w}x{h}:d={duration}[bg]",
            # Animated Trading Grid Overlay
            f"[bg]drawgrid=w=60:h=60:color={theme['grid_hex']}@0.15:t=1[grid]",
            # Top Brand Header Banner
            f"[grid]drawbox=x=0:y=0:w=iw:h=120:color=0x0F172A@0.92:t=fill[topbar]",
            f"[topbar]drawbox=x=0:y=120:w=iw:h=2:color={theme['accent_hex']}@0.5:t=fill[topborder]",
            f"[topborder]drawtext=text='CROWDWISDOM TRADING AI':x=52:y=38:fontsize=30:fontcolor=white:borderw=2:bordercolor=black@0.8{font_opt}[brand]",
            f"[brand]drawtext=text='SOURCE-AWARE PROVENANCE VIDEO ENGINE':x=52:y=78:fontsize=18:fontcolor={theme['accent_hex']}{font_opt}[header]",
            # Glassmorphic Hero Card Container
            f"[header]drawbox=x=40:y=340:w=iw-80:h=ih-480:color=0x0F172A@0.88:t=fill[herocard]",
            f"[herocard]drawbox=x=40:y=340:w=iw-80:h=ih-480:color={theme['accent_hex']}@0.7:t=4[cardborder]",
            # Category Badge Bar inside Card
            f"[cardborder]drawbox=x=70:y=370:w=280:h=40:color={theme['accent_hex']}@0.25:t=fill[badge]",
            f"[badge]drawtext=text='{theme['badge_text']}':x=85:y=380:fontsize=20:fontcolor={theme['accent_hex']}{font_opt}[badgetext]",
        ]

        last_ref = "badgetext"
        for scene in storyboard.scenes:
            clean_text = textwrap.fill(scene.onscreen_text, width=16)
            safe_text = (
                clean_text.replace("\\", "\\\\")
                .replace("'", "")
                .replace(":", "\\:")
                .replace("%", "\\%")
                .replace("\n", "\\\n")
            )

            enable = f"between(t\\,{scene.start}\\,{scene.end})"
            next_ref = f"s{scene.scene_id}"

            filters.append(
                f"[{last_ref}]drawtext=text='{safe_text}':x=70:y=440:fontsize=46:fontcolor=white:"
                f"line_spacing=12:borderw=3:bordercolor=black@0.8:enable='{enable}'{font_opt}[{next_ref}]"
            )
            last_ref = next_ref

        # Progress Bar
        filters.append(
            f"[{last_ref}]drawbox=x=0:y=ih-14:w='iw*(t/{duration})':h=14:color={theme['accent_hex']}:t=fill[outv]"
        )

        command = [
            self.ffmpeg,
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=196:sample_rate=44100:duration={duration}",
            "-filter_complex",
            ";".join(filters),
            "-map",
            "[outv]",
            "-map",
            "0:a",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-tune",
            "zerolatency",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-af",
            "volume=0.04",
            "-shortest",
            str(output_path),
        ]

        try:
            completed = subprocess.run(command, capture_output=True, text=True, timeout=300)
            if completed.returncode != 0:
                if output_path.exists():
                    output_path.unlink(missing_ok=True)
                raise RuntimeError(f"FFmpeg render failed: {completed.stderr[-1200:]}")
        except Exception:
            if output_path.exists():
                output_path.unlink(missing_ok=True)
            raise

        return VideoMetadata(
            ad_id=ad_id,
            path=str(output_path),
            renderer="High-Impact FFmpeg Visual Renderer (OpenMontage Contract)",
            width=w,
            height=h,
            fps=settings.video_fps,
            duration_seconds=float(duration),
            audio=True,
            status="rendered",
        )

    @staticmethod
    def _get_theme(ad_id: str) -> dict:
        themes = {
            "ad_01": {
                "bg_hex": "0x070B19",
                "grid_hex": "0x38BDF8",
                "accent_hex": "0x7CFFCB",
                "badge_text": "PATTERN INTERRUPT",
            },
            "ad_02": {
                "bg_hex": "0x061512",
                "grid_hex": "0x34D399",
                "accent_hex": "0x34D399",
                "badge_text": "PROVENANCE VERIFIED",
            },
            "ad_03": {
                "bg_hex": "0x120B24",
                "grid_hex": "0xC084FC",
                "accent_hex": "0xC084FC",
                "badge_text": "WORKFLOW TRANSFORM",
            },
        }
        return themes.get(ad_id, themes["ad_01"])