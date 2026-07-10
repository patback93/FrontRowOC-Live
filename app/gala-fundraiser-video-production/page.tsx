import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageMetadata, ServiceJsonLd, footerNavPages } from "@/lib/seo";
import "./gala-lp.css";
import GfNav from "@/components/gf/GfNav";
import GfMobileCta from "@/components/gf/GfMobileCta";
import GfLockup from "@/components/gf/GfLockup";
import GfAvailability from "@/components/gf/GfAvailability";

// Gala & Fundraiser Video Production — standalone vertical landing
// page, ported from the Claude Design bundle export and structurally
// cloned from the corporate page so both verticals share one
// responsive system. Linked from the homepage What-We-Do row
// ("Explore Gala Page").

export const metadata: Metadata = pageMetadata("gala");

// Talk-path CTAs (hero ghost, mid-strip, "Grab 15 minutes") route to the
// calendar once NEXT_PUBLIC_CAL_URL is set on Vercel; until then they fall
// back so nothing dead-ends (form for the strip/ghost, email for Grab-15).
const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL || "";
const TALK_HREF = CAL_URL || "#check-availability";

const PROGRAM_NIGHT = [
  "Room + remote audience",
  "Speaker / honoree moments",
  "Audio + playback",
  "Full-program record",
  "Donor / sponsor deliverables",
];

const LOGOS: Array<{ file: string; alt: string; max: number; h: number; maxM: number; hM: number; iw: number; ih: number }> = [
  { file: "livenation", alt: "Live Nation logo", max: 148, h: 32, maxM: 136, hM: 28, iw: 266, ih: 60 },
  { file: "veeps", alt: "Veeps logo", max: 132, h: 30, maxM: 122, hM: 27, iw: 239, ih: 52 },
  { file: "atlantic", alt: "Atlantic Records logo", max: 44, h: 38, maxM: 40, hM: 34, iw: 68, ih: 68 },
  { file: "warner", alt: "Warner Music Group logo", max: 112, h: 34, maxM: 102, hM: 31, iw: 152, ih: 60 },
  { file: "mddn", alt: "MDDN logo", max: 76, h: 36, maxM: 68, hM: 32, iw: 133, ih: 64 },
  { file: "iheartradio", alt: "iHeartRadio logo", max: 116, h: 34, maxM: 106, hM: 31, iw: 192, ih: 60 },
  { file: "blizzard", alt: "Blizzard Entertainment logo", max: 86, h: 36, maxM: 78, hM: 32, iw: 112, ih: 52 },
];

const USE_CASES = [
  "Annual Galas",
  "Benefit Concerts",
  "Honoree Programs",
  "Fundraising Dinners",
  "Donor Events",
  "Auctions / Fund-a-Need",
  "Hybrid Fundraisers",
  "Award Programs",
];

const PHASES = [
  {
    kicker: "Phase 01 — Before the Event",
    title: "We map the video plan before load-in.",
    copy: "We confirm the venue, run of show, donor moments, camera positions, audio/playback sources, stream needs, and final deliverables before the event starts.",
    items: [
      "Camera Plot",
      "Program Moments",
      "Audio / Playback Coordination",
      "Stream + Record Path",
      "Crew / Comms",
      "Final Delivery Path",
    ],
  },
  {
    kicker: "Phase 02 — Program Night / Show Day",
    title: "A calm video department plugs in.",
    copy: "Director-led coverage, clean records, speaker and honoree coverage, livestream awareness, and production communication without adding chaos to the room.",
    items: ["Director-Led Live Cut", "Speaker / Honoree Coverage", "Program Records"],
    featured: true,
  },
  {
    kicker: "Phase 03 — After the Event",
    title: "The final assets are already defined.",
    copy: "Recap films, donor-facing edits, sponsor deliverables, social cutdowns, internal versions, and archive records follow the plan agreed before show day.",
    items: ["Recap Film", "Donor / Sponsor Assets", "Social Clips", "Archive Record"],
  },
];

const ENGAGEMENTS = [
  {
    kicker: "01 / PROGRAM CAPTURE",
    title: "Program Capture",
    copy: "For galas, dinners, award programs, and honoree moments that need clean multicamera coverage, audio coordination, and a reliable archive record.",
    meta: "Capture / Records / Archive",
  },
  {
    kicker: "02 / GALA BROADCAST",
    title: "Gala Broadcast",
    copy: "For events with remote donors, livestream requirements, executive visibility, benefit performances, or a higher-touch show flow that needs director-led switching and monitoring.",
    meta: "Room / Stream / Records",
  },
  {
    kicker: "03 / BROADCAST + DONOR CONTENT",
    title: "Broadcast + Donor Content",
    copy: "For teams that want the event captured live and turned into recap films, donor updates, sponsor edits, honoree clips, or social cutdowns afterward.",
    meta: "Recap / Donor Assets / Social",
  },
];

const NEXT = [
  { name: "Availability", desc: "We confirm whether the date is open." },
  { name: "Approach", desc: "We recommend the right capture, stream, and delivery path." },
  { name: "Hold", desc: "We can place a soft hold while scope and approvals come together." },
];

function Slate({ idx, name, sub }: { idx: string; name: string; sub: string }) {
  return (
    <div className="gf-slate">
      <span className="gf-slate-bar" />
      <span className="gf-slate-idx">{idx}</span>
      <span className="gf-slate-body">
        <span className="gf-slate-name">{name}</span>
        <span className="gf-slate-sub">{sub}</span>
      </span>
    </div>
  );
}

export default function GalaFundraiserPage() {
  return (
    <div className="gf">
      <ServiceJsonLd page="gala" />
      <GfNav />
      <GfMobileCta />

      <header className="gf-hero" id="top">
        <div className="gf-hero-grid-bg" aria-hidden="true" />
        <div className="gf-hero-sprockets" aria-hidden="true" />
        <div className="gf-hero-grid">
          <div className="gf-hero-copy">
            <div className="gf-eyebrow">
              <span className="gf-eyebrow-rule" />
              <span>Gala &amp; Fundraiser Video Production / Orange County + Southern California</span>
            </div>
            <h1 className="gf-h1">
              Gala &amp; Fundraiser Video Production<span className="gf-dot">.</span>
            </h1>
            <div className="gf-positioning">Built for the room, the donors, and the follow-up.</div>
            <p className="gf-hero-sub">
              Multicamera coverage, livestream support, a clean recording of the full program,
              and post-event content for galas, benefit programs, donor events, honoree moments,
              and fundraising nights across Orange County and Southern California.
            </p>
            <div className="gf-hero-ctas">
              <a href="#check-availability" className="gf-cta-solid">
                Check Your Date
              </a>
              <a href={TALK_HREF} className="gf-cta-ghost">
                Talk Through the Video Plan
              </a>
            </div>
          </div>

          <aside className="gf-panel" aria-label="Program night considerations">
            <div className="gf-panel-head">
              <span className="gf-panel-dot" aria-hidden="true" />
              Program Night
            </div>
            <ul>
              {PROGRAM_NIGHT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="gf-panel-foot">
              A calm video department for the room, the program, and the follow-up.
            </div>
          </aside>
        </div>
      </header>

      <div className="gf-proof" aria-label="Live-event proof">
        <div className="gf-proof-intro">
          <div className="gf-proof-kicker">Live-event proof</div>
          <div className="gf-proof-line">
            Built from live environments where timing, signal flow, crew communication, and
            delivery have to work the first time.
          </div>
          <Link className="gf-proof-link" href="/#selected-work">
            View selected work <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="gf-proof-logos" aria-label="Relevant live-event client and platform logos">
          {LOGOS.map((l) => (
            <span
              key={l.file}
              className="gf-proof-logo"
              style={
                {
                  "--logo-max": `${l.max}px`,
                  "--logo-h": `${l.h}px`,
                  "--logo-max-m": `${l.maxM}px`,
                  "--logo-h-m": `${l.hM}px`,
                } as React.CSSProperties
              }
            >
              <Image
                src={`/home/logos/${l.file}.png`}
                alt={l.alt}
                width={l.iw}
                height={l.ih}
              />
            </span>
          ))}
        </div>
      </div>

      <main>
        <section id="what-we-cover" className="gf-who">
          <Slate idx="01" name="Who it&rsquo;s for" sub="Gala & fundraiser use cases" />
          <h2 className="gf-h2">
            Designed for donor rooms, honoree moments, and one-night programs
            <span className="gf-dot">.</span>
          </h2>
          <p className="gf-copy">
            Built for nonprofits, foundations, schools, hospitals, arts organizations, event
            producers, and development teams who need the room covered cleanly, remote viewers
            included when needed, and donor-facing assets delivered after the event.
          </p>
          <div className="gf-chips-label">Common rooms we support</div>
          <div className="gf-chips" aria-label="Gala and fundraiser use cases">
            {USE_CASES.map((c) => (
              <div key={c} className="gf-chip">
                <span className="gf-chip-dot" aria-hidden="true" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="video-plan" className="gf-plan">
          <Slate idx="02" name="Video plan" sub="Before, show day, after" />
          <h2 className="gf-h2">
            Before doors open, the picture is already built<span className="gf-dot">.</span>
          </h2>
          <div className="gf-cards3">
            {PHASES.map((p) => (
              <article key={p.kicker} className={`gf-phase${p.featured ? " gf-feature" : ""}`}>
                <div className="gf-phase-kicker">{p.kicker}</div>
                <h3>{p.title}</h3>
                <p>{p.copy}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="gf-strip" aria-label="Talk through the video plan">
          <div className="gf-strip-inner">
            <div>
              <h2>Have a gala coming up?</h2>
              <p>
                Send the date, venue, and rough program — we&rsquo;ll tell you what kind of
                coverage makes sense.
              </p>
            </div>
            <a href={TALK_HREF} className="gf-strip-cta">
              Talk Through the Video Plan
            </a>
          </div>
        </section>

        <section id="engagement-types" className="gf-eng">
          <Slate idx="03" name="Engagement types" sub="Scaled to the night" />
          <h2 className="gf-h2">
            A video department scaled to the night<span className="gf-dot">.</span>
          </h2>
          <p className="gf-copy">Most fundraising events fall into one of three production shapes.</p>
          <div className="gf-cards3">
            {ENGAGEMENTS.map((e) => (
              <article key={e.title} className="gf-eng-card">
                <div className="gf-eng-kicker">{e.kicker}</div>
                <h3>{e.title}</h3>
                <p>{e.copy}</p>
                <div className="gf-eng-meta">{e.meta}</div>
              </article>
            ))}
          </div>
          <p className="gf-xlink">
            Producing a corporate program instead?{" "}
            <Link href="/corporate-event-video-production-orange-county">corporate event video production</Link>{" "}
            <span aria-hidden="true">→</span>
          </p>
      </section>

        <section id="check-availability" className="gf-avail">
          <Slate idx="04" name="Check availability" sub="Dates, availability, and holds" />
          <h2 className="gf-av-title">
            <span className="gf-av-1">Is your date</span>
            <span className="gf-av-2">
              open<span className="gf-dot">?</span>
            </span>
          </h2>
          <div className="gf-av-intro">
            Send the date and rough event details. We&rsquo;ll let you know if we&rsquo;re open
            and what kind of production path makes sense.
          </div>
          <div className="gf-next">
            <div className="gf-next-label">What happens next</div>
            <div className="gf-next-grid">
              {NEXT.map((step, i) => (
                <div key={step.name} className="gf-next-step">
                  <span className="gf-next-idx">{`0${i + 1}`}</span>
                  <span className="gf-next-name">{step.name}</span>
                  <span className="gf-next-desc">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <GfAvailability />
        </section>
      </main>

      <footer className="gf-footer">
        <div className="gf-footer-left">
          <Link href="/" className="gf-footer-home" aria-label="Front Row Broadcast home">
            <GfLockup tile={44} word={28} />
          </Link>
          <div className="gf-socials">
            <a href="#" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H5.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.2" />
                <circle cx="12" cy="12" r="4.3" />
                <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.49 2.49 0 1 1-4.98 0 2.49 2.49 0 0 1 4.98 0zM.2 8.31h4.57V22.5H.2V8.31zm7.58 0h4.38v1.94h.06c.61-1.16 2.1-2.38 4.33-2.38 4.63 0 5.48 3.05 5.48 7.02v7.61h-4.56v-6.75c0-1.61-.03-3.68-2.24-3.68-2.25 0-2.59 1.75-2.59 3.56v6.87H7.78V8.31z" />
              </svg>
            </a>
          </div>
          <div className="gf-footer-copy">
            Cinematic multicam production for live events, broadcasts, and films.
          </div>
          <div className="gf-footer-meta">Orange County, CA — © 2026 Mixone Cinema</div>
        </div>
        <nav className="gf-footer-links" aria-label="Footer">
          <span>Quick links</span>
          <a href="#what-we-cover">Use cases</a>
          <a href="#video-plan">Plan</a>
          <a href="#engagement-types">Engagements</a>
          <a href="#check-availability">Availability</a>
          <Link href="/#selected-work">
            View selected work <span aria-hidden="true">→</span>
          </Link>
          <span className="gf-fl-gap">Pages</span>
          {footerNavPages().map((p) => (
            <Link key={p.href} href={p.href}>
              {p.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
