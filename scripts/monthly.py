#!/usr/bin/env python3
"""
Monthly update, stage 1–2: read Renny's two performance workbooks, apply the
workbook-sourced figures to the fund JSON, write the chart series for Figma, and
write an audit sheet that lists every figure on the two fund pages with its
source — filled in for workbook figures, blank for report-PDF figures that a
person types and a second person checks.

    python3 scripts/monthly.py GACS_Performance_31082026.xlsx PIF_Perf_2026_08_31.xlsx
    python3 scripts/monthly.py --apply <same files>      # also writes content/funds/*.json

Outputs (for month YYYY-MM, taken from the workbooks' last dated row):
    docs/monthly/YYYY-MM/audit.md              the sign-off sheet (stage 2)
    docs/monthly/YYYY-MM/chart-<fund>.json     chart series (AFI 43 months; PIF 26 months + franked bars) for scripts/figma-chart-build.js (stage 1)
Workbook layout and column map: docs/MONTHLY.md.
"""
import sys, json, re, argparse, datetime as dt, pathlib
from openpyxl import load_workbook
from openpyxl.utils import column_index_from_string as ci

PERIODS = ["3 months", "6 months", "1 year", "2 years", "3 years", "5 years", "Since inception"]
COLS = {"total": ["AA","AB","AC","AD","AE","AF","AH"], "distribution": ["AV","AW","AX","AY","AZ","BA","BB"], "growth": ["AL","AM","AN","AO","AP","AQ","AR"],
        "total_franked": ["BF","BG","BH","BI","BJ","BK","BL"], "distribution_franked": ["BP","BQ","BR","BS","BT","BU","BV"]}
FUNDS = {"GACS": ("afi", "Arculus Fixed Income Fund", "Since inception (Nov 2017)"), "PIF": ("pif", "Arculus Preferred Income Fund", "Since inception (Oct 2004)")}
ROOT = pathlib.Path(__file__).resolve().parent.parent
pct = lambda v: f"{v*100:.2f}%"
growth = lambda t, d: f"{round(t*100, 2) - round(d*100, 2):.2f}%"  # the published report derives growth from the rounded total and distribution, not the raw cells
longdate = lambda d: d.strftime("%-d %B %Y")

def read(path, asat=None):
    wb = load_workbook(path, data_only=True); ws = wb.worksheets[0]
    if ws.title not in FUNDS: sys.exit(f"{path}: sheet '{ws.title}' is not GACS or PIF")
    rows = [r for r in range(4, ws.max_row + 1) if isinstance(ws.cell(r, 1).value, dt.datetime)]
    if asat:
        rows_at = [r for r in rows if ws.cell(r, 1).value.date() == asat]
        if not rows_at: sys.exit(f"{path}: no row dated {asat}")
        rows = rows[: rows.index(rows_at[0]) + 1]
    r = rows[-1]; date = ws.cell(r, 1).value.date()
    cells = {k: [(f"{c}{r}", ws.cell(r, ci(c)).value) for c in cols] for k, cols in COLS.items()}
    cells = {k: v for k, v in cells.items() if any(x[1] is not None for x in v)}
    # Chart window: AFI 43 months of column AC; PIF 26 months (Jul 2024 onward, mirroring the published report chart)
    # of AC plus BH (1-year return incl. franking credits) as a second bar series.
    pif = ws.title == "PIF"; win = rows[-26:] if pif else rows[-43:]
    series = [(ws.cell(x, 1).value.date(), ws.cell(x, ci("AC")).value, f"AC{x}", ws.cell(x, ci("BH")).value if pif else None) for x in win]
    return ws.title, date, cells, series, pathlib.Path(path).name

ap = argparse.ArgumentParser(); ap.add_argument("files", nargs=2); ap.add_argument("--apply", action="store_true"); ap.add_argument("--asat", type=dt.date.fromisoformat, help="use this month-end row instead of the last one (the site follows the latest PUBLISHED report, which can lag the workbook by a month)")
a = ap.parse_args()
funds = [read(f, a.asat) for f in a.files]
dates = {f[1] for f in funds}
if len(dates) != 1: sys.exit(f"the two workbooks end on different months: {dates}")
date = dates.pop(); ym = date.strftime("%Y-%m")
out = ROOT / "docs" / "monthly" / ym; out.mkdir(parents=True, exist_ok=True)

audit = [f"# Monthly update audit — {longdate(date)}", "",
         "Every figure that changes on the two fund pages, with its source. Workbook cells are filled in by `scripts/monthly.py`; report-PDF figures are typed by the preparer and ticked by the checker against the PDF page. Nothing is committed until both columns are initialled.", "",
         "| Preparer | Checker | Date |", "|---|---|---|", "| | | |", ""]
for sheet, d, cells, series, fname in funds:
    slug, name, si = FUNDS[sheet]
    audit += [f"## {name} (`content/funds/{slug}.json`)", "", f"Workbook: `{fname}`, sheet `{sheet}`, row dated {d}. Report PDF: `public/documents/{slug}-monthly-{ym}.pdf`.", "",
              "### Performance table (workbook → JSON, applied by the script)", "", "| Period | Total return | Cash distribution | Growth | Cells | Checked |", "|---|---|---|---|---|---|"]
    for i, p in enumerate(PERIODS):
        t, dd, g = cells["total"][i], cells["distribution"][i], cells["growth"][i]
        audit.append(f"| {si if p == 'Since inception' else p} | {pct(t[1])} | {pct(dd[1])} | {growth(t[1], dd[1])} | {t[0]} · {dd[0]} · (derived) | ☐ |")
    if "total_franked" in cells:
        audit += ["", "Franking-inclusive figures (not shown on the site until Renny confirms which the table carries):", "", "| Period | Total incl. franking | Distribution incl. franking | Cells |", "|---|---|---|---|"]
        for i, p in enumerate(PERIODS):
            t, dd = cells["total_franked"][i], cells["distribution_franked"][i]
            audit.append(f"| {p} | {pct(t[1])} | {pct(dd[1])} | {t[0]} · {dd[0]} |")
    audit += ["", "### Note sentence (workbook → JSON, applied by the script)", "",
              f"- Distributions: 1 year {pct(cells['distribution'][2][1])} ({cells['distribution'][2][0]}), since inception {pct(cells['distribution'][6][1])} ({cells['distribution'][6][0]}) ☐",
              f"- `performanceAsAt` {d.isoformat()}, `tableTitle` \"Performance to {longdate(d)} (annualised)\" ☐", "",
              "### Portfolio characteristics (report PDF → JSON, typed by hand)", "", "| Metric | Value | PDF page | Checked |", "|---|---|---|---|"]
    for m in ["Running yield", "Yield to maturity", "Average margin", "Average years to maturity", "Number of securities held", "Modified duration", "Credit duration"]:
        audit.append(f"| {m} | | | ☐ |")
    audit += ["", "### Allocation donut (report PDF → JSON, typed by hand; must sum to 100.0%)", "", "| Sector | Value | PDF page | Checked |", "|---|---|---|---|", "| Floating rate notes | | | ☐ |", "| Fixed rate | | | ☐ |", "| Cash | | | ☐ |", "",
              "### Chart (workbook + report → Figma → export)", "",
              f"- Bars: {len(series)} months to {d}, workbook column AC rows {series[0][2]}–{series[-1][2]}" + (" plus column BH (1-year return incl. franking)" if slug == "pif" else "") + f", written to `docs/monthly/{ym}/chart-{slug}.json` ☐",
              "- Lines (running yield, yield to maturity, 90-day BBSW): from Renny's series when supplied, otherwise [Unverified] traced from the report chart — state which: ________ ☐",
              f"- Figma `Performance chart v2 · {slug.upper()}` regenerated, `_note` hidden, exported 2×, trimmed to 664×360, saved as `public/charts/{slug}-{ym}.webp`, `chartImage` updated ☐", "",
              "### Documents", "", f"- `{slug}-monthly-{ym}.pdf` in `public/documents/`, a `documents.json` row with size, and `keyDocuments` \"Latest monthly report\" pointing at it ☐", ""]
    n = len(series); chart = {"months": [s[0].strftime("%b %Y") for s in series], "bars": [round(s[1]*100, 2) for s in series]}
    if slug == "pif": chart["bars2"] = [round(s[3]*100, 2) for s in series]
    chart.update({"RY": [None]*n, "YTM": [None]*n, "BBSW": [None]*n,
                  "_source": f"{fname} column AC rows {series[0][2]}-{series[-1][2]}" + (" (bars) and column BH same rows (bars2, incl. franking)" if slug == "pif" else "") + "; RY/YTM/BBSW to be filled from Renny's series"})
    json.dump(chart, open(out / f"chart-{slug}.json", "w"), indent=0)
    if a.apply:
        p = ROOT / "content" / "funds" / f"{slug}.json"; j = json.load(open(p)); perf = j["performance"]
        perf["performanceAsAt"] = d.isoformat(); perf["tableTitle"] = f"Performance to {longdate(d)} (annualised)"
        if "total_franked" in cells:  # PIF: mirror the report's franking presentation (Renny, Sep 2026; report format from Aug 2026)
            perf["table"]["columns"] = ["Total return", "Incl. franking credits", "Cash distribution"]
            perf["table"]["rows"] = [[si if p_ == "Since inception" else p_, pct(cells["total"][i][1]), pct(cells["total_franked"][i][1]), pct(cells["distribution"][i][1])] for i, p_ in enumerate(PERIODS)]
        else:
            perf["table"]["columns"] = ["Total return", "Cash distribution", "Growth"]
            perf["table"]["rows"] = [[si if p_ == "Since inception" else p_, pct(cells["total"][i][1]), pct(cells["distribution"][i][1]), growth(cells["total"][i][1], cells["distribution"][i][1])] for i, p_ in enumerate(PERIODS)]
        perf["chartImage"] = f"/charts/{slug}-{ym}.webp"
        perf["note"] = re.sub(r"Returns to .*? annualised", f"Returns to {longdate(d)}, annualised", perf["note"])
        perf["note"] = re.sub(r"Cash distributions were [\d.]+% over the year and have averaged [\d.]+% p\.a\. since inception",
                              f"Cash distributions were {pct(cells['distribution'][2][1])} over the year and have averaged {pct(cells['distribution'][6][1])} p.a. since inception", perf["note"])
        j["portfolio"]["asAt"] = longdate(d)
        json.dump(j, open(p, "w"), indent=2, ensure_ascii=False); open(p, "a").write("\n")
audit += ["## Sign-off", "", "- Build green (`npm run build`) ☐", "- Both fund pages checked against the report PDFs side by side ☐", "- Delta packaged as `Monthly Update - <Month YYYY>` ☐", ""]
open(out / "audit.md", "w").write("\n".join(audit))
print(f"wrote {out/'audit.md'} and chart-*.json for {ym}" + ("; fund JSON updated" if a.apply else " (dry run: add --apply to write the fund JSON)"))
