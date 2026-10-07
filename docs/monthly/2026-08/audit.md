# Monthly update audit — 31 August 2026

Every figure that changes on the two fund pages, with its source. Workbook cells are filled in by `scripts/monthly.py`; report-PDF figures are typed by the preparer and ticked by the checker against the PDF page. Nothing is committed until both columns are initialled.

| Preparer | Checker | Date |
|---|---|---|
| Claude (figures applied by script; characteristics typed from the August PDFs p.1) | Jim ☐ | 6 Oct 2026 |

## Arculus Fixed Income Fund (`content/funds/afi.json`)

Workbook: `GACS_Performance_30092026.xlsx`, sheet `GACS`, row dated 2026-08-31. Report PDF: `public/documents/afi-monthly-2026-08.pdf`.

### Performance table (workbook → JSON, applied by the script)

| Period | Total return | Cash distribution | Growth | Cells | Checked |
|---|---|---|---|---|---|
| 3 months | 1.23% | 0.85% | 0.38% | AA109 · AV109 · (derived) | ☐ |
| 6 months | 1.91% | 1.81% | 0.10% | AB109 · AW109 · (derived) | ☐ |
| 1 year | 4.05% | 3.71% | 0.34% | AC109 · AX109 · (derived) | ☐ |
| 2 years | 4.61% | 4.76% | -0.15% | AD109 · AY109 · (derived) | ☐ |
| 3 years | 5.14% | 4.75% | 0.39% | AE109 · AZ109 · (derived) | ☐ |
| 5 years | 2.86% | 3.61% | -0.75% | AF109 · BA109 · (derived) | ☐ |
| Since inception (Nov 2017) | 2.38% | 2.81% | -0.43% | AH109 · BB109 · (derived) | ☐ |

### Note sentence (workbook → JSON, applied by the script)

- Distributions: 1 year 3.71% (AX109), since inception 2.81% (BB109) ☐
- `performanceAsAt` 2026-08-31, `tableTitle` "Performance to 31 August 2026 (annualised)" ☐

### Portfolio characteristics (report PDF → JSON, typed by hand)

| Metric | Value | PDF page | Checked |
|---|---|---|---|
| Running yield | 5.75% | p.1 | ☐ |
| Yield to maturity | 5.50% | p.1 | ☐ |
| Average margin | 0.95% | p.1 | ☐ |
| Average years to maturity | 1.93 | p.1 | ☐ |
| Number of securities held | 44 | p.1 | ☐ |
| Modified duration | 0.15 | p.1 | ☐ |
| Credit duration | 1.95 | p.1 | ☐ |

### Allocation donut (report PDF → JSON, typed by hand; must sum to 100.0%)

| Sector | Value | PDF page | Checked |
|---|---|---|---|
| Floating rate notes | 95.52% → 95.5% | p.1 | ☐ |
| Fixed rate | 2.47% → 2.5% | p.1 | ☐ |
| Cash | 2.01% → 2.0% | p.1 | ☐ |

### Chart (workbook + report → Figma → export)

- Bars: 43 months to 2026-08-31, workbook column AC rows AC67–AC109, written to `docs/monthly/2026-08/chart-afi.json` ☐
- Lines (running yield, yield to maturity, 90-day BBSW): from Renny's series when supplied, otherwise [Unverified] traced from the report chart — RY/YTM Jul–Aug from the August report text; BBSW Jul–Aug traced from the August AFI report chart; earlier months as June [Unverified traced] ☐
- Figma `Performance chart v2 · AFI` regenerated, `_note` hidden, exported 2×, trimmed to 664×360, saved as `public/charts/afi-2026-08.webp`, `chartImage` updated ☑ (frames 378:9521 PIF, 379:9521 AFI)

### Documents

- `afi-monthly-2026-08.pdf` in `public/documents/`, a `documents.json` row with size, and `keyDocuments` "Latest monthly report" pointing at it ☑

## Arculus Preferred Income Fund (`content/funds/pif.json`)

Workbook: `PIF_Perf_2026_09_30.xlsx`, sheet `PIF`, row dated 2026-08-31. Report PDF: `public/documents/pif-monthly-2026-08.pdf`.

### Performance table (workbook → JSON, applied by the script)

| Period | Total return | Cash distribution | Growth | Cells | Checked |
|---|---|---|---|---|---|
| 3 months | 1.24% | 1.07% | 0.17% | AA267 · AV267 · (derived) | ☐ |
| 6 months | 2.70% | 2.26% | 0.44% | AB267 · AW267 · (derived) | ☐ |
| 1 year | 3.70% | 5.00% | -1.30% | AC267 · AX267 · (derived) | ☐ |
| 2 years | 4.74% | 5.91% | -1.17% | AD267 · AY267 · (derived) | ☐ |
| 3 years | 5.42% | 5.91% | -0.49% | AE267 · AZ267 · (derived) | ☐ |
| 5 years | 3.95% | 5.05% | -1.10% | AF267 · BA267 · (derived) | ☐ |
| Since inception (Oct 2004) | 4.52% | 5.38% | -0.86% | AH267 · BB267 · (derived) | ☐ |

Franking-inclusive figures (not shown on the site until Renny confirms which the table carries):

| Period | Total incl. franking | Distribution incl. franking | Cells |
|---|---|---|---|
| 3 months | 1.31% | 1.14% | BF267 · BP267 |
| 6 months | 2.84% | 2.41% | BG267 · BQ267 |
| 1 year | 3.91% | 5.22% | BH267 · BR267 |
| 2 years | 5.15% | 6.32% | BI267 · BS267 |
| 3 years | 5.77% | 6.26% | BJ267 · BT267 |
| 5 years | 4.24% | 5.34% | BK267 · BU267 |
| Since inception | 4.90% | 5.76% | BL267 · BV267 |

### Note sentence (workbook → JSON, applied by the script)

- Distributions: 1 year 5.00% (AX267), since inception 5.38% (BB267) ☐
- `performanceAsAt` 2026-08-31, `tableTitle` "Performance to 31 August 2026 (annualised)" ☐

### Portfolio characteristics (report PDF → JSON, typed by hand)

| Metric | Value | PDF page | Checked |
|---|---|---|---|
| Running yield | 7.18% | p.1 | ☐ |
| Yield to maturity | 7.99% | p.1 | ☐ |
| Average margin | 3.44% | p.1 | ☐ |
| Average years to maturity | 2.61 | p.1 | ☐ |
| Number of securities held | 38 | p.1 | ☐ |
| Modified duration | 0.61 | p.1 | ☐ |
| Credit duration | 1.64 | p.1 | ☐ |

### Allocation donut (report PDF → JSON, typed by hand; must sum to 100.0%)

| Sector | Value | PDF page | Checked |
|---|---|---|---|
| Floating rate notes | 78.52% → 78.5% | p.1 | ☐ |
| Fixed rate | 20.61% → 20.6% | p.1 | ☐ |
| Cash | 0.87% → 0.9% | p.1 | ☐ |

### Chart (workbook + report → Figma → export)

- Bars: 43 months to 2026-08-31, workbook column AC rows AC225–AC267, written to `docs/monthly/2026-08/chart-pif.json` ☐
- Lines (running yield, yield to maturity, 90-day BBSW): from Renny's series when supplied, otherwise [Unverified] traced from the report chart — RY/YTM Jul–Aug from the August report text; BBSW Jul–Aug traced from the August AFI report chart; earlier months as June [Unverified traced] ☐
- Figma `Performance chart v2 · PIF` regenerated, `_note` hidden, exported 2×, trimmed to 664×360, saved as `public/charts/pif-2026-08.webp`, `chartImage` updated ☑ (frames 378:9521 PIF, 379:9521 AFI)

### Documents

- `pif-monthly-2026-08.pdf` in `public/documents/`, a `documents.json` row with size, and `keyDocuments` "Latest monthly report" pointing at it ☑

Note: workbooks run to 30 September; the site follows the latest published report (August), so the script was run with `--asat 2026-08-31`. PIF table now shows Total return · Incl. franking credits · Cash distribution, mirroring the August report; AFI unchanged.

## Sign-off

- Build green (`npm run build`) ☐
- Both fund pages checked against the report PDFs side by side ☐
- Delta packaged as `Monthly Update - <Month YYYY>` ☐

### PIF chart correction — 7 Oct 2026

Chart rebuilt to match the published August report chart: window cut to Jul 2024–Aug 2026 (26 months); second bar series added, 1-year return incl. franking credits, workbook `PIF_Perf_2026_09_30.xlsx` column BH rows BH242–BH267 (Aug 2026 = 3.91%, agrees with the report table); axes changed to yields 0–12%, returns 0–8% as in the report. Bars column AC unchanged. Lines unchanged (still [Unverified] traced to Jun 2026). Figma frame `396:9521`; `public/charts/pif-2026-08.webp` replaced. ☐
