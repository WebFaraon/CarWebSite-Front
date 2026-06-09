import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import {
  CloseIcon,
  HeartIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from './AmIcons'

const PRIMARY_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Offers', href: '/offers' },
  { label: 'Sell', href: '/sell' },
  { label: 'My listings', href: '/my-listings' },
  { label: 'Help', href: '/help' },
  { label: 'Contact', href: '/contact-us' },
]

function AmNavbar() {
  const { theme, toggleTheme } = useTheme()
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobOpen, setMobOpen] = useState(false)

  const firstName = user?.fullName?.split(' ')[0] ?? 'there'

  const handleLogout = () => {
    logout()
    setMobOpen(false)
    navigate('/')
  }

  return (
    <header className="am-nav">
      <div className="am-shell am-nav-row">
        <Link to="/" className="am-brand" aria-label="AutoMarket home">
          <span className="am-brand-mark">A</span>
          <span>AutoMarket</span>
        </Link>

        <nav className="am-nav-links" aria-label="Primary">
          {PRIMARY_LINKS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className="am-nav-link"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="am-nav-right">
          <button
            type="button"
            className="am-iconbtn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <Link to="/favorites" className="am-iconbtn" aria-label="Favorites">
            <HeartIcon />
          </Link>

          <div className="am-nav-auth">
            {isLoggedIn ? (
              <>
                <span className="am-nav-greeting">Hi, {firstName}</span>
                <button
                  type="button"
                  className="am-btn am-btn--outline"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="am-btn am-btn--ghost">
                  Log in
                </Link>
                <Link to="/signup" className="am-btn am-btn--primary">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="am-iconbtn am-nav-mobbtn"
            aria-label="Toggle menu"
            aria-expanded={mobOpen}
            onClick={() => setMobOpen((o) => !o)}
          >
            {mobOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobOpen && (
        <div className="am-mobsheet" role="dialog" aria-label="Mobile menu">
          {PRIMARY_LINKS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={() => setMobOpen(false)}
              className="am-mobsheet-link"
            >
              {item.label}
            </NavLink>
          ))}
          <div className="am-mobsheet-row">
            {isLoggedIn ? (
              <button
                type="button"
                className="am-btn am-btn--outline"
                onClick={handleLogout}
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="am-btn am-btn--outline"
                  onClick={() => setMobOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="am-btn am-btn--primary"
                  onClick={() => setMobOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default AmNavbar
