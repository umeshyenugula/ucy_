import { useEffect, useRef } from 'react'
import { finePointer, prefersReduced } from '../hooks.js'

// Dot + trailing ring. Ring grows over links/buttons and can show a label via data-cursor="label".
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const d = dot.current
    const r = ring.current
    document.documentElement.classList.add('has-cursor')
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      d.style.transform = `translate3d(${x}px,${y}px,0)`
      d.style.opacity = r.style.opacity = '1'
    }
    const over = (e) => {
      const t = e.target.closest ? e.target.closest('a,button,[data-cursor],input') : null
      r.classList.toggle('hot', !!t)
      r.dataset.label = (t && t.dataset.cursor) || ''
    }
    const down = () => r.classList.add('down')
    const up = () => r.classList.remove('down')
    const loop = () => {
      rx += (x - rx) * 0.17
      ry += (y - ry) * 0.17
      r.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <>
      <div className="cur-ring" ref={ring} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
