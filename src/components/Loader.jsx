import { useEffect, useState } from 'react'
import { prefersReduced } from '../hooks.js'

const LOG = [
  [0, 'booting react runtime'],
  [22, 'mounting asgi gateway'],
  [46, 'verifying biometric gate'],
  [68, 'syncing offline cache'],
  [90, 'ready'],
]

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [out, setOut] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const total = prefersReduced() ? 200 : 1700
    let raf
    let t0
    const tick = (t) => {
      if (t0 === undefined) t0 = t
      const p = Math.min(1, (t - t0) / total)
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setOut(true)
        onDone()
        setTimeout(() => setGone(true), 1100)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div id="gate" className={out ? 'out' : ''} aria-hidden="true">
      <div className="gate-panel top" />
      <div className="gate-panel bottom" />
      <div className="gate-content">
        <div className="gate-name">UCY_</div>
        <ul className="gate-log">
          {LOG.map(([at, line]) => (
            <li key={line} className={pct >= at ? 'on' : ''}>
              <span>{pct >= at ? '✓' : '·'}</span> {line}
            </li>
          ))}
        </ul>
        <div className="gate-count">
          {String(pct).padStart(2, '0')}
          <small>%</small>
        </div>
        <div className="gate-bar">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      </div>
    </div>
  )
}
