import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { useTheme } from '../../context/ThemeContext'
import useCatalog from './hooks/useCatalog'
import { toCatalogFavoriteId } from './catalog.api'
import { getFavoriteIds, setFavoriteIds } from '../../utils/favoritesStorage'
import type { Filters, Fuel, Offer, SortKey, Transmission } from './catalog.types'
import '../Home/Home.css'
import './AmOffers.css'

const DEFAULT_FILTERS: Filters = {
  q: '',
  brand: '',
  location: '',
  fuel: '',
  transmission: '',
  minPrice: undefined,
  maxPrice: undefined,
  yearFrom: undefined,
  yearTo: undefined,
  maxKm: undefined,
}

const FUEL_OPTS: [Fuel, string][] = [
  ['diesel', 'Diesel'],
  ['petrol', 'Petrol'],
  ['hybrid', 'Hybrid'],
  ['electric', 'Electric'],
  ['gas', 'Gas'],
]

const TRANS_OPTS: [Transmission, string][] = [
  ['automatic', 'Automatic'],
  ['manual', 'Manual'],
]

const KM_OPTS: [string, string][] = [
  ['', 'Any mileage'],
  ['50000', '< 50 000 km'],
  ['100000', '< 100 000 km'],
  ['150000', '< 150 000 km'],
  ['200000', '< 200 000 km'],
  ['250000', '< 250 000 km'],
]

const SORTS: [SortKey, string][] = [
  ['relevance', 'Relevance'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['year_desc', 'Year: Newest'],
  ['km_asc', 'Mileage: Lowest'],
]

const TRANS_LABEL: Record<Transmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
}

const FUEL_LABEL: Record<Fuel, string> = {
  diesel: 'Diesel',
  petrol: 'Petrol',
  hybrid: 'Hybrid',
  electric: 'Electric',
  gas: 'Gas',
}

const CURRENCY_LABEL: Record<Offer['currency'], string> = {
  EUR: 'EUR',
  $: 'USD',
  MDL: 'MDL',
}

const fmtDE = (n: number) => new Intl.NumberFormat('de-DE').format(n)

function isDefault(f: Filters): boolean {
  return !(
    f.q ||
    f.brand ||
    f.location ||
    f.fuel ||
    f.transmission ||
    f.minPrice != null ||
    f.maxPrice != null ||
    f.yearFrom != null ||
    f.yearTo != null ||
    f.maxKm != null
  )
}

function countActive(f: Filters): number {
  let n = 0
  if (f.q) n++
  if (f.brand) n++
  if (f.location) n++
  if (f.fuel) n++
  if (f.transmission) n++
  if (f.minPrice != null || f.maxPrice != null) n++
  if (f.yearFrom != null || f.yearTo != null) n++
  if (f.maxKm != null) n++
  return n
}

type ChipKey =
  | 'q'
  | 'brand'
  | 'location'
  | 'fuel'
  | 'transmission'
  | 'price'
  | 'year'
  | 'maxKm'

function activeChips(f: Filters): [ChipKey, React.ReactNode][] {
  const out: [ChipKey, React.ReactNode][] = []
  if (f.q) out.push(['q', <>“{f.q}”</>])
  if (f.brand) out.push(['brand', <>Brand: <b>{f.brand}</b></>])
  if (f.location) out.push(['location', <>Location: <b>{f.location}</b></>])
  if (f.fuel)
    out.push(['fuel', <>Fuel: <b>{FUEL_LABEL[f.fuel as Fuel]}</b></>])
  if (f.transmission)
    out.push([
      'transmission',
      <>Transmission: <b>{TRANS_LABEL[f.transmission as Transmission]}</b></>,
    ])
  if (f.minPrice != null || f.maxPrice != null) {
    const min = f.minPrice != null ? `€${fmtDE(f.minPrice)}` : 'Any'
    const max = f.maxPrice != null ? `€${fmtDE(f.maxPrice)}` : 'Any'
    out.push(['price', <>Price: <b>{min} – {max}</b></>])
  }
  if (f.yearFrom != null || f.yearTo != null) {
    const from = f.yearFrom != null ? String(f.yearFrom) : 'Any'
    const to = f.yearTo != null ? String(f.yearTo) : 'Any'
    out.push(['year', <>Year: <b>{from} – {to}</b></>])
  }
  if (f.maxKm != null)
    out.push(['maxKm', <>Mileage: <b>{`< ${fmtDE(f.maxKm)} km`}</b></>])
  return out
}

function clearKey(filters: Filters, key: ChipKey): Filters {
  switch (key) {
    case 'price':
      return { ...filters, minPrice: undefined, maxPrice: undefined }
    case 'year':
      return { ...filters, yearFrom: undefined, yearTo: undefined }
    case 'maxKm':
      return { ...filters, maxKm: undefined }
    case 'q':
      return { ...filters, q: '' }
    case 'brand':
      return { ...filters, brand: '' }
    case 'location':
      return { ...filters, location: '' }
    case 'fuel':
      return { ...filters, fuel: '' }
    case 'transmission':
      return { ...filters, transmission: '' }
  }
}

/* ---------- URL <-> state ---------- */

function buildParams(f: Filters, sort: SortKey, page: number): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.brand) p.set('brand', f.brand)
  if (f.location) p.set('location', f.location)
  if (f.fuel) p.set('fuel', f.fuel)
  if (f.transmission) p.set('transmission', f.transmission)
  if (f.minPrice != null) p.set('minPrice', String(f.minPrice))
  if (f.maxPrice != null) p.set('maxPrice', String(f.maxPrice))
  if (f.yearFrom != null) p.set('yearFrom', String(f.yearFrom))
  if (f.yearTo != null) p.set('yearTo', String(f.yearTo))
  if (f.maxKm != null) p.set('maxKm', String(f.maxKm))
  if (sort !== 'relevance') p.set('sort', sort)
  if (page > 1) p.set('page', String(page))
  return p
}

function parseParams(p: URLSearchParams): {
  filters: Filters
  sort: SortKey
  page: number
} {
  const num = (k: string): number | undefined => {
    const v = p.get(k)
    if (v == null || v === '') return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  const fuelRaw = p.get('fuel')
  const txRaw = p.get('transmission')
  const sortRaw = p.get('sort')
  return {
    filters: {
      q: p.get('q') ?? '',
      brand: p.get('brand') ?? '',
      location: p.get('location') ?? '',
      fuel:
        fuelRaw && ['diesel', 'petrol', 'hybrid', 'electric', 'gas'].includes(fuelRaw)
          ? (fuelRaw as Fuel)
          : '',
      transmission:
        txRaw && ['automatic', 'manual'].includes(txRaw) ? (txRaw as Transmission) : '',
      minPrice: num('minPrice'),
      maxPrice: num('maxPrice'),
      yearFrom: num('yearFrom'),
      yearTo: num('yearTo'),
      maxKm: num('maxKm'),
    },
    sort:
      sortRaw &&
      ['relevance', 'price_asc', 'price_desc', 'year_desc', 'km_asc'].includes(sortRaw)
        ? (sortRaw as SortKey)
        : 'relevance',
    page: Math.max(1, Number(p.get('page')) || 1),
  }
}

/* ---------- icons ---------- */

interface IconProps {
  size?: number
  fill?: string
}

function Svg({
  size = 18,
  d,
  fill = 'none',
  extra,
}: IconProps & { d: string; extra?: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {extra}
      <path d={d} />
    </svg>
  )
}

const SearchI = (p: IconProps) => (
  <Svg {...p} d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35" />
)
const XI = (p: IconProps) => <Svg {...p} d="M6 6l12 12M18 6L6 18" />
const HeartI = (p: IconProps) => (
  <Svg
    {...p}
    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
  />
)
const PinI = (p: IconProps) => (
  <Svg {...p} extra={<circle cx="12" cy="10" r="3" />} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
)
const GridI = (p: IconProps) => (
  <Svg {...p} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
)
const ListI = (p: IconProps) => (
  <Svg {...p} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
)
const SlidersI = (p: IconProps) => (
  <Svg {...p} d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4" />
)
const ChevL = (p: IconProps) => <Svg {...p} d="M15 6l-6 6 6 6" />
const ChevR = (p: IconProps) => <Svg {...p} d="M9 6l6 6-6 6" />

/* ---------- offer card ---------- */

interface OfferCardProps {
  offer: Offer
  fav: boolean
  onFav: (id: string) => void
  view: 'grid' | 'list'
}

function OfferCard({ offer, fav, onFav, view }: OfferCardProps) {
  const navigate = useNavigate()

  const specs = [
    offer.km ? `${fmtDE(offer.km)} km` : null,
    offer.transmission ? TRANS_LABEL[offer.transmission] : null,
    FUEL_LABEL[offer.fuel] ?? offer.fuel,
    offer.powerHp ? `${offer.powerHp} hp` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const open = () => navigate('/car-details', { state: { offer } })

  const priceBlock = (
    <div className="am-offer-price">
      {fmtDE(offer.price)}{' '}
      <span className="am-offer-currency">
        {CURRENCY_LABEL[offer.currency] ?? offer.currency}
      </span>
    </div>
  )

  const titleBlock = (
    <div className="am-offer-title">
      {offer.title} <span className="am-offer-title-year">{offer.year}</span>
    </div>
  )

  return (
    <article
      className="am-offer-card"
      role="link"
      tabIndex={0}
      aria-label={`Open details for ${offer.title}`}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
    >
     <div className="am-offer-media">
  {offer.imageUrl ? (
    <img
      src={offer.imageUrl}
      alt={offer.title}
      className="am-offer-img"
      loading="lazy"
    />
  ) : (
    <div className="am-offer-img am-offer-img--placeholder" aria-label="No photo available">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span>No photo</span>
    </div>
  )}
        <button
          type="button"
          className="am-offer-fav"
          aria-pressed={fav}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => {
            e.stopPropagation()
            onFav(offer.id)
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <HeartI size={18} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="am-offer-body">
        {view === 'list' ? (
          <>
            <div className="am-offer-row">
              {titleBlock}
              {priceBlock}
            </div>
            <div className="am-offer-specs">{specs}</div>
            <div className="am-offer-location">
              <PinI size={13} /> {offer.location}
            </div>
          </>
        ) : (
          <>
            {titleBlock}
            {priceBlock}
            <div className="am-offer-specs">{specs}</div>
            <div className="am-offer-location">
              <PinI size={13} /> {offer.location}
            </div>
          </>
        )}
      </div>
    </article>
  )
}

function SkelCard() {
  return (
    <div className="am-offer-skel" aria-hidden="true">
      <div className="am-offer-skel-media am-shimmer" />
      <div className="am-offer-skel-body">
        <div className="am-offer-skel-line am-shimmer" style={{ width: '70%' }} />
        <div
          className="am-offer-skel-line am-shimmer"
          style={{ width: '40%', height: 16 }}
        />
        <div className="am-offer-skel-line am-shimmer" style={{ width: '60%' }} />
      </div>
    </div>
  )
}

/* ---------- main page ---------- */

function AmOffers() {
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const cat = useCatalog()
  const {
    brandOptions,
    locations,
    filteredOffers,
    totalCount,
    page,
    totalPages,
    setPage,
    filters,
    setFilters,
    sort,
    setSort,
    isLoading,
    error,
    pageSize,
  } = cat

  const [favoriteIds, setFavoriteIdsState] = useState<number[]>(() => getFavoriteIds())
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sheet, setSheet] = useState(false)
  const [stuck, setStuck] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const sheetOpenerRef = useRef<HTMLButtonElement | null>(null)
  const hydratedRef = useRef(false)

  // Hydrate state from URL on mount (once)
  useEffect(() => {
    const { filters: f, sort: s, page: p } = parseParams(searchParams)
    setFilters(f)
    setSort(s)
    if (p > 1) {
      // useCatalog auto-resets page to 1 when filters change; defer to override
      window.setTimeout(() => setPage(p), 0)
    }
    window.setTimeout(() => {
      hydratedRef.current = true
    }, 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist state to URL on every change (after hydration)
  useEffect(() => {
    if (!hydratedRef.current) return
    const next = buildParams(filters, sort, page)
    const current = searchParams.toString()
    if (next.toString() !== current) {
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page])

  // Persist favorites to localStorage
  useEffect(() => {
    setFavoriteIds(favoriteIds)
  }, [favoriteIds])

  // Sticky toolbar detection via window scroll
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      const heroBottom =
        heroRef.current.offsetTop + heroRef.current.offsetHeight
      setStuck(window.scrollY > heroBottom)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes sheet; lock body scroll while open; restore focus
  useEffect(() => {
    if (!sheet) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSheet(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      sheetOpenerRef.current?.focus()
    }
  }, [sheet])

  const toggleFavorite = (offerId: string) => {
    const favId = toCatalogFavoriteId(offerId)
    if (favId == null) return
    setFavoriteIdsState((prev) =>
      prev.includes(favId) ? prev.filter((x) => x !== favId) : [...prev, favId],
    )
  }

  const empty = !isLoading && totalCount === 0
  const active = !isDefault(filters)
  const activeN = countActive(filters)
  const chips = activeChips(filters)

  const setF = (patch: Partial<Filters>) =>
    setFilters({ ...filters, ...patch } as Filters)
  const toggleChipFilter = (key: 'fuel' | 'transmission', val: string) =>
    setF({ [key]: filters[key] === val ? '' : val } as Partial<Filters>)
  const clearAll = () => setFilters({ ...DEFAULT_FILTERS })

  const allBrandsTotal = useMemo(
    () => brandOptions.reduce((s, b) => s + b.count, 0),
    [brandOptions],
  )

  const numInput = (val: number | undefined): string => (val == null ? '' : String(val))
  const parseNumInput = (raw: string): number | undefined =>
    raw === '' ? undefined : Math.max(0, Number(raw))

  const countLine = isLoading
    ? 'Loading…'
    : pageSize >= totalCount
      ? `${totalCount} car${totalCount === 1 ? '' : 's'}`
      : `${totalCount} cars · page ${page} of ${totalPages}`

  // page numbers (compact with ellipsis)
  const pages: (number | '…')[] = useMemo(() => {
    const out: (number | '…')[] = []
    const win = 1
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - win && i <= page + win)) {
        out.push(i)
      } else if (out[out.length - 1] !== '…') {
        out.push('…')
      }
    }
    return out
  }, [page, totalPages])

  const isFav = (offerId: string): boolean => {
    const favId = toCatalogFavoriteId(offerId)
    return favId != null && favoriteIds.includes(favId)
  }

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className="am-shell am-offers">
        {/* hero */}
        <div className="am-offers-hero" ref={heroRef}>
          <div className="am-eyebrow">Catalog</div>
          <h1 className="am-offers-h1">Offers</h1>
          <div className="am-offers-count">{countLine}</div>
        </div>

        {/* toolbar */}
        <div className="am-offers-toolbar" data-stuck={stuck}>
          <div className="am-offers-toolbar-row">
            <div className="am-offers-search">
              <SearchI size={18} />
              <input
                type="search"
                aria-label="Search offers"
                placeholder="Search make, model…"
                value={filters.q}
                onChange={(e) => setF({ q: e.target.value })}
              />
              {filters.q && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setF({ q: '' })}
                >
                  <XI size={13} />
                </button>
              )}
            </div>

            {/* desktop selects */}
            <div className="am-offers-selects">
              <select
                className="am-offers-select"
                aria-label="Brand"
                value={filters.brand ?? ''}
                onChange={(e) => setF({ brand: e.target.value })}
              >
                <option value="">All brands ({allBrandsTotal})</option>
                {brandOptions.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.count})
                  </option>
                ))}
              </select>
              <select
                className="am-offers-select"
                aria-label="Location"
                value={filters.location ?? ''}
                onChange={(e) => setF({ location: e.target.value })}
              >
                <option value="">Any location</option>
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                className="am-offers-select"
                aria-label="Max mileage"
                value={filters.maxKm != null ? String(filters.maxKm) : ''}
                onChange={(e) =>
                  setF({ maxKm: e.target.value ? Number(e.target.value) : undefined })
                }
              >
                {KM_OPTS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <select
                className="am-offers-select"
                aria-label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* mobile: filters button + sort */}
            <button
              type="button"
              className="am-offers-filterbtn"
              onClick={() => setSheet(true)}
              ref={sheetOpenerRef}
            >
              <SlidersI size={16} /> Filters{' '}
              {activeN > 0 && <span className="am-filter-badge">{activeN}</span>}
            </button>
            <div className="am-offers-mobsort">
              <select
                className="am-offers-select"
                aria-label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* secondary row (desktop) */}
          <div className="am-offers-secondary">
            <div className="am-offers-fset" role="group" aria-label="Fuel type">
              <span className="am-offers-fset-label">Fuel</span>
              <div className="am-chip-group">
                {FUEL_OPTS.map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    className="am-chip-toggle"
                    aria-pressed={filters.fuel === v}
                    onClick={() => toggleChipFilter('fuel', v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="am-offers-fset" role="group" aria-label="Transmission">
              <span className="am-offers-fset-label">Gearbox</span>
              <div className="am-chip-group">
                {TRANS_OPTS.map(([v, l]) => (
                  <button
                    key={v}
                    type="button"
                    className="am-chip-toggle"
                    aria-pressed={filters.transmission === v}
                    onClick={() => toggleChipFilter('transmission', v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="am-offers-fset">
              <span className="am-offers-fset-label">Price</span>
              <div className="am-offers-range">
                <input
                  type="number"
                  placeholder="Min"
                  step={1000}
                  min={0}
                  aria-label="Min price"
                  value={numInput(filters.minPrice)}
                  onChange={(e) => setF({ minPrice: parseNumInput(e.target.value) })}
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  step={1000}
                  min={0}
                  aria-label="Max price"
                  value={numInput(filters.maxPrice)}
                  onChange={(e) => setF({ maxPrice: parseNumInput(e.target.value) })}
                />
              </div>
            </div>
            <div className="am-offers-fset">
              <span className="am-offers-fset-label">Year</span>
              <div className="am-offers-range">
                <input
                  type="number"
                  placeholder="From"
                  step={1}
                  min={1900}
                  aria-label="Year from"
                  value={numInput(filters.yearFrom)}
                  onChange={(e) => setF({ yearFrom: parseNumInput(e.target.value) })}
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="To"
                  step={1}
                  min={1900}
                  aria-label="Year to"
                  value={numInput(filters.yearTo)}
                  onChange={(e) => setF({ yearTo: parseNumInput(e.target.value) })}
                />
              </div>
            </div>
            {active && (
              <button type="button" className="am-offers-clear-link" onClick={clearAll}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* active chips */}
        {chips.length > 0 && (
          <div className="am-offers-chips">
            {chips.map(([key, label]) => (
              <span key={key} className="am-offers-chip">
                <span>{label}</span>
                <button
                  type="button"
                  aria-label={`Remove ${key} filter`}
                  onClick={() => setFilters(clearKey(filters, key))}
                >
                  <XI size={12} />
                </button>
              </span>
            ))}
            <button type="button" className="am-offers-chip-clear" onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {/* head */}
        <div className="am-offers-head">
          <div className="am-offers-head-count">{countLine}</div>
          <div className="am-view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              <GridI size={16} />
            </button>
            <button
              type="button"
              aria-pressed={view === 'list'}
              aria-label="List view"
              onClick={() => setView('list')}
            >
              <ListI size={16} />
            </button>
          </div>
        </div>

        {error && <div className="am-alert" role="alert">{error}</div>}

        {/* grid / states */}
        {isLoading ? (
          <div className="am-offers-grid" data-view={view} aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkelCard key={i} />
            ))}
          </div>
        ) : empty ? (
          <div className="am-offers-empty">
            <div className="am-offers-empty-mark">
              <SearchI size={24} />
            </div>
            <h2>No offers match your filters.</h2>
            <p>Try removing some filters or broadening your price/year range.</p>
            <button
              type="button"
              className="am-btn am-btn--primary am-btn--lg"
              onClick={clearAll}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="am-offers-grid" data-view={view} aria-busy="false">
              {filteredOffers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  fav={isFav(o.id)}
                  onFav={toggleFavorite}
                  view={view}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="am-offers-pagination" aria-label="Catalog pagination">
                <button
                  type="button"
                  className="am-page-btn"
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevL size={16} />
                </button>
                {pages.map((p, i) =>
                  p === '…' ? (
                    <span key={`e${i}`} className="am-page-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className="am-page-btn"
                      aria-current={p === page ? 'page' : undefined}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  className="am-page-btn"
                  aria-label="Next page"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevR size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <AmFooter />

      {/* mobile filter sheet */}
      {sheet && (
        <div
          className="am-sheet-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSheet(false)
          }}
        >
          <div className="am-sheet" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="am-sheet-head">
              <div className="am-sheet-title">Filters</div>
              <button
                type="button"
                className="am-iconbtn"
                aria-label="Close filters"
                onClick={() => setSheet(false)}
              >
                <XI size={18} />
              </button>
            </div>
            <div className="am-sheet-body">
              <div className="am-sheet-field">
                <label htmlFor="sh-brand">Brand</label>
                <select
                  id="sh-brand"
                  className="am-offers-select"
                  value={filters.brand ?? ''}
                  onChange={(e) => setF({ brand: e.target.value })}
                >
                  <option value="">All brands ({allBrandsTotal})</option>
                  {brandOptions.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name} ({b.count})
                    </option>
                  ))}
                </select>
              </div>
              <div className="am-sheet-field">
                <label htmlFor="sh-loc">Location</label>
                <select
                  id="sh-loc"
                  className="am-offers-select"
                  value={filters.location ?? ''}
                  onChange={(e) => setF({ location: e.target.value })}
                >
                  <option value="">Any location</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="am-sheet-field">
                <label>Fuel</label>
                <div
                  className="am-chip-group"
                  role="group"
                  aria-label="Fuel type"
                  style={{ flexWrap: 'wrap' }}
                >
                  {FUEL_OPTS.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      className="am-chip-toggle"
                      aria-pressed={filters.fuel === v}
                      onClick={() => toggleChipFilter('fuel', v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="am-sheet-field">
                <label>Transmission</label>
                <div className="am-chip-group" role="group" aria-label="Transmission">
                  {TRANS_OPTS.map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      className="am-chip-toggle"
                      aria-pressed={filters.transmission === v}
                      onClick={() => toggleChipFilter('transmission', v)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="am-sheet-field">
                <label>Price range</label>
                <div className="am-offers-range">
                  <input
                    type="number"
                    placeholder="Min"
                    step={1000}
                    min={0}
                    aria-label="Min price"
                    value={numInput(filters.minPrice)}
                    onChange={(e) => setF({ minPrice: parseNumInput(e.target.value) })}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    step={1000}
                    min={0}
                    aria-label="Max price"
                    value={numInput(filters.maxPrice)}
                    onChange={(e) => setF({ maxPrice: parseNumInput(e.target.value) })}
                  />
                </div>
              </div>
              <div className="am-sheet-field">
                <label>Year range</label>
                <div className="am-offers-range">
                  <input
                    type="number"
                    placeholder="From"
                    step={1}
                    min={1900}
                    aria-label="Year from"
                    value={numInput(filters.yearFrom)}
                    onChange={(e) => setF({ yearFrom: parseNumInput(e.target.value) })}
                  />
                  <span>–</span>
                  <input
                    type="number"
                    placeholder="To"
                    step={1}
                    min={1900}
                    aria-label="Year to"
                    value={numInput(filters.yearTo)}
                    onChange={(e) => setF({ yearTo: parseNumInput(e.target.value) })}
                  />
                </div>
              </div>
              <div className="am-sheet-field">
                <label htmlFor="sh-km">Max mileage</label>
                <select
                  id="sh-km"
                  className="am-offers-select"
                  value={filters.maxKm != null ? String(filters.maxKm) : ''}
                  onChange={(e) =>
                    setF({
                      maxKm: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                >
                  {KM_OPTS.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="am-sheet-foot">
              <button
                type="button"
                className="am-btn am-btn--ghost"
                onClick={clearAll}
              >
                Reset
              </button>
              <button
                type="button"
                className="am-btn am-btn--primary"
                onClick={() => setSheet(false)}
              >
                Apply ({totalCount} result{totalCount === 1 ? '' : 's'})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AmOffers
