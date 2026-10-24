import { useEffect, useMemo, useRef, useState } from 'react'
import { prefersReduced } from '../hooks.js'

// Animated architecture diagram. Four layouts (snake pipeline, stacked layers, one-to-many branch,
// two-into-one merge) are computed from the project's `flow` data. One packet travels every edge in
// sequence (driven by requestAnimationFrame + getPointAtLength, which behaves the same in every
// browser) and each node flashes as the packet arrives, so the motion reads as the request path.
// Node boxes size to their text, so nothing clips.
const VBW_WIDE = 640
const VBW_COMPACT = 360
const H = 64
const CH = 8.6
const SH = 6.9

function boxW(nodes) {
  const w = Math.max(...nodes.map((n) => Math.max(n.label.length * CH, n.sub.length * SH) + 44))
  return Math.min(270, Math.max(190, w))
}

function layout(variant, flow, compact) {
  const VBW = compact ? VBW_COMPACT : VBW_WIDE
  const n = flow.length
  const W = boxW(flow)
  const nodes = []
  const paths = []
  const lit = []
  let vbh = 0

  if (variant === 'layers') {
    const bh = 56
    const gap = 28
    flow.forEach((f, i) => nodes.push({ ...f, x: 20, y: 16 + i * (bh + gap), w: VBW - 40, h: bh, tx: 76, anchor: 'start' }))
    for (let i = 0; i < n - 1; i++) {
      const y = 16 + i * (bh + gap) + bh
      paths.push(`M 44,${y} L 44,${y + gap}`)
    }
    flow.forEach((_, i) => lit.push(i - 1))
    vbh = 16 + n * bh + (n - 1) * gap + 16
  } else if (variant === 'branch') {
    const k = n - 1
    const cw = Math.min(W, (VBW - 40 - (k - 1) * 20) / k)
    const cy = 16 + H + 84
    nodes.push({ ...flow[0], x: (VBW - W) / 2, y: 16, w: W, h: H, tx: VBW / 2, anchor: 'middle' })
    lit.push(-1)
    for (let j = 0; j < k; j++) {
      const x = 20 + j * (cw + 20)
      nodes.push({ ...flow[j + 1], x, y: cy, w: cw, h: H, tx: x + cw / 2, anchor: 'middle' })
      const mid = 16 + H + 42
      paths.push(`M ${VBW / 2},${16 + H} C ${VBW / 2},${mid} ${x + cw / 2},${mid} ${x + cw / 2},${cy}`)
      lit.push(j)
    }
    vbh = cy + H + 16
  } else if (variant === 'merge') {
    const tail = n - 2
    const tw = Math.min(W, (VBW - 60) / 2)
    const ty0 = 16 + H + 84
    const ax = 20
    const bx = VBW - 20 - tw
    nodes.push({ ...flow[0], x: ax, y: 16, w: tw, h: H, tx: ax + tw / 2, anchor: 'middle' })
    nodes.push({ ...flow[1], x: bx, y: 16, w: tw, h: H, tx: bx + tw / 2, anchor: 'middle' })
    const mid = 16 + H + 42
    paths.push(`M ${ax + tw / 2},${16 + H} C ${ax + tw / 2},${mid} ${VBW / 2},${mid} ${VBW / 2},${ty0}`)
    paths.push(`M ${bx + tw / 2},${16 + H} C ${bx + tw / 2},${mid} ${VBW / 2},${mid} ${VBW / 2},${ty0}`)
    lit.push(-1, 0)
    for (let t = 0; t < tail; t++) {
      const y = ty0 + t * (H + 46)
      nodes.push({ ...flow[2 + t], x: (VBW - W) / 2, y, w: W, h: H, tx: VBW / 2, anchor: 'middle' })
      if (t < tail - 1) paths.push(`M ${VBW / 2},${y + H} L ${VBW / 2},${y + H + 46}`)
      lit.push(1 + t)
    }
    vbh = ty0 + tail * H + (tail - 1) * 46 + 16
  } else {
    // snake pipeline: two columns, flows left>right, down, right>left, down...
    const rowGap = 66
    const xs = [20, VBW - 20 - W]
    const colOf = (i) => (Math.floor(i / 2) % 2 === 0 ? i % 2 : 1 - (i % 2))
    flow.forEach((f, i) => {
      const x = xs[colOf(i)]
      const y = 16 + Math.floor(i / 2) * (H + rowGap)
      nodes.push({ ...f, x, y, w: W, h: H, tx: x + W / 2, anchor: 'middle' })
      lit.push(i - 1)
    })
    for (let i = 0; i < n - 1; i++) {
      const a = nodes[i]
      const b = nodes[i + 1]
      if (a.y === b.y) {
        const ym = a.y + H / 2
        paths.push(a.x < b.x ? `M ${a.x + W},${ym} L ${b.x},${ym}` : `M ${a.x},${ym} L ${b.x + W},${ym}`)
      } else {
        paths.push(`M ${a.x + W / 2},${a.y + H} L ${b.x + W / 2},${b.y}`)
      }
    }
    const rows = Math.ceil(n / 2)
    vbh = 16 + rows * H + (rows - 1) * rowGap + 16
  }
  return { nodes, paths, lit, vbh, vbw: VBW }
}

const HOP = 850 // ms per edge
const REST = 1500 // ms pause between runs
const FLASH = 1100

export default function FlowDiagram({ id, variant, flow }) {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = () => setCompact(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // narrow screens get a vertical stack drawn at a smaller width so labels stay legible
  const { nodes, paths, lit, vbh, vbw } = useMemo(() => layout(compact ? 'layers' : variant, flow, compact), [variant, flow, compact])
  const svg = useRef(null)

  useEffect(() => {
    const root = svg.current
    if (!root || prefersReduced()) return
    const edges = Array.from(root.querySelectorAll('.fd-edge'))
    const packets = Array.from(root.querySelectorAll('.fd-packet'))
    const flashes = Array.from(root.querySelectorAll('.fd-flash'))
    const lens = edges.map((e) => e.getTotalLength())
    const cycle = edges.length * HOP + REST
    const t0 = performance.now() + 500
    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)
    let raf = 0
    let running = true

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (!running || now < t0) return
      const c = (now - t0) % cycle
      edges.forEach((edge, i) => {
        const local = c - i * HOP
        const on = local >= 0 && local < HOP
        const pk = packets[i]
        if (on) {
          const pt = edge.getPointAtLength(lens[i] * ease(local / HOP))
          pk.setAttribute('cx', pt.x.toFixed(1))
          pk.setAttribute('cy', pt.y.toFixed(1))
          pk.setAttribute('opacity', '1')
        } else {
          pk.setAttribute('opacity', '0')
        }
        edge.classList.toggle('live', on)
      })
      flashes.forEach((f, k) => {
        const d = c - (lit[k] + 1) * HOP
        f.setAttribute('opacity', d >= 0 && d < FLASH ? (1 - d / FLASH).toFixed(3) : '0')
      })
    }
    raf = requestAnimationFrame(tick)
    const io = new IntersectionObserver(([e]) => (running = e.isIntersecting))
    io.observe(root)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [lit, paths])

  return (
    <svg ref={svg} className="fd" viewBox={`0 0 ${vbw} ${vbh}`} role="img" aria-label={`Request path: ${flow.map((f) => f.label).join(', then ')}`}>
      <defs>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((d, i) => (
        <path key={`e${i}`} className="fd-edge" d={d} />
      ))}

      {nodes.map((nd) => (
        <g key={nd.label}>
          <rect className={`fd-node ${nd.accent ? 'accent' : ''}`} x={nd.x} y={nd.y} width={nd.w} height={nd.h} rx="12" />
          <rect className="fd-flash" x={nd.x} y={nd.y} width={nd.w} height={nd.h} rx="12" opacity="0" filter={`url(#${id}-glow)`} />
          <text className="fd-label" x={nd.tx} y={nd.y + nd.h / 2 - 3} textAnchor={nd.anchor}>
            {nd.label}
          </text>
          <text className="fd-sub" x={nd.tx} y={nd.y + nd.h / 2 + 15} textAnchor={nd.anchor}>
            {nd.sub}
          </text>
        </g>
      ))}

      {paths.map((_, i) => (
        <circle key={`p${i}`} className="fd-packet" r="5" cx="-20" cy="-20" opacity="0" filter={`url(#${id}-glow)`} />
      ))}
    </svg>
  )
}
