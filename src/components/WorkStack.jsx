import { useEffect, useRef } from 'react'
import { Link } from '../router.jsx'
import { projects } from '../data/projects.js'
import { subscribe, clamp, prefersReduced } from '../hooks.js'

// Cards stack on top of each other like a deck. As the next card slides up, the one beneath
// recedes slightly (scale + dim), driven by the shared scroll loop.
export default function WorkStack() {
  const cards = useRef([])

  useEffect(() => {
    if (prefersReduced()) return
    return subscribe(() => {
      const vh = window.innerHeight
      cards.current.forEach((el, i) => {
        const next = cards.current[i + 1]
        if (!el || !next) return
        const stickyTop = parseFloat(getComputedStyle(el).top) || 0
        const dist = next.getBoundingClientRect().top - stickyTop
        const k = 1 - clamp(dist / (vh * 0.75))
        el.style.setProperty('--k', k.toFixed(3))
      })
    })
  }, [])

  return (
    <section className="wstack" id="work">
      <div className="wrap">
        <div className="wstack-head" data-reveal>
          <div>
            <p className="chapter">Chapter four · The work</p>
            <h2 className="h-xl">Three systems you can run.</h2>
          </div>
          <Link to="/work" className="textlink">
            All work <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="deck">
          {projects.map((p, i) => (
            <article className="card" key={p.id} ref={(el) => (cards.current[i] = el)} style={{ '--i': i }}>
              <div className="card-main">
                <p className="card-meta">
                  <span>{p.index}</span> {p.category}
                </p>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-tag">{p.tagline}</p>
                <div className="chips">
                  {p.stack.slice(0, 4).map((s) => (
                    <span className="chip" key={s.label}>
                      {s.label}
                    </span>
                  ))}
                </div>
                <div className="card-actions">
                  <Link to={`/work/${p.id}`} className="btn solid small">
                    Live architecture
                  </Link>
                  {p.githubUrl && (
                    <a className="btn line small" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                      Source
                    </a>
                  )}
                </div>
              </div>
              <ol className="mflow" aria-label="Request path">
                {p.flow.map((s, k) => (
                  <li key={s.label} style={{ '--s': k }} className={s.accent ? 'acc' : ''}>
                    <b>{s.label}</b>
                    <span>{s.sub}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
