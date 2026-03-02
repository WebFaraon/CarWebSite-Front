import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import './Help.css'

// ─── FAQ configuration ────────────────────────────────────────────────────────

interface FaqItem {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  items: FaqItem[]
}

const faqData: FaqCategory[] = [
  {
    category: 'Buying a car',
    items: [
      {
        question: 'How do I search for a car?',
        answer:
          'Use the search bar on the home page to type keywords such as brand, model, fuel type, or year. You can also open the Filters panel to narrow results by price, mileage, body type, transmission, and more.',
      },
      {
        question: 'Are all listings verified?',
        answer:
          'Every seller on AutoMarket goes through an identity-verification process before their listings go live. Look for the "Verified seller" badge on a listing for added confidence.',
      },
      {
        question: 'Can I save listings to review later?',
        answer:
          'Yes. Click the heart icon on any car card to add it to your Favorites. You can access all saved listings from the Favorites page at any time.',
      },
      {
        question: 'What does the price shown include?',
        answer:
          'Prices are set by individual sellers and reflect the asking price of the vehicle only. Registration fees, taxes, and any dealer charges are not included unless stated in the listing description.',
      },
      {
        question: 'How do I contact a seller?',
        answer:
          'Open the car details page and click the "Contact seller" button. You can send a message directly through the platform without sharing your personal contact details until you choose to.',
      },
    ],
  },
  {
    category: 'Selling a car',
    items: [
      {
        question: 'How do I list my car for sale?',
        answer:
          'Go to the Sell page from the navigation bar. Fill in your vehicle details, upload photos, set your asking price, and submit. Your listing will be reviewed and published within a few hours.',
      },
      {
        question: 'Is it free to list a car?',
        answer:
          'Basic listings are completely free. A single listing lets you upload up to 10 photos and stays live for 30 days. Premium placement options are available if you want extra visibility.',
      },
      {
        question: 'How long does my listing stay active?',
        answer:
          'Standard listings remain active for 30 days. Before expiry, you will receive a reminder to renew. You can also mark your car as sold or remove the listing at any time from your account dashboard.',
      },
      {
        question: 'Can I edit my listing after it is published?',
        answer:
          'Yes. Log in to your account, go to "My listings", and click Edit on the listing you want to update. Changes take effect immediately after saving.',
      },
    ],
  },
  {
    category: 'Account & security',
    items: [
      {
        question: 'How do I create an account?',
        answer:
          'Click "Sign Up" in the navigation bar and fill in your name, email, and password. You will receive a verification email — confirm it to activate your account.',
      },
      {
        question: 'I forgot my password. What do I do?',
        answer:
          'Click "Login" and then "Forgot password?". Enter your registered email and we will send you a link to reset your password within a few minutes.',
      },
      {
        question: 'How is my personal data handled?',
        answer:
          'Your data is stored securely and never sold to third parties. We use industry-standard encryption for all sensitive information. See our Privacy Policy for full details.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Go to Account Settings and scroll to the bottom of the page. Click "Delete account" and follow the confirmation steps. This action is permanent and will remove all your listings and data.',
      },
    ],
  },
  {
    category: 'Payments & safety',
    items: [
      {
        question: 'Does AutoMarket handle payments?',
        answer:
          'AutoMarket is a listing platform — we connect buyers and sellers but do not process vehicle payments directly. We recommend meeting in a safe public location and using bank transfer for payment.',
      },
      {
        question: 'What should I watch out for to avoid scams?',
        answer:
          'Never pay a deposit before seeing the car in person. Be cautious of prices that seem too good to be true. Only communicate through the platform and report any suspicious activity using the "Report listing" button.',
      },
      {
        question: 'How do I report a suspicious listing?',
        answer:
          'Open the car details page and click the "Report" link near the bottom. Select the reason from the dropdown and add any additional context. Our moderation team reviews reports within 24 hours.',
      },
    ],
  },
]

const socialLinks = [
  { platform: 'facebook' as const, href: '#' },
  { platform: 'instagram' as const, href: '#' },
  { platform: 'x' as const, href: '#' },
  { platform: 'linkedin' as const, href: '#' },
]

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <span className="faq-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <div className="faq-answer-wrap">
        <p className="faq-answer">{item.answer}</p>
      </div>
    </div>
  )
}

// ─── Page component ───────────────────────────────────────────────────────────

function Help() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key))
  }

  return (
    <>
      <Navbar />
      <main className="help-page">

        {/* Hero */}
        <section className="help-hero">
          <div className="container">
            <p className="help-eyebrow">Help Center</p>
            <h1>Frequently asked questions</h1>
            <p className="help-hero-sub">
              Find answers to the most common questions about buying, selling, and using AutoMarket.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="help-faq section-spacer">
          <div className="container">
            <div className="faq-layout">
              {faqData.map((group) => (
                <div key={group.category} className="faq-group">
                  <h2 className="faq-category">{group.category}</h2>
                  <div className="faq-list">
                    {group.items.map((item, index) => {
                      const key = `${group.category}-${index}`
                      return (
                        <AccordionItem
                          key={key}
                          item={item}
                          isOpen={openKey === key}
                          onToggle={() => toggle(key)}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still need help? */}
        <section className="help-cta section-spacer">
          <div className="container">
            <div className="help-cta-card">
              <p className="help-eyebrow">Still need help?</p>
              <h2>Our support team is here for you</h2>
              <p>Can't find what you're looking for? Reach out and we'll get back to you within one business day.</p>
              <a href="/contact-us" className="primary-btn help-cta-btn">Contact support</a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Help
