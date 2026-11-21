# Blog publishing — follow-ups

Notes from 21 Nov 2026. Pick this up later today. Not urgent for the jailbreaks post deploy.

## Verdict

Current flow is fine for the next ~10–20 posts:

`engineering-blogs` markdown → `build-blogs.cjs` → static HTML + images in `portfolio/blogs/` → Vercel.

Markdown size is not a constraint. **Images + how we copy them** will hurt first — in Git history more than on Vercel Hobby.

## Current sizes (approx.)

- `portfolio/blogs/` ≈ 4.1 MB (2 posts)
- `portfolio/dist/` ≈ 5 MB
- Per-post image folders ≈ 2 MB each (because of duplication)

Vercel Hobby is nowhere near a problem at this scale.

## Problems to fix later

1. **Full-folder image copy**
   - `copyImages` in `build-blogs.cjs` copies the entire series `images/` dir into every post.
   - Post 1 already carries post 2’s assets and vice versa.
   - Fix: copy only images referenced by that post’s markdown.

2. **PNG + SVG doubles**
   - Source keeps both for each diagram; deploy only needs one (prefer optimized WebP/AVIF or a single PNG).
   - Don’t ship unused SVG/PNG pairs to `blogs/*/images/`.

3. **Binaries in the Portfolio Git repo**
   - Every image revision lives forever in history.
   - Long-term: host images on Blob / R2 / Cloudflare Images (or similar), keep HTML in the portfolio.

4. **Optional: stop committing generated `blogs/`**
   - Build from `engineering-blogs` at deploy time on Vercel instead.
   - Cleaner, but needs the markdown/images available during the build.

## Suggested order of work

1. Fix per-post image copy (biggest easy win).
2. Compress / single-format images for deploy.
3. Move images off-repo once a post’s media regularly exceeds ~1–2 MB, or before the series gets heavy with screenshots.
4. Only then consider “build blogs on Vercel, don’t commit HTML/assets.”

## What not to change yet

- Keep markdown → static HTML on the portfolio (good fit; no CMS needed for this series).
- Don’t rewrite for Vercel free-tier limits — we’re not close.
- Jailbreaks post publish path can stay as-is for today’s deploy.

## Related files

- `portfolio/build-blogs.cjs` — markdown build + `copyImages`
- `engineering-blogs/posts/ai-security/` — source markdown + shared `images/`
- `portfolio/blogs/` — generated pages committed for deploy
- `portfolio/verify-case-studies.cjs` — asserts generated posts/images exist
