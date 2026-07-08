"use client";

import { useEffect, useRef, useState } from "react";
import Slate from "./Slate";
import { SERVICES } from "./data";

// 01 What we do — the annotated accordion. Poster lines cascade in
// (90ms stagger), each chip's dash draws out and its note types in
// character-by-character with a block cursor (character-generator
// keying in supers), hover sweeps a marker highlight across the title,
// and the open item flips to outlined stroke with a tally-red period.
export default function WhatWeDo() {
  const secRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tick, setTick] = useState(0);
  const [instantNotes, setInstantNotes] = useState(false);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const mobile = window.matchMedia("(max-width: 860px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      setRevealed(true);
      if (mobile || reduceMotion) {
        // no CG typing on mobile / reduced motion — show full notes
        setInstantNotes(true);
        return;
      }
      timer = setInterval(() => {
        setTick((t) => {
          if (t > 72 && timer) {
            clearInterval(timer);
            timer = null;
          }
          return t + 1;
        });
      }, 24);
    };

    let obs: IntersectionObserver | null = null;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      start();
    } else {
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              start();
              obs?.disconnect();
            }
          });
        },
        { threshold: 0.15 },
      );
      obs.observe(sec);
    }
    return () => {
      obs?.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  const noteShown = (note: string, i: number) => {
    if (!revealed) return "";
    if (instantNotes) return note;
    const len = Math.max(0, tick - i * 6);
    return len >= note.length ? note : note.slice(0, len) + "▌";
  };

  return (
    <section className="hm-services" id="services" ref={secRef}>
      <div className="hm-section-head">
        <Slate idx="01" name="What we do" sub="Premium coverage, engineered end to end" />
      </div>
      <div className="hm-service-list">
        {SERVICES.map((d, i) => {
          const isOpen = open === i;
          return (
            <div
              key={d.title}
              className={`hm-svc${revealed ? " hm-revealed" : ""}${isOpen ? " hm-open" : ""}`}
              style={{
                transition: `opacity 640ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 640ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
              }}
            >
              <div
                className="hm-svc-head"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen(isOpen ? -1 : i);
                  }
                }}
              >
                <div className="hm-svc-note" style={{ marginLeft: `var(--svc-indent-${i})` }}>
                  <span
                    className="hm-dash"
                    style={{ transitionDelay: `${i * 90 + 160}ms, 0ms` }}
                  />
                  <span>{noteShown(d.note, i)}</span>
                </div>
                <div className="hm-svc-title" style={{ marginLeft: `var(--svc-indent-${i})` }}>
                  <span className="hm-hl">{d.title}</span>
                  {isOpen && <span className="hm-svc-period">.</span>}
                  <span className="hm-svc-marker">
                    <span className="hm-m-rule" />
                    <span>{isOpen ? "−" : "+"}</span>
                  </span>
                </div>
              </div>
              {isOpen && (
                <div className="hm-svc-panel" style={{ marginLeft: `var(--svc-indent-${i})` }}>
                  <div className="hm-body">{d.body}</div>
                  {(d.roles ?? []).map((r, j) => (
                    <div
                      key={r.name}
                      className="hm-svc-role"
                      style={{ animationDelay: `${j * 45}ms` }}
                    >
                      <span className="hm-r-name">{r.name}</span>
                      <span className="hm-r-desc">{r.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
