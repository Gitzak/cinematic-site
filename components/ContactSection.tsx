"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { label: "Instagram", handle: "@cinematicstudio", href: "https://instagram.com" },
  { label: "Twitter / X", handle: "@cinematic_st", href: "https://x.com" },
  { label: "Vimeo", handle: "cinematicstudio", href: "https://vimeo.com" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title words reveal
      const words = titleRef.current?.querySelectorAll(".reveal-word");
      if (words?.length) {
        gsap.set(words, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          onEnter: () => {
            gsap.to(words, {
              yPercent: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.1,
            });
          },
        });
      }

      // Divider line sweep
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(lineRef.current, {
              scaleX: 1,
              duration: 1.2,
              ease: "expo.inOut",
              delay: 0.3,
            });
          },
        });
      }

      // Form fields stagger in
      const fields = formRef.current?.querySelectorAll<HTMLElement>(".form-item");
      if (fields?.length) {
        gsap.set(fields, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: formRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(fields, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.1,
            });
          },
        });
      }

      // Socials stagger
      const socialItems = socialsRef.current?.querySelectorAll<HTMLElement>(".social-item");
      if (socialItems?.length) {
        gsap.set(socialItems, { opacity: 0, x: -20 });
        ScrollTrigger.create({
          trigger: socialsRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(socialItems, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!submitted || !successRef.current || !formContentRef.current) return;

    const success = successRef.current;
    const content = formContentRef.current;

    // Fade form out
    gsap.to(content, {
      opacity: 0, y: -16, duration: 0.3, ease: "power2.in",
      onComplete: () => { content.style.pointerEvents = "none"; },
    });

    // Cinematic double-flash then hold
    const tl = gsap.timeline({ delay: 0.35 });
    tl.set(success, { opacity: 0, y: 0, pointerEvents: "auto" })
      // flash 1 — on
      .to(success, { opacity: 1, duration: 0.06, ease: "none" })
      // flash 1 — off
      .to(success, { opacity: 0, duration: 0.07, ease: "none" })
      // flash 2 — on (brighter, slightly longer)
      .to(success, { opacity: 1, duration: 0.05, ease: "none" })
      // flash 2 — off
      .to(success, { opacity: 0, duration: 0.1, ease: "none" })
      // settle in
      .to(success, { opacity: 1, duration: 0.55, ease: "expo.out" });
  }, [submitted]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  const handleReset = () => {
    if (!successRef.current || !formContentRef.current) return;
    gsap.to(successRef.current, {
      opacity: 0, y: -16, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        setSubmitted(false);
        setLoading(false);
        if (successRef.current) successRef.current.style.pointerEvents = "none";
        if (formContentRef.current) {
          formContentRef.current.style.pointerEvents = "auto";
          gsap.fromTo(formContentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
        }
      },
    });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Background image — right half */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[45%] z-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          quality={80}
          className="object-cover object-center"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent md:from-black/80 md:via-black/30 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row min-h-screen">
        {/* ── Left: title + socials ── */}
        <div className="flex flex-col justify-between w-full md:w-[52%] px-8 md:px-16 pt-24 pb-16">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-16">
            <span className="block w-6 h-px" style={{ backgroundColor: "#c8a84b" }} />
            <span className="text-[9px] tracking-[0.28em] uppercase font-medium" style={{ color: "#c8a84b" }}>
              Contact
            </span>
          </div>

          {/* Big title */}
          <div ref={titleRef} className="flex-1 flex flex-col justify-center">
            <div className="overflow-hidden">
              <span
                className="reveal-word block text-white font-black uppercase leading-none will-change-transform"
                style={{ fontSize: "clamp(3rem,8vw,7.5rem)", letterSpacing: "-0.03em" }}
              >
                LET'S
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                className="reveal-word block text-white font-black uppercase leading-none will-change-transform"
                style={{ fontSize: "clamp(3rem,8vw,7.5rem)", letterSpacing: "-0.03em" }}
              >
                CREATE
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                className="reveal-word block font-black uppercase leading-none will-change-transform"
                style={{
                  fontSize: "clamp(3rem,8vw,7.5rem)",
                  letterSpacing: "-0.03em",
                  WebkitTextStroke: "2px rgba(200,168,75,0.85)",
                  color: "transparent",
                }}
              >
                TOGETHER
              </span>
            </div>

            <div ref={lineRef} className="w-full h-px bg-white/15 mt-8 mb-8" />

            <p className="text-white/60 text-sm font-light leading-relaxed max-w-xs">
              We collaborate with directors, brands, and storytellers to craft cinematic experiences
              that leave a mark.
            </p>
          </div>

          {/* Socials */}
          <div ref={socialsRef} className="flex flex-col gap-4 mt-12">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-item group flex items-center justify-between border-b border-white/10 pb-4 hover:border-white/30 transition-colors duration-300"
              >
                <span className="text-white/60 text-[9px] tracking-[0.2em] uppercase font-medium">
                  {s.label}
                </span>
                <span className="text-white/60 text-sm font-light group-hover:text-white transition-colors duration-300">
                  {s.handle}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="relative flex flex-col justify-center w-full md:w-[48%] px-8 md:px-12 lg:px-16 pb-16 md:pt-24">
          {/* Form content */}
          <div ref={formContentRef}>
            <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-item flex flex-col gap-2">
                <label className="text-white/60 text-[9px] tracking-[0.25em] uppercase font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="bg-transparent border-b border-white/25 text-white placeholder-white/40 text-sm font-light py-3 outline-none focus:border-white/50 transition-colors duration-300"
                />
              </div>

              {/* Email */}
              <div className="form-item flex flex-col gap-2">
                <label className="text-white/60 text-[9px] tracking-[0.25em] uppercase font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="bg-transparent border-b border-white/25 text-white placeholder-white/40 text-sm font-light py-3 outline-none focus:border-white/50 transition-colors duration-300"
                />
              </div>

              {/* Project type */}
              <div className="form-item flex flex-col gap-2" style={{ position: "relative", zIndex: 10 }}>
                <label className="text-white/60 text-[9px] tracking-[0.25em] uppercase font-medium">
                  Project Type
                </label>
                <ProjectSelect />
              </div>

              {/* Message */}
              <div className="form-item flex flex-col gap-2">
                <label className="text-white/60 text-[9px] tracking-[0.25em] uppercase font-medium">
                  Tell Us More
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your project, vision, or just say hello…"
                  className="bg-transparent border-b border-white/25 text-white placeholder-white/40 text-sm font-light py-3 outline-none focus:border-white/50 transition-colors duration-300 resize-none"
                />
              </div>

              {/* Submit */}
              <div className="form-item pt-2">
                <SubmitButton loading={loading} />
              </div>
            </form>
          </div>

          {/* ── Success state ── */}
          <div
            ref={successRef}
            className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-12 lg:px-16 opacity-0 pointer-events-none"
          >
            {/* Check mark */}
            <div
              className="w-12 h-12 flex items-center justify-center mb-8"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-white/30 text-[9px] tracking-[0.28em] uppercase font-medium mb-4">
              Message Sent
            </p>

            <h3
              className="text-white font-black uppercase leading-none mb-4"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.03em" }}
            >
              WE&apos;LL BE IN
              <br />
              <span
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                  color: "transparent",
                }}
              >
                TOUCH
              </span>
            </h3>

            <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs mb-10">
              Thank you for reaching out. Our team will get back to you within 48 hours.
            </p>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleReset}
              className="group relative overflow-hidden border border-white/25 flex items-center gap-6 px-7 py-4"
            >
              <span
                className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              />
              <span className="relative z-10 text-white group-hover:text-black text-sm font-semibold tracking-widest uppercase transition-colors duration-300">
                Send New Message
              </span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                <svg className="w-4 h-4 stroke-current fill-none text-white group-hover:text-black transition-colors duration-300" viewBox="0 0 16 16" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onEnter = () => {
      gsap.to(rippleRef.current, {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.out",
        transformOrigin: "left center",
      });
      gsap.to(btn.querySelector(".btn-label"), {
        color: "#000",
        duration: 0.3,
        delay: 0.1,
      });
      gsap.to(btn.querySelector(".btn-arrow"), {
        x: 4,
        color: "#000",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(rippleRef.current, {
        scaleX: 0,
        duration: 0.4,
        ease: "power3.in",
        transformOrigin: "right center",
      });
      gsap.to(btn.querySelector(".btn-label"), {
        color: "#fff",
        duration: 0.3,
      });
      gsap.to(btn.querySelector(".btn-arrow"), {
        x: 0,
        color: "#fff",
        duration: 0.3,
      });
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      type="submit"
      className="relative overflow-hidden border border-white/25 flex items-center justify-between px-7 py-4 w-full md:w-auto md:min-w-[200px] group"
    >
      {/* Ripple fill */}
      <span
        ref={rippleRef}
        className="absolute inset-0 bg-white"
        style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
      />
      <span className="btn-label relative z-10 text-white text-sm font-semibold tracking-widest uppercase transition-colors duration-200">
        {loading ? "Sending…" : "Send Message"}
      </span>
      <span className="btn-arrow relative z-10 ml-6">
        {loading ? (
          <span className="inline-block w-4 h-4 border border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            className="w-4 h-4 stroke-current fill-none"
            viewBox="0 0 16 16"
            strokeWidth="1.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

const PROJECT_OPTIONS = [
  { value: "film", label: "Short Film" },
  { value: "commercial", label: "Commercial" },
  { value: "documentary", label: "Documentary" },
  { value: "other", label: "Other" },
];

function ProjectSelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selected
    ? PROJECT_OPTIONS.find((o) => o.value === selected)?.label
    : "Select a type…";

  return (
    <div ref={ref} className="relative" style={{ zIndex: open ? 50 : "auto" }}>
      {/* Trigger — matches other form inputs */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-transparent border-b text-sm font-light py-3 outline-none transition-colors duration-300"
        style={{
          borderColor: open ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
          color: selected ? "#fff" : "rgba(255,255,255,0.2)",
        }}
      >
        <span>{label}</span>
        <svg
          className="w-3.5 h-3.5 fill-none shrink-0 transition-transform duration-200"
          style={{
            stroke: "rgba(255,255,255,0.35)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute left-0 right-0 top-full z-50"
          style={{
            background: "rgba(8,8,12,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderTop: "none",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            marginTop: 0,
          }}
        >
          {PROJECT_OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => { setSelected(opt.value); setOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm font-light flex items-center justify-between transition-colors duration-150 outline-none"
                  style={{
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
                    background: isSelected ? "rgba(255,255,255,0.05)" : "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = isSelected ? "rgba(255,255,255,0.05)" : "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = isSelected ? "#fff" : "rgba(255,255,255,0.5)";
                  }}
                >
                  {opt.label}
                  {isSelected && (
                    <svg className="w-3 h-3 fill-none shrink-0" style={{ stroke: "rgba(255,255,255,0.5)" }} viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
