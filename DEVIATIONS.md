# Deviations Ledger — /galas production port

Reference: `prototype/frontrow-v3.html` (source of truth). Visual parity at
390/744/1280, normal + reduced-motion: **0.000% pixel difference** (with font
binaries equalized — see §7). Provided acceptance suite: **11/11 green**.
Form suite: 4/4 green. Everything below is a conscious, documented delta.

## Gate-affecting

1. **Lighthouse `color-contrast` audit fails by design.** The locked Tally
   Red palette (ink-35 mono labels, `--red` numerals on dark) sits below WCAG
   AA 4.5:1 on several small-text elements (`.q-i`, `.ch-s`, `.rr-from`,
   `.b-num`, `.rr-tag`, `.clk .time`). Ground rule "do not improve colors"
   outranks the audit; Accessibility still scores **96 ≥ 95** with it failing.

2. **LCP measured 2.7–3.3 s (simulated) locally vs the < 2.0 s target.**
   LCP element is the H1 text (as designed). 83% of it is render delay: the
   mandated Archivo `wdth` variable font (88 KB, preloaded, `display:swap`)
   re-paints the H1 when it lands, under Lighthouse's simulated Slow-4G via
   local `next start` (HTTP/1.1, no CDN). The gate is defined against the
   **Vercel preview** (HTTP/2 + CDN + brotli), which this sandbox cannot
   deploy to (no credentials) — validate there. Remaining levers if it still
   misses would change mandated behavior (`display:optional`, or a custom
   instanced font subset) — founder's call, not taken unilaterally.

3. **No preview URL.** The environment has no Vercel credentials. The branch
   is push-ready; connecting the repo to Vercel (root directory = repo root)
   and setting `HOLD_WEBHOOK_URL` (see APPS-SCRIPT.md) is all that remains.

## Invisible-to-users (required by gates or platform)

4. **Three `aria-label`s reworded** on the multiviewer source tiles
   (e.g. `Cut CAM 1 jib to program` → `CAM 1 — JIB, cut to program`) so the
   accessible name contains the visible text (axe
   `label-content-name-mismatch`; needed for Accessibility ≥ 95).

5. **Sticky bar carries `inert` while hidden**, mirrored with `aria-hidden`
   (axe `aria-hidden-focus`). Off-screen links were tabbable in the
   prototype; now they are not. No visual or pointer change.

6. **`<form class="form">` replaces the prototype's `<div class="form">`**,
   inputs gained `name`/`id` + associated labels, plus the prompt-mandated
   honeypot field, submit states, and API wiring. Same classes, same pixels.

7. **Font binaries differ from the css2 CDN builds.** Google serves
   differently-hinted builds of the same fonts to the css2 API (prototype
   `<link>`) vs next/font (self-hosted). Headless-Linux FreeType quantizes
   Plex Mono 10.5 px advances differently (7.0 vs 6.0 px/glyph), which can
   shift a line wrap in CI screenshots. macOS/iOS ignore hinting — real
   devices render identically. The parity harness serves the app's own
   binaries to both pages to compare layout, not rasterizer builds.

8. **IBM Plex Mono ships weight 500 only** (prompt's prescriptive snippet);
   the prototype also loaded 400/600. Sole consumer of 600 is the FAQ `+`
   (`.q-x` inherits `font-weight:600`), now synthesized from 500 —
   indistinguishable at 18 px.

9. **Scene JPEGs stay CSS backgrounds** exactly as in the prototype (the
   switcher's class-swap cut depends on pre-rasterized fields); re-encoded
   per spec (1280 w, q70). `loading="lazy" decoding="async"` + intrinsic
   width/height applied to the logo `<img>`s (keeps CLS at 0).

10. **`<Analytics />` mounts only when `process.env.VERCEL` is set** so local
    prod runs don't 404 `/_vercel/insights/script.js` (the suite asserts zero
    console errors). Always set on Vercel, so analytics is live there.
    Custom events fire regardless through a guarded wrapper.

11. **Test harness only:** Chromium runs with `--disable-smooth-scrolling`
    (playwright.config.ts). The provided spec measures `boundingBox()`
    immediately after `scrollIntoView()`; with animated scrolls this races —
    verified by running the spec against the prototype itself, which fails
    the T-bar test in this runner without the flag and passes with it. The
    spec file is untouched. App behavior (CSS smooth scroll + RM map) is
    unchanged.

## Post-launch, owner-directed changes

12. **2026-06-11 — Signal-flow SVG sub-labels tightened** (user-reported
    overflow, present in the prototype itself on all devices — the strings
    physically exceed the 200-unit boxes at the design's mono metrics):
    `REMOTE HEAD · DRIVEN FROM THE DESK` → `REMOTE HEAD · DESK-DRIVEN`
    (DESIGN.md's canonical phrasing) and `90 SEC · DELIVERED IN 2 WEEKS` →
    `90 SEC · 2 WKS` (the mobile chain's existing string). Parity vs the
    frozen prototype now reads 0.005% at 1280 (those two lines only); 0.000%
    everywhere else.

13. **2026-06-11 — Compact control surface on phones** (owner-directed after
    reviewing the deployed page on iPhone; the prototype's ≤560 desk shipped
    with a tall key tower and dead space under FTB). At ≤560px the T-bar
    track is shortened to align with the key stack (198→148px) and the desk
    is scaled to 82% (`zoom:.82`). Implemented in gala.css's marked
    production-additions block; the lifted prototype CSS remains verbatim.
    Full suite 15/15 green after the change (T-bar drag math is
    zoom-safe). Parity vs the frozen prototype at 390 now intentionally
    diverges in/below the desk (page 144px shorter); 744/1280 unchanged.

14. **2026-06-11 — Swipeable set piece replaces the mobile chain** (owner
    choice between two mockups). The prototype's ≤880 summary chain is
    retired; the desktop signal-flow SVG now renders at all widths — at ≤880
    inside a horizontal swipe viewport (`.flow-scroll`, min 820px diagram
    width, momentum scroll, keyboard-focusable region) with edge fades that
    follow the scroll position and a mono swipe hint. The wire draw-on-view
    effect and its fail-safes now run on mobile too. **Provided suite test
    #10 amended accordingly** ("chain replaces SVG" → "swipeable diagram
    replaces chain") — the only spec change, marked in tests/gala.spec.ts.
    Suite 15/15 green; 744/390 parity vs the frozen prototype intentionally
    diverges at this section.

15. **2026-06-11 — Compact multiviewer on phones** (owner-directed). At
    ≤560px PVW and PGM share one row instead of stacking full-width — the
    monitor wall drops from ~590px to ~293px tall (PVW|PGM, CAM1|CAM2,
    PLAYBACK|CLOCK). One rule in the production-additions block; lifted CSS
    untouched. Suite 15/15 green.

## Carried TODOs (per prompt, intentionally unresolved)

- Crew frame photo swap points (`.crew-frame` background slots) —
  `app/galas/page.tsx`.
- Hero/PGM muted motion-loop slot (rights-gated; structure only) —
  `components/gala/Hero.tsx`.
- `NEXT_PUBLIC_CAL_URL` — "OR BOOK A 15-MIN CALL" keeps `href="#"` until set
  — `components/gala/HoldForm.tsx`.

## Deployment notes (site-wide)

- TODO(deploy): Owner prefers **www**. All canonical/OG/JSON-LD URLs point at
  `https://www.frontrowoc.com` (app/layout.tsx metadataBase, app/page.tsx,
  app/galas/page.tsx). In Vercel's domain settings, add both domains and set
  `www.frontrowoc.com` as primary so `frontrowoc.com` 308-redirects to it.
  Verify the apex → www redirect once DNS is pointed. No DNS/redirect config
  lives in this repo, so this is a dashboard task.

## Local verification record (this environment)

- Playwright: 15/15 (11 provided + 4 form/API).
- Visual parity: 0.000% diff at 390/744/1280 × {animations-off, reduced-motion}.
- `getComputedStyle(h1).fontStretch === '125%'` ✓ (suite test 11).
- Lighthouse mobile (local `next start`, two runs): Performance 90–96,
  Accessibility 96, Best Practices 100, SEO 100; FCP 0.9 s, CLS 0,
  TBT 40–160 ms, LCP 2.7–3.3 s (see §2).
