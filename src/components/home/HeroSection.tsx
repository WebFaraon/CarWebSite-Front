import SmartSearchBar from '../search/SmartSearchBar.tsx'

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-copy">
          <p className="hero-eyebrow">Buy. Sell. Drive.</p>
          <h1>Find your perfect car today</h1>
          <p>
            Browse trusted listings from verified sellers and discover
            great deals near you.
          </p>
          <div className="hero-trust">
            <span><strong>14,300+</strong> cars listed</span>
            <span className="hero-trust-dot" aria-hidden="true" />
            <span><strong>6,800+</strong> verified sellers</span>
            <span className="hero-trust-dot" aria-hidden="true" />
            <span><strong>Free</strong> to browse</span>
          </div>
        </div>

        <SmartSearchBar />
      </div>
    </section>
  )
}

export default HeroSection
