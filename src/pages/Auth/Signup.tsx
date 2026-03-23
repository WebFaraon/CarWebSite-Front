import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar.tsx'
import './Signup.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const benefits = [
    'Track saved cars in one place',
    'Message buyers and sellers faster',
    'Manage listings with a cleaner dashboard',
  ]

  return (
    <>
      <Navbar />
      <main className="signup-page">
        <section className="signup-hero-section">
          <div className="signup-container">
            <div className="signup-shell">
              <aside className="signup-panel">
                <p className="hero-eyebrow">Get Started</p>
                <h1>Create an account built for both buying and selling.</h1>
                <p>
                  Join a marketplace designed for quick discovery, better
                  comparisons, and cleaner listing management.
                </p>

                <div className="signup-panel-stack">
                  <div className="signup-stat-card">
                    <strong>4.8/5</strong>
                    <span>average satisfaction score from active users</span>
                  </div>
                  <div className="signup-stat-card">
                    <strong>3 steps</strong>
                    <span>from signup to your first shortlist</span>
                  </div>
                </div>

                <ul className="signup-benefit-list">
                  {benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </aside>

              <div className="signup-card">
                <div className="signup-copy">
                  <p className="hero-eyebrow">Create Profile</p>
                  <h2>Create your account</h2>
                  <p>Set up your profile and start exploring in minutes.</p>
                </div>

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

                <form className="signup-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="signup-form-row">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="button" className="primary-btn signup-btn">
                    Create Account
                  </button>
                </form>

                <p className="login-prompt">
                  Already have an account? <Link to="/login">Log in here</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Signup
