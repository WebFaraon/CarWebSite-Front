import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SmartSearchBar from '../search/SmartSearchBar.tsx'
import type { SearchPayload } from '../search/SmartSearchBar.tsx'

interface HeroSectionProps {
  onSearchAction: (payload: SearchPayload) => void
}

const BASE = 'Find your perfect '

const PHRASES = [
  { accent: 'car',  rest: ' today.' },
  { accent: 'deal', rest: ' today.' },
  { accent: 'ride', rest: ' today.' },
]

const TYPING_SPEED = 75
const DELETE_SPEED = 55
const PAUSE_FULL  = 3800
const PAUSE_EMPTY = 380

const stats = [
  { value: '14,300+', label: 'Cars Listed' },
  { value: '6,800+',  label: 'Verified Sellers' },
  { value: '99%',     label: 'Satisfaction Rate' },
  { value: 'Free',    label: 'To Browse' },
]

function HeroSection({ onSearchAction }: HeroSectionProps) {
  const navigate = useNavigate()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [suffixCount, setSuffixCount] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const phrase = PHRASES[phraseIndex]
    const fullSuffix = phrase.accent + phrase.rest

    function tick() {
      if (!isDeleting) {
        if (suffixCount < fullSuffix.length) {
          setSuffixCount((c) => c + 1)
          timeoutRef.current = setTimeout(tick, TYPING_SPEED)
        } else {
          timeoutRef.current = setTimeout(() => setIsDeleting(true), PAUSE_FULL)
        }
      } else {
        if (suffixCount > 0) {
          setSuffixCount((c) => c - 1)
          timeoutRef.current = setTimeout(tick, DELETE_SPEED)
        } else {
          timeoutRef.current = setTimeout(() => {
            setPhraseIndex((i) => (i + 1) % PHRASES.length)
            setIsDeleting(false)
          }, PAUSE_EMPTY)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? DELETE_SPEED : TYPING_SPEED)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suffixCount, isDeleting, phraseIndex])

  const phrase = PHRASES[phraseIndex]
  const typedAccent = phrase.accent.slice(0, Math.min(suffixCount, phrase.accent.length))
  const typedRest   = suffixCount > phrase.accent.length
    ? phrase.rest.slice(0, suffixCount - phrase.accent.length)
    : ''

  return (
    <section className="hero-section">
      {/* decorative blobs */}
      <div className="hero-blob hero-blob--1" aria-hidden="true" />
      <div className="hero-blob hero-blob--2" aria-hidden="true" />
      <div className="hero-blob hero-blob--3" aria-hidden="true" />

      <div className="container hero-container">
        {/* ── Left copy column ── */}
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="hero-badge__dot" />
            New offers added daily
          </span>

          <h1 className="hero-heading">
            {BASE.trim()}
            <span className="hero-heading__typed">
              {typedAccent && <span className="hero-accent">{typedAccent}</span>}
              {typedRest}
              <span className="hero-cursor" aria-hidden="true" />
            </span>
          </h1>

          <p className="hero-sub">
            Browse thousands of verified offers from trusted sellers
            and discover the best deals near you — completely free.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/offers')}
            >
              Browse Cars
              <svg viewBox="0 0 20 20" aria-hidden="true" className="btn-icon">
                <path d="M7 10h6M10 7l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/sell')}
            >
              Sell Your Car
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            {stats.map((s, i) => (
              <div key={i} className="hero-stat">
                <strong className="hero-stat__value">{s.value}</strong>
                <span className="hero-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right visual: orbiting brand logos ── */}
        <div className="hero-visual" aria-hidden="true">
          <div className="brands-orbit-wrap">
            {/* Decorative orbit tracks */}
            <div className="orbit-track orbit-track--inner" />
            <div className="orbit-track orbit-track--outer" />

            {/* Inner orbit */}
            {([
              { name: 'BMW',    src: '/logos/bmw.svg',    wobbleDur: '1.9s', wobbleDelay: '0s'    },
              { name: 'Audi',   src: '/logos/audi.svg',   wobbleDur: '2.5s', wobbleDelay: '-0.7s' },
              { name: 'Toyota', src: '/logos/toyota.png', wobbleDur: '1.6s', wobbleDelay: '-1.3s' },
              { name: 'Honda',  src: '/logos/honda.webp', wobbleDur: '2.8s', wobbleDelay: '-0.4s' },
            ] as const).map((brand, i) => (
              <div
                key={brand.name}
                className="orbit-item orbit-item--inner"
                style={{ '--delay': `${-(i / 4) * 15}s` } as React.CSSProperties}
              >
                <span
                  className="orbit-chip"
                  style={{ '--wobble-dur': brand.wobbleDur, '--wobble-delay': brand.wobbleDelay } as React.CSSProperties}
                >
                  <img src={brand.src} alt={brand.name} className="orbit-chip__logo" />
                </span>
              </div>
            ))}

            {/* Outer orbit */}
            {([
              { name: 'Mercedes',   src: '/logos/mercedes.png',   wobbleDur: '2.2s', wobbleDelay: '-1.1s' },
              { name: 'Volkswagen', src: '/logos/volkswagen.png', wobbleDur: '1.7s', wobbleDelay: '-0.3s' },
              { name: 'Porsche',    src: '/logos/porsche.png',    wobbleDur: '2.6s', wobbleDelay: '-0.9s' },
              { name: 'Skoda',      src: '/logos/skoda.png',      wobbleDur: '2.0s', wobbleDelay: '-1.6s' },
            ] as const).map((brand, i) => (
              <div
                key={brand.name}
                className="orbit-item orbit-item--outer"
                style={{ '--delay': `${-(i / 4) * 22}s` } as React.CSSProperties}
              >
                <span
                  className="orbit-chip"
                  style={{ '--wobble-dur': brand.wobbleDur, '--wobble-delay': brand.wobbleDelay } as React.CSSProperties}
                >
                  <img src={brand.src} alt={brand.name} className="orbit-chip__logo" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="hero-search-wrap">
        <div className="container">
          <SmartSearchBar onSearchAction={onSearchAction} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
