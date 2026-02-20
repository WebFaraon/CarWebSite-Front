import SmartSearchBar from '../search/SmartSearchBar.tsx'

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-orbs" aria-hidden="true">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-orb hero-orb-three" />
      </div>
      <div className="hero-float-card hero-float-left" aria-hidden="true">
        <span>Hot Deal</span>
        <strong>BMW X5</strong>
        <p>from $58,900</p>
      </div>
      <div className="hero-float-card hero-float-right" aria-hidden="true">
        <span>Fast Sell</span>
        <strong>Avg. 36h</strong>
        <p>for listed cars</p>
      </div>

      <div className="container">
        <div className="hero-copy">
          <p className="hero-eyebrow">Buy. Sell. Drive.</p>
          <h1>Find your perfect car today</h1>
          <p>
            Browse trusted listings from verified sellers and discover great
            deals near you.
          </p>
        </div>

        <SmartSearchBar />
      </div>
    </section>
  )
}

export default HeroSection
