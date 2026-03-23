import { useEffect, useRef, useState } from 'react'
import SmartSearchBar from '../search/SmartSearchBar.tsx'
import type { SearchPayload } from '../search/SmartSearchBar.tsx'

interface HeroSectionProps {
  onSearchAction: (payload: SearchPayload) => void
}

const BASE = 'Find your perfect '

// Each phrase: the accent word (colored) + the rest
const PHRASES = [
  { accent: 'car',  rest: ' today!' },
  { accent: 'deal', rest: ' today!' },
]

const TYPING_SPEED = 75
const DELETE_SPEED = 60
const PAUSE_FULL  = 5000
const PAUSE_EMPTY = 400

function HeroSection({ onSearchAction }: HeroSectionProps) {
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
          // Fully typed — pause then start deleting
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true)
          }, PAUSE_FULL)
        }
      } else {
        if (suffixCount > 0) {
          setSuffixCount((c) => c - 1)
          timeoutRef.current = setTimeout(tick, DELETE_SPEED)
        } else {
          // Fully deleted — switch phrase and start typing
          timeoutRef.current = setTimeout(() => {
            setPhraseIndex((i) => (i + 1) % PHRASES.length)
            setIsDeleting(false)
          }, PAUSE_EMPTY)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, isDeleting ? DELETE_SPEED : TYPING_SPEED)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suffixCount, isDeleting, phraseIndex])

  // Build the colored rendering of the typed suffix
  const phrase = PHRASES[phraseIndex]
  const typedAccent = phrase.accent.slice(0, Math.min(suffixCount, phrase.accent.length))
  const typedRest   = suffixCount > phrase.accent.length
    ? phrase.rest.slice(0, suffixCount - phrase.accent.length)
    : ''

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-copy">
          <p className="hero-eyebrow">Buy. Sell. Drive.</p>
          <h1>
            {BASE}
            {typedAccent && <span className="hero-accent">{typedAccent}</span>}
            {typedRest}
            <span className="hero-cursor" aria-hidden="true" />
          </h1>
          <p>
            Browse trusted listings from verified sellers and discover
            great deals near you.
          </p>
          <div className="hero-trust">
            <span><strong>14,300+</strong> cars listed</span>
            <span className="hero-trust-dot" aria-hidden="true" />
            <span><strong>6,800+</strong> verified sellers</span>
            <span className="hero-trust-dot" aria-hidden="true" />
            <span><strong>Free</strong> to browse</span>
          </div>
        </div>

        <SmartSearchBar onSearchAction={onSearchAction} />
      </div>
    </section>
  )
}

export default HeroSection
