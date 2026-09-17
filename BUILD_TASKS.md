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
- [x] T10 `Documents` (title/intro + rows; `viewAll` link or `collapseAfter` see-more expander, vanilla JS), `DownloadSlice`, `KeyDocuments` (cream tiles), `ProfileModule` (3-col cards, warm separators), `ProductCards` (navy radial cards with mark outline) — 16 Sep
- [x] T11 `InsightsRow` + `ArticleCard` + `Tag`, `InsightsList` (rows with `data-filter-item`; `thumbs` prop for the parked thumbnail question), `FilterTabs` (client-side, reads `?filter=`), `SearchInput`, `SearchResultRow`; `src/lib/format.ts` (dates, slugs) — 16 Sep
- [x] T12 `ThreeColumnsContactBanner`, `ContactForm` + `FormField` (Formspree via fetch, client validation with per-field errors and banner, success panel, `?topic=` pre-fill), `SubscribeModal` (native dialog, Mailchimp JSONP double opt-in, 'Check your inbox' state), `AttestationModal` (native dialog, cannot be dismissed, sessionStorage key, decline → home; include on every gated page) — 16 Sep. [Unverified] error-banner wording; Formspree endpoint, Mailchimp action URL and merge field are `[TO SET]` in site.json
- [ ] T12a `PrivateMandates` module (tint band, copy left + one button "Talk to us about a mandate", key-value facts right) for the wholesale landing page

## 4 · Pages

- [x] T13 Home (`src/pages/index.astro`) + home-only modules `FundCards` (warm mesh cards, CSS approximation `[Unverified]`) and `ImportantDisclosure`; `LeftRight` now takes `blocks[]` for the home's two stacked text blocks; `RatingsRow` button optional — 16 Sep. Fixed a T1 token collision: `text-body` was colour only, so body copy had been 16px; size is now `text-base` (15px) on `body`.
- [x] T14 Fund page template `src/pages/funds/[slug].astro` → AFI and PIF; `FundFeesFacts`, `FundPortfolio` (allocation donut drawn as inline SVG from the JSON rows — no chart library); first real performance charts exported from the frames to `public/charts/<fund>-2026-06.webp` (the export carries its own title, so the slot renders no caption) — 16 Sep
- [x] T15 Wholesale landing `src/pages/wholesale/index.astro` (gate, `StrategyCards`, `PrivateMandates`, wholesale Important Information) and strategy template `[slug].astro` → A− SMA, BBB SMA, PEP (gated, `StrategyAbout`, no PEP performance figures) — 16 Sep
- [x] T16 Investment Management `src/pages/investment-management/index.astro` (gated; IM Important Information drops the 'Portfolio figures' sentence when no as-at date) — 16 Sep. Entity name and minimum portfolio still [Unverified] (Q12).
- [x] T17 About: Our approach, Governance & oversight, Team, ESG (`src/pages/about/*.astro`); `ProseArticle` for markdown pages; `ContentColumns` gains per-item links, a module link and an H1 title size; `TwoColumnsContent` gains titled columns with bullet lists — 16 Sep
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

## 6a · QA notes from previews (fix in T23)

- [x] QA pass 1 (16 Sep, Jim's home-page review): page-by-page frame comparisons at 1440 for Home, AFI, A− SMA, Wholesale landing, Approach, Team. Fixed: container width (Tailwind `max-w` includes padding, so every band had 1244px of content, not 1340 — `--container-site` is now 1436); hero photo lean (the Tuesday mirror was wrong; reverted); home hero exact 650; fund cards use per-fund mesh exports (`public/heroes/fund-card-afi.webp` rust, `-pif.webp` orange) and full-height images; product cards have their two distinct gradients and the frame's outline placement and two-line titles; generic Important Information shows its label as a left column on desktop; footer external button sits in the sixth column; LeftRight text column no longer over-padded; fund hero titles honour the frame's line breaks; performance chart sits bare on cream with only the table in a card; Fund features card has no border; How-to-invest columns carry their Lucide icons; wholesale hero 634 tall; navy hero description 24px; content-column dividers; compact hero 501; About breadcrumbs on white; Approach philosophy on white with the link inside the last column.
- [ ] Header dropdown panels open too far below the label (they hang from the 104px header bottom); bring them up to sit just under the trigger (Jim, 16 Sep)

## 7 · Launch

- [ ] L1 Staging review against the compliance register, page by page (Cloudflare Workers staging, noindex)
- [ ] L2 DNS cutover; SSL; test forms, attestation and Olivia123 links on production domain
- [ ] L3 Handover doc (`docs/MONTHLY.md`): edit fund JSON (performance periods, `performanceAsAt`, `chartImage`, portfolio metrics, allocation rows), add PDF + `documents.json` line, export the chart frame from Figma at 2× as WebP to `public/charts/<fund>-<yyyy-mm>.webp`, commit — with a worked example
- [ ] L4 Post-launch: test gold external-link colour against rust actions; may revert header button label / external colour

## Parked (do not resolve in code)

EQT as RE (swap once finalised) · Insights image treatment (88px thumb vs none) · article template · interactive charts (add when traffic justifies) · Arculus Capital site launch · wholesale landing hero
