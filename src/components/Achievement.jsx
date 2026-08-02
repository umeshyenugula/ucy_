export default function Achievement() {
  return (
    <section id="achieve" className="scene">
      <div className="scene-head" data-reveal>
        <div>
          <div className="eyebrow">Achievement</div>
          <h2 className="scene-title">Hackathon</h2>
        </div>
        <div className="tick">FEB 27–28, 2026</div>
      </div>
      <div className="ach-card frame">
        <div className="ach-rank" data-reveal data-reveal-d="1" data-reveal-type="scale">
          2<sup>nd</sup>
        </div>
        <div data-reveal data-reveal-d="2" data-reveal-type="right">
          <p>
            <b>Secured 2nd place</b> among 3000+ participants and 750+ teams at Telangana's largest
            24-hour AI hackathon, conducted at KLH University on Feb 27–28, 2026.
          </p>
          <div className="ach-stats">
            <div>
              <b>3000+</b>
              <span>Participants</span>
            </div>
            <div>
              <b>750+</b>
              <span>Teams</span>
            </div>
            <div>
              <b>24 HR</b>
              <span>Build Window</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
