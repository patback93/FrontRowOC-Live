/* eslint-disable @next/next/no-img-element -- small wordmark PNGs at
   fixed heights; next/image adds nothing here */
const LOGOS: Array<{ file: string; alt: string; h: number }> = [
  { file: "livenation", alt: "Live Nation", h: 26 },
  { file: "veeps", alt: "Veeps", h: 24 },
  { file: "atlantic", alt: "Atlantic Records", h: 36 },
  { file: "warner", alt: "Warner Music Group", h: 30 },
  { file: "mddn", alt: "MDDN", h: 26 },
  { file: "iheartradio", alt: "iHeartRadio", h: 30 },
  { file: "blizzard", alt: "Blizzard Entertainment", h: 26 },
];

// Logo bar — LIVE-EVENT DISCIPLINE eyebrow + positioning caption (the
// salvaged Who-We-Are paragraph) on the left, the seven partner
// wordmarks across the right, on the deeper ink plate.
export default function CreditBanner() {
  return (
    <section className="hm-credits" aria-label="Live-event discipline">
      <div className="hm-credits-intro">
        <div className="hm-credits-kicker">Live-event discipline</div>
        <p className="hm-credits-line">
          Built from live environments where the video department cannot miss. We build
          cinematic coverage systems for events that only happen once — pairing cinema cameras,
          live switching, comms, records, and delivery into one calm show-day workflow.
        </p>
      </div>
      <div className="hm-credits-logos">
        {LOGOS.map((l) => (
          <img
            key={l.file}
            src={`/home/logos/${l.file}.png`}
            alt={l.alt}
            className="hm-credit-logo"
            style={{ "--h": `${l.h}px` } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
