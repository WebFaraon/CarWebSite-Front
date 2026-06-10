import { useState } from 'react'
import { Link } from 'react-router-dom'
import AmNavbar from '../../components/home/am/AmNavbar'
import { useTheme } from '../../context/ThemeContext'
import '../Home/Home.css'
import './ForgotPassword.css'

function ForgotPassword() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const steps = [
    'Enter the email used for your account',
    'Check your inbox for the reset link',
    'Choose a new password and sign in again',
  ]

  return (
    <div className="am" data-theme={theme}>
      <AmNavbar />
      <main className="fp-page">
        <section className="fp-hero-section">
          <div className="fp-container">
            <div className="fp-shell">
              <aside className="fp-panel">
                <p className="hero-eyebrow">Recovery Flow</p>
                <h1>Reset access without contacting support first.</h1>
                <p>
                  The reset flow is quick, secure, and designed to get you back
                  into your account with minimal friction.
                </p>

                <ol className="fp-step-list">
                  {steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </aside>

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
                      <h2>Forgot your password?</h2>
                      <p>Enter your email address and we&apos;ll send you a secure reset link.</p>
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
                      Remember your password? <Link to="/login">Back to Login</Link>
                    </p>
                  </>
                ) : (
                  <div className="fp-success">
                    <div className="fp-success-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12.75 11.25 15 15 9.75" />
                        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <p className="hero-eyebrow">Check your inbox</p>
                    <h2>Email sent</h2>
                    <p>We&apos;ve sent a password reset link to <strong>{email}</strong>. Follow the instructions in that message to continue.</p>
                    <p className="fp-spam-note">If it does not arrive, check spam or request another email.</p>
                    <Link to="/login" className="primary-btn fp-btn fp-btn-link">
                      Back to Login
                    </Link>
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
          </div>
        </section>
      </main>
    </div>
  )
}

export default ForgotPassword
