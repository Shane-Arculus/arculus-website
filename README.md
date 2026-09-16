# Arculus Funds Management — website

Astro + Tailwind, fully static. Read `CLAUDE.md` before touching anything; `BUILD_TASKS.md` is the work list.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview
```

**Until the compliance register clears**, every build needs `PUBLIC_ALLOW_UNVERIFIED=1` in the environment — otherwise the build stops on the first `verified: false` file, by design. Set it on the Cloudflare Pages *preview* environment, never on production.

Cloudflare Pages: build command `npm run build`, output directory `dist`, Node 22. Environment variable `PUBLIC_CF_ANALYTICS_TOKEN` holds the Web Analytics token (see `.env.example`); the beacon is omitted when it is unset.
