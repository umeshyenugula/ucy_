import { useLayoutEffect, useRef } from 'react'

// Keeps a single line of text on ONE line at any container width by scaling the font size to fit
// (capped at `max`). Re-measures on resize and once the web font has loaded.
export default function FitText({ children, max = 96, min = 9 }) {
  const outer = useRef(null)
  const inner = useRef(null)
  useLayoutEffect(() => {
    const o = outer.current
    const t = inner.current
    if (!o || !t) return
    const fit = () => {
      t.style.fontSize = '100px'
      const w = t.getBoundingClientRect().width
      const avail = o.clientWidth
      if (!w || !avail) return
      t.style.fontSize = Math.max(min, Math.min(max, (100 * avail * 0.995) / w)) + 'px'
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(o)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit)
    return () => ro.disconnect()
  }, [children, max, min])
  return (
    <span ref={outer} className="fit">
      <span ref={inner} className="fit-in">
        {children}
      </span>
    </span>
  )
}
