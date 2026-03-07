"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Each scan line: fixed left position, individual height/speed/delay
const SCAN_LINES = [
  { left: "6%",  h: 160, dur: 4.2, delay: 0,    gap: 3.1 },
  { left: "17%", h: 220, dur: 5.8, delay: 1.7,  gap: 2.4 },
  { left: "28%", h: 130, dur: 3.6, delay: 0.5,  gap: 4.7 },
  { left: "39%", h: 190, dur: 6.1, delay: 2.9,  gap: 1.8 },
  { left: "52%", h: 250, dur: 4.8, delay: 0.9,  gap: 3.5 },
  { left: "63%", h: 140, dur: 5.2, delay: 3.4,  gap: 2.1 },
  { left: "76%", h: 200, dur: 3.9, delay: 1.2,  gap: 4.3 },
  { left: "88%", h: 170, dur: 6.5, delay: 2.1,  gap: 1.6 },
  { left: "44%", h: 110, dur: 4.4, delay: 4.0,  gap: 3.8 },
  { left: "83%", h: 240, dur: 5.5, delay: 0.3,  gap: 2.9 },
];

const CARDS = [
  {
    id: 1,
    src: "/images/1/arda-mutlu-NLl9bm5i4W8-unsplash.jpg",
    alt: "Cinematic portrait",
    style: { top: 0, right: 0, width: "44%", height: "52%" },
    parallaxY: 50,
  },
  {
    id: 2,
    src: "/images/1/donny-jiang-JlObw-79gpA-unsplash.jpg",
    alt: "Cinematic stage",
    style: { top: "28%", left: "2%", width: "53%", height: "37%" },
    parallaxY: 28,
  },
  {
    id: 3,
    src: "/images/1/martyn-cooling-1Cp8IzYao6s-unsplash.jpg",
    alt: "Cinematic scene",
    style: { bottom: 0, right: "4%", width: "36%", height: "40%" },
    parallaxY: 65,
  },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Scan lines ──────────────────────────────────────────────
      // Each line travels from above the section to below it, then repeats
      // with its own random-feeling gap so they never sync up.
      SCAN_LINES.forEach((cfg, i) => {
        const el = lineRefs.current[i];
        if (!el) return;

        const runLine = () => {
          gsap.fromTo(
            el,
            { y: -cfg.h, opacity: 0 },
            {
              y: section.offsetHeight + cfg.h,
              opacity: 1,
              duration: cfg.dur,
              ease: "none",
              onStart() {
                // quick fade-in at the top
                gsap.to(el, { opacity: 1, duration: 0.4, ease: "power1.out" });
              },
              onComplete() {
                gsap.set(el, { opacity: 0 });
                // wait a random-ish gap then restart
                gsap.delayedCall(cfg.gap + (Math.random() * 1.5), runLine);
              },
            }
          );
        };

        gsap.delayedCall(cfg.delay, runLine);
      });

      // ── Counter ──────────────────────────────────────────────────
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        once: true,
        onEnter() {
          gsap.to(counter, {
            val: 3400,
            duration: 2.2,
            ease: "power2.out",
            onUpdate() {
              if (countRef.current) {
                // European format: 3.400
                countRef.current.textContent =
                  Math.round(counter.val).toLocaleString("fr-FR") + "+";
              }
            },
          });
        },
      });

      // ── Text reveal ──────────────────────────────────────────────
      const reveals = textRef.current?.querySelectorAll(".reveal");
      gsap.set(reveals ?? [], { opacity: 0, y: 32 });
      ScrollTrigger.create({
        trigger: textRef.current,
        start: "top 78%",
        once: true,
        onEnter() {
          gsap.to(reveals ?? [], {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.14,
          });
        },
      });

      // ── Mosaic cards stagger-in ──────────────────────────────────
      const cards = mosaicRef.current?.querySelectorAll(".img-card");
      gsap.set(cards ?? [], { opacity: 0, y: 50, scale: 0.97 });
      ScrollTrigger.create({
        trigger: mosaicRef.current,
        start: "top 82%",
        once: true,
        onEnter() {
          gsap.to(cards ?? [], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.18,
          });
        },
      });

      // ── Parallax: each inner wrapper drifts at its own speed ─────
      // scrub: true links the tween progress to scroll position bidirectionally.
      CARDS.forEach((card, i) => {
        const el = parallaxRefs.current[i];
        if (!el) return;
        gsap.fromTo(
          el,
          { y: -card.parallaxY / 2 },
          {
            y: card.parallaxY,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden min-h-screen px-8 md:px-16 lg:px-24 py-32 flex items-center"
    >
      {/* ── Scan lines ── */}
      {SCAN_LINES.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { lineRefs.current[i] = el; }}
          className="absolute pointer-events-none z-10 opacity-0"
          style={{
            left: cfg.left,
            top: 0,
            width: "1px",
            height: cfg.h,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent 100%)",
          }}
        />
      ))}

      {/* ── Top separator line ── */}
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24 h-px bg-white/[0.07]" />

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-16 items-center">

        {/* ── Left: text ── */}
        <div ref={textRef}>
          {/* Eyebrow */}
          <div className="reveal flex items-start gap-5 mb-14">
            <div className="w-px h-14 bg-white/20 shrink-0 mt-0.5" />
            <p className="text-[11px] tracking-[0.2em] uppercase leading-loose max-w-70" style={{ color: "#c8a84b" }}>
              Over 1,200+ curated shows and an audience satisfaction rate of 97%.
              Experience cinema redefined.
            </p>
          </div>

          {/* Counter */}
          <div className="reveal mb-5 overflow-hidden">
            <span
              ref={countRef}
              className="block text-white font-black leading-none tracking-[-0.04em] tabular-nums"
              style={{ fontSize: "clamp(5rem, 13vw, 9.5rem)" }}
            >
              0+
            </span>
          </div>

          {/* Description */}
          <p className="reveal text-white/65 text-xl md:text-2xl font-light leading-relaxed max-w-120">
            Productions blending sound and storytelling to create lasting,
            immersive moments.
          </p>

          {/* CTA */}
          <a
            href="#"
            className="reveal mt-14 inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 group"
            style={{ color: "#c8a84b" }}
          >
            <span className="block h-px bg-white/25 transition-all duration-500 w-8 group-hover:w-14 group-hover:bg-white" />
            Explore our work
          </a>
        </div>

        {/* ── Right: mosaic ── */}
        <div ref={mosaicRef} className="relative h-130 md:h-155 lg:h-170">
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              className="img-card absolute overflow-hidden rounded-xs"
              style={card.style}
            >
              {/* Inner wrapper — receives parallax y, oversized to avoid edge gaps */}
              <div
                ref={(el) => { parallaxRefs.current[i] = el; }}
                className="relative w-full h-[130%] -mt-[15%]"
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 60vw, 30vw"
                />
                {/* Dark vignette at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/50 to-transparent z-10" />
              </div>
            </div>
          ))}

          {/* Decorative dot grid — subtle texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
