"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Actors", href: "#" },
  { label: "Shows", href: "#" },
  { label: "Blog", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter / X", href: "https://x.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];


export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const studioNameRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Studio name — each letter staggers in
      const letters = studioNameRef.current?.querySelectorAll<HTMLSpanElement>(".letter");
      if (letters?.length) {
        gsap.set(letters, { yPercent: 100, opacity: 0 });
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(letters, {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.03,
            });
          },
        });
      }

      // Divider
      if (dividerRef.current) {
        gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left" });
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 75%",
          onEnter: () => {
            gsap.to(dividerRef.current, {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.inOut",
              delay: 0.4,
            });
          },
        });
      }

      // Columns fade in
      const colItems = columnsRef.current?.querySelectorAll<HTMLElement>(".col-item");
      if (colItems?.length) {
        gsap.set(colItems, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: columnsRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(colItems, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.06,
            });
          },
        });
      }

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const studioName = "CINEMATIC";

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black overflow-hidden"
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      <div className="relative z-10 px-8 md:px-16 pt-20 pb-0">
        {/* Studio name — giant letterpress */}
        <div ref={studioNameRef} className="overflow-hidden mb-2" aria-label={studioName}>
          <div className="flex flex-wrap">
            {studioName.split("").map((char, i) => (
              <span
                key={i}
                className="letter inline-block text-white font-black uppercase will-change-transform"
                style={{
                  fontSize: "clamp(3.5rem,11vw,10rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                }}
              >
                {char}
              </span>
            ))}
          </div>
          {/* "STUDIO" — outlined */}
          <div className="flex flex-wrap">
            {"STUDIO".split("").map((char, i) => (
              <span
                key={i}
                className="letter inline-block font-black uppercase will-change-transform"
                style={{
                  fontSize: "clamp(3.5rem,11vw,10rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.92,
                  WebkitTextStroke: "2px rgba(200,168,75,0.85)",
                  color: "transparent",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div ref={dividerRef} className="w-full h-px bg-white/10 mt-10 mb-10" />

        {/* Three columns */}
        <div
          ref={columnsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-16"
        >
          {/* Col 1 — tagline */}
          <div className="col-item col-span-2 md:col-span-1">
            <p className="text-white/60 text-[9px] tracking-[0.28em] uppercase font-medium mb-5">
              About
            </p>
            <p className="text-white/65 text-sm font-light leading-relaxed max-w-[220px]">
              Crafting cinematic experiences frame by frame since 2024. Stories that breathe.
            </p>
            <a
              href="mailto:hello@cinematicstudio.com"
              className="inline-block mt-5 text-white/70 text-sm font-light hover:text-white transition-colors duration-300"
            >
              hello@cinematicstudio.com
            </a>
          </div>

          {/* Col 2 — navigation */}
          <div className="col-item">
            <p className="text-white/60 text-[9px] tracking-[0.28em] uppercase font-medium mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="col-item">
                  <a
                    href={link.href}
                    className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300 group flex items-center gap-2"
                  >
                    <span className="block w-0 h-px bg-white group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — socials */}
          <div className="col-item">
            <p className="text-white/60 text-[9px] tracking-[0.28em] uppercase font-medium mb-5">
              Follow
            </p>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label} className="col-item">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/65 text-sm font-light hover:text-white transition-colors duration-300 group flex items-center gap-2"
                  >
                    <span className="block w-0 h-px bg-white group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — newsletter mini */}
          <div className="col-item col-span-2 md:col-span-1">
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 px-8 md:px-16 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-white/[0.06]">
        <span className="text-white/45 text-[9px] tracking-[0.2em] uppercase font-medium">
          © {new Date().getFullYear()} Cinematic Studio. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/45 text-[9px] tracking-[0.15em] uppercase hover:text-white transition-colors duration-300">
            Privacy
          </a>
          <a href="#" className="text-white/45 text-[9px] tracking-[0.15em] uppercase hover:text-white transition-colors duration-300">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || !formRef.current || !successRef.current) return;

    const form = formRef.current;
    const success = successRef.current;

    // Fade form out
    gsap.to(form, {
      opacity: 0, y: -10, duration: 0.3, ease: "power2.in",
      onComplete: () => { form.style.pointerEvents = "none"; },
    });

    // Cinematic double-flash then hold
    const tl = gsap.timeline({ delay: 0.35 });
    tl.set(success, { opacity: 0, y: 0, pointerEvents: "auto" })
      .to(success, { opacity: 1, duration: 0.06, ease: "none" })
      .to(success, { opacity: 0, duration: 0.07, ease: "none" })
      .to(success, { opacity: 1, duration: 0.05, ease: "none" })
      .to(success, { opacity: 0, duration: 0.1, ease: "none" })
      .to(success, { opacity: 1, duration: 0.5, ease: "expo.out" });
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  const handleReset = () => {
    if (!successRef.current || !formRef.current) return;
    gsap.to(successRef.current, {
      opacity: 0, y: -10, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        setSubmitted(false);
        setEmail("");
        if (successRef.current) successRef.current.style.pointerEvents = "none";
        if (formRef.current) {
          formRef.current.style.pointerEvents = "auto";
          gsap.fromTo(formRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "expo.out" });
        }
      },
    });
  };

  return (
    <div className="relative">
      {/* Form */}
      <div ref={formRef}>
        <p className="text-white/60 text-[9px] tracking-[0.28em] uppercase font-medium mb-5">
          Stay in the Frame
        </p>
        <p className="text-white/60 text-xs font-light leading-relaxed mb-5">
          Weekly dispatches on craft, cinema, and what we&apos;re making next.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex border-b border-white/30 focus-within:border-white/60 transition-colors duration-300">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/40 text-xs py-3 outline-none font-light"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-white/60 hover:text-white transition-colors duration-300 pl-4 disabled:opacity-40"
              aria-label="Subscribe"
            >
              {loading ? (
                <span className="inline-block w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 16 16" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success state */}
      <div
        ref={successRef}
        className="absolute inset-0 opacity-0 pointer-events-none flex flex-col justify-start"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-7 h-7 flex items-center justify-center shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white/30 text-[9px] tracking-[0.28em] uppercase font-medium">
            You&apos;re In
          </p>
        </div>
        <p className="text-white text-sm font-semibold tracking-wide uppercase mb-1">
          Welcome to the Frame
        </p>
        <p className="text-white/60 text-xs font-light leading-relaxed mb-5">
          First dispatches land in your inbox soon.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="group flex items-center gap-2 text-white/30 hover:text-white transition-colors duration-300"
        >
          <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Subscribe again</span>
          <svg className="w-3 h-3 stroke-current fill-none group-hover:translate-x-0.5 transition-transform duration-300" viewBox="0 0 16 16" strokeWidth="1.5">
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
