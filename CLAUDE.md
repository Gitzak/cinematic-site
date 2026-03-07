# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16.1.6** with App Router (`app/` directory)
- **React 19**, **TypeScript** (strict mode)
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss` in `postcss.config.mjs`; use `@import "tailwindcss"` (not `@tailwind` directives)
- **GSAP 3** — the primary animation library; import from `"gsap"`
- **Geist** fonts — loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`

## Path Aliases

`@/*` maps to the repo root. Use `@/app/...`, `@/components/...`, etc.

## Architecture Notes

This is a fresh scaffold intended to become a cinematic/animated experience. The only page so far is `app/page.tsx`. New routes go under `app/` using Next.js App Router conventions (e.g. `app/about/page.tsx`).

CSS custom properties for theming live in `app/globals.css` under `:root` and `@theme inline`. Dark mode is handled via `prefers-color-scheme` media query — no manual class toggling.

GSAP animations should be initialized inside `useEffect` (or a `useLayoutEffect`) to avoid SSR issues. When animating on scroll, use `gsap.context()` for cleanup.
