export default function Contact({ onNavigate }) {
  return (
    <section id="contact" style={{ background: 'var(--bg-2)' }}>
      <div id="closing">
        <div className="eyebrow" data-reveal>
          Contact
        </div>
        <h2 className="closing-title" data-reveal data-reveal-d="1" data-reveal-type="scale">
          Let's build something <span>reliable</span>.
        </h2>
        <div className="closing-links" data-reveal data-reveal-d="2">
          <a href="mailto:umeshyenugula2007@gmail.com">Email</a>
          <a href="https://github.com/umeshyenugula" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/umesh-chandran-yenugula-0a2576317" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <button onClick={() => onNavigate('projects')}>Projects</button>
        </div>
      </div>
    </section>
  )
}
