import { useNavigate } from 'react-router-dom'
import type { FeaturedCar } from './types'

interface CarCardProps {
  car: FeaturedCar
  isFavorite: boolean
  onToggleFavorite: (carId: number) => void
}

function CarCard({ car, isFavorite, onToggleFavorite }: CarCardProps) {
  const navigate = useNavigate()
  const goToDetails = () => {
    navigate('/car-details', {
      state: car.offer ? { offer: car.offer } : { featuredCar: car },
    })
  }

  return (
    <article
      className="car-card car-card--clickable"
      onClick={goToDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          goToDetails()
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Open details for ${car.name} ${car.model}`}
    >
      <div className="car-card__media">
        <img
          src={car.image}
          alt={`${car.name} ${car.model}`}
          className="car-card__img"
          loading="lazy"
        />

        <button
          className={`favorite-btn ${isFavorite ? 'is-active' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavorite(car.id)
          }}
          onKeyDown={(event) => {
            event.stopPropagation()
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
          </svg>
        </button>
      </div>

      <div className="car-card__body">
        <div className="car-card__row">
          <h3 className="car-card__title">
            {car.name} {car.model}{' '}
            <span className="car-card__year">{car.year}</span>
          </h3>
          <div className="car-card__price">{car.price}</div>
        </div>

        <p className="car-card__meta">
          {car.mileage}, {car.engine}, {car.fuel}, {car.transmission}
        </p>
      </div>
    </article>
  )
}

export default CarCard
