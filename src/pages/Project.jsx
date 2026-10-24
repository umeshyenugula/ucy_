import { Suspense, lazy } from 'react'
import { Link } from '../router.jsx'
import { projects } from '../data/projects.js'
import NotFound from './NotFound.jsx'

// Each project's flagship visual is code-split: it only loads on its own page.
const VIZ = {
  jnana: lazy(() => import('../viz/JnanaSetuViz.jsx')),
  vidura: lazy(() => import('../viz/ViduraNitiViz.jsx')),
  flasio: lazy(() => import('../viz/FlasioViz.jsx')),
}

export default function Project({ id }) {
  const i = projects.findIndex((p) => p.id === id)
  if (i < 0) return <NotFound />
  const p = projects[i]
  const next = projects[(i + 1) % projects.length]
  const live = p.liveDemoUrl && p.liveDemoUrl !== '#'
  const Viz = VIZ[p.viz]

  return (
    <div className="wrap page-pad">
      <Link to="/work" className="back">
        <span aria-hidden="true">←</span> All work
      </Link>

      <header className="proj-head">
        <p className="card-meta">
          <span>{p.index}</span> {p.category}
        </p>
        <h1 className="h-hero proj-title">{p.title}</h1>
        <p className="lead">{p.tagline}</p>
        {p.proves && (
          <p className="proves">
            <span>Proves</span>
            {p.proves.map((t) => (
              <i key={t}>{t}</i>
            ))}
          </p>
        )}
        {(p.githubUrl || live) && (
          <div className="card-actions">
            {p.githubUrl && (
              <a className="btn solid" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                View source
              </a>
            )}
            {live && (
              <a className="btn line" href={p.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                {p.liveLabel || 'Live demo'} ↗
              </a>
            )}
          </div>
        )}
      </header>

      {Viz && (
        <section className="flagship" data-reveal>
          <p className="chapter">Live architecture</p>
          <h2 className="h-xl">{p.vizTitle}</h2>
          <p className="lead">{p.vizLead}</p>
          <Suspense fallback={<div className="viz-loading dim">Loading the architecture…</div>}>
            <Viz />
          </Suspense>
        </section>
      )}

      <section className="proj-block" data-reveal>
        <h2 className="label">What it is</h2>
        <p className="statement">{p.description}</p>
      </section>

      <section className="proj-block">
        <h2 className="label" data-reveal>
          Decisions that carry it
        </h2>
        <ul className="points">
          {p.bullets.map((b) => (
            <li key={b.b} data-reveal>
              <h3>{b.b}</h3>
              <p>{b.t}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="proj-block" data-reveal>
        <h2 className="label">Built with</h2>
        <div className="chips big">
          {p.stack.map((s) => (
            <span className="chip" key={s.label}>
              {s.label}
            </span>
          ))}
        </div>
      </section>

      <Link to={`/work/${next.id}`} className="next" data-reveal>
        <span className="label">Next project</span>
        <span className="next-t">
          {next.title} <span aria-hidden="true">→</span>
        </span>
      </Link>
    </div>
  )
}
