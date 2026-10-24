// A very light, classic backdrop: a slowly drifting hairline grid under two soft glows.
// Transform-only animation (compositor), no JS, paused for reduced motion.
export default function Backdrop() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-gridwrap">
        <i className="bg-grid" />
      </div>
      <i className="bg-orb a" />
      <i className="bg-orb b" />
    </div>
  )
}
