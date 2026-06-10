# DESIGN.md — Front Row Broadcast
**System: "Tally Red" · V3 — locked June 2026.** Supersedes all amber/v2 documents. Reference build: `prototype/frontrow-v3.html` (QA-passed desktop + mobile).

## 1 · Brand core
Front Row Broadcast (a MixOne Cinema company) sells **CINEMATIC BROADCAST for galas & fundraisers** in Orange County. The page behaves like the product: a broadcast you can touch. Voice = two registers only — **Archivo display** (the show) and **IBM Plex Mono** (the cue sheet). Everything informational is mono; everything declarative is display.

Positioning lockup (hero): mono kicker `DONORS GIVE MORE WHEN THE ROOM CAN SEE THE MOMENT` above display `CINEMATIC BROADCAST / FOR GALAS & FUNDRAISERS`. Geography lives in the `● LIVE · ORANGE COUNTY` chip, never in the headline.

## 2 · Color
| Token | Value | Role |
|---|---|---|
| Camera Black | `#111013` | base surface |
| Studio White (paper/ink) | `#F6F3EC` | type, plates, button |
| **Tally Red** | `#D93A2B` | **live signals & key numerals only** |
| Cable Grey | `#6E6862` | secondary mono (sparingly) |
| Panel | `#17161B` | raised section surface |
| Raised | `#1C1A20` | component surface (Row B, switcher box) |
| Line | `#28262C` | hairlines on dark |
| Paper line | `#DDD8CE` | hairlines on paper |
| Plate ink | `rgba(10,10,12,.82)` | lower-third plates (blur 4px) |
| Ink-60 / Ink-35 | paper @ .6 / .35 | mono hierarchy |

**Red rationing law:** red marks what is *live* (tally, PGM wire, FTB legend, rundown numerals, FAQ `+`, RECOMMENDED tag) — one accent moment per composition. **Never prices** (red price = sale; ink price = rate). Grain texture: hero + crew frames only, opacity ≤ .07.

## 3 · Type
- **Display:** Archivo variable, **weight 800, width 125%** (`font-stretch:125%` — the width axis is load-bearing; verify it ships), UPPERCASE, letter-spacing −.01em, line-height 1.04. H1 `clamp(27px, 7vw, 76px)` max 24ch.
- **Body:** Archivo 400, 15–17px, ink-60 for paragraphs.
- **Mono:** IBM Plex Mono 500; +.06em body, +.12–.22em labels; 9.5–11.5px. Fine print that must be read (rate fine print, hold note, promise) sits at **ink-60, never ink-35**.

## 4 · Layout & rhythm
1280px row, two columns: rail (sticky intent: `r1` display headline · `r2` mono rundown line · optional `r3` plain-English translation) + field. Sections separated by **1px full-bleed rules only** — no decorative dividers. **Rundown indices** number the sections `01–06` in each `r2`; the hero is the unnumbered cold open. Surface rhythm: money moments on **Panel** (rate card, final CTA); everything else on base. Banned: uniform card grids, three-equal-boxes, glassmorphism, generic scroll-fade-ins.

## 5 · Component canon
- **Wordmark D3** — Archivo line + mono `BROADCAST` + TallyDot at .3em; never re-set. **Monogram** — bordered `FR` tile, radius 3–6px, red dot top-right (favicon + sticky bar).
- **Button** — paper plate label inside viewfinder corner ticks (9px/2px). One primary per view: `Hold your date`.
- **Tag** — mono caps in 1px hairline; red variant (+6px `tdot`) reserved for RECOMMENDED.
- **LowerThird** — 4–5px red bar + ink plate (blur), name display 17px + role mono 9.5px; 300ms wipe. Used by hero super and **Crew Frames** (16:9 neutral-field frames; photo swap = background URL; people are presented as broadcast subjects).
- **Credits Ticker** — full-color cleared logos (heights via `--lh`, mobile ×.8), 55s linear loop, set duplicated at runtime (`aria-hidden` clone), 12% edge fade via mask on an inner wrapper (keeps the rule crisp), **pause on hover**, RM = static centered single set. Cleared: Live Nation, Veeps, Atlantic, Warner (white variant), MDDN, iHeartRadio, Blizzard. **Artist names are not cleared.**
- **Sticky Bar** — fixed, frosted ink (.92 + blur), Monogram + phone + button; mounts only after the hero exits (IO threshold 0); phone hidden ≤560. `#book{scroll-margin-top:72px}`.
- **Multiviewer** — PVW/PGM double-width windows + source cells + always-live clock cell; tap-to-cut; red tally ring = program, white = preview; top scrim for labels; 25fps timecode.
- **Control Surface** — chassis with corner fasteners + recessed bed; PROGRAM/PREVIEW buses (`lit-r`/`lit-w`), MIX/WIPE/CUT/AUTO/**FTB** (red-tinted legend), T-bar (50px track, ridged 34px handle, `touch-action:none`, spring-back), live **LCD** (`PGM X · PVW Y · MIX` + blinking red ` · FTB`). One shared state machine paints keys, monitor rings, LCD, **and the diagram tallies**.
- **Signal Flow (desktop only)** — 920×380 SVG: port pads, BNC termination dots (red at screens), SDI labels, red PGM path; wires **draw on scroll** (.55s, outputs +.3s). **Fail-safe doctrine:** 1.4s force-finish clears all dash styling; 5s no-trigger fallback; RM skips entirely. Source boxes carry `fd-` tally dots synced to program.
- **Signal Chain (≤880)** — vertical box chain: 3 SOURCES → VISION SWITCHER → red wire → BALLROOM SCREENS (red border + dot) → 2-up RECAP/REMOTE. Replaces the SVG at **880px**, not 640 — the diagram is a desktop set piece.
- **Rate Row** — ruled rows, anchor-first (A→C); `rate-hot` (Row B): Raised surface + 1px outline + wider padding; **only one row may be outlined**. FAQ rows: native `details`, mono index, red rotating `+`.

## 6 · Motion laws
Diegetic only — things move because the broadcast moves: tally blink 2s, LT wipe 300ms, tile cut ≈120ms, wire draw .55s, ticker 55s, FTB veil fade. **No scroll-fade-ins, no parallax, no marquee text.** Every scroll-triggered effect must be wired to force-complete (≤1.4s) and carry a no-trigger fallback. Full `prefers-reduced-motion` map: blinks off, draw off (wires pre-solid), ticker static centered, smooth-scroll off, sticky transition off.

## 7 · Breakpoints
- **≤880:** rail stacks above field; **chain replaces SVG**; desk stacks; rate rows stack (price left); FAQ answers full-width.
- **≤640:** form + crew → 1 column.
- **≤560:** wordmark 26px; chip's `· ORANGE COUNTY` hidden; timecode hidden; MV → 2-col (PVW/PGM full-width); bus keys full-width 44px; LCD hidden; ticker gaps 48px, logos ×.8; sticky phone hidden; crew role 9px.
- Inputs ≥16px always (iOS zoom). Headline floor 27px.

## 8 · Copy & commercial canon (verbatim)
- Rate ladder: **ROW A — BROADCAST NIGHT, from $9,500** (multicam + remote-donor livestream + lower-third graphics, doors to last toast) · **ROW B — FULL PROGRAM, $6,500, RECOMMENDED** (two operated cinema cameras + desk-driven remote head, tribute & honoree playback, full evening, recap) · **ROW C — PADDLE RAISE PACKAGE, $4,500** (operated cinema camera + desk-driven remote head, live-switched during the ask, 90-sec recap).
- Staffing truth: the second camera is a **desk-driven remote head (UE160)** — never claim two operators on Row C. Every row includes the **Engineer-in-Charge**; never use EIC as a tier differentiator.
- Fine print: `EVERY ROW INCLUDES: ENGINEER-IN-CHARGE · COI TO YOUR VENUE · LICENSED MUSIC ON THE RECAP · FREE FIVE-DAY DATE HOLD`. Promise: `WE REPLY WITHIN 2 HOURS, 7 DAYS A WEEK.`
- Crew plates: `PATRICK KOCH — ENGINEER-IN-CHARGE · DIRECTOR` · `KEVIN GARCIA — EXECUTIVE PRODUCER · OWNER, MIXONE CINEMA`.
- FAQ count: 6 (incl. remote viewers → sells Row A). Phone: **(949) 236-7573**. Footer lineage: `FRONT ROW BROADCAST — A MIXONE CINEMA COMPANY`.

## 9 · Implementation notes
Assets: `cam1/cam2/pb.jpg`, `logos/*.png` (cleared, color-corrected for dark bg), `og.png`, `favicon.svg`. Fonts via next/font **with `axes:['wdth']`**. Open TODOs: crew photos (working shots, dark-graded), hero/PGM motion loop (rights-gated — the #1 remaining credibility unlock), `NEXT_PUBLIC_CAL_URL`. Acceptance: `tests/gala.spec.ts` (19 checks) + Lighthouse ≥90/95/95 mobile.
