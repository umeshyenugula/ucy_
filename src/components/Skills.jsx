import { useState } from 'react'
import { Title } from './ui.jsx'

const ICON = (n) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}`

const GROUPS = [
  {
    label: 'Languages',
    blurb: 'Python and JavaScript daily; C, C++, Java and Go when the problem asks for them.',
    items: [
      ['Python', 'python/python-original.svg'],
      ['Java', 'java/java-original.svg'],
      ['Go', 'go/go-original.svg'],
      ['C', 'c/c-original.svg'],
      ['C++', 'cplusplus/cplusplus-original.svg'],
      ['JavaScript', 'javascript/javascript-original.svg'],
      ['Bash', 'bash/bash-original.svg'],
    ],
  },
  {
    label: 'Frontend',
    blurb: 'Component-driven interfaces that stay fast and responsive.',
    items: [
      ['React', 'react/react-original.svg'],
      ['Next.js', 'nextjs/nextjs-original.svg'],
      ['HTML5', 'html5/html5-original.svg'],
      ['CSS3', 'css3/css3-original.svg'],
      ['Tailwind CSS', 'tailwindcss/tailwindcss-original.svg'],
      ['Bootstrap', 'bootstrap/bootstrap-original.svg'],
    ],
  },
  {
    label: 'Backend',
    blurb: 'Async-first APIs, realtime channels and typed contracts.',
    items: [
      ['FastAPI', 'fastapi/fastapi-original.svg'],
      ['Flask', 'flask/flask-original.svg'],
      ['Django', 'django/django-plain.svg'],
      ['REST APIs', 'json/json-original.svg'],
      ['WebSockets', 'socketio/socketio-original.svg'],
      ['gRPC', 'grpc/grpc-original.svg'],
    ],
  },
  {
    label: 'Databases',
    blurb: 'Relational, document, graph and in-memory stores.',
    items: [
      ['PostgreSQL', 'postgresql/postgresql-original.svg'],
      ['MongoDB', 'mongodb/mongodb-original.svg'],
      ['Supabase', 'supabase/supabase-original.svg'],
      ['Neo4j Aura', 'neo4j/neo4j-original.svg'],
      ['Redis', 'redis/redis-original.svg'],
    ],
  },
  {
    label: 'Cloud & DevOps',
    blurb: 'Containers, pipelines and hosting from hobby tier to droplets.',
    items: [
      ['Docker', 'docker/docker-original.svg'],
      ['Git', 'git/git-original.svg'],
      ['GitHub', 'github/github-original.svg'],
      ['Vercel', 'vercel/vercel-original.svg'],
      ['Render', 'render/render-original.svg'],
      ['Kafka', 'apachekafka/apachekafka-original.svg'],
      ['DigitalOcean', 'digitalocean/digitalocean-original.svg'],
    ],
  },
  {
    label: 'Auth & Security',
    blurb: 'Sessions, tokens and transport security done properly.',
    items: [
      ['JWT', 'jwt/jwt-original.svg'],
      ['Google OAuth', 'google/google-original.svg'],
      ['OAuth 2.0', 'oauth/oauth-original.svg'],
      ['HTTPS / TLS / SSL', 'letsencrypt/letsencrypt-original.svg'],
    ],
  },
  {
    label: 'Tools',
    blurb: 'Day-to-day tooling for debugging, data work and shipping.',
    items: [
      ['Linux', 'linux/linux-original.svg'],
      ['Postman', 'postman/postman-original.svg'],
      ['cURL', 'bash/bash-original.svg'],
      ['Pandas', 'pandas/pandas-original.svg'],
      ['OpenPyXL', 'python/python-original.svg'],
    ],
  },
]

export default function Skills() {
  const [active, setActive] = useState(0)
  const g = GROUPS[active]

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }

  return (
    <section id="stack" className="sec">
      <div className="sec-head">
        <Title>Stack</Title>
        <p className="sec-note">Seven areas, {GROUPS.reduce((n, x) => n + x.items.length, 0)} tools I have shipped with.</p>
      </div>

      <div className="stack-wrap" data-reveal>
        <div className="tabs" role="tablist" aria-label="Skill categories">
          {GROUPS.map((x, i) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={i === active}
              className={`tab ${i === active ? 'on' : ''}`}
              onClick={() => setActive(i)}
            >
              {x.label}
              <sup>{x.items.length}</sup>
            </button>
          ))}
        </div>

        <p className="stack-blurb" key={g.label}>
          {g.blurb}
        </p>

        <div className="tiles" key={g.label} role="tabpanel">
          {g.items.map(([label, icon], i) => (
            <div className="tile" key={label} style={{ '--i': i }} onPointerMove={spot}>
              <span className="orb">
                <img src={ICON(icon)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </span>
              <span className="tile-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
