import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// A tiny History-API router: real URLs (/work/jnana-setu), no dependency.
// Hosts need a fallback to index.html (vercel.json and public/_redirects are included).
const Ctx = createContext({ path: '/', navigate: () => {} })
export const useRouter = () => useContext(Ctx)

const clean = (p) => p.replace(/\/+$/, '') || '/'
const top = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

export function Router({ children }) {
  const [path, setPath] = useState(() => clean(window.location.pathname))

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onPop = () => {
      setPath(clean(window.location.pathname))
      top()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    const next = clean(to)
    if (next === clean(window.location.pathname)) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState({}, '', to)
    setPath(next)
    top()
  }, [])

  return <Ctx.Provider value={{ path, navigate }}>{children}</Ctx.Provider>
}

export function Link({ to, children, onClick, ...rest }) {
  const { navigate } = useRouter()
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        if (onClick) onClick(e)
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
