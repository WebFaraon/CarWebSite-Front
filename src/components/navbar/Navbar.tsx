import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
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
  { label: 'Offers', href: '/offers' },
  { label: 'Sell', href: '/sell' },
  { label: 'Help', href: '/help' },
  { label: 'Contact', href: '/contact-us' },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.25" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.3 14.8A8.6 8.6 0 1 1 9.2 3.7a7.2 7.2 0 1 0 11.1 11.1z" />
        </svg>
      )}
    </button>
  )
}

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
          className={({ isActive }) => `${className} ${isActive ? 'is-active' : ''}`}
          onClick={handleLinkClick}
        >
          {item.label}
        </NavLink>
      )
    }

    return (
      <a
        key={item.label}
        href={item.href}
        className={className}
        onClick={handleLinkClick}
      >
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
          <ThemeToggle />
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
          <ThemeToggle />
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
