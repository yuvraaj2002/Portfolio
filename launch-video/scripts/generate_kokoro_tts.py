#!/usr/bin/env python3
"""Local Kokoro TTS via mlx-audio for portfolio launch videos.

Loads the model once, generates per-segment (or single-text) audio, writes
MP3/WAV under the output directory, and prints a JSON summary to stdout
compatible with the gemini-tts segment shape.

Usage:
  .venv/bin/python scripts/generate_kokoro_tts.py \\
    --text "I build AI systems that make it to production." \\
    --output-dir public/vo

  .venv/bin/python scripts/generate_kokoro_tts.py \\
    --segments segments.json \\
    --output-dir public/vo \\
    --voice am_echo
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

DEFAULT_MODEL = "mlx-community/Kokoro-82M-bf16"
DEFAULT_VOICE = "am_echo"  # calm American male; alt: am_adam, bm_george
DEFAULT_LANG = "a"  # American English (Kokoro lang_code)
DEFAULT_SPEED = 1.0


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Generate Kokoro TTS via mlx-audio")
    p.add_argument("--text", help="Single utterance (alternative to --segments)")
    p.add_argument(
        "--segments",
        help='JSON file: [{"id":"hook","text":"..."}, ...]',
    )
    p.add_argument("--output-dir", required=True, help="Directory for vo-*.mp3/wav")
    p.add_argument("--voice", default=DEFAULT_VOICE, help=f"Kokoro voice (default {DEFAULT_VOICE})")
    p.add_argument("--model", default=DEFAULT_MODEL, help="HF / mlx model id")
    p.add_argument("--lang-code", default=DEFAULT_LANG, help="Kokoro lang_code (a=American EN)")
    p.add_argument("--speed", type=float, default=DEFAULT_SPEED, help="Speech speed multiplier")
    p.add_argument("--format", choices=("mp3", "wav"), default="mp3")
    p.add_argument("--no-trim", action="store_true", help="Keep leading/trailing silence")
    return p.parse_args()


def load_segments(args: argparse.Namespace) -> list[dict[str, str]]:
    if args.segments:
        data = json.loads(Path(args.segments).read_text(encoding="utf-8"))
        if not isinstance(data, list) or not data:
            raise SystemExit("--segments must be a non-empty JSON array")
        out = []
        for i, item in enumerate(data):
            if not isinstance(item, dict) or "text" not in item:
                raise SystemExit(f"Segment {i} needs at least a text field")
            seg_id = str(item.get("id") or f"seg-{i+1:02d}")
            text = str(item["text"]).strip()
            if not text:
                raise SystemExit(f"Segment {seg_id} has empty text")
            out.append({"id": seg_id, "text": text})
        return out
    if args.text and args.text.strip():
        return [{"id": "line", "text": args.text.strip()}]
    raise SystemExit("Provide --text or --segments")


def wav_duration_sec(path: Path) -> float:
    import soundfile as sf

    info = sf.info(str(path))
    return float(info.frames) / float(info.samplerate)


def convert_to_mp3(wav_path: Path, mp3_path: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(wav_path),
            "-codec:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(mp3_path),
        ],
        check=True,
    )


def trim_wav(path: Path) -> None:
    """Light silence trim with ffmpeg silenceremove; no-op on failure."""
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = Path(tmp.name)
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                str(path),
                "-af",
                "silenceremove=start_periods=1:start_silence=0.05:start_threshold=-40dB,"
                "areverse,silenceremove=start_periods=1:start_silence=0.05:start_threshold=-40dB,areverse",
                str(tmp_path),
            ],
            check=True,
        )
        tmp_path.replace(path)
    except (subprocess.CalledProcessError, OSError):
        if "tmp_path" in locals() and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)


def generate_segment(
    model,
    text: str,
    voice: str,
    speed: float,
    lang_code: str,
    wav_path: Path,
    do_trim: bool,
) -> float:
    import numpy as np
    import soundfile as sf

    chunks = []
    sample_rate = None
    for result in model.generate(
        text=text,
        voice=voice,
        speed=speed,
        lang_code=lang_code,
    ):
        audio = result.audio
        if audio is None or getattr(audio, "size", 0) == 0:
            continue
        sample_rate = int(result.sample_rate)
        arr = np.array(audio, dtype=np.float32)
        if arr.ndim > 1:
            arr = arr.reshape(-1)
        chunks.append(arr)

    if not chunks or sample_rate is None:
        raise RuntimeError(f"No audio generated for: {text[:60]!r}")

    wav = np.concatenate(chunks)
    wav_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(wav_path), wav, sample_rate)

    if do_trim:
        trim_wav(wav_path)

    return wav_duration_sec(wav_path)


def main() -> int:
    args = parse_args()
    segments = load_segments(args)
    out_dir = Path(args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        from mlx_audio.tts.utils import load_model
    except ImportError:
        print(
            "mlx-audio is not installed in this Python. From launch-video/ run:\n"
            "  uv venv --python 3.12 .venv && source .venv/bin/activate\n"
            '  uv pip install "mlx-audio[tts]" "misaki[en]" soundfile',
            file=sys.stderr,
        )
        return 1

    print(f"Loading {args.model} (first run downloads weights)…", file=sys.stderr)
    model = load_model(args.model)

    results = []
    total = 0.0
    do_trim = not args.no_trim

    for seg in segments:
        stem = f"vo-{seg['id']}"
        wav_path = out_dir / f"{stem}.wav"
        print(f"Generating {stem}…", file=sys.stderr)
        duration = generate_segment(
            model,
            seg["text"],
            args.voice,
            args.speed,
            args.lang_code,
            wav_path,
            do_trim,
        )

        if args.format == "mp3":
            final_path = out_dir / f"{stem}.mp3"
            try:
                convert_to_mp3(wav_path, final_path)
                wav_path.unlink(missing_ok=True)
            except (subprocess.CalledProcessError, FileNotFoundError) as exc:
                print(f"ffmpeg mp3 encode failed ({exc}); keeping WAV", file=sys.stderr)
                final_path = wav_path
        else:
            final_path = wav_path

        rel = str(final_path)
        results.append({"id": seg["id"], "file": rel, "duration": round(duration, 3)})
        total += duration

    payload = {
        "success": True,
        "provider": "mlx-audio-kokoro",
        "model": args.model,
        "voice": args.voice,
        "segments": results,
        "totalDuration": round(total, 3),
    }
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
