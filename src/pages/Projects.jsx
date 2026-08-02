import { useReveal } from '../hooks/useReveal.js'
import { projects } from '../data/projects.js'
import ProjectCard from '../components/ProjectCard.jsx'

export default function Projects({ onNavigate }) {
  useReveal(['projects'])

  return (
    <>
      <section id="p-hero">
        <div className="eyebrow" data-reveal>
          Full Showcase
        </div>
        <h1 data-reveal data-reveal-d="1">
          Systems, <span>shipped end-to-end.</span>
        </h1>
        <p data-reveal data-reveal-d="2">
          Seven projects spanning biometric security, an async web framework, a zero-dependency
          data-structures library, and four production full-stack platforms. Every entry below
          includes the real stack, the architecture, and a link to the code.
        </p>
        <div className="index-strip" data-reveal data-reveal-d="3">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {p.index} {p.title}
            </a>
          ))}
        </div>
      </section>

      {projects.map((p, i) => (
        <ProjectCard key={p.id} project={p} reverse={i % 2 === 1} />
      ))}
    </>
  )
}
