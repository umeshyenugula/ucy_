export default function About() {
  return (
    <section id="about" className="scene">
      <div className="scene-head" data-reveal>
        <div>
          <div className="eyebrow">Profile</div>
          <h2 className="scene-title">About</h2>
        </div>
        <div className="tick">GRIET · HYDERABAD, IN</div>
      </div>
      <div className="about-grid">
        <p className="lead" data-reveal data-reveal-d="1" data-reveal-type="left">
          Computer Science undergraduate with experience building full-stack web applications using
          React, Python, FastAPI, REST APIs, SQL/NoSQL databases, and cloud deployment platforms.
          Passionate about developing scalable, user-centric software with clean architecture,
          responsive interfaces, and efficient backend services — with hands-on experience designing,
          developing, and deploying real-world projects from frontend to backend.
        </p>
        <div className="about-side frame" data-reveal data-reveal-d="2" data-reveal-type="right">
          <div className="side-row">
            <span>Email</span>
            <span>umeshyenugula2007@gmail.com</span>
          </div>
          <div className="side-row">
            <span>Mobile</span>
            <span>9912576361</span>
          </div>
          <div className="side-row">
            <span>GitHub</span>
            <span>umeshyenugula</span>
          </div>
          <div className="side-row">
            <span>LinkedIn</span>
            <span>umesh-chandran-yenugula</span>
          </div>
        </div>
      </div>
    </section>
  )
}
