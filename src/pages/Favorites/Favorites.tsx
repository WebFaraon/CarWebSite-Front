import { useEffect, useMemo, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import SiteFooter from '../../components/home/SiteFooter'
import type { FeaturedCar, SocialItem } from '../../components/home/types'
import { featuredCars } from '../../data/featuredCars'
import { getFavoriteIds, setFavoriteIds } from '../../utils/favoritesStorage'
import './Favorites.css'

const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

const comparisonRows: Array<{
  key: string
  label: string
  getValue: (car: FeaturedCar) => string
}> = [
  { key: 'price', label: 'Pret', getValue: (car) => car.price },
  { key: 'year', label: 'An', getValue: (car) => `${car.year}` },
  { key: 'mileage', label: 'Rulaj', getValue: (car) => car.mileage },
  { key: 'engine', label: 'Motorizare', getValue: (car) => car.engine },
  { key: 'consumption', label: 'Consum', getValue: (car) => car.consumption },
  {
    key: 'features',
    label: 'Dotari cheie',
    getValue: (car) => car.features.join(', '),
  },
]

function Favorites() {
  const [favoriteIds, setFavoriteIdsState] = useState<number[]>([])
  const [compareIds, setCompareIds] = useState<number[]>([])

  useEffect(() => {
    setFavoriteIdsState(getFavoriteIds())
  }, [])

  useEffect(() => {
    setFavoriteIds(favoriteIds)
  }, [favoriteIds])

  useEffect(() => {
    const handleStorage = () => {
      setFavoriteIdsState(getFavoriteIds())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const favoriteCars = useMemo(
    () => featuredCars.filter((car) => favoriteIds.includes(car.id)),
    [favoriteIds],
  )

  useEffect(() => {
    setCompareIds((prev) => prev.filter((id) => favoriteIds.includes(id)))
  }, [favoriteIds])

  const toggleFavorite = (carId: number) => {
    setFavoriteIdsState((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId)
      }
      return [...prev, carId]
    })
  }

  const toggleCompare = (carId: number) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId)
      }
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, carId]
    })
  }

  const compareCars = useMemo(
    () => favoriteCars.filter((car) => compareIds.includes(car.id)),
    [favoriteCars, compareIds],
  )

  return (
    <>
      <Navbar />
      <main className="favorites-page">
        <section className="favorites-header">
          <div className="container">
            <div className="favorites-title">
              <span className="favorites-eyebrow">AutoMarket / Shortlist</span>
              <h1>Favorite</h1>
              <p>Aici compari masinile tale salvate, fara distrageri.</p>
            </div>
            <div className="favorites-meta">
              <span>{favoriteCars.length} masini salvate</span>
              <span>{compareIds.length}/4 selectate pentru comparatie</span>
            </div>
          </div>
        </section>

        <section className="favorites-section">
          <div className="container">
            {favoriteCars.length === 0 ? (
              <div className="favorites-empty">
                <div>
                  <h2>Nu ai masini salvate</h2>
                  <p>Adauga favorite si revino pentru comparatie rapida.</p>
                  <a className="primary-btn" href="/">
                    Vezi oferte
                  </a>
                </div>
              </div>
            ) : (
              <div className="favorites-grid">
                {favoriteCars.map((car) => {
                  const isSelected = compareIds.includes(car.id)
                  const compareDisabled = !isSelected && compareIds.length >= 4

                  return (
                    <article key={car.id} className="favorite-card">
                      <div className="favorite-card-media">
                        <img src={car.image} alt={`${car.name} ${car.model}`} />
                      </div>
                      <div className="favorite-card-body">
                        <div className="favorite-card-title">
                          <h3>
                            {car.name} {car.model}
                          </h3>
                          <span>{car.year}</span>
                        </div>
                        <div className="favorite-card-main">
                          <strong>{car.price}</strong>
                          <span>{car.mileage}</span>
                        </div>
                        <div className="favorite-card-specs">
                          <span>{car.fuel}</span>
                          <span>{car.transmission}</span>
                          <span>{car.body}</span>
                        </div>
                        <div className="favorite-card-actions">
                          <button
                            type="button"
                            className={`ghost-btn ${isSelected ? 'is-active' : ''}`}
                            onClick={() => toggleCompare(car.id)}
                            disabled={compareDisabled}
                          >
                            {isSelected ? 'Selectat' : 'Compara'}
                          </button>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => toggleFavorite(car.id)}
                          >
                            Elimina
                          </button>
                          <button type="button" className="primary-btn">
                            Vezi detalii
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {compareCars.length >= 2 ? (
          <section className="compare-section">
            <div className="container">
              <header className="compare-header">
                <div>
                  <h2>Comparatie</h2>
                  <p>Selecteaza intre 2 si 4 masini pentru comparatie directa.</p>
                </div>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => setCompareIds([])}
                >
                  Reseteaza selectia
                </button>
              </header>

              <div className="compare-grid">
                <div className="compare-row compare-row-head">
                  <div className="compare-cell compare-label">Model</div>
                  {compareCars.map((car) => (
                    <div key={car.id} className="compare-cell compare-value">
                      <strong>
                        {car.name} {car.model}
                      </strong>
                      <span>{car.year}</span>
                    </div>
                  ))}
                </div>

                {comparisonRows.map((row) => {
                  const values = compareCars.map((car) => row.getValue(car))
                  const allSame = values.every((value) => value === values[0])

                  return (
                    <div
                      key={row.key}
                      className={`compare-row ${allSame ? '' : 'is-different'}`}
                    >
                      <div className="compare-cell compare-label">{row.label}</div>
                      {values.map((value, index) => (
                        <div key={`${row.key}-${index}`} className="compare-cell compare-value">
                          {value}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Favorites
