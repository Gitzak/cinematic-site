"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Three lines of the statement — each word gets its own reveal clip
const LINES = [
  ["STEP", "INTO", "EVERY", "FRAME,"],
  ["FIND", "THE", "STORY", "THAT"],
  ["MOVES", "YOUR", "WORLD"],
];

// Vertical light columns — evenly spaced, subtle
const COLUMNS = [
  { left: "16.66%", delay: 0,    dur: 5.0, gap: 3.2 },
  { left: "33.33%", delay: 1.4,  dur: 6.2, gap: 2.1 },
  { left: "50%",    delay: 0.7,  dur: 4.5, gap: 4.0 },
  { left: "66.66%", delay: 2.1,  dur: 5.8, gap: 2.8 },
  { left: "83.33%", delay: 0.3,  dur: 6.6, gap: 1.9 },
];

export default function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Scan columns ───────────────────────────────────────────
      COLUMNS.forEach((cfg, i) => {
        const el = colRefs.current[i];
        if (!el) return;

        const h = 280;
        const run = () => {
          gsap.fromTo(
            el,
            { y: -h, opacity: 0 },
            {
              y: section.offsetHeight + h,
              opacity: 1,
              duration: cfg.dur,
              ease: "none",
              onStart() {
                gsap.to(el, { opacity: 1, duration: 0.5, ease: "power1.out" });
              },
              onComplete() {
                gsap.set(el, { opacity: 0 });
                gsap.delayedCall(cfg.gap + Math.random() * 2, run);
              },
            }
          );
        };
        gsap.delayedCall(cfg.delay, run);
      });

      // ── Word reveal on scroll ──────────────────────────────────
      const words = wordRefs.current.filter(Boolean);
      gsap.set(words, { yPercent: 110, opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        once: true,
        onEnter() {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.055,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative bg-black overflow-hidden py-28 md:py-36 flex flex-col items-center justify-center"
    >
      {/* ── Top separator ── */}
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24 h-px bg-white/[0.07]" />

      {/* ── Vertical scan columns ── */}
      {COLUMNS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { colRefs.current[i] = el; }}
          className="absolute top-0 opacity-0 pointer-events-none"
          style={{
            left: cfg.left,
            width: "1px",
            height: 280,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.10) 65%, transparent 100%)",
          }}
        />
      ))}

      {/* ── Statement text ── */}
      <div className="relative z-10 px-6 md:px-12 text-center">
        {LINES.map((words, li) => (
          <div key={li} className="flex flex-wrap justify-center gap-x-[0.9em]">
            {words.map((word) => {
              const idx = wordIndex++;
              return (
                <span key={word + idx} className="overflow-hidden inline-block leading-[1.05]">
                  <span
                    ref={(el) => { wordRefs.current[idx] = el; }}
                    className="inline-block text-white font-medium uppercase"
                    style={{
                      fontSize: "clamp(2rem, 5vw, 55.5rem)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </div>
        ))}

        {/* Sub-label */}
        <p
          className="mt-10 text-xs tracking-[0.3em] uppercase font-medium"
          style={{ letterSpacing: "0.3em", color: "#c8a84b" }}
        >
          — Cinematic Studio
        </p>
      </div>

      {/* ── Bottom separator ── */}
      <div className="absolute bottom-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24 h-px bg-white/[0.07]" />
    </section>
  );
}
