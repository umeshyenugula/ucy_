import ProjectDiagram from './ProjectDiagram.jsx'

export default function ProjectCard({ project, reverse }) {
  return (
    <section id={project.id} className={`proj-section ${reverse ? 'alt' : ''}`}>
      <div className="proj-head" data-reveal>
        <div>
          <div className="eyebrow">
            {project.index} · {project.category}
          </div>
          <h2 className="proj-title">{project.title}</h2>
          <div className="proj-tagline">{project.tagline}</div>
        </div>
        <div className="tick">{project.tick}</div>
      </div>

      <div className={`proj-body ${reverse ? 'rev' : ''}`}>
        <div data-reveal data-reveal-d="1" data-reveal-type={reverse ? 'right' : 'left'}>
          <p className="proj-desc">{project.description}</p>
          <ul className="proj-bullets">
            {project.bullets.map((item) => (
              <li key={item.b}>
                <b>{item.b}:</b> {item.t}
              </li>
            ))}
          </ul>
          <div className="stack-row">
            {project.stack.map((s) => (
              <span className="chip" key={s.label}>
                <img src={s.icon} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = 'none')} />
                {s.label}
              </span>
            ))}
          </div>
          <div className="btn-row">
            {project.githubUrl ? (
              <a className="btn primary" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.28 2.75 1.05a9.2 9.2 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.43.21 2.49.1 2.75.65.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .28.18.61.69.5A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                </svg>
                GitHub
              </a>
            ) : null}
            {project.liveDemoUrl ? (
              <a className="btn ghost" href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3h7v7M21 3l-9 9M5 5h5M5 5v14h14v-5" />
                </svg>
                Live Demo
              </a>
            ) : null}
          </div>
        </div>

        <ProjectDiagram label="System flow" flow={project.flow} variant={project.diagramVariant} />
      </div>
    </section>
  )
}
