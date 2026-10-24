import { Title } from './ui.jsx'
import { useInView, useCountUp } from '../hooks.js'

function Num({ to, suffix = '', label, active }) {
  const v = useCountUp(to, active, { duration: 2000 })
  return (
    <div className="ach-stat">
      <b>
        {v}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  )
}

export default function Achievement() {
  const [ref, seen] = useInView(0.3)
  return (
    <section id="achievement" className="sec">
      <div className="sec-head">
        <Title>Hackathon</Title>
        <p className="sec-note">February 27 to 28, 2026, KLH University.</p>
      </div>

      <div className="ach" ref={ref}>
        <div className="ach-medal" data-reveal>
          <svg viewBox="0 0 340 340" className="ach-ring" aria-hidden="true">
            <defs>
              <path id="achPath" d="M170,170 m-146,0 a146,146 0 1,1 292,0 a146,146 0 1,1 -292,0" />
            </defs>
            <text>
              <textPath href="#achPath" textLength="905" lengthAdjust="spacing">
                telangana's largest 24-hour ai hackathon · klh university · feb 27–28, 2026 ·
              </textPath>
            </text>
          </svg>
          <div className="ach-rank">
            2<sup>nd</sup>
          </div>
        </div>

        <div className="ach-copy" data-reveal>
          <p>
            <b>Secured 2nd place</b> among 3000+ participants and 750+ teams at Telangana's largest 24-hour AI hackathon.
           
          </p>
          <div className="ach-stats">
            <Num to={3000} suffix="+" label="Participants" active={seen} />
            <Num to={750} suffix="+" label="Teams" active={seen} />
            <Num to={24} suffix=" hr" label="Build window" active={seen} />
          </div>
        </div>
      </div>
    </section>
  )
}
