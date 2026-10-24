import { useEffect, useState } from 'react'
import { Link, useRouter } from '../router.jsx'
import { subscribe } from '../hooks.js'
import ThemeToggle from './ThemeToggle.jsx'

const LINKS = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]

export default function Nav() {
  const { path } = useRouter()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    return subscribe(() => {
      const y = window.scrollY
      setSolid(y > 12)
      if (Math.abs(y - last) > 8) {
        setHidden(y > last && y > 240)
        last = y
      }
    })
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => setOpen(false), [path])

  const active = (to) => (to === '/' ? path === '/' : path === to || path.startsWith(to + '/'))

  return (
    <header className={`nav ${solid ? 'solid' : ''} ${hidden && !open ? 'hidden' : ''} ${open ? 'open' : ''}`}>
      <div className="nav-bar">
        <Link to="/" className="brand" aria-label="UCY, home">
          <span className="brand-name">
            UCY<i aria-hidden="true">_</i>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([to, label]) => (
            <Link key={to} to={to} className={active(to) ? 'on' : ''} aria-current={active(to) ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-end">
          <ThemeToggle />
          <a className="btn small solid nav-cta" href="mailto:umeshyenugula2007@gmail.com">
            Email me
          </a>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>
      <nav className="sheet" aria-label="Mobile">
        {LINKS.map(([to, label], i) => (
          <Link key={to} to={to} style={{ '--i': i }} className={path === to ? 'on' : ''}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
