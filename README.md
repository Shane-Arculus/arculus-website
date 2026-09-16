# Arculus Funds Management — website

Astro + Tailwind, fully static. Read `CLAUDE.md` before touching anything; `BUILD_TASKS.md` is the work list.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview
```

**Branches.** `main` is production and the build fails there while any content file is `verified: false`, by design. Every other branch is a preview and builds regardless — so work happens on `preview` (or any branch) and `main` only receives what the compliance register has cleared. Locally, `PUBLIC_ALLOW_UNVERIFIED=1 npm run build` does the same.

Cloudflare Workers (Git-connected, `wrangler.jsonc`): build command `npm run build`, deploy command `npx wrangler deploy`, Node 22 (`NODE_VERSION=22` in build variables). `PUBLIC_CF_ANALYTICS_TOKEN` holds the Web Analytics token (see `.env.example`); the beacon is omitted when it is unset.
