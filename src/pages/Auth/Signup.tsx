import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar.tsx'
import './Signup.css'

const rules = [
  { id: 'length',  label: 'At least 8 characters',       test: (p: string) => p.length >= 8 },
  { id: 'number',  label: 'At least one number',          test: (p: string) => /\d/.test(p) },
  { id: 'upper',   label: 'At least one uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'special', label: 'At least one special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const mismatch = confirmPassword.length > 0 && confirmPassword !== password

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <svg className="auth-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 13l1.5-5h15l1.5 5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="2" y="13" width="20" height="5" rx="2"/>
            <circle cx="7" cy="18" r="1.5"/>
            <circle cx="17" cy="18" r="1.5"/>
          </svg>

          <h1>Sign up</h1>
          <p className="auth-sub">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>

          <button type="button" className="google-btn">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="your@example.com"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <ul className="password-rules">
                  {rules.map(r => (
                    <li key={r.id} className={r.test(password) ? 'rule-met' : 'rule-unmet'}>
                      <span className="rule-icon">{r.test(password) ? '✓' : '✗'}</span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={mismatch ? 'input-error' : ''}
              />
              {mismatch && (
                <span className="field-error">Passwords do not match.</span>
              )}
            </div>

            <button
              type="button"
              className="primary-btn auth-submit-btn"
            >
              Create account
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default Signup
