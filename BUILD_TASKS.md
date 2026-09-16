# Arculus website — build task list v3 (14 Sep 2026)

Consolidated from the design chats. Stack is path C: Astro + TypeScript + Tailwind, fully static, content as files in the repo, Cloudflare Pages. Each T-task is one Claude Code session; desktop and mobile built together; tick when the Cloudflare Pages preview matches the Figma frame. Figma node map lives in CLAUDE.md.

T7 is the checkpoint: if the build is running well past estimate by then, revisit the path.

## 0 · Setup (Jim, before any code)

- [x] Email AfterDark re registrar / DNS access for arculus.com.au (sent 11 Sep) — awaiting reply
- [ ] GitHub organisation; repo `arculus-website`; commit `CLAUDE.md`, `BUILD_TASKS.md`, `docs/compliance-register.md`, `docs/image-register.xlsx`
- [ ] Cloudflare account: Pages project linked to repo; Web Analytics enabled; DNS to move here once registrar access lands
- [ ] Formspree form (contact → info@) and Mailchimp audience with double opt-in (subscribe); record endpoint/IDs in `content/site.json`
- [x] Fira Sans self-hosted (OFL) — `public/fonts/`, latin woff2 400/500/600
- [ ] Olivia123: ask for a dedicated Arculus onboarding URL (generic URL in the meantime)

## 1 · Foundation

- [x] T1 Scaffold Astro 7 + Tailwind 4 + TypeScript; tokens in `src/styles/global.css` (`@theme`); Fira Sans self-hosted; `Base.astro` with Cloudflare Web Analytics beacon from `PUBLIC_CF_ANALYTICS_TOKEN` (15 Sep)
- [x] T2 Content collections over `content/` with Zod schemas (`src/content.config.ts`), typed loaders (`src/content/loaders.ts`), build fails on `verified: false` unless `PUBLIC_ALLOW_UNVERIFIED=1`; smoke test in `index.astro` runs every loader and cross-reference (16 Sep)
- [x] T3 `KeyValueList` (semantic table; equal wrapping columns <768, label/value ≥768; `facts` and `table` variants) and `ChartImage` (hidden <768) in `src/components/`; preview-only gallery at `/dev/components`; `verified` gate moved to an Astro integration in `astro.config.mjs` because the content cache masked the schema check (16 Sep). Placeholder charts in `public/charts/` until the first Figma export.

## 2 · Chassis

- [x] T4 `Header` (desktop dropdowns, mobile accordion menu and search overlays, vanilla JS, Escape/outside-click/focus-out close), `Button` (primary/secondary/external), `Icon` (inlined Lucide) — 16 Sep. Nav now carries ESG under About and Document library under Funds (from the frames). [Unverified] desktop search icon links to `/search`; no desktop search-open frame exists.
- [x] T5 `Footer` — columns from `site.json` nav + `footer.extra`, outline external button, licensing line as its own paragraph above legal links (the frame's overflow bug not reproduced), Cookie Policy link included, copyright year computed (16 Sep)
- [x] T6 `Breadcrumb` (hrefs resolved from nav labels), `ImportantInformation` (generic / fund / wholesale variants filled from `site.json` templates; title visible on mobile only, per frames), `CtaBanner` (navy radial + decorative mark outline; no warm variant exists in the file) — 16 Sep
- [x] T7 `HeroLevel1` (home), `HeroLevel2` (light full/compact, navy with kicker + stat row; default slot for the fund facts block), `HeroWholesale` (landing, no image), `HeroImage` (ellipse-clipped photo + rotated outline, exact Figma geometry) — 16 Sep. **Checkpoint passed: 7 tasks in 2 days, path C holds.** Content fixes from the frames: home buttons are secondary then primary; fund hero buttons are Olivia123 (gold) then PDS (primary). Placeholder photos in `public/images/` until the image register is licensed.

## 3 · Modules

- [x] T8 `Statement`, `StrategyAtAGlance` (ladder 1–3 gradients as CSS tokens), `ContentColumns` (3/4 columns, optional Lucide icons), `TwoColumnsContent` (paragraphs split across two columns), `LeftRight` (flip prop), plus a `Section` band wrapper — 16 Sep
- [x] T9 `FundOverviewPerformance` (About + RatingsRow + Performance card: chart beside table on desktop, table only on mobile) and `RatingsRow` (Lonsec only, three-column bar on desktop, card on mobile, per-fund report URL) — 16 Sep
- [ ] T10 `Documents` + `DownloadSlice` (+ see-more expander), `ProfileModule` (3-col, 2-col rhythm), `ProductCards`
- [ ] T11 `InsightsRow`, `InsightsList` (thumbnail treatment TBC — build with a prop), `FilterTabs`, `SearchInput`, `SearchResultRow`
- [ ] T12 `ThreeColumnsContactBanner`, `ContactForm` (Formspree, client validation, success state, `?topic=` pre-fill incl. `private-mandate`), `SubscribeModal` (Mailchimp embed, double opt-in), `AttestationModal` (sessionStorage; ss708/761G wording; decline → home)
- [ ] T12a `PrivateMandates` module (tint band, copy left + one button "Talk to us about a mandate", key-value facts right) for the wholesale landing page

## 4 · Pages

- [ ] T13 Home (warm hero and fund cards, navy below)
- [ ] T14 Fund page template → AFI (navy), PIF (warm/orange); fund-specific important information; three-destination CTA (Invest via Olivia123 [gold], Enquire via pre-filled contact form [rust], Read PDF)
- [ ] T15 Wholesale landing (gate at entry; strategy cards click through once attested) + Private mandates module + strategy template → A−, BBB, PEP (gated as deep-link safety net; PEP performance figures entirely off-page)
- [ ] T16 Investment Management (gated; entity name pending)
- [ ] T17 About: Our approach, Governance & oversight (RE = DDH Graham), Team (CEO = Sunetha Parag); ESG (needs an inbound link — see register)
- [ ] T18 Insights hub (PDF links at launch), Contact, Document library
- [ ] T19 Legal: T&Cs, Privacy Notice, Cookie Policy (short — cookieless analytics; add footer link), Disclosure (copy pending)
- [ ] T20 Search (Pagefind incl. PDF text), 404

## 5 · Integration

- [ ] T21 Wire Formspree to info@ and test; confirm Mailchimp double opt-in email copy
- [ ] T22 Redirect map from old site URLs; sitemap.xml; robots; OG images
- [ ] T23 Accessibility pass (WCAG AA: contrast on gold/amber, focus states, modal focus trap, table semantics)
- [ ] T24 Performance pass (export hero mesh gradients and monthly charts at 1440/390 as WebP)

## 6 · Content and compliance (Jim + Renny)

- [x] C1 Compliance register v1 returned clean (14 Sep); v2 in `docs/compliance-register.md` — open: Q3, Q5, Q6, Q8, Q9 and new Q10–Q21 from content extraction
- [ ] C2 Fund numbers verified against latest monthly report; `performanceAsAt` set; `verified: true`
- [ ] C3 Documents uploaded: PDS, TMD, last 3 monthlies, quarterly, annual, Lonsec report, policies
- [ ] C4 Insights PDFs re-issued with compliant disclaimers (separate workstream); `wholesaleOnly` flags set
- [ ] C5 Eleven images licensed or replaced per `docs/image-register.xlsx` (Opera House already gone); headshots supplied (eight); split the images doing double duty (IMG-02 on seven pages, IMG-07 as both article art and PEP hero)
- [ ] C6 Lonsec citation rules applied to ratings row
- [ ] C7 Note to Renny: ratings now Lonsec only (his item 6 still lists three houses)
- [ ] C8 Olivia123 dedicated URL swapped in when supplied

## 7 · Launch

- [ ] L1 Staging review against the compliance register, page by page (Cloudflare Workers staging, noindex)
- [ ] L2 DNS cutover; SSL; test forms, attestation and Olivia123 links on production domain
- [ ] L3 Handover doc (`docs/MONTHLY.md`): edit fund JSON, add PDF + `documents.json` line, export chart from Figma, commit — with a worked example
- [ ] L4 Post-launch: test gold external-link colour against rust actions; may revert header button label / external colour

## Parked (do not resolve in code)

EQT as RE (swap once finalised) · Insights image treatment (88px thumb vs none) · article template · interactive charts (add when traffic justifies) · Arculus Capital site launch · wholesale landing hero
