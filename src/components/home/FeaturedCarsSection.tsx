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
  return (
    <section id="offers" className="featured-section section-spacer">
      <div className="container">
        <div className="section-header">
          <h2>Featured Cars</h2>
          <a href="#" className="text-link">
            View all listings
          </a>
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
