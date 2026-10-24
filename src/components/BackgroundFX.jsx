import { useEffect } from 'react'
import { finePointer, prefersReduced } from '../hooks.js'

// Fixed backdrop: drifting aurora blobs, a masked grid, and a soft light that follows the pointer.
export default function BackgroundFX() {
  useEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const root = document.documentElement
    const move = (e) => {
      root.style.setProperty('--gx', e.clientX + 'px')
      root.style.setProperty('--gy', e.clientY + 'px')
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return (
    <div className="bg-fx" aria-hidden="true">
      <span className="blob a" />
      <span className="blob b" />
      <span className="blob c" />
      <span className="grid" />
      <span className="follow" />
    </div>
  )
}
