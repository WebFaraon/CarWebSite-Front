import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { announcementApi, getApiErrorMessage } from '../../services/api'
import type { AnnouncementDto } from '../../services/api'
import '../Home/Home.css'
import './AdminDashboard.css'

type ListingStatus = 'active' | 'hidden' | 'pending'
type Section = 'overview' | 'listings'
type OverviewSort = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'km_asc'

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  year: number
  km: number
  fuel: string
  location: string
  imageUrl: string
  status: ListingStatus
  seller: string
  postedAt: string
}

interface DonutSegment {
  label: string
  value: number
  color: string
}

const SECTION_LABELS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: 'listings',
    label: 'Listings',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 13l1.5-5h15l1.5 5" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="13" width="20" height="5" rx="2"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>,
  },
]

const SECTION_TITLES: Record<Section, string> = {
  overview: 'Dashboard Overview',
  listings: 'Manage Listings',
}

const OVERVIEW_SORT_OPTIONS: { value: OverviewSort; label: string }[] = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'km_asc', label: 'Mileage: low to high' },
]

function mapAnnouncement(a: AnnouncementDto): Listing {
 const imageUrl =
  a.images.find((image) => image.isCover)?.url ??
  a.images[0]?.url ??
  ''

  return {
    id: String(a.id),
    title: a.title || `${a.brand.name} ${a.model}`,
    price: Number(a.price),
    currency: 'EUR',
    year: a.year,
    km: a.mileage,
    fuel: a.fuelType,
    location: a.ownerCity || 'Moldova',
    imageUrl,
    status: a.status === 'Active' ? 'active' : a.status === 'Pending' ? 'pending' : 'hidden',
    seller: a.ownerName || 'Unknown seller',
    postedAt: a.publishedAt ? a.publishedAt.slice(0, 10) : '',
  }
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, inner: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start)
  const e = polarToCartesian(cx, cy, r, end)
  const si = polarToCartesian(cx, cy, inner, start)
  const ei = polarToCartesian(cx, cy, inner, end)
  const lg = end - start > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${inner} ${inner} 0 ${lg} 0 ${si.x} ${si.y} Z`
}

function DonutChart({ label, segments }: { label: string; segments: DonutSegment[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const total = segments.reduce((s, x) => s + x.value, 0)
  const cx = 60
  const cy = 60
  const r = 54
  const inner = 30
  let angle = -90

  const arcs = segments.map((seg, i) => {
    const sweep = total === 0 ? 0 : (seg.value / total) * 360
    const start = angle
    const end = angle + (sweep === 360 ? 359.99 : sweep)
    angle += sweep
    return { seg, i, path: arcPath(cx, cy, r, inner, start, end), sweep }
  })

  const hovered = hoveredIdx !== null ? arcs[hoveredIdx]?.seg : null

  return (
    <div className="donut-card">
      <div className="donut-label">{label}</div>
      <div className="donut-wrap">
        <svg width={120} height={120} viewBox="0 0 120 120">
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={(r + inner) / 2} fill="none" stroke="var(--am-border)" strokeWidth={r - inner} />
          ) : (
            arcs.map(({ seg, i, path, sweep }) => sweep > 0 && (
              <path
                key={seg.label}
                className="donut-segment"
                d={path}
                fill={seg.color}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: hoveredIdx === i ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.18s ease',
                }}
              />
            ))
          )}
        </svg>
        <div className="donut-center">
          <span className="donut-total" style={{ color: hovered ? hovered.color : 'var(--am-text)' }}>
            {hovered ? hovered.value : total}
          </span>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map((s) => (
          <div key={s.label} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ background: s.color }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function sortListings(listings: Listing[], sort: OverviewSort): Listing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case 'date_desc':
        return b.postedAt.localeCompare(a.postedAt)
      case 'date_asc':
        return a.postedAt.localeCompare(b.postedAt)
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'km_asc':
        return a.km - b.km
    }
  })
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const map: Record<ListingStatus, string> = { active: 'badge-green', hidden: 'badge-gray', pending: 'badge-amber' }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function ListingsTable({
  listings,
  onStatus,
  onDelete,
}: {
  listings: Listing[]
  onStatus?: (listing: Listing, status: ListingStatus) => void
  onDelete?: (listing: Listing) => void
}) {
  if (listings.length === 0) {
    return (
      <table className="admin-table">
        <tbody>
          <tr><td className="admin-empty">No listings found</td></tr>
        </tbody>
      </table>
    )
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Car</th>
          <th>Price</th>
          <th>Seller</th>
          <th>Location</th>
          <th>Status</th>
          {onStatus && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {listings.map((l) => (
          <tr key={l.id}>
            <td>
              <div className="car-cell">
                <img className="car-thumb" src={l.imageUrl} alt={l.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div>
                  <div className="car-cell-title">{l.title}</div>
                  <div className="car-cell-meta">{l.year} / {l.km.toLocaleString()} km / {l.fuel}</div>
                </div>
              </div>
            </td>
            <td>{l.price.toLocaleString()} {l.currency}</td>
            <td>{l.seller}</td>
            <td>{l.location}</td>
            <td><StatusBadge status={l.status} /></td>
            {onStatus && (
              <td>
                <div className="action-btns">
                  {l.status === 'active' ? (
                    <button className="icon-btn reject" title="Set Hidden" onClick={() => onStatus(l, 'hidden')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                    </button>
                  ) : (
                    <button className="icon-btn approve" title="Set Active" onClick={() => onStatus(l, 'active')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                  {onDelete && (
                    <button className="icon-btn delete" title="Delete" onClick={() => onDelete(l)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function OverviewSection({ listings }: { listings: Listing[] }) {
  const [sort, setSort] = useState<OverviewSort>('date_desc')
  const inactiveCount = listings.filter((l) => l.status !== 'active').length
  const sortedListings = sortListings(listings, sort).slice(0, 8)

  return (
    <>
      <div className="admin-charts-grid">
        <DonutChart
          label="Listings"
          segments={[
            { label: 'Active', value: listings.filter((l) => l.status === 'active').length, color: '#2563eb' },
            { label: 'Hidden', value: listings.filter((l) => l.status === 'hidden').length, color: '#cbd5e1' },
            { label: 'Pending', value: listings.filter((l) => l.status === 'pending').length, color: '#d97706' },
          ]}
        />
        <DonutChart
        label="Inventory"
        segments={[
          { label: 'Visible', value: listings.length - inactiveCount, color: '#0d9488' },
          { label: 'Hidden', value: inactiveCount, color: '#d97706' },
        ]}
      />
      </div>

      <h2 className="admin-section-title">Recent Listings</h2>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <select
            className="admin-search-input"
            style={{ width: 'auto', cursor: 'pointer' }}
            value={sort}
            onChange={(e) => setSort(e.target.value as OverviewSort)}
          >
            {OVERVIEW_SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <ListingsTable listings={sortedListings} />
      </div>
    </>
  )
}

function ListingsSection({
  listings,
  onStatus,
  onDelete,
}: {
  listings: Listing[]
  onStatus: (listing: Listing, status: ListingStatus) => void
  onDelete: (listing: Listing) => void
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      listings.filter((l) =>
        `${l.title} ${l.seller}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [listings, search],
  )

  return (
    <>
      <h2 className="admin-section-title">All Listings</h2>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-gray">{filtered.length} results</span>
        </div>
        <ListingsTable listings={filtered} onStatus={onStatus} onDelete={onDelete} />
      </div>
    </>
  )
}

function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { adminLogout } = useAdminAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const data = await announcementApi.getAll()
        if (alive) setListings(data.map(mapAnnouncement))
      } catch (err) {
        if (alive) setError(getApiErrorMessage(err))
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  const pendingCount = listings.filter((l) => l.status === 'pending').length

  function getBadge(id: Section): number {
    if (id === 'listings') return pendingCount
    return 0
  }

  async function handleStatus(listing: Listing, status: ListingStatus) {
    try {
      setError('')
      await announcementApi.update(Number(listing.id), {
      status: status === 'active' ? 'Active' : status === 'pending' ? 'Pending' : 'Hidden',
      })
      setListings((prev) =>
        prev.map((item) => (item.id === listing.id ? { ...item, status } : item)),
      )
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDelete(listing: Listing) {
    try {
      setError('')
      await announcementApi.delete(Number(listing.id))
      setListings((prev) => prev.filter((item) => item.id !== listing.id))
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  function handleLogout() {
    adminLogout()
    navigate('/')
  }

  return (
    <div className="am" data-theme={theme}>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="am-brand-mark">A</span>
            <span>AutoMarket</span>
            <span className="brand-badge">Admin</span>
          </div>

          <nav className="admin-nav">
            {SECTION_LABELS.map((s) => {
              const badge = getBadge(s.id)
              return (
                <button
                  key={s.id}
                  className={`admin-nav-item ${section === s.id ? 'active' : ''}`}
                  onClick={() => setSection(s.id)}
                >
                  {s.icon}
                  {s.label}
                  {badge > 0 && <span className="admin-nav-badge">{badge}</span>}
                </button>
              )}
            )}
          </nav>

          <div className="admin-sidebar-footer">
            <button className="admin-logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <p className="admin-kicker">Control center</p>
              <h1 className="admin-topbar-title">{SECTION_TITLES[section]}</h1>
            </div>
            <div className="admin-topbar-right">
              <div className="admin-avatar">A</div>
            </div>
          </div>

          <div className="admin-content">
            {error && <div className="am-alert" role="alert">{error}</div>}
            {loading ? (
              <div className="admin-empty">Loading live dashboard data...</div>
            ) : (
              <>
                {section === 'overview' && <OverviewSection listings={listings} />}
                {section === 'listings' && (
                  <ListingsSection
                    listings={listings}
                    onStatus={handleStatus}
                    onDelete={handleDelete}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
