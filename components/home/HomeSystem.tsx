import { SYSTEM_PHASES, STANDARDS } from "./data";

// 00b — the system behind the picture. Three-phase workflow timeline
// (the "During the show" card runs hot) over the NO-SECOND-TAKE
// standards grid. Desktop: 3-across cards under a horizontal timeline
// with the playhead dot; phones: a vertical timeline and a 2x2 grid.
export default function HomeSystem() {
  return (
    <section className="hm-system" id="system">
      <div className="hm-sys-head">
        <div>
          <div className="hm-sys-kicker">The system behind the picture</div>
          <h2 className="hm-sys-title">
            Before doors open, the picture is already built<span className="hm-dot">.</span>
          </h2>
        </div>
        <p className="hm-sys-intro">
          Every show starts with a camera plot, signal path, record plan, and delivery path — so
          when the room fills, the video department is already aligned.
        </p>
      </div>

      <div className="hm-sys-flow">
        <div className="hm-sys-line" aria-hidden="true" />
        <div className="hm-sys-playhead" aria-hidden="true" />
        <div className="hm-sys-legend" aria-hidden="true">
          <span>Camera plot</span>
          <span>Program</span>
          <span>Records</span>
          <span>Delivery</span>
        </div>
        <div className="hm-sys-cards">
          {SYSTEM_PHASES.map((p) => (
            <div key={p.idx} className={`hm-sys-card${p.hot ? " hm-hot" : ""}`}>
              <span className="hm-sys-node" aria-hidden="true" />
              <div className="hm-sys-card-head">
                <span className="hm-sys-card-idx">
                  {p.idx} / {p.name}
                </span>
                <span className="hm-sys-card-rule" />
              </div>
              <div className="hm-sys-card-body">{p.body}</div>
              <div className="hm-sys-chips">
                {p.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hm-standards">
        <div className="hm-std-head">
          <span className="hm-std-label">NO-SECOND-TAKE STANDARDS</span>
          <span className="hm-std-rule" aria-hidden="true" />
        </div>
        <div className="hm-std-grid">
          {STANDARDS.map((s) => (
            <div key={s.tag} className="hm-std-cell">
              <div className="hm-std-tag-row">
                <span className="hm-std-tag">{s.tag}</span>
                <span className={s.mark === "dot" ? "hm-std-dot" : "hm-std-dash"} aria-hidden="true" />
              </div>
              <div className="hm-std-title">{s.title}</div>
              <div className="hm-std-body">{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
