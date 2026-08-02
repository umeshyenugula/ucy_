import { useEffect, useState } from 'react'

// Tracks how far down the current page the user has scrolled, as a 0–100
// percentage, for the thin progress bar under the nav.
export function useScrollProgress(deps = []) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return pct
}
