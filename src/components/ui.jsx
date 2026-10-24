import { useEffect, useRef } from 'react'
import { prefersReduced } from '../hooks.js'

export function Title({ children, id }) {
  return (
    <h2 className="sec-title" id={id}>
      <span>{children}</span>
    </h2>
  )
}

export const ArrowUR = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const GithubIcon = () => (
  <svg className="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05a9.2 9.2 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.43.21 2.49.1 2.75.65.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.61.69.5A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
)

// Infinite ticker. Drifts at a base speed and surges while the page is scrolling.
export function Marquee({ items, speed = 0.55, outline = false, className = '' }) {
  const track = useRef(null)
  useEffect(() => {
    const el = track.current
    if (!el || prefersReduced()) return
    let x = 0
    let raf
    let last = window.scrollY
    let vel = 0
    let gw = 0
    const measure = () => {
      gw = el.firstElementChild ? el.firstElementChild.getBoundingClientRect().width : 0
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const loop = () => {
      const y = window.scrollY
      vel += (Math.abs(y - last) - vel) * 0.12
      last = y
      x -= speed + Math.min(vel, 60) * 0.25
      if (gw && x <= -gw) x += gw
      el.style.transform = `translate3d(${x}px,0,0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [speed])

  const group = (k) => (
    <div className="marquee-group" aria-hidden={k > 0} key={k}>
      {items.map((t, i) => (
        <span className="marquee-item" key={i}>
          {t}
          <i className="star" aria-hidden="true" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee ${outline ? 'outline' : ''} ${className}`}>
      <div className="marquee-track" ref={track}>
        {group(0)}
        {group(1)}
        {group(2)}
      </div>
    </div>
  )
}
