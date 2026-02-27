import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <>
      <Navbar />
      <main className="login-page">
        <section className="login-hero-section">
          <div className="login-container">
            <div className="login-card">
              <div className="login-copy">
                <p className="hero-eyebrow">Welcome Back</p>
                <h1>Log into your account</h1>
                <p>Access saved cars, alerts, and your seller dashboard.</p>
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
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="button" className="primary-btn login-btn">
                  Log In
                </button>
              </form>

              <p className="signup-prompt">
                Don't have an account? <a href="signup">Create one here</a>
              </p>
            </div>
          </div>

        </section>
      </main>
    </>
  )
}

export default Login
