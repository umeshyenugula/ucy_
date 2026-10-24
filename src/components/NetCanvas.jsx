import { useEffect, useRef } from 'react'
import { prefersReduced } from '../hooks.js'

// A living service mesh: drifting nodes, labelled hubs taken from the real stack, and amber
// packets that hop node-to-node. The pointer bends the mesh and links to nearby nodes;
// clicking fires a burst of packets from the closest node.
const HUBS = ['FastAPI', 'Auth', 'WebSocket', 'Postgres', 'Redis', 'Kafka', 'Docker']
const LINK = 135

export default function NetCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    const host = c.parentElement
    const ctx = c.getContext('2d')
    const reduce = prefersReduced()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let nodes = []
    let packets = []
    let raf = 0
    let running = true
    const mouse = { x: -9999, y: -9999, on: false }

    const build = () => {
      const r = c.getBoundingClientRect()
      w = r.width
      h = r.height
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(30, Math.min(95, Math.floor((w * h) / 16000)))
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.2 + Math.random() * 1.3,
        hub: null,
        near: [],
      }))
      const gap = Math.floor(n / HUBS.length)
      HUBS.forEach((name, i) => {
        const nd = nodes[i * gap]
        nd.hub = name
        nd.r = 4.2
      })
      packets = []
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const spawn = (from) => {
      if (!from || !from.near.length) return
      const to = from.near[(Math.random() * from.near.length) | 0]
      packets.push({ a: from, b: to, t: 0, s: 0.016 + Math.random() * 0.012, hops: 0 })
    }

    const step = (move = true) => {
      ctx.clearRect(0, 0, w, h)

      for (const nd of nodes) {
        nd.near.length = 0
        if (move) {
          nd.x += nd.vx
          nd.y += nd.vy
          if (nd.x < -20 || nd.x > w + 20) nd.vx *= -1
          if (nd.y < -20 || nd.y > h + 20) nd.vy *= -1
          if (mouse.on) {
            const dx = nd.x - mouse.x
            const dy = nd.y - mouse.y
            const d = Math.hypot(dx, dy)
            if (d < 170 && d > 0.1) {
              const f = (170 - d) * 0.010
              nd.x += (dx / d) * f
              nd.y += (dy / d) * f
            }
          }
        }
      }

      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const k = 1 - Math.sqrt(d2) / LINK
            const hot = a.hub || b.hub
            ctx.strokeStyle = `rgba(150,110,255,${(hot ? 0.5 : 0.28) * k})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            a.near.push(b)
            b.near.push(a)
          }
        }
        if (mouse.on) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y)
          if (d < 200) {
            ctx.strokeStyle = `rgba(255,181,71,${0.55 * (1 - d / 200)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }
      }

      if (move && !reduce && packets.length < 28 && Math.random() < 0.07) {
        const hubs = nodes.filter((n) => n.hub && n.near.length)
        spawn(Math.random() < 0.6 && hubs.length ? hubs[(Math.random() * hubs.length) | 0] : nodes[(Math.random() * nodes.length) | 0])
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        if (move) p.t += p.s
        const t = Math.min(p.t, 1)
        const x = lerp(p.a.x, p.b.x, t)
        const y = lerp(p.a.y, p.b.y, t)
        const t2 = Math.max(0, t - 0.2)
        ctx.strokeStyle = 'rgba(255,181,71,0.7)'
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(lerp(p.a.x, p.b.x, t2), lerp(p.a.y, p.b.y, t2))
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.fillStyle = '#ffb547'
        ctx.shadowColor = '#ffb547'
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.arc(x, y, 2.3, 0, 6.283)
        ctx.fill()
        ctx.shadowBlur = 0
        if (p.t >= 1) {
          packets.splice(i, 1)
          if (p.hops < 5 && Math.random() < 0.7 && p.b.near.length) {
            const nx = p.b.near[(Math.random() * p.b.near.length) | 0]
            packets.push({ a: p.b, b: nx, t: 0, s: p.s, hops: p.hops + 1 })
          }
        }
      }

      const now = performance.now()
      for (const nd of nodes) {
        if (nd.hub) {
          const pulse = 0.5 + 0.5 * Math.sin(now / 700 + nd.x)
          ctx.strokeStyle = `rgba(185,160,255,${0.25 + 0.3 * pulse})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, nd.r + 4 + pulse * 5, 0, 6.283)
          ctx.stroke()
          ctx.fillStyle = '#b9a0ff'
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, nd.r, 0, 6.283)
          ctx.fill()
          ctx.font = '500 11px "JetBrains Mono Variable", "JetBrains Mono", monospace'
          ctx.fillStyle = 'rgba(243,240,251,0.72)'
          ctx.fillText(nd.hub, nd.x + 14, nd.y + 4)
        } else {
          ctx.fillStyle = 'rgba(210,195,255,0.65)'
          ctx.beginPath()
          ctx.arc(nd.x, nd.y, nd.r, 0, 6.283)
          ctx.fill()
        }
      }
    }

    const loop = () => {
      if (running) step(true)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      build()
      cancelAnimationFrame(raf)
      if (reduce) {
        step(false)
        step(false)
      } else {
        raf = requestAnimationFrame(loop)
      }
    }

    const onMove = (e) => {
      const r = c.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = true
    }
    const onLeave = () => {
      mouse.on = false
    }
    const onClick = (e) => {
      if (reduce) return
      const r = c.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      let best = null
      let bd = 1e9
      for (const n of nodes) {
        const d = Math.hypot(n.x - mx, n.y - my)
        if (d < bd) {
          bd = d
          best = n
        }
      }
      for (let i = 0; i < 6; i++) spawn(best)
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('click', onClick)
    const ro = new ResizeObserver(start)
    ro.observe(c)
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
    })
    io.observe(host)
    start()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
}
