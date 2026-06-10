# BUILD: Front Row Broadcast — Gala Landing Page (Production)

You are taking an **approved, QA-passed prototype to production**. This is an engineering port, not a design project.

**Source-of-truth precedence:** `prototype/frontrow-v3.html` → this prompt → `DESIGN.md`. When anything is ambiguous, replicate the prototype exactly.

---

## Mission

Ship `frontrowoc.com/galas` on Next.js (App Router) + Vercel, pixel- and behavior-identical to `prototype/frontrow-v3.html`, with a working date-hold form, SEO/meta, analytics, and the provided Playwright acceptance suite green.

## Ground rules — non-negotiable

1. **Do NOT rewrite the CSS into Tailwind, CSS-in-JS, or "cleaner" styles.** Lift the prototype's `<style>` block ~verbatim into `app/galas/gala.css`. Only mechanical edits allowed: base64 → `/galas/...` asset URLs, font-face handled by next/font.
2. **Do NOT improve copy, spacing, colors, sizes, or timings.** Prices are commercial commitments: **Row A from $9,500 · Row B $6,500 · Row C $4,500.** Phone: **(949) 236-7573**.
3. **Preserve every behavior**: reduced-motion map, chain-replaces-SVG at ≤880px, ticker hover-pause, draw-on-scroll **fail-safes** (1.4s force-finish + 5s no-trigger fallback), FTB blink, LCD strings, diagram tally sync (`fd-cam1/fd-cam2/fd-pb`), sticky bar mount/unmount, `#book` scroll-margin (72px), 16px inputs.
4. **Legal red lines:** Artist names (Brandi Carlile, 311, Shinedown, Def Leppard, etc.) are **NOT cleared — never add them anywhere**, including alt text and meta. The seven company logos in `assets/logos/` are cleared exactly as shipped. Do not add other logos.
5. **Carry these TODOs as code comments, do not resolve them:**
   - Crew frame photo swap points (`background:url(...)` slots on `.crew-frame`)
   - Hero/PGM muted motion-loop slot (rights-gated; structure only)
   - `NEXT_PUBLIC_CAL_URL` for "OR BOOK A 15-MIN CALL" (keep `#` until env set)

## Repo / structure

- If a `frontrowoc` Next.js repo exists, add the route to it. If not: `npx create-next-app@latest frontrowoc --ts --app --eslint` (**no Tailwind**).
- Target layout:

```
app/galas/page.tsx          — server component; metadata; composes sections
app/galas/gala.css          — the prototype CSS, lifted (route-scoped import)
app/api/hold/route.ts       — form endpoint
components/gala/ControlRoom.tsx   — multiviewer + control surface (client)
components/gala/SignalFlow.tsx    — desktop SVG + draw effect + chain markup (client)
components/gala/CreditsTicker.tsx — ticker + runtime set clone (client)
components/gala/StickyBar.tsx     — post-hero mount (client)
components/gala/HoldForm.tsx      — form + states (client)
components/gala/Hero.tsx          — wipe-in, timecode (client)
lib/gala/switcher.ts        — pure switcher state machine (pgm/pvw/ftb/trans)
public/galas/               — cam1.jpg cam2.jpg pb.jpg, logos/*, og.png
tests/gala.spec.ts          — provided; adapt only baseURL
```

- **Port strategy for interactivity:** the prototype's vanilla controllers are correct and QA-passed. Either (a) re-implement as React state in `switcher.ts` + components, or (b) drive identical DOM via refs/effects. Choice is yours; **behavior parity per the acceptance suite is the requirement**, including: tap-to-cut flip-flop, PGM/PVW key lighting (`lit-r`/`lit-w`), CUT/AUTO/MIX/WIPE, T-bar manual transition with spring-back (Pointer Events, `touch-action:none` on track), FTB veil + blinking LCD suffix, clock + 25fps timecode, diagram source tallies following program.

## Fonts — critical detail

Display depends on **Archivo's variable width axis** (`font-stretch:125%`). Use `next/font/google`:

```ts
const archivo = Archivo({ subsets:['latin'], axes:['wdth'], display:'swap' });
const plexMono = IBM_Plex_Mono({ subsets:['latin'], weight:['500'], display:'swap' });
```

**Acceptance check D verifies `getComputedStyle(h1).fontStretch === '125%'`.** If the axis isn't loading, the entire display voice collapses to normal-width Archivo — treat as a build failure.

## Assets

- Use files from `assets/` → `public/galas/`. Replace every inline base64 reference.
- Scene JPEGs: re-encode to ~70% quality, max 1280w (`cam1/cam2/pb`), `loading="lazy"` `decoding="async"` with explicit width/height (they're below the fold).
- Logos: serve as-is, `loading="lazy"`, keep the existing alt text and `--lh` inline heights.
- Hero is pure CSS (gradients + grain) — no raster, keep it that way. LCP should be the H1 text.
- `app/icon.svg` from `assets/favicon.svg`. OG: `public/galas/og.png` (1200×630, provided).

## Form / API

`POST /api/hold` accepts `{name, org, email, phone, date, venue, company}`:
- `company` is a **honeypot** (hidden field you add to the form, `autocomplete="off"`, visually hidden) — if non-empty, return 200 and drop silently.
- Validate: name+date required, email shape if present. Reject >2KB bodies.
- Forward JSON (+ `page:'galas'`, ISO timestamp, UA) to `process.env.HOLD_WEBHOOK_URL` with a 5s timeout. 200 on success; 502 with friendly message on failure.
- Client states: submitting (button label `HOLDING…`), success (replace form with mono confirmation block: `WE'VE GOT IT — EXPECT A REPLY WITHIN 2 HOURS` + the phone link), error (inline mono error line, form intact, phone link emphasized). Match the design system: mono labels, paper button, no new colors.
- Create `APPS-SCRIPT.md` in the repo root containing a copy-paste Google Apps Script web app (`doPost` → `MailApp.sendEmail` to `hello@frontrowoc.com` with all fields + `SpreadsheetApp` append) and 5-step deploy instructions, so the founder can mint `HOLD_WEBHOOK_URL` in ~10 minutes.

## SEO / meta / analytics

- `metadata`: title `Cinematic Broadcast for Galas & Fundraisers | Front Row Broadcast — Orange County`; description: reuse the prototype's `<meta name="description">` verbatim; canonical `https://frontrowoc.com/galas`; OG/Twitter card with `/galas/og.png`.
- JSON-LD `LocalBusiness`: name Front Row Broadcast, `parentOrganization` MixOne Cinema, `areaServed` Orange County CA, `telephone` +1-949-236-7573, `url`, `priceRange` `$4,500-$9,500+`.
- `@vercel/analytics` + custom events: `hold_submit`, `hold_success`, `tel_click` (label by placement: hero/sticky/rates/footer), `sticky_cta_click`, `cal_click`.

## Acceptance criteria — all required before "done"

**A.** `tests/gala.spec.ts` — all tests green at 390×844 (provided; it encodes the 19-point QA the prototype passed).
**B.** Visual parity: capture 390 / 744 / 1280 screenshots of the route and diff against the prototype rendered at the same widths — no layout deltas beyond font antialiasing.
**C.** Lighthouse (mobile, Vercel preview): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, LCP < 2.0s.
**D.** `fontStretch === '125%'` on the H1 (width axis loaded).
**E.** `prefers-reduced-motion: reduce`: ticker static + centered + single set, no wire draw, no blink animations, instant anchor scroll.
**F.** Form: happy path POSTs to a mocked webhook; honeypot path returns 200 and forwards nothing.

## Execution phases (report at each gate)

1. **Static port** — route renders pixel-true with assets, fonts, zero interactivity. Gate: B at 1280.
2. **Interactivity parity** — controller, ticker, sticky, draw, smooth scroll. Gate: A green locally.
3. **Form + API + meta + analytics.** Gate: F + meta inspection.
4. **Hardening** — Lighthouse loop, RM audit. Gate: C, D, E.
5. **Deploy** — Vercel preview; output: preview URL, test summary, Lighthouse JSON, any deviations ledger (should be empty).

## Environment

```
HOLD_WEBHOOK_URL=        # Apps Script web app URL (see APPS-SCRIPT.md)
NEXT_PUBLIC_CAL_URL=     # optional; when empty, call link stays href="#"
```

Begin with Phase 1. Ask zero design questions — the prototype answers them.
