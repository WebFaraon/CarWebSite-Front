import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AmFooter from '../../components/home/am/AmFooter'
import AmNavbar from '../../components/home/am/AmNavbar'
import type { FeaturedCar } from '../../components/home/types'
import { useTheme } from '../../context/ThemeContext'
import type { Offer } from '../Catalog/catalog.types'
import '../Home/Home.css'
import './CarDetails.css'

type CarDetailsState = {
  offer?: Offer
  featuredCar?: FeaturedCar
}

function buildCarDataFromOffer(offer: Offer) {
  const price = `${new Intl.NumberFormat('de-DE').format(offer.price)} ${offer.currency}`
  const transmission =
    offer.transmission === 'automatic'
      ? 'Automatic'
      : offer.transmission === 'manual'
        ? 'Manual'
        : 'N/A'

  return {
    title: offer.title,
    price,
    images: offer.images.length > 0 ? offer.images : [offer.imageUrl ?? '/template_images/audi-sq7.png'],
    description: offer.description,
    specs: [
      { label: 'Mileage', value: `${new Intl.NumberFormat('de-DE').format(offer.km)} km`, icon: 'mileage' },
      { label: 'Year', value: `${offer.year}`, icon: 'year' },
      { label: 'Transmission', value: transmission, icon: 'transmission' },
      { label: 'Fuel Type', value: offer.fuel.charAt(0).toUpperCase() + offer.fuel.slice(1), icon: 'fuel' },
      { label: 'Location', value: offer.location, icon: 'color' },
    ],
    features: [
      offer.isNew ? 'New offer highlight' : 'Verified listing',
      `${offer.powerHp ?? 'N/A'} hp output`,
      `${transmission} transmission`,
      `Available in ${offer.location}`,
      `${offer.discountPct ? `${offer.discountPct}% promotional discount` : 'Standard market pricing'}`,
    ],
  }
}

function buildCarDataFromFeaturedCar(featuredCar: FeaturedCar) {
  return {
    title: `${featuredCar.name} ${featuredCar.model}`,
    price: featuredCar.price,
    images: [featuredCar.image, featuredCar.image, featuredCar.image],
    description:
      featuredCar.description ??
      `${featuredCar.name} ${featuredCar.model} from ${featuredCar.year} with ${featuredCar.mileage}, ${featuredCar.transmission} transmission and ${featuredCar.fuel} fuel type.`,
    specs: [
      { label: 'Mileage', value: featuredCar.mileage, icon: 'mileage' },
      { label: 'Year', value: `${featuredCar.year}`, icon: 'year' },
      { label: 'Transmission', value: featuredCar.transmission, icon: 'transmission' },
      { label: 'Fuel Type', value: featuredCar.fuel, icon: 'fuel' },
      { label: 'Body', value: featuredCar.body, icon: 'color' },
    ],
    features: featuredCar.features,
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

  if (icon === 'color') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3c3.5 0 7 2.9 7 7.2A6.8 6.8 0 0 1 12 17a2.5 2.5 0 1 0 0 5H9.8A5.8 5.8 0 0 1 4 16.2C4 9.8 8.5 3 12 3Z" />
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
  const totalImages = carData?.images.length ?? 0

  const showNextImage = () => {
    if (totalImages === 0) return
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % totalImages)
  }

  const showPreviousImage = () => {
    if (totalImages === 0) return
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? totalImages - 1 : currentIndex - 1
    )
  }

  if (!carData) {
    return (
      <div className="am" data-theme={theme}>
        <AmNavbar />
        <main className="am-shell am-detail-page">
          <section className="am-detail-empty">
            <article className="am-detail-panel">
              <div className="am-detail-copy">
                <div className="am-eyebrow">Car details</div>
                <h1>Listing not selected</h1>
                <p>Open a car from the live catalog to view its details.</p>
              </div>
              <div className="am-detail-actions">
                <button
                  type="button"
                  className="am-btn am-btn--primary am-btn--lg"
                  onClick={() => navigate('/offers')}
                >
                  Browse offers
                </button>
              </div>
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
        <div className="am-detail-kicker">
          <button
            type="button"
            className="am-detail-back"
            onClick={() => navigate(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
            Back
          </button>
          <span className="am-eyebrow">Car details</span>
        </div>

        <section className="am-detail-layout">
          <article className="am-detail-media">
            <div className="am-detail-image-wrap">
              <img
                src={carData.images[activeImageIndex]}
                alt={`${carData.title} view ${activeImageIndex + 1}`}
                className="am-detail-main-image"
              />
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

          <article className="am-detail-panel">
            <div className="am-detail-head">
              <div>
                <h1>{carData.title}</h1>
                <p className="am-detail-price">{carData.price}</p>
              </div>
            </div>

            <div className="am-detail-spec-grid">
              {carData.specs.map((spec) => (
                <div key={spec.label} className="am-detail-spec">
                  <span className="am-detail-spec-icon">
                    <SpecIcon icon={spec.icon} />
                  </span>
                  <div>
                    <p>{spec.label}</p>
                    <strong>{spec.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="am-detail-divider" />

            <section className="am-detail-copy">
              <h2>Description</h2>
              <p>{carData.description || 'No description was provided for this listing.'}</p>
            </section>

            <section className="am-detail-copy">
              <h2>Features</h2>
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
            </section>

            <div className="am-detail-actions">
              <button
                type="button"
                className="am-btn am-btn--primary am-btn--lg"
                onClick={() => navigate('/contact-us')}
              >
                Contact us
              </button>
            </div>
          </article>
        </section>
      </main>
      <AmFooter />
    </div>
  )
}

export default CarDetails
