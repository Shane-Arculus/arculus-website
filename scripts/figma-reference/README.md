# Figma build reference — refresh runbook

Rebuilds the "08 · Build reference" page in the Figma file (key `WNKIatY2HASsdD2Kyh1nCp`) from the built site: every page at 1440 and 390, text/boxes/icons as live layers, photos, gradient bands and charts as image fills. First captured 17 Oct 2026 (git cc1e280). The code is the source of truth; this page is the visual record.

Run with Claude in a session that has the Figma connector. Working files (`data/`, `img/`, `payload/`, `run/`, `hashes.json`, `frames.json`) are written next to these scripts — do not commit them.

1. Build and serve: `PUBLIC_ALLOW_UNVERIFIED=1 npm run build`, then serve `dist/` on port 4324 (`python3 -m http.server 4324` from `dist/`).
2. Capture: `python3 scripts/figma-reference/extract.py` (all routes; pass part of a page name, e.g. `"15 Contact"`, to capture one). Routes are listed at the top of `extract.py` — add new pages there.
3. Images: `make_jobs.py count` → request that many upload URLs with the Figma `upload_assets` tool, **targeting holder rectangles that stay on the canvas until the build is done** (Figma discards unreferenced uploads), write the URL UUIDs one per line to a file, `make_jobs.py <file>` then `post.py jobs.json`.
4. Payloads: `payload.py` packs each page's layout into an uncompressed PNG; upload `payload/*.png` the same way (`make_jobs.py --payload <file>`).
5. Frames: `frames.py` prints the script that lays out empty frames (it clears the page); run it with `use_figma` and save the returned ids to `frames.json`.
6. Build: prepend `const JOBS=[{f:<frameId>,h:<payload hash>},…];` to `builder2.js` and run it with `use_figma`, three or four pages per call. It clears each frame before building, so it is safe to re-run a page.
7. Check frames against the live pages, then delete the holder rectangles.

Known limits: hover/open states (menus, attestation modal) are not captured; embedded PDF viewers show as a grey placeholder; positions are absolute (no auto-layout).
