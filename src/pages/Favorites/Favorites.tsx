import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import SiteFooter from '../../components/home/SiteFooter'
import type { FeaturedCar, SocialItem } from '../../components/home/types'
import { featuredCars } from '../../data/featuredCars'
import { getFavoriteIds, setFavoriteIds } from '../../utils/favoritesStorage'
import { fetchOffers, fromCatalogFavoriteId, isCatalogFavoriteId } from '../Catalog/catalog.api'
import type { Offer } from '../Catalog/catalog.types'
import './Favorites.css'

const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

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

const comparisonRows: Array<{
  key: string
  label: string
  getValue: (car: FavoriteVehicle) => string
}> = [
  { key: 'price', label: 'Price', getValue: (car) => car.price },
  { key: 'year', label: 'Year', getValue: (car) => `${car.year}` },
  { key: 'mileage', label: 'Mileage', getValue: (car) => car.mileage },
  { key: 'detailA', label: 'Engine / Power', getValue: (car) => car.detailA },
  { key: 'detailB', label: 'Consumption / Location', getValue: (car) => car.detailB },
  {
    key: 'features',
    label: 'Key features',
    getValue: (car) => car.features.join(', '),
  },
]

function toFavoriteVehicleFromFeaturedCar(car: FeaturedCar): FavoriteVehicle {
  return {
    favoriteId: car.id,
    title: `${car.name} ${car.model}`,
    year: car.year,
    price: car.price,
    image: car.image,
    mileage: car.mileage,
    fuel: car.fuel,
    transmission: car.transmission,
    category: car.body,
    detailA: car.engine,
    detailB: car.consumption,
    features: car.features,
  }
}

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
    image: offer.imageUrl,
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
  const navigate = useNavigate()
  const [favoriteIds, setFavoriteIdsState] = useState<number[]>(() => getFavoriteIds())
  const [compareIds, setCompareIds] = useState<number[]>([])
  const [catalogOffers, setCatalogOffers] = useState<Offer[]>([])

  useEffect(() => {
    setFavoriteIds(favoriteIds)
  }, [favoriteIds])

  useEffect(() => {
    let alive = true

    ;(async () => {
      const offers = await fetchOffers()
      if (alive) {
        setCatalogOffers(offers)
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
    const featuredMap = new Map(featuredCars.map((car) => [car.id, toFavoriteVehicleFromFeaturedCar(car)]))
    const catalogMap = new Map(catalogOffers.map((offer) => [offer.id, offer]))

    return favoriteIds.flatMap((favoriteId) => {
      if (isCatalogFavoriteId(favoriteId)) {
        const offerId = fromCatalogFavoriteId(favoriteId)
        const offer = offerId ? catalogMap.get(offerId) : undefined
        return offer ? [toFavoriteVehicleFromOffer(offer, favoriteId)] : []
      }

      const featuredCar = featuredMap.get(favoriteId)
      return featuredCar ? [featuredCar] : []
    })
  }, [catalogOffers, favoriteIds])

  const toggleFavorite = (favoriteId: number) => {
    setFavoriteIdsState((prev) => {
      const nextFavoriteIds = prev.includes(favoriteId)
        ? prev.filter((id) => id !== favoriteId)
        : [...prev, favoriteId]

      setCompareIds((current) =>
        current.filter((id) => nextFavoriteIds.includes(id)),
      )

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

  const compareCars = useMemo(
    () => favoriteCars.filter((car) => compareIds.includes(car.favoriteId)),
    [favoriteCars, compareIds],
  )

  return (
    <>
      <Navbar />
      <main className="favorites-page">
        <section className="favorites-header">
          <div className="container">
            <div className="favorites-title">
              <span className="favorites-eyebrow">AutoMarket / Shortlist</span>
              <h1>Favorites</h1>
              <p>Compare your saved cars in one clean view.</p>
            </div>
            <div className="favorites-meta">
              <span>{favoriteCars.length} saved cars</span>
              <span>{compareIds.length}/4 selected for comparison</span>
            </div>
          </div>
        </section>

        <section className="favorites-section">
          <div className="container">
            {favoriteCars.length === 0 ? (
              <div className="favorites-empty">
                <div>
                  <h2>You have no saved cars</h2>
                  <p>Add favorites and return for quick comparison.</p>
                  <a className="primary-btn" href="/offers">
                    View offers
                  </a>
                </div>
              </div>
            ) : (
              <div className="favorites-grid">
                {favoriteCars.map((car) => {
                  const isSelected = compareIds.includes(car.favoriteId)
                  const compareDisabled = !isSelected && compareIds.length >= 4

                  return (
                    <article key={car.favoriteId} className="favorite-card">
                      <div className="favorite-card-media">
                        <img src={car.image} alt={car.title} />
                      </div>
                      <div className="favorite-card-body">
                        <div className="favorite-card-title">
                          <h3>{car.title}</h3>
                          <span>{car.year}</span>
                        </div>
                        <div className="favorite-card-main">
                          <strong>{car.price}</strong>
                          <span>{car.mileage}</span>
                        </div>
                        <div className="favorite-card-specs">
                          <span>{car.fuel}</span>
                          <span>{car.transmission}</span>
                          <span>{car.category}</span>
                        </div>
                        <div className="favorite-card-actions">
                          <button
                            type="button"
                            className={`ghost-btn ${isSelected ? 'is-active' : ''}`}
                            onClick={() => toggleCompare(car.favoriteId)}
                            disabled={compareDisabled}
                          >
                            {isSelected ? 'Selected' : 'Compare'}
                          </button>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => toggleFavorite(car.favoriteId)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className="primary-btn"
                            onClick={() =>
                              navigate('/car-details', car.offer ? { state: { offer: car.offer } } : undefined)
                            }
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {compareCars.length >= 2 ? (
          <section className="compare-section">
            <div className="container">
              <header className="compare-header">
                <div>
                  <h2>Comparison</h2>
                  <p>Select between 2 and 4 cars for a direct comparison.</p>
                </div>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => setCompareIds([])}
                >
                  Reset selection
                </button>
              </header>

              <div className="compare-grid">
                <div className="compare-row compare-row-head">
                  <div className="compare-cell compare-label">Model</div>
                  {compareCars.map((car) => (
                    <div key={car.favoriteId} className="compare-cell compare-value">
                      <strong>
                        {car.title}
                      </strong>
                      <span>{car.year}</span>
                    </div>
                  ))}
                </div>

                {comparisonRows.map((row) => {
                  const values = compareCars.map((car) => row.getValue(car))
                  const allSame = values.every((value) => value === values[0])

                  return (
                    <div
                      key={row.key}
                      className={`compare-row ${allSame ? '' : 'is-different'}`}
                    >
                      <div className="compare-cell compare-label">{row.label}</div>
                      {values.map((value, index) => (
                        <div key={`${row.key}-${index}`} className="compare-cell compare-value">
                          {value}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Favorites
