import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---- one shared scroll loop for every scrubbed element ---- */
const subs = new Set()
let raf = 0
let bound = false
const run = () => {
  raf = 0
  subs.forEach((fn) => fn())
}
const schedule = () => {
  if (!raf) raf = requestAnimationFrame(run)
}
export function subscribe(fn) {
  subs.add(fn)
  if (!bound) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    bound = true
  }
  schedule()
  return () => subs.delete(fn)
}

// Writes --p (0..1) on the element as it scrolls. pin=true: progress through a tall section whose
// child is position:sticky. pin=false: progress of the element crossing the viewport.
export function useScene(ref, { pin = true, onUpdate } = {}) {
  const cb = useRef(onUpdate)
  cb.current = onUpdate
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      el.style.setProperty('--p', 1)
      cb.current && cb.current(1)
      return
    }
    let last = -1
    const fn = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > 2 * vh) return
      let p
      if (pin) {
        const total = r.height - vh
        p = total > 0 ? -r.top / total : 0
      } else {
        p = (vh - r.top) / (vh + r.height)
      }
      p = clamp(p)
      if (Math.abs(p - last) < 0.0004) return
      last = p
      el.style.setProperty('--p', p.toFixed(4))
      cb.current && cb.current(p)
    }
    return subscribe(fn)
  }, [ref, pin])
}

// fade-up for [data-reveal], re-armed on every route change
export function useReveal(key) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [key])
}

/* ---- theme ---- */
const ThemeCtx = createContext({ theme: 'dark', toggle: () => {} })
export const useTheme = () => useContext(ThemeCtx)
export { ThemeCtx }

export function useThemeState() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      const root = document.documentElement
      root.classList.add('theme-anim')
      root.setAttribute('data-theme', next)
      try {
        localStorage.setItem('theme', next)
      } catch (e) {
        /* storage unavailable */
      }
      setTimeout(() => root.classList.remove('theme-anim'), 500)
      return next
    })
  }, [])
  return { theme, toggle }
}

export function useClock(tz = 'Asia/Kolkata') {
  const fmt = useRef(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }))
  const [t, setT] = useState(() => fmt.current.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setT(fmt.current.format(new Date())), 15000)
    return () => clearInterval(id)
  }, [])
  return t
}
