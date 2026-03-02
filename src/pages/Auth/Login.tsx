import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar.tsx'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const highlights = [
    'Saved favorites sync across devices',
    'Instant alerts for new listings',
    'Secure access to your seller dashboard',
  ]

  return (
    <>
      <Navbar />
      <main className="login-page">
        <section className="login-hero-section">
          <div className="login-container">
            <div className="login-shell">
              <aside className="login-panel">
                <p className="hero-eyebrow">Welcome Back</p>
                <h1>Pick up exactly where you left off.</h1>
                <p>
                  Access saved cars, pricing alerts, and listing tools without
                  losing momentum.
                </p>

                <div className="login-panel-metrics">
                  <div className="login-metric-card">
                    <strong>12k+</strong>
                    <span>active buyers browsing weekly</span>
                  </div>
                  <div className="login-metric-card">
                    <strong>24h</strong>
                    <span>average support response window</span>
                  </div>
                </div>

                <ul className="login-highlight-list">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>

              <div className="login-card">
                <div className="login-copy">
                  <p className="hero-eyebrow">Sign In</p>
                  <h2>Log into your account</h2>
                  <p>Use your email to continue to your dashboard.</p>
                </div>

                <div className="login-social-proof">
                  <span className="login-proof-badge">Buyer tools</span>
                  <span className="login-proof-badge">Seller tools</span>
                  <span className="login-proof-badge">Theme aware</span>
                </div>

                <form className="login-form">
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

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="form-footer">
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                  </div>

                  <button type="button" className="primary-btn login-btn">
                    Log In
                  </button>
                </form>

                <p className="signup-prompt">
                  Don&apos;t have an account? <Link to="/signup">Create one here</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login
