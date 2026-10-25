import { Fragment, useRef } from 'react'
import { Link } from '../router.jsx'
import { useScene } from '../hooks.js'

// Opening shot. On load the headline lifts in word by word; as you scroll, "can trust." grows
// heavier (the one dynamic detail) while the whole stage recedes into the next chapter.
const LINE1 = ['I', 'build', 'software']
const LINE2 = ['that', 'stays', 'up.']

export default function Hero() {
  const ref = useRef(null)
  useScene(ref)
  let i = 0
  const word = (w, cls = '') => (
    <span className="mask" key={w + i}>
      <span className={`w ${cls}`} style={{ '--i': i++ }}>
        {w}
      </span>
    </span>
  )
  return (
    <section className="hero" ref={ref}>
      <div className="stage wrap">
        <div className="hero-body">
          <h1 className="hero-title">
            <span className="hl">
              {LINE1.map((w, k) => (
                <Fragment key={w}>
                  {k > 0 && ' '}
                  {word(w)}
                </Fragment>
              ))}
            </span>{' '}
            <span className="hl dyn">
              {LINE2.map((w, k) => (
                <Fragment key={w}>
                  {k > 0 && ' '}
                  {word(w, k > 0 ? 'bolden' : '')}
                </Fragment>
              ))}
            </span>
          </h1>
          <p className="hero-sub">
            Full-stack engineer shipping with React, Vite, Next.js and TypeScript on the front, and Go and Python (FastAPI, Django, Flask) on the back.
            Three flagship systems below are the proof, and each one runs in your browser.
          </p>
          <div className="hero-cta">
            <Link to="/work" className="btn solid">
              See the work
            </Link>
            <Link to="/about" className="btn line">
              About me
            </Link>
          </div>
        </div>
        <div className="cue" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  )
}
