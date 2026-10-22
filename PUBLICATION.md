# Public portfolio disclosure review

The current site is deliberately a work overview, not an implementation walkthrough. This is an editorial reduction in disclosure, not evidence of employer or client approval.

## Retained

- Work context, role, high-level contribution, and nonnumerical purpose.
- Selected skill keywords, including the user-requested LiteLLM and Vision-Language Models labels.
- Separate work pages and links between the portfolio and those pages.

## Removed from source content and rebuilt pages

- Architecture diagrams and ordered processing flows.
- Algorithms, retrieval strategies, optimization methods, data structures, and schema details.
- Deployment topology, provider combinations, routing policy, authentication mechanisms, and operating settings.
- Internal rollout status, unpublished benchmarks, private endpoints, company repositories, and security-debt commentary.
- Technical recipes from homepage descriptions and the featured card illustration.

## Publication boundary

`npm run build` creates `portfolio/dist/` from an explicit runtime allowlist. Only that directory should be served or deployed. Resources, source-provenance notes, build scripts, policy checks, and test files are excluded. The dev command builds and serves that directory as well.

The original Resources documents remain untouched locally and ignored by Git. Existing generated pages are overwritten with the shorter overviews. No confidential explanation is retained in a hidden HTML section or browser data payload.

The policy check rejects unexpected implementation fields and known detail patterns. It is a regression guard, not a comprehensive confidentiality classifier. New copy still needs human review. Company and client work should only be publicly identified or described to the extent authorized; the available source files do not establish that authorization.

There is no verified GitHub push or live deployment from this session. If an older version was published outside this session, local edits do not recall cached pages, old repository history, or third-party copies.
