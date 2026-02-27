import { useState } from 'react'
import Navbar from '../../components/navbar/Navbar.tsx'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <Navbar />
      <main className="fp-page">
        <section className="fp-hero-section">
          <div className="fp-container">
            <div className="fp-card">
              {!submitted ? (
                <>
                  <div className="fp-copy">
                    <div className="fp-icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="hero-eyebrow">Account Recovery</p>
                    <h1>Forgot your password?</h1>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                  </div>

                  <form className="fp-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="your@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="primary-btn fp-btn">
                      Send Reset Link
                    </button>
                  </form>

                  <p className="fp-back-prompt">
                    Remember your password? <a href="/login">Back to Login</a>
                  </p>
                </>
              ) : (
                <div className="fp-success">
                  <div className="fp-success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <p className="hero-eyebrow">Check your inbox</p>
                  <h1>Email sent!</h1>
                  <p>We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.</p>
                  <p className="fp-spam-note">Don't see it? Check your spam folder.</p>
                  <a href="/login" className="primary-btn fp-btn fp-btn-link">
                    Back to Login
                  </a>
                  <button
                    type="button"
                    className="fp-resend-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Resend email
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ForgotPassword
