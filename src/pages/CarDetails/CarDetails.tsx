import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import './CarDetails.css'
import s1 from './sclassImages/s1.jpg'
import s2 from './sclassImages/s2.jpg'
import s3 from './sclassImages/s3.jpg'
import s4 from './sclassImages/s4.jpg'
import s5 from './sclassImages/s5.jpg'

const carData = {
  title: '2024 Mercedes-Maybach S580',
  price: '$112,000',
  
  images: [
    s1,
    s2,
    s3,
    s4,
    s5,
  ],
  description:
    'Its a maybach, what else do you want',
  specs: [
    { label: 'Mileage', value: '1,200 mi', icon: 'mileage' },
    { label: 'Year', value: '2024', icon: 'year' },
    { label: 'Transmission', value: 'Automatic', icon: 'transmission' },
    { label: 'Fuel Type', value: 'Gasoline', icon: 'fuel' },
    { label: 'Color', value: 'Black/White', icon: 'color' },
  ],
  features: [
    'Massage Seats',
    'Burmester Sound',
    'Air Suspension',
    'Executive Package',
    'Night Vision',
  ],
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
