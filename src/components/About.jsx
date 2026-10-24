import { useEffect, useState } from 'react'
import { Title, ArrowUR } from './ui.jsx'
import { useInView, prefersReduced } from '../hooks.js'

const PORTRAIT =
  'https://res.cloudinary.com/dsu5knb1g/image/upload/v1785514822/CSI/Team/nvhbowilzyxedleaoh1m.jpg'

const SCRIPT = [
  { k: 'cmd', t: 'whoami' },
  { k: 'out', t: 'umesh chandran yenugula, b.tech cse, griet class of 2028' },
  { k: 'cmd', t: 'stack --primary' },
  { k: 'out', t: 'react  next.js  fastapi  django  flask' },
  { k: 'cmd', t: 'deploy --targets' },
  { k: 'out', t: 'docker  render  digitalocean  vercel' },
  { k: 'cmd', t: 'status' },
  { k: 'out', t: 'open to opportunities' },
]

function Terminal() {
  const [ref, seen] = useInView(0.35)
  const total = SCRIPT.reduce((n, l) => n + l.t.length, 0)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (prefersReduced()) {
      setN(total)
      return
    }
    const id = setInterval(() => setN((v) => (v >= total ? (clearInterval(id), v) : v + 1)), 22)
    return () => clearInterval(id)
  }, [seen, total])

  return (
    <div className="terminal" ref={ref}>
      <div className="term-bar">
        <i />
        <i />
        <i />
        <span>~/ucy</span>
      </div>
      <pre className="term-body" aria-label="Terminal summary of Umesh's stack and status">
        {SCRIPT.map((l, i) => {
          const before = SCRIPT.slice(0, i).reduce((a, x) => a + x.t.length, 0)
          if (!seen || n < before) return null
          const shown = Math.min(l.t.length, n - before)
          const typing = shown < l.t.length
          return (
            <div key={i} className={l.k}>
              {l.k === 'cmd' && <b>$ </b>}
              {l.t.slice(0, shown)}
              {typing && <i className="caret" />}
            </div>
          )
        })}
        {n >= total && (
          <div className="cmd">
            <b>$ </b>
            <i className="caret" />
          </div>
        )}
      </pre>
    </div>
  )
}

function CopyRow({ label, value, href, copy }) {
  const [done, setDone] = useState(false)
  const onCopy = async (e) => {
    if (!copy) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 1600)
    } catch {
      window.location.href = href
    }
  }
  return (
    <a className="crow" href={href} onClick={onCopy} target={copy ? undefined : '_blank'} rel="noopener noreferrer" data-cursor={copy ? 'Copy' : 'Open'}>
      <span>{label}</span>
      <b>{done ? 'Copied to clipboard' : value}</b>
      <ArrowUR />
    </a>
  )
}

export default function About() {
  return (
    <section id="about" className="sec">
      <div className="sec-head">
        <Title>About</Title>
        <p className="sec-note">Hyderabad, India. Building since the first semester at GRIET.</p>
      </div>

      <div className="about-grid">
        <figure className="portrait" data-reveal>
          <div className="mono-fallback">UCY_</div>
          <img src={PORTRAIT} alt="Umesh Chandran Yenugula" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <figcaption>Computer Society of India, GRIET chapter</figcaption>
        </figure>

        <div className="about-main">
          <p className="lead" data-reveal>
            Computer Science undergraduate with experience building full-stack web applications using React, Python, FastAPI,
            REST APIs, SQL and NoSQL databases, and cloud deployment platforms. I care about scalable, user-centric software
            with clean architecture, responsive interfaces and efficient backend services, and I have designed, developed and
            deployed real projects from frontend to backend.
          </p>
          <Terminal />
          <div className="contact-list" data-reveal>
            <CopyRow copy label="Email" value="umeshyenugula2007@gmail.com" href="mailto:umeshyenugula2007@gmail.com" />
            <CopyRow label="GitHub" value="umeshyenugula" href="https://github.com/umeshyenugula" />
            <CopyRow label="LinkedIn" value="umesh-chandran-yenugula" href="https://www.linkedin.com/in/umesh-chandran-yenugula-0a2576317" />
            <CopyRow copy label="Mobile" value="9912576361" href="tel:+919912576361" />
          </div>
        </div>
      </div>
    </section>
  )
}
