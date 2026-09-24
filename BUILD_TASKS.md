# Arculus website — build task list v4 (22 Sep 2026)

Consolidated from the design chats. Stack is path C: Astro + TypeScript + Tailwind, fully static, content as files in the repo, Cloudflare Pages. Each T-task is one Claude Code session; desktop and mobile built together; tick when the Cloudflare Pages preview matches the Figma frame. Figma node map lives in CLAUDE.md.

T7 is the checkpoint: if the build is running well past estimate by then, revisit the path.

## 0 · Setup (Jim, before any code)

- [x] Email AfterDark re registrar / DNS access for arculus.com.au (sent 11 Sep) — awaiting reply
- [x] GitHub repo `sbduggan1304/arculus-website` (Jim's own account, not an org); `CLAUDE.md`, `BUILD_TASKS.md`, registers committed (14 Sep)
- [x] Cloudflare Workers (not Pages — the dashboard offered no Pages option) Git-connected to the repo; `preview` branch alias serves the latest build (16 Sep). Web Analytics token still `[TO SET]`; DNS: see L2
- [~] Formspree done (see T21); Mailchimp parked (see T21)
- [x] Fira Sans self-hosted (OFL) — `public/fonts/`, latin woff2 400/500/600
- [~] Olivia123: `https://www.olivia123.com/features/investors.php` set in `site.json` (22 Sep); a dedicated Arculus onboarding URL still to ask for (C8)

## 1 · Foundation

- [x] T1 Scaffold Astro 7 + Tailwind 4 + TypeScript; tokens in `src/styles/global.css` (`@theme`); Fira Sans self-hosted; `Base.astro` with Cloudflare Web Analytics beacon from `PUBLIC_CF_ANALYTICS_TOKEN` (15 Sep)
- [x] T2 Content collections over `content/` with Zod schemas (`src/content.config.ts`), typed loaders (`src/content/loaders.ts`), build fails on `verified: false` unless `PUBLIC_ALLOW_UNVERIFIED=1`; smoke test in `index.astro` runs every loader and cross-reference (16 Sep)
- [x] T3 `KeyValueList` (semantic table; equal wrapping columns <768, label/value ≥768; `facts` and `table` variants) and `ChartImage` (hidden <768) in `src/components/`; preview-only gallery at `/dev/components`; `verified` gate moved to an Astro integration in `astro.config.mjs` because the content cache masked the schema check (16 Sep). Placeholder charts in `public/charts/` until the first Figma export.

## 2 · Chassis

- [x] T4 `Header` (desktop dropdowns, mobile accordion menu and search overlays, vanilla JS, Escape/outside-click/focus-out close), `Button` (primary/secondary/external), `Icon` (inlined Lucide) — 16 Sep. Nav carries ESG under About; Document library and Private mandates are footer-only (Jim, 22 Sep) — see `footerOnly` in site.json. [Unverified] desktop search icon links to `/search`; no desktop search-open frame exists.
- [x] T5 `Footer` — columns from `site.json` nav + `footer.extra`, outline external button, licensing line as its own paragraph above legal links (the frame's overflow bug not reproduced), Cookie Policy link included, copyright year computed (16 Sep)
- [x] T6 `Breadcrumb` (hrefs resolved from nav labels), `ImportantInformation` (generic / fund / wholesale variants filled from `site.json` templates; title visible on mobile only, per frames), `CtaBanner` (navy radial + decorative mark outline; no warm variant exists in the file) — 16 Sep
- [x] T7 `HeroLevel1` (home), `HeroLevel2` (light full/compact, navy with kicker + stat row; default slot for the fund facts block), `HeroWholesale` (landing, no image), `HeroImage` (ellipse-clipped photo + rotated outline, exact Figma geometry) — 16 Sep. **Checkpoint passed: 7 tasks in 2 days, path C holds.** Content fixes from the frames: home buttons are secondary then primary; fund hero buttons are Olivia123 (gold) then PDS (primary). Placeholder photos in `public/images/` until the image register is licensed.

## 3 · Modules

- [x] T8 `Statement`, `StrategyAtAGlance` (ladder 1–3 gradients as CSS tokens), `ContentColumns` (3/4 columns, optional Lucide icons), `TwoColumnsContent` (paragraphs split across two columns), `LeftRight` (flip prop), plus a `Section` band wrapper — 16 Sep
- [x] T9 `FundOverviewPerformance` (About + RatingsRow + Performance card: chart beside table on desktop, table only on mobile) and `RatingsRow` (Lonsec only, three-column bar on desktop, card on mobile, per-fund report URL) — 16 Sep
- [x] T10 `Documents` (title/intro + rows; `viewAll` link or `collapseAfter` see-more expander, vanilla JS), `DownloadSlice`, `KeyDocuments` (cream tiles), `ProfileModule` (3-col cards, warm separators), `ProductCards` (navy radial cards with mark outline) — 16 Sep
- [x] T11 `InsightsRow` + `ArticleCard` + `Tag`, `InsightsList` (rows with `data-filter-item`; `thumbs` prop for the parked thumbnail question), `FilterTabs` (client-side, reads `?filter=`), `SearchInput`, `SearchResultRow`; `src/lib/format.ts` (dates, slugs) — 16 Sep
- [x] T12 `ThreeColumnsContactBanner`, `ContactForm` + `FormField` (Formspree via fetch, client validation with per-field errors and banner, success panel, `?topic=` pre-fill), `SubscribeModal` (native dialog, Mailchimp JSONP double opt-in, 'Check your inbox' state), `AttestationModal` (native dialog, cannot be dismissed, sessionStorage key, decline → home; include on every gated page) — 16 Sep. [Unverified] error-banner wording; Formspree endpoint, Mailchimp action URL and merge field are `[TO SET]` in site.json
- [x] T12a `PrivateMandates` module — shipped with T15 (16 Sep)

## 4 · Pages

- [x] T13 Home (`src/pages/index.astro`) + home-only modules `FundCards` (warm mesh cards, CSS approximation `[Unverified]`) and `ImportantDisclosure`; `LeftRight` now takes `blocks[]` for the home's two stacked text blocks; `RatingsRow` button optional — 16 Sep. Fixed a T1 token collision: `text-body` was colour only, so body copy had been 16px; size is now `text-base` (15px) on `body`.
- [x] T14 Fund page template `src/pages/funds/[slug].astro` → AFI and PIF; `FundFeesFacts`, `FundPortfolio` (allocation donut drawn as inline SVG from the JSON rows — no chart library); first real performance charts exported from the frames to `public/charts/<fund>-2026-06.webp` (the export carries its own title, so the slot renders no caption) — 16 Sep
- [x] T15 Wholesale landing `src/pages/wholesale/index.astro` (gate, `StrategyCards`, `PrivateMandates`, wholesale Important Information) and strategy template `[slug].astro` → A− SMA, BBB SMA, PEP (gated, `StrategyAbout`, no PEP performance figures) — 16 Sep
- [x] T16 Investment Management `src/pages/investment-management/index.astro` (gated; IM Important Information drops the 'Portfolio figures' sentence when no as-at date) — 16 Sep. Entity name and minimum portfolio still [Unverified] (Q12).
- [x] T17 About: Our approach, Governance & oversight, Team, ESG (`src/pages/about/*.astro`); `ProseArticle` for markdown pages; `ContentColumns` gains per-item links, a module link and an H1 title size; `TwoColumnsContent` gains titled columns with bullet lists — 16 Sep
- [x] T18 Insights hub, Contact, Document library — **re-landed 22 Sep as `delta-T18b.zip`: the 17 Sep `delta-T18.zip` never reached the repo (the three pages 404ed on the preview; `ContactColumnsCard` and the T18 component changes were absent). Rebuilt against the frames; `FilterTabs` now also hides sections with no matching rows and keeps the see-more fold until a filter or search applies; `documents.json` gains `collapseAfter` (7) and `fileLabel`; `site.json` gains `ui.noResults`.** Original scope: Insights hub, Contact, Document library (`src/pages/insights|contact|documents/index.astro`); `ContactColumnsCard` (the contact frame's 'Who to contact' is a cream card with icons and links, not the navy banner); `DownloadSlice` size line; `Documents` 'Showing n of total'; `FilterTabs` search box and text filtering; buttons can open the subscribe modal via `action: subscribe-modal`; key device on the wholesale hero and CTA banners enlarged, offset and muted at Jim's request — 17 Sep. All three pages compared against their frames at 1440.
- [x] T19 Legal: `/terms`, `/privacy`, `/cookies`, `/disclosure` from `src/pages/[legal].astro` via `ProseArticle` (Disclosure renders its '[Copy pending]' placeholder until Q15 lands) — 17 Sep
- [x] T20 Search (`/search?q=`) on Pagefind — index built by `npm run build` (`astro build && pagefind --site dist`), gated pages, the gallery, 404 and search itself excluded via `nosearch` on `Base`; client-side result list with All/Pages/Documents/Insights tabs by URL; 404 page (`src/pages/404.astro`, served by Cloudflare via `not_found_handling`) — 17 Sep. Pagefind indexes HTML only: PDF text is not searchable; document titles are, via the library page.

## 5 · Integration

- [~] T21 Formspree wired (`https://formspree.io/f/xwlpklba`, Formshield on, CAPTCHA off; notification address to confirm under Workflow) — 17 Sep. **Subscribe/email list PARKED**: Jim to find out how Arculus sends the weekly update today. Outcomes: (a) existing tool → point `SubscribeModal` at its signup endpoint; (b) nothing → Mailchimp free tier, action URL + 'I am a' merge tag into `site.json` → `forms.mailchimp`; (c) no subscribe function → remove the modal and Subscribe buttons, Insights CTA becomes 'Contact the team'. Until decided the modal shows its error line on submit.
- [x] T22 `public/_redirects` mapping all 141 old WordPress URLs (pages → their new routes; ~110 monthly posts → document library filter; articles → insights; feed and wp-sitemap), `@astrojs/sitemap` (14 public pages; gated, search, dev and 404 excluded), `robots.txt`, canonical + Open Graph + Twitter meta in `Base` with a default card `public/og/default.png`, SVG/PNG favicons — 17 Sep. [Unverified] destinations for the old ratings and news-category pages.
- [x] T23 axe WCAG 2.1 AA on 12 pages at 1440 and 390: zero violations after darkening `gold` to `#8A6A2A` (white-on-gold 5.0:1), replacing `muted` text with `body`, and rust-hi for the strategy-card labels on white (orange fails at 2.9:1); keyboard: skip link first, dropdowns open with Enter and close on Escape; dialogs are native `<dialog>` (focus trapped); tables are semantic — 17 Sep
- [x] T24 Performance: whole build 2.5 MB incl. the Pagefind index; a page is ~50 KB HTML + 36 KB CSS + one ~20 KB hero mesh + three ~17 KB font files, no JS framework; hero backgrounds and photos get `fetchpriority=high`, everything below the fold lazy-loads. The weight to watch is the licensed photography: keep exports at 2× display size, WebP q80 (~100 KB each) — 17 Sep

## 6 · Content and compliance (Jim + Renny)

- [x] C1 Compliance register v1 returned clean (14 Sep); v2 in `docs/compliance-register.md` — open: Q3, Q5, Q6, Q8, Q9 and new Q10–Q21 from content extraction
- [ ] C2 Fund numbers verified against latest monthly report; `performanceAsAt` set; `verified: true`
- [ ] C3 Documents uploaded: PDS, TMD, last 3 monthlies, quarterly, annual, Lonsec report, policies
- [ ] C4 Insights PDFs re-issued with compliant disclaimers (separate workstream); `wholesaleOnly` flags set
- [ ] C5 Eleven images licensed or replaced per `docs/image-register.xlsx` (Opera House already gone); headshots supplied (eight); split the images doing double duty (IMG-02 on seven pages, IMG-07 as both article art and PEP hero)
- [ ] C6 Lonsec citation rules applied to ratings row. Ruling 23 Sep (Jim): the full report is not hosted — button and library rows now read "Request the Fund Rating Report" and open the contact form with `?topic=lonsec-afi|pif` (Q8 still open on citation wording)
- [ ] C7 Note to Renny: ratings now Lonsec only (his item 6 still lists three houses)
- [ ] C8 Olivia123 dedicated URL swapped in when supplied

## 6a · QA notes from previews (fix in T23)

- [x] QA pass 1 (16 Sep, Jim's home-page review): page-by-page frame comparisons at 1440 for Home, AFI, A− SMA, Wholesale landing, Approach, Team. Fixed: container width (Tailwind `max-w` includes padding, so every band had 1244px of content, not 1340 — `--container-site` is now 1436); hero photo lean (the Tuesday mirror was wrong; reverted); home hero exact 650; fund cards use per-fund mesh exports (`public/heroes/fund-card-afi.webp` rust, `-pif.webp` orange) and full-height images; product cards have their two distinct gradients and the frame's outline placement and two-line titles; generic Important Information shows its label as a left column on desktop; footer external button sits in the sixth column; LeftRight text column no longer over-padded; fund hero titles honour the frame's line breaks; performance chart sits bare on cream with only the table in a card; Fund features card has no border; How-to-invest columns carry their Lucide icons; wholesale hero 634 tall; navy hero description 24px; content-column dividers; compact hero 501; About breadcrumbs on white; Approach philosophy on white with the link inside the last column.
- [x] Header dropdown panels now sit 12px under the label (Jim, 16 Sep; fixed T23)

- [x] Inner-page heroes on About, Insights, Documents and Contact were 501px (the frames' compact size) against 650 elsewhere; now all 650 with the 581 photo, frames and background export updated to match (Jim, 22 Sep)

- [x] T25 Security review (22 Sep): static site, no server code/DB/auth/cookies; deps audit clean; third-party scripts limited to Cloudflare beacon and Mailchimp JSONP; Formspree Formshield + honeypot; wholesale gate is client-side by design (disclosure, not access control). Gap found: no security headers on the preview — added `public/_headers` (CSP allowing self, Cloudflare Insights, Formspree, Mailchimp, `wasm-unsafe-eval` for Pagefind; HSTS; nosniff; frame-ancestors none; Referrer-Policy; Permissions-Policy) and verified every interactive feature under it. Account hygiene is Jim's: 2FA on GitHub and Cloudflare, no shared passwords.

## 6b · Pre-launch build tasks from Jim's 22 Sep list

- [x] T29 Fund performance card is now the report's three-row table (Total return · Cash distribution · Growth × seven periods; `performance.table` in the fund JSON, `PerformanceTable` component, report footnote as `tableNote` [Unverified] wording); card padding evened out; AFI note gains its distribution sentence; "latest monthly" labels realigned to the 30 June data (documents.json June/May/April placeholders until C9) — 22 Sep
- [~] T30 Performance charts rebuilt in Figma at Renny's fidelity (23 Sep; `Performance chart v2` frames, bars exact from the workbooks, yield lines [Unverified] traced from the June report charts until Renny's series arrives) and exported to the site. Original plan, still the long-term option: replace the Figma redraw with a code-drawn SVG from a per-fund monthly series file (bars = 1-year total return from the workbook column AC, lines = running yield, yield to maturity, 90-day BBSW) so the chart carries the monthly x-axis, dual axes and every month, and the monthly update becomes "append a row". **Needs from Renny: the sheet behind his Performance Comparison chart (monthly RY, YTM and BBSW series) — those three are not in the performance workbooks.**

- [ ] T26 Insight page template `src/pages/insights/[slug].astro` — one page per article with the PDF embedded in a viewer (V1); `InsightsList`/`ArticleCard` link to the page instead of the PDF; long-term plan is an in-page version of each report plus a full-report PDF download template (parked until V1 ships)
- [ ] T27 Team headshot fallback: navy initials monogram (SVG, generated from the name) in `ProfileModule` when `photo` is a placeholder — agreed 22 Sep instead of grey silhouettes; real headshots still preferred (C5)
- [x] T28 Fund tables: `scripts/monthly.py` (audit sheet, chart series, `--apply` to the fund JSON) and `docs/MONTHLY.md` rewritten as the four-stage runbook, 23 Sep. Earlier: workbook → JSON mapping done and verified against the June reports (22 Sep); superseded by `scripts/monthly.py`. Open: whether the PIF table shows franked or unfranked totals (Renny); the chart lines (RY, YTM, BBSW) still come from Renny's chart, not the workbooks
- [ ] C9 Back-fill the Insights hub and Document library with the last 12 months of reports (Jim gathering the PDFs; `insights.json` `pdf` paths and `documents.json` `path`/`size` are `[TO SET]` until then)

## 6c · QA round 1 (Jim, 23 Sep)

- [x] Q1 S&C registry URL set (`site.json` externalUrls.ssandcRegistry) · [ ] **T31 Registry portal (arculus.unitregistry.com.au) redesign to the new look — holding task, needs Sunny and Renny to confirm S&C will allow it**
- [x] Q2 hero ellipse pulled in (581 → 540 on desktop, both hero templates)
- [x] Q3–5 team: titles SemiBold navy, photo placeholders hidden until headshots land, wider column padding
- [x] Q6 footer rust chevrons removed
- [x] Q7 "More on ESG" on its own line with a chevron (TwoColumnsContent list links)
- [x] Q8 What we do items shortened to one line (Jim approved the drafts 23 Sep) so the two columns balance
- [x] Q9 Investment Management is gated in a fresh session (shares the wholesale session key by design, so it does not re-ask after Wholesale); change to a separate key if Jim wants it to ask again
- [x] Q10 wholesale cards: image and ring left, buttons bottom-aligned · Q11 private mandates in a white box
- [x] Q12 allocation donut titled "Portfolio allocation" (`allocation.title` optional) · Q13 Fund features title level with Who it may suit · Q14 portfolio tables bottom-aligned
- [x] Q15 type: module titles normalised to `text-h5 md:text-h3` everywhere (see CLAUDE.md type rule)

## 6d · Images (23 Sep)

- [x] R2 · proposed set v2 applied: 13 hero images and the Governance left-right exported at 4× from Figma, WebP, wired per page (each page now has its own file; BBB/PEP/IM no longer borrow AFI/A−/placeholder). Register: `docs/image-register-v2.md`
- [ ] C10 Licence inventory: home hero is a stock screenshot — Jim will replace it before launch with a non-architecture image (brief written 23 Sep; 12-image shortlist in `docs/image-register-v2.md`, none yet preferred); confirm photographer/URL for the nine [Unverified] Unsplash rows; decide on Team reusing the Governance image
- [ ] C11 Remaining placeholders: home and Our approach left-right, Governance investment-committee left-right, insight thumbnails/featured, headshots

## 6e · Security review (23 Sep)

- [x] S1 Header "Link to SS&C Fund Registry" and footer "Arculus Capital" buttons were rendering their placeholder strings as hrefs on every page — now resolve through `externalUrls` (Arculus Capital still `[TO SET]`)
- [x] S2 `noindex` is now automatic on preview builds (`PUBLIC_ALLOW_UNVERIFIED=1`) and removed from the public pages, so `main` cannot ship noindexed; search, dev, 404, wholesale and IM keep their own flag
- [ ] S3 GitHub repo `sbduggan1304/arculus-website` is **public** — make it private (Cloudflare's Git integration works with private repos); move to an Arculus-owned org before launch, 2FA on both accounts, branch protection on `main`
- [ ] S4 Preview URL is open to anyone — put Cloudflare Access (free tier) in front of the preview hostname while unverified copy is on it
- [ ] S5 Formspree: enable domain restriction and spam protection in the form settings; set a retention period; contact-form data residency (US) to be reflected in the Privacy Notice
- [ ] S6 CSP still allows `'unsafe-inline'` scripts/styles and `*.list-manage.com` — tighten to hashes once the page scripts are stable, drop list-manage until Mailchimp is wired
- [ ] S7 Exclude `/dev/components` from the production build (currently noindex + robots-disallowed but reachable)
- [ ] S8 Superseded by T32 (24 Sep): DNS stays with AfterDark; hosting moves to Netlify under Arculus accounts — see `docs/CUTOVER.md`

- [ ] T32 Hosting move to Netlify (path 2, Jim 24 Sep): Arculus GitHub org + Netlify team on the arculus.com.au login, connect repo, branch deploys (`preview` with `PUBLIC_ALLOW_UNVERIFIED=1`, password-protected; `main` strict), verify `_headers`/`_redirects`, add custom domains, then the AfterDark ticket in `docs/CUTOVER.md`

## 7 · Launch

- [ ] L1 Staging review against the compliance register, page by page (Cloudflare Workers staging, noindex)
- [ ] L2 DNS cutover; SSL; test forms, attestation and Olivia123 links on production domain
- [x] L3 `docs/MONTHLY.md` — the monthly runbook: export the two charts from Figma at 2× → WebP, edit the two fund JSON files (as-at date, chart filename, table, note, portfolio metrics, allocation rows, latest-document ids), add the two PDFs and their `documents.json` blocks, commit via GitHub's uploader; with a worked example and what to do when a build fails — 17 Sep
- [ ] L4 Post-launch: test gold external-link colour against rust actions; may revert header button label / external colour

## Parked (do not resolve in code)

EQT as RE (swap once finalised) · Insights image treatment (88px thumb vs none) · article template · interactive charts (add when traffic justifies) · Arculus Capital site launch · wholesale landing hero
