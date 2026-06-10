import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { useTheme } from '../../context/ThemeContext'
import { contactApi } from '../../services/api'
import '../Home/Home.css'
import './AmContact.css'

type SubjectValue = 'general' | 'buying' | 'selling' | 'partnership'

const SUBJECTS: { value: SubjectValue; label: string }[] = [
  { value: 'general', label: 'General question' },
  { value: 'buying', label: 'Buying support' },
  { value: 'selling', label: 'Selling support' },
  { value: 'partnership', label: 'Partnership' },
]

const SUBJECT_MAP: Record<SubjectValue, string> = {
  general: 'General',
  buying: 'Buying',
  selling: 'Selling',
  partnership: 'Partnership',
}

const TOPIC_MAP: Record<string, SubjectValue> = {
  'Buying a car': 'buying',
  'Selling a car': 'selling',
  'Account & security': 'general',
  'Payments & safety': 'general',
}

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21743.451228805923!2d28.866073321224768!3d47.06119593964116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97ce00125f907%3A0xfc2e5ee00a6d3d6a!2sUniversitatea%20Tehnic%C4%83%20a%20Moldovei!5e0!3m2!1sro!2s!4v1772179223452!5m2!1sro!2s'

const MSG_MAX = 1000

type TileType = 'phone' | 'email' | 'location' | 'clock'

interface Tile {
  type: TileType
  label: string
  value: string
  detail: string
  href: string | null
}

const TILES: Tile[] = [
  {
    type: 'phone',
    label: 'Call us',
    value: '+373 600 00 000',
    detail: 'Mon-Fri, 9 am - 6 pm',
    href: 'tel:+37360000000',
  },
  {
    type: 'email',
    label: 'Email us',
    value: 'hello@automarket.com',
    detail: 'We reply within 24 working hours',
    href: 'mailto:hello@automarket.com',
  },
  {
    type: 'location',
    label: 'Visit us',
    value: 'Strada Studentilor 7',
    detail: 'Chisinau, Republic of Moldova, MD-2012',
    href: null,
  },
  {
    type: 'clock',
    label: 'Working hours',
    value: 'Mon - Fri, 9 am - 6 pm',
    detail: 'Closed on weekends and public holidays',
    href: null,
  },
]

/* ---------- icons ---------- */

interface IconProps {
  size?: number
}

function PhoneI({ size = 18 }: IconProps) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailI({ size = 18 }: IconProps) {
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
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7" />
    </svg>
  )
}

function PinI({ size = 18 }: IconProps) {
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
      <circle cx="12" cy="10" r="3" />
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    </svg>
  )
}

function ClockI({ size = 18 }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function XI({ size = 13 }: IconProps) {
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

function AlertI({ size = 16 }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

function CheckI({ size = 24, sw = 2 }: IconProps & { sw?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function TargetI({ size = 15 }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  )
}

function TagI({ size = 14 }: IconProps) {
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
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
    </svg>
  )
}

function TileIcon({ type }: { type: TileType }) {
  if (type === 'phone') return <PhoneI size={18} />
  if (type === 'email') return <MailI size={18} />
  if (type === 'location') return <PinI size={18} />
  return <ClockI size={18} />
}

/* ---------- form field wrapper ---------- */

interface CFieldProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

function CField({ label, htmlFor, error, children }: CFieldProps) {
  return (
    <div className="am-contact-field">
      <label className="am-contact-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && (
        <div className="am-contact-err" id={`${htmlFor}-err`}>
          {error}
        </div>
      )}
    </div>
  )
}

/* ---------- main page ---------- */

function AmContact() {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState<SubjectValue>('general')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState('')
  const [topic, setTopic] = useState<string | null>(null)

  // read ?topic= once on mount
  useEffect(() => {
    const t = searchParams.get('topic')
    if (t) {
      setTopic(t)
      setSubject(TOPIC_MAP[t] ?? 'general')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const msgLen = message.length
  const overMax = msgLen >= MSG_MAX

  const clearErr = (k: string) =>
    setErrors((e) => {
      if (!e[k]) return e
      const n = { ...e }
      delete n[k]
      return n
    })

  const validate = () => {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email address.'
    if (message.trim().length < 10) e.message = 'Tell us at least a few words.'
    else if (message.length > MSG_MAX) e.message = 'Keep it under 1,000 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setSending(true)
    try {
      await contactApi.send({
        name,
        email,
        subject: SUBJECT_MAP[subject],
        message,
      })
      setSent(true)
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Failed to send. Please try again.',
      )
    } finally {
      setSending(false)
    }
  }

  const reset = () => {
    setSent(false)
    setName('')
    setEmail('')
    setSubject(topic ? TOPIC_MAP[topic] ?? 'general' : 'general')
    setMessage('')
    setErrors({})
    setServerError('')
  }

  const clearTopic = () => {
    setTopic(null)
    setSubject('general')
  }

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className="am-shell am-contact">
        {/* hero */}
        <div className="am-contact-hero">
          <div className="am-eyebrow">We're here to help</div>
          <h1 className="am-contact-h1">Get in touch with our team</h1>
          <p className="am-contact-sub">
            Have a question about buying or selling? Our support team is available to guide
            you every step of the way.
          </p>
        </div>

        {/* tiles */}
        <div className="am-contact-tiles">
          {TILES.map((t) => {
            const inner = (
              <>
                <span className="am-contact-tile-icon">
                  <TileIcon type={t.type} />
                </span>
                <span className="am-contact-tile-label">{t.label}</span>
                <span className="am-contact-tile-value">{t.value}</span>
                <span className="am-contact-tile-detail">{t.detail}</span>
              </>
            )
            return t.href ? (
              <a
                key={t.type}
                href={t.href}
                className="am-contact-tile"
                aria-label={`${t.label} at ${t.value}`}
              >
                {inner}
              </a>
            ) : (
              <div key={t.type} className="am-contact-tile">
                {inner}
              </div>
            )
          })}
        </div>

        {/* body */}
        <div className="am-contact-body">
          {/* form card */}
          <section className="am-contact-form-card">
            {sent ? (
              <div className="am-contact-success" role="status">
                <div className="am-contact-success-mark">
                  <CheckI size={26} />
                </div>
                <h2 className="am-contact-success-title">Message sent</h2>
                <p className="am-contact-success-body">
                  Thanks — we'll get back to you within one business day.
                </p>
                <button
                  type="button"
                  className="am-btn am-btn--outline am-btn--lg"
                  onClick={reset}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className="am-contact-form-head">
                  <h2 className="am-contact-form-title">Send us a message</h2>
                  <div className="am-contact-form-subtitle">
                    Fill in the form below and we'll get back to you as soon as possible.
                  </div>
                </div>

                {topic && (
                  <div className="am-contact-topic-chip" id="c-topic-chip">
                    <TagI size={14} />
                    <span>
                      Pre-selected from Help: <b>{topic}</b>
                    </span>
                    <button
                      type="button"
                      aria-label="Clear pre-selected topic"
                      onClick={clearTopic}
                    >
                      <XI size={13} />
                    </button>
                  </div>
                )}

                {serverError && (
                  <div className="am-contact-err--form" role="alert">
                    <AlertI size={16} /> <span>{serverError}</span>
                  </div>
                )}

                <form className="am-contact-form" onSubmit={onSubmit} noValidate>
                  <div className="am-contact-row">
                    <CField label="Full name" htmlFor="c-name" error={errors.name}>
                      <input
                        id="c-name"
                        className="am-contact-input"
                        type="text"
                        placeholder="John Car"
                        autoComplete="name"
                        value={name}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'c-name-err' : undefined}
                        onChange={(e) => {
                          setName(e.target.value)
                          clearErr('name')
                        }}
                      />
                    </CField>
                    <CField
                      label="Email address"
                      htmlFor="c-email"
                      error={errors.email}
                    >
                      <input
                        id="c-email"
                        className="am-contact-input"
                        type="email"
                        placeholder="your@example.com"
                        autoComplete="email"
                        value={email}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'c-email-err' : undefined}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          clearErr('email')
                        }}
                      />
                    </CField>
                  </div>

                  <CField label="Subject" htmlFor="c-subject">
                    <select
                      id="c-subject"
                      className="am-contact-select"
                      value={subject}
                      aria-describedby={topic ? 'c-topic-chip' : undefined}
                      onChange={(e) => setSubject(e.target.value as SubjectValue)}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </CField>

                  <CField label="Message" htmlFor="c-message" error={errors.message}>
                    <textarea
                      id="c-message"
                      className="am-contact-textarea"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      maxLength={MSG_MAX}
                      value={message}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'c-message-err' : undefined}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        clearErr('message')
                      }}
                    />
                    <div
                      className="am-contact-counter"
                      data-near={msgLen > 900}
                      data-max={overMax}
                    >
                      {msgLen} / {MSG_MAX}
                    </div>
                  </CField>

                  <button
                    type="submit"
                    className="am-contact-submit"
                    disabled={sending || overMax}
                  >
                    {sending ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </>
            )}
          </section>

          {/* office aside */}
          <aside className="am-contact-office">
            <div className="am-contact-office-card">
              <h2 className="am-contact-office-title">Stop by our office</h2>
              <p className="am-contact-office-body">
                Our doors are open Monday through Friday. Whether you want to discuss a
                listing in person or just say hello, we love meeting our community.
              </p>
              <div className="am-contact-office-addr">
                Strada Studentilor 7, MD-2012, Chisinau
              </div>
              <div className="am-contact-office-meta">
                <div className="am-contact-office-meta-row">
                  <TargetI size={15} />
                  <span>Response target: under 1 business day</span>
                </div>
                <div className="am-contact-office-meta-row">
                  <CheckI size={15} sw={1.5} />
                  <span>Best for listing issues, account help, and buyer support</span>
                </div>
              </div>
            </div>
            <div className="am-contact-map">
              <iframe
                title="Office location map"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </aside>
        </div>
      </main>

      <AmFooter />
    </div>
  )
}

export default AmContact
