import { useEffect } from 'react'

// Scroll-reveal: fades + lifts any [data-reveal] element into place the
// first time it enters the viewport. Re-runs whenever `deps` changes
// (e.g. switching between Home and Projects) so newly-mounted elements
// get observed too. Respects prefers-reduced-motion.
export function useReveal(deps = []) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(document.querySelectorAll('[data-reveal]'))

    if (reduce) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
