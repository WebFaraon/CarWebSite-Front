import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar.tsx'
import type { Offer } from '../Catalog/catalog.types'
import './CarDetails.css'

const fallbackCarData = {
  title: '2024 Mercedes-Benz S-Class',
  price: '$112,000',
  
  images: [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1549925862-99039ec8e7f4?auto=format&fit=crop&w=1400&q=80',
  ],
  description:
    'The pinnacle of luxury sedans. This Mercedes-Benz S-Class offers unmatched comfort and advanced technology.',
  specs: [
    { label: 'Mileage', value: '1,200 mi', icon: 'mileage' },
    { label: 'Year', value: '2024', icon: 'year' },
    { label: 'Transmission', value: 'Automatic', icon: 'transmission' },
    { label: 'Fuel Type', value: 'Gasoline', icon: 'fuel' },
    { label: 'Color', value: 'White', icon: 'color' },
  ],
  features: [
    'Massage Seats',
    'Burmester Sound',
    'Air Suspension',
    'Executive Package',
    'Night Vision',
  ],
}

type CarDetailsState = {
  offer?: Offer
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
    images: [offer.imageUrl, offer.imageUrl, offer.imageUrl, offer.imageUrl],
    description: `${offer.title} is available now in ${offer.location}. This listing includes ${offer.fuel} propulsion, ${new Intl.NumberFormat('de-DE').format(offer.km)} km mileage, and a ${offer.year} registration year.`,
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
  const location = useLocation()
  const state = location.state as CarDetailsState | null
  const carData = useMemo(
    () => (state?.offer ? buildCarDataFromOffer(state.offer) : fallbackCarData),
    [state],
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const totalImages = carData.images.length

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % totalImages)
  }

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? totalImages - 1 : currentIndex - 1
    )
  }

  return (
    <>
      <Navbar />
      <main className="car-details-page">
        <section className="car-details-shell">
          <article className="car-media-card">
            <div className="main-image-wrap">
              <img
                src={carData.images[activeImageIndex]}
                alt={`${carData.title} view ${activeImageIndex + 1}`}
                className="car-main-image"
              />
              <button
                type="button"
                className="image-nav-btn image-nav-prev"
                onClick={showPreviousImage}
                aria-label="Show previous photo"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m15 5-7 7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                className="image-nav-btn image-nav-next"
                onClick={showNextImage}
                aria-label="Show next photo"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="thumb-strip" aria-label="Car photo gallery">
              {carData.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`thumb-btn ${index === activeImageIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                >
                  <img src={image} alt={`${carData.title} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </article>

          <article className="car-info-card">
            <div className="car-info-top">
              <div>
                <h1>{carData.title}</h1>
                <p className="car-price">{carData.price}</p>
              </div>
              
            </div>

            <div className="spec-grid">
              {carData.specs.map((spec) => (
                <div key={spec.label} className="spec-item">
                  <span className="spec-icon">
                    <SpecIcon icon={spec.icon} />
                  </span>
                  <div>
                    <p>{spec.label}</p>
                    <strong>{spec.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <section className="info-block">
              <h2>Description</h2>
              <p>{carData.description}</p>
            </section>

            <section className="info-block">
              <h2>Features</h2>
              <ul className="feature-grid">
                {carData.features.map((feature) => (
                  <li key={feature}>
                    <span className="check-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <div className="actions-row">
              <button type="button" className="primary-action">
                Contact Us
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  )
}

export default CarDetails
