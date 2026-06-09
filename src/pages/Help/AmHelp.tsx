import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { ArrowRightIcon } from '../../components/home/am/AmIcons'
import { useTheme } from '../../context/ThemeContext'
import '../Home/Home.css'
import './AmHelp.css'

interface FaqItem {
  q: string
  a: string
}

interface FaqGroup {
  cat: string
  items: FaqItem[]
}

const FAQ: FaqGroup[] = [
  {
    cat: 'Buying a car',
    items: [
      {
        q: 'How do I search for a car?',
        a: 'Use the search bar on the home page to type keywords such as brand, model, fuel type, or year. You can also open the Filters panel to narrow results by price, mileage, body type, transmission, and more.',
      },
      {
        q: 'Are all listings verified?',
        a: 'Every seller on AutoMarket goes through an identity-verification process before their listings go live. Look for the "Verified seller" badge on a listing for added confidence.',
      },
      {
        q: 'Can I save listings to review later?',
        a: 'Yes. Click the heart icon on any car card to add it to your Favorites. You can access all saved listings from the Favorites page at any time.',
      },
      {
        q: 'What does the price shown include?',
        a: 'Prices are set by individual sellers and reflect the asking price of the vehicle only. Registration fees, taxes, and any dealer charges are not included unless stated in the listing description.',
      },
      {
        q: 'How do I contact a seller?',
        a: 'Open the car details page and click the "Contact seller" button. You can send a message directly through the platform without sharing your personal contact details until you choose to.',
      },
    ],
  },
  {
    cat: 'Selling a car',
    items: [
      {
        q: 'How do I list my car for sale?',
        a: 'Go to the Sell page from the navigation bar. Fill in your vehicle details, upload photos, set your asking price, and submit. Your listing will be reviewed and published within a few hours.',
      },
      {
        q: 'Is it free to list a car?',
        a: 'Basic listings are completely free. A single listing lets you upload up to 10 photos and stays live for 30 days. Premium placement options are available if you want extra visibility.',
      },
      {
        q: 'How long does my listing stay active?',
        a: 'Standard listings remain active for 30 days. Before expiry, you will receive a reminder to renew. You can also mark your car as sold or remove the listing at any time from your account dashboard.',
      },
      {
        q: 'Can I edit my listing after it is published?',
        a: 'Yes. Log in to your account, go to "My listings", and click Edit on the listing you want to update. Changes take effect immediately after saving.',
      },
    ],
  },
  {
    cat: 'Account & security',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" in the navigation bar and fill in your name, email, and password. You will receive a verification email — confirm it to activate your account.',
      },
      {
        q: 'I forgot my password. What do I do?',
        a: 'Click "Login" and then "Forgot password?". Enter your registered email and we will send you a link to reset your password within a few minutes.',
      },
      {
        q: 'How is my personal data handled?',
        a: 'Your data is stored securely and never sold to third parties. We use industry-standard encryption for all sensitive information. See our Privacy Policy for full details.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Account Settings and scroll to the bottom of the page. Click "Delete account" and follow the confirmation steps. This action is permanent and will remove all your listings and data.',
      },
    ],
  },
  {
    cat: 'Payments & safety',
    items: [
      {
        q: 'Does AutoMarket handle payments?',
        a: 'AutoMarket is a listing platform — we connect buyers and sellers but do not process vehicle payments directly. We recommend meeting in a safe public location and using bank transfer for payment.',
      },
      {
        q: 'What should I watch out for to avoid scams?',
        a: 'Never pay a deposit before seeing the car in person. Be cautious of prices that seem too good to be true. Only communicate through the platform and report any suspicious activity using the "Report listing" button.',
      },
      {
        q: 'How do I report a suspicious listing?',
        a: 'Open the car details page and click the "Report" link near the bottom. Select the reason from the dropdown and add any additional context. Our moderation team reviews reports within 24 hours.',
      },
    ],
  },
]

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const itemId = (cat: string, q: string) => `${slug(cat)}-${slug(q)}`

interface PopularTopic {
  label: string
  cat: string
  q: string
}

const POPULAR: PopularTopic[] = [
  { label: 'How do I list my car?', cat: 'Selling a car', q: 'How do I list my car for sale?' },
  {
    label: 'I forgot my password',
    cat: 'Account & security',
    q: 'I forgot my password. What do I do?',
  },
  {
    label: 'Avoiding scams',
    cat: 'Payments & safety',
    q: 'What should I watch out for to avoid scams?',
  },
  { label: 'Are listings verified?', cat: 'Buying a car', q: 'Are all listings verified?' },
  { label: 'Is listing free?', cat: 'Selling a car', q: 'Is it free to list a car?' },
  {
    label: 'Save cars for later',
    cat: 'Buying a car',
    q: 'Can I save listings to review later?',
  },
]

const ALL_ITEM_COUNT = FAQ.reduce((n, g) => n + g.items.length, 0)

/* ---------- icons ---------- */

interface IconProps {
  size?: number
  className?: string
}

function SearchI({ size = 18, className }: IconProps) {
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
      className={className}
    >
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35" />
    </svg>
  )
}

function XI({ size = 14 }: IconProps) {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ChevR({ size = 18 }: IconProps) {
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
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function LinkI({ size = 15 }: IconProps) {
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
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  )
}

function ThumbUp({ size = 15 }: IconProps) {
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
      <path d="M7 11v9H3v-9zM7 11l4-8a2 2 0 0 1 2 2v3h5.5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.3 20H7" />
    </svg>
  )
}

function ThumbDn({ size = 15 }: IconProps) {
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
      <path d="M17 13V4h4v9zM17 13l-4 8a2 2 0 0 1-2-2v-3H5.5a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 6.7 4H17" />
    </svg>
  )
}

/* ---------- helpers ---------- */

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}

/* ---------- accordion item ---------- */

interface HelpItemProps {
  cat: string
  item: FaqItem
  id: string
  open: boolean
  onToggle: () => void
  query: string
}

type Vote = null | 'up' | 'down'

function HelpItem({ cat, item, id, open, onToggle, query }: HelpItemProps) {
  const [vote, setVote] = useState<Vote>(null)
  const [missing, setMissing] = useState('')
  const [copied, setCopied] = useState(false)
  const panelId = `panel-${id}`
  const btnId = `btn-${id}`

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `${window.location.pathname}#${id}`)
    }
    navigator.clipboard?.writeText(url).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const submitMissing = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend yet — placeholder telemetry hook.
    // eslint-disable-next-line no-console
    console.info('[help-feedback]', { category: cat, question: item.q, missing })
    setMissing('')
    setVote('up')
  }

  return (
    <article className="am-help-item" data-open={open} id={id}>
      <button
        type="button"
        className="am-help-item-btn"
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="am-help-item-chevron">
          <ChevR size={18} />
        </span>
        <span className="am-help-item-q">
          <Highlight text={item.q} q={query} />
        </span>
        <span
          className={'am-help-item-copy' + (copied ? ' copied' : '')}
          role="button"
          tabIndex={-1}
          aria-label="Copy link to this answer"
          title={copied ? 'Link copied' : 'Copy link'}
          onClick={copyLink}
        >
          <LinkI size={15} />
        </span>
      </button>

      <div
        className="am-help-panel"
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        aria-hidden={!open}
      >
        <div className="am-help-panel-inner">
          <div className="am-help-answer">
            <Highlight text={item.a} q={query} />
          </div>
          <div className="am-help-helpful">
            {vote === null ? (
              <>
                <span>Was this helpful?</span>
                <button
                  type="button"
                  className="am-help-vote"
                  aria-pressed="false"
                  onClick={() => setVote('up')}
                >
                  <ThumbUp size={15} /> Yes
                </button>
                <button
                  type="button"
                  className="am-help-vote"
                  aria-pressed="false"
                  onClick={() => setVote('down')}
                >
                  <ThumbDn size={15} /> No
                </button>
              </>
            ) : vote === 'up' ? (
              <span className="am-help-thanks" role="status">
                Thanks for the feedback!
              </span>
            ) : (
              <>
                <span className="am-help-thanks">Thanks — what's missing?</span>
                <form className="am-help-missing" onSubmit={submitMissing}>
                  <input
                    value={missing}
                    onChange={(e) => setMissing(e.target.value)}
                    placeholder="Tell us what's missing…"
                    aria-label="What's missing from this answer"
                  />
                  <button type="submit" className="am-btn am-btn--outline">
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

/* ---------- main page ---------- */

function AmHelp() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())
  const [activeCat, setActiveCat] = useState(FAQ[0].cat)
  const groupRefs = useRef<Record<string, HTMLElement | null>>({})

  const q = query.trim()

  const filtered = useMemo(() => {
    if (!q) return FAQ
    const ql = q.toLowerCase()
    return FAQ.map((g) => ({
      ...g,
      items: g.items.filter((it) => (it.q + ' ' + it.a).toLowerCase().includes(ql)),
    })).filter((g) => g.items.length > 0)
  }, [q])

  const resultCount = useMemo(
    () => filtered.reduce((n, g) => n + g.items.length, 0),
    [filtered],
  )

  // open from URL hash on mount
  useEffect(() => {
    const h = decodeURIComponent((location.hash || '').replace(/^#/, ''))
    if (!h) return
    const exists = FAQ.some((g) => g.items.some((it) => itemId(g.cat, it.q) === h))
    if (!exists) return
    setOpenIds(new Set([h]))
    window.setTimeout(() => {
      const el = document.getElementById(h)
      if (el) {
        window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
      }
    }, 120)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // scroll-spy for active category (uses window scroll)
  useEffect(() => {
    if (q) return
    const onScroll = () => {
      const y = window.scrollY + 140
      let cur = filtered[0]?.cat
      filtered.forEach((g) => {
        const el = groupRefs.current[g.cat]
        if (el && el.offsetTop <= y) cur = g.cat
      })
      if (cur) setActiveCat(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [filtered, q])

  const toggle = (id: string) =>
    setOpenIds((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const collapseAll = () => setOpenIds(new Set())

  const scrollToCat = (cat: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    const el = groupRefs.current[cat]
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    setActiveCat(cat)
  }

  const scrollToItem = (cat: string, qText: string) => {
    const id = itemId(cat, qText)
    setQuery('')
    setOpenIds((s) => new Set(s).add(id))
    window.setTimeout(() => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
      if (window.history?.replaceState) {
        window.history.replaceState(null, '', `${window.location.pathname}#${id}`)
      }
    }, 60)
  }

  const goContact = () => {
    navigate(`/contact-us?topic=${encodeURIComponent(activeCat)}`)
  }

  const anyOpen = openIds.size > 0

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className="am-shell am-help">
        {/* hero */}
        <div className="am-help-hero">
          <div className="am-eyebrow">Help center</div>
          <h1 className="am-help-h1">Frequently asked questions</h1>
          <p className="am-help-sub">
            Find answers to the most common questions about buying, selling, and using
            AutoMarket.
          </p>
        </div>

        {/* search */}
        <div className="am-help-search-wrap">
          <div className="am-help-search">
            <SearchI size={18} className="am-help-search-icon" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles…"
              aria-label="Search help articles"
            />
            {query && (
              <button
                type="button"
                className="am-help-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <XI size={14} />
              </button>
            )}
          </div>
          <div className="am-help-search-meta">
            {q ? (
              <span>
                {resultCount} result{resultCount === 1 ? '' : 's'} for “{q}”
              </span>
            ) : (
              <span>
                {ALL_ITEM_COUNT} articles across {FAQ.length} categories
              </span>
            )}
            {anyOpen && (
              <button type="button" onClick={collapseAll}>
                Collapse all
              </button>
            )}
          </div>
        </div>

        {/* popular topics — hidden while searching */}
        {!q && (
          <div className="am-help-topics">
            <div className="am-help-topics-label">Popular topics</div>
            <div className="am-help-topics-grid">
              {POPULAR.map((t) => (
                <button
                  type="button"
                  key={`${t.cat}-${t.q}`}
                  className="am-help-topic"
                  onClick={() => scrollToItem(t.cat, t.q)}
                >
                  <span>
                    {t.label}
                    <span className="am-help-topic-cat">{t.cat}</span>
                  </span>
                  <ArrowRightIcon size={16} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* body: nav + content */}
        <div className="am-help-body">
          <nav className="am-help-nav" aria-label="FAQ categories">
            <div className="am-help-nav-title">Categories</div>
            {FAQ.map((g) => (
              <a
                key={g.cat}
                href={`#${slug(g.cat)}`}
                aria-current={!q && activeCat === g.cat ? 'true' : undefined}
                onClick={(e) => scrollToCat(g.cat, e)}
              >
                <span>{g.cat}</span>
                <span>{g.items.length}</span>
              </a>
            ))}
          </nav>

          <div className="am-help-content">
            {!q && (
              <div className="am-help-chips" role="navigation" aria-label="FAQ categories">
                {FAQ.map((g) => (
                  <button
                    type="button"
                    key={g.cat}
                    className="am-help-chip"
                    aria-current={activeCat === g.cat ? 'true' : undefined}
                    onClick={(e) => scrollToCat(g.cat, e)}
                  >
                    {g.cat}
                  </button>
                ))}
              </div>
            )}

            {resultCount === 0 ? (
              <div className="am-help-empty">
                No results for <b>“{q}”</b>. Try a different word or browse the
                categories.
                <br />
                <button type="button" onClick={() => setQuery('')}>
                  Reset search
                </button>
              </div>
            ) : (
              filtered.map((g) => (
                <section
                  key={g.cat}
                  className="am-help-group"
                  id={slug(g.cat)}
                  ref={(el) => {
                    groupRefs.current[g.cat] = el
                  }}
                >
                  <div className="am-help-group-head">
                    <h2 className="am-help-group-title">{g.cat}</h2>
                    <span className="am-help-group-count">
                      {g.items.length} article{g.items.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  {g.items.map((it) => {
                    const id = itemId(g.cat, it.q)
                    return (
                      <HelpItem
                        key={id}
                        cat={g.cat}
                        item={it}
                        id={id}
                        open={openIds.has(id)}
                        onToggle={() => toggle(id)}
                        query={q}
                      />
                    )
                  })}
                </section>
              ))
            )}
          </div>
        </div>

        {/* bottom CTA */}
        <div className="am-help-cta">
          <div className="am-help-cta-text">
            <div className="am-eyebrow">Still need help?</div>
            <div className="am-help-cta-title">Our support team is here for you</div>
            <div className="am-help-cta-body">
              Can't find what you're looking for? Reach out and we'll get back to you within
              one business day.
            </div>
          </div>
          <button
            type="button"
            className="am-btn am-btn--primary am-btn--lg"
            onClick={goContact}
          >
            Contact support <ArrowRightIcon size={16} />
          </button>
        </div>
      </main>

      <AmFooter />
    </div>
  )
}

export default AmHelp
