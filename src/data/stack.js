// The stack, layer by layer, each tool tied to the system that uses it. The page draws it as a periodic
// table: every tool is an element.
//   n     name shown in the inspector          s     two-letter symbol (capital + lower case, unique)
//   p     project ids that use it (see below)  note  one line shown in the inspector
//   short optional shorter name for the tile, when `n` is too long to fit
// The atomic number is the tool's position in this file, top to bottom, so reordering renumbers the table.
// An empty `p` means "in my toolkit, but not part of these three systems", which the page shows honestly
// as the Toolkit compound (dashed tiles, no electrons) rather than claiming it.
// Layer hues stay at least 30 degrees away from the project hues, so a tile's colour (its layer) is never
// mistaken for an electron's colour (its project).
export const PROJECTS = [
  { id: 'jnana-setu', label: 'JñānaSetu', hue: 262 },
  { id: 'vidura-niti', label: 'ViduraNīti', hue: 158 },
  { id: 'flasio', label: 'Flasio', hue: 38 },
]
const J = 'jnana-setu'
const V = 'vidura-niti'
const F = 'flasio'

// Listed top to bottom: a request enters at the Interface and falls through to the Runtime.
export const LAYERS = [
  {
    id: 'interface', name: 'Interface', tag: 'What people touch', hue: 232,
    items: [
      { n: 'React', s: 'Re', p: [J, V], note: 'JñānaSetu admin dashboard and chat widget; the ViduraNīti web app.' },
      { n: 'Vite', s: 'Vi', p: [J, V], note: 'Separate Vite builds for the dashboard and the iframe widget.' },
      { n: 'TypeScript', s: 'Ts', p: [J, V], note: 'Typed front ends end to end.' },
      { n: 'TanStack Query', s: 'Tq', p: [V], note: 'Server-state cache and invalidation. Never the authority for payments.' },
      { n: 'IndexedDB', s: 'Ix', p: [V], note: 'Persistent client cache for speed, never trusted for authorization.' },
      { n: 'Next.js', s: 'Nx', p: [], note: 'In my toolkit for full-stack front ends; not part of these three systems.' },
      { n: 'Tailwind CSS', s: 'Tw', p: [], note: 'In my toolkit; not part of these three systems.' },
    ],
  },
  {
    id: 'services', name: 'Services', tag: 'Where the logic lives', hue: 198,
    items: [
      { n: 'Go', s: 'Go', p: [J], note: 'The modular API: identity, ingestion, retrieval, inference and chat in one container.' },
      { n: 'Python', s: 'Py', p: [J, V, F], note: 'The embedding worker, the ViduraNīti backend, and the Flasio framework itself.' },
      { n: 'FastAPI', s: 'Fa', p: [J, V], note: 'ViduraNīti backend (ten domains) and the JñānaSetu embedding worker.' },
      { n: 'Flasio framework', s: 'Fl', p: [F], note: 'My own async-first ASGI framework, published on PyPI.' },
      { n: 'ASGI · Uvicorn', s: 'As', p: [F], note: 'The contract Flasio implements: app(scope, receive, send).' },
      { n: 'REST APIs', s: 'Rs', p: [J, V, F], note: 'Versioned JSON APIs with explicit error envelopes.' },
      { n: 'WebSockets', s: 'Ws', p: [V], note: 'Live approval and payment status updates.' },
      { n: 'Django', s: 'Dj', p: [], note: 'In my toolkit; not part of these three systems.' },
      { n: 'Flask', s: 'Fk', p: [], note: 'In my toolkit, and the API style Flasio keeps familiar.' },
    ],
  },
  {
    id: 'data', name: 'Data', tag: 'What the system remembers', hue: 120,
    items: [
      { n: 'PostgreSQL', s: 'Pg', p: [J, V], note: 'JñānaSetu tenancy and chunks; ViduraNīti source of truth for money.' },
      { n: 'pgvector', s: 'Pv', p: [J], note: 'HNSW search over 384-dimension embeddings, filtered by tenant.' },
      { n: 'Supabase', s: 'Sb', p: [J, V], note: 'Managed Postgres, Auth and private Storage.' },
      { n: 'Redis', s: 'Rd', p: [V], note: 'Cache and job queue only, never the financial source of truth.' },
      { n: 'asyncpg · aiosqlite', short: 'asyncpg · sqlite', s: 'Ap', p: [F], note: 'Optional Flasio database services with startup-managed pools.' },
      { n: 'MongoDB', s: 'Mg', p: [], note: 'In my toolkit; not part of these three systems.' },
      { n: 'Neo4j Aura', s: 'Ne', p: [], note: 'In my toolkit; not part of these three systems.' },
    ],
  },
  {
    id: 'intelligence', name: 'Intelligence', tag: 'Where the models run', hue: 300,
    items: [
      { n: 'llama.cpp', s: 'Ll', p: [J], note: 'Self-hosted inference server on a private network.' },
      { n: 'Qwen3-4B', s: 'Qw', p: [J], note: 'Local GGUF model (Q4_K_M) that writes grounded answers.' },
      { n: 'MiniLM-L6-v2', s: 'Ml', p: [J], note: 'sentence-transformers embeddings, 384 dimensions, run locally.' },
      { n: 'RAG', s: 'Ra', p: [J], note: 'Retrieval-augmented answers with verified sources and an honest fallback.' },
      { n: 'ML anomaly scoring', short: 'Anomaly scoring', s: 'An', p: [V], note: 'Scores spend requests and escalates risky ones to a human.' },
      { n: 'Groq (optional)', s: 'Gq', p: [V], note: 'Task interpretation only, never a financial authority.' },
    ],
  },
  {
    id: 'trust', name: 'Trust & money', tag: 'What keeps it honest', hue: 346,
    items: [
      { n: 'JWT', s: 'Jw', p: [J, F], note: 'Supabase JWTs in JñānaSetu; token helpers in Flasio.' },
      { n: 'Row-level security', s: 'Rl', p: [J], note: 'Tenant isolation enforced in the database.' },
      { n: 'Idempotency keys', s: 'Id', p: [V], note: 'Retries and duplicates can never move money twice.' },
      { n: 'x402', s: 'Xp', p: [V], note: 'The mandatory HTTP 402 payment path for every spend.' },
      { n: 'Algorand', s: 'Al', p: [V], note: 'Settlement. A payment is SETTLED only after confirmation is verified.' },
      { n: 'HTTPS / TLS', s: 'Tl', p: [J], note: 'TLS at the proxy; internal services are never public.' },
      { n: 'OAuth 2.0', s: 'Oa', p: [F], note: 'OAuth2 option for the Flasio email service.' },
    ],
  },
  {
    id: 'runtime', name: 'Runtime', tag: 'How it ships and stays visible', hue: 76,
    items: [
      { n: 'Docker Compose', s: 'Dk', p: [J], note: 'API, widget, dashboard, embeddings and LLM as separate containers.' },
      { n: 'Prometheus', s: 'Pm', p: [J], note: 'Scrapes an authenticated metrics endpoint.' },
      { n: 'Grafana', s: 'Gf', p: [J], note: 'Dashboards and alerts over those metrics.' },
      { n: 'OpenTelemetry', s: 'Ot', p: [J], note: 'Optional OTLP traces from the Go API.' },
      { n: 'Cloudinary', s: 'Cl', p: [V, F], note: 'Reports and invoices (ViduraNīti); upload helper (Flasio).' },
      { n: 'PyPI', s: 'Pp', p: [F], note: 'Flasio is published and installable with pip.' },
      { n: 'Git · GitHub', s: 'Gh', p: [J, V, F], note: 'All three systems are open on GitHub.' },
      { n: 'Linux', s: 'Lx', p: [], note: 'In my toolkit; not part of these three systems.' },
    ],
  },
]

// A compound is something you can pick on the table: one of the projects, or the Toolkit.
export const COMPOUNDS = [
  ...PROJECTS.map((p) => ({ ...p, to: `/work/${p.id}` })),
  { id: 'toolkit', label: 'Toolkit', hue: 220, soft: true, to: '/about' },
]

// flat technology list. `z` is the atomic number (1-based position), `col` the column within its layer.
export const techList = () => {
  let z = 0
  return LAYERS.flatMap((L, layer) => L.items.map((t, col) => ({ ...t, z: ++z, layer, col, layerName: L.name, layerTag: L.tag, hue: L.hue })))
}
export const inCompound = (t, id) => (id === 'toolkit' ? t.p.length === 0 : t.p.includes(id))
export const countFor = (id) => techList().filter((t) => inCompound(t, id)).length

// Symbols must be unique and shaped like real ones. Cheap check, development only.
if (import.meta.env?.DEV) {
  const seen = new Set()
  techList().forEach((t) => {
    if (!/^[A-Z][a-z]$/.test(t.s || '')) console.warn(`[stack] "${t.n}" needs a two-letter symbol like "Go" (got "${t.s}")`)
    if (seen.has(t.s)) console.warn(`[stack] symbol "${t.s}" is used twice`)
    seen.add(t.s)
  })
}
