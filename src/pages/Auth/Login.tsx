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
          <div className="hero-orbs">
            <div className="hero-orb hero-orb-one"></div>
            <div className="hero-orb hero-orb-two"></div>
            <div className="hero-orb hero-orb-three"></div>
          </div>
          <div className="login-container">
            <div className="login-header">
              <div className="hero-eyebrow">WELCOME BACK</div>
              <h1>Sign Into Your Account</h1>
              <p className="login-subtitle">Access saved cars, alerts, and your seller dashboard in one place.</p>
            </div>
            <div className="login-content">
              <div className="login-form-card">
                <div className="form-header">
                  <p>Enter your credentials to continue</p>
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
                    <a href="#" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>

                  <button type="button" className="login-btn">
                    Sign In
                  </button>
                </form>

                <div className="signup-prompt">
                  Don't have an account? <a href="#">Create one here</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login

