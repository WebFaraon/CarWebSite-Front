import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AmFooter from '../../components/home/am/AmFooter'
import AmNavbar from '../../components/home/am/AmNavbar'
import type { FeaturedCar } from '../../components/home/types'
import { useTheme } from '../../context/ThemeContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useAuth } from '../../context/AuthContext'
import type { Offer } from '../Catalog/catalog.types'
import '../Home/Home.css'
import './CarDetails.css'

type DetailItem = {
  label: string
  value: string
  icon: string
}

type DetailRow = {
  label: string
  value: string
}

type CarDetailsState = {
  offer?: Offer
  featuredCar?: FeaturedCar
}

const fmt = new Intl.NumberFormat('de-DE')

function label(value?: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'
}

function present(value: string | number | undefined | null, suffix = ''): string | null {
  if (value === undefined || value === null || value === '') return null
  return `${value}${suffix}`
}

function buildCarDataFromOffer(offer: Offer) {
  const price = `${fmt.format(offer.price)} ${offer.currency}`
  const transmission = label(offer.transmission)
  const fuel = label(offer.fuel)
  const mileage = `${fmt.format(offer.km)} km`
  const power = offer.powerHp ? `${offer.powerHp} hp` : 'N/A'

  const bodyType = offer.bodyType ?? 'N/A'
  const highlights: DetailItem[] = [
    { label: 'Mileage', value: mileage, icon: 'mileage' },
    { label: 'Power', value: power, icon: 'power' },
    { label: 'Fuel', value: fuel, icon: 'fuel' },
    { label: 'Transmission', value: transmission, icon: 'transmission' },
    { label: 'Body type', value: bodyType, icon: 'body' },
    { label: 'Location', value: offer.location, icon: 'location' },
  ]

  const technicalRows = [
    { label: 'Condition', value: present(offer.condition) },
    { label: 'Body type', value: present(offer.bodyType) },
    { label: 'Year', value: present(offer.year) },
    { label: 'Mileage', value: mileage },
    { label: 'Fuel type', value: fuel },
    { label: 'Transmission', value: transmission },
    { label: 'Power', value: present(offer.powerHp, ' hp') },
    { label: 'Engine size', value: present(offer.engineSize, ' L') },
    { label: 'Color', value: present(offer.color) },
    { label: 'Doors', value: present(offer.doors) },
    { label: 'Seats', value: present(offer.seats) },
    { label: 'VIN', value: present(offer.vin) },
  ].filter((row): row is DetailRow => Boolean(row.value))

  return {
    title: offer.title,
    price,
    location: offer.location,
    images:
      offer.images.length > 0
        ? offer.images
        : offer.imageUrl
          ? [offer.imageUrl]
          : [],
    description: offer.description,
    highlights,
    technicalRows,
    features: offer.features ?? [],
  }
}

function buildCarDataFromFeaturedCar(featuredCar: FeaturedCar) {
  const images =
    featuredCar.images && featuredCar.images.length > 0
      ? featuredCar.images
      : [featuredCar.image]
  const location = featuredCar.location ?? featuredCar.consumption

  const highlights: DetailItem[] = [
    { label: 'Mileage', value: featuredCar.mileage, icon: 'mileage' },
    { label: 'Power', value: featuredCar.engine, icon: 'power' },
    { label: 'Fuel', value: featuredCar.fuel, icon: 'fuel' },
    { label: 'Transmission', value: featuredCar.transmission, icon: 'transmission' },
    { label: 'Body type', value: featuredCar.body, icon: 'body' },
    { label: 'Location', value: location, icon: 'location' },
  ]

  return {
    title: `${featuredCar.name} ${featuredCar.model}`,
    price: featuredCar.price,
    location,
    images,
    description:
      featuredCar.description ??
      `${featuredCar.name} ${featuredCar.model} from ${featuredCar.year} with ${featuredCar.mileage}, ${featuredCar.transmission} transmission and ${featuredCar.fuel} fuel type.`,
    highlights,
    technicalRows: [
      { label: 'Year', value: `${featuredCar.year}` },
      { label: 'Mileage', value: featuredCar.mileage },
      { label: 'Fuel type', value: featuredCar.fuel },
      { label: 'Transmission', value: featuredCar.transmission },
      { label: 'Body type', value: featuredCar.body },
      { label: 'Power', value: featuredCar.engine },
    ] satisfies DetailRow[],
    features: featuredCar.features ?? [],
  }
}

function SpecIcon({ icon }: { icon: string }) {
  if (icon === 'year') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 2v4M16 2v4M3.5 10h17M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      </svg>
    )
  }

  if (icon === 'transmission') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8a2.5 2.5 0 1 0-2.5-2.5A2.5 2.5 0 0 0 12 8Zm0 0v10m0 0h-3m3 0h3m3-7h2m-2 0a2 2 0 1 1 0 4" />
      </svg>
    )
  }

  if (icon === 'fuel') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 4h-4a2 2 0 0 0-2 2v13h8V6a2 2 0 0 0-2-2Zm5 4 2 2v7a2 2 0 0 1-2 2h-1m0-8h2" />
      </svg>
    )
  }

  if (icon === 'power') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />
      </svg>
    )
  }

  if (icon === 'location') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <path d="M12 10.5h.01" />
      </svg>
    )
  }

  if (icon === 'body') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 13h18l-2-5a3 3 0 0 0-2.8-2H7.8A3 3 0 0 0 5 8l-2 5Zm2 0v5m14-5v5M7 18h.01M17 18h.01" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 14a7 7 0 1 1 14 0M12 14v4M12 18h.01" />
    </svg>
  )
}

function CarDetails() {
  const { theme } = useTheme()
  const location = useLocation()
  const state = location.state as CarDetailsState | null
  const carData = useMemo(
    () =>
      state?.offer
        ? buildCarDataFromOffer(state.offer)
        : state?.featuredCar
          ? buildCarDataFromFeaturedCar(state.featuredCar)
          : null,
    [state],
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const navigate = useNavigate()
  const { isFavorite, add, remove } = useFavorites()
  const { isLoggedIn } = useAuth()
  const offer =state?.offer
  // Resolve carId: Offer.id is string, FeaturedCar.id is number
  const carId: number | null = state?.offer
    ? Number(state.offer.id)
    : state?.featuredCar
      ? state.featuredCar.id
      : null
  const totalImages = carData?.images.length ?? 0

  const showNextImage = () => {
    if (totalImages === 0) return
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % totalImages)
  }

  const showPreviousImage = () => {
    if (totalImages === 0) return
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? totalImages - 1 : currentIndex - 1,
    )
  }

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (carId == null) return
    if (isFavorite(carId)) {
      remove(carId)
    } else {
      add(carId)
    }
  }

  if (!carData) {
    return (
      <div className="am" data-theme={theme}>
        <AmNavbar />
        <main className="am-shell am-detail-page">
          <section className="am-detail-empty">
            <article className="am-detail-card am-detail-card--empty">
              <div className="am-eyebrow">Car details</div>
              <h1>Listing not selected</h1>
              <p>Open a car from the live catalog to view its details.</p>
              <button
                type="button"
                className="am-btn am-btn--primary am-btn--lg"
                onClick={() => navigate('/offers')}
              >
                Browse offers
              </button>
            </article>
          </section>
        </main>
        <AmFooter />
      </div>
    )
  }

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />
      <main className="am-shell am-detail-page">
        <button type="button" className="am-detail-backlink" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
          Back to results
        </button>

        <div className="am-detail-grid">
          <div className="am-detail-main">
            <article className="am-detail-gallery">
              <div className="am-detail-photo-stage">
                {carData.images.length > 0 ? (
                  <img
                    src={carData.images[activeImageIndex]}
                    alt={`${carData.title} view ${activeImageIndex + 1}`}
                    className="am-detail-photo"
                  />
                ) : (
                  <div className="am-detail-photo am-detail-photo--placeholder" aria-label="No photo available">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No photo</span>
                  </div>
                )}
                <div className="am-detail-count">
                  {activeImageIndex + 1} / {totalImages}
                </div>
                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      className="am-detail-image-btn am-detail-image-prev"
                      onClick={showPreviousImage}
                      aria-label="Show previous photo"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m15 5-7 7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="am-detail-image-btn am-detail-image-next"
                      onClick={showNextImage}
                      aria-label="Show next photo"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m9 5 7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              <div className="am-detail-thumbs" aria-label="Car photo gallery">
                {carData.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`am-detail-thumb ${index === activeImageIndex ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show photo ${index + 1}`}
                  >
                    <img src={image} alt={`${carData.title} thumbnail ${index + 1}`} />
                  </button>
                ))}
              </div>
            </article>

            <section className="am-detail-card am-detail-highlights" aria-label="Main car data">
              {carData.highlights.map((item) => (
                <div key={item.label} className="am-detail-highlight">
                  <span className="am-detail-highlight-icon">
                    <SpecIcon icon={item.icon} />
                  </span>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              ))}
            </section>

            <section className="am-detail-card">
              <h2>Technical data</h2>
              <dl className="am-detail-table">
                {carData.technicalRows.map((row) => (
                  <div key={row.label} className="am-detail-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="am-detail-card">
              <h2>Equipment</h2>
              {carData.features.length > 0 ? (
                <ul className="am-detail-feature-grid">
                  {carData.features.map((feature) => (
                    <li key={feature}>
                      <span className="am-detail-check" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="am-detail-empty-text">No equipment was selected for this listing.</p>
              )}
            </section>

            <section className="am-detail-card">
              <h2>Seller description</h2>
              <p className="am-detail-description">
                {carData.description || 'No description was provided for this listing.'}
              </p>
            </section>
          </div>

          <aside className="am-detail-aside" aria-label="Offer summary">
            <article className="am-detail-seller-card">
              <div className="am-detail-aside-head">
                <h1>{carData.title}</h1>
                <p>{carData.location}</p>
              </div>
              <div className="am-detail-aside-price">{carData.price}</div>
              <div className="am-detail-price-note">Listing price from the seller</div>
              
              {offer?.sellerName && (
                <div className="am-detail-seller">
                  <div className="am-detail-seller-title">Seller</div>
                  <dl className="am-detail-seller-list">
                    <div>
                      <dt>Name</dt>
                      <dd>{offer.sellerName}</dd>
                    </div>
                    {offer.showPhone && offer.sellerPhone && (
                      <div>
                        <dt>Phone</dt>
                        <dd><a href={`tel:${offer.sellerPhone}`}>{offer.sellerPhone}</a></dd>
                      </div>
                    )}
                    {offer.sellerEmail && (
                      <div>
                        <dt>Email</dt>
                        <dd><a href={`mailto:${offer.sellerEmail}`}>{offer.sellerEmail}</a></dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              <div className="am-detail-side-actions">
                <button
                  type="button"
                  className="am-detail-side-btn"
                  onClick={handleToggleFavorite}
                  aria-pressed={carId != null && isFavorite(carId)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill={carId != null && isFavorite(carId) ? 'currentColor' : 'none'}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                  </svg>
                  {carId != null && isFavorite(carId) ? 'Saved' : 'Save'}
                </button>
              </div>
            </article>
          </aside>
        </div>
      </main>
      <AmFooter />
    </div>
  )
}

export default CarDetails
