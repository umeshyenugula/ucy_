# Umesh Chandran Yenugula — Portfolio (React)


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

