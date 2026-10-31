import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from '../router.jsx'
import { COMPOUNDS, LAYERS, PROJECTS, countFor, inCompound, techList } from '../data/stack.js'
import { projects } from '../data/projects.js'
import { prefersReduced } from '../hooks.js'

// The stack as a periodic table. Every tool is an element (atomic number, symbol, layer colour); the dots
// orbiting it are the projects that use it. Pick a compound and its formula assembles, its elements light
// up and a bond web is drawn across the table. All the data comes from src/data/stack.js.
//
// Layout: one row per layer, nine columns (the widest layer is Services, with nine tools). Under 1100px the
// layer name moves above its tiles and the table reflows to six columns, under 760px to three.
const COLS = 9
const ELEMENTS = techList()
const BY_SYMBOL = Object.fromEntries(ELEMENTS.map((t) => [t.s, t]))
const PROJECT = Object.fromEntries(PROJECTS.map((p) => [p.id, p]))
const COUNTS = Object.fromEntries(COMPOUNDS.map((c) => [c.id, countFor(c.id)]))

// Each project keeps its own orbital plane and period, so one system's electrons always travel together.
const ORBIT = {
  'jnana-setu': { tilt: -54, dur: 8 },
  'vidura-niti': { tilt: 54, dur: 10 },
  flasio: { tilt: 0, dur: 6.4 },
}

// Bonds: the minimum spanning tree of the lit tiles (so the web is always one connected molecule), plus
// every pair of lit tiles that touch. Drawn from the lower atomic number to the higher, so the flow runs
// from the interface down to the runtime. It describes the table, not the call graph; the architecture
// pages cover that.
function bonds(pts, reach) {
  const n = pts.length
  if (n < 2) return []
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
  const out = new Map()
  const add = (i, j) => {
    const [a, b] = pts[i].z < pts[j].z ? [i, j] : [j, i]
    out.set(`${pts[a].s}-${pts[b].s}`, { k: `${pts[a].s}-${pts[b].s}`, x1: pts[a].x, y1: pts[a].y, x2: pts[b].x, y2: pts[b].y })
  }
  const used = new Array(n).fill(false)
  const link = new Array(n).fill(0)
  const best = pts.map((p) => dist(p, pts[0]))
  used[0] = true
  for (let step = 1; step < n; step++) {
    let k = -1
    for (let i = 0; i < n; i++) if (!used[i] && (k < 0 || best[i] < best[k])) k = i
    used[k] = true
    add(link[k], k)
    for (let i = 0; i < n; i++) {
      if (used[i]) continue
      const d = dist(pts[k], pts[i])
      if (d < best[i]) {
        best[i] = d
        link[i] = k
      }
    }
  }
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (dist(pts[i], pts[j]) <= reach) add(i, j)
  return [...out.values()].sort((a, b) => a.k.localeCompare(b.k))
}

// arrow keys move to the nearest tile in that direction, whatever the current column count is
function neighbour(from, key, all) {
  const a = from.getBoundingClientRect()
  const ax = a.left + a.width / 2
  const ay = a.top + a.height / 2
  const horizontal = key === 'ArrowLeft' || key === 'ArrowRight'
  let best = null
  let bd = Infinity
  all.forEach((el) => {
    if (el === from) return
    const b = el.getBoundingClientRect()
    const dx = b.left + b.width / 2 - ax
    const dy = b.top + b.height / 2 - ay
    const ahead = key === 'ArrowRight' ? dx > 8 : key === 'ArrowLeft' ? dx < -8 : key === 'ArrowDown' ? dy > 8 : dy < -8
    if (!ahead) return
    const d = horizontal ? Math.abs(dx) + Math.abs(dy) * 3 : Math.abs(dy) + Math.abs(dx) * 3
    if (d < bd) {
      bd = d
      best = el
    }
  })
  return best
}

// tilt the hovered tile toward the pointer (mouse only; writes CSS variables, no React state)
function tilt(e) {
  if (e.pointerType !== 'mouse' || prefersReduced()) return
  const r = e.currentTarget.parentElement.getBoundingClientRect() // the cell never moves, the tile does
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  const s = e.currentTarget.style
  s.setProperty('--ry', `${((px - 0.5) * 16).toFixed(1)}deg`)
  s.setProperty('--rx', `${((0.5 - py) * 14).toFixed(1)}deg`)
  s.setProperty('--mx', `${(px * 100).toFixed(0)}%`)
  s.setProperty('--my', `${(py * 100).toFixed(0)}%`)
}

function Orbits({ t, cid }) {
  return t.p.map((id) => (
    <span
      key={id}
      className={`pt-orb${cid === id ? ' on' : cid ? ' quiet' : ''}`}
      style={{ '--eh': PROJECT[id].hue, '--tilt': `${ORBIT[id].tilt}deg`, '--dur': `${ORBIT[id].dur}s` }}
      aria-hidden="true"
    >
      <span className="pt-sq">
        <span className="pt-rv">
          <i className="pt-e" />
        </span>
      </span>
    </span>
  ))
}

function Dock({ el, pinned, onClose, compound, members }) {
  if (el) {
    return (
      <div className="pt-dock" role="region" aria-label="Element inspector" aria-live="polite">
        <div className="pt-chip" style={{ '--h': el.hue }}>
          <span className="z">{el.z}</span>
          <b>{el.s}</b>
        </div>
        <div className="pt-dk-main">
          <p className="pt-dk-t">
            {el.n}
            <span>
              {el.layerName} · {el.layerTag}
            </span>
          </p>
          <p className="pt-dk-n">{el.note}</p>
        </div>
        <div className="pt-dk-b">
          {el.p.length ? (
            el.p.map((id) => (
              <Link key={id} to={`/work/${id}`} className="pt-use" style={{ '--h': PROJECT[id].hue }}>
                {PROJECT[id].label}
              </Link>
            ))
          ) : (
            <em>Toolkit. No bond to these systems.</em>
          )}
          {pinned && (
            <button type="button" className="pt-clear" onClick={onClose}>
              Unpin
            </button>
          )}
        </div>
      </div>
    )
  }
  if (compound) {
    const proj = projects.find((p) => p.id === compound.id)
    const layers = new Set(members.map((t) => t.layer)).size
    return (
      <div className="pt-dock sum" role="region" aria-label="Compound summary" aria-live="polite">
        <div className="pt-chip c">
          <b>{members.length}</b>
        </div>
        <div className="pt-dk-main">
          <p className="pt-dk-t">
            {compound.label}
            <span>
              {members.length} elements across {layers} layers
            </span>
          </p>
          <p className="pt-dk-n">
            {proj
              ? proj.tagline
              : 'Tools I use, but that none of these three systems prove. They stay dashed, with no electrons, so the table never claims more than the projects show.'}
          </p>
        </div>
        <div className="pt-dk-b">
          <Link to={compound.to} className="btn line small">
            {proj ? 'Open the architecture' : 'See all skills'}
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="pt-dock sum" role="region" aria-label="Element inspector" aria-live="polite">
      <div className="pt-chip c">
        <b>{ELEMENTS.length}</b>
      </div>
      <div className="pt-dk-main">
        <p className="pt-dk-t">
          The full table<span>{LAYERS.length} layers</span>
        </p>
        <p className="pt-dk-n">Pick a compound to light up what it is built from. Hover a tile to read it, click to pin it.</p>
      </div>
    </div>
  )
}

export default function PeriodicStack() {
  const [cid, setCid] = useState('jnana-setu') // the picked compound, or null for the whole table
  const [sel, setSel] = useState(null) // pinned element (click or tap)
  const [hov, setHov] = useState(null) // previewed element (mouse, keyboard focus or formula term)
  const [cur, setCur] = useState(ELEMENTS[0].s) // the one tile in the tab order (roving tabindex)
  const [web, setWeb] = useState({ cid: null, w: 0, h: 0, edges: [] })
  const [live, setLive] = useState(true)
  const table = useRef(null)
  const tiles = useRef({})

  const compound = COMPOUNDS.find((c) => c.id === cid) || null
  const members = useMemo(() => (cid ? ELEMENTS.filter((t) => inCompound(t, cid)) : []), [cid])
  const rank = useMemo(() => Object.fromEntries(members.map((t, i) => [t.s, i])), [members])
  const shown = hov || sel
  const el = shown ? BY_SYMBOL[shown] : null

  // measure the lit tiles and lay the bond web over them; again whenever the table is resized
  useLayoutEffect(() => {
    const tb = table.current
    if (!tb) return undefined
    let raf = 0
    const measure = () => {
      raf = 0
      const r = tb.getBoundingClientRect()
      if (!cid || window.innerWidth <= 760) {
        setWeb({ cid, w: r.width, h: r.height, edges: [] })
        return
      }
      const pts = members
        .map((t) => {
          const b = tiles.current[t.s] && tiles.current[t.s].getBoundingClientRect()
          return b ? { s: t.s, z: t.z, x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, w: b.width } : null
        })
        .filter(Boolean)
      const reach = pts.length ? (pts[0].w + 8) * 1.15 : 0
      setWeb({ cid, w: r.width, h: r.height, edges: bonds(pts, reach) })
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    const ro = new ResizeObserver(queue)
    ro.observe(tb)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [cid, members])

  // electrons stop orbiting while the table is off screen
  useEffect(() => {
    const tb = table.current
    if (!tb || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '160px' })
    io.observe(tb)
    return () => io.disconnect()
  }, [])

  const onKey = (e) => {
    if (e.key === 'Escape') {
      setSel(null)
      return
    }
    if (!/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return
    const from = e.target.closest && e.target.closest('.pt-tile')
    if (!from) return
    const next = neighbour(from, e.key, Object.values(tiles.current))
    if (next) {
      e.preventDefault()
      next.focus()
    }
  }

  const gaps = (n) => Array.from({ length: Math.max(0, COLS - n) }, (_, i) => <li key={`gap${i}`} className="pt-gap" aria-hidden="true" />)

  return (
    <section
      className={`wrap pt${compound && compound.soft ? ' soft' : ''}${live ? '' : ' off'}`}
      style={{ '--ch': compound ? compound.hue : 220 }}
      aria-label="The stack as a periodic table"
    >
      <div className="pt-ctl">
        <div className="pt-pick" role="group" aria-label="Compound">
          {COMPOUNDS.map((c) => (
            <button key={c.id} type="button" className={c.soft ? 'soft' : ''} style={{ '--ch': c.hue }} aria-pressed={cid === c.id} onClick={() => setCid(cid === c.id ? null : c.id)}>
              <i aria-hidden="true" />
              {c.label}
              <small>{COUNTS[c.id]}</small>
            </button>
          ))}
        </div>

        <p className="pt-formula" aria-hidden="true" key={cid || 'none'}>
          {compound ? (
            <>
              <b>{compound.label}</b>
              <span className="pt-eq">=</span>
              {members.map((t, i) => (
                <Fragment key={t.s}>
                  <span
                    className="pt-term"
                    style={{ '--i': i, '--h': t.hue }}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setHov(t.s)}
                    onPointerLeave={() => setHov((h) => (h === t.s ? null : h))}
                  >
                    <span className="pt-t">{t.s}</span>
                    {i < members.length - 1 && <span className="pt-p">+</span>}
                  </span>{' '}
                </Fragment>
              ))}
            </>
          ) : (
            <span className="pt-eq">Pick a compound to see its formula.</span>
          )}
        </p>
        <p className="sr-only">{compound ? `${compound.label} is made of ${members.map((t) => t.n).join(', ')}.` : 'No compound picked. Every tool is shown.'}</p>
        <p className="pt-note">Each tile is a tool. The dots orbiting it are the systems that use it. Dashed tiles are in my toolkit, outside these three systems.</p>
      </div>

      <div className="pt-table" ref={table} onKeyDown={onKey}>
        {LAYERS.map((L, r) => {
          const row = ELEMENTS.filter((t) => t.layer === r)
          return (
            <div className="pt-row" key={L.id} style={{ '--h': L.hue }}>
              <div className="pt-lab">
                <h3>{L.name}</h3>
                <p>{L.tag}</p>
              </div>
              <ul className="pt-tiles">
                {row.map((t) => {
                  const lit = cid && cid === 'toolkit' ? t.p.length === 0 : cid && t.p.includes(cid)
                  const cls = ['pt-tile', cid ? (lit ? 'lit' : 'dim') : '', t.p.length ? '' : 'tk', sel === t.s ? 'sel' : '', hov === t.s ? 'hot' : ''].filter(Boolean).join(' ')
                  return (
                    <li key={t.s} className="pt-cell">
                      <button
                        ref={(n) => {
                          if (n) tiles.current[t.s] = n
                          else delete tiles.current[t.s]
                        }}
                        type="button"
                        className={cls}
                        data-s={t.s}
                        style={{ '--h': t.hue, '--z': t.z, '--i': rank[t.s] ?? 0 }}
                        tabIndex={cur === t.s ? 0 : -1}
                        aria-pressed={sel === t.s}
                        aria-label={`${t.n}, symbol ${t.s}, number ${t.z}, ${t.layerName}. ${t.p.length ? `Used by ${t.p.map((id) => PROJECT[id].label).join(' and ')}.` : 'In my toolkit, not part of these systems.'}`}
                        onClick={() => setSel((s) => (s === t.s ? null : t.s))}
                        onFocus={(e) => {
                          setCur(t.s)
                          if (e.currentTarget.matches(':focus-visible')) setHov(t.s)
                        }}
                        onBlur={() => setHov((h) => (h === t.s ? null : h))}
                        onPointerEnter={(e) => {
                          if (e.pointerType === 'mouse') setHov(t.s)
                          tilt(e)
                        }}
                        onPointerMove={tilt}
                        onPointerLeave={() => setHov((h) => (h === t.s ? null : h))}
                      >
                        <span className="pt-z">{t.z}</span>
                        <span className="pt-s">{t.s}</span>
                        <span className="pt-nm">{t.short || t.n}</span>
                        <Orbits t={t} cid={cid} />
                      </button>
                    </li>
                  )
                })}
                {gaps(row.length)}
              </ul>
            </div>
          )
        })}

        <svg className="pt-web" width={web.w} height={web.h} viewBox={`0 0 ${web.w || 1} ${web.h || 1}`} aria-hidden="true" focusable="false" key={cid || 'none'}>
          {web.cid === cid &&
            web.edges.map((e, k) => {
              const d = `M${e.x1.toFixed(1)} ${e.y1.toFixed(1)}L${e.x2.toFixed(1)} ${e.y2.toFixed(1)}`
              return (
                <g key={e.k} style={{ '--k': k }}>
                  <path className="pt-bond" d={d} pathLength={compound && compound.soft ? undefined : 1} />
                  <path className="pt-flow" d={d} />
                </g>
              )
            })}
        </svg>
      </div>

      <Dock el={el} pinned={!!sel && shown === sel} onClose={() => setSel(null)} compound={compound} members={members} />
    </section>
  )
}
