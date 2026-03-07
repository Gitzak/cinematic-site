"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    issue: "001",
    category: "CRAFT",
    headline: "The Art of\nSilent Frames",
    excerpt:
      "How negative space and restrained sound design combine to create scenes that breathe — and linger.",
    image: "/images/1/arda-mutlu-NLl9bm5i4W8-unsplash.jpg",
    readTime: "6 min read",
    date: "MAR 2026",
  },
  {
    issue: "002",
    category: "DIRECTING",
    headline: "Blocking as\nChoreography",
    excerpt:
      "When every actor movement tells story — a breakdown of the methods behind the world's most kinetic directors.",
    image: "/images/1/donny-jiang-JlObw-79gpA-unsplash.jpg",
    readTime: "9 min read",
    date: "FEB 2026",
  },
  {
    issue: "003",
    category: "LIGHT",
    headline: "Painting with\nAvailable Light",
    excerpt:
      "Cinematographers on how ambient, practicals, and shadows sculpt emotion without a single studio fixture.",
    image: "/images/1/martyn-cooling-1Cp8IzYao6s-unsplash.jpg",
    readTime: "7 min read",
    date: "JAN 2026",
  },
  {
    issue: "004",
    category: "SOUND",
    headline: "The Score\nYou Don't Hear",
    excerpt:
      "Behind the scenes of films where silence itself becomes the most powerful instrument in the composer's kit.",
    image: "/images/2/ivan-mani-qsig-AaEbHM-unsplash.jpg",
    readTime: "5 min read",
    date: "DEC 2025",
  },
  {
    issue: "005",
    category: "COLOR",
    headline: "Grading the\nDark City",
    excerpt:
      "DPs and colorists reveal how a single LUT shifted the emotional register of an entire film.",
    image: "/images/2/arthur-hinton-_aPu8w5nR6o-unsplash.jpg",
    readTime: "8 min read",
    date: "NOV 2025",
  },
  {
    issue: "006",
    category: "TEXTURE",
    headline: "Grain as\nExpression",
    excerpt:
      "Why a new generation of filmmakers is choosing film grain over digital clarity — and what it costs them.",
    image: "/images/2/adrian-regeci-ZCfiOl8QAms-unsplash.jpg",
    readTime: "6 min read",
    date: "OCT 2025",
  },
  {
    issue: "007",
    category: "MOTION",
    headline: "The Restless\nCamera",
    excerpt:
      "Inside the philosophy of handheld work — when instability becomes the story's truest narrator.",
    image: "/images/2/ali-tayyebi-DvsW6J0DqyQ-unsplash.jpg",
    readTime: "10 min read",
    date: "SEP 2025",
  },
  {
    issue: "008",
    category: "SPACE",
    headline: "Architecture\nof the Shot",
    excerpt:
      "How production designers and cinematographers build visual worlds that think for the audience.",
    image: "/images/1/arda-mutlu-NLl9bm5i4W8-unsplash.jpg",
    readTime: "7 min read",
    date: "AUG 2025",
  },
];

const MARQUEE_CHUNK = Array.from({ length: 6 })
  .map(() => "EDITORIAL \u00a0\u00d7\u00a0 ")
  .join("");

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          x: "-50%",
          duration: 32,
          ease: "none",
          repeat: -1,
        });
      }

      // Heading reveal
      const headingParts = headingRef.current?.querySelectorAll(".reveal-part");
      if (headingParts?.length) {
        gsap.set(headingParts, { yPercent: 115, opacity: 0 });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(headingParts, {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.1,
            });
          },
        });
      }

      // Horizontal scroll
      const track = trackRef.current;
      if (!track) return;

      const getMaxX = () => -(track.scrollWidth - window.innerWidth + 80);

      const scrollAnim = gsap.to(track, {
        x: getMaxX,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.abs(getMaxX())}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Cards stagger in
      const cards = track.querySelectorAll<HTMLElement>(".blog-card");
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.09,
          });
        },
      });

      // Mouse drag
      let isDragging = false;
      let startX = 0;
      let startTranslate = 0;

      const getTranslate = () => {
        const matrix = new DOMMatrix(window.getComputedStyle(track).transform);
        return matrix.m41;
      };

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        startX = e.clientX;
        startTranslate = getTranslate();
        track.style.cursor = "grabbing";
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const maxX = getMaxX();
        const next = Math.min(0, Math.max(maxX, startTranslate + (e.clientX - startX)));
        gsap.set(track, { x: next });
        const progress = next / maxX;
        scrollAnim.scrollTrigger?.scroll(
          scrollAnim.scrollTrigger.start +
            progress * (scrollAnim.scrollTrigger.end - scrollAnim.scrollTrigger.start)
        );
      };

      const onMouseUp = () => {
        isDragging = false;
        track.style.cursor = "grab";
      };

      track.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      track.style.cursor = "grab";

      return () => {
        track.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="films"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Section label */}
      <div className="absolute top-8 left-8 md:left-16 flex items-center gap-3 z-20">
        <span className="block w-6 h-px bg-[#c8a84b]" />
        <span className="text-[#c8a84b] text-[9px] tracking-[0.28em] uppercase font-medium">
          Editorial
        </span>
      </div>

      {/* View all link */}
      <div className="absolute top-8 right-8 md:right-16 z-20">
        <a
          href="#"
          className="flex items-center gap-2 text-[#c8a84b] hover:opacity-80 transition-all duration-300 text-[9px] tracking-[0.2em] uppercase font-medium"
        >
          View All
          <svg className="w-3 h-3 stroke-current fill-none" viewBox="0 0 16 16" strokeWidth="1.5">
            <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* ── Redesigned heading ── */}
      <div
        ref={headingRef}
        className="absolute z-20"
        style={{ top: "clamp(56px,12vh,96px)", left: "clamp(2rem,8vw,10rem)" }}
      >
        {/* "STORIES" — large, condensed, white */}
        <div className="overflow-hidden">
          <h2
            className="reveal-part block font-black uppercase will-change-transform"
            style={{
              fontSize: "clamp(2rem,4.2vw,3.8rem)",
              letterSpacing: "0.04em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            STORIES
          </h2>
        </div>

        {/* Divider rule */}
        <div className="overflow-hidden my-2">
          <div
            className="reveal-part will-change-transform"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span
              style={{
                display: "block",
                width: "clamp(28px,4vw,52px)",
                height: 1,
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <span
              style={{
                display: "block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "rgba(184,134,11,0.6)",
              }}
            />
            <span
              style={{
                display: "block",
                width: "clamp(16px,2.5vw,32px)",
                height: 1,
                background: "rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>

        {/* "WE TELL" — smaller, outlined, wider tracking */}
        <div className="overflow-hidden">
          <h2
            className="reveal-part block font-black uppercase will-change-transform"
            style={{
              fontSize: "clamp(1rem,1.8vw,1.65rem)",
              letterSpacing: "0.32em",
              color: "transparent",
              lineHeight: 1,
              WebkitTextStroke: "1px rgba(200,168,75,0.85)",
            }}
          >
            WE TELL
          </h2>
        </div>
      </div>

      {/* Drag hint */}
      <div
        className="absolute z-20 flex items-center gap-2"
        style={{ bottom: "clamp(20px,4vh,36px)", left: "clamp(2rem,8vw,10rem)" }}
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          style={{ color: "#c8a84b" }}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M7 12h10M13 8l4 4-4 4" />
        </svg>
        <span
          className="text-[8px] tracking-[0.25em] uppercase font-medium"
          style={{ color: "#c8a84b" }}
        >
          Scroll or drag to explore
        </span>
      </div>

      {/* Marquee — bottom strip */}
      <div
        className="absolute bottom-[11%] left-0 w-full overflow-hidden pointer-events-none select-none z-20"
        aria-hidden
      >
        <div ref={marqueeRef} className="whitespace-nowrap will-change-transform" style={{ width: "200%" }}>
          <span
            className="text-white/[0.04] font-black uppercase"
            style={{ fontSize: "clamp(3rem,7vw,6rem)", letterSpacing: "-0.025em" }}
          >
            {MARQUEE_CHUNK}
            {MARQUEE_CHUNK}
          </span>
        </div>
      </div>

      {/* Horizontal track */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingTop: "clamp(130px,20vh,190px)" }}
      >
        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform select-none"
          style={{
            paddingLeft: "clamp(2rem,8vw,10rem)",
            paddingRight: "clamp(4rem,10vw,14rem)",
          }}
        >
          {ARTICLES.map((article) => (
            <ArticleCard key={article.issue} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: (typeof ARTICLES)[number] }) {
  return (
    <article
      className="blog-card relative shrink-0 overflow-hidden group cursor-pointer"
      style={{
        width: "clamp(260px,27vw,370px)",
        height: "clamp(360px,50vh,510px)",
        background: "#0a0a0a",
        boxShadow: "0 12px 48px rgba(0,0,0,0.75), 0 2px 8px rgba(0,0,0,0.5)",
        borderTop: "3px solid #c8a84b",
      }}
    >
        {/* Card body */}
        <div className="relative w-full h-full overflow-hidden">
        {/* Full-bleed image */}
        <div className="absolute inset-0">
          <Image
            src={article.image}
            alt={article.headline.replace("\n", " ")}
            fill
            draggable={false}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width:768px) 80vw, 30vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />
        </div>

        {/* Issue + category — top */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span
            className="font-black tabular-nums"
            style={{ fontSize: "clamp(0.58rem,0.85vw,0.72rem)", color: "#b8860b", letterSpacing: "0.12em" }}
          >
            №{article.issue}
          </span>
          <span className="block w-6 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
          <span
            className="font-semibold uppercase"
            style={{ fontSize: "clamp(0.5rem,0.75vw,0.65rem)", letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)" }}
          >
            {article.category}
          </span>
        </div>

        {/* Content — bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
          <h3
            className="text-white font-black uppercase leading-tight mb-3 whitespace-pre-line"
            style={{ fontSize: "clamp(1.1rem,2vw,1.65rem)", letterSpacing: "-0.02em" }}
          >
            {article.headline}
          </h3>
          <p
            className="font-light leading-relaxed mb-4"
            style={{ fontSize: "clamp(0.6rem,0.85vw,0.75rem)", color: "rgba(255,255,255,0.45)" }}
          >
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] tracking-widest uppercase font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>
                {article.date}
              </span>
              <span className="block w-3 h-px" style={{ background: "rgba(255,255,255,0.30)" }} />
              <span className="text-[9px] tracking-widest uppercase font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>
                {article.readTime}
              </span>
            </div>
            <div
              className="group/btn relative overflow-hidden flex items-center justify-center w-8 h-8 cursor-pointer"
              style={{ border: "1px solid #c8a84b" }}
            >
              {/* Ripple fill — sweeps left→right on hover */}
              <span
                className="absolute inset-0 origin-left scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 ease-out"
                style={{ background: "#c8a84b" }}
              />
              {/* Arrow — slides right on hover */}
              <svg
                className="relative z-10 w-3.5 h-3.5 fill-none transition-all duration-300 group-hover/btn:translate-x-0.5 stroke-[#c8a84b] group-hover/btn:stroke-black"
                viewBox="0 0 16 16"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        </div>
    </article>
  );
}
