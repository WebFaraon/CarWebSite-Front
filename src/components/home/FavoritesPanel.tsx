import CarCard from './CarCard'
import type { FeaturedCar } from './types'

interface FavoritesPanelProps {
  cars: FeaturedCar[]
  favoriteIds: number[]
  isOpen: boolean
  onClose: () => void
  onToggleFavorite: (carId: number) => void
}

function FavoritesPanel({
  cars,
  favoriteIds,
  isOpen,
  onClose,
  onToggleFavorite,
}: FavoritesPanelProps) {
  return (
    <div className={`favorites-panel-overlay ${isOpen ? 'is-open' : ''}`}>
      <div
        className="favorites-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Favorites"
        aria-hidden={!isOpen}
      >
        <header className="favorites-panel-header">
          <div>
            <h2>Favorites</h2>
            <p>{cars.length} saved</p>
          </div>
          <button className="favorites-close" type="button" onClick={onClose} aria-label="Close favorites">
            <span />
            <span />
          </button>
        </header>

        {cars.length === 0 ? (
          <div className="favorites-empty">
            <h3>No favorites yet</h3>
            <p>Tap the heart on a card to build your shortlist.</p>
          </div>
        ) : (
          <div className="favorites-panel-list">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isFavorite={favoriteIds.includes(car.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <button
        className="favorites-panel-backdrop"
        type="button"
        aria-label="Close favorites"
        onClick={onClose}
      />
    </div>
  )
}

export default FavoritesPanel
