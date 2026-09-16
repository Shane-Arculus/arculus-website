# Arculus website — compliance register v2 (15 Sep 2026)

Supersedes the v1 register sent to Renny (returned clean 14 Sep 2026). v1 catalogued 24 statements (S01–S24) and nine open questions (Q1–Q9). This version records what each question resolved to, adds the questions the content extraction surfaced (Q10–Q18), and turns the statements into a page-by-page checklist for the staging review (L1).

Rule for the build: nothing in `content/` marked `[Unverified]` or `[TO SET]` ships until the row here says CLOSED. Claude Code never resolves a row.

## A. Questions from v1 — status

| Q | Question | Resolution | Status |
|---|---|---|---|
| Q1 | Licensing structure (AFM as CAR of GCI Australia) | Confirmed. Licensing line supplied and in `site.json` verbatim. | CLOSED |
| Q2 | Wholesale-only language in site-wide text | Generic Important Information carried as drafted (AFM "authorised … to provide particular financial services to those who qualify as a 'Wholesale Client'"). T&Cs still say services are wholesale-only. | CLOSED — v1 cleared; [Unverified] whether Renny intended the T&Cs sentence to stand alongside two retail PDS funds. Raise once more at L1. |
| Q3 | Responsible Entity | DDH Graham Limited for launch; EQT transition parked. DDH Graham ABN 28 010 639 219 / AFSL 226319 as drawn on the fund pages. | OPEN — ABN/AFSL to confirm |
| Q4 | "xxx" party in generic disclaimer | Reads "Neither Arculus Funds Management, DDH Graham Limited nor any of their related parties…" | CLOSED |
| Q5 | PIF ARSN | 108 161 575 as drawn (APIR DDH0001AU). AFI ARSN 622 419 578 (APIR DDH8305AU). | OPEN — confirm PIF number |
| Q6 | Correspondence / registered address | Privacy Notice: Hobart for both. Old Cookie Policy: Bondi Beach correspondence, Hobart registered. Contact page: "[Office address — TBC]". | OPEN |
| Q7 | CEO surname | Sunetha Parag throughout. | CLOSED |
| Q8 | Ratings currency and Lonsec citation rules | Lonsec only (SQM and FundMonitors dropped). "Rated 'Investment Grade' by Lonsec." + disclosure sentence + report link per fund. Lonsec's required citation wording, date and disclaimer still to be confirmed. | OPEN — citation rules; note to Renny that v1 item 6 listed three houses |
| Q9 | Complaints and AFCA | Contact page carries a draft complaints paragraph plus "[IDR process and AFCA membership details — TBC with compliance]". | OPEN |

## B. Questions from content extraction (new)

| Q | Question | Where | Owner |
|---|---|---|---|
| Q10 | Fund NAV dates lag performance dates: AFI NAV "as at 30 April 2026", PIF "as at 31 January 2026", both against returns to 30 June 2026. Update or drop NAV from the About paragraph? | `funds/afi.json`, `funds/pif.json` → about.body | Renny |
| Q11 | Wholesale landing Important Information reuses the A− SMA sentence ("Investment in the A− SMA carries risk…"). Needs a strategy-neutral sentence. | `site.json` importantInformation.wholesale; `wholesale/landing.json` | Compliance |
| Q12 | IM Important Information omits the "Portfolio figures are sourced…" sentence. Confirm final wording. IM entity name and minimum portfolio ("$20m indicated") still TBC. | `im.json` | Renny |
| Q13 | Governance page carries "[Renny to confirm membership and the specific role of the committee]" (Investment Committee: Ellis, Saba, McQueen). | `about/governance.json` | Renny |
| Q14 | "We manage over $1.2bn (AUD)" and "operating since 2013" on Our approach. Confirm figure and date. | `about/approach.json` | Renny |
| Q15 | Disclosure page has no copy. Footer and document library both link to it. | `legal/disclosure.md` | Compliance |
| Q16 | Cookie Policy: frame carries the old Google-Analytics-era draft with eleven query marks. Site runs cookieless Cloudflare Web Analytics and two third-party forms. A short replacement draft is in `legal/cookies.md`. Approve or amend. | `legal/cookies.md` | Compliance |
| Q17 | Terms and Privacy Notice carry drafting notes from the old site: "(overriding?)" (Privacy, Introduction); "(or 'appropriate'?)" (Terms, Disclaimer). Resolve each. | `legal/privacy.md`, `legal/terms.md` | Compliance |
| Q18 | Important Disclosure (home) says the T&Cs "can be found under 'Links' at the top of the page" — old-site navigation. Reword to point at the footer link. | `site.json` importantDisclosure | Renny |
| Q19 | SS&C investor services phone and email for the Contact page and registry links; Olivia123 dedicated URL; SS&C registry URL. | `pages/contact.json`, `site.json` externalUrls | Jim / Arculus |
| Q20 | Platform list "BT Panorama, Allan Gray, HUB24 and Netwealth" on both fund pages. Confirm current and complete. | `funds/*.json` howToInvest | Renny |
| Q21 | ESG page exclusion list (gambling; coal, gas, oil, uranium mining; weapons; tobacco; drugs) is checkable against holdings. Confirm all mandates comply before it goes live. Now in the About dropdown (per the frames) as well as linked from Our approach. | `about/esg.md` | Renny |

## C. Figures to verify before `verified: true` (C2)

All from the frames, all against the latest monthly report.

| Fund | Field | As drawn |
|---|---|---|
| AFI | Target return | 90-day BBSW +1.5% p.a. before fees |
| AFI | Performance to 30 June 2026 (annualised, net) | 3m 1.22% · 6m 1.94% · 1y 4.11% · 2y 4.74% · 3y 5.24% · 5y 2.75% · since inception (Nov 2017) 2.33% |
| AFI | Portfolio | Running yield 5.58% · YTM 5.35% · avg margin 0.90% · avg years to maturity 1.94 · 44 securities · modified duration 0.10 · credit duration 1.78 · FRN 96.4% / fixed 2.4% / cash 1.2% |
| AFI | Fees | Mgmt 0.40% p.a. incl. GST · buy–sell +0.10%/−0.10% · no performance fee · min $2,000 |
| AFI | NAV | $38.7m at 30 April 2026 (Q10) |
| PIF | Target return | 90-day BBSW +3.5% p.a. before fees |
| PIF | Performance to 30 June 2026 | 3m 1.98% · 6m 2.30% · 1y 3.86% · 2y 5.10% · 3y 5.55% · 5y 3.86% · since inception (Oct 2004) 4.51% |
| PIF | Distributions | 5.00% over the year; 5.42% p.a. average since inception |
| PIF | Portfolio | Running yield 7.19% · YTM 7.93% · avg margin 3.47% · avg years to maturity 2.92 · 51 securities · modified duration 1.09 · credit duration 1.60 · FRN 67.3% / fixed 29.7% / cash 3.0% |
| PIF | Fees | Mgmt 0.72% p.a. incl. GST · buy–sell +0.15%/−0.15% · no performance fee · min $2,000 · up to 30% below investment grade |
| PIF | NAV | $108m at 31 January 2026 (Q10) |
| A− SMA | At a glance (31 July 2026) | $374.2m · running yield 6.25% · modified duration 0.09 yrs · min rating A− · margin BBSW +143bps · fee 0.25% p.a. · min $50m · inception 1994 · effective duration 2.70 yrs (key risks) |
| BBB SMA | At a glance (31 July 2026) | $148.6m · running yield 6.17% · weighted term to call 1.86 yrs · min rating BBB− · margin BBSW +180bps · fee 0.25% p.a. · min $50m · inception Jan 2019 (fund est. 2011) · issuer cap 20% / line cap 11% |
| PEP | At a glance | ~98% protection per position · 1.2× exposure · 15–40 positions · quarterly collar · 20% gearing overlay. No performance or modelled figures on-page. |
| IM | Fees | 0.20% p.a. service fee capped at $200,000 · nil platform fee · transactions 0.10% · Arculus fund fee waived on own funds · min portfolio TBC |
| Private mandates | Facts | Min AUD $50m · quarterly report + annual meeting · negotiable fees |

## D. Staging review checklist (L1)

Walk every page on staging against this list. Tick when the page shows the approved wording and nothing marked `[Unverified]` remains visible.

**Every page**
- [ ] Footer licensing line verbatim from `site.json`
- [ ] Footer legal links: Disclosure, Privacy, Terms & Conditions, Cookie Policy
- [ ] Important Information band present, correct variant (generic / fund / wholesale)
- [ ] No "guarantee", "eliminates", "ensures", "will never" in body copy
- [ ] External links (Olivia123, SS&C, Arculus Capital, RE/administrator/custodian sites) open in a new tab and are styled gold

**Home**
- [ ] Important Disclosure wording (Q18)
- [ ] Fund card rates match fund pages
- [ ] Ratings block: Lonsec only, disclosure sentence present
- [ ] IM card subtitle is IM copy, not the PIF subtitle

**Fund pages (AFI, PIF)**
- [ ] Fund-specific Important Information with correct ARSN / APIR / RE ABN / AFSL (Q3, Q5)
- [ ] Performance table and note carry the same "as at" date; NAV date reconciled (Q10)
- [ ] Ratings bar: headline, disclosure, "View the Fund Rating Report" → correct Lonsec PDF (Q8)
- [ ] "Past performance is not an indicator of future performance" present on performance and in the band
- [ ] Platform list current (Q20)
- [ ] PDS and TMD links resolve to the current documents

**Wholesale (landing, A−, BBB, PEP) and IM**
- [ ] Attestation modal wording verbatim; decline returns to home; deep links to strategy pages gated
- [ ] "WHOLESALE INVESTORS ONLY" kicker on every hero
- [ ] Wholesale Important Information with strategy-specific risk sentence (Q11) and portfolio "as at" date
- [ ] PEP: no performance figures, modelled or actual, anywhere on the page
- [ ] "Terms are indicative and confirmed in mandate documentation" under every At a glance
- [ ] Key risks present on every strategy page
- [ ] IM: entity name and minimum portfolio resolved (Q12)

**About**
- [ ] Governance: RE named as DDH Graham with correct duties; four roles; Investment Committee note removed (Q13)
- [ ] Approach: FUM and founding date confirmed (Q14); ratings block Lonsec only
- [ ] Team: eight real headshots, no silhouette placeholder
- [ ] ESG: exclusion list confirmed against holdings (Q21)

**Insights and Documents**
- [ ] Every PDF re-issued with compliant disclaimers before linking (C4)
- [ ] `wholesaleOnly` articles and documents hidden or gated for unattested visitors
- [ ] Lonsec report per fund present in the library and linked from the ratings bar

**Contact and legal**
- [ ] Office address (Q6), SS&C contacts (Q19), complaints/AFCA statement (Q9)
- [ ] Privacy consent checkbox on contact and subscribe forms links to the Privacy Notice
- [ ] Cookie Policy describes what the site actually sets (Q16)
- [ ] Drafting notes removed from Terms and Privacy (Q17)
- [ ] Disclosure page has copy (Q15)

## E. Sign-off

| Area | Reviewer | Date | Initials |
|---|---|---|---|
| Fund pages, RE references, figures | Renny | | |
| Wholesale gating, Lonsec citation, legal pages | Compliance | | |
| Document library contents | Renny | | |
| Images licensed (image register) | Jim | | |
