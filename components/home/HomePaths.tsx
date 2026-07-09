// Buyer paths — the segmented CTA band directly under the hero. Three
// self-select routes (corporate / gala / partner) under the "cannot
// miss" statement, with the four coverage promises (room / stream /
// archive / follow-up) as the supporting row. Pure server markup; the
// generic "Check availability" flow (#book) stays untouched everywhere
// else on the page.
//
// TODO(routes): the three destination pages do not exist yet — create
//   app/corporate-event-video-production-orange-county/page.tsx
//   app/gala-fundraiser-video-production/page.tsx
//   app/event-agency-video-production-partner/page.tsx
// Until then these links resolve to the app's 404 page.
const PATHS = [
  {
    title: "Corporate & Brand Events",
    href: "/corporate-event-video-production-orange-county",
    copy: "Conferences, launches, town halls, brand events, livestreams, and post-event content built from a broadcast-tested live-event workflow.",
  },
  {
    title: "Galas & Fundraisers",
    href: "/gala-fundraiser-video-production",
    copy: "Program capture, donor-facing recaps, remote-viewer support, sponsor deliverables, and archive records for high-stakes fundraising events.",
  },
  {
    title: "Agency / AV Partnerships",
    href: "/event-agency-video-production-partner",
    copy: "A senior video department for agencies, AV teams, venues, and producers who need camera systems, live cuts, records, and stream support handled.",
  },
];

const COVERS = [
  {
    label: "For the room",
    copy: "IMAG, confidence monitoring, director-led coverage, and a camera plot built around the audience experience.",
  },
  {
    label: "For the stream",
    copy: "Clean program feed, audio paths, platform-ready output, monitoring, and fallback thinking.",
  },
  {
    label: "For the archive",
    copy: "Program records, ISO records, redundant captures, and post-ready deliverables.",
  },
  {
    label: "For the follow-up",
    copy: "Recap films, social clips, sponsor/donor assets, internal versions, and release-ready edits.",
  },
];

export default function HomePaths() {
  return (
    <section className="hm-paths" id="paths" aria-labelledby="paths-title">
      <h2 className="hm-paths-title" id="paths-title">
        Built for events where the video department cannot miss<span className="hm-dot">.</span>
      </h2>
      <div className="hm-paths-grid">
        {PATHS.map((p, i) => (
          <a key={p.href} href={p.href} className="hm-path-card">
            <span className="hm-path-idx" aria-hidden="true">{`0${i + 1}`}</span>
            <span className="hm-path-name">{p.title}</span>
            <span className="hm-path-copy">{p.copy}</span>
            <span className="hm-path-go" aria-hidden="true">
              <span className="hm-path-go-rule" />
              Explore
            </span>
          </a>
        ))}
      </div>
      <div className="hm-covers">
        {COVERS.map((c) => (
          <div key={c.label} className="hm-cover">
            <div className="hm-cover-label">{c.label}</div>
            <div className="hm-cover-copy">{c.copy}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
