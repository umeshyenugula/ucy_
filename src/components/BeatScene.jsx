import { useRef } from 'react'
import { Link } from '../router.jsx'
import { useScene, clamp } from '../hooks.js'

// A pinned scene: the stage stays on screen while scroll progress walks through a list of beats.
// CSS reads --p (scene progress) and derives each beat's own progress from --i and --n.
// A beat is either a statement (optionally with a kicker and a panel of supporting points) or a
// count-up number. Numbers count up from JS because text can't be animated in CSS.
const fmt = (v, d) => (d ? v.toFixed(d) : String(Math.round(v)))
const two = (n) => String(n).padStart(2, '0')

export default function BeatScene({ id, chapter, beats, per = 95 }) {
  const ref = useRef(null)
  const nums = useRef([])
  const items = useRef([])
  const counter = useRef(null)
  const active = useRef(-1)

  useScene(ref, {
    onUpdate: (p) => {
      const n = beats.length
      const idx = Math.min(n - 1, Math.floor(p * n))
      if (idx !== active.current) {
        active.current = idx
        items.current.forEach((el, i) => el && el.classList.toggle('on', i === idx))
        if (counter.current) counter.current.textContent = `${two(idx + 1)} / ${two(n)}`
      }
      beats.forEach((b, i) => {
        const el = nums.current[i]
        if (!el || b.count === undefined) return
        const l = clamp(p * n - i)
        const k = 1 - Math.pow(1 - clamp(l * 3), 3)
        el.textContent = fmt(b.count * k, b.decimals || 0)
      })
    },
  })

  return (
    <section ref={ref} id={id} className="scene" style={{ '--n': beats.length, '--per': per + 'vh' }}>
      <div className="stage wrap">
        <p className="chapter">{chapter}</p>
        <p className="scene-count" ref={counter} aria-hidden="true">
          01 / {two(beats.length)}
        </p>
        {beats.map((b, i) => (
          <div className={`beat ${i === 0 ? 'first' : ''} ${i === beats.length - 1 ? 'last' : ''} ${b.accent ? 'accent' : ''}`} style={{ '--i': i }} key={i} ref={(el) => (items.current[i] = el)}>
            {b.count !== undefined ? (
              <>
                <div className="num">
                  <span ref={(el) => (nums.current[i] = el)}>{fmt(b.count, b.decimals || 0)}</span>
                  {b.suffix && <sup>{b.suffix}</sup>}
                </div>
                <h3 className="num-label">{b.label}</h3>
                {b.caption && <p className="cap">{b.caption}</p>}
              </>
            ) : (
              <div className={`beat-grid${b.points ? ' has-panel' : ''}`}>
                <div className="beat-main">
                  {b.kicker && <p className="beat-k">{b.kicker}</p>}
                  <h2 className="line">{b.line}</h2>
                  {b.caption && <p className="cap">{b.caption}</p>}
                  {b.to && (
                    <Link to={b.to} className="textlink">
                      {b.cta} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
                {b.points && (
                  <ul className="beat-panel">
                    {b.points.map((t, k) => (
                      <li key={k} style={{ '--k': k }} data-n={two(k + 1)}>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="scene-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
