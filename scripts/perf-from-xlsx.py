#!/usr/bin/env python3
"""
Read the monthly performance workbooks Renny sends and print the figures the
site table needs, ready to paste into content/funds/<fund>.json.

    python3 scripts/perf-from-xlsx.py GACS_Performance_31082026.xlsx PIF_Perf_2026_08_31.xlsx
    python3 scripts/perf-from-xlsx.py --asat 2026-06-30 <files>   # an earlier month, to check against a published report

Workbook naming, verified 22 Sep 2026 against the June 2026 monthly reports:
  GACS_Performance_*.xlsx  sheet "GACS"  = Arculus Fixed Income Fund   (AFI; inception Nov 2017; BBSW +1.5%)
  PIF_Perf_*.xlsx          sheet "PIF"   = Arculus Preferred Income Fund (PIF; inception Oct 2004; BBSW +3.5%)
Both sheets share one layout. One row per month-end in column A; a new row is added
each month, so the script takes the last dated row (or --asat). The summary blocks
under the data move down each month and are NOT used. Columns (row 3 headers):
  Z..AH  total return, annualised: 1M 3M 6M 1Y 2Y 3Y 5Y 10Y since-inception   <- the site table
  AU..BB distribution return:      1M 3M 6M 1Y 2Y 3Y 5Y since-inception
  AK..AR growth return:            1M 3M 6M 1Y 2Y 3Y 5Y since-inception
  Q..X   AusBond Bank Bill index:  1M 3M 6M 1Y 2Y 3Y 5Y since-inception
  PIF only (Renny: use these as well as the unfranked figures):
  BE..BL total return incl. franking credits, BO..BV distribution incl. franking (same period order)
Requires openpyxl.
"""
import sys, argparse, datetime as dt
from openpyxl import load_workbook
from openpyxl.utils import column_index_from_string as ci

PERIODS = ["3 months", "6 months", "1 year", "2 years", "3 years", "5 years", "Since inception"]
BLOCKS = {  # name: (first column of the 1M..SI run, columns to skip after 5Y)
    "total":        ("Z",  ["AA","AB","AC","AD","AE","AF","AH"]),
    "distribution": ("AU", ["AV","AW","AX","AY","AZ","BA","BB"]),
    "growth":       ("AK", ["AL","AM","AN","AO","AP","AQ","AR"]),
    "index":        ("Q",  ["R","S","T","U","V","W","X"]),
    "total_franked":        ("BE", ["BF","BG","BH","BI","BJ","BK","BL"]),
    "distribution_franked": ("BO", ["BP","BQ","BR","BS","BT","BU","BV"]),
}
FUNDS = {"GACS": ("afi", "Since inception (Nov 2017)"), "PIF": ("pif", "Since inception (Oct 2004)")}

def pct(v): return f"{v*100:.2f}%"

def read(path, asat):
    wb = load_workbook(path, data_only=True); ws = wb.worksheets[0]
    if ws.title not in FUNDS: sys.exit(f"{path}: sheet '{ws.title}' is not GACS or PIF")
    rows = [r for r in range(4, ws.max_row + 1) if isinstance(ws.cell(r, 1).value, dt.datetime)]
    if asat: rows = [r for r in rows if ws.cell(r, 1).value.date() == asat]
    if not rows: sys.exit(f"{path}: no row for {asat}")
    r = rows[-1]; date = ws.cell(r, 1).value.date()
    out = {}
    for name, (_, cols) in BLOCKS.items():
        vals = [ws.cell(r, ci(c)).value for c in cols]
        if all(v is None for v in vals): continue
        out[name] = vals
    return ws.title, date, out

ap = argparse.ArgumentParser(); ap.add_argument("files", nargs="+"); ap.add_argument("--asat", type=dt.date.fromisoformat)
a = ap.parse_args()
for f in a.files:
    sheet, date, blocks = read(f, a.asat)
    slug, si = FUNDS[sheet]
    print(f"\n== {f} -> content/funds/{slug}.json   (row dated {date})")
    print(f"{'':22}" + "".join(f"{p:>10}" for p in PERIODS))
    for name, vals in blocks.items():
        print(f"{name:22}" + "".join(f"{pct(v) if v is not None else '—':>10}" for v in vals))
    print(f'\n  "performanceAsAt": "{date.isoformat()}",')
    print(f'  "tableTitle": "Performance to {date.strftime("%-d %B %Y")} (annualised)",')
    print('  "periods": [' + ", ".join(f'["{(si if p == "Since inception" else p)}", "{pct(v)}"]' for p, v in zip(PERIODS, blocks["total"])) + "]")
    print(f'  distributions for the note: 1 year {pct(blocks["distribution"][2])}, since inception {pct(blocks["distribution"][6])}')
