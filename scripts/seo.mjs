// Post-build SEO step: node scripts/seo.mjs (runs automatically after `vite build`).
// Writes a real HTML file for every route with its own <title>, description, canonical, Open Graph,
// Twitter and JSON-LD tags plus crawlable text content, then sitemap.xml and robots.txt.
// Set SITE_URL (env or .env) to your production origin to enable absolute URLs, canonical links,
// og:image, structured data and the sitemap.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { projects } from '../src/data/projects.js'
import { LAYERS, PROJECTS } from '../src/data/stack.js'
import { SOCIALS, EMAIL, SKILLS, COURSES, PROOF_MAP } from '../src/data/profile.js'
import { allRoutes, headFor, routeMeta, NAME } from '../src/seo.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const env = loadEnv('production', root, '')
const origin = (env.SITE_URL || env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')
if (!origin) console.warn('\n[seo] SITE_URL is not set: building without canonical links, og:image, JSON-LD and sitemap.\n      Use: SITE_URL=https://your-domain.com npm run build\n')

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const attrs = (o) => Object.entries(o).filter(([k]) => k !== 'tag').map(([k, v]) => `${k}="${esc(v)}"`).join(' ')
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

function head(p) {
  const { title, tags, ld } = headFor(p, origin)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+(?:name|property)="(?:robots|og:[^"]*|twitter:[^"]*)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi, '')
  const block = [`<title>${esc(title)}</title>`, ...tags.map((t) => `<${t.tag} ${attrs(t)} />`), ...(ld.length ? [`<script type="application/ld+json" id="ld-json">${ldJson(ld.length === 1 ? ld[0] : ld)}</script>`] : [])].join('\n')
  return html.replace('</head>', `${block}\n</head>`)
}

const link = (to, text) => `<a href="${esc(to)}">${esc(text)}</a>`
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
const nav = `<nav aria-label="Primary">${ul([link('/', 'Home'), link('/work', 'Work'), link('/about', 'About'), link('/contact', 'Contact')])}</nav>`
const projectList = () => ul(projects.map((p) => `${link(`/work/${p.id}`, p.title)}: ${esc(p.tagline)}`))

function body(p) {
  const m = routeMeta(p)
  let main
  if (p === '/')
    main = `<h1>Full-stack systems you can trust.</h1><p>${esc(m.description)}</p>
<h2>Flagship systems</h2>${projectList()}
<h2>Skills, with receipts</h2>${ul(PROOF_MAP.map((r) => `${link(r.to, r.skill)}: ${esc(r.claim)}`))}
<h2>Stack</h2>${ul(SKILLS.map(([k, v]) => `${esc(k)}: ${esc(v.join(', '))}`))}`
  else if (p === '/stack')
    main = `<h1>Every tool, with a receipt.</h1><p>${esc(m.description)}</p>${LAYERS.map((L) => `<h2>${esc(L.name)}: ${esc(L.tag)}</h2>${ul(L.items.map((t) => `<strong>${esc(t.n)}</strong> (${t.p.length ? t.p.map((id) => esc(PROJECTS.find((x) => x.id === id).label)).join(', ') : 'toolkit'}): ${esc(t.note)}`))}`).join('')}`
  else if (p === '/work') main = `<h1>Work</h1><p>${esc(m.description)}</p>${projectList()}`
  else if (p === '/about')
    main = `<h1>About</h1><p>${esc(m.description)}</p><h2>Skills</h2>${ul(SKILLS.map(([k, v]) => `${esc(k)}: ${esc(v.join(', '))}`))}<h2>Coursework</h2><p>${esc(COURSES.join(', '))}</p>`
  else if (p === '/contact')
    main = `<h1>Let’s talk.</h1><p>${esc(m.description)}</p>${ul([link(`mailto:${EMAIL}`, EMAIL), ...SOCIALS.map(([n, u]) => link(u, n))])}<p>Based in Hyderabad, India.</p>`
  else {
    const pr = projects.find((x) => p === `/work/${x.id}`)
    if (!pr) return `${nav}<main><h1>Page not found</h1><p>${link('/', 'Back to the home page')}</p></main>`
    main = `<h1>${esc(pr.title)}</h1><p>${esc(pr.tagline)}</p><p>${esc(pr.description)}</p>
<h2>Proves</h2>${ul(pr.proves.map(esc))}
<h2>Decisions that carry it</h2>${ul(pr.bullets.map((b) => `<strong>${esc(b.b)}.</strong> ${esc(b.t)}`))}
<h2>Built with</h2>${ul(pr.stack.map((s) => esc(s.label)))}
<h2>Links</h2>${ul([pr.githubUrl && link(pr.githubUrl, 'Source on GitHub'), pr.liveDemoUrl && pr.liveDemoUrl !== '#' && link(pr.liveDemoUrl, pr.liveLabel || 'Live demo')].filter(Boolean))}`
  }
  return `${nav}<main>${main}</main>`
}

// The static copy sits visually clipped inside #root, so there is no flash: React replaces it on mount.
const clip = 'position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%)'
function page(p) {
  return head(p).replace('<div id="root"></div>', `<div id="root"><div style="${clip}">${body(p)}</div></div>`)
}

const write = (file, html) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}
for (const r of allRoutes()) write(r === '/' ? path.join(dist, 'index.html') : path.join(dist, r, 'index.html'), page(r))
write(path.join(dist, '404.html'), page('/__not-found__'))

const day = new Date().toISOString().slice(0, 10)
let robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').trimEnd() : 'User-agent: *\nAllow: /'
if (origin) {
  const prio = (r) => (r === '/' ? '1.0' : r === '/work' ? '0.9' : r === '/stack' ? '0.8' : r.startsWith('/work/') ? '0.8' : '0.6')
  write(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allRoutes().map((r) => `  <url><loc>${origin}${r === '/' ? '/' : r}</loc><lastmod>${day}</lastmod><priority>${prio(r)}</priority></url>`).join('\n')}\n</urlset>\n`,
  )
  robots = robots.replace(/^Sitemap:.*$/gim, '').trimEnd() + `\n\nSitemap: ${origin}/sitemap.xml`
}
write(path.join(dist, 'robots.txt'), robots + '\n')
console.log(`[seo] ${allRoutes().length} route pages + 404.html${origin ? ', sitemap.xml' : ''} written (${NAME}).`)
