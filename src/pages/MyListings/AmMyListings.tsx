import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import AmFooter from '../../components/home/am/AmFooter'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { announcementApi, brandApi, getApiErrorMessage } from '../../services/api'
import type { BrandDto } from '../../services/api'
import '../Home/Home.css'
import './AmMyListings.css'

/* ── types ── */

type Tab = 'listings' | 'new'
type ListingStatus = 'active' | 'hidden' | 'pending'
type SortKey = 'newest' | 'oldest' | 'priceDesc' | 'views' | 'inquiries'
type StatusFilter = ListingStatus | 'all'

interface Listing {
  id: string
  title: string
  brandId?: number
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  condition: string
  bodyType?: string
  color?: string
  doors?: number | string
  seats?: number
  engineSize?: string
  horsepower?: number
  vin?: string
  description: string
  contactName: string
  contactPhone?: string
  contactCity: string
  negotiable: boolean
  showPhone: boolean
  features: string[]
  status: ListingStatus
  images: string[]
  views: number
  inquiries: number
  createdAt: string
}

interface FormData {
  title: string
  brand: string
  model: string
  year: string
  price: string
  mileage: string
  fuel: string
  transmission: string
  bodyType: string
  color: string
  condition: string
  doors: string
  seats: string
  engineSize: string
  horsepower: string
  vin: string
  description: string
  contactName: string
  contactPhone: string
  contactEmail: string
  contactCity: string
  negotiable: boolean
  showPhone: boolean
}

interface ImageEntry {
  id: string
  url: string
  name: string
  size: number
  file?: File
}

interface DraftState {
  form: Partial<FormData>
  features: string[]
  section: number
  savedAt: number
}

/* ── value maps (preserve — translate UI labels → API enum values) ── */

const FUEL_MAP: Record<string, string> = {
  Petrol: 'Petrol', Diesel: 'Diesel', Hybrid: 'Hybrid',
  Electric: 'Electric', LPG: 'LPG', CNG: 'CNG',
}
const TRANSMISSION_MAP: Record<string, string> = {
  Automatic: 'Automatic', Manual: 'Manual',
  'Semi-Automatic': 'SemiAutomatic', CVT: 'CVT',
}
const CONDITION_MAP: Record<string, string> = {
  New: 'New', 'Like New': 'LikeNew', Excellent: 'Excellent',
  Good: 'Good', Fair: 'Fair', 'Parts Only': 'PartsOnly',
}
const BODY_TYPE_MAP: Record<string, string> = {
  Sedan: 'Sedan', SUV: 'Suv', Hatchback: 'Hatchback',
  Coupe: 'Coupe', Convertible: 'Convertible', Wagon: 'Wagon',
  Pickup: 'Pickup', Van: 'Van', Minivan: 'Minivan',
}
const COLOR_MAP: Record<string, string> = {
  Black: 'Black', White: 'White', Silver: 'Silver', Gray: 'Gray',
  Red: 'Red', Blue: 'Blue', Green: 'Green', Brown: 'Brown',
  Yellow: 'Yellow', Orange: 'Orange', Other: 'Other',
}
const DOORS_MAP: Record<string, string> = {
  '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
}
const reverseMap = (map: Record<string, string>, value?: string | number | null) => {
  if (value === undefined || value === null || value === '') return ''
  const raw = String(value)
  const found = Object.entries(map).find(([label, apiValue]) => apiValue === raw || label === raw)
  return found?.[0] ?? raw
}

const blankForm = (initialContactName: string, initialEmail: string): FormData => ({
  title: '', brand: '', model: '', year: '', price: '', mileage: '',
  fuel: '', transmission: '', bodyType: '', color: '', condition: '',
  doors: '', seats: '', engineSize: '', horsepower: '', vin: '',
  description: '',
  contactName: initialContactName,
  contactPhone: '',
  contactEmail: initialEmail,
  contactCity: '',
  negotiable: false,
  showPhone: true,
})

const listingToForm = (
  listing: Listing,
  initialEmail: string,
): FormData => ({
  title: listing.title,
  brand: listing.brand,
  model: listing.model,
  year: String(listing.year),
  price: String(listing.price),
  mileage: String(listing.mileage),
  fuel: reverseMap(FUEL_MAP, listing.fuel),
  transmission: reverseMap(TRANSMISSION_MAP, listing.transmission),
  bodyType: reverseMap(BODY_TYPE_MAP, listing.bodyType),
  color: reverseMap(COLOR_MAP, listing.color),
  condition: reverseMap(CONDITION_MAP, listing.condition),
  doors: typeof listing.doors === 'number' ? String(listing.doors) : reverseMap(DOORS_MAP, listing.doors),
  seats: listing.seats ? String(listing.seats) : '',
  engineSize: listing.engineSize ?? '',
  horsepower: listing.horsepower ? String(listing.horsepower) : '',
  vin: listing.vin ?? '',
  description: listing.description,
  contactName: listing.contactName,
  contactPhone: listing.contactPhone ?? '',
  contactEmail: initialEmail,
  contactCity: listing.contactCity,
  negotiable: listing.negotiable,
  showPhone: listing.showPhone,
})

const imagesFromListing = (listing?: Listing | null): ImageEntry[] =>
  listing?.images.map((url, index) => ({
    id: `${listing.id}-${index}`,
    url,
    name: `Photo ${index + 1}`,
    size: 0,
  })) ?? []

const API_STATUS_MAP: Record<string, ListingStatus> = {
  Active: 'active', Hidden: 'hidden', Pending: 'pending',
}
const STATUS_LABEL: Record<ListingStatus, string> = {
  active: 'Active', hidden: 'Hidden', pending: 'In Review',
}

/* ── constants ── */

const FUEL_OPTS = Object.keys(FUEL_MAP)
const TRANS_OPTS = Object.keys(TRANSMISSION_MAP)
const BODY_OPTS = Object.keys(BODY_TYPE_MAP)
const COND_OPTS = Object.keys(CONDITION_MAP)
const COLOR_OPTS = Object.keys(COLOR_MAP)
const DOORS_OPTS = Object.keys(DOORS_MAP)

const FEATURES = [
  'Air Conditioning', 'Heated Seats', 'Leather Seats', 'Sunroof / Moonroof',
  'Navigation System', 'Backup Camera', 'Parking Sensors', 'Bluetooth',
  'Apple CarPlay / Android Auto', 'Cruise Control', 'Adaptive Cruise Control',
  'Lane Departure Warning', 'Blind Spot Monitor', 'Keyless Entry', 'Push to Start',
  'Remote Start', 'Wireless Charging', 'Premium Sound System',
  'Third Row Seating', 'Tow Package', 'All-Wheel Drive', '4x4 / Off-Road Package',
]

const STEP_LABELS = ['Photos', 'Basic Info', 'Vehicle Details', 'Description & Features', 'Contact & Review']

const SECTIONS = [
  { title: 'Upload Photos', body: 'Listings with good photos get up to 5× more inquiries. Add up to 10 images — the first one becomes the cover.' },
  { title: 'Basic Information', body: 'Fill in the key details that buyers search for first.' },
  { title: 'Vehicle Details', body: 'More detail builds trust. Fill in as many fields as you can.' },
  { title: 'Description & Features', body: 'Describe the car honestly and highlight what makes it stand out.' },
  { title: 'Contact Information', body: 'Buyers will use this to reach you. Keep it accurate and up to date.' },
]

const DRAFT_KEY = 'ml-draft'
const CURRENT_YEAR = new Date().getFullYear()

const STATUS_FILTERS: [StatusFilter, string][] = [
  ['all', 'All'], ['active', 'Active'], ['hidden', 'Hidden'], ['pending', 'In Review'],
]
const SORTS: [SortKey, string][] = [
  ['newest', 'Newest'], ['oldest', 'Oldest'], ['priceDesc', 'Price: high to low'],
  ['views', 'Most viewed'], ['inquiries', 'Most inquiries'],
]

/* ── utils ── */

const fmtNum = (n: number) => new Intl.NumberFormat('de-DE').format(n)

function timeAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function isDefaultForm(f: FormData): boolean {
  return !f.brand && !f.model && !f.year && !f.price && !f.mileage && !f.description
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/* ── icons ── */

interface IconProps { size?: number; className?: string }

const ico = (d: string, extra?: React.ReactNode) => ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {extra}
    <path d={d} />
  </svg>
)

const SearchIcon = ico('M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35')
const PlusIcon = ico('M12 5v14M5 12h14')
const EditIcon = ico('M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z')
const EyeIcon = ico('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', <circle cx="12" cy="12" r="3" />)
const EyeOffIcon = ico('M2 12s3.5-7 10-7c2 0 3.8.66 5.3 1.6M22 12s-3.5 7-10 7c-2 0-3.8-.66-5.3-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18')
const TrashIcon = ico('M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6')
const MsgIcon = ico('M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z')
const XIcon = ico('M6 6l12 12M18 6L6 18')
const ImgIcon = ico('M3 5h18v14H3zM21 15l-5-5L5 21', <circle cx="9" cy="9" r="2" />)
const CheckIcon = ({ size = 18, className }: IconProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)
const ArrowRIcon = ico('M5 12h14M13 5l7 7-7 7')
const ArrowLIcon = ico('M19 12H5M11 19l-7-7 7-7')
const UploadIcon = ico('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12')

/* ── StatusBadge ── */

function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className="am-ml-status-badge" data-status={status}>
      <i />{STATUS_LABEL[status]}
    </span>
  )
}

/* ── MlField ── */

interface MlFieldProps {
  label?: string
  req?: boolean
  htmlFor?: string
  hint?: string
  hintClass?: string
  error?: string
  full?: boolean
  children: React.ReactNode
}

function MlField({ label, req, htmlFor, hint, hintClass, error, full, children }: MlFieldProps) {
  return (
    <div className={`am-ml-field${full ? ' am-ml-field--full' : ''}`}>
      {label && (
        <label className="am-ml-label" htmlFor={htmlFor}>
          {label}{req && <span className="req"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <div className={`am-ml-hint${hintClass ? ' ' + hintClass : ''}`} id={htmlFor ? htmlFor + '-hint' : undefined}>
          {hint}
        </div>
      )}
      {error && (
        <div className="am-ml-err" id={htmlFor ? htmlFor + '-err' : undefined} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

/* ── ImageUploader ── */

interface ImageUploaderProps {
  images: ImageEntry[]
  setImages: React.Dispatch<React.SetStateAction<ImageEntry[]>>
  onToast: (msg: string) => void
}

function ImageUploader({ images, setImages, onToast }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragIdx = useRef<number | null>(null)
  const [over, setOver] = useState<number | null>(null)
  const [dropping, setDropping] = useState(false)

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files)
    const added: ImageEntry[] = []
    for (const file of arr) {
      if (images.length + added.length >= 10) break
      if (file.size > 5 * 1024 * 1024) {
        onToast(`${file.name} is too large (max 5 MB)`)
        continue
      }
      if (images.some((im) => im.name === file.name && im.size === file.size)) {
        onToast(`${file.name} is already added`)
        continue
      }
      added.push({
        id: Math.random().toString(36).slice(2),
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        file,
      })
    }
    if (added.length > 0) setImages((prev) => [...prev, ...added])
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const entry = prev.find((im) => im.id === id)
      if (entry?.file) URL.revokeObjectURL(entry.url)
      return prev.filter((im) => im.id !== id)
    })
  }

  const onThumbDrop = (i: number) => {
    const from = dragIdx.current
    if (from === null || from === i) { setOver(null); return }
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(i, 0, moved)
      return next
    })
    dragIdx.current = null
    setOver(null)
  }

  return (
    <>
      <div
        className={`am-ml-uploader${dropping ? ' am-ml-uploader--over' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload car photos"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() }
        }}
        onDragOver={(e) => { e.preventDefault(); setDropping(true) }}
        onDragLeave={() => setDropping(false)}
        onDrop={(e) => { e.preventDefault(); setDropping(false); addFiles(e.dataTransfer.files) }}
      >
        <div className="am-ml-uploader-icon"><UploadIcon size={22} /></div>
        <strong>Click or drag photos here</strong>
        <span>Max 10 photos · JPG, PNG, WEBP · First photo becomes the cover image</span>
        <span className="am-ml-uploader-count">{images.length} / 10 uploaded</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          aria-label="Upload car photos"
          onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = '' } }}
        />
      </div>

      {images.length > 0 && (
        <div className="am-ml-thumbs">
          {images.map((im, i) => (
            <div
              key={im.id}
              className={`am-ml-thumb${over === i ? ' dragover' : ''}`}
              draggable
              onDragStart={() => { dragIdx.current = i }}
              onDragOver={(e) => { e.preventDefault(); setOver(i) }}
              onDragLeave={() => setOver((o) => (o === i ? null : o))}
              onDrop={() => onThumbDrop(i)}
              onDragEnd={() => { dragIdx.current = null; setOver(null) }}
            >
              <img src={im.url} alt={im.name} />
              {i === 0 && <span className="am-ml-thumb-cover">Cover</span>}
              <button
                className="am-ml-thumb-del"
                type="button"
                aria-label={`Remove ${im.name}`}
                onClick={(e) => { e.stopPropagation(); removeImage(im.id) }}
              >
                <XIcon size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ── ListingCard ── */

interface ListingCardProps {
  listing: Listing
  deleteOpen: boolean
  onEdit: (l: Listing) => void
  onToggle: (l: Listing) => void
  onDelete: (id: string) => void
  onDeleteOpen: (id: string) => void
  onDeleteClose: () => void
  onOpen: (l: Listing) => void
}

function ListingCard({ listing, deleteOpen, onEdit, onToggle, onDelete, onDeleteOpen, onDeleteClose, onOpen }: ListingCardProps) {
  const popRef = useRef<HTMLDivElement>(null)
  const deleteButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!deleteOpen) return
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) onDeleteClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { onDeleteClose(); deleteButtonRef.current?.focus() } }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); window.removeEventListener('keydown', onKey) }
  }, [deleteOpen, onDeleteClose])

  const coverImg = listing.images[0]
  const dateStr = new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <article className="am-ml-card">
      <button
        className="am-ml-card-open"
        aria-label={`Open ${listing.title}`}
        onClick={() => onOpen(listing)}
      />

      <div className="am-ml-card-media">
        {coverImg
          ? <img src={coverImg} alt={listing.title} loading="lazy" />
          : (
            <div className="am-ml-card-placeholder">
              <span>{listing.brand.toLowerCase()}.jpg</span>
            </div>
          )
        }
        <StatusBadge status={listing.status} />
        {listing.status === 'hidden' && (
          <div className="am-ml-card-hidden-overlay">
            <EyeOffIcon size={24} />
            <span>Not visible to buyers</span>
          </div>
        )}
      </div>

      <div className="am-ml-card-body">
        <div className="am-ml-card-chips">
          <span className="am-ml-card-chip">{listing.year}</span>
          <span className="am-ml-card-chip">{listing.fuel}</span>
          <span className="am-ml-card-chip">{listing.transmission}</span>
        </div>
        <h3 className="am-ml-card-title">{listing.title}</h3>
        <div className="am-ml-card-price-row">
          <div className="am-ml-card-price">€{fmtNum(listing.price)}</div>
          <div className="am-ml-card-mileage">{fmtNum(listing.mileage)} km</div>
        </div>
        <div className="am-ml-card-stats">
          <span><EyeIcon size={13} /> {fmtNum(listing.views)}</span>
          <span><MsgIcon size={13} /> {listing.inquiries}</span>
          <span>{dateStr}</span>
        </div>
      </div>

      <div className="am-ml-card-actions">
        <button
          className="am-ml-act"
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(listing) }}
        >
          <EditIcon size={14} /> Edit
        </button>
        <button
          className="am-ml-act"
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(listing) }}
        >
          {listing.status === 'hidden'
            ? <><EyeIcon size={14} /> Show</>
            : <><EyeOffIcon size={14} /> Hide</>
          }
        </button>
        <div className="am-ml-pop-wrap" ref={popRef}>
          <button
            ref={deleteButtonRef}
            className="am-ml-act am-ml-act--danger"
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              deleteOpen ? onDeleteClose() : onDeleteOpen(listing.id)
            }}
          >
            <TrashIcon size={14} /> Delete
          </button>
          {deleteOpen && (
            <div
              className="am-ml-pop"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="pop-title"
              aria-describedby="pop-desc"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 id="pop-title">Delete this listing?</h4>
              <p id="pop-desc">This can't be undone.</p>
              <div className="am-ml-pop-row">
                <button
                  className="am-btn am-ml-pop-del"
                  type="button"
                  onClick={() => { onDelete(listing.id) }}
                >
                  Delete
                </button>
                <button
                  className="am-btn am-btn--ghost"
                  type="button"
                  onClick={() => { onDeleteClose(); deleteButtonRef.current?.focus() }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/* ── ListingsTab ── */

interface ListingsTabProps {
  listings: Listing[]
  loading: boolean
  onEdit: (l: Listing) => void
  onToggle: (l: Listing) => void
  onDelete: (id: string) => Promise<void>
  onOpen: (l: Listing) => void
  onPostNew: () => void
}

function ListingsTab({ listings, loading, onEdit, onToggle, onDelete, onOpen, onPostNew }: ListingsTabProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setSf] = useState<StatusFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [delConfirm, setDc] = useState<string | null>(null)

  const activeCount = listings.filter((l) => l.status === 'active').length
  const hiddenCount = listings.filter((l) => l.status === 'hidden').length
  const pendingCount = listings.filter((l) => l.status === 'pending').length
  const totalViews = listings.reduce((n, l) => n + l.views, 0)
  const totalInq = listings.reduce((n, l) => n + l.inquiries, 0)

  const shown = useMemo(() => {
    let r = listings.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${l.title} ${l.brand} ${l.model}`.toLowerCase().includes(q)) return false
      }
      return true
    })
    r = [...r].sort((a, b) => {
      if (sortKey === 'newest') return b.createdAt.localeCompare(a.createdAt)
      if (sortKey === 'oldest') return a.createdAt.localeCompare(b.createdAt)
      if (sortKey === 'priceDesc') return b.price - a.price
      if (sortKey === 'views') return b.views - a.views
      if (sortKey === 'inquiries') return b.inquiries - a.inquiries
      return 0
    })
    return r
  }, [listings, search, statusFilter, sortKey])

  if (loading) {
    return (
      <div className="am-ml-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="am-ml-skeleton-card">
            <div className="am-ml-skeleton-media" />
            <div className="am-ml-skeleton-body">
              <div className="am-ml-skel" style={{ height: 12, width: '60%' }} />
              <div className="am-ml-skel" style={{ height: 16 }} />
              <div className="am-ml-skel" style={{ height: 12, width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="am-ml-empty">
        <div className="am-ml-empty-mark"><ImgIcon size={24} /></div>
        <h2>No listings yet</h2>
        <p>Post your first car to start reaching verified buyers.</p>
        <button className="am-btn am-btn--primary am-btn--lg" type="button" onClick={onPostNew}>
          Post a listing
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="am-ml-stats">
        <div className="am-ml-stat"><strong>{activeCount}</strong><span>Active</span></div>
        <div className="am-ml-stat"><strong>{hiddenCount}</strong><span>Hidden</span></div>
        <div className="am-ml-stat"><strong>{pendingCount}</strong><span>In Review</span></div>
        <div className="am-ml-stat"><strong>{fmtNum(totalViews)}</strong><span>Total views</span></div>
        <div className="am-ml-stat"><strong>{totalInq}</strong><span>Inquiries</span></div>
      </div>

      {listings.length > 4 && (
        <div className="am-ml-toolbar">
          <div className="am-ml-search">
            <SearchIcon size={18} />
            <input
              type="search"
              aria-label="Search your listings"
              placeholder="Search your listings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="am-ml-status-chips" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map(([v, l]) => (
              <button
                key={v}
                type="button"
                className="am-chip-toggle"
                aria-pressed={statusFilter === v}
                onClick={() => setSf(v)}
              >
                {l}
              </button>
            ))}
          </div>
          <select
            className="am-ml-sort"
            aria-label="Sort listings"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      )}

      <div className="am-ml-grid">
        {shown.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
            deleteOpen={delConfirm === l.id}
            onEdit={onEdit}
            onToggle={onToggle}
            onDelete={(id) => { onDelete(id); setDc(null) }}
            onDeleteOpen={setDc}
            onDeleteClose={() => setDc(null)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </>
  )
}

/* ── Wizard ── */

interface WizardProps {
  apiBrands: BrandDto[]
  brandsLoading: boolean
  initialContactName: string
  initialEmail: string
  mode?: 'create' | 'edit'
  initialListing?: Listing | null
  onSaved: (listing: Listing, mode: 'create' | 'edit') => void
}

function Wizard({
  apiBrands,
  brandsLoading,
  initialContactName,
  initialEmail,
  mode = 'create',
  initialListing,
  onSaved,
}: WizardProps) {
  const isEdit = mode === 'edit' && !!initialListing
  const [form, setForm] = useState<FormData>(() =>
    initialListing
      ? listingToForm(initialListing, initialEmail)
      : blankForm(initialContactName, initialEmail),
  )
  const [images, setImages] = useState<ImageEntry[]>(() => imagesFromListing(initialListing))
  const [features, setFeatures] = useState<Set<string>>(
    () => new Set(initialListing?.features ?? []),
  )
  const [section, setSection] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [localDraft, setLocalDraft] = useState<DraftState | null>(null)

  useEffect(() => {
    setForm(
      initialListing
        ? listingToForm(initialListing, initialEmail)
        : blankForm(initialContactName, initialEmail),
    )
    setImages(imagesFromListing(initialListing))
    setFeatures(new Set(initialListing?.features ?? []))
    setSection(0)
    setErrors({})
    setServerError('')
    setSubmitted(false)
    setLocalDraft(null)
  }, [initialListing, initialContactName, initialEmail])

  const set = (k: keyof FormData, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n })
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const toggleFeature = (f: string) =>
    setFeatures((s) => { const n = new Set(s); n.has(f) ? n.delete(f) : n.add(f); return n })

  // read draft on mount
  useEffect(() => {
    if (isEdit) return
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw) as DraftState
        if (d && d.savedAt) setLocalDraft(d)
      }
    } catch { /* ignore */ }
  }, [isEdit])

  // auto-save draft on every form/features change
  useEffect(() => {
    if (isEdit) return
    if (isDefaultForm(form) && features.size === 0) return
    const draft: DraftState = {
      form,
      features: Array.from(features),
      section,
      savedAt: Date.now(),
    }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch { /* ignore */ }
  }, [form, features, section, isEdit])

  const applyDraft = () => {
    if (!localDraft) return
    setForm((f) => ({ ...f, ...localDraft.form }))
    setFeatures(new Set(localDraft.features))
    setSection(localDraft.section)
    setLocalDraft(null)
  }

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setLocalDraft(null)
  }

  const validateSection = (s: number): boolean => {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (images.length < 1) e.images = 'Add at least one photo.'
    }
    if (s === 1) {
      if (!form.brand) e.brand = 'Select a brand.'
      if (!form.model.trim()) e.model = 'Enter the model.'
      const y = Number(form.year)
      if (!form.year || y < 1950 || y > CURRENT_YEAR + 1) e.year = `Year must be 1950–${CURRENT_YEAR + 1}.`
      if (form.mileage === '' || Number(form.mileage) < 0) e.mileage = 'Enter the mileage.'
      if (!form.price || Number(form.price) <= 0) e.price = 'Enter a price.'
    }
    if (s === 2) {
      if (!form.fuel) e.fuel = 'Select a fuel type.'
      if (!form.transmission) e.transmission = 'Select a transmission.'
      if (!form.condition) e.condition = 'Select a condition.'
    }
    if (s === 3) {
      if (form.description.trim().length < 30) e.description = 'Description must be at least 30 characters.'
    }
    if (s === 4) {
      if (!form.contactName.trim()) e.contactName = 'Enter your name.'
      if (!form.contactCity.trim()) e.contactCity = 'Enter your city.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) e.contactEmail = 'Enter a valid email.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validateSection(section)) setSection((s) => Math.min(4, s + 1)) }
  const back = () => setSection((s) => Math.max(0, s - 1))
  const jumpTo = (i: number) => { if (i <= section) setSection(i) }

  const handleSubmit = async () => {
    if (!validateSection(4)) return
    setServerError('')

    const brand = apiBrands.find((b) => b.name.toLowerCase() === form.brand.toLowerCase())
    if (!brand) {
      setServerError(
        brandsLoading
          ? 'Brands are still loading, please wait a moment.'
          : `Brand "${form.brand}" was not found. Please re-select from the list.`,
      )
      return
    }

    setSubmitting(true)
    try {
      const imagePayload = await Promise.all(
        images.map(async (img, i) => ({
          url: img.file ? await fileToBase64(img.file) : img.url,
          isCover: i === 0,
        }))
      )

      const payload = {
        title: form.title || `${form.year} ${form.brand} ${form.model}`.trim(),
        negotiable: form.negotiable,
        showPhone: form.showPhone,
        model: form.model,
        year: parseInt(form.year) || CURRENT_YEAR,
        mileage: parseInt(form.mileage) || 0,
        price: parseFloat(form.price) || 0,
        fuelType: FUEL_MAP[form.fuel] ?? 'Petrol',
        transmission: TRANSMISSION_MAP[form.transmission] ?? 'Automatic',
        condition: CONDITION_MAP[form.condition] ?? 'Good',
        description: form.description,
        bodyType: BODY_TYPE_MAP[form.bodyType] ?? 'Sedan',
        color: form.color ? COLOR_MAP[form.color] : undefined,
        doors: form.doors ? DOORS_MAP[form.doors] : undefined,
        seats: form.seats ? parseInt(form.seats) : undefined,
        engineSize: form.engineSize || undefined,
        horsepower: form.horsepower ? parseInt(form.horsepower) : undefined,
        vin: form.vin || undefined,
        brandId: brand.id,
        features: Array.from(features),
        images: imagePayload,
      }

      if (isEdit && initialListing) {
        await announcementApi.update(parseInt(initialListing.id, 10), payload)
        const updatedListing: Listing = {
          ...initialListing,
          title: payload.title,
          brandId: brand.id,
          brand: brand.name,
          model: form.model,
          year: parseInt(form.year) || CURRENT_YEAR,
          price: parseFloat(form.price) || 0,
          mileage: parseInt(form.mileage) || 0,
          fuel: payload.fuelType,
          transmission: payload.transmission,
          condition: payload.condition,
          bodyType: payload.bodyType,
          color: payload.color,
          doors: form.doors || undefined,
          seats: payload.seats,
          engineSize: payload.engineSize,
          horsepower: payload.horsepower,
          vin: payload.vin,
          description: payload.description,
          contactName: form.contactName,
          contactPhone: form.contactPhone,
          contactCity: form.contactCity,
          negotiable: payload.negotiable,
          showPhone: payload.showPhone,
          features: payload.features,
          images: imagePayload.map((img) => img.url),
        }
        setSubmitted(true)
        setTimeout(() => onSaved(updatedListing, 'edit'), 1200)
      } else {
        const created = await announcementApi.create(payload)

        const newListing: Listing = {
          id: String(created.id),
          title: created.title,
          brandId: created.brand.id,
          brand: created.brand.name,
          model: created.model,
          year: created.year,
          price: Number(created.price),
          mileage: created.mileage,
          fuel: created.fuelType,
          transmission: created.transmission,
          condition: created.condition,
          bodyType: created.bodyType,
          color: created.color,
          doors: created.doors,
          seats: created.seats,
          engineSize: created.engineSize,
          horsepower: created.horsepower,
          vin: created.vin,
          description: created.description,
          contactName: created.ownerName,
          contactPhone: created.ownerPhone,
          contactCity: created.ownerCity || '',
          negotiable: created.negotiable,
          showPhone: created.showPhone,
          features: created.features ?? payload.features,
          status: 'pending',
          images: created.images.map((i) => i.url),
          views: 0,
          inquiries: 0,
          createdAt: created.publishedAt.slice(0, 10),
        }

        localStorage.removeItem(DRAFT_KEY)
        setSubmitted(true)
        setTimeout(() => onSaved(newListing, 'create'), 2500)
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : `Failed to ${isEdit ? 'update' : 'create'} listing.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="am-ml-form-card">
        <div className="am-ml-success" role="status">
          <div className="am-ml-success-mark"><CheckIcon size={28} /></div>
          <h2>{isEdit ? 'Listing updated!' : 'Listing submitted!'}</h2>
          <p>
            {isEdit
              ? 'Your changes were saved and the listing has been updated.'
              : 'Your listing is under review and will go live within a few hours.'}
          </p>
        </div>
      </div>
    )
  }

  const progress = (section / (STEP_LABELS.length - 1)) * 100
  const sec = SECTIONS[section]
  const descLen = form.description.length

  return (
    <div className="am-ml-wizard">
      {isEdit && initialListing && (
        <div className="am-ml-draft-strip">
          <span>Editing <b>{initialListing.title}</b>.</span>
        </div>
      )}

      {!isEdit && localDraft && (
        <div className="am-ml-draft-strip">
          <span>You have an unsaved draft from <b>{timeAgo(localDraft.savedAt)}</b>.</span>
          <div className="am-ml-draft-actions">
            <button className="restore" type="button" onClick={applyDraft}>Restore</button>
            <button className="discard" type="button" onClick={discardDraft}>Discard</button>
          </div>
        </div>
      )}

      {/* progress meter */}
      <div className="am-ml-progress">
        <div
          className="am-ml-progress-track"
          style={{ '--progress': `${progress}%` } as React.CSSProperties}
        />
        {STEP_LABELS.map((label, i) => {
          const state = i === section ? 'active' : i < section ? 'done' : 'pending'
          return (
            <button
              key={label}
              type="button"
              className="am-ml-progress-dot"
              data-state={state}
              disabled={i > section}
              aria-current={i === section ? 'step' : undefined}
              onClick={() => jumpTo(i)}
            >
              <span className="am-ml-progress-num">
                {i < section ? <CheckIcon size={14} /> : i + 1}
              </span>
              <span className="am-ml-progress-label">{label}</span>
            </button>
          )
        })}
      </div>

      <div className="am-ml-form-card">
        <div className="am-ml-section-head">
          <h2 className="am-ml-section-title">
            {isEdit ? sec.title.replace('Upload', 'Edit').replace('Information', 'Info') : sec.title}
          </h2>
          <p className="am-ml-section-body">{sec.body}</p>
        </div>

        {serverError && (
          <div className="am-ml-server-err" role="alert">{serverError}</div>
        )}

        {/* section 0 — photos */}
        {section === 0 && (
          <>
            <ImageUploader images={images} setImages={setImages} onToast={showToast} />
            {errors.images && (
              <div className="am-ml-err" style={{ marginTop: 12 }} role="alert">{errors.images}</div>
            )}
          </>
        )}

        {/* section 1 — basic info */}
        {section === 1 && (
          <div className="am-ml-form-grid">
            <MlField
              full label="Listing title" htmlFor="f-title"
              hint="Leave blank to auto-generate from brand + model + year."
            >
              <input
                id="f-title"
                className="am-ml-input"
                maxLength={120}
                placeholder="e.g. 2020 BMW 3 Series — Full service history, no accidents"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </MlField>

            <MlField label="Brand" req htmlFor="f-brand" error={errors.brand}>
              <select
                id="f-brand"
                className="am-ml-select"
                aria-invalid={!!errors.brand}
                aria-describedby={errors.brand ? 'f-brand-err' : undefined}
                value={form.brand}
                onChange={(e) => set('brand', e.target.value)}
                disabled={brandsLoading}
              >
                <option value="">{brandsLoading ? 'Loading brands…' : 'Select brand'}</option>
                {apiBrands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </MlField>

            <MlField label="Model" req htmlFor="f-model" error={errors.model}>
              <input
                id="f-model"
                className="am-ml-input"
                placeholder="e.g. 320d, Corolla, Golf"
                aria-invalid={!!errors.model}
                aria-describedby={errors.model ? 'f-model-err' : undefined}
                value={form.model}
                onChange={(e) => set('model', e.target.value)}
              />
            </MlField>

            <MlField label="Year" req htmlFor="f-year" error={errors.year}>
              <input
                id="f-year"
                type="number"
                className="am-ml-input"
                min={1950}
                max={CURRENT_YEAR + 1}
                placeholder={String(CURRENT_YEAR)}
                aria-invalid={!!errors.year}
                aria-describedby={errors.year ? 'f-year-err' : undefined}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
              />
            </MlField>

            <MlField label="Mileage (km)" req htmlFor="f-km" error={errors.mileage}>
              <input
                id="f-km"
                type="number"
                className="am-ml-input"
                min={0}
                placeholder="e.g. 45000"
                aria-invalid={!!errors.mileage}
                aria-describedby={errors.mileage ? 'f-km-err' : undefined}
                value={form.mileage}
                onChange={(e) => set('mileage', e.target.value)}
              />
            </MlField>

            <MlField label="Asking price (€)" req htmlFor="f-price" error={errors.price}>
              <div className="am-ml-prefix">
                <span>€</span>
                <input
                  id="f-price"
                  type="number"
                  className="am-ml-input"
                  min={0}
                  placeholder="e.g. 24500"
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? 'f-price-err' : undefined}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                />
              </div>
            </MlField>

            <div className="am-ml-field am-ml-field--full">
              <label className="am-ml-check">
                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(e) => set('negotiable', e.target.checked)}
                />
                Price is negotiable
              </label>
            </div>
          </div>
        )}

        {/* section 2 — vehicle details */}
        {section === 2 && (
          <div className="am-ml-form-grid">
            <MlField label="Fuel type" req htmlFor="f-fuel" error={errors.fuel}>
              <select
                id="f-fuel"
                className="am-ml-select"
                aria-invalid={!!errors.fuel}
                aria-describedby={errors.fuel ? 'f-fuel-err' : undefined}
                value={form.fuel}
                onChange={(e) => set('fuel', e.target.value)}
              >
                <option value="">Select</option>
                {FUEL_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Transmission" req htmlFor="f-trans" error={errors.transmission}>
              <select
                id="f-trans"
                className="am-ml-select"
                aria-invalid={!!errors.transmission}
                aria-describedby={errors.transmission ? 'f-trans-err' : undefined}
                value={form.transmission}
                onChange={(e) => set('transmission', e.target.value)}
              >
                <option value="">Select</option>
                {TRANS_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Body type" htmlFor="f-body">
              <select
                id="f-body"
                className="am-ml-select"
                value={form.bodyType}
                onChange={(e) => set('bodyType', e.target.value)}
              >
                <option value="">Select</option>
                {BODY_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Condition" req htmlFor="f-cond" error={errors.condition}>
              <select
                id="f-cond"
                className="am-ml-select"
                aria-invalid={!!errors.condition}
                aria-describedby={errors.condition ? 'f-cond-err' : undefined}
                value={form.condition}
                onChange={(e) => set('condition', e.target.value)}
              >
                <option value="">Select</option>
                {COND_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Exterior color" htmlFor="f-color">
              <select
                id="f-color"
                className="am-ml-select"
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
              >
                <option value="">Select</option>
                {COLOR_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Number of doors" htmlFor="f-doors">
              <select
                id="f-doors"
                className="am-ml-select"
                value={form.doors}
                onChange={(e) => set('doors', e.target.value)}
              >
                <option value="">Select</option>
                {DOORS_OPTS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </MlField>

            <MlField label="Number of seats" htmlFor="f-seats">
              <input
                id="f-seats"
                type="number"
                className="am-ml-input"
                min={1}
                max={12}
                value={form.seats}
                onChange={(e) => set('seats', e.target.value)}
              />
            </MlField>

            <MlField label="Engine size (L)" htmlFor="f-engine">
              <input
                id="f-engine"
                className="am-ml-input"
                placeholder="e.g. 2.0"
                value={form.engineSize}
                onChange={(e) => set('engineSize', e.target.value)}
              />
            </MlField>

            <MlField label="Horsepower (hp)" htmlFor="f-hp">
              <input
                id="f-hp"
                type="number"
                className="am-ml-input"
                min={1}
                value={form.horsepower}
                onChange={(e) => set('horsepower', e.target.value)}
              />
            </MlField>

            <MlField
              full label="VIN number" htmlFor="f-vin"
              hint="Optional — helps build buyer trust significantly."
            >
              <input
                id="f-vin"
                className="am-ml-input"
                maxLength={17}
                value={form.vin}
                onChange={(e) => set('vin', e.target.value.toUpperCase())}
              />
            </MlField>
          </div>
        )}

        {/* section 3 — description + features */}
        {section === 3 && (
          <div className="am-ml-form-grid">
            <MlField
              full label="Description" req htmlFor="f-desc"
              error={errors.description}
              hint={`${descLen} / 2000`}
              hintClass={`am-ml-counter${descLen >= 2000 ? ' am-ml-counter--max' : ''}`}
            >
              <textarea
                id="f-desc"
                className="am-ml-textarea"
                rows={7}
                maxLength={2000}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'f-desc-err' : 'f-desc-hint'}
                placeholder="Include the car's history, any recent work done (tyres, brakes, timing belt...), reason for selling, known issues, accident history, number of previous owners, etc."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </MlField>

            <div className="am-ml-field am-ml-field--full">
              <label className="am-ml-label">Features &amp; Equipment</label>
              <div className="am-ml-features">
                {FEATURES.map((f) => (
                  <label key={f} className="am-ml-feature">
                    <input
                      type="checkbox"
                      checked={features.has(f)}
                      onChange={() => toggleFeature(f)}
                    />
                    <CheckIcon size={14} className="am-ml-feature-check" />
                    {f}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* section 4 — contact + review */}
        {section === 4 && (
          <>
            <div className="am-ml-form-grid">
              <MlField label="Full name" req htmlFor="f-cn" error={errors.contactName}>
                <input
                  id="f-cn"
                  className="am-ml-input"
                  placeholder="Your name or business name"
                  aria-invalid={!!errors.contactName}
                  aria-describedby={errors.contactName ? 'f-cn-err' : undefined}
                  value={form.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                />
              </MlField>

              <MlField label="City / Location" req htmlFor="f-city" error={errors.contactCity}>
                <input
                  id="f-city"
                  className="am-ml-input"
                  placeholder="e.g. Bucharest, Cluj-Napoca"
                  aria-invalid={!!errors.contactCity}
                  aria-describedby={errors.contactCity ? 'f-city-err' : undefined}
                  value={form.contactCity}
                  onChange={(e) => set('contactCity', e.target.value)}
                />
              </MlField>

              <MlField label="Phone number" htmlFor="f-phone">
                <input
                  id="f-phone"
                  type="tel"
                  className="am-ml-input"
                  placeholder="e.g. +40 712 345 678"
                  value={form.contactPhone}
                  onChange={(e) => set('contactPhone', e.target.value)}
                />
              </MlField>

              <MlField label="Email address" req htmlFor="f-email" error={errors.contactEmail}>
                <input
                  id="f-email"
                  type="email"
                  className="am-ml-input"
                  placeholder="your@email.com"
                  aria-invalid={!!errors.contactEmail}
                  aria-describedby={errors.contactEmail ? 'f-email-err' : undefined}
                  value={form.contactEmail}
                  onChange={(e) => set('contactEmail', e.target.value)}
                />
              </MlField>

              <div className="am-ml-field am-ml-field--full">
                <label className="am-ml-check">
                  <input
                    type="checkbox"
                    checked={form.showPhone}
                    onChange={(e) => set('showPhone', e.target.checked)}
                  />
                  Show phone number publicly on listing
                </label>
              </div>
            </div>

            <div className="am-ml-review">
              <div className="am-ml-review-title">
                {isEdit ? 'Review before saving' : 'Review before publishing'}
              </div>
              <dl>
                <dt>Title</dt>
                <dd>{form.title || `${form.brand} ${form.model} ${form.year}`.trim() || '—'}</dd>
                <dt>Price</dt>
                <dd>{form.price ? `€${fmtNum(Number(form.price))}${form.negotiable ? ' (negotiable)' : ''}` : '—'}</dd>
                <dt>Mileage</dt>
                <dd>{form.mileage ? `${fmtNum(Number(form.mileage))} km` : '—'}</dd>
                <dt>Year</dt>
                <dd>{form.year || '—'}</dd>
                <dt>Fuel</dt>
                <dd>{form.fuel || '—'}</dd>
                <dt>Transmission</dt>
                <dd>{form.transmission || '—'}</dd>
                <dt>Condition</dt>
                <dd>{form.condition || '—'}</dd>
                <dt>Photos</dt>
                <dd className={images.length ? 'copper' : 'warn'}>
                  {images.length ? `${images.length} photo${images.length > 1 ? 's' : ''}` : 'None — strongly recommended'}
                </dd>
                <dt>Features</dt>
                <dd>{features.size ? `${features.size} selected` : '—'}</dd>
              </dl>
            </div>
          </>
        )}

        {/* nav row */}
        <div className="am-ml-form-nav">
          {section > 0
            ? (
              <button className="am-btn am-btn--outline am-btn--lg" type="button" onClick={back}>
                <ArrowLIcon size={16} /> Back
              </button>
            )
            : <span />
          }
          <span className="spacer" />
          {section < 4
            ? (
              <button className="am-btn am-btn--primary am-btn--lg" type="button" onClick={next}>
                Next: {STEP_LABELS[section + 1]} <ArrowRIcon size={16} />
              </button>
            )
            : (
              <button
                className="am-btn am-btn--primary am-btn--lg"
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? (isEdit ? 'Saving…' : 'Publishing…')
                  : (isEdit ? 'Save changes' : 'Publish listing')}
              </button>
            )
          }
        </div>
      </div>

      {toast && <div className="am-ml-toast">{toast}</div>}
    </div>
  )
}

/* ── main page ── */

function AmMyListings() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tab = ((searchParams.get('tab') ?? 'listings') as Tab)
  const editId = searchParams.get('edit')

  const switchTab = (t: Tab) => setSearchParams({ tab: t }, { replace: true })

  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [apiBrands, setApiBrands] = useState<BrandDto[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [editingListing, setEditingListing] = useState<Listing | null>(null)

  const openCreate = () => {
    setEditingListing(null)
    setSearchParams({ tab: 'new' }, { replace: true })
  }

  const openListings = () => {
    setEditingListing(null)
    setSearchParams({ tab: 'listings' }, { replace: true })
  }

  useEffect(() => {
    brandApi.getAll()
      .then(setApiBrands)
      .catch((err) => setPageError(getApiErrorMessage(err)))
      .finally(() => setBrandsLoading(false))
  }, [])

  useEffect(() => {
    if (!user) { setListingsLoading(false); return }
    announcementApi.getAll()
      .then((all) => {
        setPageError('')
        const mine = all
          .filter((a) => a.userId === user.id)
          .map((a) => ({
            id: String(a.id),
            title: a.title || `${a.brand.name} ${a.model} ${a.year}`,
            brandId: a.brand.id,
            brand: a.brand.name,
            model: a.model,
            year: a.year,
            price: Number(a.price),
            mileage: a.mileage,
            fuel: a.fuelType,
            transmission: a.transmission,
            condition: a.condition,
            bodyType: a.bodyType,
            color: a.color,
            doors: a.doors,
            seats: a.seats,
            engineSize: a.engineSize,
            horsepower: a.horsepower,
            vin: a.vin,
            description: a.description,
            contactName: a.ownerName,
            contactPhone: a.ownerPhone,
            contactCity: a.ownerCity || '',
            negotiable: a.negotiable,
            showPhone: a.showPhone,
            features: a.features ?? [],
            status: (API_STATUS_MAP[a.status] ?? 'pending') as ListingStatus,
            images: a.images.map((i) => i.url),
            views: a.views,
            inquiries: a.inquiries,
            createdAt: a.publishedAt.slice(0, 10),
          }))
        setListings(mine)
      })
      .catch((err) => setPageError(getApiErrorMessage(err)))
      .finally(() => setListingsLoading(false))
  }, [user])

  useEffect(() => {
    if (tab !== 'new' || !editId || editingListing) return
    const listing = listings.find((item) => item.id === editId)
    if (listing) setEditingListing(listing)
  }, [tab, editId, editingListing, listings])

  const handleToggle = async (l: Listing) => {
    if (l.status === 'pending') return
    const nextStatus = l.status === 'hidden' ? 'active' : 'hidden'
    try {
      setPageError('')
      await announcementApi.update(parseInt(l.id, 10), {
        status: nextStatus === 'active' ? 'Active' : 'Hidden',
      })
      setListings((prev) =>
        prev.map((x) => (x.id === l.id ? { ...x, status: nextStatus } : x)),
      )
    } catch (err) {
      setPageError(getApiErrorMessage(err))
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setPageError('')
      await announcementApi.delete(parseInt(id, 10))
      setListings((prev) => prev.filter((l) => l.id !== id))
    } catch (err) {
      setPageError(getApiErrorMessage(err))
    }
  }

  const handleEdit = (l: Listing) => {
    setEditingListing(l)
    setSearchParams({ tab: 'new', edit: l.id }, { replace: true })
  }

  const handleOpen = (l: Listing) =>
    navigate('/car-details', {
      state: {
        offer: {
          id: l.id,
          title: l.title,
          price: l.price,
          currency: 'EUR',
          year: l.year,
          km: l.mileage,
          fuel: l.fuel.toLowerCase(),
          transmission: l.transmission.toLowerCase(),
          powerHp: undefined,
          location: l.contactCity || user?.city || 'Moldova',
          description: l.description,
          bodyType: reverseMap(BODY_TYPE_MAP, l.bodyType),
          condition: reverseMap(CONDITION_MAP, l.condition),
          color: reverseMap(COLOR_MAP, l.color),
          doors: typeof l.doors === 'number' ? l.doors : Number(l.doors) || undefined,
          seats: l.seats,
          engineSize: l.engineSize,
          vin: l.vin,
          negotiable: l.negotiable,
          showPhone: l.showPhone,
          features: l.features,
          imageUrl: l.images[0] ?? null,
          images: l.images,
          isNew: l.status === 'active',
        },
      },
    })

  const handleSaved = (listing: Listing, mode: 'create' | 'edit') => {
    setListings((prev) =>
      mode === 'edit'
        ? prev.map((item) => (item.id === listing.id ? listing : item))
        : [listing, ...prev],
    )
    setEditingListing(null)
    switchTab('listings')
  }

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />

      <main className="am-shell am-ml">
        <div className="am-ml-head">
          <div>
            <h1 className="am-ml-title">My Listings</h1>
            <p className="am-ml-sub">Manage, edit, or create car sale offers in one place.</p>
          </div>
          <button
            className="am-btn am-btn--primary am-btn--lg"
            type="button"
            onClick={() => (tab === 'new' ? openListings() : openCreate())}
          >
            {tab === 'new'
              ? 'Back to listings'
              : <><>Post new listing</> <PlusIcon size={16} /></>
            }
          </button>
        </div>

        <div className="am-ml-tabs" role="tablist" aria-label="My Listings sections">
          <button
            className="am-ml-tab"
            role="tab"
            aria-selected={tab === 'listings'}
            onClick={openListings}
          >
            Your listings
            {listings.length > 0 && (
              <span className="am-ml-tab-badge">{listings.length}</span>
            )}
          </button>
          <button
            className="am-ml-tab"
            role="tab"
            aria-selected={tab === 'new'}
            onClick={openCreate}
          >
            {editingListing ? 'Edit listing' : 'New listing'}
          </button>
        </div>

        <div role="tabpanel" aria-label={tab === 'listings' ? 'Your listings' : 'New listing'}>
          {pageError && <div className="am-alert" role="alert">{pageError}</div>}
          {tab === 'listings' ? (
            <ListingsTab
              listings={listings}
              loading={listingsLoading}
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onOpen={handleOpen}
              onPostNew={openCreate}
            />
          ) : (
            <Wizard
              apiBrands={apiBrands}
              brandsLoading={brandsLoading}
              initialContactName={user?.fullName ?? ''}
              initialEmail={user?.email ?? ''}
              mode={editingListing ? 'edit' : 'create'}
              initialListing={editingListing}
              onSaved={handleSaved}
            />
          )}
        </div>
      </main>

      <AmFooter />
    </div>
  )
}

export default AmMyListings
