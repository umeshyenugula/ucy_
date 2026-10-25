import { Link } from '../router.jsx'
import { EMAIL, SOCIALS, PROFILES } from '../data/profile.js'
import { useClock } from '../hooks.js'
import ThemeToggle from './ThemeToggle.jsx'
import Wordmark from './Wordmark.jsx'

export default function Footer() {
  const time = useClock()
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <h2 className="foot-title">Need a system people can trust? Let’s talk.</h2>
          <a className="foot-mail" href={`mailto:${EMAIL}`}>
            {EMAIL}
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>

        <div className="foot-cols">
          <nav aria-label="Pages">
            <h3>Pages</h3>
            <Link to="/">Home</Link>
            <Link to="/work">Work</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <nav aria-label="Elsewhere">
            <h3>Elsewhere</h3>
            {SOCIALS.map(([n, h]) => (
              <a key={n} href={h} target="_blank" rel="noopener noreferrer">
                {n}
              </a>
            ))}
            {PROFILES.map((p) => (
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
            ))}
          </nav>
          <div>
            <h3>Based in</h3>
            <p>Hyderabad, India</p>
            <p className="dim">Local time {time}</p>
            <p className="dim">Open to opportunities</p>
          </div>
          <div className="foot-theme">
            <h3>Theme</h3>
            <ThemeToggle className="boxed" />
          </div>
        </div>

        <Wordmark words={['Umesh', 'Chandran', 'Yenugula']} />

        <div className="foot-bottom">
          <span>© 2026 Umesh Chandran Yenugula. Computer Science, GRIET, class of 2028.</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
        </div>
      </div>
    </footer>
  )
}
