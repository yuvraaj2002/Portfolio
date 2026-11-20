# Launch video workspace

Remotion + local TTS for portfolio / personal-brand launch films. Kept separate from the static site in `portfolio/`.

## Skills

1. `.agents/skills/product-launch-video/` — creative workflow (+ `portfolio-context.md`)
2. `.agents/skills/remotion-best-practices/` — Remotion implementation
3. `.agents/skills/gemini-tts/` — optional cloud TTS (needs `GEMINI_API_KEY`)

## TTS (default: local Kokoro via mlx-audio)

No Gemini key required. Uses Apple Silicon + ~82M Kokoro weights.

### One-time setup

```sh
cd launch-video
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python "mlx-audio[tts]" "misaki[en]" soundfile
# ffmpeg already required for mp3 (brew install ffmpeg)
```

### Generate VO

```sh
npm run tts -- --text "I build AI systems that make it to production."
npm run tts -- --segments segments.json
npm run tts:sample   # three short clips under public/vo/samples/
```

Defaults: provider `kokoro`, voice **`af_heart`** (locked for this project), output `public/vo/`.

Optional Gemini:

```sh
cp .env.example .env   # GEMINI_API_KEY=
npm run tts:gemini -- --segments segments.json
```

## Remotion (theme-toggle spot)

Composition: `ThemeToggleNightOwls` (~21s, 1920×1080). Storyboard: `storyboard.json`.

```sh
npm run studio                                    # preview
npm run render                                    # out/theme-toggle-night-owls.mp4
npx remotion still ThemeToggleNightOwls out/f.png --frame=90
```

## Workflow

1. Confirm brief (or use defaults in `portfolio-context.md`)
2. Write `storyboard.json` here before coding
3. Generate VO with `npm run tts`
4. Copy approved visual assets into `public/`
5. Implement scenes under `src/`
6. Preview with `npm run studio`, render with `npm run render`

## Do not

- Commit `.venv`, `node_modules`, `.env`, renders, or generated audio (see root `.gitignore`)
- Publish renders via `portfolio/dist/` unless embedding on the site
- Put proprietary implementation detail on screen or in voiceover (`PUBLICATION.md`)
