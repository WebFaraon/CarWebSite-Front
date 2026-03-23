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
