import { headFor } from './seo.js'

// Keeps <head> correct during client-side navigation. The build also writes the same tags into a
// static HTML file per route (scripts/seo.mjs), so crawlers that skip JavaScript still see them.
const keyOf = (t) => (t.tag === 'link' ? `link[rel="${t.rel}"]` : t.name ? `meta[name="${t.name}"]` : `meta[property="${t.property}"]`)

export function applySeo(path) {
  const origin = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '')
  const { title, tags, ld } = headFor(path, origin)
  document.title = title
  const keep = new Set()
  tags.forEach((t) => {
    const sel = keyOf(t)
    keep.add(sel)
    let el = document.head.querySelector(sel)
    if (!el) {
      el = document.createElement(t.tag)
      document.head.appendChild(el)
    }
    Object.entries(t).forEach(([k, v]) => k !== 'tag' && el.setAttribute(k, v))
  })
  // canonical and og:url must not linger on a page that no longer has them (e.g. the 404 page)
  ;['link[rel="canonical"]', 'meta[property="og:url"]'].forEach((sel) => {
    if (!keep.has(sel)) document.head.querySelector(sel)?.remove()
  })
  let s = document.getElementById('ld-json')
  if (!ld.length) return s && s.remove()
  if (!s) {
    s = document.createElement('script')
    s.type = 'application/ld+json'
    s.id = 'ld-json'
    document.head.appendChild(s)
  }
  s.textContent = JSON.stringify(ld.length === 1 ? ld[0] : ld)
}
