import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AmCarCard from '../../components/home/am/AmCarCard'
import AmFooter from '../../components/home/am/AmFooter'
import AmHero from '../../components/home/am/AmHero'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmSearch, {
  countFilters,
  type Filters,
} from '../../components/home/am/AmSearch'
import { ArrowRightIcon } from '../../components/home/am/AmIcons'
import { featuredCars } from '../../data/featuredCars'
import { useTheme } from '../../context/ThemeContext'
import { getFavoriteIds, setFavoriteIds as storeFavoriteIds } from '../../utils/favoritesStorage'
import type { FeaturedCar } from '../../components/home/types'
import './Home.css'

function parseNumber(value: string | undefined): number | null {
  if (!value) return null
  const digits = value.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

function matches(car: FeaturedCar, query: string, filters: Filters): boolean {
  if (query) {
    const blob = [
      car.name,
      car.model,
      String(car.year),
      car.fuel,
      car.transmission,
      car.body,
      car.engine,
    ]
      .join(' ')
      .toLowerCase()
    if (!blob.includes(query)) return false
  }

  if (filters.brand) {
    const brand = filters.brand.toLowerCase()
    const carBrand = car.name.toLowerCase()
    if (!carBrand.includes(brand) && !brand.includes(carBrand)) return false
  }
  if (filters.model && !car.model.toLowerCase().includes(filters.model.toLowerCase())) {
    return false
  }
  if (filters.body && car.body.toLowerCase() !== filters.body.toLowerCase()) return false
  if (filters.fuel && car.fuel.toLowerCase() !== filters.fuel.toLowerCase()) return false
  if (
    filters.transmission &&
    car.transmission.toLowerCase() !== filters.transmission.toLowerCase()
  ) {
    return false
  }

  const yearFrom = filters.yearFrom ? Number(filters.yearFrom) : null
  const yearTo = filters.yearTo ? Number(filters.yearTo) : null
  if (yearFrom != null && car.year < yearFrom) return false
  if (yearTo != null && car.year > yearTo) return false

  const carMileage = parseNumber(car.mileage)
  const kmMin = parseNumber(filters.kmMin)
  const kmMax = parseNumber(filters.kmMax)
  if (kmMin != null && (carMileage == null || carMileage < kmMin)) return false
  if (kmMax != null && (carMileage == null || carMileage > kmMax)) return false

  const carPrice = parseNumber(car.price)
  const priceMin = parseNumber(filters.priceMin)
  const priceMax = parseNumber(filters.priceMax)
  if (priceMin != null && (carPrice == null || carPrice < priceMin)) return false
  if (priceMax != null && (carPrice == null || carPrice > priceMax)) return false

  return true
}

function Home() {
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const [favIds, setFavIds] = useState<number[]>(() => getFavoriteIds())
  const resultsRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    storeFavoriteIds(favIds)
  }, [favIds])

  const toggleFav = (id: number) => {
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const filterCount = useMemo(() => countFilters(filters), [filters])
  const showResults = submittedQuery !== '' || filterCount > 0

  const results = useMemo(() => {
    if (!showResults) return []
    const q = submittedQuery.trim().toLowerCase()
    return featuredCars.filter((c) => matches(c, q, filters))
  }, [submittedQuery, filters, showResults])

  const handleSubmit = () => {
    setSubmittedQuery(query.trim())
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const handleClearAll = () => {
    setQuery('')
    setSubmittedQuery('')
    setFilters({})
  }

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <section className="am-shell am-hero">
        <AmHero />
        <AmSearch
          query={query}
          onQueryChange={setQuery}
          filters={filters}
          onFiltersChange={setFilters}
          onSubmit={handleSubmit}
          onClearAll={handleClearAll}
          hasActiveSearch={showResults}
        />
      </section>

      {showResults && (
        <section className="am-shell am-section" ref={resultsRef}>
          <div className="am-section-head">
            <div>
              <h2 className="am-section-title">Search results</h2>
              <div className="am-section-sub">
                {results.length} match{results.length === 1 ? '' : 'es'}
                {submittedQuery && (
                  <>
                    {' '}for “
                    <b className="am-section-sub-em">{submittedQuery}</b>”
                  </>
                )}
                {filterCount > 0 && (
                  <>
                    {' '}· {filterCount} filter{filterCount === 1 ? '' : 's'} active
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              className="am-btn am-btn--ghost"
              onClick={handleClearAll}
            >
              Clear
            </button>
          </div>
          {results.length === 0 ? (
            <div className="am-empty">No results found for your search.</div>
          ) : (
            <div className="am-grid">
              {results.map((c) => (
                <AmCarCard
                  key={`r-${c.id}`}
                  car={c}
                  isFav={favIds.includes(c.id)}
                  onToggleFav={toggleFav}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="am-shell am-section">
        <div className="am-section-head">
          <div>
            <h2 className="am-section-title">Popular offers</h2>
            <div className="am-section-sub">
              Hand-picked listings updated this week
            </div>
          </div>
          <Link to="/offers" className="am-text-link">
            View all offers →
          </Link>
        </div>
        <div className="am-grid">
          {featuredCars.map((c) => (
            <AmCarCard
              key={c.id}
              car={c}
              isFav={favIds.includes(c.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>
        <div className="am-section-cta">
          <Link to="/offers" className="am-btn am-btn--primary am-btn--lg">
            View more <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      <AmFooter />
    </div>
  )
}

export default Home
