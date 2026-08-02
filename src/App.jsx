import { useEffect, useState } from 'react'
import Loader from './components/Loader.jsx'
import BackgroundFX from './components/BackgroundFX.jsx'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Footer from './components/Footer.jsx'
import { useScrollProgress } from './hooks/useScrollProgress.js'

export default function App() {
  const [page, setPage] = useState('home') // 'home' | 'projects'
  const [target, setTarget] = useState(null) // section/project id to scroll to
  const [loading, setLoading] = useState(true)
  const progress = useScrollProgress([page])

  // Initial boot: short, smooth loading screen instead of a blocking one.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  // Whenever the page or target changes, scroll to the right place.
  useEffect(() => {
    if (loading) return
    if (target) {
      const el = document.getElementById(target)
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
      }
      setTarget(null)
    } else {
      window.scrollTo(0, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, loading])

  function navigate(nextPage, id) {
    if (nextPage === page && id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setPage(nextPage)
    setTarget(id || null)
  }

  return (
    <>
      <Loader active={loading} />
      <BackgroundFX />
      <div id="progress" style={{ width: `${progress}%` }} />
      <Nav page={page} onNavigate={navigate} />
      <main key={page} className={(loading ? 'main-hidden' : 'main-visible') + ' page-transition'}>
        {page === 'home' ? <Home onNavigate={navigate} /> : <Projects onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </>
  )
}
