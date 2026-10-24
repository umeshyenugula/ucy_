import { useState } from 'react'
import { useMagnetic } from '../hooks.js'
import { ArrowUR } from './ui.jsx'

const EMAIL = 'umeshyenugula2007@gmail.com'

export default function Contact() {
  const [done, setDone] = useState(false)
  const mag = useMagnetic(0.35)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }
  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <h2 className="contact-title" data-reveal>
          Let's build something <em>reliable.</em>
        </h2>
        <div className="contact-row" data-reveal>
          <a className="big-cta" ref={mag} href={`mailto:${EMAIL}`} data-cursor="Email">
            <span>Start a conversation</span>
            <ArrowUR />
          </a>
          <div className="contact-side">
            <button className="copy-btn" onClick={copy}>
              {done ? 'Copied' : EMAIL}
            </button>
            <div className="socials">
              <a href="https://github.com/umeshyenugula" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/umesh-chandran-yenugula-0a2576317" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
