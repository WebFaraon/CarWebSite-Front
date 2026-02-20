import Navbar from '../../components/navbar/Navbar.tsx'
import SellYourCarSection from '../../components/home/SellYourCarSection.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import './SellCar.css'

const socialLinks = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

function SellCar() {
  return (
    <>
      <Navbar />
      <main className="sell-car-page">
        <section className="sell-hero section-spacer">
          <div className="container">
            <div className="sell-hero-card">
              <div className="sell-hero-copy">
                <p className="sell-hero-eyebrow">Sell with confidence</p>
                <h1>List your car and reach verified buyers fast</h1>
                <p>
                  Create a standout listing, schedule viewings, and close the
                  deal securely with support at every step.
                </p>
                <div className="sell-hero-actions">
                  <button className="primary-btn" type="button">
                    Start listing
                  </button>
                  <button className="ghost-btn" type="button">
                    Talk to an expert
                  </button>
                </div>
              </div>
              <div className="sell-hero-badges">
                <div className="sell-hero-badge">
                  <strong>2.4k+</strong>
                  <span>Active buyers</span>
                </div>
                <div className="sell-hero-badge">
                  <strong>36h</strong>
                  <span>Avg. time to sell</span>
                </div>
                <div className="sell-hero-badge">
                  <strong>98%</strong>
                  <span>Seller satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SellYourCarSection image="https://placehold.co/800x520/F8FAFC/111827?text=Car+Listing+Image" />

        <section className="sell-steps section-spacer">
          <div className="container">
            <div className="sell-steps-header">
              <h2>How it works</h2>
              <p>
                Three simple steps to get your car listed and sold with
                confidence.
              </p>
            </div>
            <div className="sell-steps-grid">
              <article className="sell-step-card">
                <span>01</span>
                <h3>Create your listing</h3>
                <p>Add details, photos, and set your price in minutes.</p>
              </article>
              <article className="sell-step-card">
                <span>02</span>
                <h3>Connect with buyers</h3>
                <p>Chat with verified buyers and schedule viewings fast.</p>
              </article>
              <article className="sell-step-card">
                <span>03</span>
                <h3>Close the deal</h3>
                <p>Finalize paperwork securely with our guided process.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default SellCar
