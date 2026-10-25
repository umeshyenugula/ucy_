import { useEffect } from 'react'
import { useRouter } from './router.jsx'
import { ThemeCtx, useThemeState, useReveal } from './hooks.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Backdrop from './components/Backdrop.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Project from './pages/Project.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import { projects } from './data/projects.js'
import { applySeo } from './seo-runtime.js'

function resolve(path) {
  if (path === '/') return { page: <Home /> }
  if (path === '/work') return { page: <Work /> }
  if (path === '/about') return { page: <About /> }
  if (path === '/contact') return { page: <Contact /> }
  const m = path.match(/^\/work\/([\w-]+)$/)
  if (m) {
    const p = projects.find((x) => x.id === m[1])
    if (p) return { page: <Project id={p.id} /> }
  }
  return { page: <NotFound /> }
}

export default function App() {
  const { path } = useRouter()
  const theme = useThemeState()
  const { page } = resolve(path)

  useEffect(() => {
    applySeo(path)
  }, [path])
  useReveal(path)

  return (
    <ThemeCtx.Provider value={theme}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Backdrop />
      <Nav />
      <main id="main" key={path} className="page">
        {page}
      </main>
      <Footer />
    </ThemeCtx.Provider>
  )
}
