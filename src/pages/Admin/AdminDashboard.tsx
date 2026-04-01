import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import './AdminDashboard.css'

// ── Mock data ────────────────────────────────────────────────
type ListingStatus = 'active' | 'inactive'

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

interface User {
  id: string
  name: string
  email: string
  listings: number
  joined: string
  status: 'active' | 'banned'
  avatarColor: string
}

interface Message {
  id: string
  sender: string
  email: string
  subject: string
  body: string
  date: string
  unread: boolean
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', title: 'BMW X5 xDrive 40d – M Paket', price: 58900, currency: '$', year: 2019, km: 98000, fuel: 'Diesel', location: 'Chisinau', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019%20BMW%20X5%20xDrive40i%20rear%203.24.19.jpg?width=900', status: 'active', seller: 'Ion Popescu', postedAt: '2026-03-28' },
  { id: '2', title: 'Audi A6 – 2.0 TDI – S-Line', price: 26900, currency: 'EUR', year: 2017, km: 156000, fuel: 'Diesel', location: 'Balti', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2017%20Audi%20A6%202.0.jpg?width=900', status: 'active', seller: 'Maria Lungu', postedAt: '2026-03-25' },
  { id: '3', title: 'Tesla Model 3 Long Range', price: 32900, currency: 'EUR', year: 2020, km: 82000, fuel: 'Electric', location: 'Chisinau', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020%20Tesla%20Model%203.jpg?width=900', status: 'inactive', seller: 'Andrei Grama', postedAt: '2026-03-31' },
  { id: '4', title: 'Toyota RAV4 Hybrid – AWD', price: 24900, currency: 'EUR', year: 2018, km: 125000, fuel: 'Hybrid', location: 'Orhei', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2018%20Toyota%20RAV4%20Hybrid%20Icon%20Tech%20TSS%20HEV%204X4%202.5.jpg?width=900', status: 'active', seller: 'Olga Vasile', postedAt: '2026-03-20' },
  { id: '5', title: 'Mercedes-Benz C220d – AMG', price: 29900, currency: 'EUR', year: 2019, km: 112000, fuel: 'Diesel', location: 'Chisinau', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019%20Mercedes-Benz%20C220%20AMG%20Line%20Premium%20Diesel%20Estate%202.0%20Front.jpg?width=900', status: 'inactive', seller: 'Dumitru Rusu', postedAt: '2026-04-01' },
  { id: '6', title: 'Volkswagen Golf 7 – 1.6 TDI', price: 9900, currency: 'EUR', year: 2016, km: 198000, fuel: 'Diesel', location: 'Cahul', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Volkswagen%20Golf%20VII%20(2016)%20TSI%20en%20Valencia.jpg?width=900', status: 'inactive', seller: 'Nicolai Balan', postedAt: '2026-03-15' },
]

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ion Popescu', email: 'ion.popescu@email.com', listings: 3, joined: '2025-11-10', status: 'active', avatarColor: '#3b82f6' },
  { id: '2', name: 'Maria Lungu', email: 'maria.lungu@email.com', listings: 1, joined: '2025-12-05', status: 'active', avatarColor: '#a855f7' },
  { id: '3', name: 'Andrei Grama', email: 'andrei.grama@email.com', listings: 2, joined: '2026-01-18', status: 'active', avatarColor: '#f97316' },
  { id: '4', name: 'Olga Vasile', email: 'olga.vasile@email.com', listings: 1, joined: '2026-02-02', status: 'active', avatarColor: '#22c55e' },
  { id: '5', name: 'Dumitru Rusu', email: 'dumitru.rusu@email.com', listings: 0, joined: '2026-03-14', status: 'banned', avatarColor: '#ef4444' },
]

const MOCK_MESSAGES: Message[] = [
  { id: '1', sender: 'Petru Ciobanu', email: 'petru@email.com', subject: 'Question about BMW X5 listing', body: 'Hello, I am interested in the BMW X5. Is it still available? Can we schedule a test drive this weekend?', date: '2026-04-01', unread: true },
  { id: '2', sender: 'Elena Marin', email: 'elena.marin@email.com', subject: 'Report: suspicious listing', body: 'I would like to report a listing that I believe contains false information about the mileage. The car in listing #6 seems to have an incorrect odometer reading.', date: '2026-03-31', unread: true },
  { id: '3', sender: 'Victor Urs', email: 'victor@email.com', subject: 'How do I sell my car?', body: 'Hi, I would like to list my Skoda Octavia for sale. What documents do I need to prepare? Thank you.', date: '2026-03-29', unread: false },
  { id: '4', sender: 'Ana Cojocaru', email: 'ana.c@email.com', subject: 'Partnership inquiry', body: 'We are a car dealership from Chisinau and would like to discuss a partnership for featured listings on your platform.', date: '2026-03-27', unread: false },
]

// ── Sub-components ───────────────────────────────────────────

type Section = 'overview' | 'listings' | 'users' | 'messages'

function StatCard({ label, value, sub, iconClass, icon }: { label: string; value: string; sub: string; iconClass: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <span className={`stat-card-icon ${iconClass}`}>{icon}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-sub">{sub}</div>
    </div>
  )
}

type OverviewSort = 'date_desc' | 'date_asc' | 'price_asc' | 'price_desc' | 'km_asc'

const OVERVIEW_SORT_OPTIONS: { value: OverviewSort; label: string }[] = [
  { value: 'date_desc',  label: 'Newest first' },
  { value: 'date_asc',   label: 'Oldest first' },
  { value: 'price_asc',  label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'km_asc',     label: 'Mileage: low to high' },
]

function sortListings(listings: Listing[], sort: OverviewSort): Listing[] {
  return [...listings].sort((a, b) => {
    switch (sort) {
      case 'date_desc':  return b.postedAt.localeCompare(a.postedAt)
      case 'date_asc':   return a.postedAt.localeCompare(b.postedAt)
      case 'price_asc':  return a.price - b.price
      case 'price_desc': return b.price - a.price
      case 'km_asc':     return a.km - b.km
    }
  })
}

function OverviewSection() {
  const [sort, setSort] = useState<OverviewSort>('date_desc')
  const pendingCount = MOCK_LISTINGS.filter(l => l.status === 'inactive').length
  const unreadCount = MOCK_MESSAGES.filter(m => m.unread).length
  const sortedListings = sortListings(MOCK_LISTINGS, sort)

  return (
    <>
      <div className="admin-stats-grid">
        <StatCard
          label="Total Listings"
          value={String(MOCK_LISTINGS.length)}
          sub={`${MOCK_LISTINGS.filter(l => l.status === 'active').length} active`}
          iconClass="stat-icon-orange"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 13l1.5-5h15l1.5 5" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="13" width="20" height="5" rx="2"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>}
        />
        <StatCard
          label="Registered Users"
          value={String(MOCK_USERS.length)}
          sub={`${MOCK_USERS.filter(u => u.status === 'active').length} active`}
          iconClass="stat-icon-blue"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="Inactive Listings"
          value={String(pendingCount)}
          sub="Hidden from users"
          iconClass="stat-icon-purple"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <StatCard
          label="New Messages"
          value={String(unreadCount)}
          sub="Unread inquiries"
          iconClass="stat-icon-green"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      <h2 className="admin-section-title">Recent Listings</h2>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <select
            className="admin-search-input"
            style={{ width: 'auto', cursor: 'pointer' }}
            value={sort}
            onChange={e => setSort(e.target.value as OverviewSort)}
          >
            {OVERVIEW_SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Posted</th>
            </tr>
          </thead>
          <tbody>
            {sortedListings.map(l => (
              <tr key={l.id}>
                <td>
                  <div className="car-cell">
                    <img className="car-thumb" src={l.imageUrl} alt={l.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div>
                      <div className="car-cell-title">{l.title}</div>
                      <div className="car-cell-meta">{l.year} · {l.km.toLocaleString()} km · {l.fuel}</div>
                    </div>
                  </div>
                </td>
                <td>{l.price.toLocaleString()} {l.currency}</td>
                <td>{l.location}</td>
                <td><StatusBadge status={l.status} /></td>
                <td>{l.postedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const map: Record<ListingStatus, string> = { active: 'badge-green', inactive: 'badge-gray' }
  return <span className={`badge ${map[status]}`}>{status}</span>
}

function ListingsSection() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS)
  const [search, setSearch] = useState('')

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.seller.toLowerCase().includes(search.toLowerCase())
  )

  function setStatus(id: string, status: ListingStatus) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  function remove(id: string) {
    setListings(prev => prev.filter(l => l.id !== id))
  }

  return (
    <>
      <h2 className="admin-section-title">All Listings</h2>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="badge badge-gray">{filtered.length} results</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Car</th>
              <th>Price</th>
              <th>Seller</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">No listings found</td></tr>
            )}
            {filtered.map(l => (
              <tr key={l.id}>
                <td>
                  <div className="car-cell">
                    <img className="car-thumb" src={l.imageUrl} alt={l.title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div>
                      <div className="car-cell-title">{l.title}</div>
                      <div className="car-cell-meta">{l.year} · {l.km.toLocaleString()} km · {l.fuel}</div>
                    </div>
                  </div>
                </td>
                <td>{l.price.toLocaleString()} {l.currency}</td>
                <td>{l.seller}</td>
                <td>{l.location}</td>
                <td><StatusBadge status={l.status} /></td>
                <td>
                  <div className="action-btns">
                    {l.status === 'inactive' && (
                      <button className="icon-btn approve" title="Set Active" onClick={() => setStatus(l.id, 'active')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    )}
                    {l.status === 'active' && (
                      <button className="icon-btn reject" title="Set Inactive" onClick={() => setStatus(l.id, 'inactive')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                      </button>
                    )}
                    <button className="icon-btn delete" title="Delete" onClick={() => remove(l.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function UsersSection() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  function toggleBan(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u))
  }

  function remove(id: string) {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <>
      <h2 className="admin-section-title">All Users</h2>
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="badge badge-gray">{filtered.length} users</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Listings</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="admin-empty">No users found</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-sm" style={{ background: u.avatarColor }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email-sm">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>{u.listings}</td>
                <td>{u.joined}</td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className={`icon-btn ${u.status === 'active' ? 'reject' : 'approve'}`}
                      title={u.status === 'active' ? 'Ban user' : 'Unban user'}
                      onClick={() => toggleBan(u.id)}
                    >
                      {u.status === 'active' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14" strokeLinecap="round"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                    <button className="icon-btn delete" title="Delete user" onClick={() => remove(u.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MessagesSection() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)

  function markRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m))
  }

  function remove(id: string) {
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  return (
    <>
      <h2 className="admin-section-title">Contact Messages</h2>
      {messages.length === 0 && <div className="admin-empty">No messages</div>}
      {messages.map(m => (
        <div key={m.id} className={`message-card ${m.unread ? 'unread' : ''}`}>
          <div className="message-card-header">
            <div>
              <div className="message-sender">
                {m.sender}
                {m.unread && <span className="badge badge-orange" style={{ marginLeft: '0.5rem' }}>New</span>}
              </div>
              <div className="message-email">{m.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="message-date">{m.date}</span>
              <div className="action-btns">
                {m.unread && (
                  <button className="icon-btn approve" title="Mark as read" onClick={() => markRead(m.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                )}
                <button className="icon-btn delete" title="Delete" onClick={() => remove(m.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div className="message-subject">{m.subject}</div>
          <div className="message-body">{m.body}</div>
        </div>
      ))}
    </>
  )
}

// ── Main dashboard component ─────────────────────────────────

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
  {
    id: 'users',
    label: 'Users',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
]

const SECTION_TITLES: Record<Section, string> = {
  overview: 'Dashboard Overview',
  listings: 'Manage Listings',
  users: 'Manage Users',
  messages: 'Contact Messages',
}

function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview')
  const { adminLogout } = useAdminAuth()
  const navigate = useNavigate()

  const pendingCount = MOCK_LISTINGS.filter(l => l.status === 'inactive').length
  const unreadCount = MOCK_MESSAGES.filter(m => m.unread).length

  function getBadge(id: Section): number {
    if (id === 'listings') return pendingCount
    if (id === 'messages') return unreadCount
    return 0
  }

  function handleLogout() {
    adminLogout()
    navigate('/')
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          AutoMarket
          <span className="brand-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {SECTION_LABELS.map(s => {
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
            )
          })}
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

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar-title">{SECTION_TITLES[section]}</h1>
          <div className="admin-topbar-right">
            <div className="admin-avatar">A</div>
          </div>
        </div>

        <div className="admin-content">
          {section === 'overview'  && <OverviewSection />}
          {section === 'listings' && <ListingsSection />}
          {section === 'users'    && <UsersSection />}
          {section === 'messages' && <MessagesSection />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
