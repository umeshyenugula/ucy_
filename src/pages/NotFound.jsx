import { Link } from '../router.jsx'

export default function NotFound() {
  return (
    <div className="wrap page-pad">
      <header className="page-head">
        <h1 className="h-hero">404</h1>
        <p className="lead">That page doesn’t exist.</p>
        <Link to="/" className="btn solid">
          Back home
        </Link>
      </header>
    </div>
  )
}
