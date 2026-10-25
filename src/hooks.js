import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---- one shared scroll loop for every scrubbed element ---- */
// Subscribers get the frame time (seconds) and return true while they are still easing, so the
// loop keeps running until everything has settled and then goes back to sleep.
const subs = new Set()
let raf = 0
let bound = false
let lastT = 0
const run = (t) => {
  raf = 0
  const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 1 / 60
  lastT = t
  let again = false
  subs.forEach((fn) => {
    if (fn(dt)) again = true
  })
  if (again) schedule()
  else lastT = 0
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
// The shown progress chases the scroll position with exponential damping (so it never jerks), and
// `maxSpeed` (progress per second) caps how fast it may move, so a fast fling cannot flash past
// content that has to be read: beats keep stepping, each staying on screen long enough.
const EASE = 9
export function useScene(ref, { pin = true, onUpdate, maxSpeed = 0 } = {}) {
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
    let cur = null
    let shown = -1
    const fn = (dt) => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > 2 * vh) return false
      let t
      if (pin) {
        const total = r.height - vh
        t = total > 0 ? -r.top / total : 0
      } else {
        t = (vh - r.top) / (vh + r.height)
      }
      t = clamp(t)
      if (cur === null) cur = t
      const d = t - cur
      if (Math.abs(d) < 0.0002) cur = t
      else {
        let step = d * (1 - Math.exp(-dt * EASE))
        if (maxSpeed) step = clamp(step, -maxSpeed * dt, maxSpeed * dt)
        cur += step
      }
      if (cur !== shown) {
        shown = cur
        el.style.setProperty('--p', cur.toFixed(4))
        cb.current && cb.current(cur)
      }
      return cur !== t
    }
    return subscribe(fn)
  }, [ref, pin, maxSpeed])
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
