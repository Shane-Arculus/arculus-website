# CLAUDE.md — Arculus Funds Management website

Repo contract for every Claude Code session. Read fully before touching code. `BUILD_TASKS.md` is the work list; this file is the constraints.

Rebuilt 14 Sep 2026 from the Figma file. Anything marked `[Unverified]` needs Jim's confirmation before it is relied on.

## 1. Project

Marketing site for Arculus Funds Management (Melbourne). Two retail funds (Arculus Fixed Income Fund — AFI; Arculus Preferred Income Fund — PIF), a gated wholesale section (A− SMA, BBB SMA, Protected Equity Portfolio, private mandates), a gated Investment Management page, About, Insights, Documents, Contact, legal pages.

Design source of truth: Figma file `WNKIatY2HASsdD2Kyh1nCp` (AFM Site IA & Wireframes), page **04 · V1 Layouts** (`74:3`). Desktop frames are 1440 wide; mobile frames are 390. Where a page has V1 and V2 desktop frames, V2 is canonical. Where a homepage and a homepage Alt exist, **01A · Homepage Alt** is canonical (it is the one with a mobile counterpart).

Priority is a fast launch. Build what is in the frames; do not add features.

## 2. Stack

- Astro 7 (static output) + TypeScript (strict) + Tailwind 4 via `@tailwindcss/vite`. No CMS, no database, no client framework. Islands only where a module needs JS (modals, contact form validation, search).
- Content: JSON and Markdown files in `content/`, loaded through typed loaders in `src/content/`. Zero copy in components.
- Hosting: Cloudflare Workers (static assets, `wrangler.jsonc`, no adapter), Git-connected. `main` is production; any other branch builds as a preview at a `*.workers.dev` preview URL. The verified gate reads the CI branch: on `main` it fails while content is unverified, elsewhere it passes.
- Analytics: Cloudflare Web Analytics (cookieless) — snippet in the base layout.
- Contact form: Formspree (endpoint in `content/site.json`). Subscribe: Mailchimp embedded form, double opt-in.
- Wholesale attestation: `AttestationModal` (native `<dialog>`), state in `sessionStorage` key `arculus-wholesale-attested`; Escape does not dismiss it.
- Forms: `ContactForm` posts to Formspree with `fetch` + `Accept: application/json`; `SubscribeModal` calls Mailchimp's `post-json` JSONP endpoint so double opt-in fires and the done state shows in-page. Both validate client-side; `novalidate` on the form, `aria-invalid` on fields.
- Search: Pagefind (`pagefind --site dist` runs after `astro build`); indexes `<main data-pagefind-body>` on every page except those rendered with `nosearch` (wholesale, IM, search, 404, gallery). HTML only — PDF contents are not indexed.
- Fonts: Fira Sans self-hosted (Regular, Medium, SemiBold), `font-display: swap`.
- Icons: Lucide only, inlined as paths in `src/components/Icon.astro` (no icon dependency); add a path when a module needs a new glyph.
- Images: static exports in `public/` (WebP). Hero mesh gradients are exported (done — `public/heroes/`); monthly performance charts are exported from Figma each month. Re-exports come from the `_EXPORTS` holder frame on page `74:3` (stripped hero clones, logos, rating marks).

Commands: `npm run dev`, `npm run build`, `npm run preview`. Build must pass with zero TypeScript errors before any PR. Node 22 (`.nvmrc`).

## 3. Tokens

Colours are the library variables actually bound on the canonical frames. They are declared once, in `src/styles/global.css` inside `@theme`, with Tailwind's default palette, fonts, sizes and breakpoints removed (`--color-*: initial` etc.), so only these utilities exist: `text-navy`, `bg-cream`, `text-h1`, `max-w-site`, `md:`. Use the token name, never the hex, in components.

| Token | Hex | Use |
|---|---|---|
| `navy` | `#1E355E` | headline, default interactive copy and icons |
| `navy-deep` | `#0E202E` | dark backgrounds (`general/background-dark`) |
| `body` | `#57626D` | body copy, filter/tag copy |
| `rust` | `#B6432F` | primary button background, links (`links/default`) |
| `rust-hi` | `#C54932` | highlight copy, icons, secondary-button arrow, interactive on/highlighted |
| `ink` | `#091117` | secondary button copy |
| `cream` | `#FAF5F1` | light background (`general/background-light`) |
| `sand` | `#F5ECE3` | medium background (`general/background-medium`) |
| `white` | `#FFFFFF` | default background, reverse text |
| `footer-copy` | `#D2D5D9` | footer link copy |
| `line` | `#D2D5D9` | row dividers in key-value lists (same value, own name) |
| `outline-decor` | `#445277` | decorative outline strokes on navy gradient bands |
| `outline-warm` | `#DFC6AD` | ellipse outline on light heroes |
| `orange` | `#EC7826` | wholesale kicker and stat labels (`[Unverified]` raw hex; logo gradient uses #EE7624) |
| `card-line` | `#EBE5DE` | white card borders on cream bands |
| `outline-card` | `#8D93AC` | circle outline on strategy card bands |
| `muted` | `#99A1A8` | input placeholders only (2.6:1 — never for text) |
| `error-tint` | `#FCF0ED` | error banner background |
| `disabled` / `disabled-copy` | `#CCD1D9` / `#737A85` | disabled button |
| `banner-copy` | `#D6D1C6` | body copy on the navy-mid contact banner |
| `line-warm` | `#EAD9C8` | column separators on white bands (profile module) |
| `line-secondary` | `#A8ADB3` | secondary button stroke (`[Unverified]` raw hex) |
| `line-strong` | `#7E868F` | footer outline button, search field border (`[Unverified]` raw hex on frames) |
| `gold` | `#8A6A2A` | external links only (Olivia123, SS&C registry). Figma's "Antique gold" `#B08A3C` fails AA (3.2:1); darkened at T23, `[Unverified]` with Jim |
| `error` | `#B82823` | form validation |
| `navy-mid` | `#0B2545` | three-columns-contact-banner on fund pages (`[Unverified]` — raw hex on the frame, not a library variable) |

Link colour rule: **gold** for links that leave the site; **rust** for actions that contact Arculus directly; navy for everything else. A PDF served from this site is not an external link.

Colour temperature rule: warm (cream/sand/rust) backgrounds on retail fund pages only; navy everywhere else (About, Insights, Wholesale, IM). Home mixes deliberately: warm hero and fund cards, navy below. Both fund pages share one structure; they differ by hero mesh — AFI rust-red, PIF orange — while the module bands below are the same cream/white/navy sequence. Wholesale stat bands step through a ladder A− (deepest) → BBB → PEP (lightest).

Gradients: hero mesh fills (Figma SHADER) ship as WebP in `public/heroes/`; the radial and linear navy gradients (wholesale heroes, IM hero, CTA banners, strategy card bands) and the three strategy-at-a-glance ladder gradients (`--gradient-ladder-1..3`) ship as CSS — see `public/README.md` and `global.css`.

Type ramp (Fira Sans; size/line-height as used on the frames):

| Role | Spec |
|---|---|
| Display | Medium 60/115% |
| H1 | Medium 42/120% |
| H2 | Medium 36/auto |
| H3 | Medium 32/120% |
| H4 | Medium 28/115% |
| H5 | Medium 24/135% |
| H6 | Medium 20/130% |
| Body-lg | Regular 22/150% — fund page About paragraph (`text-base-lg`) |
| Lead | Regular 18/145% |
| Body | Regular 15/145% — size utility is `text-base` (set on `body`); `text-body` is the COLOUR utility |
| Body strong | Medium 15/145% |
| Small | Regular 12/140% |
| Kicker / label | SemiBold 11/auto |
| Caption | Regular 11/auto |
| Display-sm | Medium 48/115% — CTA banner title on mobile |
| Stat | Medium 46/120% — strategy-at-a-glance figures (`text-stat`); labels SemiBold 13 (`text-stat-label`) |
| Subhead | SemiBold 16/120% — table and chart titles on fund pages, colour `navy-mid` (`text-subhead`) |

Card rule (QA, Jim 23 Sep): every white card on a cream band is `rounded-lg border border-card-line bg-white` — one radius (8px), one border (#EBE5DE), no second card-line token. One documented exception: the home fund cards (`FundCards`) are the frame's 16px (`rounded-2xl`) with a 60px top-right radius on the image, as feature cards.

Type rule (QA, Jim 23 Sep): three tiers only. Page title = `text-display-sm md:text-display` in heroes (or `text-h3 md:text-h1` on hero-less pages: article, search, 404). **Every module/section H2 = `text-h5 md:text-h3`**, home included (the frames had home modules at H1; that was the "random" feel). Card and item titles = `text-lead font-medium` or `text-h5`; featured article title `text-h5 md:text-h2`. Kickers, subheads and body as tokened.

Hero photos: the photo is clipped to an ellipse rotated 45° and paired with a thin outline ellipse; `HeroImage` carries the exact path from the frames. Photos at 2× the display size (581 → 1162px) in `public/images/`.

Layout: desktop content 1340 inside 1440 (48px side padding on module bars) — the container token is `--container-site: 1436px` because Tailwind's `max-w` includes padding; `max-w-site px-12` therefore yields 1340 of content; mobile 390 with 16px gutters (358 content). Breakpoints: `<768` mobile layout, `≥768` desktop layout. Key-value lists render as tables ≥768 and stacks <768. Chart images hidden <768; the period table carries the numbers.

Buttons (Figma component set `74:295`): Primary (rust fill, white copy), Secondary (white fill, ink copy, rust arrow, outline), each with Default/Hover/Pressed/Disabled and a `background=white|colours` variant. Footer buttons use `footer-copy`.

## 4. Content model

All in `content/`, loaded as Astro content collections by `src/content.config.ts` (one Zod schema per file shape; entry ids are bare file names, `funds/afi.json` → `afi`) and read only through `src/content/loaders.ts`. Files in a folder with mixed shapes carry a `kind` field (`about/`, `pages/`, `wholesale/`). Every file has `verified: false` until Renny/Jim clears it; the `verifiedGate` integration in `astro.config.mjs` scans `content/` on every build and **fails** on any unverified file when building `main`; other branches (and `PUBLIC_ALLOW_UNVERIFIED=1` locally) are previews and pass. It lives in the integration, not the Zod schema, because Astro caches parsed entries in `node_modules/.astro` and would skip a schema refinement on an unchanged file. `_note` fields are editorial and never rendered. The fund and wholesale Important Information strings are templates filled with `fill()` from the loaders; the template text itself is verbatim compliance copy.

- `site.json` — nav (About includes ESG; Document library is footer-only via `footer.extra` and Private mandates via `footerOnly: true` — neither appears in the header dropdowns, Jim 22 Sep), `ui` strings (menu/search labels, popular searches), footer links, licensing line (verbatim), Important Information variants (`generic`, `fund`, `wholesale`), Formspree endpoint, Mailchimp IDs, Olivia123 URL, SS&C registry URL, attestation wording, ratings disclosure sentence.
- `funds/afi.json`, `funds/pif.json` — hero facts, overview, performance table, `performanceAsAt`, fees and facts, portfolio, key documents, `ratingReportUrl` (that fund's Lonsec report PDF), `investUrl` (Olivia123), CTA copy, theme (`navy` | `warm`).
- `wholesale/a-minus.json`, `wholesale/bbb.json`, `wholesale/pep.json` — statement, strategy-at-a-glance facts, overview, content columns, two-column content, CTA. PEP carries **no performance figures**.
- `wholesale/private-mandates.json` — module copy and facts for the landing page.
- `im.json` — Investment Management (entity name `[Unverified]`).
- `about/approach.json`, `about/governance.json`, `about/team.json` (eight profiles), `about/esg.md`.
- `insights.json` — articles as PDF links at launch, each with `wholesaleOnly` flag.
- `documents.json` — every PDF: title, category, fund, date, path, `wholesaleOnly`.
- `legal/terms.md`, `legal/privacy.md`, `legal/cookies.md`, `legal/disclosure.md` (disclosure copy pending).
- `pages/home.json`, `pages/contact.json`, `pages/404.json`.

Monthly update: the two performance charts are Figma exports (`Performance chart v2` nodes `379:9521` AFI, `396:9521` PIF, current Aug 2026 — rebuilt 23 Sep 2026 at Renny's fidelity: dual axes; AFI all 43 monthly bars; PIF 26 months from Jul 2024 with a second bar series (1-year return incl. franking, workbook column BH) on 12/8 axes, matching the published report chart from 7 Oct 2026; export at 2×, trim below the legend to 664×360 @1x, WebP), never generated in code; the portfolio allocation donut is inline SVG from the three allocation rows. The edit is: change fund JSON, add PDF and a `documents.json` line, drop in the chart export, commit. Document this in `docs/MONTHLY.md` (task L3).

## 5. Rules

1. No copy in components. Everything renders from `content/`. If a string is missing, render nothing and fail the build — never invent copy.
2. Regulatory language is verbatim from `site.json` (licensing line, Important Information, ratings disclosure, attestation). Do not paraphrase.
3. Capital-stability language uses intent framing ("aims to", "seeks to"); never "guarantees", "eliminates", "ensures".
4. Ratings: Lonsec only. "Rated 'Investment Grade' by Lonsec." with the disclosure sentence. No SQM, no FundMonitors, anywhere.
5. Responsible Entity is DDH Graham until told otherwise. CEO is Sunetha Parag. Four-eyes governance is described as three independent parties plus Arculus.
6. Wholesale gate sits at the wholesale landing page and on IM; strategy pages are gated as a deep-link safety net. Decline returns to home.
7. Fira Sans only; Lucide icons only; token names only. No new colours, fonts or icon sets.
8. Every module has a desktop and a mobile Figma node (§6). Build both together; a task is done when the Pages preview matches both frames.
9. Do not add features not in the frames — interactive charts, article templates, CMS, search filters beyond the filter bar. Park them in `BUILD_TASKS.md`.
10. Label anything uncertain `[Unverified]` in code comments and PR notes; never resolve a `[Unverified]` by guessing.

## 6. Figma node map

Format: `desktop-id` → `mobile-id`. "(detached)" nodes are still the correct reference. All on page `74:3`.

### Pages (top-level frames)

| Route | Page | Desktop | Mobile |
|---|---|---|---|
| `/` | Home (01A Alt) | `123:31753` | `207:16548` |
| `/funds/arculus-fixed-income-fund` | AFI (V2) | `88:823` | `207:16875` |
| `/funds/arculus-preferred-income-fund` | PIF (V2) | `97:1078` | `207:17279` |
| `/wholesale` | Wholesale landing | `130:2004` | `209:19001` |
| `/wholesale/a-minus-sma` | A− SMA | `103:1334` | `207:17858` |
| `/wholesale/bbb-sma` | BBB SMA | `118:12535` | `207:18186` |
| `/wholesale/protected-equity-portfolio` | PEP | `120:986` | `207:18514` |
| `/investment-management` | IM | `170:3269` | `207:18842` |
| `/about/our-approach` | Approach | `157:11833` | `208:12136` |
| `/about/esg` | ESG | `150:13882` | `209:20263` |
| `/about/team` | Team | `158:11833` | `209:12086` |
| `/about/governance-and-oversight` | Governance | `157:14081` | `208:12575` |
| `/insights` | Insights hub | `175:11833` | `210:13847` |
| `/documents` | Document library | `186:3532` | `210:12446` |
| `/contact` | Contact | `181:11833` | `210:11897` |
| `/terms` | Terms | `150:13477` | `209:19310` |
| `/privacy` | Privacy | `150:13612` | `209:19606` |
| `/cookies` | Cookies | `150:13747` | `209:19950` |
| `/search` | Search results | `191:4941` | `210:14701` |
| `/404` | Not found | `189:5033` | `210:15137` |

Routes are `[Unverified]` pending the redirect map (T22).

### States and overlays

| State | Desktop | Mobile |
|---|---|---|
| Header dropdowns (About, Funds, Wholesale) | `190:4800` | `199:11833` (M0a–M0e: closed, About, Funds, Wholesale, Search) |
| Attestation modal | `189:4010` (validation) / `130:13793` (overlay) | `236:9091` |
| Contact — validation errors | `189:4027` | `236:9146` |
| Contact — message sent | `189:4288` | `236:9355` |
| Subscribe modal | `189:4552` | `236:9567` |
| Subscribe — check your inbox | `189:4713` | `236:9712` |
| Mobile hero options (reference only) | — | `224:9329` |

### Modules by page

Home: header `123:31754`→`207:16549` · hero-level-1 `123:31755`→`226:9398` · fund-cards `123:31757`→`207:16552` · important-disclosure `123:31758`→`207:16553` · left-right `123:31759`→`207:16554` · product-cards `123:31760`→`207:16555` · insights-row `123:31761`→`207:16556` · important-information `123:31763`→`207:16558` · footer `123:31764`→`207:16559`.

AFI: hero-level-2 `88:13040`→`207:17790` · breadcrumb `88:826`→`207:16878` · fund-overview-performance `88:828`→`207:17684` (ratings bar `244:9689`, rating-report button `257:9537`; mobile ratings row `228:9407`, button `257:9552`) · content-fees-facts `88:935`→`207:16882` · portfolio `88:957`→`207:16884` · three-columns-contact-banner `88:13075`→`248:9650` · key-documents `249:9545`→`249:9623` · documents `95:1133`→`249:20747` · important-information `88:994`→`207:16890` · footer `88:995`→`207:16891`.

PIF: hero-level-2 `97:1080`→`207:17824` · breadcrumb `97:1108`→`207:17282` · fund-overview-performance `97:1110`→`207:17732` (ratings bar `244:9699`, button `257:9545`; mobile row `228:9412`, button `257:9559`) · content-fees-facts `97:1207`→`207:17287` · portfolio `97:1228`→`207:17289` · three-columns-contact-banner `97:1254`→`248:9697` · key-documents `249:9584`→`249:9661` · documents `97:1266`→`249:20779` · important-information `97:1277`→`207:17295` · footer `97:1278`→`207:17296`.

Wholesale landing: hero-wholesale `130:2051`→`209:19003` · statement (mobile only) `209:19026` · wholesale-strategy-cards `133:2137`→`286:9535` (mobile: statement `209:19026` carries the intro; cards stack full-width, image ellipse right-anchored, buttons full-width) · private-mandates `256:9531`→`256:9566` · important-information `130:13718`→`209:19064` · footer `130:13723`→`209:19065`.

A− SMA: hero-level-2 `104:1684`→`207:19179` · breadcrumb `103:1337`→`207:17861` · statement `107:841`→`207:19154` · strategy-at-a-glance `104:13320`→`207:18170` · fund-overview-performance `107:859`→`207:17863` · content-columns `103:1341`→`207:17865` · two-columns-content `103:1340`→`207:17864` · CTA-banner `113:830`→`207:17867` · important-information `103:1344`→`207:17868` · footer `103:1345`→`207:17869`.

BBB SMA: hero-level-2 `118:12537`→`207:19232` · breadcrumb `118:12559`→`207:18189` · statement `118:12560`→`207:19207` · strategy-at-a-glance `118:12579`→`207:18498` · fund-overview-performance `118:12592`→`207:18191` · content-columns `118:12608`→`207:18193` · two-columns-content `118:12609`→`207:18192` · CTA-banner `118:12610`→`207:18195` · important-information `118:12619`→`207:18196` · footer `118:12620`→`207:18197`.

PEP: hero-level-2 `120:988`→`207:19285` · breadcrumb `120:1010`→`207:18517` · statement `120:1011`→`207:19260` · strategy-at-a-glance `120:1030`→`207:18826` · fund-overview-performance `120:1043`→`207:18519` (no performance figures) · content-columns `120:1059`→`207:18521` · two-columns-content `120:1060`→`207:18520` · CTA-banner `120:1061`→`207:18523` · important-information `120:1070`→`207:18524` · footer `120:1071`→`207:18525`.

IM: hero-level-2 `170:3271`→`207:19338` · breadcrumb `170:3531`→`207:18845` · statement `170:3294`→`207:19313` · fund-overview-performance `170:3326`→`207:18847` · content-columns `170:3342`→`207:18849` · two-columns-content `170:3343`→`207:18848` · CTA-banner `170:3344`→`207:18851` · important-information `170:3353`→`207:18852` · footer `170:3354`→`207:18853`.

Approach: hero-level-2 `159:3161`→`208:12337` · breadcrumb `157:11898`→`208:12140` · left-right `157:11910`→`208:12143` · ratings-block `244:9709`→`209:11718` · content-columns `157:11927`→`208:12141` · two-columns-content `157:11967`→`208:12142` · CTA-banner `172:3191`→`208:12559` · important-information `157:11988`→`208:12145` · footer `157:11993`→`208:12146`.

ESG: breadcrumb `150:13929`→`209:20287` · content `150:13941`→`209:20517` · important-information `150:13942`→`209:20326` · footer `150:13947`→`209:20327`. No hero.

Team: hero-level-2 `159:3229`→`209:12095` · breadcrumb `158:11898`→`209:12089` · profile-module ×3 `158:11910`/`160:3008`/`158:12106`→`209:12092`/`209:12587`/`209:12652` · two-columns-content `158:12204`→`209:12741` · CTA-banner `172:3217`→`209:12749` · important-information `158:12225`→`209:12093` · footer `158:12230`→`209:12094`.

Governance: hero-level-2 `159:3195`→`208:12776` · breadcrumb `157:14146`→`208:12579` · left-right `157:14158`→`208:12582` · content-columns `233:20487`→`233:20583` · left-right `157:14214`→`208:12583` · CTA-banner `172:3204`→`208:12993` · important-information `157:14244`→`208:12584` · footer `157:14249`→`208:12585`.

Insights hub: hero-level-2 `175:15022`→`210:14243` · breadcrumb `175:11881`→`210:13871` · filter-bar `175:11893`→`210:14277` · insights-row `175:11902`→`210:14548` · insights-list `176:3456`→`210:14607` · CTA-banner `177:3331`→`210:14685` · important-information `175:12080`→`210:13910` · footer `175:12085`→`210:13911`.

Document library: hero-level-2 `186:3580`→`210:12824` · breadcrumb `186:3614`→`210:12470` · filter-bar `186:3624`→`210:12855` · documents ×4 `186:3637`/`186:3809`/`186:3973`/`186:4023`→`210:13018`/`210:13324`/`210:13537`/`210:13709` · important-information `186:4165`→`210:12509` · footer `186:4170`→`210:12510`.

Contact: hero-level-2 `181:12073`→`210:12322` · breadcrumb `181:12107`→`210:11921` · contact-form-section `181:12164`→`210:12398` · three-columns-contact-banner `181:12119`→`210:12353` · important-information `181:12216`→`210:11960` · footer `181:12221`→`210:11961`.

Legal (Terms / Privacy / Cookies): breadcrumb `150:13524`/`150:13659`/`150:13794`→`209:19334`/`209:19630`/`209:19974` · content `150:13536`/`150:13671`/`150:13806`→`209:19564`/`209:19860`/`209:20204` · important-information `150:13537`/`150:13672`/`150:13807`→`209:19373`/`209:19669`/`209:20013` · footer `150:13542`/`150:13677`/`150:13812`→`209:19374`/`209:19670`/`209:20014`. No hero.

Search: breadcrumb `191:4989`→`210:14725` · search-header `191:4999`→`210:15079` · filter-bar `191:5006`→`210:15086` · results `191:5014`→`210:15094` · important-information `191:5057`→`210:14764` · footer `191:5062`→`210:14765`.

404: content `189:5081`→`210:15506` · important-information `189:5091`→`210:15200` · footer `189:5096`→`210:15201`. Mobile has a breadcrumb `210:15161`; desktop does not — follow each frame.

Reference frames: local components page `198:4969`; UI tints `123:32106`; palette extension `77:30383`; button set `74:295`.

### Frame cleanup log

15 Sep: FAQ removed from AFI/PIF mobile; empty `Frame 4` removed from PIF desktop; hidden duplicate homepage hero and hidden wholesale cards frame removed; wholesale landing mobile cards rebuilt from the desktop design. No open discrepancies.

## 6a. Components built so far

| Component | Props | Figma |
|---|---|---|
| `KeyValueList` | `rows: [label, value][]`, `title?`, `variant: facts \| table`, `caption?` | content-fees-facts `88:935`→`207:16882`; performance table in `88:828` |
| `ChartImage` | `src`, `alt`, `title?`, `series?` | Performance chart `88:836`; none on mobile |
| `Header` | none — reads `site.json` (nav, headerButton, ui, externalUrls); use `<Header slot="header" />` in `Base` | `123:31754`, panels `190:4800`, mobile `207:16549`, states `199:11833` |
| `Footer` | none — reads `site.json`; `<Footer slot="footer" />` | `123:31764`→`207:16559` |
| `HeroLevel1` | `title`, `subtitle`, `buttons`, `image {src, alt}` | `123:31755`→`226:9398` |
| `HeroLevel2` | `title`, `description?`, `kicker?`, `theme: light \| navy`, `layout: full \| compact`, `bg: afi \| pif \| compact`, `titleColor: navy \| rust`, `buttons?`, `stats?`, `image?`; default slot under buttons | fund `88:13040`→`207:17790`; compact `159:3161`→`208:12337`; strategy `104:1684`→`207:19179` |
| `HeroWholesale` | `kicker`, `title`, `subtitle` | `130:2051`→`209:19003` |
| `HeroImage` | `src`, `alt`, `size` (581 / 444 / 390), `outline` class | image + ellipse-shape in every hero |
| `Section` | `bg: white \| cream \| sand \| navy-deep`, `pad: default \| tight \| none`, `id?` | the standard band; every content module uses it |
| `Statement` | `title`, `points: [heading, body][]`, `footnote?`, `bg?` | `107:841`→`207:19154` |
| `StrategyAtAGlance` | `items: [value, label][]`, `ladder: 1 \| 2 \| 3` | `104:13320`→`207:18170`; BBB `118:12579`; PEP `120:1030` |
| `ContentColumns` | `title`, `items: [heading, body, link?][]`, `icons?`, `columns?`, `bg?`, `link?`, `titleSize?` | `103:1341`→`207:17865` |
| `TwoColumnsContent` | `title`+`paragraphs` (split) or `columns: [{title, paragraphs?, items?}, …]`, `bg?` | `103:1340`→`207:17864` |
| `LeftRight` | `title`+`paragraphs` or `blocks {title, paragraphs}[]`, `image {src, alt}`, `button?`, `flip?`, `bg?` | `157:11910`→`208:12143`; home `123:31759` |
| `FundOverviewPerformance` | `about {title, body}`, `ratingReportUrl?`, `performance {...}`, `fundName` | `88:828`→`207:17684`; PIF `97:1110`→`207:17732` |
| `RatingsRow` | `reportUrl` (copy from `site.json` ratings) | `244:9689`→`228:9407`; Approach `244:9709` |
| `Documents` | `title`, `intro?`, `items {title, href, meta?}[]`, `viewAll?`, `collapseAfter?`, `bg?`, `id?` | `95:1133`→`249:20747`; library `186:3637…` |
| `DownloadSlice` | `title`, `href`, `meta?` | Download_slice |
| `KeyDocuments` | `title`, `items {title, meta, href}[]` | `249:9545`→`249:9623` |
| `ProfileModule` | `title`, `intro?`, `people {name, title, bio, photo}[]` | `158:11910`→`209:12092` |
| `ProductCards` | `title`, `cards {title, subtitle, button}[]` | `123:31760`→`207:16555` |
| `InsightsRow` | `title`, `button?`, `featured: Article`, `list: Article[]` | `123:31761`→`207:16556`; hub `175:11902` |
| `ArticleCard` / `Tag` | `article`, `featured?` | article-block, highlighted-article |
| `InsightsList` | `id`, `title`, `articles`, `readLabel`, `thumbs?`, `emptyLabel?` | `176:3456`→`210:14607` |
| `FilterTabs` | `tabs: string[]`, `target` (id of list), `bg?` | `175:11893`; `186:3624`; `191:5006` |
| `SearchInput` | `title`, `buttonLabel`, `placeholder?`, `query?`, `resultsLine?` | `191:4999`→`210:15079` |
| `SearchResultRow` | `kicker`, `title`, `href`, `snippet?`, `source?` | `191:5014`→`210:15094` |
| `ThreeColumnsContactBanner` | `title`, `columns {title, body, button}[]` | `88:13075`→`248:9650`; contact `181:12119` |
| `ContactForm` / `FormField` | none — reads pages/contact.json + site.json | `181:12164`→`210:12398`; errors `189:4027`; sent `189:4288` |
| `SubscribeModal` | none — opened by any `[data-open-subscribe]` | `189:4552`→`236:9567`; done `189:4713` |
| `AttestationModal` | none — include on gated pages; opens when session key absent | `189:4010`→`236:9091`; scrim `130:13793` |
| `FundCards` | `title`, `cards {fund, title, subtitle, rate, rateNote, href, investHref, image}[]`, `buttons`, `showRatings?`, `id?` | `123:31757`→`207:16552` |
| `ImportantDisclosure` | none — reads `site.json` | `123:31758`→`207:16553` |
| `FundFeesFacts` | `suit {title, body}`, `managed {title, body[], button}`, `features {title, items}` | `88:935`→`207:16882` |
| `FundPortfolio` | `title`, `metrics`, `allocation {columns, rows}` — donut is inline SVG from rows | `88:957`→`207:16884` |
| `StrategyCards` | `title`, `intro`, `strategies: Strategy[]`, `buttonLabel`, `hrefs`, `images` | `133:2137`→`286:9535` |
| `PrivateMandates` | `anchor`, `title`, `body`, `aside`, `button`, `facts` | `256:9531`→`256:9566` |
| `StrategyAbout` | `about {title, paragraphs}`, `glance {title, note, items}` | `107:859`→`207:17863` |
| `ProseArticle` | `title`, `lead?`, `Content` (from `getMarkdown`) | ESG `150:13941`; legal `150:13536` etc. |
| `ContactColumnsCard` | `title`, `columns {title, body, icon?, link}[]` | `181:12119`→`210:12353` |
| `Breadcrumb` | `items: string[]` (labels; hrefs from nav) | `88:826`→`207:16878` |
| `ImportantInformation` | `variant: generic` \| `fund` + `fundName, arsn, apir` \| `wholesale` + `riskSubject, asAt` | `123:31763`, `88:994`, `103:1344` |
| `CtaBanner` | `title`, `body`, `button` | `113:830`→`207:17867` |
| `Button` | `label`, `href?`, `style: primary \| secondary \| external`, `full?`, `type?` | set `74:295` |
| `Icon` | `name` (chevron-down/up/right, search, menu, x, arrow-up-right, download, file-text, file-check, layout-grid, mail, wallet, file), `size?` | Lucide, inlined paths |

`/dev/components` is a gallery page built only when `PUBLIC_ALLOW_UNVERIFIED=1`. Add every new component to it; it is the review surface until pages exist.

## 7. Working conventions

- One T-task per session. Start by reading `BUILD_TASKS.md`, do the task, tick it, commit with the task ID in the message (`T7: HeroLevel1 and HeroLevel2`).
- Build the component, wire it to content, render it on its page, check the preview against both Figma frames, then stop. For a page task, the check is a full-page comparison against the frame screenshot at 1440 (see `/tmp/cmp.py` pattern: frame beside render in 1500px strips), not just the modules in isolation — module-level checks missed a global container-width error and a mirrored hero photo. Do not start the next task.
- Screenshots of Figma frames come from the MCP `get_screenshot` with `maxDimension: 1600`; asset exports via `download_assets` (returns a URL — fetch with curl).
- Keep PR descriptions to: task ID, what was built, what is `[Unverified]`, what was parked.
- Never commit secrets. Formspree and Mailchimp IDs are public embed IDs and may live in `site.json`; anything else goes in Cloudflare environment variables.
