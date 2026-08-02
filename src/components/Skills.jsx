const ICON = (n) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}`

const GROUPS = [
  {
    label: 'Programming Languages',
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
    label: 'Frontend Development',
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
    label: 'Backend Development',
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
    label: 'Authentication & Security',
    items: [
      ['JWT', 'jwt/jwt-original.svg'],
      ['Google OAuth', 'google/google-original.svg'],
      ['OAuth 2.0', 'oauth/oauth-original.svg'],
      ['HTTPS / TLS/SSL', 'letsencrypt/letsencrypt-original.svg'],
    ],
  },
  {
    label: 'Tools & Technologies',
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
  return (
    <section id="skills" className="scene skills-scene">
      <div className="skills-glow" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="scene-head scene-head-center" data-reveal>
        <div>
          <div className="eyebrow">Stack</div>
          <h2 className="scene-title">Skills</h2>
        </div>
        <div className="tick">LANGUAGES · FRAMEWORKS · INFRA</div>
      </div>

      {GROUPS.map((g) => (
        <div className="skill-group" key={g.label} data-reveal>
          <h4>{g.label}</h4>
          <div className="skill-icon-grid">
            {g.items.map(([label, icon], i) => (
              <div className="skill-icon-card" key={label} style={{ '--i': i }}>
                <span className="skill-icon-orb">
                  <img
                    src={ICON(icon)}
                    alt=""
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </span>
                <span className="skill-icon-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
