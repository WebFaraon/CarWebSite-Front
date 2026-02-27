import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import './ContactUs.css'

// ─── Mock data — replace with real values before going live ──────────────────

const contactConfig = {
  hero: {
    eyebrow: 'We\'re here to help',
    heading: 'Get in touch with our team',
    subtext:
      'Have a question about buying or selling? Our support team is available to guide you every step of the way.',
  },

  contactCards: [
    {
      id: 1,
      type: 'phone' as const,
      label: 'Call us',
      value: '+373xxxxxxxx',
      detail: 'Mon–Fri, 9 am – 6 pm',
      href: 'tel:+373xxxxxxxx',
    },
    {
      id: 2,
      type: 'email' as const,
      label: 'Email us',
      value: 'hello@automarket.com',
      detail: 'We reply within 24 working hours',
      href: 'mailto:hello@automarket.com',
    },
    {
      id: 3,
      type: 'location' as const,
      label: 'Visit us',
      value: 'Strada Studenților 7',
      detail: 'Republic of Moldova, Chișinău, MD-2012',
      href: '#',
    },
    {
      id: 4,
      type: 'clock' as const,
      label: 'Working hours',
      value: 'Mon – Fri, 9 am – 6 pm',
      detail: 'Closed on weekends & public holidays',
      href: null,
    },
  ],

  officeNote: {
    heading: 'Stop by our office',
    body:
      'Our doors are open Monday through Friday. Whether you want to discuss a listing in person or just say hello, we love meeting our community.',
    address: 'Strada Studenților 7, MD-2012, Chișinău',
    mapEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21743.451228805923!2d28.866073321224768!3d47.06119593964116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97ce00125f907%3A0xfc2e5ee00a6d3d6a!2sUniversitatea%20Tehnic%C4%83%20a%20Moldovei!5e0!3m2!1sro!2s!4v1772179223452!5m2!1sro!2s', // paste a Google Maps embed src here when ready
  },
}

const socialLinks = [
  { platform: 'facebook' as const, href: '#' },
  { platform: 'instagram' as const, href: '#' },
  { platform: 'x' as const, href: '#' },
  { platform: 'linkedin' as const, href: '#' },
]

// ─── Icon helpers ─────────────────────────────────────────────────────────────

type CardType = 'phone' | 'email' | 'location' | 'clock'

function ContactIcon({ type }: { type: CardType }) {
  if (type === 'phone') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    )
  }
  if (type === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    )
  }
  if (type === 'location') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    )
  }
  // clock
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

function ContactUs() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const { hero, contactCards, officeNote } = contactConfig

  return (
    <>
      <Navbar />
      <main className="contact-page">

        {/* Hero */}
        <section className="contact-hero section-spacer">
          <div className="container">
            <div className="contact-hero-card">
              <p className="contact-eyebrow">{hero.eyebrow}</p>
              <h1>{hero.heading}</h1>
              <p className="contact-hero-sub">{hero.subtext}</p>
            </div>
          </div>
        </section>

        {/* Contact info cards */}
        <section className="contact-cards-section section-spacer">
          <div className="container">
            <div className="contact-cards-grid">
              {contactCards.map((card) => {
                const inner = (
                  <>
                    <div className="contact-card-icon">
                      <ContactIcon type={card.type} />
                    </div>
                    <p className="contact-card-label">{card.label}</p>
                    <p className="contact-card-value">{card.value}</p>
                    <p className="contact-card-detail">{card.detail}</p>
                  </>
                )
                return card.href ? (
                  <a key={card.id} href={card.href} className="contact-card">
                    {inner}
                  </a>
                ) : (
                  <div key={card.id} className="contact-card">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Form + Office note */}
        <section className="contact-form-section section-spacer">
          <div className="container">
            <div className="contact-form-layout">

              {/* Form */}
              <div className="contact-form-card">
                <div className="contact-form-header">
                  <h2>Send us a message</h2>
                  <p>Fill in the form below and we'll get back to you as soon as possible.</p>
                </div>

                <form className="contact-form">
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">Email Address</label>
                    <input
                      type="email"
                      id="contact-email"
                      placeholder="your@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      placeholder="Tell us how we can help…"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button type="button" className="primary-btn contact-submit-btn">
                    Send message
                  </button>
                </form>
              </div>

              {/* Office note */}
              <div className="contact-office-panel">
                <div className="contact-office-card">
                  <h3>{officeNote.heading}</h3>
                  <p>{officeNote.body}</p>
                  <address className="contact-office-address">{officeNote.address}</address>
                </div>

                <div className="contact-map-placeholder">
                  {officeNote.mapEmbedSrc ? (
                    <iframe
                      src={officeNote.mapEmbedSrc}
                      title="Office location map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="contact-map-mock" aria-label="Map placeholder">
                      <svg viewBox="0 0 48 48" aria-hidden="true" fill="none">
                        <rect width="48" height="48" rx="14" fill="#fff3e8" />
                        <path d="M24 10a10 10 0 0 0-10 10c0 7 10 18 10 18s10-11 10-18a10 10 0 0 0-10-10Zm0 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#f97316" />
                      </svg>
                      <span>Map will appear here</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default ContactUs
