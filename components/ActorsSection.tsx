"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACTORS = [
  {
    name: "SANDRA WHITMORE",
    role: "DRAMATIC PERFORMER",
    image: "/actor-1.jpg",
    index: "01",
  },
  {
    name: "MARCUS LAINE",
    role: "ACTION LEAD",
    image: "/actor-2.jpg",
    index: "02",
  },
  {
    name: "ELENA VOSS",
    role: "CHARACTER ACTOR",
    image: "/actor-3.jpg",
    index: "03",
  },
];

// Marquee: single track doubled → animate -50% for seamless loop
const MARQUEE_CHUNK = Array.from({ length: 5 })
  .map(() => "TOP ACTORS \u00a0\u00d7\u00a0 ")
  .join("");

export default function ActorsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Fluid bg: animate turbulence seed slowly ─────────────────────────
      if (turbRef.current) {
        const proxy = { seed: 3 };
        gsap.to(proxy, {
          seed: 80,
          duration: 18,
          ease: "none",
          repeat: -1,
          yoyo: true,
          onUpdate() {
            turbRef.current?.setAttribute("seed", String(Math.round(proxy.seed)));
          },
        });
      }

      // ── Marquee ──────────────────────────────────────────────────────────
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          x: "-50%",
          duration: 24,
          ease: "none",
          repeat: -1,
        });
      }

      // ── Pin + scrub ───────────────────────────────────────────────────────
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(cards[0], { opacity: 1, yPercent: 0, scale: 1 });
      cards.slice(1).forEach((c) =>
        gsap.set(c, { opacity: 0, yPercent: 60, scale: 0.92 })
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${(ACTORS.length - 1) * 100}%`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          // Counter always matches the active card based on scroll progress
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (ACTORS.length - 1));
            if (counterRef.current) {
              counterRef.current.textContent = ACTORS[idx].index;
            }
          },
        },
      });

      ACTORS.forEach((_, i) => {
        if (i < ACTORS.length - 1) {
          // Exit current
          tl.to(cards[i], {
            opacity: 0,
            yPercent: -50,
            scale: 0.96,
            duration: 0.4,
          });

          // Enter next
          tl.fromTo(
            cards[i + 1],
            { opacity: 0, yPercent: 60, scale: 0.92 },
            { opacity: 1, yPercent: 0, scale: 1, duration: 0.6, ease: "power2.out" },
            "<+=0.05"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="actors"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh" }}
    >
      {/* ── Background photo ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src="/actors-bg.jpg"
          alt=""
          fill
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Dark vignette: top + bottom, matching hero section style ──────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />

      {/* ── Marquee ──────────────────────────────────────────────────────── */}
      <div
        className="absolute top-[11%] left-0 w-full overflow-hidden pointer-events-none select-none z-20"
        aria-hidden
      >
        <div
          ref={marqueeRef}
          className="whitespace-nowrap will-change-transform"
          style={{ width: "200%" }}
        >
          <span
            className="text-white font-black uppercase leading-none"
            style={{ fontSize: "clamp(3.5rem,9vw,8rem)", letterSpacing: "-0.025em" }}
          >
            {MARQUEE_CHUNK}
            {MARQUEE_CHUNK}
          </span>
        </div>
      </div>

      {/* ── Cards — stacked, one visible at a time ────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {ACTORS.map((actor, i) => (
          <div
            key={actor.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="absolute will-change-transform"
            style={{ rotate: `${i % 2 === 0 ? -1.5 : 1.5}deg` }}
          >
            <ActorCard actor={actor} />
          </div>
        ))}
      </div>

      {/* ── Counter ──────────────────────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span
          ref={counterRef}
          className="text-white font-black tabular-nums leading-none"
          style={{ fontSize: "clamp(1.4rem,3vw,2.2rem)", letterSpacing: "-0.03em" }}
        >
          01
        </span>
        <span className="text-sm font-light tracking-widest" style={{ color: "#c8a84b" }}>
          / {String(ACTORS.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Section label ────────────────────────────────────────────────── */}
      <div className="absolute top-8 left-8 md:left-16 flex items-center gap-3">
        <span className="block w-6 h-px" style={{ background: "#c8a84b" }} />
        <span className="text-[9px] tracking-[0.28em] uppercase font-medium" style={{ color: "#c8a84b" }}>
          Top Actors
        </span>
      </div>
    </section>
  );
}

// ── Polaroid / stamp card ─────────────────────────────────────────────────────
function ActorCard({ actor }: { actor: (typeof ACTORS)[number] }) {
  return (
    <div
      className="relative bg-white shadow-2xl"
      style={{ width: "clamp(220px,26vw,380px)" }}
    >
      {/* Photo */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(280px,38vw,500px)" }}
      >
        <Image
          src={actor.image}
          alt={actor.name}
          fill
          className="object-cover object-top"
          sizes="(max-width:768px) 80vw, 30vw"
        />
        {/* Plus badge */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white flex items-center justify-center">
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Caption strip */}
      <div className="px-4 pt-4 pb-2">
        <p
          className="font-bold uppercase text-black leading-tight"
          style={{ fontSize: "clamp(0.7rem,1.4vw,1rem)", letterSpacing: "0.04em" }}
        >
          {actor.name}
        </p>
        <p
          className="mt-0.5 uppercase font-semibold"
          style={{ fontSize: "clamp(0.55rem,1vw,0.75rem)", letterSpacing: "0.1em", color: "#e04f10" }}
        >
          {actor.role}
        </p>
      </div>

      {/* Stamp scalloped bottom */}
      <div
        style={{
          height: 14,
          backgroundImage: "radial-gradient(circle at 50% 100%,#000 7px,transparent 7px)",
          backgroundSize: "18px 14px",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}
