import type { FormEvent } from 'react'

interface HeroSectionProps {
  brands: string[]
  models: string[]
}

function HeroSection({ brands, models }: HeroSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section className="hero-section">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="hero-orb hero-orb-three" aria-hidden="true" />
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

        <form className="search-card" onSubmit={handleSubmit}>
          <label className="field">
            <span>Brand</span>
            <select defaultValue="">
              <option value="" disabled>
                Select brand
              </option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Model</span>
            <select defaultValue="">
              <option value="" disabled>
                Select model
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Price Range</span>
            <input type="text" placeholder="$10,000 - $35,000" />
          </label>

          <label className="field">
            <span>Location</span>
            <input type="text" placeholder="City or ZIP code" />
          </label>

          <button className="primary-btn search-btn" type="submit">
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

export default HeroSection
