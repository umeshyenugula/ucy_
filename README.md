# UCY_ — Umesh Chandran Yenugula, Portfolio v3.1

React 19 + Vite. Multipage (real URLs), dark and light themes, scroll-driven story on the home page.
No animation, diagram or router libraries: about 73 kB gzipped core JS plus a lazy-loaded ~5 kB chunk per project, one self-hosted variable font (Geist).

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the build
```

Node 18+.

## Pages

| URL | What it is |
| --- | --- |
| `/` | The story: hero, five story beats with supporting panels, proof, work, closing call to action |
| `/work` | Index of the three flagship projects |
| `/work/jnana-setu` | JñānaSetu: live architecture with four scenarios (answer, refuse to guess, ingest, trust boundaries) |
| `/work/vidura-niti` | ViduraNīti: spend control-room simulator (amount, ML risk, approver, Algorand outcome) |
| `/work/flasio` | Flasio: request lifecycle, failing handler, opt-in services and CLI startup (from ARCHITECTURE.md) |
| `/stack` | The stack as a periodic table: every tool is an element, pick a project and its formula assembles and its elements bond |
| `/about` | Education, leadership, hackathon, stack, coursework, coding profiles |
| `/contact` | Email (always one line), links, local time |

**Deploying:** the site uses real paths, so the host must serve `index.html` for unknown URLs.
`vercel.json` (Vercel) and `public/_redirects` (Netlify, Render static sites) are included.
GitHub Pages needs a `404.html` copy of `index.html`.

## The Stack page (`/stack`)

Everything on it comes from one data file, `src/data/stack.js`: six layers (Interface, Services, Data, Intelligence, Trust & money, Runtime). Each tool has a name (`n`), a unique two-letter symbol (`s`, capital then lower case), the projects that use it (`p`) and a one-line note. The **atomic number is the tool's position in the file**, top to bottom, so reordering renumbers the table. A tool with an empty `p` belongs to the **Toolkit** compound, meaning "in my toolkit, but not part of these three systems": it gets a dashed tile and no electrons, so the page never claims more than the projects show. In development a console warning fires if a symbol is missing, malformed or used twice. Add `short` to a tool when its name is too long for a tile.

It is drawn by `src/components/PeriodicStack.jsx` (styles: the "periodic table" block at the end of `src/index.css`). No libraries.

- **Table**: one row per layer, nine columns on a laptop (Services, the widest layer, has nine tools). Tile colour is the layer; layer hues are kept 30 degrees or more away from the project hues so a tile is never mistaken for an electron. Under 1100px the layer name moves above its tiles and the table reflows to six columns; under 760px, three columns.
- **Electrons**: one dot per project that uses the tool, each project on its own tilted orbital plane and period (`ORBIT` in the component). Pure CSS: a tilted plane, squashed to an ellipse, a revolving arm and a counter-rotating dot so it stays round. They pause when the table is off screen or a tile is dimmed.
- **Compounds**: the picker (JñānaSetu, ViduraNīti, Flasio, Toolkit; click the active one again to see the whole table). The formula is every member in atomic-number order and assembles term by term, the members light up in the compound's colour in the same order, and everything else steps back.
- **Bond web**: drawn after the tiles are measured (and again on resize) as the minimum spanning tree of the lit tiles plus every pair that touches, from the lower atomic number to the higher, so the flow runs interface to runtime. It describes the table, not the call graph; the architecture pages do that. Toolkit bonds are dashed and static. Hidden on phones.
- **Tilting tiles**: on a mouse, a tile tilts toward the pointer (CSS variables written straight to the element, no React state). Touch and reduced motion get no tilt.
- **Inspector dock**: sticks to the bottom of the screen while the table is in view. Hover or keyboard focus previews an element, click or tap pins it (Unpin or Escape releases it); with nothing selected it summarises the compound. A pinned element's bond chips link to the project pages.
- **Keyboard and screen readers**: tiles are buttons with a full label (name, symbol, number, layer, projects), one tab stop for the whole table with arrow keys to move between tiles, the dock is a live region, and the formula has a plain-text equivalent.
- **Reduced motion**: no assembly animation, no orbiting (electrons rest at fixed angles), bonds drawn static.
- Gotcha worth knowing: paint order inside the table is tile faces, then the bond web, then tile contents, so bonds run behind symbols. That only works while a resting tile does not form a stacking context, so do not add `transform`, `opacity`, `filter` or `z-index` to `.pt-tile` itself. Dimmed and hovered tiles may, because they are meant to leave that layering.

## How the scroll story works

`src/hooks.js` keeps one shared scroll loop. `useScene` writes the section's progress to a CSS variable
(`--p`, 0 to 1) and the stylesheet derives every beat from it with `calc()` and `clamp()`. There is no
per-frame React rendering. Edit the copy in `src/pages/Home.jsx` (`STORY`, `PROOF` arrays).

- `components/Hero.jsx` word-by-word load-in, "can trust." gains weight as you scroll
- `components/BeatScene.jsx` pinned scene, one beat at a time, count-up numbers
- `components/WorkStack.jsx` stacking cards that recede as the next arrives
- `components/Wordmark.jsx` footer name: fixed-width letter boxes, idle weight wave, swells toward the pointer
- `components/ArchStage.jsx` interactive architecture engine
- `components/FitText.jsx` fits the contact email to one line at any width
- `components/Backdrop.jsx` slow drifting grid and soft glows

## Flagship architecture visuals

`src/components/ArchStage.jsx` is a small engine: a **model** (zones + nodes with x/y) and a list of **steps**
(`from`, `to`, `label`, `text`, `log`, optional `rail`, or a spotlight step with `hot: [ids]`). Edges are routed
automatically from node sides (`fs` / `ts` = `l r t b` to force a side), a packet animates each edge, and the live
trace, state rail and inspector follow along. Play/pause, step, speed, click-a-node, and keyboard all work; it pauses
off screen and does not autoplay under `prefers-reduced-motion`.

- `src/viz/JnanaSetuViz.jsx` model + scenarios from the JñānaSetu architecture doc
- `src/viz/ViduraNitiViz.jsx` model + `plan()` which builds the step list from the simulator inputs
- `src/viz/FlasioViz.jsx` model + scenarios from Flasio's ARCHITECTURE.md

To change a flow, edit the step arrays. To add a project visual, add a `viz` key in `src/data/projects.js` and register it in `src/pages/Project.jsx`.

## Editing content

- Projects: `src/data/projects.js` (repo and PyPI links, `liveLabel`, and the "Proves" chips live here)
- The "Skills, with receipts" table: `PROOF_MAP` in `src/data/profile.js`
- Skills, courses, profiles, email: `src/data/profile.js`
- Home story copy: `STORY` and `PROOF` in `src/pages/Home.jsx`
- Colours: CSS variables at the top of `src/index.css`; background motion is `Backdrop.jsx` + `.bg*` rules

## SEO

The site is a single-page app, so search engines and link-preview bots get their content from a build step:

- `npm run build` runs `vite build` and then `scripts/seo.mjs`, which writes a real HTML file for every route (`/`, `/work`, `/about`, `/contact`, each `/work/<id>`) plus `404.html`. Each has its own `<title>`, description, canonical URL, Open Graph and Twitter tags, JSON-LD, and crawlable text inside `#root` (React replaces it on load, with no flash).
- **Set your domain before deploying:** `SITE_URL=https://your-domain.com npm run build` (or copy `.env.example` to `.env`). That enables canonical links, `og:image`, structured data and `sitemap.xml`, and adds the sitemap line to `robots.txt`. Without it the build still works and prints a warning.
- Metadata and structured data live in one place, `src/seo.js` (Person, WebSite, CollectionPage, ProfilePage, ContactPage, SoftwareSourceCode and breadcrumbs). `src/seo-runtime.js` keeps the head correct during in-app navigation. The 404 page is `noindex`.
- `public/og.png` is the 1200x630 share image. After deploying, submit `/sitemap.xml` in Google Search Console.

## Scroll behaviour

Scene progress (`src/hooks.js`) is eased toward the scroll position, so animation never jerks. Story scenes also cap how fast they may advance (`beatSeconds`, default 1 s per beat), so even a hard fling leaves every beat on screen long enough to read.

## Accessibility and performance

- `prefers-reduced-motion`: pinned scenes become a normal static page, no scrubbing or looping animation.
- Theme follows the system until you toggle, then persists. It is set before first paint, so no flash.
- Skip link, keyboard-visible focus, semantic landmarks, responsive from 320px up.
- Loops (architecture stages, footer wordmark) pause when off screen. The background is transform-only and stops for reduced motion.
