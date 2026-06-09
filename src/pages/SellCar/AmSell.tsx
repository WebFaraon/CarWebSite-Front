import { useNavigate, useSearchParams } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { useTheme } from '../../context/ThemeContext'
import '../Home/Home.css'
import './AmSell.css'

const BENEFITS = [
  'Professional listing structure that looks credible from the first scroll',
  'Buyer conversations organized in one place',
  'Guided pricing and paperwork support when you are ready to close',
]

interface PrepItem {
  t: string
  e: string
}

const PREP: PrepItem[] = [
  { t: 'Vehicle title / registration', e: '' },
  { t: 'VIN or chassis number', e: '' },
  { t: 'Recent photos', e: 'exterior, interior, dashboard, engine bay' },
  { t: 'Asking price', e: '' },
  { t: 'Service / maintenance history', e: 'optional, but helps' },
]

interface Step {
  n: string
  t: string
  b: string
  click: boolean
}

const STEPS: Step[] = [
  {
    n: '01',
    t: 'Create your listing',
    b: 'Add details, photos, and set your price in minutes.',
    click: true,
  },
  {
    n: '02',
    t: 'Connect with buyers',
    b: 'Chat with verified buyers and schedule viewings fast.',
    click: false,
  },
  {
    n: '03',
    t: 'Close the deal',
    b: 'Finalize paperwork securely with our guided process.',
    click: false,
  },
]

const SELL_FAQ: [string, string][] = [
  [
    'How do I list my car for sale?',
    'selling-a-car-how-do-i-list-my-car-for-sale',
  ],
  ['Is it free to list a car?', 'selling-a-car-is-it-free-to-list-a-car'],
  [
    'How long does my listing stay active?',
    'selling-a-car-how-long-does-my-listing-stay-active',
  ],
  [
    'Can I edit my listing after it is published?',
    'selling-a-car-can-i-edit-my-listing-after-it-is-published',
  ],
]

const LISTING_PATH = '/my-listings?tab=new'
const CONTACT_PATH = '/contact-us?topic=Selling%20a%20car'

/* ---------- icons ---------- */

interface IconProps {
  size?: number
}

function CheckS({ size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function ArrowRS({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}

function SparkS({ size = 13 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />
    </svg>
  )
}

/* ---------- main page ---------- */

function AmSell() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromHelp = searchParams.get('from') === 'help'

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className="am-shell am-sell">
        {/* hero */}
        <section className="am-sell-hero">
          <div className="am-sell-hero-grid">
            <div className="am-sell-hero-copy">
              {fromHelp && (
                <div className="am-sell-fromhelp">
                  <SparkS size={13} /> Coming from Help — here's the quick path
                </div>
              )}
              <div className="am-eyebrow">Sell with confidence</div>
              <h1 className="am-sell-display">
                List your car and reach verified buyers fast
              </h1>
              <p className="am-sell-sub">
                Create a standout listing, schedule viewings, and close the deal securely
                with support at every step.
              </p>
              <div className="am-sell-cta-row">
                <button
                  type="button"
                  className="am-btn am-btn--primary am-btn--lg"
                  onClick={() => navigate(LISTING_PATH)}
                >
                  Start listing <ArrowRS size={16} />
                </button>
                <button
                  type="button"
                  className="am-btn am-btn--outline am-btn--lg"
                  onClick={() => navigate(CONTACT_PATH)}
                >
                  Talk to an expert
                </button>
              </div>
            </div>

            <div className="am-sell-hero-panel">
              <div className="am-sell-stats">
                <div className="am-sell-stat">
                  <strong>48h</strong>
                  <span>typical time to receive first serious inquiries</span>
                </div>
                <div className="am-sell-stat">
                  <strong>Verified</strong>
                  <span>buyer flow with cleaner handoff to negotiation</span>
                </div>
              </div>
              <ul className="am-sell-benefits">
                {BENEFITS.map((b) => (
                  <li key={b} className="am-sell-benefit">
                    <span className="am-sell-check">
                      <CheckS size={12} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* prep checklist */}
        <section className="am-sell-prep">
          <div className="am-eyebrow">Before you start</div>
          <h2 className="am-sell-prep-title">What you'll need</h2>
          <ul className="am-sell-prep-list">
            {PREP.map((p) => (
              <li key={p.t} className="am-sell-prep-item">
                <span className="am-sell-check">
                  <CheckS size={12} />
                </span>
                <span>
                  {p.t}
                  {p.e && (
                    <>
                      {' '}
                      — <em>{p.e}</em>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* steps */}
        <section className="am-sell-steps">
          <div className="am-sell-steps-head">
            <h2 className="am-sell-steps-title">How it works</h2>
            <p className="am-sell-steps-sub">
              Three simple steps to get your car listed and sold with confidence.
            </p>
          </div>
          <div className="am-sell-steps-grid">
            {STEPS.map((s) =>
              s.click ? (
                <button
                  key={s.n}
                  type="button"
                  className="am-sell-step am-sell-step--clickable"
                  aria-label="Start your listing"
                  onClick={() => navigate(LISTING_PATH)}
                >
                  <span className="am-sell-step-arrow">
                    <ArrowRS size={18} />
                  </span>
                  <div className="am-sell-step-num">{s.n}</div>
                  <h3 className="am-sell-step-title">{s.t}</h3>
                  <p className="am-sell-step-body">{s.b}</p>
                </button>
              ) : (
                <article key={s.n} className="am-sell-step">
                  <div className="am-sell-step-num">{s.n}</div>
                  <h3 className="am-sell-step-title">{s.t}</h3>
                  <p className="am-sell-step-body">{s.b}</p>
                </article>
              ),
            )}
          </div>
        </section>

        {/* support strip */}
        <section className="am-sell-support">
          <div className="am-sell-support-text">
            <div className="am-eyebrow">Need a faster start?</div>
            <div className="am-sell-support-title">
              Our team can help shape your first listing.
            </div>
          </div>
          <button
            type="button"
            className="am-btn am-btn--primary am-btn--lg"
            onClick={() => navigate(CONTACT_PATH)}
          >
            Book a consultation <ArrowRS size={16} />
          </button>
        </section>

        {/* faq rail */}
        <section className="am-sell-faq">
          <div className="am-sell-faq-label">Common questions about selling</div>
          <nav
            className="am-sell-faq-list"
            aria-label="Common questions about selling"
          >
            {SELL_FAQ.map(([q, id]) => (
              <button
                key={id}
                type="button"
                className="am-sell-faq-item"
                onClick={() => navigate(`/help#${id}`)}
              >
                <span>{q}</span>
                <ArrowRS size={16} />
              </button>
            ))}
          </nav>
        </section>
      </main>

      <AmFooter />
    </div>
  )
}

export default AmSell
