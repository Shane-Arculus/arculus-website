# Cutover runbook — path 2 (DNS stays with AfterDark, site on Netlify)

Decision (Jim, 24 Sep 2026): DNS hosting stays on AfterDark/Conetix. The static build moves from Cloudflare Workers to Netlify because Netlify gives fixed addresses for the apex domain, so AfterDark only ever makes record changes on request. Nothing in the site code changes: Netlify reads `public/_headers` and `public/_redirects` natively.

Current records (looked up 24 Sep 2026): NS ns1/ns2.conetix.com · A arculus.com.au and www → 202.74.69.60 (Plesk/WordPress) · MX → Microsoft 365 · SPF and MS TXT, autodiscover CNAME → Outlook. Email records are not touched at any point.

## Our side, before the ticket

1. **Accounts under Arculus.** GitHub organisation (owner: Jim's arculus.com.au login; Renny as second owner) and transfer `arculus-website` into it, set private, branch protection on `main`. Netlify team on the same login, 2FA on both.
2. **Netlify site.** New site from the Git repo. Build command `npm run build`, publish directory `dist`, Node 20. Branch deploys on: `preview` builds with `PUBLIC_ALLOW_UNVERIFIED=1` to `preview--<site>.netlify.app` (replaces the Workers preview); `main` builds with no flag, so unverified content still refuses to build. Password-protect the preview branch (Netlify site protection) — closes S4.
3. **Verify the Netlify build** at `<site>.netlify.app`: all 20 routes, `_headers` served (CSP, HSTS), `_redirects` honoured, forms and modals as per the QA script.
4. **Add the custom domains** `arculus.com.au` and `www.arculus.com.au` to the Netlify site. Netlify then shows the exact records it wants; copy them into the ticket below (do not type them from memory — the addresses are Netlify's and can change). Set `www` → apex redirect (or the reverse, to match the old site).
5. **Launch gate.** Compliance sign-off, `"verified": true` across content, `main` build green, Cloudflare Web Analytics token replaced by whatever analytics Arculus settles on.

## The ticket to AfterDark (send from the Arculus address)

> Hi Tyler — thanks. We don't need platform access; a small set of record changes will do. Arculus is retiring the WordPress site and hosting the new site with Netlify. DNS hosting stays with you; Microsoft 365 is unaffected and no mail records change.
>
> **Now (preparation):** please send us an export of the current DNS zone for arculus.com.au, and lower the TTL on the two website A records (`arculus.com.au`, `www.arculus.com.au`) to 300 seconds so the switch propagates quickly.
>
> **On [date], between 10:00 and 11:00 AEST:** please make these changes and confirm by email when done —
> - `arculus.com.au` A record: change from 202.74.69.60 to `[Netlify apex address, from step 4]`
> - `www.arculus.com.au`: replace the A record with a CNAME to `[<site>.netlify.app, from step 4]`
> - Leave all other records exactly as they are (MX, TXT, autodiscover).
>
> Please keep the existing WordPress hosting live for 14 days after the change so we can roll back by reverting the two records if needed; we'll confirm when it can be decommissioned.
>
> Could you confirm the Service Desk can action this and what lead time you need?

Roll-back is the same ticket in reverse (two records back to 202.74.69.60).

## Cutover day

1. Confirm Netlify's domain panel shows both hostnames waiting for DNS.
2. AfterDark confirms the change. Check with a resolver (`dns.google/resolve?name=arculus.com.au&type=A`) until the new address answers.
3. Netlify provisions the HTTPS certificate automatically once the records resolve (minutes to an hour). Until then the site answers over HTTP only; do not announce until the padlock is there.
4. Run the QA script against `https://arculus.com.au`: routes, headers, S&C and Olivia123 links, contact form live test to Renny's inbox, Lonsec request.
5. Submit `sitemap-index.xml` in Google Search Console (property under the Arculus Google account), confirm the home page is *not* noindexed.

## After

- Day 14: tell AfterDark to decommission WordPress. In the same ticket ask them to remove `202.74.69.60`, `_spf.syrahost.com` and `cms104.hostserver.au` from the SPF record (they were the old web hosts) and to add a DMARC record (`_dmarc` TXT, `v=DMARC1; p=none; rua=mailto:[an Arculus mailbox]`) — monitor-only, no effect on delivery. Renny to approve; it's his email.
- Cloudflare Workers project: leave until the Netlify site has run clean for a month, then delete; `wrangler.jsonc` can stay in the repo or go.
- Future DNS tickets are rare: a new subdomain, or a verification TXT for a new tool (Mailchimp domain authentication is the likely first one).
