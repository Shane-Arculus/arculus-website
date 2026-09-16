# public/ — exported assets, 15 Sep 2026

Exported from the Figma `_EXPORTS` holder frame on page 04 · V1 Layouts (a stripped clone of each hero, kept so re-exports are one call). Hero backgrounds are the mesh-gradient (SHADER) fills only — no photos, no text. Photos are licensed separately via `docs/image-register.xlsx`.

## heroes/ (WebP, exported at 2× and served at 1×)

| File | Used by | Intrinsic px | Display px |
|---|---|---|---|
| `hero-home-1440.webp` | Home hero (warm) | 2880×1300 | 1440×650 |
| `hero-home-390.webp` | Home hero mobile band | 780×600 | 390×300 |
| `hero-afi-1440.webp` | AFI hero (warm, rust) | 2880×1300 | 1440×650 |
| `hero-afi-390.webp` | AFI hero mobile | 780×1434 | 390×717 |
| `hero-pif-1440.webp` | PIF hero (warm, orange) | 2880×1300 | 1440×650 |
| `hero-pif-390.webp` | PIF hero mobile | 780×1544 | 390×772 |
| `hero-compact-navy-1440.webp` | About (Approach, Team, Governance), Insights, Documents, Contact — HeroLevel2 compact navy | 2880×1002 | 1440×501 |
| `hero-compact-navy-390.webp` | same, mobile | 780×632 | 390×316 |

Insights and the compact navy hero are byte-identical exports, so one file serves both. Wholesale landing, wholesale strategy, IM heroes and every CTA banner are plain radial gradients and ship as CSS, not images (below). Mobile hero heights are as drawn; the frame's content height sets them, so treat the image as `background-size: cover` on a container sized by content.

## brand/ (SVG)

- `logo-colour.svg` — header, 190×50 viewBox
- `logo-white.svg` — footer

## ratings/ (PNG)

- `lonsec-wordmark.png` — 325×208, the raster supplied on the frame
- `lonsec-investment-grade.png` — 295×295 badge

Both are small rasters. Ask Lonsec for vector marks (C6) — these will look soft above ~150px display width on retina.

## Gradients as CSS

Every radial gradient in the file uses the same two stops and the same transform. One token:

```css
/* wholesale hero, wholesale strategy heroes, IM hero, all CTA banners */
--gradient-navy-radial: radial-gradient(
  ellipse 86% 43% at 88% 24%,   /* [Unverified] approximation of the Figma transform */
  #0E202E 0%, #1E355E 100%
);
/* wholesale strategy card band */
--gradient-navy-linear: linear-gradient(180deg, #0E202E 0%, #1E355E 100%);
```

Figma transform for the radial (for anyone wanting an exact port): `[[-0.858,-0.247,1.606],[0.247,-0.175,0.428]]`. Verify the CSS against the frame in T6/T7; adjust position and radii by eye.

## Not exported (by design)

- Hero photographs, fund-card and left-right images, card ellipse images — image register
- Monthly performance charts — exported monthly per `docs/MONTHLY.md`
- Team headshots — supplied by Arculus (C5)
- Lucide icons — from the package
