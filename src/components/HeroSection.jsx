import Header from './Header'

export default function HeroSection() {
  return (
    <section className="hero-section">
      <Header />
      <img 
        src="/images/a_remarkable_flower_pitcher.png" 
        alt="Pitcher plant" 
        className="hero-image-right"
      />
      <h1 className="hero-title">
        <span className="hero-word hero-word-a">A</span>
        <span className="hero-word hero-word-remarkable">Remarkable</span>
        <span className="hero-word hero-word-flower">Flower</span>
      </h1>
      <p className="hero-subtitle">By <a href="https://whoiskevintho.com/" target="_blank" rel="noopener noreferrer">Kevin Young</a></p>
    </section>
  )
}

