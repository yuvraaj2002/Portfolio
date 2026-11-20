# Portfolio project context for launch videos

Read this before Phase 0 when working in this repository. Prefer these defaults unless the user overrides them.

## What this repo is

Personal portfolio for **Yuvraj Singh** — AI & software engineer. Live site: https://master.d24o598po2jt0p.amplifyapp.com/

Static site lives in `portfolio/`. Public copy is deliberately high-level (role, outcomes, selected keywords). It is not an implementation walkthrough.

## Default brief (when the video is about this portfolio / personal brand)

| Question | Default |
| --- | --- |
| Product | Yuvraj Singh — AI engineer who ships production systems (patent intelligence, document AI, voice ops, LLM platforms) |
| Audience | Hiring managers, founders, eng leaders evaluating AI/ML engineers |
| Core message | I build AI systems that make it to production |
| Tone | Precise, calm, confident, editorial — not hype, not playful |
| Duration | 30s spot (offer 15s teaser / 45s full as alternatives) |
| Voiceover | Optional. English via **local Kokoro** voice **`af_heart`** only (mlx-audio). Gemini TTS optional. Prefer muted-safe captions either way |
| Publishing | LinkedIn + portfolio landing first; also X. Default 1920×1080; offer 1080×1920 vertical if asked |
| Reference | Stripe / Linear developer aesthetic; monochrome editorial; Apple-level restraint without Apple pastiche |

Confirm only the gaps the user has not already answered. Do not re-ask questions already covered by this table unless the user wants a different product (e.g. a single case study).

## Locked visual system (do not invent a colorful brand)

The site is **white / black / grayscale only**. Launch videos about this brand must stay monochrome unless the user explicitly asks otherwise.

| Role | Hex | Use |
| --- | --- | --- |
| background / paper | `#FFFFFF` | Base frames, light scenes |
| ink / surface-dark | `#1D1D1D` | Headlines, dark scenes, primary UI |
| muted | `#6E6E6E` | Secondary copy |
| soft gray | `#868686` | Accent text (hero title span treatment) |
| line | `#DEDEDE` | Separators, quiet structure |
| soft fill | `#F5F5F5` | Elevated surfaces on light |
| mid surface | `#484848` | Borders on dark panels |

**Typography:** Prefer a distinctive grotesque pairing (e.g. Satoshi / General Sans / Space Grotesk). Avoid Inter, Roboto, Arial, system UI stacks for display type. Tight negative letter-spacing on large titles matches the site.

**Signature motif:** Editorial type + portrait + thin thread / index marks / numbered beats (`01 —`). Dark work-panel moments (`#1D1D1D` on white paper) for feature beats. No purple gradients, no neon glow, no emoji.

**Motion character:** Smooth glides and precise springs — premium and deliberate, never bounce-heavy or meme-kinetic.

### Suggested Phase 1 direction (pre-approved default)

If the user says "just do it" or asks for the site's look:

- **Name:** Monochrome Thread
- **Mood:** Quiet confidence; systems that shipped; the work is the pitch
- **Palette:** table above
- **Motion:** Smooth glide + light stagger; dark-panel reveals; portrait settle
- **Signature:** Hairline rules, section indices, portrait + signature lockup

Still present 1–2 alternate directions only if the user wants options; otherwise state Monochrome Thread and proceed after confirmation.

## Approved public claims (safe on-screen / VO)

Pull copy from `portfolio/content.js`, `portfolio/index.html`, and public case-study pages. Safe headline numbers already on the site:

- Patent classification nearly doubled the previous baseline
- MaxVal: 18–20 hours/week saved; ~3× faster document work
- Healthcare outreach: 80,000+ calls; 94%+ average AI QC
- Product advisor: Italian / English / French
- Relecura Employee of the Month; owns core AI systems

Project titles and summaries live in `window.PORTFOLIO_PROJECTS` in `portfolio/content.js`.

## Publication boundary (hard rules)

Follow `PUBLICATION.md` and `portfolio/publication-policy.cjs`:

- No architecture diagrams, algorithms, retrieval strategies, schemas, deployment topology, auth mechanisms, private endpoints, or internal benchmarks beyond the public numbers above
- Do not invent employer/client titles, dates, or metrics not already on the public site
- Employer/Relecura/MaxVal beats: avoid restricted provider/tool names from the policy (e.g. Gemini, Claude, Bedrock, specific infra). Product Partnerships pages may name build tools when they already appear publicly
- Never surface secrets, ARNs, keys, or `Resources/` markdown in the video
- Prefer outcomes and ownership language over "how it works" recipes

If a storyboard beat needs a visual metaphor for a system, use abstract monochrome motion (nodes, threads, documents, waveforms) — not real internal UI dumps from private docs.

## Available assets

Copy into `launch-video/public/` before coding; do not mutate originals in `portfolio/assets/`.

| Asset | Path | Notes |
| --- | --- | --- |
| Portrait | `portfolio/assets/profile-1106.jpg` (also `.webp` / `.avif`, 700w variants) | Hero person shot; treat as grayscale brand photo |
| Signature | `portfolio/assets/signature.png` | Lockup with portrait |
| Product previews | `portfolio/assets/previews/{healthcare-outreach,document-workspace,product-advisor}.jpg` | Partnership UI stills |
| Wordmark | Text: `Yuvraj Singh.` | No separate logo file |
| Live site | Capture fresh screenshots of homepage / work cards if UI beats are needed | Prefer live or local `portfolio` over inventing UI |

Favicon: `portfolio/favicon.svg`.

## Workspace layout (this repo)

Keep Remotion work **out of** the static site publish tree:

```text
launch-video/                 # Remotion project root
├── storyboard.json           # required blueprint (skill Phase 2)
├── public/                   # copied/generated assets + VO
├── src/                      # Remotion compositions
└── out/                      # renders (gitignored)
```

- Do **not** put Remotion `node_modules`, studio, or renders inside `portfolio/`
- Do **not** add video build artifacts to `portfolio/dist/` unless the user explicitly asks to embed a hosted video on the site
- `npm run build` / `npm run check` under `portfolio/` remain for the static site only
- Companion skills:
  - `.agents/skills/remotion-best-practices/` for Remotion implementation
  - Local Kokoro TTS (default, voice `af_heart`): `cd launch-video && npm run tts -- …` (mlx-audio; no API key)
  - Optional `.agents/skills/gemini-tts/`: `npm run tts:gemini -- …`

## Suggested narrative for a portfolio trailer

**Structure:** Problem → Solution (or Vision → Reality), 30s.

1. **Hook** — Production AI is hard; most demos never ship
2. **Reveal** — Yuvraj / "I build AI systems that make it to production"
3. **Showcase** — 3 beats: Relecura (patent / citations / gateway), MaxVal (hours returned), Partnerships (voice / legal / advisor) — outcomes only
4. **Climax** — Portrait + signature + one line takeaway
5. **Close** — Wordmark + LinkedIn / site CTA

Show the person or unmistakable site artifact within the first 3 seconds.
