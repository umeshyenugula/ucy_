// A flexible, auto-sizing system-design visual. Instead of one generic
// flow-chart reused for every project, this renders one of four distinct
// diagram shapes depending on the project's `variant` — a straight pipeline,
// a stacked layer diagram, a root→branches diagram, or two paths merging
// into one — so the visual actually matches how each system is put
// together, and the highlighted ("accent") step is different for every
// project instead of always being the second node. Every node still grows
// to fit its own label, so nothing overflows or misaligns on any screen
// width, and the whole card gets a scroll-triggered scale-in.
export default function ProjectDiagram({ label, flow, variant = 'pipeline' }) {
  return (
    <div className="proj-visual frame" data-reveal data-reveal-type="scale">
      <div className="vlabel">{label}</div>
      {variant === 'layers' && <LayerDiagram flow={flow} />}
      {variant === 'branch' && <BranchDiagram flow={flow} />}
      {variant === 'merge' && <MergeDiagram flow={flow} />}
      {(variant === 'pipeline' || !variant) && <PipelineDiagram flow={flow} />}
    </div>
  )
}

function FlowNode({ node, compact }) {
  return (
    <div className={`flow-node ${node.accent ? 'flow-node-accent' : ''} ${compact ? 'flow-node-compact' : ''}`}>
      <span className="flow-node-label">{node.label}</span>
      <span className="flow-node-sub">{node.sub}</span>
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="flow-arrow" aria-hidden="true">
      <span />
    </div>
  )
}

// straight top-to-bottom pipeline — for linear request/response style systems
function PipelineDiagram({ flow }) {
  return (
    <div className="flow-diagram flow-pipeline">
      {flow.map((node, i) => (
        <div className="flow-row" key={node.label}>
          <FlowNode node={node} />
          {i < flow.length - 1 && <FlowArrow />}
        </div>
      ))}
    </div>
  )
}

// stacked architecture layers — for framework/runtime style systems
function LayerDiagram({ flow }) {
  return (
    <div className="flow-diagram flow-layers">
      {flow.map((node) => (
        <div className={`layer-band ${node.accent ? 'layer-band-accent' : ''}`} key={node.label}>
          <span className="layer-dot" aria-hidden="true" />
          <div className="layer-text">
            <span className="flow-node-label">{node.label}</span>
            <span className="flow-node-sub">{node.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// one root feeding several parallel children — for hub / multi-module systems
function BranchDiagram({ flow }) {
  const [root, ...children] = flow
  return (
    <div className="flow-diagram flow-branch">
      <FlowNode node={root} />
      <div className="branch-stem" aria-hidden="true" />
      <div className="branch-bar" aria-hidden="true" />
      <div className="branch-children">
        {children.map((node) => (
          <FlowNode node={node} compact key={node.label} />
        ))}
      </div>
    </div>
  )
}

// two parallel inputs converging into one path — for offline/sync style systems
function MergeDiagram({ flow }) {
  const [a, b, ...tail] = flow
  return (
    <div className="flow-diagram flow-merge">
      <div className="branch-children merge-children">
        <FlowNode node={a} compact />
        <FlowNode node={b} compact />
      </div>
      <div className="branch-bar" aria-hidden="true" />
      <div className="branch-stem" aria-hidden="true" />
      <div className="flow-pipeline-tail">
        {tail.map((node, i) => (
          <div className="flow-row" key={node.label}>
            <FlowNode node={node} />
            {i < tail.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  )
}
