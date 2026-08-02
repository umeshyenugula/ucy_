# Umesh Chandran Yenugula — Portfolio (React)

A React + Vite rewrite of the portfolio, addressing:

- Removed the terminal `$ whoami` boot block and the "Hyderabad, IN — Est. 2024" caption
- Removed the Core Coursework line from the Education card
- Skills section is now center-aligned
- Hero now shows a full-bleed background photo pulled from Unsplash as a placeholder —
  swap it out any time in `src/components/Hero.jsx` (the `HERO_IMG` constant at the top)
- Typeface swapped to a bold, clean sans pairing: **Manrope** (headings) + **Inter** (body/labels)
- Rebuilt every project's architecture diagram as a flexible, auto-sizing flow card
  (`src/components/ProjectDiagram.jsx`) instead of fixed-width SVG boxes — this is what
  fixes Quizzical's sub-text overflow, and the same component is reused for all 7 projects
  (including SecureVoice) so their visuals now scroll/hover-transition smoothly and consistently
- Projects grid and project detail layout are responsive down to small phones
- Ambient drifting gradient-blob background animation (`BackgroundFX.jsx`), respects
  `prefers-reduced-motion`
- Smooth scroll-reveal on every section via `IntersectionObserver` (`useReveal` hook)
- A short loading gate + live scroll-progress bar under the nav

## Running it

This sandbox has no internet access, so the dependencies could not be installed or the
build verified end-to-end here — every file was hand-written and syntax-checked with esbuild
(zero errors, and the full app bundles cleanly), but you'll want to do one real `npm run dev`
locally before you consider it final.

```bash
npm install
npm run dev       # local dev server
npm run build     # production build, outputs to dist/
```

Requires Node 18+.

## Structure

```
src/
  components/   — all UI pieces (Hero, About, Skills, ProjectDiagram, etc.)
  pages/        — Home.jsx and Projects.jsx (the two "pages" of the old site)
  data/         — projects.js, the single source of truth for all 7 project entries
  hooks/        — useReveal (scroll animations), useScrollProgress
  index.css     — all styles, fonts, palette, responsive rules, animations
```

## Things worth doing next

- Swap `HERO_IMG` in `Hero.jsx` for your own photo
- Replace the "Live Demo" placeholder links in `ProjectCard.jsx` / `data/projects.js`
  with real deployed URLs once available
- Double check the Manrope/Inter weights render the way you want at your actual screen sizes
