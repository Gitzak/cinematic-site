"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

const TABS = ["UPCOMING SHOWS", "DRAMA", "CONCERT", "DANCE"] as const;

const SHOWS = [
  {
    tab: "UPCOMING SHOWS",
    title: "VELVET HUNGER",
    description:
      "An electrifying exploration of desire and defiance, merging raw intensity with hypnotic stage presence and sound.",
    location: "Vibe Room, Paris, France",
    date: "9/30",
    datetime: "September 2025 | 08:00 PM",
    image: "/images/2/adrian-regeci-ZCfiOl8QAms-unsplash.jpg",
  },
  {
    tab: "DRAMA",
    title: "CRIMSON VEIL",
    description:
      "A haunting drama of loss and rebirth told through movement, shadow, and silence that lingers long after the curtain falls.",
    location: "Grand Théâtre, Lyon, France",
    date: "10/14",
    datetime: "October 2025 | 07:30 PM",
    image: "/images/2/ivan-mani-qsig-AaEbHM-unsplash.jpg",
  },
  {
    tab: "CONCERT",
    title: "ECHO CHAMBER",
    description:
      "An immersive sonic journey where orchestral power meets electronic minimalism inside a cathedral of pure sound.",
    location: "L'Olympia, Paris, France",
    date: "11/05",
    datetime: "November 2025 | 09:00 PM",
    image: "/images/2/ali-tayyebi-DvsW6J0DqyQ-unsplash.jpg",
  },
  {
    tab: "DANCE",
    title: "FLUID STATE",
    description:
      "Bodies in perpetual motion — a contemporary piece exploring identity, tension, and the freedom of letting go.",
    location: "Opéra de Bordeaux, France",
    date: "12/01",
    datetime: "December 2025 | 08:30 PM",
    image: "/images/2/arthur-hinton-_aPu8w5nR6o-unsplash.jpg",
  },
] as const;

export default function ShowsSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const switchShow = (idx: number) => {
    if (idx === activeRef.current) return;

    const oldPanel = panelRefs.current[activeRef.current];
    const newPanel = panelRefs.current[idx];
    if (!oldPanel || !newPanel) return;

    // Outgoing panel
    gsap.to(oldPanel, {
      opacity: 0,
      y: -28,
      duration: 0.38,
      ease: "power2.in",
      onComplete: () => { gsap.set(oldPanel, { pointerEvents: "none" }); },
    });

    // Incoming panel
    gsap.set(newPanel, { opacity: 0, y: 28, pointerEvents: "auto" });
    gsap.to(newPanel, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "expo.out",
      delay: 0.22,
    });

    activeRef.current = idx;
    setActive(idx);
  };

  return (
    <section id="work" className="relative bg-black overflow-hidden">
      {/* ── Tab bar ── */}
      <div className="grid grid-cols-4 border-t border-b border-white/10">
        {TABS.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab}
              onClick={() => switchShow(i)}
              className={[
                "relative py-5 px-4 text-[10px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-colors duration-300",
                i > 0 ? "border-l border-white/10" : "",
                isActive ? "text-white" : "text-white/35 hover:text-white/65",
              ].join(" ")}
            >
              {/* Active inset border */}
              {isActive && (
                <span className="absolute inset-[5px] border border-white/25 pointer-events-none" />
              )}
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Content panels ── */}
      <div className="relative min-h-190 md:min-h-135">
        {SHOWS.map((show, i) => (
          <div
            key={show.tab}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="absolute inset-0 flex flex-col md:flex-row items-start gap-10 md:gap-16 px-8 md:px-16 lg:px-24 py-14 md:py-18"
            style={{
              opacity: i === 0 ? 1 : 0,
              pointerEvents: i === 0 ? "auto" : "none",
            }}
          >
            {/* ── Framed image ── */}
            <div className="relative flex-none w-full md:w-[42%] lg:w-[40%]">
              {/* Outer padding — gives space for corner marks */}
              <div className="relative p-3">
                {/* Corner bracket marks */}
                <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/70" />
                <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/70" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/70" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/70" />

                {/* Image */}
                <div className="relative overflow-hidden h-75 md:h-90">
                  <Image
                    src={show.image}
                    alt={show.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 90vw, 42vw"
                  />
                  {/* Subtle inner vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── Show info ── */}
            <div className="flex-1 flex flex-col justify-between h-full pt-2 md:pt-4">
              {/* Upper: eyebrow + title + description */}
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="block w-4 h-px bg-white/20" />
                  <span className="text-[9px] tracking-[0.3em] uppercase font-medium" style={{ color: "#c8a84b" }}>
                    {show.tab}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-white font-bold uppercase mb-4 leading-none"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {show.title}
                </h2>

                {/* Description */}
                <p className="text-white/55 text-sm md:text-base font-light leading-relaxed max-w-md">
                  {show.description}
                </p>
              </div>

              {/* Lower: location + date */}
              <div className="flex items-end justify-between mt-10 md:mt-0">
                <p className="text-[11px] tracking-[0.14em] uppercase font-mono" style={{ color: "#c8a84b" }}>
                  [{show.location}]
                </p>

                <div className="text-right">
                  <p
                    className="text-white font-bold leading-none tabular-nums"
                    style={{
                      fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {show.date}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.14em] uppercase font-mono" style={{ color: "#c8a84b" }}>
                    [{show.datetime}]
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
