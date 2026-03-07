"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "Studio", id: "studio" },
  { label: "Work", id: "work" },
  { label: "Actors", id: "actors" },
  { label: "Stories", id: "stories" },
  { label: "Contact", id: "contact" },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileLinksRef = useRef<(HTMLLIElement | HTMLDivElement | null)[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = linksRef.current?.querySelectorAll("li");

      gsap.set([logoRef.current, ctaRef.current], { opacity: 0, y: -16 });
      gsap.set(items ?? [], { opacity: 0, y: -12 });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .to(
          items ?? [],
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 },
          "-=0.45"
        )
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Glass effect on scroll (navbar stays fixed always)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu timeline
  useEffect(() => {
    if (!mobileMenuRef.current || !overlayRef.current) return;

    const mobileLinks = mobileLinksRef.current.filter(Boolean);
    const [l1, l2, l3] = menuLineRefs.current;

    menuTl.current = gsap.timeline({ paused: true })
      .to(overlayRef.current, { opacity: 1, pointerEvents: "all", duration: 0.4, ease: "power2.inOut" })
      .to(mobileMenuRef.current, { x: 0, duration: 0.5, ease: "power4.out" }, "-=0.3")
      .to(l1, { y: 6, rotate: 45, duration: 0.3, ease: "power2.inOut" }, "<")
      .to(l2, { opacity: 0, duration: 0.2 }, "<")
      .to(l3, { y: -6, rotate: -45, duration: 0.3, ease: "power2.inOut" }, "<")
      .to(mobileLinks, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power3.out",
      }, "-=0.2");

    return () => {
      menuTl.current?.kill();
    };
  }, []);

  const toggleMenu = () => {
    if (!menuOpen) {
      // Reset mobile links before opening
      gsap.set(mobileLinksRef.current.filter(Boolean), { opacity: 0, x: 40 });
      menuTl.current?.play();
    } else {
      menuTl.current?.reverse();
    }
    setMenuOpen((v) => !v);
  };

  const closeMenu = () => {
    if (menuOpen) {
      menuTl.current?.reverse();
      setMenuOpen(false);
    }
  };

  // Logo hover — nudge right 3px, stay on Y axis
  const handleLogoEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 3, duration: 0.2, ease: "power2.out" });
  };
  const handleLogoLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
  };

  // Nav link hover — lift 2px on Y
  const handleLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { y: -2, duration: 0.2, ease: "power2.out" });
  };
  const handleLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={[
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 md:h-20 transition-colors duration-500",
          scrolled
            ? "bg-black/60 backdrop-blur-lg"
            : "bg-transparent",
        ].join(" ")}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          ref={logoRef}
          href="/"
          className="relative z-10 flex items-center gap-2 group select-none"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          <span className="text-white text-xl font-semibold tracking-[-0.03em] leading-none">
            CINE
            <span className="text-white/30 font-light">MA</span>
          </span>
          <span className="block w-1.5 h-1.5 rounded-full bg-white/70 group-hover:bg-white transition-colors duration-300" />
        </Link>

        {/* Desktop nav links */}
        <ul
          ref={linksRef}
          className="hidden md:flex items-center gap-8 list-none m-0 p-0"
          role="list"
        >
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
                className="relative text-white/60 hover:text-white text-sm tracking-[0.06em] uppercase font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                onMouseEnter={handleLinkEnter}
                onMouseLeave={handleLinkLeave}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            ref={ctaRef}
            href="#"
            className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium tracking-wide text-black bg-white transition-all duration-300 hover:bg-white/90 active:scale-95"
          >
            <span className="relative z-10">Watch Reel</span>
            {/* Shine sweep */}
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="relative z-50 flex md:hidden flex-col justify-center items-center w-10 h-10 gap-[6px]"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => { menuLineRefs.current[i] = el; }}
              className="block h-px bg-white origin-center"
              style={{ width: i === 1 ? "1.25rem" : "1.5rem" }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile overlay backdrop */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 z-40 bg-black/50 opacity-0 pointer-events-none md:hidden"
      />

      {/* Mobile drawer */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-black border-l border-white/[0.07] flex flex-col pt-24 pb-12 px-8 md:hidden"
        style={{ transform: "translateX(100%)" }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="flex flex-col gap-1 list-none m-0 p-0 flex-1">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.id}
              ref={(el) => { mobileLinksRef.current[i] = el; }}
              style={{ opacity: 0, transform: "translateX(40px)" }}
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(link.id); closeMenu(); }}
                className="block py-3 text-2xl font-semibold tracking-[-0.02em] text-white/50 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          ref={(el) => { mobileLinksRef.current[NAV_LINKS.length] = el; }}
          style={{ opacity: 0, transform: "translateX(40px)" }}
          className="mt-8"
        >
          <Link
            href="#"
            onClick={closeMenu}
            className="flex items-center justify-center w-full rounded-full px-5 py-3 text-sm font-medium tracking-wide text-black bg-white hover:bg-white/90 transition-colors duration-200"
          >
            Watch Reel
          </Link>
        </div>

        <p className="mt-8 text-xs text-white/20 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Cinema Studio
        </p>
      </div>
    </>
  );
}
