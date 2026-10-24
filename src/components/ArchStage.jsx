import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { prefersReduced } from '../hooks.js'

// Interactive architecture stage. A model (zones + nodes) and a list of steps drive everything:
// a glowing packet travels each step's edge (rAF + getPointAtLength), nodes light as it arrives,
// and a live trace, status rail and inspector stay in sync. Edges are routed automatically from
// node sides, so adding a node or a step never needs hand-drawn paths.
const SIDES = (n) => ({ l: [n.x, n.y + n.h / 2], r: [n.x + n.w, n.y + n.h / 2], t: [n.x + n.w / 2, n.y], b: [n.x + n.w / 2, n.y + n.h] })
const OUT = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] }
const pad = (n) => String(n).padStart(2, '0')
export const ekey = (s) => `${s.from}>${s.to}:${s.fs || ''}${s.ts || ''}`

export function route(a, b, fs, ts) {
  const dx = b.x + b.w / 2 - (a.x + a.w / 2)
  const dy = b.y + b.h / 2 - (a.y + a.h / 2)
  const horiz = Math.abs(dx) * 0.8 >= Math.abs(dy)
  fs = fs || (horiz ? (dx > 0 ? 'r' : 'l') : dy > 0 ? 'b' : 't')
  ts = ts || (horiz ? (dx > 0 ? 'l' : 'r') : dy > 0 ? 't' : 'b')
  const [x1, y1] = SIDES(a)[fs]
  const [x2, y2] = SIDES(b)[ts]
  const d = fs === ts ? 34 : Math.max(40, Math.hypot(x2 - x1, y2 - y1) * 0.35)
  const [ox1, oy1] = OUT[fs]
  const [ox2, oy2] = OUT[ts]
  return `M${x1},${y1} C${x1 + ox1 * d},${y1 + oy1 * d} ${x2 + ox2 * d},${y2 + oy2 * d} ${x2},${y2}`
}

export default function ArchStage({ model, steps, resetKey, label, header, aside }) {
  const { w: VW, h: VH, zones, nodes } = model
  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes])
  const zoneById = useMemo(() => Object.fromEntries(zones.map((z) => [z.id, z])), [zones])
  const edges = useMemo(() => {
    const m = new Map()
    steps.forEach((s) => {
      if (!s.from) return
      const k = ekey(s)
      if (!m.has(k)) m.set(k, { key: k, d: route(byId[s.from], byId[s.to], s.fs, s.ts) })
    })
    return [...m.values()]
  }, [steps, byId])
  const involved = useMemo(() => {
    const s = new Set()
    steps.forEach((st) => {
      st.from && s.add(st.from)
      st.to && s.add(st.to)
      ;(st.hot || []).forEach((h) => s.add(h))
    })
    return s
  }, [steps])

  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReduced())
  const [speed, setSpeed] = useState(1)
  const [sel, setSel] = useState(null)
  const [inView, setInView] = useState(true)
  const [arrived, setArrived] = useState(false)
  const [mid, setMid] = useState(null)
  const root = useRef(null)
  const paths = useRef({})
  const pk = useRef(null)
  const idx = Math.min(i, steps.length - 1)
  const step = steps[idx]
  const live = playing && inView

  useEffect(() => {
    setI(0)
    setSel(null)
    setPlaying(!prefersReduced())
  }, [resetKey])

  useEffect(() => {
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const place = useCallback((s, p) => {
    const g = pk.current
    if (!g) return
    const path = s && s.from ? paths.current[ekey(s)] : null
    if (!path) {
      g.style.opacity = 0
      return
    }
    const L = path.getTotalLength()
    g.style.opacity = 1
    for (let k = 0; k < g.children.length; k++) {
      const pt = path.getPointAtLength(L * Math.max(0, p - k * 0.05))
      g.children[k].setAttribute('cx', pt.x)
      g.children[k].setAttribute('cy', pt.y)
    }
  }, [])

  // on every step change: reposition the edge label, and park the packet if not animating
  useEffect(() => {
    const path = step.from ? paths.current[ekey(step)] : null
    if (path) {
      // only label edges long enough to hold the pill without covering a node
      const L = path.getTotalLength()
      const pt = path.getPointAtLength(L / 2)
      setMid(step.label && L > step.label.length * 6.6 + 56 ? [pt.x, pt.y] : null)
    } else setMid(null)
    setArrived(!step.from || !live)
    if (!live) place(step, 1)
  }, [step, live, place])

  // the playback loop for the current step
  useEffect(() => {
    if (!live) return
    const travel = step.from ? 950 / speed : 0
    const dwell = (step.from ? 560 : 2300) / speed + (idx === steps.length - 1 ? 1500 / speed : 0)
    const t0 = performance.now()
    let raf
    let done = false
    const tick = (now) => {
      const el = now - t0
      const p = travel ? Math.min(1, el / travel) : 1
      place(step, p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
      if (p >= 1 && !done) {
        done = true
        setArrived(true)
      }
      if (el >= travel + dwell) {
        setI((v) => (v + 1) % steps.length)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [idx, live, speed, steps, step, place])

  const jump = useCallback((k) => {
    setI(k)
    setPlaying(false)
  }, [])
  const go = (d) => jump((idx + d + steps.length) % steps.length)

  const touched = new Set()
  const past = new Set()
  steps.slice(0, idx + 1).forEach((s, k) => {
    s.from && touched.add(s.from)
    s.to && touched.add(s.to)
    ;(s.hot || []).forEach((h) => touched.add(h))
    if (k < idx && s.from) past.add(ekey(s))
  })
  const curEdge = step.from ? ekey(step) : null
  const curNodes = new Set(arrived ? [step.to, ...(step.hot || [])].filter(Boolean) : step.from ? [step.from] : [])
  const usedBy = sel ? steps.map((s, k) => [s, k]).filter(([s]) => s.from === sel || s.to === sel || (s.hot || []).includes(sel)) : []
  const selNode = sel ? byId[sel] : null
  const ctx = { i: idx, step, steps, jump, playing }

  return (
    <div className="arch" ref={root}>
      <div className="arch-main">
        {header && header(ctx)}
        <div className="arch-box">
          <div className="arch-scroll" tabIndex={0} aria-label="Architecture diagram, scrolls sideways on small screens">
            <svg className="arch-svg" viewBox={`0 0 ${VW} ${VH}`} role="group" aria-label={label}>
              {zones.map((z) => (
                <g key={z.id} style={{ '--h': z.hue }}>
                  <rect className="an-zone" x={z.x} y={z.y} width={z.w} height={z.h} rx="22" />
                  <text className="an-zl" x={z.x + 16} y={z.y + 16}>
                    {z.label}
                  </text>
                </g>
              ))}
              {edges.map((e) => (
                <path key={e.key} ref={(el) => (paths.current[e.key] = el)} d={e.d} className={`an-edge${past.has(e.key) ? ' past' : ''}${curEdge === e.key ? ' cur' : ''}`} />
              ))}
              {nodes.map((n) => {
                const hue = n.hue ?? zoneById[n.zone]?.hue ?? 250
                return (
                  <g
                    key={n.id}
                    className={`an-node${involved.has(n.id) ? '' : ' off'}${touched.has(n.id) ? ' seen' : ''}${curNodes.has(n.id) ? ' cur' : ''}${sel === n.id ? ' sel' : ''}`}
                    style={{ '--h': hue }}
                    transform={`translate(${n.x} ${n.y})`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={sel === n.id}
                    aria-label={`${n.label}. ${n.sub}`}
                    onClick={() => setSel((v) => (v === n.id ? null : n.id))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSel((v) => (v === n.id ? null : n.id))
                      }
                    }}
                  >
                    <rect width={n.w} height={n.h} rx="14" />
                    <circle className="an-id" cx={n.w - 13} cy="13" r="3.2" />
                    <text className="an-t" x="14" y={n.h / 2 - 2}>
                      {n.label}
                    </text>
                    <text className="an-s" x="14" y={n.h / 2 + 14}>
                      {n.sub}
                    </text>
                  </g>
                )
              })}
              {mid && step.label && (
                <g className="an-pill" transform={`translate(${mid[0]} ${mid[1]})`}>
                  <rect x={-(step.label.length * 3.3 + 10)} y="-10" width={step.label.length * 6.6 + 20} height="20" rx="10" />
                  <text textAnchor="middle" y="3.6">
                    {step.label}
                  </text>
                </g>
              )}
              <g ref={pk} className="an-pk" style={{ opacity: 0 }}>
                <circle r="6.5" />
                <circle r="4.4" />
                <circle r="2.9" />
              </g>
            </svg>
          </div>
        </div>

        <div className="arch-ctl">
          <button className="cbtn" onClick={() => go(-1)} aria-label="Previous step">
            ‹
          </button>
          <button className="cbtn play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button className="cbtn" onClick={() => go(1)} aria-label="Next step">
            ›
          </button>
          <div className="arch-dots">
            {steps.map((_, k) => (
              <button key={k} className={`adot${k === idx ? ' on' : k < idx ? ' past' : ''}`} onClick={() => jump(k)} aria-label={`Go to step ${k + 1}`} />
            ))}
          </div>
          <button className="cspeed" onClick={() => setSpeed((s) => (s === 1 ? 1.6 : s === 1.6 ? 2.4 : 1))} aria-label="Change speed">
            {speed}×
          </button>
        </div>

        <div className="arch-cap" aria-live={playing ? 'off' : 'polite'}>
          <span className="arch-n">
            {pad(idx + 1)}
            <i>/{pad(steps.length)}</i>
          </span>
          <p>{step.text}</p>
        </div>
      </div>

      <aside className="arch-aside">
        {aside && aside(ctx)}
        <div className="arch-panel">
          <p className="ap-h">Inspector</p>
          {selNode ? (
            <>
              <h3 className="ap-t">{selNode.label}</h3>
              <p className="ap-s">{selNode.sub}</p>
              <p className="ap-d">{selNode.detail}</p>
              {usedBy.length > 0 && (
                <div className="ap-use">
                  {usedBy.map(([s, k]) => (
                    <button key={k} onClick={() => jump(k)} className={k === idx ? 'on' : ''}>
                      {pad(k + 1)}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="ap-d dim">Select any node to see what it owns and which steps use it.</p>
          )}
        </div>
      </aside>
    </div>
  )
}

export function TraceLog({ steps, i, jump }) {
  const box = useRef(null)
  useEffect(() => {
    const b = box.current
    if (b) b.scrollTop = b.scrollHeight
  }, [i])
  return (
    <div className="arch-panel">
      <p className="ap-h">Live trace</p>
      <div className="tl" ref={box} role="log" aria-label="Live trace">
        {steps.slice(0, i + 1).map((s, k) => (
          <button key={k} className={`tl-row${k === i ? ' cur' : ''}`} onClick={() => jump(k)}>
            <span className="tl-n">{pad(k + 1)}</span>
            <span className="tl-t">{s.log}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// items: [{ k: 'KEY', tone?: 'good' | 'bad' }]. A step lists the keys it reaches in `rail`.
export function StatusRail({ items, steps, i, title = 'State' }) {
  const seen = []
  steps.slice(0, i + 1).forEach((s) => [].concat(s.rail || []).forEach((r) => seen.push(r)))
  const last = seen[seen.length - 1]
  return (
    <div className="rail" aria-label={title}>
      <span className="rail-h">{title}</span>
      {items.map((it) => (
        <span key={it.k} className={`rail-c${it.tone ? ' ' + it.tone : ''}${seen.includes(it.k) ? ' done' : ''}${it.k === last ? ' cur' : ''}`}>
          {it.k}
        </span>
      ))}
    </div>
  )
}
