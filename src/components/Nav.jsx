import { useEffect, useState } from 'react'

export default function Nav({ page, onNavigate, theme = 'light', onToggleTheme = () => {} }) {
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
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}>
        {theme === 'dark' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

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
