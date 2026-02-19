import type { FeaturedCar } from './types'

interface CarCardProps {
  car: FeaturedCar
}

function CarCard({ car }: CarCardProps) {
  return (
    <article className="car-card">
      <button className="favorite-btn" aria-label="Add to favorites" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
        </svg>
      </button>

      <img src={car.image} alt={`${car.name} ${car.model}`} />

      <div className="car-card-content">
        <h3>
          {car.name} {car.model}
        </h3>
        <p>
          {car.year} • {car.mileage}
        </p>
        <strong>{car.price}</strong>
      </div>
    </article>
  )
}

export default CarCard
