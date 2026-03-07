"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import StatsSection from "@/components/StatsSection";
import StatementSection from "@/components/StatementSection";
import ShowsSection from "@/components/ShowsSection";
import ActorsSection from "@/components/ActorsSection";
import NewsletterSection from "@/components/NewsletterSection";
import LatestPostsSection from "@/components/LatestPostsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";
import BackToTopButton from "@/components/BackToTopButton";

const HEADLINE_WORDS = ["WHERE", "STORIES", "BREATHE"];
const SUBLINE = "Cinematic experiences crafted frame by frame.";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const blurLayerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);

      // Set initial states
      gsap.set(words, { yPercent: 110, opacity: 0, skewY: 4 });
      gsap.set(subRef.current, { opacity: 0, y: 24 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      gsap.set(scrollRef.current, { opacity: 0 });

      // Image subtle ken burns
      gsap.fromTo(
        imgRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 7, ease: "power1.out" }
      );

      // Animated flow-blur on the overlay layer
      gsap.to(blurLayerRef.current, {
        "--blur-x": "60%",
        "--blur-y": "40%",
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Master timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        skewY: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
      })
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
        .to(scrollRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");

      const scrollEl = scrollRef.current;
      const dot = scrollEl?.querySelector(".scroll-dot") ?? null;
      const mouse = scrollEl?.querySelector(".scroll-mouse") ?? null;
      const label = scrollEl?.querySelector(".scroll-label") ?? null;

      // Mouse border breathes
      gsap.to(mouse, {
        borderColor: "rgba(255,255,255,0.55)",
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Label pulses
      gsap.to(label, {
        opacity: 0.15,
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });

      // Dot: fade in → glide down → fade out → pause → repeat
      const dotLoop = () => {
        gsap.fromTo(
          dot,
          { y: 0, opacity: 1, scaleY: 1 },
          {
            y: 14,
            opacity: 1,
            scaleY: 1,
            duration: 1.1,
            ease: "power1.inOut",
            onComplete() {
              gsap.to(dot, {
                opacity: 0,
                scaleY: 1,
                duration: 0.5,
                ease: "power2.in",
                onComplete() {
                  gsap.delayedCall(0.9, dotLoop);
                },
              });
            },
          }
        );
      };
      gsap.delayedCall(0.4, dotLoop);
    }, heroRef);

    // Hide scroll indicator when scrolled past hero
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight;
      const past = window.scrollY > heroHeight * 0.3;
      gsap.to(scrollRef.current, {
        opacity: past ? 0 : 1,
        y: past ? 10 : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* ── Background image ── */}
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/hero-bg.jpg"
          alt="Cinematic background"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />

      {/* ── Animated flow-blur vignette ── */}
      <div
        ref={blurLayerRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 55% at var(--blur-x, 30%) var(--blur-y, 55%), transparent 0%, rgba(0,0,0,0.55) 100%)`,
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Hero content ── */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col justify-end min-h-screen px-8 md:px-16 lg:px-24 pb-24 md:pb-32"
      >
        {/* Eyebrow label */}
        <div className="mb-6 flex items-center gap-3">
          <span className="block w-8 h-px" style={{ backgroundColor: "#c8a84b" }} />
          <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "#c8a84b" }}>
            Cinematic Studio · Est. 2024
          </span>
        </div>

        {/* Headline — each word in a clip container */}
        <h1 className="overflow-visible mb-6" aria-label={HEADLINE_WORDS.join(" ")}>
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={word}
              className="block overflow-hidden leading-[0.92]"
            >
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className="block text-white font-black uppercase will-change-transform"
                style={{
                  fontSize: "clamp(3.5rem, 12vw, 11rem)",
                  letterSpacing: "-0.03em",
                  textShadow: "0 2px 40px rgba(0,0,0,0.4)",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subline */}
        <p
          ref={subRef}
          className="text-lg md:text-xl font-light tracking-wide max-w-md mb-10"
          style={{ lineHeight: 1.6, color: "#c8a84b" }}
        >
          {SUBLINE}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
          <a
            href="#"
            className="group relative overflow-hidden inline-flex items-center gap-3 rounded-full bg-white text-black text-sm font-semibold tracking-wide px-7 py-3.5 transition-all duration-300 hover:bg-white/90 active:scale-95"
          >
            {/* play icon */}
            <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 16 16">
              <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
            </svg>
            Watch the Reel
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 text-white text-sm font-medium tracking-wide px-7 py-3.5 transition-all duration-300 hover:border-white/60 hover:bg-white/5 backdrop-blur-sm active:scale-95"
          >
            View Work
            <svg className="w-3.5 h-3.5 stroke-white fill-none shrink-0" viewBox="0 0 16 16" strokeWidth="1.5">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          {/* Mouse outline */}
          <div className="scroll-mouse relative w-[22px] h-[34px] rounded-full border border-white/25 flex items-start justify-center pt-1.25 overflow-hidden">
            {/* Animated scroll dot */}
            <div className="scroll-dot w-0.5 h-2 rounded-full bg-white opacity-0 origin-top" />
          </div>
          <span className="scroll-label text-white/35 text-[9px] tracking-[0.3em] uppercase font-medium">
            Scroll
          </span>
        </div>
      </section>

    </main>
    <StatsSection />
    <StatementSection />
    <ShowsSection />
    <NewsletterSection />
    <ActorsSection />
    <LatestPostsSection />
    <BlogSection />
    <ContactSection />
    <FooterSection />
    <BackToTopButton />
    </>
  );
}
