export default function LeadershipCoursework() {
  return (
    <section className="scene" style={{ background: 'var(--bg-2)' }}>
      <div className="split-two">
        <div className="panel frame" data-reveal data-reveal-type="left">
          <div className="eyebrow">Leadership</div>
          <h3 style={{ marginTop: '0.8rem' }}>Computer Society of India, GRIET Chapter</h3>
          <div className="tick" style={{ margin: '0.5rem 0 1.2rem' }}>
            Management &amp; Technical Team
          </div>
          <ul>
            <li>
              Coordinated the planning and execution of technical events by collaborating with
              cross-functional teams, faculty, and volunteers.
            </li>
            <li>
              Supported stakeholder coordination, operational planning, and process optimization to
              ensure efficient event execution and an enhanced participant experience.
            </li>
          </ul>
        </div>
        <div className="panel frame" data-reveal data-reveal-d="1" data-reveal-type="right">
          <div className="eyebrow">Coursework</div>
          <h3 style={{ marginTop: '0.8rem' }}>Core Computer Science</h3>
          <div className="course-tags">
            {['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'Software Engineering', 'OOP'].map(
              (t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
