import { useState } from 'react'
import { projects } from '../data/projects.js'
import FlowDiagram from './FlowDiagram.jsx'
import { Title, ArrowUR, GithubIcon } from './ui.jsx'

export default function Projects() {
  const [active, setActive] = useState(0)
  const p = projects[active]
  const hasLive = p.liveDemoUrl && p.liveDemoUrl !== '#'

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setActive((a) => (a + 1) % projects.length)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setActive((a) => (a - 1 + projects.length) % projects.length)
    }
  }

  return (
    <section id="work" className="sec work">
      <div className="sec-head">
        <Title>Work</Title>
        <p className="sec-note">
          Seven shipped systems, from a biometric one-time voice messenger to an async Python web framework. Pick one to see how a
          request moves through it.
        </p>
      </div>

      <div className="work-grid">
        <div className="plist" role="tablist" aria-orientation="vertical" aria-label="Projects" onKeyDown={onKey}>
          {projects.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className={`prow ${i === active ? 'on' : ''}`}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            >
              <span className="pi">{x.index}</span>
              <span className="pt">{x.title}</span>
              <span className="pc">{x.category}</span>
              <ArrowUR />
            </button>
          ))}
        </div>

        <article className="pdetail" key={p.id} role="tabpanel" aria-label={p.title}>
          <header>
            <div className="pd-cat">{p.category}</div>
            <h3>{p.title}</h3>
            <p className="pd-tag">{p.tagline}</p>
          </header>

          <div className="fd-wrap">
            <FlowDiagram id={p.id} variant={p.diagramVariant} flow={p.flow} />
          </div>

          <p className="pd-desc">{p.description}</p>

          <ul className="pd-bullets">
            {p.bullets.map((b) => (
              <li key={b.b}>
                <b>{b.b}</b>
                <span>{b.t}</span>
              </li>
            ))}
          </ul>

          <div className="chips">
            {p.stack.map((s) => (
              <span className="chip" key={s.label}>
                <img src={s.icon} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
                {s.label}
              </span>
            ))}
          </div>

          <div className="pd-actions">
            {p.githubUrl && (
              <a className="btn solid" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                <GithubIcon /> Source
              </a>
            )}
            {hasLive && (
              <a className="btn ghost" href={p.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                {p.liveDemoUrl.includes('pypi') ? 'View on PyPI' : 'Live demo'} <ArrowUR />
              </a>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
