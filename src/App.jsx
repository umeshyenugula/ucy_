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

const BASE = 'Umesh Chandran Yenugula'

function resolve(path) {
  if (path === '/') return { page: <Home />, title: `${BASE} — Full-Stack & Systems Engineer` }
  if (path === '/work') return { page: <Work />, title: `Work — ${BASE}` }
  if (path === '/about') return { page: <About />, title: `About — ${BASE}` }
  if (path === '/contact') return { page: <Contact />, title: `Contact — ${BASE}` }
  const m = path.match(/^\/work\/([\w-]+)$/)
  if (m) {
    const p = projects.find((x) => x.id === m[1])
    if (p) return { page: <Project id={p.id} />, title: `${p.title} — ${BASE}` }
  }
  return { page: <NotFound />, title: `Not found — ${BASE}` }
}

export default function App() {
  const { path } = useRouter()
  const theme = useThemeState()
  const { page, title } = resolve(path)

  useEffect(() => {
    document.title = title
  }, [title])
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
