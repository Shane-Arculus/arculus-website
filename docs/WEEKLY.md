# Weekly update — runbook

One PDF, one row, one upload. No CMS (decision 4 Oct 2026: revisit only when someone other than Jim needs to post; then a git-backed CMS writing to the same JSON).

1. `python3 scripts/weekly.py Weekly-Update-<d>-<Month>-<yyyy>.pdf` — dry run. It reads page 1 (title = largest text, date, lede as the summary) and prints the `insights.json` row. Read the summary: the PDF's text layer occasionally splits a word ("fo rces"); the script repairs these when a dictionary is available (macOS has one), otherwise fix by hand in the next step.
2. Run again with `--apply`. It copies the PDF to `public/documents/weekly-update-<yyyy-mm-dd>.pdf` and inserts the row at the top of `content/insights.json`. Edit the summary there if needed.
3. `PUBLIC_ALLOW_UNVERIFIED=1 npm run build` and open `/insights/weekly-<yyyy-mm-dd>/`: title, date, summary, PDF embedded, download works.
4. Upload `content/insights.json` and the PDF (keeping the `public/documents/` folder) with the message `Weekly update — <d Month yyyy>`.

Where it appears: the home insights row (the latest weekly always holds the second card; the featured paper and the two newest non-weekly items fill the rest), the hub under the "Weekly update" tab, newest first, and its own page. The hub folds after `page.collapseAfter` (10) with "See more insights".
