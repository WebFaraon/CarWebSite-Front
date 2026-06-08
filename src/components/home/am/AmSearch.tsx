import { useEffect, useState } from 'react'
import { CloseIcon, SearchIcon, SlidersIcon } from './AmIcons'

export type Currency = 'USD' | 'EUR' | 'MDL'

export type Filters = Partial<{
  brand: string
  model: string
  body: string
  yearFrom: string
  yearTo: string
  kmMin: string
  kmMax: string
  engine: string
  fuel: string
  transmission: string
  drive: string
  priceMin: string
  priceMax: string
  currency: Currency
  condition: 'New' | 'Used' | ''
  color: string
  doors: string
}>

export interface SearchSubmitPayload {
  query: string
  filters: Filters
}

interface AmSearchProps {
  query: string
  onQueryChange: (q: string) => void
  filters: Filters
  onFiltersChange: (f: Filters) => void
  onSubmit: (payload: SearchSubmitPayload) => void
  onClearAll: () => void
  hasActiveSearch: boolean
}

const BRAND_MODELS: Record<string, string[]> = {
  BMW: ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5', 'M340i'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'e-tron'],
  Mercedes: ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC', 'EQS'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  Toyota: ['Yaris', 'Corolla', 'RAV4', 'Camry', 'Highlander'],
  Volkswagen: ['Polo', 'Golf', 'Passat', 'Tiguan', 'ID.4'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
  Ford: ['Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Mustang'],
  Skoda: ['Fabia', 'Octavia', 'Kodiaq', 'Superb'],
}

const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Estate', 'Coupe', 'Convertible', 'Pickup']
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG']
const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-automatic']
const DRIVES = ['FWD', 'RWD', 'AWD', '4x4']
const COLORS = ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Beige']
const DOORS = ['2', '3', '4', '5']

const YEAR_MIN = 1950
const YEAR_MAX = new Date().getFullYear() + 1
const KM_MAX = 500000

const CURRENCIES: Currency[] = ['USD', 'EUR', 'MDL']
const PRICE_MAX_BY_CCY: Record<Currency, number> = {
  USD: 500000,
  EUR: 500000,
  MDL: 10000000,
}
const PRICE_STEP_BY_CCY: Record<Currency, number> = {
  USD: 500,
  EUR: 500,
  MDL: 5000,
}

function countFilters(f: Filters) {
  return Object.entries(f).filter(([k, v]) => {
    if (k === 'currency') return false
    return v !== undefined && v !== null && v !== ''
  }).length
}

interface FieldProps {
  label: string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="am-field">
      <span className="am-field-label">{label}</span>
      {children}
    </label>
  )
}

interface FilterModalProps {
  open: boolean
  onClose: () => void
  value: Filters
  onApply: (f: Filters) => void
}

function FilterModal({ open, onClose, value, onApply }: FilterModalProps) {
  const [draft, setDraft] = useState<Filters>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setDraft((d) => ({ ...d, [k]: v }))
  const reset = () => setDraft({})

  return (
    <div
      className="am-modal-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="am-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Advanced filters"
      >
        <div className="am-modal-head">
          <div className="am-modal-title">Advanced filters</div>
          <button
            type="button"
            className="am-iconbtn"
            onClick={onClose}
            aria-label="Close filters"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="am-modal-body">
          <section>
            <div className="am-fset-label">Vehicle</div>
            <div className="am-fset-grid am-fset-grid--2col">
              <Field label="Brand">
                <select
                  className="am-select"
                  value={draft.brand || ''}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, brand: e.target.value, model: '' }))
                  }}
                >
                  <option value="">Any brand</option>
                  {Object.keys(BRAND_MODELS).map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Field>
              <Field label="Model">
                <select
                  className="am-select"
                  value={draft.model || ''}
                  onChange={(e) => set('model', e.target.value)}
                  disabled={!draft.brand}
                >
                  <option value="">
                    {draft.brand ? 'Any model' : 'Pick a brand'}
                  </option>
                  {(draft.brand ? BRAND_MODELS[draft.brand] || [] : []).map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </Field>
              <Field label="Body type">
                <select
                  className="am-select"
                  value={draft.body || ''}
                  onChange={(e) => set('body', e.target.value)}
                >
                  <option value="">Any</option>
                  {BODY_TYPES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Condition">
                <select
                  className="am-select"
                  value={draft.condition || ''}
                  onChange={(e) =>
                    set('condition', e.target.value as 'New' | 'Used' | '')
                  }
                >
                  <option value="">Any</option>
                  <option>New</option>
                  <option>Used</option>
                </select>
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Engine &amp; drivetrain</div>
            <div className="am-fset-grid am-fset-grid--2col">
              <Field label="Fuel type">
                <select
                  className="am-select"
                  value={draft.fuel || ''}
                  onChange={(e) => set('fuel', e.target.value)}
                >
                  <option value="">Any</option>
                  {FUELS.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Transmission">
                <select
                  className="am-select"
                  value={draft.transmission || ''}
                  onChange={(e) => set('transmission', e.target.value)}
                >
                  <option value="">Any</option>
                  {TRANSMISSIONS.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Drive type">
                <select
                  className="am-select"
                  value={draft.drive || ''}
                  onChange={(e) => set('drive', e.target.value)}
                >
                  <option value="">Any</option>
                  {DRIVES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field label="Engine size (L)">
                <input
                  className="am-input"
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.1}
                  placeholder="0.5 – 8.0"
                  value={draft.engine || ''}
                  onChange={(e) => set('engine', e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Year &amp; mileage</div>
            <div className="am-fset-grid am-fset-grid--2col">
              <Field label="Year">
                <div className="am-range">
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    placeholder={String(YEAR_MIN)}
                    value={draft.yearFrom || ''}
                    onChange={(e) => set('yearFrom', e.target.value)}
                  />
                  <span className="am-range-sep">–</span>
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    placeholder={String(YEAR_MAX)}
                    value={draft.yearTo || ''}
                    onChange={(e) => set('yearTo', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Mileage (km)">
                <div className="am-range">
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={KM_MAX}
                    step={1000}
                    placeholder="0"
                    value={draft.kmMin || ''}
                    onChange={(e) => set('kmMin', e.target.value)}
                  />
                  <span className="am-range-sep">–</span>
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={KM_MAX}
                    step={1000}
                    placeholder={String(KM_MAX)}
                    value={draft.kmMax || ''}
                    onChange={(e) => set('kmMax', e.target.value)}
                  />
                </div>
              </Field>
            </div>
          </section>

          <section>
            <div className="am-fset-label">Price &amp; appearance</div>
            <div className="am-fset-grid">
              <Field label="Price">
                <div className="am-range">
                  <select
                    className="am-select am-select--ccy"
                    value={draft.currency || 'USD'}
                    onChange={(e) => set('currency', e.target.value as Currency)}
                    aria-label="Currency"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={PRICE_MAX_BY_CCY[draft.currency || 'USD']}
                    step={PRICE_STEP_BY_CCY[draft.currency || 'USD']}
                    placeholder="0"
                    value={draft.priceMin || ''}
                    onChange={(e) => set('priceMin', e.target.value)}
                  />
                  <span className="am-range-sep">–</span>
                  <input
                    className="am-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={PRICE_MAX_BY_CCY[draft.currency || 'USD']}
                    step={PRICE_STEP_BY_CCY[draft.currency || 'USD']}
                    placeholder={String(PRICE_MAX_BY_CCY[draft.currency || 'USD'])}
                    value={draft.priceMax || ''}
                    onChange={(e) => set('priceMax', e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Color">
                <select
                  className="am-select"
                  value={draft.color || ''}
                  onChange={(e) => set('color', e.target.value)}
                >
                  <option value="">Any</option>
                  {COLORS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Doors">
                <select
                  className="am-select"
                  value={draft.doors || ''}
                  onChange={(e) => set('doors', e.target.value)}
                >
                  <option value="">Any</option>
                  {DOORS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>
        </div>

        <div className="am-modal-foot">
          <button type="button" className="am-btn am-btn--ghost" onClick={reset}>
            Reset
          </button>
          <div className="am-modal-foot-actions">
            <button
              type="button"
              className="am-btn am-btn--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="am-btn am-btn--primary"
              onClick={() => {
                onApply(draft)
                onClose()
              }}
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AmSearch({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  onSubmit,
  onClearAll,
  hasActiveSearch,
}: AmSearchProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const filterCount = countFilters(filters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ query, filters })
  }

  return (
    <div className="am-search-wrap">
      <form className="am-search" onSubmit={handleSubmit} role="search">
        <SearchIcon size={18} className="am-search-icon" />
        <input
          className="am-search-input"
          placeholder="Search cars — e.g. Audi A6, SUV, diesel, 2018"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search cars"
        />
        {query && (
          <button
            type="button"
            className="am-search-clear"
            aria-label="Clear search query"
            onClick={() => onQueryChange('')}
          >
            <CloseIcon size={14} />
          </button>
        )}
        <div className="am-search-divider" />
        <button
          type="button"
          className="am-search-filter"
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
          aria-expanded={filterOpen}
        >
          <SlidersIcon size={16} />
          <span>Filters</span>
          {filterCount > 0 && <span className="am-filter-badge">{filterCount}</span>}
        </button>
        <button type="submit" className="am-search-submit">
          Search
        </button>
      </form>

      {hasActiveSearch && (
        <div className="am-clear-row">
          <button type="button" className="am-text-link" onClick={onClearAll}>
            Clear search &amp; filters
          </button>
        </div>
      )}

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onApply={onFiltersChange}
      />
    </div>
  )
}

export default AmSearch
export { countFilters }
