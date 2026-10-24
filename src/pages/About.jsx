import { Link } from '../router.jsx'
import { SKILLS, COURSES, PROFILES, EMAIL } from '../data/profile.js'

function Chapter({ label, children }) {
  return (
    <section className="chap" data-reveal>
      <h2 className="label chap-label">{label}</h2>
      <div className="chap-body">{children}</div>
    </section>
  )
}

export default function About() {
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <h1 className="h-hero">About</h1>
        <p className="lead" data-reveal>
          Computer Science undergraduate (9.38 CGPA) who designs, builds and deploys full-stack systems end to end: React, Vite,
          Next.js and TypeScript on the front, Go and Python (FastAPI, Django, Flask) on the back, SQL and NoSQL data stores,
          and cloud deployment. Every claim on this site links to a running architecture or a public repository.
        </p>
      </header>

      <Chapter label="Education">
        <h3 className="h-md">Bachelor of Technology, Computer Science &amp; Engineering</h3>
        <p className="dim">Gokaraju Rangaraju Institute of Engineering and Technology</p>
        <p className="dim">August 2024 to July 2028</p>
        <p className="big-stat">
          9.38 <span>CGPA</span>
        </p>
      </Chapter>

      <Chapter label="Leadership">
        <h3 className="h-md">Computer Society of India, GRIET Chapter</h3>
        <p className="dim">Management &amp; Technical Team</p>
        <ul className="plain">
          <li>Coordinated planning and execution of technical events with cross-functional teams, faculty and volunteers.</li>
          <li>Supported stakeholder coordination, operational planning and process optimisation so events ran smoothly and participants had a better experience.</li>
        </ul>
      </Chapter>

      <Chapter label="Hackathon">
        <h3 className="h-md">2nd place, Telangana’s largest 24-hour AI hackathon</h3>
        <p className="dim">KLH University, February 27 to 28, 2026</p>
        <p>Placed second among 3000+ participants and 750+ teams.</p>
      </Chapter>

      <Chapter label="Stack">
        <div className="skills">
          {SKILLS.map(([g, items]) => (
            <div key={g}>
              <h3>{g}</h3>
              <p>{items.join(', ')}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter label="Coursework">
        <ul className="inline-list">
          {COURSES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Chapter>

      <Chapter label="Coding profiles">
        <ul className="plinks">
          {PROFILES.map((p) => (
            <li key={p.name}>
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                <span>{p.name}</span>
                <span className="dim">{p.handle} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Chapter>

      <section className="closer slim" data-reveal>
        <h2 className="h-xl">Want to work together?</h2>
        <div className="closer-row">
          <a className="btn solid big" href={`mailto:${EMAIL}`}>
            Email me
          </a>
          <Link to="/work" className="btn line big">
            See the work
          </Link>
        </div>
      </section>
    </div>
  )
}
