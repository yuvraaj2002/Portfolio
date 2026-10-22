# GitHub

Source lives at https://github.com/yuvraaj2002/Portfolio on the `master` branch.

`Resources/`, `portfolio/dist/`, local environment files and `portfolio/private-identifiers.local.txt` are excluded by `.gitignore`. The local identifiers file feeds the publication guard in `publication-policy.cjs`; keep it on your machine, and never commit it.

Before pushing changes:

```sh
cd portfolio
npm run build
npm run check
cd ..
git status --short
```
