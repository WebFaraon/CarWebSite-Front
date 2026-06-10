import { Link } from 'react-router-dom'
import type { FeaturedCar } from '../types'
import { ArrowRightIcon } from './AmIcons'
import { useTypewriter } from './useTypewriter'

const HERO_WORDS = ['car', 'deal', 'ride']

interface AmHeroProps {
  featuredCar?: FeaturedCar
  totalListings?: number
}

function HeroVisual({ car }: { car?: FeaturedCar }) {
  return (
    <div className="am-hero-visual" aria-hidden="true">
      {car && (
        <>
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
        </>
      )}
      <div className="am-hero-visual-overlay" />
      <div className="am-hero-visual-name">Today on the lot</div>
      <div className="am-hero-visual-spec">
        <b>{car?.name ?? 'AutoMarket'}</b>
        <span>{car ? `${car.model} / ${car.year}` : 'Live listings'}</span>
      </div>
    </div>
  )
}

function AmHero({ featuredCar, totalListings = 0 }: AmHeroProps) {
  const word = useTypewriter(HERO_WORDS)
  const listingsLabel =
    totalListings > 0 ? new Intl.NumberFormat('de-DE').format(totalListings) : 'Live'
  const stats = [
    { num: listingsLabel, label: 'Cars listed' },
    { num: 'Verified', label: 'Seller accounts' },
    { num: 'Live', label: 'Database data' },
    { num: 'Free', label: 'To browse' },
  ]

  return (
    <div className="am-hero-grid">
      <div>
        <div className="am-eyebrow">Verified marketplace / 2026</div>
        <h1 className="am-display">
          Find your perfect{' '}
          <span className="am-display-accent">{word}</span>
          <br />
          today.
        </h1>
        <p className="am-sub">
          Browse verified listings from trusted private sellers and dealers. No
          fees, no clutter, just cars.
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
          {stats.map((s) => (
            <div key={s.label}>
              <div className="am-stat-num">{s.num}</div>
              <div className="am-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HeroVisual car={featuredCar} />
    </div>
  )
}

export default AmHero
