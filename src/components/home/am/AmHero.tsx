import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './AmIcons'
import { useTypewriter } from './useTypewriter'
import { featuredCars } from '../../../data/featuredCars'

const HERO_WORDS = ['car', 'deal', 'ride']

const STATS = [
  { num: '14,300+', label: 'Cars listed' },
  { num: '6,800+', label: 'Verified sellers' },
  { num: '99%', label: 'Satisfaction rate' },
  { num: 'Free', label: 'To browse' },
]

function HeroVisual() {
  const car = useMemo(
    () => featuredCars[Math.floor(Math.random() * featuredCars.length)],
    [],
  )

  return (
    <div className="am-hero-visual" aria-hidden="true">
      <img
        className="am-hero-visual-bg"
        src={car.image}
        alt=""
        aria-hidden="true"
      />
      <img
        className="am-hero-visual-img"
        src={car.image}
        alt={`${car.name} ${car.model}`}
      />
      <div className="am-hero-visual-overlay" />
      <div className="am-hero-visual-name">Today on the lot</div>
      <div className="am-hero-visual-spec">
        <b>{car.name}</b>
        <span>
          {car.model} · {car.year}
        </span>
      </div>
    </div>
  )
}

function AmHero() {
  const word = useTypewriter(HERO_WORDS)

  return (
    <div className="am-hero-grid">
      <div>
        <div className="am-eyebrow">Verified marketplace · 2026</div>
        <h1 className="am-display">
          Find your perfect{' '}
          <span className="am-display-accent">{word}</span>
          <br />
          today.
        </h1>
        <p className="am-sub">
          Browse 14,300+ verified listings from trusted private sellers and dealers. No
          fees, no clutter — just cars.
        </p>
        <div className="am-cta-row">
          <Link to="/offers" className="am-btn am-btn--primary am-btn--lg">
            Browse cars <ArrowRightIcon size={16} />
          </Link>
          <Link to="/sell" className="am-btn am-btn--outline am-btn--lg">
            Sell your car
          </Link>
        </div>

        <div className="am-stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="am-stat-num">{s.num}</div>
              <div className="am-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroVisual />
    </div>
  )
}

export default AmHero
