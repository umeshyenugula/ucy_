import { useMemo, useState } from 'react'
import ArchStage, { StatusRail, TraceLog } from '../components/ArchStage.jsx'

// ViduraNīti control room: a payment simulator over the real module flow.
// Rules in play (deterministic, shown to the user):
const CAP = 1000 // per-transaction cap
const REMAIN = 1200 // remaining budget
const AUTO = 300 // auto-approve limit
const RISK_AT = 0.5 // ML score that forces a human
const KEY = 've_9f2c41'
const RISKS = { normal: ['Normal', 0.12], unusual: ['Unusual', 0.58], suspicious: ['Suspicious', 0.93] }
const usd = (n) => '$' + n.toLocaleString('en-US')

const N = { w: 150, h: 58 }
const MODEL = {
  w: 1000,
  h: 610,
  zones: [
    { id: 'in', label: 'INTAKE · WHO ASKS, FOR WHAT', x: 8, y: 28, w: 984, h: 100, hue: 210 },
    { id: 'ctl', label: 'SPEND CONTROL · DETERMINISTIC FIRST, ML SECOND', x: 8, y: 188, w: 984, h: 100, hue: 275 },
    { id: 'money', label: 'MONEY & RECORD', x: 8, y: 348, w: 984, h: 244, hue: 155 },
  ],
  nodes: [
    { id: 'user', zone: 'in', ...N, x: 24, y: 50, label: 'Organization', sub: 'M1 · users · RBAC', detail: 'Identity & organization: users, sessions, memberships and role-based access. A company task starts here.' },
    { id: 'task', zone: 'in', ...N, x: 224, y: 50, label: 'Task & Execution', sub: 'M4 · plan · state', detail: 'Task planning, tool orchestration and execution state. The optional Groq model may help interpret complex tasks, but it is never the authority for money.' },
    { id: 'agent', zone: 'in', ...N, x: 424, y: 50, label: 'Agent', sub: 'M2 · capabilities', detail: 'Agent profiles, capabilities, lifecycle and credentials. An agent holds a spending permission, never a wallet it can drain.' },
    { id: 'catalog', zone: 'in', ...N, x: 624, y: 50, label: 'Service Catalog', sub: 'M3 · approved only', detail: 'Approved services, providers and pricing. Agents can only buy what is listed here.' },
    { id: 'spend', zone: 'in', ...N, x: 824, y: 50, label: 'Spend request', sub: 'M6 · context', detail: 'Every payment begins as a spend request with full transaction context and an idempotency key.' },
    { id: 'policy', zone: 'ctl', ...N, x: 824, y: 215, label: 'Policy & Budget', sub: 'M5 · deterministic', detail: 'Spending limits, budgets and rules, evaluated deterministically. Budget is reserved atomically.' },
    { id: 'ml', zone: 'ctl', ...N, x: 624, y: 215, label: 'ML anomaly check', sub: 'M6 · risk score', detail: 'Scores the transaction in context for anomalies. A high score escalates to a human rather than blocking or allowing by itself.' },
    { id: 'decide', zone: 'ctl', ...N, x: 424, y: 215, label: 'Spending decision', sub: 'allow · approve · deny', detail: 'Combines policy and risk into ALLOW, REQUIRE_APPROVAL or DENY, and writes an immutable decision record.' },
    { id: 'reject', zone: 'money', hue: 2, ...N, x: 224, y: 380, label: 'Reject request', sub: 'nothing is spent', detail: 'Denied, rejected or expired requests end here. No money moves and any reservation is released.' },
    { id: 'approval', zone: 'money', ...N, x: 424, y: 380, label: 'Human approval', sub: 'M7 · expiry', detail: 'Approval requests, decisions, expiry and escalation. Approval does not bypass policy or budget validation.' },
    { id: 'pay', zone: 'money', ...N, x: 624, y: 380, label: 'Payment engine', sub: 'M8 · idempotent', detail: 'Owns the payment lifecycle, the x402 integration and Algorand settlement. Separate from the task and approval lifecycles.' },
    { id: 'x402', zone: 'money', ...N, x: 824, y: 380, label: 'x402 protocol', sub: 'HTTP 402 payments', detail: 'The mandatory payment path: the service answers 402 with its terms, the payment is made and verified. An accepted x402 response is not the same as a confirmed transaction.' },
    { id: 'analytics', zone: 'money', ...N, x: 24, y: 510, label: 'Analytics', sub: 'M10 · Cloudinary', detail: 'Spend analysis, invoices, cost reports and exports. Files live in Cloudinary; PostgreSQL keeps the metadata and file hash.' },
    { id: 'ledger', zone: 'money', ...N, x: 424, y: 510, label: 'Ledger & Audit', sub: 'M9 · immutable', detail: 'Financial entries, decision history and the audit trail. Written for every outcome, including failures.' },
    { id: 'algo', zone: 'money', ...N, x: 824, y: 510, label: 'Algorand', sub: 'settlement · confirm', detail: 'Settlement network. A payment is marked SETTLED only after the confirmation has been verified.' },
  ],
}

const R = (from, to, label, text, log, o = {}) => ({ from, to, label, text, log, ...o })
const S = (hot, text, log, o = {}) => ({ hot, text, log, ...o })

function plan({ amount, risk, approver, net }) {
  const [rl, score] = RISKS[risk]
  const denied = amount > CAP || amount > REMAIN
  const reasons = [amount > AUTO && `amount over ${usd(AUTO)}`, score >= RISK_AT && `risk score ${score.toFixed(2)} ≥ ${RISK_AT.toFixed(2)}`].filter(Boolean)
  const needs = !denied && reasons.length > 0
  const st = [
    R('user', 'task', 'new task', 'The organization creates a task: “renew market-data API plan”. Task & Execution plans it and tracks its state.', 'task.create {id:t_204, org:acme}', { rail: 'CREATED' }),
    R('task', 'agent', 'assign', 'The task goes to an agent with defined capabilities. The agent has a spending permission, never a wallet.', 'agent.assign {agent:research-07}'),
    R('agent', 'catalog', 'pick service', `The agent can only buy from the approved catalog. Provider and price (${usd(amount)}) come from there.`, `catalog.lookup → market-data-pro ${usd(amount)}`),
    R('catalog', 'spend', `spend ${usd(amount)}`, 'A spend request is created with full transaction context. The agent cannot pay directly.', `spend.request {amount:${amount}, idem:${KEY}}`, { rail: 'VALIDATING' }),
    R('spend', 'policy', 'budget + policy', `Deterministic checks first: remaining budget ${usd(REMAIN)}, per-transaction cap ${usd(CAP)}, allowed services. No model involved.`, `policy.evaluate remaining=${REMAIN} cap=${CAP}`, { rail: 'EVALUATING' }),
  ]
  let verdict
  const endBad = (state) => {
    st.push(R('reject', 'ledger', 'record', 'The outcome is written to the ledger as an immutable decision record.', `ledger.append ${state} ${KEY}`, { fs: 'b', ts: 'l' }))
    st.push(R('ledger', 'analytics', 'audit trail', 'Analytics folds it into spend reports and audit exports.', 'report.queue audit', { fs: 'l', ts: 'r' }))
  }
  if (denied) {
    st.push(R('policy', 'decide', 'DENY', `${usd(amount)} is over the ${usd(CAP)} per-transaction cap. Denied without asking any model.`, 'decision DENY reason=cap_exceeded', { fs: 't', ts: 't', rail: 'REJECTED' }))
    st.push(R('decide', 'reject', 'reject request', 'The request is rejected. Nothing is reserved or spent.', 'spend.status = REJECTED', { fs: 'l', ts: 't' }))
    endBad('DENY')
    verdict = ['Denied by policy', 'bad']
  } else {
    st.push(R('policy', 'ml', 'risk features', 'Policy passes. The anomaly model scores the transaction in context: amount, service, agent history, timing.', `ml.score → ${score.toFixed(2)} (${rl})`, { fs: 'l', ts: 'r' }))
    st.push(R('ml', 'decide', `score ${score.toFixed(2)}`, needs ? `Escalate: ${reasons.join(' and ')}.` : `Low risk and within the ${usd(AUTO)} auto-approve limit: the decision is ALLOW.`, `decision ${needs ? 'REQUIRE_APPROVAL' : 'ALLOW'}`, { fs: 'l', ts: 'r' }))
    let paid = true
    if (needs) {
      st.push(R('decide', 'approval', 'needs approval', `A human gets the full context before any money moves (${reasons.join(', ')}).`, 'approval.create expires_in=30m', { fs: 'b', ts: 't', rail: 'APPROVAL_REQUIRED' }))
      if (approver === 'approve') {
        st.push(R('approval', 'pay', 'approved', 'Approved. Approval does not bypass controls: policy and budget are revalidated and the budget is atomically reserved.', 'revalidate policy+budget ✓ · reserve()', { fs: 'r', ts: 'l', rail: 'AUTHORIZED' }))
      } else {
        paid = false
        const ex = approver === 'expire'
        st.push(R('approval', 'reject', ex ? 'expired' : 'rejected', ex ? 'Nobody decided before the deadline, so the request expires. Nothing is spent.' : 'The approver rejects the request. Nothing is spent.', ex ? 'approval.expired' : 'approval.rejected by cfo@acme', { fs: 'l', ts: 'r', rail: ex ? 'EXPIRED' : 'REJECTED' }))
        endBad(ex ? 'EXPIRED' : 'REJECTED')
        verdict = [ex ? 'Expired unapproved' : 'Rejected by approver', 'bad']
      }
    } else {
      st.push(R('decide', 'pay', 'allow', 'Within limits and low risk, so it is allowed automatically. Budget is reserved atomically.', 'decision ALLOW · reserve()', { fs: 'b', ts: 't', rail: 'AUTHORIZED' }))
    }
    if (paid) {
      st.push(S(['pay'], 'The payment engine creates a payment record with an idempotency key. Task, approval and payment lifecycles stay separate.', `payment.create ${KEY} PAYMENT_PENDING`, { rail: 'PAYMENT_PENDING' }))
      st.push(R('pay', 'x402', 'HTTP 402', 'The paid service answers HTTP 402 with its price and pay-to terms. The x402 path is mandatory for every payment.', 'GET /v1/quotes → 402 Payment Required', { fs: 'r', ts: 'l', rail: 'X402_PENDING' }))
      st.push(R('x402', 'algo', 'submit tx', 'The x402 payment is accepted and the transaction is submitted to Algorand. Accepted is not settled yet.', 'x402 accepted · algorand.submit txid=AL7Q…K2', { fs: 'b', ts: 't', rail: ['X402_ACCEPTED', 'SUBMITTED'] }))
      if (net === 'ok') {
        st.push(R('algo', 'pay', 'confirmed', 'Confirmation is verified on-chain. Only now is the payment marked SETTLED.', 'confirmed round 41,882,106 → SETTLED', { fs: 'l', ts: 'b', rail: ['CONFIRMING', 'SETTLED'] }))
        verdict = ['Settled on-chain', 'good']
      } else {
        st.push(R('algo', 'pay', 'not confirmed', 'The transaction did not confirm in time. The payment is marked FAILED, the reservation is released and reconciliation retries idempotently.', 'confirm timeout → FAILED · reconcile queued', { fs: 'l', ts: 'b', rail: ['CONFIRMING', 'FAILED'] }))
        verdict = ['Failed to settle', 'bad']
      }
      st.push(R('pay', 'ledger', 'ledger entry', 'Financial entries and the full decision history are appended to the ledger, success or failure.', `ledger.append ${net === 'ok' ? 'SETTLED' : 'FAILED'} ${KEY}`, { fs: 'b', ts: 'r' }))
      st.push(R('ledger', 'analytics', 'report', 'Task and spend state update, then analytics produces the invoice and audit report. Cloudinary stores the file; PostgreSQL keeps its metadata and hash.', 'report.generate invoice → cloudinary · sha256 stored', { fs: 'l', ts: 'r' }))
    }
  }
  return { steps: st, verdict, needs, denied }
}

const RAIL = [
  { k: 'CREATED' }, { k: 'VALIDATING' }, { k: 'EVALUATING' }, { k: 'APPROVAL_REQUIRED' }, { k: 'AUTHORIZED' }, { k: 'PAYMENT_PENDING' },
  { k: 'X402_PENDING' }, { k: 'X402_ACCEPTED' }, { k: 'SUBMITTED' }, { k: 'CONFIRMING' }, { k: 'SETTLED', tone: 'good' },
  { k: 'REJECTED', tone: 'bad' }, { k: 'EXPIRED', tone: 'bad' }, { k: 'FAILED', tone: 'bad' },
]
const PRESETS = [
  ['Routine buy', { amount: 120, risk: 'normal', approver: 'approve', net: 'ok' }],
  ['Large purchase', { amount: 620, risk: 'normal', approver: 'approve', net: 'ok' }],
  ['Odd pattern', { amount: 180, risk: 'suspicious', approver: 'reject', net: 'ok' }],
  ['Over the cap', { amount: 1400, risk: 'normal', approver: 'approve', net: 'ok' }],
  ['Chain hiccup', { amount: 120, risk: 'normal', approver: 'approve', net: 'fail' }],
]

function Seg({ value, onChange, options, disabled, label }) {
  return (
    <div className={`seg${disabled ? ' off' : ''}`} role="group" aria-label={label}>
      {options.map(([v, t]) => (
        <button key={v} className={v === value ? 'on' : ''} onClick={() => onChange(v)} disabled={disabled} aria-pressed={v === value}>
          {t}
        </button>
      ))}
    </div>
  )
}

export default function ViduraNitiViz() {
  const [p, setP] = useState(PRESETS[0][1])
  const set = (patch) => setP((v) => ({ ...v, ...patch }))
  const out = useMemo(() => plan(p), [p])
  const reaches = out.steps.some((s) => s.from === 'pay' && s.to === 'x402')
  return (
    <div className="viz">
      <div className="sim">
        <div className="tabs" aria-label="Presets">
          {PRESETS.map(([t, v]) => (
            <button key={t} className={JSON.stringify(v) === JSON.stringify(p) ? 'on' : ''} onClick={() => setP(v)}>
              {t}
            </button>
          ))}
        </div>
        <div className="sim-grid">
          <label className="sim-f">
            <span className="sim-l">
              Amount <b>{usd(p.amount)}</b>
            </span>
            <input type="range" min="20" max="1500" step="20" value={p.amount} onChange={(e) => set({ amount: +e.target.value })} aria-label="Amount in dollars" />
          </label>
          <div className="sim-f">
            <span className="sim-l">ML risk reading</span>
            <Seg label="ML risk reading" value={p.risk} onChange={(v) => set({ risk: v })} options={Object.entries(RISKS).map(([k, [t]]) => [k, t])} />
          </div>
          <div className="sim-f">
            <span className="sim-l">Human approver</span>
            <Seg label="Human approver" value={p.approver} onChange={(v) => set({ approver: v })} disabled={!out.needs} options={[['approve', 'Approves'], ['reject', 'Rejects'], ['expire', 'Ignores it']]} />
          </div>
          <div className="sim-f">
            <span className="sim-l">Algorand</span>
            <Seg label="Algorand outcome" value={p.net} onChange={(v) => set({ net: v })} disabled={!reaches} options={[['ok', 'Confirms'], ['fail', 'Times out']]} />
          </div>
        </div>
        <div className="sim-foot">
          <span className={`verdict ${out.verdict[1]}`}>{out.verdict[0]}</span>
          <span className="dim">
            Rules: cap {usd(CAP)} · budget left {usd(REMAIN)} · human approval above {usd(AUTO)} or risk ≥ {RISK_AT.toFixed(2)}
          </span>
        </div>
      </div>
      <ArchStage
        model={MODEL}
        steps={out.steps}
        resetKey={JSON.stringify(p)}
        label="ViduraNīti spend control room"
        header={(c) => <StatusRail title="Payment state" items={RAIL} steps={out.steps} i={c.i} />}
        aside={(c) => <TraceLog {...c} />}
      />
    </div>
  )
}
