import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { useTheme } from '../../context/ThemeContext'
import { getApiErrorMessage } from '../../services/api'
import { getFavoriteIds, setFavoriteIds } from '../../utils/favoritesStorage'
import { fetchOffers, fromCatalogFavoriteId, isCatalogFavoriteId } from '../Catalog/catalog.api'
import type { Offer } from '../Catalog/catalog.types'
import '../Home/Home.css'
import './Favorites.css'

type FavoriteVehicle = {
  favoriteId: number
  title: string
  year: number
  price: string
  image: string
  mileage: string
  fuel: string
  transmission: string
  category: string
  detailA: string
  detailB: string
  features: string[]
  offer?: Offer
}

type IconProps = {
  size?: number
  fill?: string
}

const comparisonRows: Array<{
  key: string
  label: string
  getValue: (car: FavoriteVehicle) => string
}> = [
  { key: 'price', label: 'Price', getValue: (car) => car.price },
  { key: 'year', label: 'Year', getValue: (car) => `${car.year}` },
  { key: 'mileage', label: 'Mileage', getValue: (car) => car.mileage },
  { key: 'detailA', label: 'Power', getValue: (car) => car.detailA },
  { key: 'detailB', label: 'Location / consumption', getValue: (car) => car.detailB },
  { key: 'features', label: 'Highlights', getValue: (car) => car.features.join(', ') },
]

function Svg({
  size = 18,
  d,
  fill = 'none',
  extra,
}: IconProps & { d: string; extra?: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {extra}
      <path d={d} />
    </svg>
  )
}

const HeartIcon = (p: IconProps) => (
  <Svg
    {...p}
    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  />
)
const ScaleIcon = (p: IconProps) => (
  <Svg
    {...p}
    d="M12 3v18M5 7h14M6 7l-3 6h6L6 7zM18 7l-3 6h6l-3-6z"
  />
)
const PinIcon = (p: IconProps) => (
  <Svg
    {...p}
    extra={<circle cx="12" cy="10" r="3" />}
    d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"
  />
)
const TrashIcon = (p: IconProps) => (
  <Svg {...p} d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
)
const ArrowIcon = (p: IconProps) => <Svg {...p} d="M5 12h14M13 5l7 7-7 7" />
const XIcon = (p: IconProps) => <Svg {...p} d="M6 6l12 12M18 6L6 18" />

function toFavoriteVehicleFromOffer(offer: Offer, favoriteId: number): FavoriteVehicle {
  const transmission =
    offer.transmission === 'automatic'
      ? 'Automatic'
      : offer.transmission === 'manual'
        ? 'Manual'
        : 'N/A'

  return {
    favoriteId,
    title: offer.title,
    year: offer.year,
    price: `${new Intl.NumberFormat('de-DE').format(offer.price)} ${offer.currency}`,
    image: offer.imageUrl ?? '',
    mileage: `${new Intl.NumberFormat('de-DE').format(offer.km)} km`,
    fuel: offer.fuel.charAt(0).toUpperCase() + offer.fuel.slice(1),
    transmission,
    category: offer.location,
    detailA: offer.powerHp ? `${offer.powerHp} hp` : 'N/A',
    detailB: offer.location,
    features: [
      offer.isNew ? 'New listing' : 'Verified listing',
      `${transmission} transmission`,
      offer.discountPct ? `${offer.discountPct}% discount` : 'Standard pricing',
    ],
    offer,
  }
}

function Favorites() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [favoriteIds, setFavoriteIdsState] = useState<number[]>(() => getFavoriteIds())
  const [compareIds, setCompareIds] = useState<number[]>([])
  const [catalogOffers, setCatalogOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setFavoriteIds(favoriteIds)
  }, [favoriteIds])

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const offers = await fetchOffers()
        if (alive) {
          setCatalogOffers(offers)
        }
      } catch (err) {
        if (alive) setError(getApiErrorMessage(err))
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      const nextFavoriteIds = getFavoriteIds()
      setFavoriteIdsState(nextFavoriteIds)
      setCompareIds((prev) => prev.filter((id) => nextFavoriteIds.includes(id)))
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const favoriteCars = useMemo(() => {
    const catalogMap = new Map(catalogOffers.map((offer) => [offer.id, offer]))

    return favoriteIds.flatMap((favoriteId) => {
      const offerId = isCatalogFavoriteId(favoriteId) ? fromCatalogFavoriteId(favoriteId) : null
      const offer = offerId ? catalogMap.get(offerId) : undefined
      return offer ? [toFavoriteVehicleFromOffer(offer, favoriteId)] : []
    })
  }, [catalogOffers, favoriteIds])

  const toggleFavorite = (favoriteId: number) => {
    setFavoriteIdsState((prev) => {
      const nextFavoriteIds = prev.includes(favoriteId)
        ? prev.filter((id) => id !== favoriteId)
        : [...prev, favoriteId]

      setCompareIds((current) => current.filter((id) => nextFavoriteIds.includes(id)))

      return nextFavoriteIds
    })
  }

  const toggleCompare = (favoriteId: number) => {
    setCompareIds((prev) => {
      if (prev.includes(favoriteId)) {
        return prev.filter((id) => id !== favoriteId)
      }
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, favoriteId]
    })
  }

  const openDetails = (car: FavoriteVehicle) => {
    navigate(
      '/car-details',
      car.offer ? { state: { offer: car.offer } } : undefined,
    )
  }

  const handleCardKey = (e: KeyboardEvent<HTMLElement>, car: FavoriteVehicle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openDetails(car)
    }
  }

  const compareCars = useMemo(
    () => favoriteCars.filter((car) => compareIds.includes(car.favoriteId)),
    [favoriteCars, compareIds],
  )
  const selectedCount = compareIds.length
  const showCompareBar = selectedCount >= 2

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className={`am-shell am-favorites${showCompareBar ? ' am-favorites--bar' : ''}`}>
        <header className="am-fav-hero">
          <div>
            <div className="am-eyebrow">Shortlist</div>
            <h1 className="am-fav-title">Favorites</h1>
            <p className="am-fav-sub">Saved cars, quick comparisons, and the next listing you want to inspect.</p>
          </div>
          <div className="am-fav-summary" aria-label="Favorites summary">
            <div>
              <strong>{favoriteCars.length}</strong>
              <span>Saved</span>
            </div>
            <div>
              <strong>{selectedCount}/4</strong>
              <span>Compare</span>
            </div>
          </div>
        </header>

        {error && <div className="am-alert" role="alert">{error}</div>}

        {loading ? (
          <section className="am-fav-empty">
            <h2>Loading saved cars...</h2>
          </section>
        ) : favoriteCars.length === 0 ? (
          <section className="am-fav-empty">
            <div className="am-fav-empty-mark">
              <HeartIcon size={24} />
            </div>
            <h2>No saved cars yet</h2>
            <p>Add cars to your favorites from Offers or the homepage, then come back to compare them here.</p>
            <button
              type="button"
              className="am-btn am-btn--primary am-btn--lg"
              onClick={() => navigate('/offers')}
            >
              Browse offers <ArrowIcon size={16} />
            </button>
          </section>
        ) : (
          <>
            <section className="am-fav-head">
              <div className="am-fav-head-count">
                {favoriteCars.length} saved car{favoriteCars.length === 1 ? '' : 's'}
              </div>
              {selectedCount > 0 && (
                <button type="button" className="am-fav-clear" onClick={() => setCompareIds([])}>
                  Clear comparison
                </button>
              )}
            </section>

            <section className="am-fav-grid" aria-label="Saved cars">
              {favoriteCars.map((car) => {
                const isSelected = compareIds.includes(car.favoriteId)
                const compareDisabled = !isSelected && compareIds.length >= 4

                return (
                  <article
                    key={car.favoriteId}
                    className="am-fav-card"
                    data-selected={isSelected}
                    role="link"
                    tabIndex={0}
                    aria-label={`Open details for ${car.title}`}
                    onClick={() => openDetails(car)}
                    onKeyDown={(e) => handleCardKey(e, car)}
                  >
                    <div className="am-fav-media">
                      <img src={car.image} alt={car.title} loading="lazy" />
                      <button
                        type="button"
                        className="am-fav-heart"
                        aria-label={`Remove ${car.title} from favorites`}
                        aria-pressed="true"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(car.favoriteId)
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <HeartIcon size={18} fill="currentColor" />
                      </button>
                      {isSelected && <span className="am-fav-selected">Selected</span>}
                    </div>

                    <div className="am-fav-body">
                      <div className="am-fav-card-top">
                        <h2>{car.title}</h2>
                        <span>{car.year}</span>
                      </div>
                      <div className="am-fav-price">{car.price}</div>
                      <div className="am-fav-specs">
                        {car.mileage} / {car.fuel} / {car.transmission}
                      </div>
                      <div className="am-fav-location">
                        <PinIcon size={13} /> {car.category}
                      </div>
                      <div className="am-fav-tags">
                        {car.features.slice(0, 3).map((feature) => (
                          <span key={feature}>{feature}</span>
                        ))}
                      </div>
                    </div>

                    <div className="am-fav-actions">
                      <button
                        type="button"
                        className="am-fav-action"
                        aria-pressed={isSelected}
                        disabled={compareDisabled}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCompare(car.favoriteId)
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <ScaleIcon size={14} />
                        {isSelected ? 'Selected' : 'Compare'}
                      </button>
                      <button
                        type="button"
                        className="am-fav-action am-fav-action--danger"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(car.favoriteId)
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <TrashIcon size={14} /> Remove
                      </button>
                    </div>
                  </article>
                )
              })}
            </section>
          </>
        )}

        {compareCars.length >= 2 && (
          <section id="comparison-section" className="am-fav-compare">
            <header className="am-fav-compare-head">
              <div>
                <div className="am-eyebrow">Comparison</div>
                <h2>Compare selected cars</h2>
              </div>
              <button type="button" className="am-btn am-btn--outline" onClick={() => setCompareIds([])}>
                Reset
              </button>
            </header>

            <div className="am-fav-table" role="table" aria-label="Favorite cars comparison">
              <div className="am-fav-row am-fav-row--head" role="row">
                <div className="am-fav-cell am-fav-label" role="columnheader">Model</div>
                {compareCars.map((car) => (
                  <div key={car.favoriteId} className="am-fav-cell" role="columnheader">
                    <strong>{car.title}</strong>
                    <span>{car.year}</span>
                  </div>
                ))}
              </div>

              {comparisonRows.map((row) => {
                const values = compareCars.map((car) => row.getValue(car))
                const allSame = values.every((value) => value === values[0])

                return (
                  <div key={row.key} className="am-fav-row" data-different={!allSame} role="row">
                    <div className="am-fav-cell am-fav-label" role="rowheader">{row.label}</div>
                    {values.map((value, index) => (
                      <div key={`${row.key}-${index}`} className="am-fav-cell" role="cell">
                        {value}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {showCompareBar && (
          <aside className="am-fav-bar" aria-label="Compare selected cars">
            <div className="am-fav-bar-copy">
              <span>{selectedCount}/4 selected</span>
              <strong>Ready to compare</strong>
            </div>
            <button
              type="button"
              className="am-btn am-btn--primary"
              onClick={() => document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Compare now
            </button>
            <button type="button" className="am-fav-bar-x" aria-label="Clear comparison" onClick={() => setCompareIds([])}>
              <XIcon size={15} />
            </button>
          </aside>
        )}
      </main>

      <AmFooter />
    </div>
  )
}

export default Favorites
