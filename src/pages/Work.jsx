import { Link } from '../router.jsx'
import { projects } from '../data/projects.js'

export default function Work() {
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <h1 className="h-hero">Work</h1>
        <p className="lead" data-reveal>
          Three flagship systems: a multi-tenant RAG platform, a spending governance platform for AI agents, and an async web
          framework published on PyPI. Each has a live architecture you can play, pause and inspect, and a repository to
          check the claims against.
        </p>
      </header>

      <ul className="wlist">
        {projects.map((p) => (
          <li key={p.id} data-reveal>
            <Link to={`/work/${p.id}`} className="wrow">
              <span className="wr-i">{p.index}</span>
              <span className="wr-t">{p.title}</span>
              <span className="wr-c">{p.category}</span>
              <span className="wr-d">{p.tagline}</span>
              <svg className="wr-a" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
