import { useEffect, useMemo, useState } from 'react'
import CarCard from '../../components/home/CarCard.tsx'
import FeaturedCarsSection from '../../components/home/FeaturedCarsSection.tsx'
import HeroSection from '../../components/home/HeroSection.tsx'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection.tsx'
import type {
  FeatureItem,
  SocialItem,
} from '../../components/home/types.ts'
import type { FiltersState, SearchPayload } from '../../components/search/SmartSearchBar.tsx'
import { featuredCars } from '../../data/featuredCars.ts'
import { getFavoriteIds, setFavoriteIds as storeFavoriteIds } from '../../utils/favoritesStorage.ts'
import './Home.css'

const features: FeatureItem[] = [
  {
    id: 1,
    icon: 'verified',
    title: 'Verified Sellers',
    description:
      'Every seller is checked to keep listings authentic and dependable.',
  },
  {
    id: 2,
    icon: 'secure',
    title: 'Secure Transactions',
    description:
      'Protected payment and documentation flows keep each step transparent.',
  },
  {
    id: 3,
    icon: 'selection',
    title: 'Large Selection',
    description:
      'Thousands of vehicles across top brands, body styles, and budgets.',
  },
  {
    id: 4,
    icon: 'support',
    title: 'Fast Support',
    description:
      'Our team is available to help buyers and sellers close deals quickly.',
  },
]

const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

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
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId)
      }
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
        `${car.name} ${car.model}`,
        car.name,
        car.model,
        car.fuel,
        car.body,
        car.transmission,
        String(car.year),
      ]
        .join(' ')
        .toLowerCase()
        .replace(/\s+/g, ' ')

      const carMileage = parseNumber(car.mileage)
      const carPrice = parseNumber(car.price)

      const queryMatch = !normalizedQuery || searchableText.includes(normalizedQuery)
      const brandMatch = !filters.brand || car.name.toLowerCase() === filters.brand.toLowerCase()
      const modelMatch = !filters.model || car.model.toLowerCase() === filters.model.toLowerCase()
      const bodyMatch = !filters.bodyType || car.body.toLowerCase() === filters.bodyType.toLowerCase()
      const fuelMatch = !filters.fuelType || car.fuel.toLowerCase() === filters.fuelType.toLowerCase()
      const transmissionMatch =
        !filters.transmission || car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      const yearFromMatch = yearFrom == null || car.year >= yearFrom
      const yearToMatch = yearTo == null || car.year <= yearTo
      const mileageMinMatch = mileageMin == null || (carMileage != null && carMileage >= mileageMin)
      const mileageMaxMatch = mileageMax == null || (carMileage != null && carMileage <= mileageMax)
      const priceMinMatch = priceMin == null || (carPrice != null && carPrice >= priceMin)
      const priceMaxMatch = priceMax == null || (carPrice != null && carPrice <= priceMax)

      return (
        queryMatch &&
        brandMatch &&
        modelMatch &&
        bodyMatch &&
        fuelMatch &&
        transmissionMatch &&
        yearFromMatch &&
        yearToMatch &&
        mileageMinMatch &&
        mileageMaxMatch &&
        priceMinMatch &&
        priceMaxMatch
      )
    })
  }, [normalizedQuery, submittedSearch.filters])

  const handleSearchAction = (payload: SearchPayload) => {
    setHasSearched(true)
    setSubmittedSearch({
      query: payload.query.trim(),
      filters: payload.filters,
    })

    window.setTimeout(() => {
      const resultsSection = document.getElementById('search-results')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 0)
  }

  return (
    <>
      <Navbar />
      <main className="home-page">
        <HeroSection onSearchAction={handleSearchAction} />

        {hasSearched ? (
          <section id="search-results" className="search-results-section section-spacer" aria-live="polite">
            <div className="container">
              <div className="section-header">
                <h2>Search Results</h2>
              </div>

              {searchResults.length === 0 ? (
                <div className="search-results-empty">No results found.</div>
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
        ) : null}

        <FeaturedCarsSection
          cars={featuredCars}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <WhyChooseUsSection features={features} />
      </main>

      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Home
