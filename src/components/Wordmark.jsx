import { useEffect, useRef } from 'react'
import { prefersReduced } from '../hooks.js'

// Footer wordmark: every letter lives in a fixed-width box (measured at the heaviest weight) so the
// weight can change freely without anything shifting. The weight idles in a slow wave and swells
// toward the pointer. The whole thing is fitted to the container width.
const REST = 340
const PEAK = 800
const SPACE = 0.26

export default function Wordmark({ words }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const letters = Array.from(el.querySelectorAll('.wl'))
    const lines = Array.from(el.querySelectorAll('.wm-line'))
    const reduce = prefersReduced()
    const wide = window.matchMedia('(min-width: 900px)')
    let raf = 0
    let running = true
    let mx = -1e4
    let my = -1e4
    const w = letters.map(() => REST)

    const fit = () => {
      const em = lines.map((ln) => Array.from(ln.querySelectorAll('.wl')).reduce((a, l) => a + parseFloat(l.dataset.em || 0), 0))
      // wide: first two words share a row, the last sits below. narrow: one word per row.
      const need = wide.matches ? Math.max(em[0] + SPACE + em[1], ...em.slice(2)) : Math.max(...em)
      el.style.fontSize = Math.floor((el.clientWidth / need) * 100) / 100 + 'px'
    }

    const measure = () => {
      el.style.fontSize = '100px'
      letters.forEach((l) => {
        l.style.width = 'auto'
        l.style.fontWeight = PEAK
      })
      letters.forEach((l) => (l.dataset.em = (l.getBoundingClientRect().width / 100).toFixed(4)))
      letters.forEach((l) => {
        l.style.width = l.dataset.em + 'em'
        l.style.fontWeight = reduce ? 520 : REST
      })
      fit()
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!running) return
      const t = now / 1000
      letters.forEach((l, i) => {
        let target = REST + (0.5 + 0.5 * Math.sin(t * 1.15 - i * 0.5)) * 280
        const r = l.getBoundingClientRect()
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2))
        const prox = Math.max(0, 1 - d / (r.height * 1.1))
        target += prox * prox * (PEAK - REST)
        w[i] += (target - w[i]) * 0.14
        l.style.fontWeight = Math.round(w[i])
      })
    }

    const move = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    const leave = () => {
      mx = my = -1e4
    }

    let ro
    const start = () => {
      measure()
      ro = new ResizeObserver(fit)
      ro.observe(el)
      if (!reduce) raf = requestAnimationFrame(tick)
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start)
    else start()

    const io = new IntersectionObserver(([e]) => (running = e.isIntersecting))
    io.observe(el)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    wide.addEventListener('change', fit)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      if (ro) ro.disconnect()
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      wide.removeEventListener('change', fit)
    }
  }, [])

  return (
    <div className="wordmark" ref={root} aria-label={words.join(' ')} role="img">
      {words.map((word, wi) => (
        <span key={word} style={{ display: 'contents' }}>
          {wi === 2 && <span className="wm-break" aria-hidden="true" />}
          <span className="wm-line" aria-hidden="true">
            {word.split('').map((ch, i) => (
              <span className="wl" key={i}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}
