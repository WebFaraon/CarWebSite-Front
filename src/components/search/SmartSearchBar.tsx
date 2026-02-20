import { useEffect, useMemo, useRef, useState } from 'react'
import './SmartSearchBar.css'

type FiltersState = {
  brand: string
  model: string
  bodyType: string
  yearFrom: string
  yearTo: string
  mileageMin: string
  mileageMax: string
  engineCapacity: string
  fuelType: string
  transmission: string
  driveType: string
  priceMin: string
  priceMax: string
  condition: string
  color: string
  doors: string
}

const brandOptions = [
  'Audi',
  'BMW',
  'Honda',
  'Mercedes-Benz',
  'Tesla',
  'Toyota',
]

const modelOptionsByBrand: Record<string, string[]> = {
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  Honda: ['Civic', 'Accord', 'CR-V'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Tesla: ['Model 3', 'Model Y', 'Model S'],
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander'],
}

const bodyTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Wagon', 'Pickup', 'Van']
const engineCapacities = ['1.0–1.4', '1.5–1.9', '2.0–2.4', '2.5+']
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Gas/LPG']
const transmissions = ['Manual', 'Automatic']
const driveTypes = ['FWD', 'RWD', 'AWD']
const conditions = ['New', 'Used']
const colors = ['Black', 'White', 'Silver', 'Blue', 'Gray', 'Red']
const doorCounts = ['2', '4', '5']

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: currentYear - 2000 + 1 }, (_, index) =>
  String(currentYear - index),
)

const defaultFilters: FiltersState = {
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
}

function SmartSearchBar() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FiltersState>(defaultFilters)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const modelOptions = useMemo(
    () => modelOptionsByBrand[filters.brand] ?? [],
    [filters.brand],
  )

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.brand) count += 1
    if (filters.model) count += 1
    if (filters.bodyType) count += 1
    if (filters.yearFrom || filters.yearTo) count += 1
    if (filters.mileageMin || filters.mileageMax) count += 1
    if (filters.engineCapacity) count += 1
    if (filters.fuelType) count += 1
    if (filters.transmission) count += 1
    if (filters.driveType) count += 1
    if (filters.priceMin || filters.priceMax) count += 1
    if (filters.condition) count += 1
    if (filters.color) count += 1
    if (filters.doors) count += 1
    return count
  }, [filters])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isOpen || !containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.toggle('smart-search-open', isOpen)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('smart-search-open')
    }
  }, [isOpen])

  const onSearch = (payload: { query: string; filters: FiltersState }) => {
    console.log('SmartSearchBar search', payload)
  }

  const handleApply = () => {
    onSearch({ query, filters })
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
  }

  const handleClear = () => {
    setQuery('')
    setFilters(defaultFilters)
  }

  return (
    <div className="smart-search" ref={containerRef}>
      <form
        className="smart-search-bar"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch({ query, filters })
        }}
      >
        <div className="smart-search-input">
          <span className="smart-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path
                d="M10.5 3a7.5 7.5 0 1 0 4.7 13.3l4 4a1 1 0 0 0 1.4-1.4l-4-4A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"
                fill="currentColor"
              />
            </svg>
          </span>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cars (e.g., Audi A6, SUV, diesel, 2018...)"
            aria-label="Search cars"
          />

          {activeFiltersCount > 0 && (
            <button
              className="smart-search-clear"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          )}

          <button
            className="smart-search-filters"
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="smart-search-panel"
          >
            <span className="filters-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Filters
            {activeFiltersCount > 0 && (
              <span className="filters-badge">{activeFiltersCount}</span>
            )}
          </button>
        </div>
      </form>

      <div
        id="smart-search-panel"
        className={`filters-panel${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="false"
      >
        <div className="filters-panel-header">
          <span>Advanced filters</span>
          <button
            type="button"
            className="filters-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className="filters-grid">
          <label className="filter-field">
            <span>Brand</span>
            <select
              value={filters.brand}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  brand: event.target.value,
                  model: '',
                }))
              }
            >
              <option value="">Select brand</option>
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Model</span>
            <select
              value={filters.model}
              disabled={!filters.brand}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, model: event.target.value }))
              }
            >
              <option value="">Select model</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Body type</span>
            <select
              value={filters.bodyType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, bodyType: event.target.value }))
              }
            >
              <option value="">Any</option>
              {bodyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-range">
            <span>Year range</span>
            <div className="range-fields">
              <select
                value={filters.yearFrom}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, yearFrom: event.target.value }))
                }
              >
                <option value="">From</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={filters.yearTo}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, yearTo: event.target.value }))
                }
              >
                <option value="">To</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-range">
            <span>Mileage (mi)</span>
            <div className="range-fields">
              <input
                type="number"
                min="0"
                value={filters.mileageMin}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    mileageMin: event.target.value,
                  }))
                }
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                value={filters.mileageMax}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    mileageMax: event.target.value,
                  }))
                }
                placeholder="Max"
              />
            </div>
          </div>

          <label className="filter-field">
            <span>Engine capacity</span>
            <select
              value={filters.engineCapacity}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  engineCapacity: event.target.value,
                }))
              }
            >
              <option value="">Any</option>
              {engineCapacities.map((capacity) => (
                <option key={capacity} value={capacity}>
                  {capacity}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Fuel type</span>
            <select
              value={filters.fuelType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, fuelType: event.target.value }))
              }
            >
              <option value="">Any</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Transmission</span>
            <select
              value={filters.transmission}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  transmission: event.target.value,
                }))
              }
            >
              <option value="">Any</option>
              {transmissions.map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Drive type</span>
            <select
              value={filters.driveType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, driveType: event.target.value }))
              }
            >
              <option value="">Any</option>
              {driveTypes.map((drive) => (
                <option key={drive} value={drive}>
                  {drive}
                </option>
              ))}
            </select>
          </label>

          <div className="filter-range">
            <span>Price range</span>
            <div className="range-fields">
              <input
                type="number"
                min="0"
                value={filters.priceMin}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, priceMin: event.target.value }))
                }
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                value={filters.priceMax}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, priceMax: event.target.value }))
                }
                placeholder="Max"
              />
            </div>
          </div>

          <label className="filter-field">
            <span>Condition</span>
            <select
              value={filters.condition}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  condition: event.target.value,
                }))
              }
            >
              <option value="">Any</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Color</span>
            <select
              value={filters.color}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, color: event.target.value }))
              }
            >
              <option value="">Any</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Doors</span>
            <select
              value={filters.doors}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, doors: event.target.value }))
              }
            >
              <option value="">Any</option>
              {doorCounts.map((doors) => (
                <option key={doors} value={doors}>
                  {doors}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filters-footer">
          <button className="filters-reset" type="button" onClick={handleReset}>
            Reset
          </button>
          <button className="filters-apply" type="button" onClick={handleApply}>
            Apply filters
          </button>
        </div>
      </div>

      <div
        className={`filters-backdrop${isOpen ? ' is-open' : ''}`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />
    </div>
  )
}

export default SmartSearchBar
