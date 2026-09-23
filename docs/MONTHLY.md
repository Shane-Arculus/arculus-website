# Monthly update — runbook

How the two fund pages are updated each month, and how every figure is audited. Four stages, one delta, two people. Nothing is committed until the audit sheet is initialled by a preparer and a checker.

## What arrives, what changes

Renny sends four workbooks: `GACS_Performance_<ddmmyyyy>.xlsx` (sheet `GACS`, the **AFI**; "Fixed Interest Fund" is the old name), `PIF_Perf_<yyyy_mm_dd>.xlsx` (sheet `PIF`, the **PIF**), and two `*_Turnover_*.xlsx` transaction lists the site does not use. Two monthly report PDFs follow.

Everything that changes on a fund page, and where the figure comes from:

| # | On the page | File | Source | How it gets there |
|---|---|---|---|---|
| 1 | Performance chart bars (43 months, 1-year total return) | Figma → `public/charts/<fund>-<yyyy-mm>.webp` | Workbook column AC, last 43 rows | `scripts/monthly.py` writes `chart-<fund>.json`; `scripts/figma-chart-build.js` draws it (stage 1) |
| 2 | Performance chart lines (running yield, yield to maturity, 90-day BBSW) | same | Renny's series behind his chart (not in the workbooks) | typed into `chart-<fund>.json` (stage 1) |
| 3 | Performance table: 7 periods × Total return, Cash distribution, Growth | `content/funds/<fund>.json` → `performance.table` | Workbook last dated row, columns AA–AH, AV–BB, AL–AR | `scripts/monthly.py --apply` (stage 2) |
| 4 | Note sentence: as-at date, 1-year and since-inception distribution | `performance.note`, `tableTitle`, `performanceAsAt` | Workbook AX, BB and the row date | `--apply` |
| 5 | Portfolio characteristics (7 metrics) | `portfolio.metrics` | Report PDF, Portfolio Characteristics table | typed by hand, checked (stage 2) |
| 6 | Allocation donut and legend (FRN / fixed / cash) | `portfolio.allocation.rows` | Report PDF, same table; must sum to 100.0% | typed by hand, checked |
| 7 | Portfolio as-at | `portfolio.asAt` | Report month end | `--apply` |
| 8 | Monthly report PDF | `public/documents/<fund>-monthly-<yyyy-mm>.pdf` | Arculus | copied in (stage 3) |
| 9 | Library row and "Latest monthly report" | `content/documents.json`, `keyDocuments` | — | edited by hand (stage 3) |

For PIF the workbook also carries franking-inclusive returns (BE–BL, BO–BV). The script lists them on the audit sheet; the site table shows the unfranked figures until Renny confirms otherwise. Rows 5 and 6 are the only figures a person types, which is why they get a PDF page reference and a second pair of eyes.

## Stage 1 — Figma chart

1. Run `python3 scripts/monthly.py <GACS file> <PIF file>` (dry run). It creates `docs/monthly/<yyyy-mm>/` with `audit.md` and `chart-afi.json`, `chart-pif.json` (bars filled from column AC, the three line series empty).
2. Fill `RY`, `YTM`, `BBSW` in each chart JSON from Renny's series, 43 values each, oldest first. If the series has not arrived, trace from his report chart and mark the audit sheet [Unverified].
3. In Figma (file `WNKIatY2HASsdD2Kyh1nCp`, page **04 · V1 Layouts**), rebuild each chart with `scripts/figma-chart-build.js` through the Figma MCP: paste the JSON in as `D`, set the axis constants for the fund (PIF: left 16 to -4, right 12 to -4; AFI: left 8 to 0, right 8 to -4), run. It draws a new `Performance chart v2 · <FUND> (<Mon YYYY>)` frame beside the previous one; delete the old frame once the new one is checked.
4. Hide the `_note` layer, export at 2× PNG, trim everything below the legend (720px tall at 2×), convert to WebP at quality 90, save as `public/charts/<fund>-<yyyy-mm>.webp`.

## Stage 2 — Figures

1. Run the script again with `--apply`. It writes rows 3, 4 and 7 into both fund JSON files and sets `chartImage` to the stage 1 filename. It touches nothing else.
2. Open `docs/monthly/<yyyy-mm>/audit.md`. The workbook rows are already filled with their cell references. Type the seven portfolio metrics and the three allocation rows into `portfolio.metrics` and `portfolio.allocation.rows` in each fund JSON, exactly as printed in the report PDF, and record the PDF page on the sheet. Allocation rows must add to 100.0%; the donut is drawn from them.
3. Checker: open the report PDFs beside the two JSON files, tick every row on the sheet, initial the top.

Rules: percentages are text with the sign and symbol as printed (`"-0.83%"`); never touch `"verified"`; if a figure in the workbook disagrees with the report PDF, stop and ask Renny — the report is the published document.

## Stage 3 — Documents and build

1. Copy the PDFs to `public/documents/<fund>-monthly-<yyyy-mm>.pdf`.
2. In `content/documents.json`, add one row per fund after the previous month's, `id` `<fund>-monthly-<yyyy-mm>`, category "Monthly reports", `size` from the file. Point `keyDocuments` "Latest monthly report" in each fund JSON at the new id.
3. `PUBLIC_ALLOW_UNVERIFIED=1 npm run build` (on `preview`) or `npm run build` (on `main`). Green, or stop.
4. Look at both fund pages in the local build against the PDFs one last time: chart, table, note, characteristics, donut, library.

## Stage 4 — Package and deploy

Delta name: `Monthly Update - <Month YYYY>`. Contents, and nothing else:

```
docs/monthly/<yyyy-mm>/audit.md            initialled
docs/monthly/<yyyy-mm>/chart-afi.json, chart-pif.json
public/charts/afi-<yyyy-mm>.webp, pif-<yyyy-mm>.webp
public/documents/afi-monthly-<yyyy-mm>.pdf, pif-monthly-<yyyy-mm>.pdf
content/funds/afi.json, content/funds/pif.json
content/documents.json
```

Upload via GitHub (*Add file → Upload files*, keeping the folders) with the commit message `Monthly update — <Month YYYY>`, tag the commit `monthly-<yyyy-mm>`. Cloudflare builds in two to three minutes; check the live fund pages. The audit sheet committed with the delta is the record.

## Branches, before and after launch

- Before launch: `preview`; the site at `preview-arculus-website.spring-heart-ee6a.workers.dev` shows the result.
- After launch: `main`. The build on `main` refuses any content file marked `"verified": false`, which is set to `true` once at launch after compliance sign-off.

## Quarterly and annual

A PDF and a `documents.json` row with category "Quarterly updates" or "Annual reports". No chart, no fund-file numbers.

## Deliberately not part of this

- Page copy, team, fees, regulatory text: compliance-controlled, through Jim and Renny.
- Chart design: the Figma frames and the build script are the master; only the data changes.
- A new fund or page: a build task.
