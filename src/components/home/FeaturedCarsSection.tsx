import CarCard from './CarCard'
import type { FeaturedCar } from './types'

interface FeaturedCarsSectionProps {
  cars: FeaturedCar[]
}

function FeaturedCarsSection({ cars }: FeaturedCarsSectionProps) {
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
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCarsSection
