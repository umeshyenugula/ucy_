import { projects } from '../data/projects.js'

export default function ProjectsPreview({ onNavigate }) {
  return (
    <section id="projects-preview" className="scene">
      <div className="scene-head" data-reveal>
        <div>
          <div className="eyebrow">Work</div>
          <h2 className="scene-title">Projects</h2>
          <p className="scene-desc">
            Seven shipped systems — from a biometric one-time voice messenger to an async Python web
            framework. Each gets a full teardown, architecture diagram, and stack breakdown.
          </p>
        </div>
        <button className="btn primary magnetic" onClick={() => onNavigate('projects')}>
          Full Showcase →
        </button>
      </div>
      <div className="proj-grid">
        {projects.map((p, i) => (
          <a
            key={p.id}
            className="proj-card frame"
            data-reveal
            data-reveal-d={i % 3}
            data-reveal-type="scale"
            href={`#${p.id}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate('projects', p.id)
            }}
          >
            <div className="pn">
              {p.index} · {p.category}
            </div>
            <h4>{p.title}</h4>
            <p>{p.tagline}</p>
            <div className="go">
              View teardown
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
