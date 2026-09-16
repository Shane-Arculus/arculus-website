> **T1 was done directly on 15 Sep 2026 (Astro 7, Tailwind 4). The block below is kept as the record of scope; tokens live in `src/styles/global.css` `@theme`, not `tailwind.config`. Start Claude Code at T2 using the standing pattern at the end.**

# T1 prompt — Claude Code, first session

Paste the block between the rules into Claude Code from the repo root. Before you do, the repo should contain: `CLAUDE.md`, `BUILD_TASKS.md`, `content/`, `public/`, `docs/`, and the Fira Sans files in `public/fonts/` (Regular, Medium, SemiBold as `.woff2`).

---

Read `CLAUDE.md` in full, then `BUILD_TASKS.md`. This session is **T1 only**: scaffold the project so that `npm run build` produces a static site with one placeholder page, the design tokens, the fonts and the analytics snippet in place. Do not start T2.

Do this, in order:

1. Initialise an Astro project in the current directory with TypeScript (strict) and Tailwind. Static output. No integrations beyond Tailwind. Do not add React, Vue, or any UI library.
2. Put the colour tokens from `CLAUDE.md` §3 into `tailwind.config` as named colours (`navy`, `navy-deep`, `navy-mid`, `body`, `rust`, `rust-hi`, `ink`, `cream`, `sand`, `white`, `footer-copy`, `gold`, `error`). Put the type ramp in as named font sizes with their line-heights (`display`, `h1` … `h6`, `lead`, `body`, `body-strong`, `small`, `kicker`, `caption`). Set the two gradient tokens from `public/README.md` as CSS custom properties in the global stylesheet. Set container max-width to 1340px and the single breakpoint at 768px. Remove Tailwind's default colour palette so only the tokens exist.
3. Self-host Fira Sans from `public/fonts/` with `@font-face` (Regular 400, Medium 500, SemiBold 600), `font-display: swap`, and set it as the only `font-sans` family with a system fallback stack.
4. Create `src/layouts/Base.astro`: `<html lang="en-AU">`, meta viewport, title and description props, the font preloads, the Cloudflare Web Analytics snippet with the token read from an environment variable `PUBLIC_CF_ANALYTICS_TOKEN` (render nothing if unset), and a `<main>` slot. No header or footer yet; those are T4 and T5.
5. Create `src/pages/index.astro` using `Base.astro`, rendering one `<h1>` in the `h1` type size and `navy` colour, and one paragraph in `body` on a `cream` background. That is the whole page.
6. Create `src/content/` with an empty `loaders.ts` exporting nothing yet, and a `README.md` line saying loaders arrive in T2. Do not touch `content/`.
7. Add `.gitignore`, `.nvmrc` (current LTS), and a `README.md` with the three commands and the Cloudflare Pages build settings (build command `npm run build`, output directory `dist`).
8. Run `npm run build`. Fix anything until it passes with zero TypeScript errors and zero warnings you introduced.
9. Tick T1 in `BUILD_TASKS.md`. Commit as `T1: scaffold Astro + Tailwind, tokens, fonts, analytics`.

Constraints for this session:
- Every colour and size in code is a token name. If you find yourself typing a hex value or a pixel size outside `tailwind.config` and the global stylesheet, stop.
- No copy. The placeholder heading and paragraph are the only strings, and they say "Arculus Funds Management" and "Site under construction." respectively.
- Do not install anything not named above. If Astro's init asks about extras, decline them.
- If a font file is missing from `public/fonts/`, say so and stop rather than substituting a Google Fonts link.

When done, reply with: the final `tailwind.config`, the `Base.astro` file, the build output summary, and anything marked `[Unverified]`.

---

## Standing pattern for T2 onwards

Each later session opens with the same three lines and then the task:

> Read `CLAUDE.md` in full, then `BUILD_TASKS.md`. This session is **T{n} only**. Do not start T{n+1}.
>
> {task text from BUILD_TASKS.md, expanded with the Figma node IDs for the modules involved, from CLAUDE.md §6}
>
> Build desktop and mobile together. Take screenshots of the Figma nodes named above via the Figma MCP (`get_screenshot`, `maxDimension: 1600`) before writing any markup, and compare the Cloudflare Pages preview against them before ticking the task. Reply with what was built, what is `[Unverified]`, and what was parked.

For T2 specifically, add: "Write the TypeScript types and loaders for every file in `content/` as it exists today. Do not change any content. The build must fail with a clear message if a required field is missing or a file still has `verified: false` and `PUBLIC_ALLOW_UNVERIFIED` is not set."

## Before you paste T1

- [ ] Repo has `CLAUDE.md`, `BUILD_TASKS.md`, `content/`, `public/`, `docs/`
- [ ] `public/fonts/` has the three Fira Sans `.woff2` files (OFL; download from Google Fonts and convert, or take the woff2 from the Fira Sans GitHub release)
- [ ] Cloudflare Pages project is linked to the repo and the Web Analytics token is in the Pages environment variables as `PUBLIC_CF_ANALYTICS_TOKEN`
- [ ] Node LTS installed locally; `npm` on PATH
