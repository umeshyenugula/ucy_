import { Link } from '../router.jsx'
import { techList } from '../data/stack.js'
import PeriodicStack from '../components/PeriodicStack.jsx'

export default function Stack() {
  const total = techList().length
  return (
    <>
      <div className="wrap pt-head">
        <header className="page-head">
          <p className="chapter">The stack</p>
          <h1 className="h-hero">Every tool, with a receipt.</h1>
          <p className="lead">
            {total} tools across six layers, each tied to the system that uses it. Pick a system and its formula assembles on the table.
          </p>
        </header>
      </div>

      <PeriodicStack />

      <section className="closer slim wrap">
        <h2 className="h-xl" data-reveal>See them <em className="ac">running</em>.</h2>
        <div className="closer-row" data-reveal>
          <Link to="/work" className="btn solid big">All three systems</Link>
          <Link to="/contact" className="btn line big">Talk to me</Link>
        </div>
      </section>
    </>
  )
}
