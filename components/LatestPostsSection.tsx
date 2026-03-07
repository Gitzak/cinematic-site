"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const POSTS = [
  {
    index: "01",
    image: "/images/2/adrian-regeci-ZCfiOl8QAms-unsplash.jpg",
    caption: "Golden hour on set. Every frame tells a story worth remembering.",
    likes: "4.2K",
    comments: "138",
    tag: "@cinematicstudio",
    hashtag: "#BehindTheScenes",
    frame: "35mm",
  },
  {
    index: "02",
    image: "/images/2/ali-tayyebi-DvsW6J0DqyQ-unsplash.jpg",
    caption: "New chapter. New light. Same obsession with craft.",
    likes: "6.8K",
    comments: "214",
    tag: "@cinematicstudio",
    hashtag: "#FilmLife",
    frame: "16mm",
  },
  {
    index: "03",
    image: "/images/2/arthur-hinton-_aPu8w5nR6o-unsplash.jpg",
    caption: "Silence before the first take. Pure cinema.",
    likes: "3.1K",
    comments: "97",
    tag: "@cinematicstudio",
    hashtag: "#OnSet",
    frame: "35mm",
  },
  {
    index: "04",
    image: "/images/2/ivan-mani-qsig-AaEbHM-unsplash.jpg",
    caption: "The story lives in the details no one else notices.",
    likes: "5.5K",
    comments: "182",
    tag: "@cinematicstudio",
    hashtag: "#CinematicMoments",
    frame: "IMAX",
  },
  {
    index: "05",
    image: "/images/1/arda-mutlu-NLl9bm5i4W8-unsplash.jpg",
    caption: "Between action and cut, a whole lifetime passes.",
    likes: "7.2K",
    comments: "301",
    tag: "@cinematicstudio",
    hashtag: "#DarkCinema",
    frame: "16mm",
  },
  {
    index: "06",
    image: "/images/1/donny-jiang-JlObw-79gpA-unsplash.jpg",
    caption: "Some shots are painted with darkness, not light.",
    likes: "9.1K",
    comments: "427",
    tag: "@cinematicstudio",
    hashtag: "#NightShoot",
    frame: "35mm",
  },
  {
    index: "07",
    image: "/images/1/martyn-cooling-1Cp8IzYao6s-unsplash.jpg",
    caption: "The lens sees what the eye forgets to feel.",
    likes: "8.4K",
    comments: "355",
    tag: "@cinematicstudio",
    hashtag: "#FilmGrain",
    frame: "IMAX",
  },
  {
    index: "08",
    image: "/images/2/ali-tayyebi-DvsW6J0DqyQ-unsplash.jpg",
    caption: "Every shadow holds the weight of an untold story.",
    likes: "4.9K",
    comments: "167",
    tag: "@cinematicstudio",
    hashtag: "#StudioLife",
    frame: "16mm",
  },
];

export default function LatestPostsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Mouse drag — offset the GSAP x without conflicting with ScrollTrigger
      let isDragging = false;
      let startX = 0;
      let startTranslate = 0;
      let currentX = 0;

      const getTranslate = () => {
        const style = window.getComputedStyle(track);
        const matrix = new DOMMatrix(style.transform);
        return matrix.m41;
      };

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        startX = e.clientX;
        startTranslate = getTranslate();
        currentX = startTranslate;
        track.style.cursor = "grabbing";
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        const maxX = getMaxX();
        currentX = Math.min(0, Math.max(maxX, startTranslate + delta));
        gsap.set(track, { x: currentX });
        // Keep ScrollTrigger progress in sync
        const progress = currentX / maxX;
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
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-neutral-950"
      style={{ height: "100svh" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Section label */}
      <div className="absolute top-8 left-8 md:left-16 flex items-center gap-3 z-20">
        <span className="block w-6 h-px" style={{ background: "#c8a84b" }} />
        <span className="text-[9px] tracking-[0.28em] uppercase font-medium" style={{ color: "#c8a84b" }}>
          Latest Posts
        </span>
      </div>

      {/* Instagram link */}
      <div className="absolute top-8 right-8 md:right-16 z-20">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-colors duration-300"
          style={{ color: "#c8a84b" }}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Follow</span>
        </a>
      </div>

      {/* Heading */}
      <div
        className="absolute left-8 md:left-16 z-20"
        style={{ top: "clamp(60px,14vh,110px)" }}
      >
        <p
          className="font-black uppercase leading-none"
          style={{ fontSize: "clamp(2.4rem,6vw,5.5rem)", letterSpacing: "-0.03em"}}
        >
          LATEST
        </p>
        <p
          className="font-black uppercase leading-none"
          style={{
            fontSize: "clamp(2.4rem,6vw,5.5rem)",
            letterSpacing: "-0.03em",
            WebkitTextStroke: "1px rgba(200,168,75,0.85)",
            color: "transparent",
          }}
        >
          POSTS
        </p>
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
        <span className="text-[8px] tracking-[0.25em] uppercase font-medium" style={{ color: "#c8a84b" }}>
          Scroll or drag to explore
        </span>
      </div>

      {/* Horizontal track */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ paddingTop: "clamp(100px,16vh,140px)" }}
      >
        <div
          ref={trackRef}
          className="flex gap-6 will-change-transform select-none"
          style={{
            paddingLeft: "clamp(2rem,8vw,10rem)",
            paddingRight: "clamp(4rem,10vw,14rem)",
          }}
        >
          {POSTS.map((post) => (
            <div
              key={post.index}
              className="shrink-0"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: (typeof POSTS)[number] }) {
  const cardW = "clamp(210px,22vw,310px)";

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: cardW,
        background: "#111",
        borderTop: "3px solid #c8a84b",
        boxShadow: "0 8px 40px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(210px,22vw,310px)" }}
      >
        <Image
          src={post.image}
          alt={post.caption}
          fill
          className="object-cover"
          draggable={false}
          sizes="(max-width:768px) 80vw, 26vw"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Frame type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[8px] font-black tracking-[0.22em] uppercase px-2 py-0.5"
            style={{
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(184,134,11,0.5)",
              color: "#e8c060",
              backdropFilter: "blur(4px)",
            }}
          >
            {post.frame}
          </span>
        </div>

        {/* Hashtag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white/80 text-[9px] font-bold tracking-widest uppercase">
            {post.hashtag}
          </span>
        </div>

        {/* Plus button */}
        <div
          className="absolute bottom-3 right-3 w-7 h-7 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Thin amber line between image and caption */}
      <div style={{ height: 1, background: "rgba(184,134,11,0.3)" }} />

      {/* Caption strip — dark */}
      <div className="px-4 pt-3 pb-3" style={{ background: "#0f0f0f" }}>
        <p className="text-[8px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: "#6b6b6b" }}>
          {post.tag}
        </p>
        <p
          className="font-medium text-white/80 truncate"
          style={{ fontSize: "clamp(0.58rem,1vw,0.76rem)" }}
        >
          {post.caption}
        </p>
        <div className="flex items-center gap-4 mt-2.5">
          <span
            className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{ color: "#c8a84b" }}
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {post.likes}
          </span>
          <span
            className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <svg
              className="w-3.5 h-3.5 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            {post.comments}
          </span>
          {/* Frame index */}
          <span
            className="ml-auto text-[8px] font-black tracking-[0.15em] uppercase"
            style={{ color: "rgba(200,168,75,0.7)" }}
          >
            {post.index}
          </span>
        </div>
      </div>

    </div>
  );
}
