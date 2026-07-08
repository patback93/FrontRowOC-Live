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

export default function CreditBanner() {
  return (
    <section className="hm-credits" aria-label="Broadcast partners">
      {LOGOS.map((l) => (
        <img
          key={l.file}
          src={`/home/logos/${l.file}.png`}
          alt={l.alt}
          className="hm-credit-logo"
          style={{ "--h": `${l.h}px` } as React.CSSProperties}
        />
      ))}
    </section>
  );
}
