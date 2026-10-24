import Hero from '../components/Hero.jsx'
import BeatScene from '../components/BeatScene.jsx'
import WorkStack from '../components/WorkStack.jsx'
import { Link } from '../router.jsx'
import { EMAIL, PROOF_MAP } from '../data/profile.js'

const STORY = [
  {
    kicker: 'The premise',
    line: 'Most software works on a good day.',
    caption: 'So I judge my own work by the other days: traffic spikes, dropped networks, hostile input and bad data.',
    points: ['Traffic spikes at the worst moment', 'Networks drop halfway through a request', 'Someone always sends input you never planned for'],
  },
  {
    kicker: 'The method',
    line: 'I build for the other days.',
    accent: true,
    caption: 'Each system starts from its failure cases: what breaks, who can abuse it, and how it recovers.',
    points: ['Failure modes are written down before features', 'Limits, timeouts and retries are defaults, not patches', 'Every decision that matters leaves an audit trail'],
  },
  {
    kicker: 'Proof 01 · Go + React + TypeScript',
    line: 'Answers that cite their sources.',
    caption: 'JñānaSetu is a multi-tenant RAG platform with a modular Go API and self-hosted embeddings and Qwen3-4B.',
    points: ['Tenant resolved on the server, never trusted from the browser', 'An index goes live only when its whole version is complete', 'Weak evidence gets an honest fallback instead of a guess'],
    to: '/work/jnana-setu',
    cta: 'Explore JñānaSetu',
  },
  {
    kicker: 'Proof 02 · FastAPI + ML',
    line: 'Agents that can’t overspend.',
    caption: 'ViduraNīti governs AI agent spending with budgets, ML risk checks, human approval and verified x402 + Algorand settlement.',
    points: ['Agents never hold the wallet; deterministic policy decides first', 'Anomalies escalate to a human with the full context', 'Nothing is marked settled until the chain confirms it'],
    to: '/work/vidura-niti',
    cta: 'Run the simulator',
  },
  {
    kicker: 'Proof 03 · Python internals',
    line: 'A framework I wrote myself.',
    caption: 'Flasio is an async-first ASGI framework with Flask-style decorators, middleware, blueprints and a CLI, published on PyPI.',
    points: ['Follows the ASGI contract: app(scope, receive, send)', 'Dictionary lookup for static routes, compiled patterns for dynamic ones', 'Optional services stay off the hot path'],
    to: '/work/flasio',
    cta: 'Follow a request through Flasio',
  },
  {
    kicker: 'The through-line',
    line: 'Nothing trusted by default.',
    caption: 'The same few habits sit under all three systems, and under everything I ship.',
    points: ['Secrets and credentials stay server-side', 'Idempotency keys make retries safe', 'Private by default, public by decision'],
  },
]

const PROOF = [
  {
    count: 9.38,
    decimals: 2,
    label: 'CGPA',
    caption: 'B.Tech in Computer Science and Engineering at GRIET, 2024 to 2028.',
  },
  {
    count: 3,
    label: 'Flagship systems',
    caption: 'A RAG platform, an AI-agent finance platform and a web framework, each with a live architecture you can run.',
  },
  {
    count: 1,
    label: 'Package on PyPI',
    caption: 'Flasio is published and installable, which means its API, packaging and CLI had to hold up outside my machine.',
  },
  {
    count: 2,
    suffix: 'nd',
    label: 'Place at a 24-hour AI hackathon',
    caption: 'Out of 750+ teams and 3000+ participants at Telangana’s largest, hosted at KLH University in February 2026.',
  },
]

export default function Home() {
  return (
    <>
      <Hero />
      <BeatScene id="story" chapter="Chapter one · The approach" beats={STORY} per={72} />
      <BeatScene id="proof" chapter="Chapter two · The proof" beats={PROOF} per={64} />
      <section className="skillproof wrap">
        <p className="chapter" data-reveal>
          Chapter three · Skills, with receipts
        </p>
        <h2 className="h-xl" data-reveal>
          Claims are cheap. Here is where each one lives.
        </h2>
        <ul className="prlist">
          {PROOF_MAP.map((r) => (
            <li key={r.skill} data-reveal>
              <Link to={r.to} className="prow">
                <span className="pr-skill">{r.skill}</span>
                <span className="pr-claim">{r.claim}</span>
                <span className="pr-where">
                  {r.where} <i aria-hidden="true">→</i>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <WorkStack />

      <section className="beyond wrap">
        <p className="chapter" data-reveal>
          Chapter five · Beyond the code
        </p>
        <p className="statement" data-reveal>
          Engineering is also coordination. I help run the Computer Society of India’s GRIET chapter, planning technical events
          with faculty, volunteers and teams.
        </p>
        <Link to="/about" className="textlink" data-reveal>
          More about me <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="closer wrap">
        <h2 className="h-mega" data-reveal>
          Let’s build something reliable.
        </h2>
        <div className="closer-row" data-reveal>
          <a className="btn solid big" href={`mailto:${EMAIL}`}>
            Start a conversation
          </a>
          <Link to="/contact" className="btn line big">
            Other ways to reach me
          </Link>
        </div>
      </section>
    </>
  )
}
