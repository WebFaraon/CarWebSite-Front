import Navbar from '../../components/navbar/Navbar.tsx'
import SellYourCarSection from '../../components/home/SellYourCarSection.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import type { SocialItem } from '../../components/home/types'
import './SellCar.css'

const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

function SellCar() {
  const benefits = [
    'Professional listing structure that looks credible from the first scroll',
    'Buyer conversations organized in one place',
    'Guided pricing and paperwork support when you are ready to close',
  ]

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

              <div className="sell-hero-panel">
                <div className="sell-hero-stat">
                  <strong>48h</strong>
                  <span>typical time to receive first serious inquiries</span>
                </div>
                <div className="sell-hero-stat">
                  <strong>Verified</strong>
                  <span>buyer flow with cleaner handoff to negotiation</span>
                </div>

                <ul className="sell-hero-list">
                  {benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
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

            <div className="sell-support-strip">
              <div>
                <p className="sell-support-label">Need a faster start?</p>
                <h3>Our team can help shape your first listing.</h3>
              </div>
              <button className="primary-btn" type="button">Book a consultation</button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default SellCar
