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
