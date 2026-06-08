import { useNavigate } from 'react-router-dom'
import type { FeaturedCar } from '../types'
import { HeartIcon } from './AmIcons'

interface AmCarCardProps {
  car: FeaturedCar
  isFav: boolean
  onToggleFav: (id: number) => void
}

function AmCarCard({ car, isFav, onToggleFav }: AmCarCardProps) {
  const navigate = useNavigate()

  const goToDetails = () => {
    navigate('/car-details', { state: { featuredCar: car } })
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToDetails()
    }
  }

  return (
    <article
      className="am-card"
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={handleKey}
      aria-label={`${car.name} ${car.model} ${car.year}, ${car.price}`}
    >
      <div className="am-card-media">
        <img
          src={car.image}
          alt={`${car.name} ${car.model}`}
          className="am-card-img"
          loading="lazy"
        />
        <button
          type="button"
          className="am-card-fav"
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFav(car.id)
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <HeartIcon size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="am-card-body">
        <div className="am-card-row">
          <div className="am-card-title">
            {car.name} {car.model}{' '}
            <span className="am-card-year">{car.year}</span>
          </div>
          <div className="am-card-price">{car.price}</div>
        </div>
        <div className="am-card-meta">
          {car.mileage} · {car.engine} · {car.fuel} · {car.transmission}
        </div>
      </div>
    </article>
  )
}

export default AmCarCard
