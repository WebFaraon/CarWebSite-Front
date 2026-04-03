import { useNavigate } from 'react-router-dom'
import CarCard from './CarCard'
import type { FeaturedCar } from './types'

interface FeaturedCarsSectionProps {
  cars: FeaturedCar[]
  favoriteIds: number[]
  onToggleFavorite: (carId: number) => void
}

function FeaturedCarsSection({
  cars,
  favoriteIds,
  onToggleFavorite,
}: FeaturedCarsSectionProps) {
  const navigate = useNavigate()

  return (
    <section id="offers" className="featured-section section-spacer">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>Popular Offers</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/offers')}
          >
            View All Offers
            <svg viewBox="0 0 20 20" aria-hidden="true" className="btn-icon" style={{ width: 15, height: 15 }}>
              <path d="M7 10h6M10 7l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="cars-grid">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFavorite={favoriteIds.includes(car.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCarsSection
