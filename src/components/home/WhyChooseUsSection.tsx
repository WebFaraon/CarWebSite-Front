import type { FeatureIcon, FeatureItem } from './types'

interface WhyChooseUsSectionProps {
  features: FeatureItem[]
}

function FeatureIconGraphic({ icon }: { icon: FeatureIcon }) {
  if (icon === 'verified') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.1 2.67a1.94 1.94 0 0 1 1.8 0l1.63.9 1.86.13a1.94 1.94 0 0 1 1.59 1.08l.82 1.68 1.39 1.26a1.94 1.94 0 0 1 .6 1.7l-.3 1.84.3 1.84a1.94 1.94 0 0 1-.6 1.7l-1.39 1.26-.82 1.68a1.94 1.94 0 0 1-1.59 1.08l-1.86.13-1.63.9a1.94 1.94 0 0 1-1.8 0l-1.63-.9-1.86-.13a1.94 1.94 0 0 1-1.59-1.08l-.82-1.68-1.39-1.26a1.94 1.94 0 0 1-.6-1.7l.3-1.84-.3-1.84a1.94 1.94 0 0 1 .6-1.7l1.39-1.26.82-1.68A1.94 1.94 0 0 1 7.6 3.7l1.86-.13 1.63-.9Zm4.2 7.66-4.5 4.5-2.1-2.1-1.4 1.4 3.5 3.5 5.9-5.9-1.4-1.4Z" />
      </svg>
    )
  }

  if (icon === 'secure') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 5 5v6c0 5 3.4 9.73 7 11 3.6-1.27 7-6 7-11V5l-7-3Zm0 10.5a2 2 0 0 1 1 3.73V18h-2v-1.77a2 2 0 0 1 1-3.73Zm3-2H9V8a3 3 0 0 1 6 0v2.5Zm-2 0V8a1 1 0 1 0-2 0v2.5h2Z" />
      </svg>
    )
  }

  if (icon === 'selection') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 11.5V13h1.5l1-2h11l1 2H21v-1.5a3.5 3.5 0 0 0-2.7-3.4l-.53-2.16A2.5 2.5 0 0 0 15.35 4H8.65A2.5 2.5 0 0 0 6.2 5.94L5.67 8.1A3.5 3.5 0 0 0 3 11.5ZM8.65 6h6.7a.5.5 0 0 1 .49.39L16.2 8H7.8l.36-1.61A.5.5 0 0 1 8.65 6ZM6 19a2 2 0 0 0 2-2h8a2 2 0 1 0 2-2H6a2 2 0 1 0 0 4Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 4 18v3a1 1 0 0 0 1 1h4v-7H6.35A8 8 0 1 1 20 12v3h-2.65v7H19a1 1 0 0 0 1-1v-3A10 10 0 0 0 12 2Zm2.5 13v7h-5v-7h5Z" />
    </svg>
  )
}

function WhyChooseUsSection({ features }: WhyChooseUsSectionProps) {
  return (
    <section id="help" className="why-section section-spacer">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Us</h2>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <article key={feature.id} className="feature-card">
              <div className="feature-icon">
                <FeatureIconGraphic icon={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUsSection
