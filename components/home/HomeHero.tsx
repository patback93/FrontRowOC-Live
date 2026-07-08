// Full-bleed 16:9 reel slot. The multicam program-cut loop is
// rights-gated (see competitive doc §4 "PGM cut as hero") — until the
// footage lands this renders the designed placeholder state:
// dark scene gradient, viewfinder corner brackets, play bug, mono legend.
// To go live with footage, drop a <video autoPlay muted loop playsInline>
// (or a poster <img>) inside .hm-reel-slot.
export default function HomeHero() {
  return (
    <section className="hm-hero" id="top">
      <div className="hm-reel-slot" data-empty="true" />
      <div className="hm-hero-chrome" aria-hidden="true">
        <span className="hm-vf hm-tl" />
        <span className="hm-vf hm-tr" />
        <span className="hm-vf hm-bl" />
        <span className="hm-vf hm-br" />
        <div className="hm-hero-play">
          <svg viewBox="0 0 30 34" aria-hidden="true">
            <path d="M0 0 L30 17 L0 34 Z" fill="#F6F3EC" />
          </svg>
        </div>
        <div className="hm-hero-legend">Reel — multicam program cut — 16:9</div>
      </div>
    </section>
  );
}
