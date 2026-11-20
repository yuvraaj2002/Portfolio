#!/usr/bin/env python3
"""Legacy catalog helper — this project locks Kokoro to af_heart.

Prefer: npm run tts -- --segments segments.json
"""

from __future__ import annotations

import sys


def main() -> int:
    print(
        "Voice catalog generation is disabled.\n"
        "This portfolio launch video uses Kokoro voice af_heart only.\n"
        "Run: cd launch-video && npm run tts -- --segments segments.json",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
