# content/ — seeded from Figma, 15 Sep 2026

Every file carries `verified: false`. Copy is verbatim from the canonical frames (page 04 · V1 Layouts). Figures, dates and regulatory strings stay unverified until C1–C3 on `BUILD_TASKS.md` clear them.

## Files

| File | Feeds |
|---|---|
| `site.json` | nav, footer, licensing line, Important Information (generic / fund template / wholesale template), Important Disclosure, ratings strings, attestation modal, form IDs, external URLs |
| `pages/home.json` | Home |
| `funds/afi.json`, `funds/pif.json` | Fund pages (hero facts, performance table, features, portfolio, how to invest, key documents, regulatory IDs) |
| `wholesale/landing.json`, `wholesale/private-mandates.json` | Wholesale landing |
| `wholesale/a-minus.json`, `bbb.json`, `pep.json` | Strategy pages, including the landing-page card for each |
| `im.json` | Investment Management |
| `about/approach.json`, `governance.json`, `team.json`, `esg.md` | About section |
| `insights.json` | Insights hub and home insights row (articles as PDF links) |
| `documents.json` | Document library and every PDF reference on the site |
| `pages/contact.json`, `search.json`, `404.json`, `subscribe.json` | Utility pages and modals |
| `legal/terms.md`, `privacy.md`, `cookies.md`, `disclosure.md` | Legal pages |

Placeholders: `[TO SET]` = a value Jim supplies (URL, path, ID). `[Unverified]` = content that needs a ruling before it ships. `[image register]` = an image slot filled from `docs/image-register.xlsx`.

## Open items found during extraction

**Compliance / Renny**
1. Fund NAV dates lag the 30 June performance date (AFI 30 April; PIF 31 January). Reconcile or drop NAV from the About paragraph.
2. Wholesale landing Important Information reuses the A− SMA risk sentence. Needs a generic sentence.
3. IM Important Information omits the "Portfolio figures…" sentence; IM entity name and minimum portfolio ($20m indicated) still TBC.
4. Governance page carries the frame note "[Renny to confirm membership and the specific role of the committee]".
5. "$1.2bn FUM" on Our approach; "operating since 2013".
6. Contact page: office address, SS&C investor services phone/email, IDR/AFCA statement all TBC. The old Cookie Policy listed a Bondi Beach correspondence address and a Hobart registered address; the Privacy Notice lists Hobart for both.
7. Disclosure page has no copy at all.
8. Cookie Policy: the frame carries the old Google-Analytics-era draft. A short cookieless draft is in `legal/cookies.md` for review.
9. Terms and Privacy Notice contain editorial query marks from the old site ("(overriding?)", "(or 'appropriate'?)").
10. PIF ARSN (Q5) and DDH Graham ABN/AFSL are on the page templates as drawn; still open on the register.

**Copy / Jim**
11. Home "Arculus Investment Management" card subtitle is a copy of the PIF card subtitle. Needs IM copy.
12. Important Disclosure body says the T&Cs "can be found under 'Links' at the top of the page" — old-site wording.
13. Contact "I am a" options are borrowed from the subscribe modal; the contact frame shows a closed select.
14. Contact "message sent" state shows a reference number. Formspree doesn't issue one; generate client-side or drop it.
15. Document library "Showing 7 of 24" implies a monthly-report archive. How far back?
16. Insights reading times and the Lonsec report date ("June 2026") are placeholders.

**Build**
17. Key-document meta strings (dates, file sizes) should derive from `documents.json`, not be typed twice.
18. Wholesale strategy `ratingReportUrl` does not apply; retail funds only.
