import { useState } from 'react'
import { EMAIL, SOCIALS, PROFILES } from '../data/profile.js'
import { useClock } from '../hooks.js'
import FitText from '../components/FitText.jsx'

export default function Contact() {
  const [done, setDone] = useState(false)
  const time = useClock()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch (e) {
      window.location.href = `mailto:${EMAIL}`
    }
  }
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <h1 className="h-hero">Let’s talk.</h1>
        <p className="lead" data-reveal>
          Open to internships, collaborations and hard problems. Email is the fastest way to reach me, and GitHub is the fastest way to check my work.
        </p>
      </header>

      <a className="mail-giant" href={`mailto:${EMAIL}`} data-reveal>
        <FitText>{EMAIL}</FitText>
      </a>
      <div className="closer-row" data-reveal>
        <button className="btn line" onClick={copy}>
          {done ? 'Copied' : 'Copy address'}
        </button>
      </div>

      <div className="contact-grid" data-reveal>
        <div>
          <h2 className="label">Find me</h2>
          {[...SOCIALS.map(([n, h]) => ({ name: n, href: h })), ...PROFILES].map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="clink">
              {s.name} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <div>
          <h2 className="label">Based in</h2>
          <p className="h-md">Hyderabad, India</p>
          <p className="dim">Local time {time}</p>
        </div>
      </div>
    </div>
  )
}
