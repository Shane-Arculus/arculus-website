# Monthly update — runbook

How the Arculus site is updated each month. No code changes, no CMS. Three files are edited, two files are added, one commit. Twenty minutes once you've done it twice.

If a step below says something you can't see, or a build fails, stop and send the build log to Jim. Nothing goes live until the build is green.

## What changes each month

| Item | Where | How |
|---|---|---|
| Performance chart (one per fund) | `public/charts/<fund>-<yyyy-mm>.webp` | Export from Figma (step 2) |
| Performance table, as-at date, chart filename | `content/funds/afi.json`, `content/funds/pif.json` | Edit numbers (step 3) |
| Portfolio metrics and allocation | same two files | Edit numbers (step 3) |
| Monthly report PDF (one per fund) | `public/documents/` | Add the file (step 4) |
| Document library entry | `content/documents.json` | Add one block per PDF (step 4) |

Everything else on the site stays as it is. `<fund>` is `afi` or `pif`.

## Step 1 — Get the numbers

Renny sends four workbooks each month. Two matter for the site table:

| File | Sheet | Fund | Site file |
|---|---|---|---|
| `GACS_Performance_<ddmmyyyy>.xlsx` | `GACS` (headed "Arculus Fixed Interest Fund", the old name) | Arculus Fixed Income Fund | `content/funds/afi.json` |
| `PIF_Perf_<yyyy_mm_dd>.xlsx` | `PIF` | Arculus Preferred Income Fund | `content/funds/pif.json` |

The two `*_Turnover_*.xlsx` files are the month's transaction lists and are not used on the site.

Both sheets have one row per month-end in column A; a new row is added at the bottom each month. Read the **last dated row** (the summary blocks below the data move down every month, so never rely on a fixed row number). The columns, from the row 3 headers:

| Columns | Series | Periods left to right |
|---|---|---|
| Z–AH | Total return, annualised | 1M · 3M · 6M · 1Y · 2Y · 3Y · 5Y · 10Y · since inception |
| AU–BB | Distribution return | 1M · 3M · 6M · 1Y · 2Y · 3Y · 5Y · since inception |
| AK–AR | Growth return | same |
| Q–X | AusBond Bank Bill index | same |
| BE–BL (PIF only) | Total return **including franking credits** | same |
| BO–BV (PIF only) | Distribution return including franking credits | same |

The site table's seven cells are AA, AB, AC, AD, AE, AF and AH (3M, 6M, 1Y, 2Y, 3Y, 5Y, since inception) of the total-return block; the note sentence uses AX (1-year distribution) and BB (since-inception distribution). Renny's instruction (Sep 2026): for PIF, take the franking-inclusive figures as well as the unfranked ones. [Unverified] which of the two the published table should show — the June 2026 monthly report shows the unfranked total return, so the site does too until Renny says otherwise; the franked figures are printed alongside for him.

The script does the reading for you and prints paste-ready JSON:

    python3 scripts/perf-from-xlsx.py GACS_Performance_31082026.xlsx PIF_Perf_2026_08_31.xlsx

Checked 22 Sep 2026: run with `--asat 2026-06-30` it reproduces every figure in both June 2026 monthly reports (two cells differ by 0.01 from rounding, which the reports themselves caveat).

The portfolio characteristics (running yield, yield to maturity, average margin, securities held, fixed/FRN/cash split, durations) are **not** in these workbooks — take them from the monthly report PDF. The performance chart's running-yield, yield-to-maturity and BBSW lines likewise come from Renny's chart, not from these files (Step 2).

## Step 2 — Export the two charts from Figma

The charts are the `Performance chart v2` frames on page **04 · V1 Layouts** (AFI `349:9521`, PIF `346:9503`, to the right of all page frames). Each is 664 wide and built from data: 43 monthly bars (1-year total return, right axis, from the workbook column AC) and three yield lines (running yield, yield to maturity, 90-day BBSW, left axis). To roll a month forward: drop the oldest month, add the new one (bar from the workbook; the three line values from Renny's series, see below), re-space, and shift the six-monthly x labels if needed. Then export the frame at 2× PNG with the `_note` layer hidden, trim everything below the legend (360px @1x = 720px @2x), convert to WebP (quality 90) and save as `public/charts/<fund>-<yyyy-mm>.webp`; update `chartImage` in the fund JSON.

The line values for Jun 2026 were [Unverified] traced from the June report charts; when Renny supplies the monthly series behind his chart, rebuild the three vectors from the numbers (the `_note` layer on each frame records this). `scripts/figma-chart-build.js` is the use_figma script that built the frames: replace its `D` series and axis constants and run it through the Figma MCP to regenerate a chart from data rather than editing by hand.

## Step 3 — Edit the fund files

Open `content/funds/afi.json`. Find and change these, and nothing else:

```
"performance": {
  ...
  "performanceAsAt": "2026-08-31",          ← last day of the report month
  "chartImage": "/charts/afi-2026-08.webp", ← the file from step 2
  "tableTitle": "Performance to 31 August 2026 (annualised)",
  "periods": [
    ["3 months", "1.22%"],                  ← every figure from the PDF
    ["6 months", "1.94%"],
    ["1 year", "4.11%"],
    ["2 years", "4.74%"],
    ["3 years", "5.24%"],
    ["5 years", "2.75%"],
    ["Since inception (Nov 2017)", "2.33%"]
  ]
},
```

and further down:

```
"portfolio": {
  ...
  "metrics": [
    ["Running yield", "5.58%"],             ← from the PDF
    ...
  ],
  "allocation": {
    "columns": ["Portfolio sector", "Allocation"],
    "rows": [
      ["Floating rate notes", "96.4%"],     ← must add to 100%; the donut is drawn from these
      ["Fixed rate bonds", "2.4%"],
      ["Cash", "1.2%"]
    ]
  }
}
```

Also update the note under Performance if it carries a date:

```
"note": "Returns to 31 August 2026, annualised and net of all fees. ..."
```

Then the same in `content/funds/pif.json`. PIF's note also carries the distribution figures ("Cash distributions were 5.00% over the year and have averaged 5.42% p.a. since inception") — update those from the PIF report.

Rules when editing:
- Keep the quotes and commas exactly as they are. A missing comma fails the build (the build tells you the file and line).
- Percentages are text: `"1.22%"`, with the sign and symbol as printed.
- Do not touch `"verified"`.

## Step 4 — Add the PDFs to the library

1. Copy the two PDFs into `public/documents/`, named `afi-monthly-2026-08.pdf` and `pif-monthly-2026-08.pdf`.
2. Open `content/documents.json`. In the `"documents"` list, add one block per PDF, directly after the previous month's block for that fund:

```
{
  "id": "afi-monthly-2026-08",
  "fund": "afi",
  "category": "Monthly reports",
  "title": "Monthly report — August 2026",
  "meta": "Report · 31 August 2026",
  "date": "2026-08-31",
  "path": "/documents/afi-monthly-2026-08.pdf",
  "size": "PDF 0.8 MB",
  "wholesaleOnly": false
},
```

3. In `content/funds/afi.json`, find `"keyDocuments"` and point "Latest monthly report" at the new id:

```
{ "title": "Latest monthly report", "meta": "August 2026 · PDF 0.8 MB", "doc": "afi-monthly-2026-08" },
```

and in `"documents"` → `"items"`, replace the previous month's id with the new one (the fund page shows the latest four; the library shows everything). Same for PIF.

## Step 5 — Commit

**Via GitHub in the browser** (no software needed):

1. github.com/sbduggan1304/arculus-website → make sure the branch selector says the branch you're working on.
2. *Add file → Upload files*. Drag in the two chart files, the two PDFs, and the three edited JSON files. GitHub keeps them in their folders if you drag the folders (`public/charts`, `public/documents`, `content/funds`, `content`), or upload the files one folder at a time.
3. Commit message: `Monthly update — August 2026`. Commit.

Cloudflare builds automatically. In two to three minutes the change is live. Check the fund page: the chart is the new one, the table shows the new figures, the library lists the new PDF.

**If the build fails**: the Cloudflare project → Deployments → the failed build → View build log. The last lines say which file and line. Almost always a missing comma or quote in a JSON file. Fix, re-upload that one file, commit again.

## Branches, before and after launch

- Before launch: work on the `preview` branch. The site at `preview-arculus-website.spring-heart-ee6a.workers.dev` shows the result.
- After launch: work on `main`. The live site updates. The build on `main` refuses any content file marked `"verified": false`, which is why step 3 says not to touch that line — it is set to `true` once at launch after compliance sign-off and stays that way.

## Quarterly and annual

Same as a monthly PDF (step 4) with `"category": "Quarterly updates"` or `"Annual reports"` and a matching title. No chart, no fund-file numbers unless the report changes them.

## Things that are deliberately not part of this

- Editing page copy, the team, fees, or regulatory text: those are compliance-controlled and go through Jim and Renny.
- Changing the chart's design: the frames in Figma are the master; only the data changes.
- Adding a new fund or a new page: a build task, not a monthly update.

## Worked example — August 2026 AFI

Files touched:
```
public/charts/afi-2026-08.webp        (new, from Figma)
public/documents/afi-monthly-2026-08.pdf   (new)
content/funds/afi.json                (performanceAsAt, chartImage, tableTitle, note, periods, metrics, allocation rows, keyDocuments latest, documents items)
content/documents.json                (one new block)
```
Commit: `Monthly update — August 2026 (AFI)`.
