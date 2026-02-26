import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import './Signup.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <>
      <Navbar />
      <main className="signup-page">
        <section className="signup-hero-section">
          <div className="signup-container">
            <div className="signup-card">
              <div className="signup-copy">
                <p className="hero-eyebrow">Get Started</p>
                <h1>Create your account</h1>
                <p>Join thousands of buyers and sellers on CarMarket.</p>
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

                <button type="button" className="primary-btn signup-btn">
                  Create Account
                </button>
              </form>

              <p className="login-prompt">
                Already have an account? <a href="#">Log in here</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Signup
