import Image from "next/image";

// intrinsic PNG dimensions (probed) — next/image needs both; CSS still
// scales rendered height via --h
const LOGOS: Array<{ file: string; alt: string; h: number; iw: number; ih: number }> = [
  { file: "livenation", alt: "Live Nation logo", h: 26, iw: 266, ih: 60 },
  { file: "veeps", alt: "Veeps logo", h: 24, iw: 239, ih: 52 },
  { file: "atlantic", alt: "Atlantic Records logo", h: 36, iw: 68, ih: 68 },
  { file: "warner", alt: "Warner Music Group logo", h: 30, iw: 152, ih: 60 },
  { file: "mddn", alt: "MDDN logo", h: 26, iw: 133, ih: 64 },
  { file: "iheartradio", alt: "iHeartRadio logo", h: 30, iw: 192, ih: 60 },
  { file: "blizzard", alt: "Blizzard Entertainment logo", h: 26, iw: 112, ih: 52 },
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
          <Image
            key={l.file}
            src={`/home/logos/${l.file}.png`}
            alt={l.alt}
            width={l.iw}
            height={l.ih}
            className="hm-credit-logo"
            style={{ "--h": `${l.h}px` } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
