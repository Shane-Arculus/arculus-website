#!/usr/bin/env python3
"""
Weekly update intake: read the first page of the weekly PDF, copy it into
public/documents/, and add its row to content/insights.json.

    python3 scripts/weekly.py Weekly-Update-5-October-2026.pdf          # dry run: prints the row
    python3 scripts/weekly.py --apply Weekly-Update-5-October-2026.pdf  # writes the PDF and the row

Title = the largest text on page 1; date = the "d Month yyyy" under WEEKLY UPDATE;
summary = the lede paragraph after the title (hyphenation artefacts cleaned).
Check the printed row before uploading. Requires pdfplumber.
"""
import sys, re, json, shutil, argparse, datetime as dt, pathlib
import pdfplumber
ROOT = pathlib.Path(__file__).resolve().parent.parent
WORDS = set(w.strip() for w in open("/usr/share/dict/words")) if pathlib.Path("/usr/share/dict/words").exists() else set()
ap = argparse.ArgumentParser(); ap.add_argument("pdf"); ap.add_argument("--apply", action="store_true"); ap.add_argument("--category", default="Weekly update")
a = ap.parse_args()
with pdfplumber.open(a.pdf) as pdf:
    p = pdf.pages[0]; words = p.extract_words(extra_attrs=["size"]); text = p.extract_text() or ""; pages = len(pdf.pages)
big = max(w["size"] for w in words); title = " ".join(w["text"] for w in words if w["size"] >= big - 0.5)
m = re.search(r"(\d{1,2} [A-Z][a-z]+ \d{4})", text); date = dt.datetime.strptime(m.group(1), "%d %B %Y").date() if m else None
if not date: sys.exit("no date found on page 1")
after = text.split(title, 1)[1] if title in text else text
lede = after.strip().split("\n\n")[0]
lines = []; 
for ln in after.strip().split("\n"):
    if not ln.strip() or re.match(r"^[A-Z0-9 \-%+]+$", ln.strip()): break
    lines.append(ln.strip())
summary = re.sub(r"\s+", " ", " ".join(lines))
summary = re.sub(r"(\d) -(\w)", r"\1-\2", summary)          # "10 -year" -> "10-year"
for broken in re.findall(r"\b([a-z]{1,3}) ([a-z]{2,5})\b", summary):  # "fo rces" -> "forces" when the join is a real word and the parts are not
    w = broken[0] + broken[1]
    if w in WORDS and not (broken[0] in WORDS and broken[1] in WORDS): summary = summary.replace(f"{broken[0]} {broken[1]}", w)
slug = f"weekly-{date.isoformat()}"; fname = f"weekly-update-{date.isoformat()}.pdf"
row = {"slug": slug, "category": a.category, "filter": a.category, "date": date.isoformat(), "title": title, "summary": summary,
       "readingTime": f"{max(3, pages)} min read", "wholesaleOnly": False, "pdf": f"/documents/{fname}",
       "image": "/images/insight-weekly.webp"}  # standing weekly thumbnail (Jim, 7 Oct 2026)
print(json.dumps(row, indent=2, ensure_ascii=False))
if a.apply:
    (ROOT / "public" / "documents").mkdir(exist_ok=True); shutil.copy(a.pdf, ROOT / "public" / "documents" / fname)
    ip = ROOT / "content" / "insights.json"; d = json.load(open(ip))
    if any(x["slug"] == slug for x in d["articles"]): sys.exit(f"{slug} already in insights.json")
    d["articles"].insert(0, row); json.dump(d, open(ip, "w"), indent=2, ensure_ascii=False); open(ip, "a").write("\n")
    print(f"wrote public/documents/{fname} and the insights.json row; build, check /insights/{slug}/, upload.")
