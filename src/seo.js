// Single source of truth for page metadata and structured data.
// Used at runtime (src/seo-runtime.js, so client-side navigation updates the head) and at build time
// (scripts/seo.mjs writes a real HTML file per route). Plain JS, no browser APIs, safe in Node.
import { projects } from './data/projects.js'
import { SOCIALS } from './data/profile.js'
import { LAYERS, techList } from './data/stack.js'

export const NAME = 'Umesh Chandran Yenugula'
export const SITE_NAME = 'UCY — Umesh Chandran Yenugula'
export const ROLE = 'Full-Stack Engineer'
const COLLEGE = 'Gokaraju Rangaraju Institute of Engineering and Technology'
const KNOWS = ['React', 'Vite', 'Next.js', 'TypeScript', 'Go', 'Python', 'FastAPI', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs', 'Retrieval-augmented generation', 'ASGI']

export const allRoutes = () => ['/', '/work', '/stack', '/about', '/contact', ...projects.map((p) => `/work/${p.id}`)]

export function routeMeta(path) {
  if (path === '/')
    return {
      title: `${NAME} — Full-Stack Engineer, React & Go`,
      description: 'Full-stack engineer in React, Next.js, TypeScript, Go and Python. Three flagship systems with live, interactive architectures: JñānaSetu, ViduraNīti and Flasio.',
    }
  if (path === '/work')
    return {
      title: `Work — ${NAME}`,
      description: 'Three flagship systems with live architectures: JñānaSetu (multi-tenant RAG platform), ViduraNīti (AI-agent spending governance) and Flasio (async ASGI framework on PyPI).',
    }
  if (path === '/stack')
    return {
      title: `Stack — ${NAME}`,
      description: 'The full tech stack, layer by layer, each tool tied to the system that uses it: React, TypeScript, Go, Python, PostgreSQL, Redis, llama.cpp, Algorand and more.',
    }
  if (path === '/about')
    return {
      title: `About — ${NAME}`,
      description: `About ${NAME}: CSE undergraduate at GRIET (9.38 CGPA), 2nd place at a 24-hour AI hackathon, building full-stack systems in React, Go and Python.`,
    }
  if (path === '/contact')
    return {
      title: `Contact — ${NAME}`,
      description: `Contact ${NAME} for internships, collaborations and full-stack engineering work. Email, GitHub and LinkedIn.`,
    }
  const m = path.match(/^\/work\/([\w-]+)$/)
  const p = m && projects.find((x) => x.id === m[1])
  if (p)
    return {
      title: `${p.title} — ${p.category} · ${NAME}`,
      description: p.tagline,
    }
  return { title: `Page not found — ${NAME}`, description: 'This page does not exist.', noindex: true }
}

export function jsonLd(path, origin) {
  const id = (h) => `${origin}/#${h}`
  const person = {
    '@type': 'Person',
    '@id': id('person'),
    name: NAME,
    alternateName: 'UCY',
    jobTitle: ROLE,
    url: `${origin}/`,
    sameAs: SOCIALS.map((s) => s[1]),
    alumniOf: { '@type': 'CollegeOrUniversity', name: COLLEGE },
    address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
    knowsAbout: KNOWS,
  }
  const website = { '@type': 'WebSite', '@id': id('website'), url: `${origin}/`, name: SITE_NAME, inLanguage: 'en', publisher: { '@id': id('person') } }
  const crumbs = (items) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, to], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${origin}${to}` })),
  })
  const meta = routeMeta(path)
  let graph
  if (path === '/') graph = [website, person]
  else if (path === '/work')
    graph = [
      { '@type': 'CollectionPage', '@id': `${origin}/work#page`, url: `${origin}/work`, name: meta.title, description: meta.description, isPartOf: { '@id': id('website') }, about: { '@id': id('person') }, mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${origin}/work/${p.id}`, name: p.title })) } },
      crumbs([['Home', '/'], ['Work', '/work']]),
    ]
  else if (path === '/stack')
    graph = [
      { '@type': 'CollectionPage', '@id': `${origin}/stack#page`, url: `${origin}/stack`, name: meta.title, description: meta.description, isPartOf: { '@id': id('website') }, about: { '@id': id('person') }, mainEntity: { '@type': 'ItemList', numberOfItems: techList().length, itemListElement: techList().map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.n })) } },
      crumbs([['Home', '/'], ['Stack', '/stack']]),
    ]
  else if (path === '/about') graph = [{ '@type': 'ProfilePage', '@id': `${origin}/about#page`, url: `${origin}/about`, name: meta.title, description: meta.description, mainEntity: { '@id': id('person') } }, person, crumbs([['Home', '/'], ['About', '/about']])]
  else if (path === '/contact') graph = [{ '@type': 'ContactPage', '@id': `${origin}/contact#page`, url: `${origin}/contact`, name: meta.title, description: meta.description, about: { '@id': id('person') } }, person, crumbs([['Home', '/'], ['Contact', '/contact']])]
  else {
    const p = projects.find((x) => path === `/work/${x.id}`)
    if (!p) return []
    const sameAs = [p.liveDemoUrl].filter((u) => u && u !== '#' && /^https?:/.test(u))
    graph = [
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${origin}/work/${p.id}#code`,
        name: p.title,
        description: p.tagline,
        url: `${origin}/work/${p.id}`,
        ...(p.githubUrl ? { codeRepository: p.githubUrl } : {}),
        programmingLanguage: p.langs,
        keywords: (p.proves || []).join(', '),
        ...(sameAs.length ? { sameAs } : {}),
        author: { '@id': id('person') },
      },
      person,
      crumbs([['Home', '/'], ['Work', '/work'], [p.title, `/work/${p.id}`]]),
    ]
  }
  return [{ '@context': 'https://schema.org', '@graph': graph }]
}

// Everything that belongs in <head>, as plain data, so the browser and the build can share it.
export function headFor(path, origin) {
  const m = routeMeta(path)
  const url = origin ? `${origin}${path === '/' ? '/' : path}` : null
  const img = origin ? `${origin}/og.png` : null
  const tags = []
  const meta = (k, v, content) => content != null && tags.push({ tag: 'meta', [k]: v, content })
  meta('name', 'description', m.description)
  meta('name', 'robots', m.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
  meta('property', 'og:type', 'website')
  meta('property', 'og:site_name', SITE_NAME)
  meta('property', 'og:locale', 'en_IN')
  meta('property', 'og:title', m.title)
  meta('property', 'og:description', m.description)
  meta('name', 'twitter:card', img ? 'summary_large_image' : 'summary')
  meta('name', 'twitter:title', m.title)
  meta('name', 'twitter:description', m.description)
  if (url && !m.noindex) {
    tags.push({ tag: 'link', rel: 'canonical', href: url })
    meta('property', 'og:url', url)
  }
  if (img) {
    meta('property', 'og:image', img)
    meta('property', 'og:image:width', '1200')
    meta('property', 'og:image:height', '630')
    meta('property', 'og:image:alt', 'UCY — Full-stack systems you can trust: React, Vite, Next.js, TypeScript, Go and Python.')
    meta('name', 'twitter:image', img)
  }
  return { title: m.title, tags, ld: origin && !m.noindex ? jsonLd(path, origin) : [] }
}
