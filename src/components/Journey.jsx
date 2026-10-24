import { Title } from './ui.jsx'
import { useInView, useCountUp } from '../hooks.js'

const COURSES = ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'Software Engineering', 'OOP']
const R = 54
const C = 2 * Math.PI * R

export default function Journey() {
  const [ref, seen] = useInView(0.35)
  const cg = useCountUp(9.38, seen, { decimals: 2, duration: 1800 })

  return (
    <section id="journey" className="sec">
      <div className="sec-head">
        <Title>Journey</Title>
        <p className="sec-note">Where I study, what I help run, and what the degree covers.</p>
      </div>

      <div className="journey">
        <article className="jcard edu" ref={ref} data-reveal>
          <div className="jc-text">
            <h3>Bachelor of Technology, Computer Science &amp; Engineering</h3>
            <p className="inst">Gokaraju Rangaraju Institute of Engineering and Technology</p>
            <p className="dates">August 2024 to July 2028</p>
          </div>
          <div className="cgpa" role="img" aria-label="CGPA 9.38 out of 10">
            <svg viewBox="0 0 128 128" aria-hidden="true">
              <circle className="track" cx="64" cy="64" r={R} />
              <circle className="arc" cx="64" cy="64" r={R} style={{ strokeDasharray: C, strokeDashoffset: seen ? C * (1 - 0.938) : C }} />
            </svg>
            <div>
              <b>{cg}</b>
              <span>CGPA</span>
            </div>
          </div>
        </article>

        <article className="jcard lead-card" data-reveal>
          <h3>Computer Society of India, GRIET Chapter</h3>
          <p className="role">Management &amp; Technical Team</p>
          <ul>
            <li>Coordinated planning and execution of technical events with cross-functional teams, faculty and volunteers.</li>
            <li>Supported stakeholder coordination, operational planning and process optimisation so events ran smoothly and participants had a better experience.</li>
          </ul>
        </article>

        <article className="jcard course" data-reveal>
          <h3>Core Computer Science</h3>
          <div className="course-tags">
            {COURSES.map((t, i) => (
              <span className="tag" key={t} style={{ '--i': i }}>
                {t}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
