import { useState, useRef, useCallback, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import type { SocialItem } from '../../components/home/types'
import { announcementApi, brandApi } from '../../services/api.ts'
import type { BrandDto } from '../../services/api.ts'
import { useAuth } from '../../context/AuthContext.tsx'
import './MyListings.css'

type Tab = 'listings' | 'new'
type ListingStatus = 'active' | 'hidden' | 'pending'

interface Listing {
  id: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: string
  transmission: string
  status: ListingStatus
  images: string[]
  views: number
  inquiries: number
  createdAt: string
}

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
const STATUS_MAP: Record<string, ListingStatus> = {
  Active: 'active', Hidden: 'hidden', Pending: 'pending',
}

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG', 'CNG']
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Minivan']
const CONDITIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Parts Only']
const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Yellow', 'Orange', 'Other']
const FEATURES = [
  'Air Conditioning', 'Heated Seats', 'Leather Seats', 'Sunroof / Moonroof',
  'Navigation System', 'Backup Camera', 'Parking Sensors', 'Bluetooth',
  'Apple CarPlay / Android Auto', 'Cruise Control', 'Adaptive Cruise Control',
  'Lane Departure Warning', 'Blind Spot Monitor', 'Keyless Entry', 'Push to Start',
  'Remote Start', 'Wireless Charging', 'Premium Sound System',
  'Third Row Seating', 'Tow Package', 'All-Wheel Drive', '4x4 / Off-Road Package',
]

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
  features: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  contactCity: string
  negotiable: boolean
  showPhone: boolean
}

const initialForm: FormData = {
  title: '', brand: '', model: '', year: '', price: '', mileage: '',
  fuel: '', transmission: '', bodyType: '', color: '', condition: '',
  doors: '', seats: '', engineSize: '', horsepower: '', vin: '',
  description: '', features: [],
  contactName: '', contactPhone: '', contactEmail: '', contactCity: '',
  negotiable: false, showPhone: true,
}

const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

const FORM_SECTIONS = ['Photos', 'Basic Info', 'Vehicle Details', 'Description & Features', 'Contact & Review']

function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={`listing-status listing-status--${status}`}>
      {status === 'active' && (
        <><svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" /></svg>Active</>
      )}
      {status === 'hidden' && (
        <><svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" /></svg>Hidden</>
      )}
      {status === 'pending' && (
        <><svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3.5" /></svg>In Review</>
      )}
    </span>
  )
}

interface ImageEntry {
  url: string
  name: string
  file: File
}

interface ImageUploadAreaProps {
  images: { url: string; name: string }[]
  onAdd: (files: FileList) => void
  onRemove: (index: number) => void
}

function ImageUploadArea({ images, onAdd, onRemove }: ImageUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (e.dataTransfer.files) onAdd(e.dataTransfer.files)
    },
    [onAdd],
  )

  return (
    <div className="image-upload-section">
      <div className="image-upload-grid">
        {images.map((img, i) => (
          <div key={i} className="image-thumb">
            {i === 0 && <span className="image-thumb__badge">Cover</span>}
            <img src={img.url} alt={img.name} />
            <button
              type="button"
              className="image-thumb__remove"
              onClick={() => onRemove(i)}
              aria-label="Remove image"
            >
              <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ))}

        {images.length < 10 && (
          <button
            type="button"
            className={`image-upload-drop ${dragging ? 'is-dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="image-upload-drop__icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <span>Click or drag photos here</span>
            <small>{images.length} / 10 uploaded</small>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => e.target.files && onAdd(e.target.files)}
      />
      <p className="image-upload-hint">
        Max 10 photos · JPG, PNG, WEBP · First photo becomes the cover image
      </p>
    </div>
  )
}

function MyListings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('listings')
  const [listings, setListings] = useState<Listing[]>([])
  const [listingsLoading, setListingsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(initialForm)
  const [images, setImages] = useState<ImageEntry[]>([])
  const [formSection, setFormSection] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [apiBrands, setApiBrands] = useState<BrandDto[]>([])
  const [brandsLoading, setBrandsLoading] = useState(true)

  useEffect(() => {
    brandApi
      .getAll()
      .then(setApiBrands)
      .catch(() => {})
      .finally(() => setBrandsLoading(false))
  }, [])

  useEffect(() => {
    if (!user) {
      setListingsLoading(false)
      return
    }
    announcementApi
      .getAll()
      .then((all) => {
        const mine = all
          .filter((a) => a.userId === user.id)
          .map((a) => ({
            id: String(a.id),
            title: a.title || `${a.brand.name} ${a.model} ${a.year}`,
            brand: a.brand.name,
            model: a.model,
            year: a.year,
            price: Number(a.price),
            mileage: a.mileage,
            fuel: a.fuelType,
            transmission: a.transmission,
            status: STATUS_MAP[a.status] ?? ('pending' as ListingStatus),
            images: a.images.map((i) => i.url),
            views: a.views,
            inquiries: a.inquiries,
            createdAt: a.publishedAt.slice(0, 10),
          }))
        setListings(mine)
      })
      .catch(() => {})
      .finally(() => setListingsLoading(false))
  }, [user])

  const handleToggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'hidden' ? 'active' : 'hidden' }
          : l,
      ),
    )
  }

  const handleDelete = async (id: string) => {
    try {
      await announcementApi.delete(parseInt(id))
      setListings((prev) => prev.filter((l) => l.id !== id))
    } catch {
      // keep listing in UI if delete fails
    }
    setDeleteConfirm(null)
  }

  const handleAddImages = (files: FileList) => {
    const remaining = 10 - images.length
    const toAdd = Array.from(files).slice(0, remaining)
    const newImages = toAdd.map((f) => ({ url: URL.createObjectURL(f), name: f.name, file: f }))
    setImages((prev) => [...prev, ...newImages])
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleFeatureToggle = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleNext = () => {
    if (formSection === 0 && images.length === 0) {
      setFormError('Please add at least one photo before continuing.')
      return
    }
    setFormError('')
    setFormSection((s) => s + 1)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    if (images.length === 0) {
      setFormError('Please add at least one photo before publishing.')
      return
    }

    if (!form.brand) {
      setFormError('Please select a brand.')
      return
    }

    const brand = apiBrands.find(
      (b) => b.name.toLowerCase() === form.brand.toLowerCase(),
    )
    if (!brand) {
      setFormError(
        brandsLoading
          ? 'Brands are still loading, please wait a moment and try again.'
          : `Brand "${form.brand}" was not found. Please re-select a brand from the list.`,
      )
      return
    }

    setSubmitting(true)
    try {
      const base64Images = await Promise.all(
        images.map((img, i) =>
          fileToBase64(img.file).then((url) => ({ url, isCover: i === 0 }))
        )
      )

      const created = await announcementApi.create({
        title: form.title || `${form.year} ${form.brand} ${form.model}`.trim(),
        negotiable: form.negotiable,
        showPhone: form.showPhone,
        model: form.model,
        year: parseInt(form.year) || new Date().getFullYear(),
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
        images: base64Images,
      })

      const newListing: Listing = {
        id: String(created.id),
        title: created.title,
        brand: created.brand.name,
        model: created.model,
        year: created.year,
        price: Number(created.price),
        mileage: created.mileage,
        fuel: created.fuelType,
        transmission: created.transmission,
        status: 'pending',
        images: created.images.map((i) => i.url),
        views: 0,
        inquiries: 0,
        createdAt: created.publishedAt.slice(0, 10),
      }
      setListings((prev) => [newListing, ...prev])
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setActiveTab('listings')
        setForm(initialForm)
        setImages([])
        setFormSection(0)
      }, 2500)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create listing.')
    } finally {
      setSubmitting(false)
    }
  }

  const activeCount = listings.filter((l) => l.status === 'active').length
  const hiddenCount = listings.filter((l) => l.status === 'hidden').length
  const pendingCount = listings.filter((l) => l.status === 'pending').length

  return (
    <>
      <Navbar />
      <main className="my-listings-page">
        <div className="container">

          {/* ── Page header ── */}
          <div className="ml-header">
            <div className="ml-header__top">
              <div className="ml-header__copy">
                <h1>My Listings</h1>
                <p>Manage, edit, or create car sale offers in one place.</p>
              </div>
              <button
                type="button"
                className="primary-btn ml-new-btn"
                onClick={() => {
                  setActiveTab(activeTab === 'new' ? 'listings' : 'new')
                  setFormSection(0)
                }}
              >
                {activeTab === 'new' ? (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back to listings
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Post new listing
                  </>
                )}
              </button>
            </div>

            <div className="ml-tabs">
              <button
                type="button"
                className={`ml-tab ${activeTab === 'listings' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('listings')}
              >
                Your listings
                {listings.length > 0 && <span className="ml-tab__count">{listings.length}</span>}
              </button>
              <button
                type="button"
                className={`ml-tab ${activeTab === 'new' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('new')}
              >
                New listing
              </button>
            </div>
          </div>

          {/* ── Stats strip (listings view only) ── */}
          {activeTab === 'listings' && listings.length > 0 && (
            <div className="ml-stats-strip">
              <div className="ml-stat">
                <strong>{activeCount}</strong>
                <span>Active</span>
              </div>
              <div className="ml-stat ml-stat--hidden">
                <strong>{hiddenCount}</strong>
                <span>Hidden</span>
              </div>
              <div className="ml-stat ml-stat--pending">
                <strong>{pendingCount}</strong>
                <span>In Review</span>
              </div>
              <div className="ml-stat">
                <strong>{listings.reduce((sum, l) => sum + l.views, 0)}</strong>
                <span>Total views</span>
              </div>
              <div className="ml-stat">
                <strong>{listings.reduce((sum, l) => sum + l.inquiries, 0)}</strong>
                <span>Inquiries</span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              LISTINGS VIEW
          ══════════════════════════════════════════ */}
          {activeTab === 'listings' && (
            <div className="listings-panel">
              {listingsLoading ? (
                <p style={{ padding: '2rem', textAlign: 'center' }}>Loading your listings…</p>
              ) : listings.length === 0 ? (
                <div className="listings-empty">
                  <div className="listings-empty__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3>No listings yet</h3>
                  <p>Post your first car to start reaching verified buyers.</p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setActiveTab('new')}
                  >
                    Post a listing
                  </button>
                </div>
              ) : (
                <div className="listings-grid">
                  {listings.map((listing) => (
                    <article
                      key={listing.id}
                      className={`listing-card ${listing.status === 'hidden' ? 'is-hidden' : ''}`}
                    >
                      <div className="listing-card__media">
                        <img
                          src={listing.images[0] || 'https://placehold.co/600x400/F8FAFC/111827?text=No+Photo'}
                          alt={listing.title}
                          loading="lazy"
                        />
                        <StatusBadge status={listing.status} />
                        {listing.status === 'hidden' && (
                          <div className="listing-card__hidden-overlay">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                            <span>Not visible to buyers</span>
                          </div>
                        )}
                      </div>

                      <div className="listing-card__body">
                        <div className="listing-card__chips">
                          <span className="listing-chip">{listing.year}</span>
                          <span className="listing-chip">{listing.fuel}</span>
                          <span className="listing-chip">{listing.transmission}</span>
                        </div>

                        <h3 className="listing-card__title">{listing.title}</h3>

                        <div className="listing-card__price-row">
                          <span className="listing-card__price">
                            €{listing.price.toLocaleString()}
                          </span>
                          <span className="listing-card__mileage">
                            {listing.mileage.toLocaleString()} km
                          </span>
                        </div>

                        <div className="listing-card__stats">
                          <span className="listing-stat">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            {listing.views.toLocaleString()} views
                          </span>
                          <span className="listing-stat">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            {listing.inquiries} inquiries
                          </span>
                          <span className="listing-date">
                            {new Date(listing.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="listing-card__actions">
                          <button type="button" className="ghost-btn lc-action-btn">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>

                          <button
                            type="button"
                            className="ghost-btn lc-action-btn"
                            onClick={() => handleToggleStatus(listing.id)}
                          >
                            {listing.status === 'hidden' ? (
                              <>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                Show
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                Hide
                              </>
                            )}
                          </button>

                          {deleteConfirm === listing.id ? (
                            <div className="delete-confirm">
                              <span>Sure?</span>
                              <button
                                type="button"
                                className="danger-btn lc-action-btn"
                                onClick={() => handleDelete(listing.id)}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="ghost-btn lc-action-btn"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="danger-btn lc-action-btn"
                              onClick={() => setDeleteConfirm(listing.id)}
                            >
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════
              NEW LISTING FORM
          ══════════════════════════════════════════ */}
          {activeTab === 'new' && (
            <div className="new-listing-panel">
              {submitted ? (
                <div className="submit-success">
                  <div className="submit-success__icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h2>Listing submitted!</h2>
                  <p>Your listing is under review and will go live within a few hours.</p>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="form-steps">
                    {FORM_SECTIONS.map((section, i) => (
                      <button
                        key={section}
                        type="button"
                        className={`form-step ${i === formSection ? 'is-active' : ''} ${i < formSection ? 'is-done' : ''}`}
                        onClick={() => setFormSection(i)}
                      >
                        <span className="form-step__num">
                          {i < formSection ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className="form-step__label">{section}</span>
                      </button>
                    ))}
                    <div
                      className="form-steps__track"
                      style={{ '--progress': `${(formSection / (FORM_SECTIONS.length - 1)) * 100}%` } as React.CSSProperties}
                    />
                  </div>

                  <form
                    className="listing-form"
                    onSubmit={handleSubmit}
                    noValidate
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA')
                        e.preventDefault()
                    }}
                  >

                    {/* ── SECTION 0: Photos ── */}
                    {formSection === 0 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Upload Photos</h2>
                          <p>
                            Listings with good photos get up to 5× more inquiries.
                            Add up to 10 images — the first one becomes the cover.
                          </p>
                        </div>
                        <ImageUploadArea
                          images={images.map(({ url, name }) => ({ url, name }))}
                          onAdd={handleAddImages}
                          onRemove={handleRemoveImage}
                        />
                      </div>
                    )}

                    {/* ── SECTION 1: Basic Info ── */}
                    {formSection === 1 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Basic Information</h2>
                          <p>Fill in the key details that buyers search for first.</p>
                        </div>
                        <div className="form-grid">
                          <div className="form-field col-full">
                            <label htmlFor="f-title">Listing title</label>
                            <input
                              id="f-title"
                              type="text"
                              placeholder="e.g. 2020 BMW 3 Series — Full service history, no accidents"
                              value={form.title}
                              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                              maxLength={120}
                            />
                            <span className="field-hint">
                              Leave blank to auto-generate from brand + model + year.
                            </span>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-brand">Brand *</label>
                            <select
                              id="f-brand"
                              value={form.brand}
                              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                              required
                              disabled={brandsLoading}
                            >
                              <option value="">
                                {brandsLoading ? 'Loading brands…' : 'Select brand'}
                              </option>
                              {apiBrands.map((b) => (
                                <option key={b.id} value={b.name}>{b.name}</option>
                              ))}
                            </select>
                            {brandsLoading && (
                              <span className="field-hint">Loading available brands…</span>
                            )}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-model">Model *</label>
                            <input
                              id="f-model"
                              type="text"
                              placeholder="e.g. 320d, Corolla, Golf"
                              value={form.model}
                              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-year">Year *</label>
                            <input
                              id="f-year"
                              type="number"
                              placeholder="e.g. 2019"
                              min="1950"
                              max={new Date().getFullYear() + 1}
                              value={form.year}
                              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-mileage">Mileage (km) *</label>
                            <input
                              id="f-mileage"
                              type="number"
                              placeholder="e.g. 50000"
                              min="0"
                              value={form.mileage}
                              onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-price">Asking price (€) *</label>
                            <div className="input-affix-wrap">
                              <span className="input-prefix">€</span>
                              <input
                                id="f-price"
                                type="number"
                                placeholder="e.g. 15000"
                                min="0"
                                value={form.price}
                                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                required
                              />
                            </div>
                          </div>

                          <div className="form-field col-full">
                            <label className="check-label">
                              <input
                                type="checkbox"
                                checked={form.negotiable}
                                onChange={(e) => setForm((f) => ({ ...f, negotiable: e.target.checked }))}
                              />
                              Price is negotiable
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SECTION 2: Vehicle Details ── */}
                    {formSection === 2 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Vehicle Details</h2>
                          <p>More detail builds trust. Fill in as many fields as you can.</p>
                        </div>
                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor="f-fuel">Fuel type *</label>
                            <select
                              id="f-fuel"
                              value={form.fuel}
                              onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))}
                              required
                            >
                              <option value="">Select fuel</option>
                              {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-transmission">Transmission *</label>
                            <select
                              id="f-transmission"
                              value={form.transmission}
                              onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                              required
                            >
                              <option value="">Select transmission</option>
                              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-bodyType">Body type</label>
                            <select
                              id="f-bodyType"
                              value={form.bodyType}
                              onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value }))}
                            >
                              <option value="">Select body type</option>
                              {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-condition">Condition *</label>
                            <select
                              id="f-condition"
                              value={form.condition}
                              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                              required
                            >
                              <option value="">Select condition</option>
                              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-color">Exterior color</label>
                            <select
                              id="f-color"
                              value={form.color}
                              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                            >
                              <option value="">Select color</option>
                              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-doors">Number of doors</label>
                            <select
                              id="f-doors"
                              value={form.doors}
                              onChange={(e) => setForm((f) => ({ ...f, doors: e.target.value }))}
                            >
                              <option value="">Select</option>
                              {['2', '3', '4', '5'].map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-seats">Number of seats</label>
                            <input
                              id="f-seats"
                              type="number"
                              placeholder="e.g. 5"
                              min="1"
                              max="12"
                              value={form.seats}
                              onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-engine">Engine size (L)</label>
                            <input
                              id="f-engine"
                              type="text"
                              placeholder="e.g. 2.0"
                              value={form.engineSize}
                              onChange={(e) => setForm((f) => ({ ...f, engineSize: e.target.value }))}
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-hp">Horsepower (hp)</label>
                            <input
                              id="f-hp"
                              type="number"
                              placeholder="e.g. 150"
                              min="1"
                              value={form.horsepower}
                              onChange={(e) => setForm((f) => ({ ...f, horsepower: e.target.value }))}
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-vin">VIN number</label>
                            <input
                              id="f-vin"
                              type="text"
                              placeholder="17-character VIN"
                              maxLength={17}
                              value={form.vin}
                              onChange={(e) => setForm((f) => ({ ...f, vin: e.target.value.toUpperCase() }))}
                            />
                            <span className="field-hint">Optional — helps build buyer trust significantly.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── SECTION 3: Description & Features ── */}
                    {formSection === 3 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Description & Features</h2>
                          <p>Describe the car honestly and highlight what makes it stand out.</p>
                        </div>

                        <div className="form-field">
                          <label htmlFor="f-desc">Description *</label>
                          <textarea
                            id="f-desc"
                            rows={7}
                            placeholder="Include the car's history, any recent work done (tyres, brakes, timing belt...), reason for selling, known issues, accident history, number of previous owners, etc."
                            value={form.description}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                description: e.target.value.slice(0, 2000),
                              }))
                            }
                            required
                          />
                          <span className="field-hint field-hint--right">
                            {form.description.length} / 2000
                          </span>
                        </div>

                        <div className="form-field">
                          <label>Features & Equipment</label>
                          <div className="features-grid">
                            {FEATURES.map((feat) => (
                              <label
                                key={feat}
                                className={`feature-chip ${form.features.includes(feat) ? 'is-active' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  hidden
                                  checked={form.features.includes(feat)}
                                  onChange={() => handleFeatureToggle(feat)}
                                />
                                {form.features.includes(feat) && (
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                                {feat}
                              </label>
                            ))}
                          </div>
                          {form.features.length > 0 && (
                            <span className="field-hint">{form.features.length} feature{form.features.length !== 1 ? 's' : ''} selected</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── SECTION 4: Contact & Review ── */}
                    {formSection === 4 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Contact Information</h2>
                          <p>Buyers will use this to reach you. Keep it accurate and up to date.</p>
                        </div>
                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor="f-name">Full name *</label>
                            <input
                              id="f-name"
                              type="text"
                              placeholder="Your name or business name"
                              value={form.contactName}
                              onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-city">City / Location *</label>
                            <input
                              id="f-city"
                              type="text"
                              placeholder="e.g. Bucharest, Cluj-Napoca"
                              value={form.contactCity}
                              onChange={(e) => setForm((f) => ({ ...f, contactCity: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-phone">Phone number</label>
                            <input
                              id="f-phone"
                              type="tel"
                              placeholder="e.g. +40 712 345 678"
                              value={form.contactPhone}
                              onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                            />
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-email">Email address *</label>
                            <input
                              id="f-email"
                              type="email"
                              placeholder="your@email.com"
                              value={form.contactEmail}
                              onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="form-field col-full">
                            <label className="check-label">
                              <input
                                type="checkbox"
                                checked={form.showPhone}
                                onChange={(e) => setForm((f) => ({ ...f, showPhone: e.target.checked }))}
                              />
                              Show phone number publicly on listing
                            </label>
                          </div>
                        </div>

                        {/* Review summary */}
                        <div className="review-summary">
                          <h3>Review before publishing</h3>
                          <div className="review-grid">
                            <span>Title</span>
                            <strong>
                              {form.title || [form.year, form.brand, form.model].filter(Boolean).join(' ') || '—'}
                            </strong>
                            <span>Price</span>
                            <strong>
                              {form.price
                                ? `€${parseInt(form.price).toLocaleString()}${form.negotiable ? ' (negotiable)' : ''}`
                                : '—'}
                            </strong>
                            <span>Mileage</span>
                            <strong>
                              {form.mileage ? `${parseInt(form.mileage).toLocaleString()} km` : '—'}
                            </strong>
                            <span>Year</span>
                            <strong>{form.year || '—'}</strong>
                            <span>Fuel</span>
                            <strong>{form.fuel || '—'}</strong>
                            <span>Transmission</span>
                            <strong>{form.transmission || '—'}</strong>
                            <span>Condition</span>
                            <strong>{form.condition || '—'}</strong>
                            <span>Photos</span>
                            <strong>
                              {images.length > 0
                                ? `${images.length} photo${images.length !== 1 ? 's' : ''}`
                                : <span className="review-warn">None — strongly recommended</span>}
                            </strong>
                            <span>Features</span>
                            <strong>{form.features.length > 0 ? `${form.features.length} selected` : 'None'}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form navigation */}
                    <div className="form-nav">
                      {formSection > 0 ? (
                        <button
                          type="button"
                          className="ghost-btn"
                          onClick={() => { setFormError(''); setFormSection((s) => s - 1) }}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                          </svg>
                          Back
                        </button>
                      ) : (
                        <span />
                      )}

                      {formSection < FORM_SECTIONS.length - 1 ? (
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={handleNext}
                        >
                          Next: {FORM_SECTIONS[formSection + 1]}
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button type="submit" className="primary-btn publish-btn" disabled={submitting}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          {submitting ? 'Publishing…' : 'Publish listing'}
                        </button>
                      )}
                    </div>
                    {formError && <p className="field-error" style={{ marginTop: '0.5rem' }}>{formError}</p>}
                  </form>
                </>
              )}
            </div>
          )}

        </div>
      </main>
      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default MyListings
