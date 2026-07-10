import Link from "next/link";
import Slate from "./Slate";
import { PLAN_PHASES } from "./data";

// 03 Video plan — the compact process assertion that replaces the old
// full "system behind the picture" block. Headline + three one-line
// phase entries (before / show day / after). No cards, no sub-bullets.
export default function HomePlan() {
  return (
    <section className="hm-plan" id="plan">
      <div className="hm-section-head">
        <Slate idx="03" name="Video plan" sub="Mapped, run, and delivered" />
      </div>
      <h2 className="hm-plan-title">
        Before doors open, the picture is already built<span className="hm-dot">.</span>
      </h2>
      <div className="hm-plan-list">
        {PLAN_PHASES.map((p) => (
          <div key={p.idx} className="hm-plan-row">
            <span className="hm-plan-phase">
              <span className="hm-plan-phase-rule" aria-hidden="true" />
              {`Phase ${p.idx} — ${p.label}`}
            </span>
            <span className="hm-plan-copy">{p.copy}</span>
          </div>
        ))}
      </div>
      <Link className="hm-plan-link" href="/corporate-event-video-production-orange-county">
        See how the video plan works <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
