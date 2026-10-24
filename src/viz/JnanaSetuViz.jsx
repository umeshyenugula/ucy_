import { useState } from 'react'
import ArchStage, { StatusRail, TraceLog } from '../components/ArchStage.jsx'

// JñānaSetu, from the project architecture: browser → Go API modules → Supabase + private AI runtime.
const A = { x: 308, w: 140, h: 56 }
const B = { x: 492, w: 140, h: 56 }
const MODEL = {
  w: 1000,
  h: 640,
  zones: [
    { id: 'clients', label: 'BROWSER', x: 16, y: 20, w: 160, h: 600, hue: 210 },
    { id: 'api', label: 'GO API · ONE CONTAINER', x: 296, y: 20, w: 346, h: 600, hue: 155 },
    { id: 'db', label: 'SUPABASE · MANAGED', x: 700, y: 20, w: 284, h: 296, hue: 38 },
    { id: 'ai', label: 'LOCAL AI · PRIVATE NETWORK', x: 700, y: 340, w: 284, h: 280, hue: 275 },
  ],
  nodes: [
    { id: 'admin', zone: 'clients', label: 'Admin dashboard', sub: 'React · Auth', x: 26, y: 110, w: 140, h: 56, detail: 'React + Vite dashboard where a client administrator signs in, uploads documents, publishes or deactivates versions and watches processing status. It only ever holds the publishable key.' },
    { id: 'widget', zone: 'clients', label: 'Chat widget', sub: 'iframe · loader.js', x: 26, y: 430, w: 140, h: 56, detail: 'A tiny loader.js on the client site injects an isolated iframe. The widget talks only to the public chat and widget-config endpoints and renders answers as safe text plus source links.' },
    { id: 'proxy', zone: 'clients', hue: 210, label: 'HTTPS proxy', sub: 'TLS entry', x: 184, y: 292, w: 106, h: 56, detail: 'Public entry point in production. Terminates TLS and forwards to the Go API. The embedding worker and llama.cpp are never reachable from here.' },
    { id: 'm2', zone: 'api', ...A, y: 80, label: 'Knowledge', sub: 'M2 · versions', detail: 'Upload, immutable versions, publish and deactivate. Stores originals through the private-storage adapter and writes an outbox event in the same transaction as the metadata.' },
    { id: 'm1', zone: 'api', ...A, y: 250, label: 'Identity & tenant', sub: 'M1 · JWT · RBAC', detail: 'Verifies Supabase JWTs, resolves memberships and roles, and resolves the active widget to a trusted organization. Every other module asks it who the tenant is.' },
    { id: 'm6', zone: 'api', ...A, y: 470, label: 'Chat orchestration', sub: 'M6 · grounding', detail: 'Binds sessions to tenant and widget, loads bounded history, builds the grounded prompt, applies fallbacks and assembles verified sources.' },
    { id: 'm8', zone: 'api', ...A, y: 552, h: 50, label: 'Observability', sub: 'M8 · metrics', detail: 'Structured logs, metrics, traces, readiness and durable operational events. /api/v1/metrics requires a bearer token.' },
    { id: 'm3', zone: 'api', ...B, y: 160, label: 'Processing', sub: 'M3 · indexing', detail: 'Claims outbox jobs, fetches the exact immutable version, extracts, normalizes and chunks text, batches it to the embedding worker, then activates the complete version.' },
    { id: 'm4', zone: 'api', ...B, y: 290, label: 'Retrieval', sub: 'M4 · vectors', detail: 'Embeds the query, calls match_knowledge_chunks() with tenant and active-version filters, ranks results and decides whether the evidence is sufficient.' },
    { id: 'm5', zone: 'api', ...B, y: 470, label: 'Inference adapter', sub: 'M5 · guardrails', detail: 'Validated generation requests to llama.cpp with limits, timeouts, cancellation and runtime health. Returns text or a stable failure code.' },
    { id: 'auth', zone: 'db', label: 'Supabase Auth', sub: 'admin identities · JWT', x: 716, y: 60, w: 252, h: 48, detail: 'Issues and refreshes admin sessions. The Go API validates tokens against it (JWT / JWKS).' },
    { id: 'store', zone: 'db', label: 'Private Storage', sub: 'knowledge-originals', x: 716, y: 124, w: 252, h: 48, detail: 'Private bucket holding original uploads under server-generated version paths. Only the Go backend reads it, with server-side credentials.' },
    { id: 'pg', zone: 'db', label: 'PostgreSQL + pgvector', sub: 'RLS · HNSW · 384 dims', x: 716, y: 188, w: 252, h: 64, detail: 'Organizations, widgets, documents, versions, outbox, ingestion jobs, chunks with vectors, conversations and audit events. Retrieval is a read-only SQL function.' },
    { id: 'cron', zone: 'db', label: 'Supabase Cron', sub: 'retention 90 d / 180 d', x: 716, y: 264, w: 252, h: 40, detail: 'Daily jobs delete conversations older than 90 days and operational events older than 180 days.' },
    { id: 'embed', zone: 'ai', label: 'Embedding worker', sub: 'MiniLM-L6-v2 · 384 dims', x: 716, y: 392, w: 252, h: 60, detail: 'Python + FastAPI worker running sentence-transformers all-MiniLM-L6-v2 locally on an internal port. Used for both document chunks and customer queries.' },
    { id: 'llm', zone: 'ai', label: 'llama.cpp server', sub: 'Qwen3-4B Q4_K_M', x: 716, y: 500, w: 252, h: 60, detail: 'Self-hosted inference over local GGUF weights. Called only by the Go inference adapter with an internal service token.' },
  ],
}

const R = (from, to, label, text, log, o = {}) => ({ from, to, label, text, log, ...o })
const S = (hot, text, log, o = {}) => ({ hot, text, log, ...o })

const INGEST = [
  R('admin', 'proxy', 'POST /knowledge', 'The administrator uploads a document or submits text from the React dashboard, carrying a Supabase Auth JWT.', 'POST /api/v1/knowledge  Bearer <jwt>', { fs: 'b', ts: 't' }),
  R('proxy', 'm2', 'forward', 'The HTTPS proxy terminates TLS and forwards the request to the single Go API container.', '→ Knowledge management (M2)', { fs: 't', ts: 'l' }),
  R('m2', 'm1', 'authorize', 'Module 1 checks the principal and the organization permission before anything is stored.', 'authz.check(org, role=admin) → allow', { fs: 'b', ts: 't' }),
  S(['m1', 'auth'], 'The JWT is verified against Supabase Auth and the membership is read. Identity comes from the token, never from the request body.', 'jwt.verify ✓  membership=org_admin'),
  R('m2', 'store', 'original bytes', 'The original bytes go to the private knowledge-originals bucket under a server-generated version path.', 'storage.put originals/{org}/{doc}/v3', { fs: 'r', ts: 'l' }),
  S(['m2', 'pg'], 'Document, version metadata and a processing outbox event commit in one transaction. The dashboard immediately gets a pending status.', 'tx.commit documents + versions + outbox', { rail: 'pending' }),
  R('m2', 'm3', 'outbox event', 'The outbox relay hands the event to processing, so a crash between “saved” and “queued” cannot lose work.', 'outbox.relay → ingestion job', { fs: 'r', ts: 'l' }),
  R('m3', 'pg', 'claim job', 'Module 3 claims the job with an idempotency key. Duplicate deliveries do nothing.', 'job.claim idem=ing_91c4  → running', { fs: 'r', ts: 'l', rail: 'claimed' }),
  R('m3', 'store', 'fetch version', 'It fetches the exact immutable version bytes using the server-side credential.', 'storage.get originals/…/v3', { fs: 'r', ts: 'l' }),
  S(['m3'], 'The text is validated, extracted, normalized and split into overlapping chunks.', 'extract → normalize → 48 chunks', { rail: 'chunked' }),
  R('m3', 'embed', 'POST /embed', 'Chunks go to the local embedding worker in bounded batches. Nothing leaves the private network.', 'POST embeddings:8082/embed  batch=16', { fs: 'b', ts: 't', rail: 'embedding' }),
  R('embed', 'm3', '384-dim vectors', 'all-MiniLM-L6-v2 runs locally and returns one 384-dimensional vector per chunk.', 'vectors ×48  dims=384', { fs: 't', ts: 'b' }),
  R('m3', 'pg', 'stage + activate', 'Chunks and vectors are written inactive. Only when the whole version is complete is it activated, in one transaction.', 'chunks.stage ×48 → version.activate', { fs: 'r', ts: 'l', rail: ['staged', 'active'] }),
  R('m3', 'm2', 'report result', 'Processing reports back through the Module 2 contract.', 'document.processing = ready', { fs: 'l', ts: 'r', rail: 'ready' }),
  S(['admin', 'm2'], 'The dashboard polls the status: ready, failed or pending. Retrieval will now see the new version, and only the new one.', 'GET /knowledge/{id}/status → ready'),
]

const CHAT_HEAD = [
  R('widget', 'proxy', 'POST /chat', 'A visitor asks a question in the widget iframe. The body carries the widget ID, an optional session ID and the message.', 'POST /api/v1/chat {widget_id, session_id?, message}', { fs: 't', ts: 'b' }),
  R('proxy', 'm6', 'forward', 'Chat orchestration validates the body, size limits, origin and rate limit before doing any work.', 'validate body · origin · rate-limit ✓', { fs: 'b', ts: 'l' }),
  R('m6', 'm1', 'resolve widget', 'Module 1 resolves the active widget and its organization. This trusted tenant is the only one used for the rest of the request.', 'resolve widget_id → tenant=org_7f2', { fs: 't', ts: 'b', rail: 'validated' }),
  R('m1', 'pg', 'read widget + org', 'Widget and organization state are read; an inactive widget stops here.', 'select widgets, organizations (active)', { fs: 'r', ts: 'l' }),
  R('m6', 'm4', 'query + tenant', 'Retrieval receives the question, the trusted tenant ID and a top-K.', 'retrieve(tenant, q, k=6)', { fs: 't', ts: 'b', rail: 'retrieving' }),
  R('m4', 'embed', 'embed question', 'The question is embedded locally into the same 384-dimensional space as the chunks.', 'POST embeddings:8082/embed → vec[384]', { fs: 'r', ts: 'l' }),
  R('m4', 'pg', 'match chunks', 'match_knowledge_chunks() runs with tenant and active, current-version filters, ranked by vector distance.', 'match_knowledge_chunks(tenant, vec, 6)', { fs: 'r', ts: 'l' }),
]
const CHAT_TAIL_OK = [
  R('m6', 'm5', 'grounded prompt', 'History is loaded and bounded. Evidence goes in as clearly delimited, untrusted blocks, so a document cannot give the model orders.', 'prompt = system + 4 turns + 3 evidence blocks', { fs: 'r', ts: 'l', rail: 'prompting' }),
  R('m5', 'llm', 'chat-completions', 'The Go adapter calls llama.cpp on the private network with a service token, a timeout and cancellation.', 'POST llm:8081/v1/chat/completions', { fs: 'r', ts: 'l', rail: 'generating' }),
  R('llm', 'm5', 'tokens', 'Qwen3-4B generates from local GGUF weights. The adapter validates the output or maps it to a stable failure code.', 'completion ok · 212 tokens · 3.1 s', { fs: 'l', ts: 'r' }),
  R('m5', 'm6', 'validated output', 'Validated text and generation status return to chat orchestration.', 'generation.status = ok', { fs: 'l', ts: 'r' }),
  R('m6', 'pg', 'persist turns', 'User and assistant turns are stored, plus source references taken only from retrieval metadata, never from what the model wrote.', 'insert chat_messages ×2 + sources ×3', { fs: 'r', ts: 'l', rail: 'persisted' }),
  R('m6', 'proxy', 'answered + sources', 'The response is “answered”, with the answer and verified source references.', '200 {status:"answered", sources:[3]}', { fs: 'l', ts: 'b', rail: 'answered' }),
  R('proxy', 'widget', 'render', 'The widget renders plain safe text and the source links.', 'widget.render(text, sources)', { fs: 'b', ts: 't' }),
]
const CHAT_TAIL_NONE = [
  R('m6', 'pg', 'persist turn', 'The user turn and the configured fallback are persisted as policy permits. No model call is made.', 'insert chat_messages ×2 (fallback)', { fs: 'r', ts: 'l', rail: 'persisted' }),
  R('m6', 'proxy', 'insufficient_evidence', 'The response carries the fallback and no sources. A confident wrong answer is worse than an honest gap.', '200 {status:"insufficient_evidence", sources:[]}', { fs: 'l', ts: 'b', rail: 'fallback' }),
  R('proxy', 'widget', 'render', 'The widget shows the fallback message. The admin can see the gap and add knowledge.', 'widget.render(fallback)', { fs: 'b', ts: 't' }),
]
const evidence = (ok) =>
  R('m4', 'm6', ok ? 'ranked evidence' : 'no evidence', ok ? 'Three chunks pass the distance threshold and come back with source metadata.' : 'The best match is far beyond the distance threshold, so there is no usable evidence.', ok ? 'evidence: 3 chunks · best distance 0.21' : 'evidence: none under threshold · best 0.71', { fs: 'b', ts: 't', rail: ok ? 'grounded' : 'insufficient' })

const BOUNDARIES = [
  S(['admin', 'widget'], 'The browser may hold the publishable Supabase key and nothing else. The service-role key, DB URL, JWT secret and internal token never reach it. VITE_* values are public.', 'browser: publishable key only'),
  S(['m1'], 'Module 1 resolves the tenant on the server. A tenant ID supplied by the browser is never proof of authorization.', 'tenant ← widget, never ← request body'),
  S(['store'], 'knowledge-originals stays private. Only the Go backend reaches it, with server-side credentials.', 'bucket knowledge-originals: private'),
  S(['embed', 'llm'], 'The embedding worker and llama.cpp are never published to the internet. Only the Go API can call them, over private HTTP.', 'embeddings:8082 · llm:8081 → internal only'),
  S(['m8'], '/api/v1/metrics demands a bearer token. Prometheus reads it from a mounted secret file that is never committed.', 'GET /api/v1/metrics  Bearer <INTERNAL_SERVICE_TOKEN>'),
  S(['cron', 'pg'], 'Retention is enforced in the database: chats are purged after 90 days and operational events after 180.', 'cron: purge chats >90 d · events >180 d'),
]

const SCENARIOS = [
  { id: 'chat', title: 'Answer a question', steps: [...CHAT_HEAD, evidence(true), ...CHAT_TAIL_OK], rail: ['validated', 'retrieving', 'grounded', 'prompting', 'generating', 'persisted', 'answered'] },
  { id: 'gap', title: 'Refuse to guess', steps: [...CHAT_HEAD, evidence(false), ...CHAT_TAIL_NONE], rail: ['validated', 'retrieving', 'insufficient', 'persisted', 'fallback'], bad: ['insufficient', 'fallback'] },
  { id: 'ingest', title: 'Ingest a document', steps: INGEST, rail: ['pending', 'claimed', 'chunked', 'embedding', 'staged', 'active', 'ready'] },
  { id: 'trust', title: 'Trust boundaries', steps: BOUNDARIES },
]

export default function JnanaSetuViz() {
  const [id, setId] = useState('chat')
  const sc = SCENARIOS.find((s) => s.id === id)
  return (
    <div className="viz">
      <div className="tabs" role="tablist" aria-label="Scenario">
        {SCENARIOS.map((s) => (
          <button key={s.id} role="tab" aria-selected={s.id === id} className={s.id === id ? 'on' : ''} onClick={() => setId(s.id)}>
            {s.title}
          </button>
        ))}
      </div>
      <ArchStage
        model={MODEL}
        steps={sc.steps}
        resetKey={id}
        label={`JñānaSetu architecture: ${sc.title}`}
        header={(c) => sc.rail && <StatusRail title={id === 'ingest' ? 'Version' : 'Request'} items={sc.rail.map((k) => ({ k, tone: sc.bad?.includes(k) ? 'bad' : k === 'ready' || k === 'answered' ? 'good' : undefined }))} steps={sc.steps} i={c.i} />}
        aside={(c) => <TraceLog {...c} />}
      />
    </div>
  )
}
