export default function Loader({ active }) {
  return (
    <div id="gate" className={active ? '' : 'gate-out'} aria-hidden={!active}>
      <div className="g-mark">Umesh Chandran</div>
      <div className="g-line" />
      <div className="g-sub">Portfolio — Loading</div>
    </div>
  )
}
