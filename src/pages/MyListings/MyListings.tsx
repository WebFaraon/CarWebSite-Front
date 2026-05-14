import { useState, useRef, useCallback } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import type { SocialItem } from '../../components/home/types'
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

const mockListings: Listing[] = [
  {
    id: '1',
    title: '2019 BMW 3 Series — Clean, Full History',
    brand: 'BMW',
    model: '3 Series',
    year: 2019,
    price: 28500,
    mileage: 52000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    status: 'active',
    images: ['https://placehold.co/600x400/F8FAFC/111827?text=BMW+3+Series'],
    views: 342,
    inquiries: 7,
    createdAt: '2025-02-14',
    bodyType: 'Sedan',
    color: 'Black',
    condition: 'Excellent',
    doors: '4',
    seats: '5',
    engineSize: '2.0',
    horsepower: '184',
    vin: 'WBA8E9G53JNU12345',
    description: 'Well kept BMW 3 Series with full service history, clean interior, recent tires, and no known mechanical issues.',
    features: ['Navigation System', 'Parking Sensors', 'Bluetooth', 'Heated Seats'],
    contactName: 'Test Seller',
    contactPhone: '40712345678',
    contactEmail: 'test@example.com',
    contactCity: 'Chisinau',
    negotiable: true,
    showPhone: true,
  },
  {
    id: '2',
    title: '2021 Toyota Corolla — Low Mileage, One Owner',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2021,
    price: 19900,
    mileage: 21000,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    status: 'hidden',
    images: ['https://placehold.co/600x400/F8FAFC/111827?text=Toyota+Corolla'],
    views: 89,
    inquiries: 2,
    createdAt: '2025-01-28',
    bodyType: 'Sedan',
    color: 'White',
    condition: 'Excellent',
    doors: '4',
    seats: '5',
    engineSize: '1.8',
    horsepower: '121',
    vin: 'JTDBR32E720123456',
    description: 'Low mileage Toyota Corolla Hybrid, one owner, very economical, clean bodywork, and complete maintenance records.',
    features: ['Backup Camera', 'Bluetooth', 'Cruise Control', 'Apple CarPlay / Android Auto'],
    contactName: 'Test Seller',
    contactPhone: '40712345678',
    contactEmail: 'test@example.com',
    contactCity: 'Chisinau',
    negotiable: false,
    showPhone: true,
  },
  {
    id: '3',
    title: '2017 Volkswagen Golf GTI — Sport Package',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    year: 2017,
    price: 16500,
    mileage: 78000,
    fuel: 'Petrol',
    transmission: 'Manual',
    status: 'pending',
    images: ['https://placehold.co/600x400/F8FAFC/111827?text=VW+Golf+GTI'],
    views: 0,
    inquiries: 0,
    createdAt: '2025-03-11',
    bodyType: 'Hatchback',
    color: 'Red',
    condition: 'Good',
    doors: '5',
    seats: '5',
    engineSize: '2.0',
    horsepower: '220',
    vin: 'WVWZZZAUZHW123456',
    description: 'Volkswagen Golf GTI with sport package, manual gearbox, strong service record, and clean interior condition.',
    features: ['Leather Seats', 'Bluetooth', 'Premium Sound System', 'Parking Sensors'],
    contactName: 'Test Seller',
    contactPhone: '40712345678',
    contactEmail: 'test@example.com',
    contactCity: 'Chisinau',
    negotiable: true,
    showPhone: true,
  },
]

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG', 'CNG']
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT']
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Minivan']
const CONDITIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair', 'Parts Only']
const COLORS = ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Yellow', 'Orange', 'Other']
const BRANDS = [
  'Audi', 'BMW', 'Chevrolet', 'Dacia', 'Ferrari', 'Ford', 'Honda', 'Hyundai',
  'Kia', 'Lamborghini', 'Land Rover', 'Mazda', 'Mercedes-Benz', 'Nissan',
  'Opel', 'Peugeot', 'Porsche', 'Renault', 'Seat', 'Skoda', 'Subaru',
  'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Other',
]
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

type ValidationKey = keyof FormData | 'images' | 'features'

interface SectionValidation {
  isComplete: boolean
  errors: Partial<Record<ValidationKey, string>>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/

function isFilled(value: string) {
  return value.trim().length > 0
}

function numberValue(value: string) {
  return Number(value.replace(',', '.'))
}

function validateSection(section: number, form: FormData, images: { url: string; name: string }[]): SectionValidation {
  const errors: Partial<Record<ValidationKey, string>> = {}
  const currentYear = new Date().getFullYear()

  if (section === 0 && images.length === 0) {
    errors.images = 'Add at least one photo before publishing.'
  }

  if (section === 1) {
    const year = Number(form.year)
    const mileage = Number(form.mileage)
    const price = Number(form.price)

    if (!isFilled(form.title)) errors.title = 'Listing title is required.'
    if (!isFilled(form.brand)) errors.brand = 'Select a brand.'
    if (!isFilled(form.model)) errors.model = 'Enter the model.'
    if (!Number.isInteger(year) || year < 1950 || year > currentYear + 1) {
      errors.year = `Enter a year between 1950 and ${currentYear + 1}.`
    }
    if (!Number.isFinite(mileage) || mileage < 0) {
      errors.mileage = 'Mileage must be 0 or higher.'
    }
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = 'Price must be greater than 0.'
    }
  }

  if (section === 2) {
    const seats = Number(form.seats)
    const engineSize = numberValue(form.engineSize)
    const horsepower = Number(form.horsepower)

    if (!isFilled(form.fuel)) errors.fuel = 'Select a fuel type.'
    if (!isFilled(form.transmission)) errors.transmission = 'Select a transmission.'
    if (!isFilled(form.bodyType)) errors.bodyType = 'Select a body type.'
    if (!isFilled(form.condition)) errors.condition = 'Select the condition.'
    if (!isFilled(form.color)) errors.color = 'Select the exterior color.'
    if (!isFilled(form.doors)) errors.doors = 'Select the number of doors.'
    if (!Number.isInteger(seats) || seats < 1 || seats > 12) {
      errors.seats = 'Seats must be between 1 and 12.'
    }
    if (!Number.isFinite(engineSize) || engineSize <= 0) {
      errors.engineSize = 'Enter a valid engine size.'
    }
    if (!Number.isFinite(horsepower) || horsepower <= 0) {
      errors.horsepower = 'Horsepower must be greater than 0.'
    }
    if (!vinPattern.test(form.vin.trim().toUpperCase())) {
      errors.vin = 'VIN must have 17 valid characters.'
    }
  }

  if (section === 3) {
    if (form.description.trim().length < 30) {
      errors.description = 'Description must be at least 30 characters.'
    }
    if (form.features.length === 0) {
      errors.features = 'Select at least one feature.'
    }
  }

  if (section === 4) {
    const phoneDigits = form.contactPhone.replace(/\D/g, '')

    if (form.contactName.trim().length < 2) errors.contactName = 'Enter your full name.'
    if (form.contactCity.trim().length < 2) errors.contactCity = 'Enter the city or location.'
    if (phoneDigits.length < 7) errors.contactPhone = 'Enter a valid phone number.'
    if (!emailPattern.test(form.contactEmail.trim())) errors.contactEmail = 'Enter a valid email address.'
  }

  return {
    isComplete: Object.keys(errors).length === 0,
    errors,
  }
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function listingToForm(listing: Listing): FormData {
  return {
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    year: String(listing.year),
    price: String(listing.price),
    mileage: String(listing.mileage),
    fuel: listing.fuel,
    transmission: listing.transmission,
    bodyType: listing.bodyType,
    color: listing.color,
    condition: listing.condition,
    doors: listing.doors,
    seats: listing.seats,
    engineSize: listing.engineSize,
    horsepower: listing.horsepower,
    vin: listing.vin,
    description: listing.description,
    features: listing.features,
    contactName: listing.contactName,
    contactPhone: listing.contactPhone,
    contactEmail: listing.contactEmail,
    contactCity: listing.contactCity,
    negotiable: listing.negotiable,
    showPhone: listing.showPhone,
  }
}

function listingToImages(listing: Listing) {
  return listing.images.map((url, index) => ({
    url,
    name: `${listing.title} photo ${index + 1}`,
  }))
}

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
  const [activeTab, setActiveTab] = useState<Tab>(() =>
    new URLSearchParams(window.location.search).get('tab') === 'new' ? 'new' : 'listings',
  )
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(initialForm)
  const [images, setImages] = useState<{ url: string; name: string }[]>([])
  const [formSection, setFormSection] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [editingListingId, setEditingListingId] = useState<string | null>(null)
  const [validatedSections, setValidatedSections] = useState<number[]>([])
  const sectionValidations = FORM_SECTIONS.map((_, section) => validateSection(section, form, images))
  const currentValidation = sectionValidations[formSection]
  const showCurrentErrors = validatedSections.includes(formSection)
  const isFormComplete = sectionValidations.every((section) => section.isComplete)
  const isEditing = editingListingId !== null

  const markSectionValidated = (section: number) => {
    setValidatedSections((prev) => (prev.includes(section) ? prev : [...prev, section]))
  }

  const fieldError = (key: ValidationKey) =>
    showCurrentErrors ? currentValidation.errors[key] : undefined

  const resetListingForm = () => {
    setForm(initialForm)
    setImages([])
    setFormSection(0)
    setValidatedSections([])
    setEditingListingId(null)
    setSubmitted(false)
  }

  const openNewListingForm = () => {
    resetListingForm()
    setActiveTab('new')
  }

  const closeListingForm = () => {
    resetListingForm()
    setActiveTab('listings')
  }

  const handleToggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === 'hidden' ? 'active' : 'hidden' }
          : l,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id))
    setDeleteConfirm(null)
    if (editingListingId === id) closeListingForm()
  }

  const handleEdit = (listing: Listing) => {
    setDeleteConfirm(null)
    setEditingListingId(listing.id)
    setForm(listingToForm(listing))
    setImages(listingToImages(listing))
    setFormSection(0)
    setValidatedSections([])
    setSubmitted(false)
    setActiveTab('new')
  }

  const handleAddImages = (files: FileList) => {
    const remaining = 10 - images.length
    const toAdd = Array.from(files).slice(0, remaining)
    const newImages = toAdd.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
    setImages((prev) => [...prev, ...newImages])
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormComplete) {
      const firstInvalidSection = sectionValidations.findIndex((section) => !section.isComplete)
      setValidatedSections(FORM_SECTIONS.map((_, section) => section))
      if (firstInvalidSection >= 0) setFormSection(firstInvalidSection)
      return
    }

    const editingListing = listings.find((listing) => listing.id === editingListingId)
    const savedListing: Listing = {
      id: editingListing?.id ?? Date.now().toString(),
      title: form.title || `${form.year} ${form.brand} ${form.model}`.trim(),
      brand: form.brand,
      model: form.model,
      year: parseInt(form.year) || new Date().getFullYear(),
      price: parseInt(form.price) || 0,
      mileage: parseInt(form.mileage) || 0,
      fuel: form.fuel,
      transmission: form.transmission,
      status: editingListing?.status ?? 'pending',
      images: images.map((i) => i.url),
      views: editingListing?.views ?? 0,
      inquiries: editingListing?.inquiries ?? 0,
      createdAt: editingListing?.createdAt ?? new Date().toISOString().slice(0, 10),
      bodyType: form.bodyType,
      color: form.color,
      condition: form.condition,
      doors: form.doors,
      seats: form.seats,
      engineSize: form.engineSize,
      horsepower: form.horsepower,
      vin: form.vin.trim().toUpperCase(),
      description: form.description.trim(),
      features: form.features,
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail.trim(),
      contactCity: form.contactCity.trim(),
      negotiable: form.negotiable,
      showPhone: form.showPhone,
    }
    setListings((prev) =>
      editingListing
        ? prev.map((listing) => (listing.id === savedListing.id ? savedListing : listing))
        : [savedListing, ...prev],
    )
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setActiveTab('listings')
      resetListingForm()
    }, 2500)
  }

  const handleNextSection = () => {
    markSectionValidated(formSection)
    if (!currentValidation.isComplete) return
    setFormSection((section) => section + 1)
  }

  const handleStepClick = (section: number) => {
    markSectionValidated(formSection)
    setFormSection(section)
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
                  if (activeTab === 'new') {
                    closeListingForm()
                    return
                  }
                  openNewListingForm()
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
                onClick={closeListingForm}
              >
                Your listings
                {listings.length > 0 && <span className="ml-tab__count">{listings.length}</span>}
              </button>
              <button
                type="button"
                className={`ml-tab ${activeTab === 'new' ? 'is-active' : ''}`}
                onClick={openNewListingForm}
              >
                {isEditing ? 'Edit listing' : 'New listing'}
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
              {listings.length === 0 ? (
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
                    onClick={openNewListingForm}
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
                          <button
                            type="button"
                            className="ghost-btn lc-action-btn"
                            onClick={() => handleEdit(listing)}
                          >
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
                  <h2>{isEditing ? 'Listing updated!' : 'Listing submitted!'}</h2>
                  <p>{isEditing ? 'Your listing changes were saved.' : 'Your listing is under review and will go live within a few hours.'}</p>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="form-steps">
                    {FORM_SECTIONS.map((section, i) => {
                      const validation = sectionValidations[i]
                      const wasChecked = validatedSections.includes(i)
                      return (
                        <button
                          key={section}
                          type="button"
                          className={`form-step ${i === formSection ? 'is-active' : ''} ${validation.isComplete ? 'is-done' : ''} ${wasChecked && !validation.isComplete ? 'is-warning' : ''}`}
                          onClick={() => handleStepClick(i)}
                        >
                          <span className="form-step__num">
                            {validation.isComplete ? (
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : wasChecked ? (
                              <WarningIcon />
                            ) : (
                              i + 1
                            )}
                          </span>
                          <span className="form-step__label">{section}</span>
                        </button>
                      )
                    })}
                    <div
                      className="form-steps__track"
                      style={{ '--progress': `${(formSection / (FORM_SECTIONS.length - 1)) * 100}%` } as React.CSSProperties}
                    />
                  </div>

                  {showCurrentErrors && !currentValidation.isComplete && (
                    <div className="form-alert" role="alert">
                      <WarningIcon />
                      <div>
                        <strong>Fix this section before continuing.</strong>
                        <ul>
                          {Object.values(currentValidation.errors).map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <form className="listing-form" onSubmit={handleSubmit} noValidate>

                    {/* ── SECTION 0: Photos ── */}
                    {formSection === 0 && (
                      <div className="form-section">
                        <div className="form-section__header">
                          <h2>Upload Photos</h2>
                          <p>
                            {isEditing ? 'Update the gallery for this listing.' : 'Listings with good photos get up to 5× more inquiries.'}
                            Add up to 10 images — the first one becomes the cover.
                          </p>
                        </div>
                        <ImageUploadArea
                          images={images}
                          onAdd={handleAddImages}
                          onRemove={handleRemoveImage}
                        />
                        {fieldError('images') && (
                          <span className="field-error field-error--standalone">{fieldError('images')}</span>
                        )}
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
                            <label htmlFor="f-title">Listing title *</label>
                            <input
                              id="f-title"
                              type="text"
                              placeholder="e.g. 2020 BMW 3 Series — Full service history, no accidents"
                              value={form.title}
                              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                              maxLength={120}
                              className={fieldError('title') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('title'))}
                            />
                            {fieldError('title') && <span className="field-error">{fieldError('title')}</span>}
                            <span className="field-hint">
                              Use a clear title with year, brand, model, and one strong selling point.
                            </span>
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-brand">Brand *</label>
                            <select
                              id="f-brand"
                              value={form.brand}
                              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                              required
                              className={fieldError('brand') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('brand'))}
                            >
                              <option value="">Select brand</option>
                              {BRANDS.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            {fieldError('brand') && <span className="field-error">{fieldError('brand')}</span>}
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
                              className={fieldError('model') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('model'))}
                            />
                            {fieldError('model') && <span className="field-error">{fieldError('model')}</span>}
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
                              className={fieldError('year') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('year'))}
                            />
                            {fieldError('year') && <span className="field-error">{fieldError('year')}</span>}
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
                              className={fieldError('mileage') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('mileage'))}
                            />
                            {fieldError('mileage') && <span className="field-error">{fieldError('mileage')}</span>}
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
                                className={fieldError('price') ? 'is-invalid' : ''}
                                aria-invalid={Boolean(fieldError('price'))}
                              />
                            </div>
                            {fieldError('price') && <span className="field-error">{fieldError('price')}</span>}
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
                          <p>More detail builds trust. Complete every field before publishing.</p>
                        </div>
                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor="f-fuel">Fuel type *</label>
                            <select
                              id="f-fuel"
                              value={form.fuel}
                              onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))}
                              required
                              className={fieldError('fuel') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('fuel'))}
                            >
                              <option value="">Select fuel</option>
                              {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {fieldError('fuel') && <span className="field-error">{fieldError('fuel')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-transmission">Transmission *</label>
                            <select
                              id="f-transmission"
                              value={form.transmission}
                              onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                              required
                              className={fieldError('transmission') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('transmission'))}
                            >
                              <option value="">Select transmission</option>
                              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {fieldError('transmission') && <span className="field-error">{fieldError('transmission')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-bodyType">Body type *</label>
                            <select
                              id="f-bodyType"
                              value={form.bodyType}
                              onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value }))}
                              className={fieldError('bodyType') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('bodyType'))}
                            >
                              <option value="">Select body type</option>
                              {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {fieldError('bodyType') && <span className="field-error">{fieldError('bodyType')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-condition">Condition *</label>
                            <select
                              id="f-condition"
                              value={form.condition}
                              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                              required
                              className={fieldError('condition') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('condition'))}
                            >
                              <option value="">Select condition</option>
                              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {fieldError('condition') && <span className="field-error">{fieldError('condition')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-color">Exterior color *</label>
                            <select
                              id="f-color"
                              value={form.color}
                              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                              className={fieldError('color') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('color'))}
                            >
                              <option value="">Select color</option>
                              {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {fieldError('color') && <span className="field-error">{fieldError('color')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-doors">Number of doors *</label>
                            <select
                              id="f-doors"
                              value={form.doors}
                              onChange={(e) => setForm((f) => ({ ...f, doors: e.target.value }))}
                              className={fieldError('doors') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('doors'))}
                            >
                              <option value="">Select</option>
                              {['2', '3', '4', '5'].map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {fieldError('doors') && <span className="field-error">{fieldError('doors')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-seats">Number of seats *</label>
                            <input
                              id="f-seats"
                              type="number"
                              placeholder="e.g. 5"
                              min="1"
                              max="12"
                              value={form.seats}
                              onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))}
                              className={fieldError('seats') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('seats'))}
                            />
                            {fieldError('seats') && <span className="field-error">{fieldError('seats')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-engine">Engine size (L) *</label>
                            <input
                              id="f-engine"
                              type="text"
                              placeholder="e.g. 2.0"
                              value={form.engineSize}
                              onChange={(e) => setForm((f) => ({ ...f, engineSize: e.target.value }))}
                              className={fieldError('engineSize') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('engineSize'))}
                            />
                            {fieldError('engineSize') && <span className="field-error">{fieldError('engineSize')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-hp">Horsepower (hp) *</label>
                            <input
                              id="f-hp"
                              type="number"
                              placeholder="e.g. 150"
                              min="1"
                              value={form.horsepower}
                              onChange={(e) => setForm((f) => ({ ...f, horsepower: e.target.value }))}
                              className={fieldError('horsepower') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('horsepower'))}
                            />
                            {fieldError('horsepower') && <span className="field-error">{fieldError('horsepower')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-vin">VIN number *</label>
                            <input
                              id="f-vin"
                              type="text"
                              placeholder="17-character VIN"
                              maxLength={17}
                              value={form.vin}
                              onChange={(e) => setForm((f) => ({ ...f, vin: e.target.value.toUpperCase() }))}
                              className={fieldError('vin') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('vin'))}
                            />
                            {fieldError('vin') && <span className="field-error">{fieldError('vin')}</span>}
                            <span className="field-hint">Required VIN, 17 characters without I, O, or Q.</span>
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
                            className={fieldError('description') ? 'is-invalid' : ''}
                            aria-invalid={Boolean(fieldError('description'))}
                          />
                          {fieldError('description') && <span className="field-error">{fieldError('description')}</span>}
                          <span className="field-hint field-hint--right">
                            {form.description.length} / 2000
                          </span>
                        </div>

                        <div className="form-field">
                          <label>Features & Equipment *</label>
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
                          {fieldError('features') && <span className="field-error">{fieldError('features')}</span>}
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
                              className={fieldError('contactName') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('contactName'))}
                            />
                            {fieldError('contactName') && <span className="field-error">{fieldError('contactName')}</span>}
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
                              className={fieldError('contactCity') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('contactCity'))}
                            />
                            {fieldError('contactCity') && <span className="field-error">{fieldError('contactCity')}</span>}
                          </div>

                          <div className="form-field">
                            <label htmlFor="f-phone">Phone number *</label>
                            <input
                              id="f-phone"
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="e.g. 40712345678"
                              value={form.contactPhone}
                              onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value.replace(/\D/g, '') }))}
                              className={fieldError('contactPhone') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('contactPhone'))}
                            />
                            {fieldError('contactPhone') && <span className="field-error">{fieldError('contactPhone')}</span>}
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
                              className={fieldError('contactEmail') ? 'is-invalid' : ''}
                              aria-invalid={Boolean(fieldError('contactEmail'))}
                            />
                            {fieldError('contactEmail') && <span className="field-error">{fieldError('contactEmail')}</span>}
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
                          onClick={() => setFormSection((s) => s - 1)}
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
                          onClick={handleNextSection}
                        >
                          Next: {FORM_SECTIONS[formSection + 1]}
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button type="submit" className={`primary-btn publish-btn ${!isFormComplete ? 'is-blocked' : ''}`}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          {isEditing ? 'Save changes' : 'Publish listing'}
                        </button>
                      )}
                    </div>
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
