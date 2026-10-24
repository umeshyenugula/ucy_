import { useState } from 'react'
import ArchStage, { StatusRail, TraceLog } from '../components/ArchStage.jsx'

// Flasio, from ARCHITECTURE.md: ASGI server → app → middleware → router → handler → response,
// with the error path, opt-in services and the separate CLI.
const W = { w: 140, h: 56 }
const MODEL = {
  w: 1000,
  h: 620,
  zones: [
    { id: 'net', label: 'NETWORK', x: 12, y: 20, w: 160, h: 400, hue: 210 },
    { id: 'core', label: 'FLASIO CORE · ASGI', x: 196, y: 20, w: 792, h: 436, hue: 155 },
    { id: 'svc', label: 'OPTIONAL SERVICES · OPT-IN', x: 196, y: 476, w: 792, h: 132, hue: 38 },
    { id: 'cli', label: 'CLI', x: 12, y: 440, w: 160, h: 168, hue: 275 },
  ],
  nodes: [
    { id: 'client', zone: 'net', ...W, x: 22, y: 110, label: 'HTTP client', sub: 'browser · curl', detail: 'Anything that speaks HTTP. It never sees framework internals, only safe responses.' },
    { id: 'server', zone: 'net', ...W, x: 22, y: 250, label: 'Uvicorn', sub: 'ASGI server', detail: 'Parses the network protocol and calls the application with scope, receive and send. Any compatible ASGI server works.' },
    { id: 'app', zone: 'core', ...W, x: 212, y: 250, label: 'Flasio app', sub: 'ASGI callable', detail: 'The entry point: app(scope, receive, send). Builds the request context, runs middleware and dispatch, converts results to responses and sends valid ASGI events. It never prints the CLI banner.' },
    { id: 'mw', zone: 'core', ...W, x: 392, y: 250, label: 'Middleware', sub: 'ordered · explicit', detail: 'Reusable behavior around requests: logging and timing, auth checks, CORS and security headers, request IDs, optional rate limiting. Order is documented, and middleware must never send two response-start events.' },
    { id: 'router', zone: 'core', ...W, x: 572, y: 250, label: 'Router', sub: 'dict + compiled', detail: 'Static routes are an exact-match dictionary lookup, checked first. Dynamic routes such as /users/{user_id} use patterns compiled at registration. Distinguishes 404 from 405.' },
    { id: 'handler', zone: 'core', ...W, x: 752, y: 250, label: 'Route handler', sub: 'async def', detail: 'Your code. Receives a Request (method, path, headers, query_params, await body() / json()), may render a template or call services, and returns data or a Response.' },
    { id: 'err', zone: 'core', ...W, x: 572, y: 90, label: 'Error handler', sub: 'safe responses', hue: 5, detail: 'Structured HTTP exceptions (400 to 500) return a safe message. Unexpected exceptions are logged with diagnostics while production responses stay generic. No stack traces or secrets in production.' },
    { id: 'tpl', zone: 'core', ...W, x: 752, y: 64, label: 'Templates', sub: 'Jinja2 · opt-in', detail: 'Renders HTML from a configured directory, imported only when requested. Autoescaping on for HTML. Rendering can be synchronous, so it is documented and kept off latency-sensitive paths.' },
    { id: 'resp', zone: 'core', ...W, x: 572, y: 390, label: 'Response', sub: 'normalize · encode', detail: 'Normalizes handler results: dicts and lists become JSON, strings text or HTML. Correct content types and status codes, body encoded once, clear error for invalid return types.' },
    { id: 'svcs', zone: 'svc', ...W, x: 840, y: 510, label: 'Services', sub: 'req.app.services', detail: 'Explicit registry: app.register_service("email", …). A missing service raises a clear configuration error. The core stays usable with none configured.' },
    { id: 'email', zone: 'svc', ...W, x: 212, y: 510, label: 'Email', sub: 'SMTP · OAuth2', detail: 'Configurable SMTP client. Gmail needs a supported auth method, not a normal password. Blocking SMTP is kept off the event loop and has explicit timeouts.' },
    { id: 'auth', zone: 'svc', ...W, x: 364, y: 510, label: 'Auth', sub: 'JWT helpers', detail: 'Token creation and verification. Validates signature, expiry and claims, restricts accepted algorithms, and keeps secrets in the environment.' },
    { id: 'db', zone: 'svc', ...W, x: 516, y: 510, label: 'Database', sub: 'asyncpg · aiosqlite', detail: 'A lifecycle surface, not an ORM. Pools are created once at application startup, reused, and closed cleanly on shutdown.' },
    { id: 'cdn', zone: 'svc', ...W, x: 668, y: 510, label: 'Cloudinary', sub: 'upload helper', detail: 'Environment-based config, upload helper that returns the secure URL, input validation, and no secrets in logs. Blocking SDK calls are kept off the event loop.' },
    { id: 'cli', zone: 'cli', ...W, x: 22, y: 484, h: 50, label: 'Flasio CLI', sub: 'flasio run app:app', detail: 'Separate from request processing. Resolves the app target, host, port and mode, validates them, then launches Uvicorn.' },
    { id: 'banner', zone: 'cli', ...W, x: 22, y: 550, h: 46, label: 'Dev banner', sub: 'ASCII · dev only', detail: 'Printed only by the CLI and only in development, so direct ASGI server use stays clean.' },
  ],
}

const R = (from, to, label, text, log, o = {}) => ({ from, to, label, text, log, ...o })
const S = (hot, text, log, o = {}) => ({ hot, text, log, ...o })

const IN = [
  R('client', 'server', 'HTTP request', 'A client sends GET /users/42. Uvicorn handles the network protocol.', 'GET /users/42 HTTP/1.1', { fs: 'b', ts: 't' }),
  R('server', 'app', 'scope · receive · send', 'The server calls the application with the ASGI contract. Flasio checks the scope type and builds a request context.', 'app(scope, receive, send)  type=http', { rail: 'accepted' }),
  R('app', 'mw', 'middleware', 'Middleware runs in its documented order: request ID, logging and timing, auth, CORS.', 'mw: request-id → log → cors'),
]
const OUT = [
  R('app', 'server', 'response events', 'Flasio sends http.response.start, then http.response.body. Exactly one start per request.', 'send http.response.start · http.response.body', { fs: 'l', ts: 'r' }),
  R('server', 'client', 'HTTP response', 'Uvicorn transmits the response to the client.', 'HTTP/1.1 200 OK', { fs: 't', ts: 'b' }),
]

const REQUEST = [
  ...IN,
  R('mw', 'router', 'continue', 'Middleware hands the request on to the router.', 'mw → router'),
  S(['router'], 'Static routes are one dictionary lookup. Dynamic ones like /users/{user_id} use patterns compiled at registration, so matching never recompiles anything.', 'match GET /users/{user_id} → {user_id: "42"}', { rail: 'routed' }),
  R('router', 'handler', 'invoke', 'The matched handler runs with the request context. await req.json() would read every body chunk once and cache the result.', 'handler get_user(req, user_id="42")', { rail: 'handling' }),
  R('handler', 'resp', 'return data', 'The handler returns a dict. Dicts and lists become JSON, strings become text or HTML, and a bad return type raises a clear framework error.', 'return {id: 42} → JSONResponse 200', { fs: 'b', ts: 'r', rail: 'response' }),
  R('resp', 'app', 'encode once', 'The body is encoded once, with the right content type and status, and handed back to the application.', 'encode body · content-type: application/json', { fs: 'l', ts: 'b' }),
  ...OUT.map((s, k) => (k === 0 ? { ...s, rail: 'sent' } : s)),
]

const ERROR = [
  ...IN.slice(0, 2).map((s, k) => (k === 1 ? { ...s, rail: undefined } : s)),
  IN[2],
  R('mw', 'router', 'continue', 'Past middleware, on to routing.', 'mw → router'),
  R('router', 'handler', 'invoke', 'The route matches and the handler starts.', 'handler create_order(req)', { rail: 'handling' }),
  R('handler', 'err', 'raises', 'The handler raises. A deliberate HTTPException keeps its status; anything else is an unexpected error.', 'ValueError: unexpected', { fs: 't', ts: 'r', rail: 'error' }),
  S(['err'], 'Unexpected errors are logged with full diagnostics. The client only ever receives a generic message, so no stack traces or secrets leak in production.', 'log.error(exc, request_id) · client gets generic 500', { rail: 'logged' }),
  S(['router', 'mw', 'err'], 'Other failures take the same path: no route is 404, a known path with the wrong method is 405, auth failures are 401 or 403, an oversized body is 413.', '404 · 405 · 401 · 403 · 413 → one error handler'),
  R('err', 'app', 'safe response', 'The error handler returns a controlled response and never tries to send a second response-start after headers went out.', 'error → Response 500 (generic)', { fs: 'l', ts: 't', rail: 'safe' }),
  ...OUT.map((s, k) => (k === 1 ? { ...s, log: 'HTTP/1.1 500 Internal Server Error' } : s)),
]

const SERVICES = [
  S(['handler'], 'A route that creates an account: it needs a database, an email and a token. Each of these is an opt-in service, so requests that use none pay nothing.', 'POST /signup  (uses db + email + auth)'),
  R('handler', 'svcs', 'lookup', 'Routes reach services through the explicit registry. A missing service is a clear configuration error, not a surprise at 3 a.m.', 'req.app.services["db"]', { fs: 'b', ts: 't' }),
  R('svcs', 'db', 'pooled query', 'The pool was created once at application startup and is reused, never opened per request.', 'pool.acquire() → INSERT user', { fs: 'b', ts: 'b' }),
  R('svcs', 'auth', 'sign token', 'JWT creation and verification: signature, expiry and claims are checked, and accepted algorithms are restricted.', 'jwt.encode(HS256, exp=15m)', { fs: 'b', ts: 'b' }),
  R('svcs', 'email', 'send welcome', 'SMTP runs through an async path or a worker thread, with timeouts and credentials from the environment, so the event loop never blocks.', 'smtp.send(welcome) timeout=10s', { fs: 'b', ts: 'b' }),
  R('svcs', 'cdn', 'upload avatar', 'The Cloudinary helper validates the input and returns the secure URL. API secrets never reach clients or logs.', 'cloudinary.upload → secure_url', { fs: 'b', ts: 'b' }),
  R('handler', 'tpl', 'render', 'An HTML page is rendered from a template with autoescaping on.', 'render_template("welcome.html")', { fs: 't', ts: 'b' }),
  R('tpl', 'handler', 'html', 'Rendering is synchronous, so it is documented and kept off latency-sensitive async paths.', 'html (escaped) → handler', { fs: 'b', ts: 't' }),
  R('handler', 'resp', 'return', 'The handler returns, and the response layer takes over as usual.', 'return html → Response 201', { fs: 'b', ts: 'r' }),
]

const CLI = [
  S(['cli'], 'flasio run app:app parses the arguments and resolves the application target, host, port and mode.', '$ flasio run app:app --reload', { rail: 'parsed' }),
  S(['cli'], 'The target and dependencies are validated before anything starts. A bad import gives a short, actionable error and a clean exit.', 'import app:app ✓  host=127.0.0.1 port=8000'),
  R('cli', 'banner', 'dev mode', 'Only the CLI prints the ASCII banner, and only in development. Using an ASGI server directly stays clean.', 'banner: development ✓', { fs: 'b', ts: 't', rail: 'banner' }),
  R('cli', 'server', 'launch Uvicorn', 'The CLI starts Uvicorn, or another supported ASGI server, with the resolved settings.', 'uvicorn app:app --reload', { fs: 't', ts: 'b', rail: 'launched' }),
  R('server', 'app', 'serve', 'The server imports the app and starts serving. From here every request follows the lifecycle scenario.', 'serving on http://127.0.0.1:8000'),
]

const SCENARIOS = [
  { id: 'req', title: 'Request lifecycle', steps: REQUEST, rail: ['accepted', 'routed', 'handling', 'response', 'sent'] },
  { id: 'err', title: 'When a handler fails', steps: ERROR, rail: ['handling', 'error', 'logged', 'safe'], bad: ['error'] },
  { id: 'svc', title: 'Opt-in services', steps: SERVICES },
  { id: 'cli', title: 'CLI startup', steps: CLI, rail: ['parsed', 'banner', 'launched'] },
]

export default function FlasioViz() {
  const [id, setId] = useState('req')
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
        label={`Flasio architecture: ${sc.title}`}
        header={(c) => sc.rail && <StatusRail title={id === 'cli' ? 'Startup' : 'Request'} items={sc.rail.map((k) => ({ k, tone: sc.bad?.includes(k) ? 'bad' : k === 'sent' || k === 'safe' || k === 'launched' ? 'good' : undefined }))} steps={sc.steps} i={c.i} />}
        aside={(c) => <TraceLog {...c} />}
      />
    </div>
  )
}
