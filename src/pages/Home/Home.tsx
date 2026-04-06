import { useEffect, useMemo, useState } from 'react'
import CarCard from '../../components/home/CarCard.tsx'
import FeaturedCarsSection from '../../components/home/FeaturedCarsSection.tsx'
import HeroSection from '../../components/home/HeroSection.tsx'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import type {
  SocialItem,
} from '../../components/home/types.ts'
import SmartSearchBar from '../../components/search/SmartSearchBar.tsx'
import type { FiltersState, SearchPayload } from '../../components/search/SmartSearchBar.tsx'
import { featuredCars } from '../../data/featuredCars.ts'
import { getFavoriteIds, setFavoriteIds as storeFavoriteIds } from '../../utils/favoritesStorage.ts'
import './Home.css'


const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

const brands = ['BMW', 'Audi', 'Tesla', 'Toyota', 'Mercedes-Benz', 'Honda', 'Volkswagen', 'Ford']

function Home() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => getFavoriteIds())
  const [hasSearched, setHasSearched] = useState(false)
  const [submittedSearch, setSubmittedSearch] = useState<SearchPayload>({
    query: '',
    filters: {
      brand: '',
      model: '',
      bodyType: '',
      yearFrom: '',
      yearTo: '',
      mileageMin: '',
      mileageMax: '',
      engineCapacity: '',
      fuelType: '',
      transmission: '',
      driveType: '',
      priceMin: '',
      priceMax: '',
      condition: '',
      color: '',
      doors: '',
    },
  })

  const toggleFavorite = (carId: number) => {
    setFavoriteIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId)
      return [...prev, carId]
    })
  }

  useEffect(() => {
    storeFavoriteIds(favoriteIds)
  }, [favoriteIds])

  const normalizedQuery = useMemo(
    () => submittedSearch.query.trim().toLowerCase().replace(/\s+/g, ' '),
    [submittedSearch.query],
  )

  const searchResults = useMemo(() => {
    const filters: FiltersState = submittedSearch.filters
    const parseNumber = (value: string) => {
      const digits = value.replace(/[^\d]/g, '')
      return digits ? Number(digits) : null
    }

    const yearFrom = filters.yearFrom ? Number(filters.yearFrom) : null
    const yearTo = filters.yearTo ? Number(filters.yearTo) : null
    const mileageMin = parseNumber(filters.mileageMin)
    const mileageMax = parseNumber(filters.mileageMax)
    const priceMin = parseNumber(filters.priceMin)
    const priceMax = parseNumber(filters.priceMax)

    return featuredCars.filter((car) => {
      const searchableText = [
        `${car.name} ${car.model}`, car.name, car.model,
        car.fuel, car.body, car.transmission, String(car.year),
      ].join(' ').toLowerCase().replace(/\s+/g, ' ')

      const carMileage = parseNumber(car.mileage)
      const carPrice = parseNumber(car.price)

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (!filters.brand || car.name.toLowerCase() === filters.brand.toLowerCase()) &&
        (!filters.model || car.model.toLowerCase() === filters.model.toLowerCase()) &&
        (!filters.bodyType || car.body.toLowerCase() === filters.bodyType.toLowerCase()) &&
        (!filters.fuelType || car.fuel.toLowerCase() === filters.fuelType.toLowerCase()) &&
        (!filters.transmission || car.transmission.toLowerCase() === filters.transmission.toLowerCase()) &&
        (yearFrom == null || car.year >= yearFrom) &&
        (yearTo == null || car.year <= yearTo) &&
        (mileageMin == null || (carMileage != null && carMileage >= mileageMin)) &&
        (mileageMax == null || (carMileage != null && carMileage <= mileageMax)) &&
        (priceMin == null || (carPrice != null && carPrice >= priceMin)) &&
        (priceMax == null || (carPrice != null && carPrice <= priceMax))
      )
    })
  }, [normalizedQuery, submittedSearch.filters])

  const handleSearchAction = (payload: SearchPayload) => {
    setHasSearched(true)
    setSubmittedSearch({ query: payload.query.trim(), filters: payload.filters })
    window.setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <>
      <Navbar />
      <main className="home-page">

        {/* ── Hero ── */}
        <HeroSection />

        {/* ── Brands bar ── */}
        <section className="brands-section" aria-label="Featured brands">
          <div className="container brands-list">
            {brands.map((b) => (
              <span key={b} className="brand-pill">{b}</span>
            ))}
          </div>
        </section>

        {/* ── Search Bar ── */}
        <div className="hero-search-wrap">
          <div className="container">
            <SmartSearchBar onSearchAction={handleSearchAction} />
          </div>
        </div>

        {/* ── Search results ── */}
        {hasSearched && (
          <section
            id="search-results"
            className="search-results-section section-spacer"
            aria-live="polite"
          >
            <div className="container">
              <div className="section-header">
                <h2>Search Results</h2>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setHasSearched(false)}
                >
                  Clear
                </button>
              </div>
              {searchResults.length === 0 ? (
                <div className="search-results-empty">No results found for your search.</div>
              ) : (
                <div className="cars-grid">
                  {searchResults.map((car) => (
                    <CarCard
                      key={`search-${car.id}`}
                      car={car}
                      isFavorite={favoriteIds.includes(car.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Featured Cars ── */}
        <FeaturedCarsSection
          cars={featuredCars}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />

      </main>

      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Home
