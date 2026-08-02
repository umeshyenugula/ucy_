// Placeholder background photo pulled from Unsplash — swap HERO_IMG for your
// own image whenever you're ready, everything else adapts automatically.
const HERO_IMG =
  'https://res.cloudinary.com/dsu5knb1g/image/upload/v1785514822/CSI/Team/nvhbowilzyxedleaoh1m.jpg'

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg">
        <img src={HERO_IMG} alt="" loading="eager" />
        <div className="hero-bg-veil" />
      </div>

      <div className="hero-inner">
        <h1 className="hero-name" data-reveal data-reveal-type="blur">
          Umesh Chandran
          <br />
          <span className="last">Yenugula</span>
        </h1>
        <p className="hero-role" data-reveal data-reveal-d="1" data-reveal-type="left">
          Computer Science undergraduate building full-stack, security-minded software , React and
          Next.js on the front, FastAPI/Django/Flask on the back, shipped on Docker, Render and
          DigitalOcean.
        </p>
        <div className="hero-meta" data-reveal data-reveal-d="2" data-reveal-type="scale">
          <div className="hero-stat">
            <b>9.38</b>
            <span>CGPA</span>
          </div>
          <div className="hero-stat">
            <b>2024–28</b>
            <span>B.Tech CSE</span>
          </div>
          <div className="hero-stat">
            <b>7</b>
            <span>Shipped Projects</span>
          </div>
        </div>
        <div className="hero-scroll" data-reveal data-reveal-d="3">
          <span className="bar" /> scroll 
        </div>
      </div>
    </section>
  )
}
