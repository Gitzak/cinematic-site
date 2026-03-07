"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Errors = { name?: string; email?: string };

function validate(name: string, email: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "At least 2 characters.";

  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email.";

  return errors;
}

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { x: 60, opacity: 0 });
      gsap.set(titleRef.current, { y: 24, opacity: 0 });
      gsap.set(formRef.current, { y: 20, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(cardRef.current, { x: 0, opacity: 1, duration: 0.9, ease: "expo.out" })
            .to(titleRef.current, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.5")
            .to(formRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate success state in
  useEffect(() => {
    if (!submitted || !successRef.current || !contentRef.current) return;
    gsap.to(contentRef.current, { opacity: 0, y: -16, duration: 0.35, ease: "power2.in",
      onComplete: () => { if (contentRef.current) contentRef.current.style.pointerEvents = "none"; }
    });
    gsap.fromTo(
      successRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", delay: 0.35,
        onStart: () => { if (successRef.current) successRef.current.style.pointerEvents = "auto"; }
      }
    );
  }, [submitted]);

  const handleBlur = (field: "name" | "email") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(name, email));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(name, email);
    setErrors(errs);
    setTouched({ name: true, email: true });
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Fake async send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[640px] flex items-center overflow-hidden bg-black mt-20 mb-20"
    >
      {/* ── Video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src="/videos/2.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 py-20 flex justify-end">
        <div
          ref={cardRef}
          className="relative bg-white w-full max-w-[420px] px-10 pt-10 pb-16"
        >
          <div ref={contentRef}>
          {/* Eyebrow */}
          <p className="text-black/40 text-[10px] tracking-[0.25em] uppercase font-mono mb-5">
            [ Subscribe Now ]
          </p>

          {/* Title */}
          <h2
            ref={titleRef}
            className="text-black font-black uppercase leading-none mb-6"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", letterSpacing: "-0.01em" }}
          >
            Be First to Discover
            <br />
            New Performances
          </h2>

          {/* Description */}
          <p className="text-black/50 text-sm leading-relaxed mb-8 font-light">
            Subscribe to receive exclusive updates on upcoming performances, events, and behind-the-scenes stories.
          </p>

          {/* ── Form ── */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex gap-3">
              {/* Name */}
              <div className="flex-1">
                <label className="block text-black text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5">
                  Name*
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) setErrors(validate(e.target.value, email));
                  }}
                  onBlur={() => handleBlur("name")}
                  className={[
                    "w-full border bg-white text-black text-sm px-3 py-2.5 placeholder:text-black/25 focus:outline-none transition-colors",
                    touched.name && errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-black/15 focus:border-black/40",
                  ].join(" ")}
                />
                {touched.name && errors.name && (
                  <p className="mt-1 text-red-500 text-[10px] tracking-wide">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex-1">
                <label className="block text-black text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5">
                  Email*
                </label>
                <input
                  type="email"
                  placeholder="jane@framer.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setErrors(validate(name, e.target.value));
                  }}
                  onBlur={() => handleBlur("email")}
                  className={[
                    "w-full border bg-white text-black text-sm px-3 py-2.5 placeholder:text-black/25 focus:outline-none transition-colors",
                    touched.email && errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-black/15 focus:border-black/40",
                  ].join(" ")}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-red-500 text-[10px] tracking-wide">{errors.email}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-[11px] font-bold tracking-[0.22em] uppercase py-4 transition-all duration-300 hover:bg-black/80 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                "Step Into the Spotlight"
              )}
            </button>
          </form>
          </div>

          {/* ── Success state ── */}
          <div
            ref={successRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-10 opacity-0 pointer-events-none"
            style={{ pointerEvents: submitted ? "auto" : "none" }}
          >
            {/* Check circle */}
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center mb-6">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-black/40 text-[10px] tracking-[0.25em] uppercase font-mono mb-3">
              [ You&apos;re In ]
            </p>
            <h3
              className="text-black font-black uppercase text-center leading-tight mb-4"
              style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)", letterSpacing: "-0.01em" }}
            >
              Welcome to the
              <br />
              Spotlight
            </h3>
            <p className="text-black/50 text-sm text-center font-light leading-relaxed max-w-xs">
              You&apos;ll be the first to hear about upcoming performances and exclusive events.
            </p>
          </div>

          {/* Scalloped bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden" aria-hidden>
            <svg viewBox="0 0 420 24" preserveAspectRatio="none" className="w-full h-full">
              <path
                d={Array.from({ length: 21 }, (_, i) =>
                  i === 0
                    ? `M0,0 L0,8 Q${10},24 ${20},8`
                    : ` Q${i * 20 + 10},24 ${i * 20 + 20},8`
                ).join("") + " L420,0 Z"}
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
