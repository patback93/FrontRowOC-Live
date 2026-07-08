import type { Metadata } from "next";
import "./gala.css";
import StickyBar from "@/components/gala/StickyBar";
import Hero from "@/components/gala/Hero";
import CreditsTicker from "@/components/gala/CreditsTicker";
import ControlRoom from "@/components/gala/ControlRoom";
import SignalFlow from "@/components/gala/SignalFlow";
import HoldForm from "@/components/gala/HoldForm";
import TelLink from "@/components/gala/TelLink";

export const metadata: Metadata = {
  title:
    "Cinematic Broadcast for Galas & Fundraisers | Front Row Broadcast — Orange County",
  description:
    "Cinematic broadcast for Orange County galas and fundraisers — live cameras to your ballroom screens during the ask, and a 90-second recap film after.",
  alternates: { canonical: "https://www.frontrowoc.com/galas" },
  openGraph: {
    title:
      "Cinematic Broadcast for Galas & Fundraisers | Front Row Broadcast — Orange County",
    description:
      "Cinematic broadcast for Orange County galas and fundraisers — live cameras to your ballroom screens during the ask, and a 90-second recap film after.",
    url: "https://www.frontrowoc.com/galas",
    siteName: "Front Row Broadcast",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/galas/og.png",
        width: 1200,
        height: 630,
        alt: "Front Row Broadcast — cinematic broadcast for galas & fundraisers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Cinematic Broadcast for Galas & Fundraisers | Front Row Broadcast — Orange County",
    description:
      "Cinematic broadcast for Orange County galas and fundraisers — live cameras to your ballroom screens during the ask, and a 90-second recap film after.",
    images: ["/galas/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Front Row Broadcast",
  url: "https://www.frontrowoc.com/galas",
  telephone: "+1-949-236-7573",
  email: "hello@frontrowoc.com",
  priceRange: "$4,500-$9,500+",
  image: "https://www.frontrowoc.com/galas/og.png",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Orange County, CA",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "MixOne Cinema",
  },
};

export default function GalasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StickyBar />

      {/* HERO — a paused program feed with a super on it */}
      <Hero />

      {/* CREDITS */}
      <CreditsTicker />

      {/* MULTIVIEWER */}
      <section>
        <div className="row">
          <div className="rail">
            <div className="r1">The control room.</div>
            <div className="r2">01 · MULTIVIEW + M/E 1</div>
            <div className="r3">
              The engineer&apos;s view, live. Tap a camera in the wall — or run
              the desk under it. Program is what&apos;s on your ballroom
              screens; preview is what&apos;s cued next.
            </div>
          </div>
          <ControlRoom />
        </div>
      </section>

      {/* SIGNAL FLOW */}
      <section>
        <div className="row">
          <div className="rail">
            <div className="r1">Built for ballrooms.</div>
            <div className="r2">02 · SIGNAL FLOW · ROW C BASE PACKAGE</div>
          </div>
          <div className="flow-field">
            <p className="flow-intro">
              Everything a broadcast truck does — scaled to two cameras,
              tribute playback, a vision switcher, and one engineer-in-charge.
              In and out of your venue in a single night.
            </p>

            <SignalFlow />

            <div className="beats">
              <div className="beat">
                <div className="b-num">01</div>
                <div className="b-t">Hold your date</div>
                <div className="b-b">
                  A 15-minute call, a same-day proposal, and a free five-day
                  hold.
                </div>
              </div>
              <div className="beat">
                <div className="b-num">02</div>
                <div className="b-t">We plug into your venue</div>
                <div className="b-b">
                  AV handoff, run-of-show with your auctioneer, COI before
                  load-in.
                </div>
              </div>
              <div className="beat">
                <div className="b-num">03</div>
                <div className="b-t">Cameras make the ask</div>
                <div className="b-b">
                  Live close-ups on the screens at the paddle raise. Recap film
                  in two weeks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY A BROADCAST CREW */}
      <section>
        <div className="row">
          <div className="rail">
            <div className="r1">Why a broadcast crew.</div>
            <div className="r2">03 · WHAT HOUSE AV CAN&apos;T DO</div>
          </div>
          <div>
            <div className="d-head">
              Hotel AV runs the screens. We give them something to show.
            </div>
            <p className="d-body">
              Your venue&apos;s AV team handles projection and sound — we work
              alongside them, not against them. A volunteer can record the
              night. Neither can put a live close-up of your honoree, or your
              donors&apos; raised paddles, on the screens at the exact moment
              your auctioneer makes the ask. That&apos;s a broadcast job, and
              it&apos;s the only kind we do.
            </p>
            <div className="crew">
              {/* TODO photo swap point: add style={{background:'url(/galas/pat.jpg) center/cover'}} when the working shot is graded */}
              <div className="crew-frame">
                <div className="c-lt">
                  <div className="c-bar"></div>
                  <div className="c-plate">
                    <div className="c-name">Patrick Koch</div>
                    <div className="c-role">Engineer-in-Charge · Director</div>
                  </div>
                </div>
              </div>
              {/* TODO photo swap point: add style={{background:'url(/galas/kevin.jpg) center/cover'}} when the working shot is graded */}
              <div className="crew-frame">
                <div className="c-lt">
                  <div className="c-bar"></div>
                  <div className="c-plate">
                    <div className="c-name">Kevin Garcia</div>
                    <div className="c-role">
                      Executive Producer · Owner, MixOne Cinema
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RATE CARD */}
      <section className="rates">
        <div className="row">
          <div className="rail">
            <div className="r1">Pick your row.</div>
            <div className="r2">04 · RATE CARD · FALL 2026</div>
            <div className="r3">
              The closer the row, the more we bring — cameras, outputs,
              coverage.
            </div>
          </div>
          <div>
            <div className="rate">
              <div className="rate-row">
                <div>
                  <div className="rr-row">ROW A</div>
                  <div className="rr-name">BROADCAST NIGHT</div>
                </div>
                <div className="rr-inc">
                  Full multicam broadcast with remote-donor livestream, a
                  lower-third graphics package, and coverage from doors open to
                  the last toast.
                </div>
                <div className="rr-price">
                  <span className="rr-from">FROM</span>$9,500
                </div>
              </div>
              <div className="rate-row rate-hot">
                <div>
                  <div className="rr-row">ROW B</div>
                  <div className="rr-name">FULL PROGRAM</div>
                  <div>
                    <span className="rr-tag">
                      <span className="tdot"></span>RECOMMENDED
                    </span>
                  </div>
                </div>
                <div className="rr-inc">
                  Two operated cinema cameras plus a desk-driven remote head,
                  tribute and honoree playback, full-evening coverage, and the
                  recap film.
                </div>
                <div className="rr-price">$6,500</div>
              </div>
              <div className="rate-row">
                <div>
                  <div className="rr-row">ROW C</div>
                  <div className="rr-name">PADDLE RAISE PACKAGE</div>
                </div>
                <div className="rr-inc">
                  An operated cinema camera and a desk-driven remote head,
                  live-switched to your venue screens during the ask and
                  honoree moments, plus the 90-second recap film.
                </div>
                <div className="rr-price">$4,500</div>
              </div>
            </div>
            <div className="rate-fine">
              EVERY ROW INCLUDES: ENGINEER-IN-CHARGE · COI TO YOUR VENUE ·
              LICENSED MUSIC ON THE RECAP · FREE FIVE-DAY DATE HOLD
            </div>
            <div className="rate-cta">
              <a className="btn" href="#book">
                <span className="btn-label">Hold your date</span>
              </a>
              <TelLink placement="rates" className="phone" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="row">
          <div className="rail">
            <div className="r1">Questions.</div>
            <div className="r2">05 · ASKED BEFORE BOOKING</div>
          </div>
          <div className="faq">
            <details>
              <summary>
                <span className="q-i">01</span>
                <span className="q-t">
                  Our hotel has exclusive in-house AV. Can you still work the
                  event?
                </span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                Yes — that&apos;s our standard setup. We bring cameras and the
                switch, hand their system a clean program feed, and coordinate
                directly with their lead so your planner never has to referee.
              </div>
            </details>
            <details>
              <summary>
                <span className="q-i">02</span>
                <span className="q-t">Our budget is already committed.</span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                The recap film is a sponsor-renewal asset, not a cost — one
                renewed table sponsor typically covers the whole package.
                We&apos;ll also show your auctioneer what live screens do to a
                paddle raise.
              </div>
            </details>
            <details>
              <summary>
                <span className="q-i">03</span>
                <span className="q-t">
                  A board member&apos;s son films it every year.
                </span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                Recording the night and feeding the screens live during the ask
                are different jobs. Keep the recording — add the broadcast
                where the money is raised.
              </div>
            </details>
            <details>
              <summary>
                <span className="q-i">04</span>
                <span className="q-t">When should we book?</span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                Fall dates are being held now. A date hold is free for five
                days while your committee decides.
              </div>
            </details>
            <details>
              <summary>
                <span className="q-i">05</span>
                <span className="q-t">What do you need from our venue?</span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                A screen-feed handoff, power, and thirty minutes with the
                banquet captain or AV lead. We handle everything else and
                provide the COI before load-in.
              </div>
            </details>
            <details>
              <summary>
                <span className="q-i">06</span>
                <span className="q-t">
                  Can people who can&apos;t attend watch live?
                </span>
                <span className="q-x">+</span>
              </summary>
              <div className="a">
                Yes — Row A includes a private remote stream, so out-of-town
                donors, overflow rooms, and family who can&apos;t travel watch
                the program in real time. We can also support remote paddle
                raises if your giving platform allows it.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-final" id="book">
        <div className="row">
          <div className="rail">
            <div className="r1">Hold your date.</div>
            <div className="r2">06 · SAME-DAY PROPOSAL</div>
          </div>
          <div>
            <div className="f-lead">
              Tell us the date. We&apos;ll hold it for five days.
            </div>
            <HoldForm />
            <div className="promise">
              WE REPLY WITHIN 2 HOURS, 7 DAYS A WEEK.
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="ftw">
          <span>FRONT ROW BROADCAST — A MIXONE CINEMA COMPANY</span>
          <span>ORANGE COUNTY, CA</span>
          <span>
            <TelLink placement="footer" />
          </span>
          <span>
            <a href="mailto:hello@frontrowoc.com">HELLO@FRONTROWOC.COM</a>
          </span>
          <span>© 2026 MIXONE CINEMA</span>
        </div>
      </footer>
    </>
  );
}
