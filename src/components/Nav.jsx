import { useEffect, useState } from 'react'

export default function Nav({ page, onNavigate }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function go(nextPage, id) {
    setOpen(false)
    onNavigate(nextPage, id)
  }

  return (
    <nav className={open ? 'nav-open' : ''}>
      <button className="mark" onClick={() => go('home')} aria-label="Home">
        <span className="dot" />UCY_
      </button>
      <div className={`links ${open ? 'links-open' : ''}`} id="navLinks">
        <button onClick={() => go('home', 'about')}>Profile</button>
        <button onClick={() => go('home', 'skills')}>Skills</button>
        <button onClick={() => go(page === 'home' ? 'home' : 'projects', page === 'home' ? 'projects-preview' : undefined)}>Work</button>
        <button onClick={() => go('home', 'contact')}>Contact</button>
        <button className="cta magnetic" onClick={() => go('projects')}>
          Projects →
        </button>
      </div>
      <button
        className="burger"
        id="navBurger"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="navLinks"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  )
}
