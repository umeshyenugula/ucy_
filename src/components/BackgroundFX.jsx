// Ambient, decorative motion behind the whole site: two soft violet blobs
// drifting slowly, plus a faint grid. Pure CSS animation (no JS ticking),
// fixed position so it never affects layout or scroll performance, and
// disabled automatically under prefers-reduced-motion (see index.css).
export default function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <span className="bg-blob bg-blob-a" />
      <span className="bg-blob bg-blob-b" />
      <span className="bg-grid" />
    </div>
  )
}
