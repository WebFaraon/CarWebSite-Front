import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  brandName?: string
  navItems?: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Offers', href: '#offers' },
  { label: 'Sell', href: '/sell' },
  { label: 'Help', href: '#help' },
  { label: 'Contact', href: '/contact-us' },
]

function Navbar({
  brandName = 'AutoMarket',
  navItems = defaultNavItems,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const renderLink = (item: NavItem, className: string) => {
    if (item.href.startsWith('/')) {
      return (
        <NavLink
          key={item.label}
          to={item.href}
          className={({ isActive }) =>
            `${className} ${isActive ? 'is-active' : ''}`
          }
          onClick={handleLinkClick}
        >
          {item.label}
        </NavLink>
      )
    }

    return (
      <a key={item.label} href={item.href} className={className} onClick={handleLinkClick}>
        {item.label}
      </a>
    )
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a className="navbar-brand" href="/">
          {brandName}
        </a>

        <nav className="navbar-links" aria-label="Primary">
          {navItems.map((item) => renderLink(item, 'navbar-link'))}
        </nav>

        <div className="navbar-actions">
          <NavLink
            className={({ isActive }) =>
              `favorites-btn ${isActive ? 'is-active' : ''}`
            }
            to="/favorites"
            aria-label="Favorites"
            onClick={handleLinkClick}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
            </svg>
          </NavLink>
          <a href="login" className="navbar-login">
            Login
          </a>
          <a href="signup" className="navbar-signup">
            Sign Up
          </a>
        </div>

        <button
          type="button"
          className={`navbar-menu-btn ${isMenuOpen ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar-mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Mobile primary navigation" className="mobile-links">
          {navItems.map((item) => renderLink(item, 'mobile-link'))}
        </nav>

        <div className="mobile-actions">
          <NavLink
            className={({ isActive }) =>
              `favorites-btn ${isActive ? 'is-active' : ''}`
            }
            to="/favorites"
            aria-label="Favorites"
            onClick={handleLinkClick}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.25 10.55 19C5.4 14.36 2 11.28 2 7.5A5.38 5.38 0 0 1 7.5 2 6.16 6.16 0 0 1 12 4.09 6.16 6.16 0 0 1 16.5 2 5.38 5.38 0 0 1 22 7.5c0 3.78-3.4 6.86-8.55 11.51L12 20.25Z" />
            </svg>
          </NavLink>
          <a href="#" className="navbar-login">
            Login
          </a>
          <a href="#" className="navbar-signup">
            Sign Up
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
