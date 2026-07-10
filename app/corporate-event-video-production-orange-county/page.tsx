import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageMetadata, ServiceJsonLd, footerNavPages } from "@/lib/seo";
import "./corp.css";
import CorpNav from "@/components/corp/CorpNav";
import CorpMobileCta from "@/components/corp/CorpMobileCta";
import CorpLockup from "@/components/corp/CorpLockup";
import CorpAvailability from "@/components/corp/CorpAvailability";

// Corporate Event Video Production — standalone vertical landing page,
// ported from the Claude Design bundle export. Linked from the
// homepage What-We-Do row ("Explore Corporate & Brand Broadcasts").

export const metadata: Metadata = pageMetadata("corporate");

const INTAKE = [
  "Event date",
  "Venue / city",
  "Audience: room, stream, archive",
  "Camera count",
  "Audio source",
  "Delivery needs",
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
  "Conferences",
  "Town Halls",
  "Executive Programs",
  "Brand Launches",
  "Internal Broadcasts",
  "Hybrid Events",
  "Sales Meetings",
  "Sponsor Events",
];

const PHASES = [
  {
    kicker: "Phase 01 — Before the Event",
    title: "We map the video plan before load-in.",
    copy: "The date, venue, run of show, and deliverables become a plan producers and AV can execute.",
    items: [
      "Camera Plot",
      "Audio Feed Coordination",
      "Stream + Record Path",
      "Crew / Comms Coordination",
      "Final Delivery Path",
    ],
  },
  {
    kicker: "Phase 02 — Show Day",
    title: "A calm video department plugs in.",
    copy: "A director-led crew joins the room, keeps comms clear, and protects the program feed.",
    items: ["Director-Led Live Cut"],
    detail: {
      name: "Program Records",
      note: "Clean recordings of the full show, built for archive, internal review, and post-event edits.",
    },
  },
  {
    kicker: "Phase 03 — After the Event",
    title: "The final assets are already defined.",
    copy: "Records and deliverables follow the agreed path, so the event is not reinvented in post.",
    items: ["Post-Event Deliverables", "Recap / Clips", "Archive Delivery"],
  },
];

const ENGAGEMENTS = [
  {
    kicker: "01 / PROGRAM CAPTURE",
    title: "Program Capture",
    copy: "For keynotes, panels, meetings, and programs that need clean multicamera coverage, audio coordination, and a reliable archive record.",
    meta: "Capture / records / handoff",
  },
  {
    kicker: "02 / CORPORATE BROADCAST",
    title: "Corporate Broadcast",
    copy: "For events with a remote audience, executive visibility, livestream requirements, or a higher-touch show flow that needs director-led switching and monitoring.",
    meta: "Room / stream / archive",
  },
  {
    kicker: "03 / BROADCAST + CONTENT",
    title: "Broadcast + Content",
    copy: "For teams that want the event captured live and turned into recap films, speaker clips, internal edits, sponsor assets, or social cutdowns afterward.",
    meta: "Broadcast / edit / release",
  },
];

const NEXT = [
  { name: "Availability", desc: "We confirm whether the date is open." },
  { name: "Approach", desc: "We recommend the right capture, stream, and delivery path." },
  { name: "Hold", desc: "We can place a soft hold while scope and approvals come together." },
];

function Slate({ idx, name, sub }: { idx: string; name: string; sub: string }) {
  return (
    <div className="cp-slate">
      <span className="cp-slate-bar" />
      <span className="cp-slate-idx">{idx}</span>
      <span className="cp-slate-body">
        <span className="cp-slate-name">{name}</span>
        <span className="cp-slate-sub">{sub}</span>
      </span>
    </div>
  );
}

export default function CorporatePage() {
  return (
    <div className="cp">
      <ServiceJsonLd page="corporate" />
      <CorpNav />
      <CorpMobileCta />

      <header className="cp-hero" id="top">
        <div className="cp-hero-grid-bg" aria-hidden="true" />
        <div className="cp-hero-sprockets" aria-hidden="true" />
        <div className="cp-hero-grid">
          <div className="cp-hero-copy">
            <div className="cp-eyebrow">
              <span className="cp-eyebrow-rule" />
              <span>Corporate Event Video Production / Orange County + Southern California</span>
            </div>
            <h1
              className="cp-h1"
              aria-label="A broadcast-tested video department for corporate events that cannot miss."
            >
              A&nbsp;broadcast-tested <br className="cp-br" />
              video department <br className="cp-br" />
              for corporate events <br className="cp-br" />
              that cannot miss<span className="cp-dot">.</span>
            </h1>
            <p className="cp-hero-sub">
              Multicamera coverage, livestream support, a clean recording of the full program,
              and post-event content for conferences, town halls, launches, executive programs,
              and brand events across Orange County and Southern California.
            </p>
            <div className="cp-hero-ctas">
              <a href="#check-availability" className="cp-cta-solid">
                Check Your Date
              </a>
              <a href="#check-availability" className="cp-cta-ghost">
                Talk Through the Video Plan
              </a>
            </div>
          </div>

          <div className="cp-panel">
            <div className="cp-panel-deco" aria-hidden="true" />
            <div className="cp-panel-box">
              <div className="cp-panel-head">
                <div className="cp-panel-title">First things we confirm</div>
                <div className="cp-panel-rec">
                  <span className="cp-panel-rec-dot" />
                  INTAKE
                </div>
              </div>
              <ul className="cp-intake">
                {INTAKE.map((item, i) => (
                  <li key={item}>
                    <span>{item}</span>
                    <span>{`0${i + 1}`}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="cp-panel-foot">
              <div className="cp-panel-foot-label">Next step</div>
              <div className="cp-panel-foot-copy">
                Send the basics. We&rsquo;ll recommend the right capture, stream, and delivery
                path.
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="cp-proof" aria-label="Live-event discipline">
        <div className="cp-proof-intro">
          <div className="cp-proof-kicker">Live-event discipline</div>
          <div className="cp-proof-line">
            Built from live environments where the video department cannot miss.
          </div>
        </div>
        <div className="cp-proof-logos" aria-label="Relevant live-event client and platform logos">
          {LOGOS.map((l) => (
            <span
              key={l.file}
              className="cp-proof-logo"
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
        <section id="what-we-cover" className="cp-who">
          <Slate idx="01" name="Who it is for" sub="Corporate & brand event use cases" />
          <h2 className="cp-h2">
            Designed for high-stakes rooms and no-second-take events
            <span className="cp-dot">.</span>
          </h2>
          <p className="cp-copy">
            Built for corporate teams, event producers, agencies, and internal communications
            teams who need the room covered cleanly, the stream handled correctly, and the final
            assets delivered without chasing multiple vendors.
          </p>
          <div className="cp-chips" aria-label="Corporate event use cases">
            {USE_CASES.map((c) => (
              <div key={c} className="cp-chip">
                <span className="cp-chip-dot" aria-hidden="true" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="video-plan" className="cp-plan">
          <Slate idx="02" name="Video plan" sub="Before, show day, after" />
          <h2 className="cp-h2">
            Before doors open, the picture is already built<span className="cp-dot">.</span>
          </h2>
          <div className="cp-cards3">
            {PHASES.map((p) => (
              <article key={p.kicker} className="cp-phase">
                <div className="cp-phase-kicker">{p.kicker}</div>
                <h3>{p.title}</h3>
                <p>{p.copy}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                  {p.detail && (
                    <li>
                      <span style={{ display: "block" }}>{p.detail.name}</span>
                      <span className="cp-phase-note">{p.detail.note}</span>
                    </li>
                  )}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="cp-strip" aria-label="Talk through the video plan">
          <div className="cp-strip-inner">
            <div>
              <h2>Have an event coming up?</h2>
              <p>
                Send the date, venue, and rough scope — we&rsquo;ll tell you what kind of video
                plan makes sense.
              </p>
            </div>
            <a href="#check-availability" className="cp-strip-cta">
              Talk Through the Video Plan
            </a>
          </div>
        </section>

        <section id="engagement-types" className="cp-eng">
          <Slate idx="03" name="Engagement types" sub="Broad scopes, scoped to the room" />
          <p className="cp-copy">Most corporate events fall into one of three production shapes.</p>
          <div className="cp-cards3">
            {ENGAGEMENTS.map((e) => (
              <article key={e.title} className="cp-eng-card">
                <div className="cp-eng-kicker">{e.kicker}</div>
                <h3>{e.title}</h3>
                <p>{e.copy}</p>
                <div className="cp-eng-meta">{e.meta}</div>
              </article>
            ))}
          </div>
          <p className="cp-xlink">
            Planning a fundraiser instead?{" "}
            <Link href="/gala-fundraiser-video-production">gala and fundraiser video production</Link>{" "}
            <span aria-hidden="true">→</span>
          </p>
      </section>

        <section id="check-availability" className="cp-avail">
          <Slate idx="04" name="Check availability" sub="Dates, availability, and holds" />
          <h2 className="cp-av-title">
            <span className="cp-av-1">Is your date</span>
            <span className="cp-av-2">
              open<span className="cp-dot">?</span>
            </span>
          </h2>
          <div className="cp-av-intro">
            Send the date and rough event details. We&rsquo;ll let you know if we&rsquo;re open
            and what kind of production path makes sense.
          </div>
          <div className="cp-next">
            <div className="cp-next-label">What happens next</div>
            <div className="cp-next-grid">
              {NEXT.map((step, i) => (
                <div key={step.name} className="cp-next-step">
                  <span className="cp-next-idx">{`0${i + 1}`}</span>
                  <span className="cp-next-name">{step.name}</span>
                  <span className="cp-next-desc">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <CorpAvailability />
        </section>
      </main>

      <footer className="cp-footer">
        <div className="cp-footer-left">
          <Link href="/" className="cp-footer-home" aria-label="Front Row Broadcast home">
            <CorpLockup tile={44} word={28} />
          </Link>
          <div className="cp-socials">
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
          <div className="cp-footer-copy">
            Cinematic multicam production for live events, broadcasts, and films.
          </div>
          <div className="cp-footer-meta">Orange County, CA — © 2026 Mixone Cinema</div>
        </div>
        <nav className="cp-footer-links" aria-label="Footer">
          <span>Quick links</span>
          <a href="#what-we-cover">Use cases</a>
          <a href="#video-plan">Plan</a>
          <a href="#engagement-types">Engagements</a>
          <a href="#check-availability">Availability</a>
          <Link href="/#selected-work">
            View selected work <span aria-hidden="true">→</span>
          </Link>
          <span className="cp-fl-gap">Pages</span>
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
