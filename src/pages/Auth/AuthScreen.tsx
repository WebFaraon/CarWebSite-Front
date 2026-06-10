import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { userApi } from '../../services/api'
import '../Home/Home.css'
import './AuthScreen.css'

type Mode = 'signin' | 'signup'

interface AuthScreenProps {
  mode: Mode
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7c2 0 3.8.66 5.3 1.6M22 12s-3.5 7-10 7c-2 0-3.8-.66-5.3-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  )
}

interface AuthFieldProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  toggle?: boolean
  showRight?: ReactNode
}

function AuthField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  toggle = false,
  showRight,
}: AuthFieldProps) {
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  const inputType = isPw && show ? 'text' : type

  return (
    <div className="am-auth-field">
      <div className="am-auth-field-top">
        <label className="am-auth-label">{label}</label>
        {showRight}
      </div>
      <div className="am-auth-input-wrap">
        <input
          className={'am-auth-input' + (isPw && toggle ? ' has-toggle' : '')}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          autoComplete={autoComplete}
        />
        {isPw && toggle && (
          <button
            type="button"
            className="am-auth-eye"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={show} />
          </button>
        )}
      </div>
      {error && <div className="am-auth-err">{error}</div>}
    </div>
  )
}

function AuthScreen({ mode }: AuthScreenProps) {
  const { theme } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isSignup = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const signupReady = !!(name.trim() && email && pw && pw2)
  const from = (location.state as { from?: string | { pathname?: string; search?: string; hash?: string } } | null)?.from

  const handleBack = () => {
    if (typeof from === 'string' && from !== location.pathname) {
      navigate(from)
      return
    }

    if (from && typeof from === 'object' && from.pathname && from.pathname !== location.pathname) {
      navigate(`${from.pathname}${from.search ?? ''}${from.hash ?? ''}`)
      return
    }

    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (isSignup && name.trim().length < 2) e.name = 'Please enter your name.'
    if (isSignup && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email address.'
    if (!isSignup && !email.trim()) e.email = 'Enter your email or username.'
    if (isSignup && pw.length < 8) e.pw = 'Password must be at least 8 characters.'
    if (!isSignup && pw.length < 1) e.pw = 'Enter your password.'
    if (isSignup && pw2 !== pw) e.pw2 = "Passwords don't match."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (isSignup) {
        await userApi.register({ fullName: name, email, password: pw })
        navigate('/login')
      } else {
        const user = await login(email, pw)
        const isAdmin = user.role === 'Admin' || user.role === 'Manager'
        const from = (location.state as { from?: string } | null)?.from
        navigate(from ?? (isAdmin ? '/admin' : '/'))
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isSignup
            ? 'Registration failed. Try again.'
            : 'Invalid email or password.'
      setErrors({ form: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="am" data-theme={theme}>
      <div className="am-auth">
        <div className="am-auth-top">
          <Link to="/" className="am-brand" aria-label="AutoMarket home">
            <span className="am-brand-mark">A</span>
            <span>AutoMarket</span>
          </Link>
          <button
            type="button"
            className="am-auth-back"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 5l-7 7 7 7" />
            </svg>
            Back
          </button>
        </div>

        <div className="am-auth-body">
          <div className="am-auth-card">
            <div className="am-auth-head">
              <div className="am-auth-eyebrow">
                {isSignup ? 'Join AutoMarket' : 'Welcome back'}
              </div>
              <h1 className="am-auth-title">
                {isSignup ? 'Create your account' : 'Sign in'}
              </h1>
              <div className="am-auth-switch">
                {isSignup ? (
                  <>
                    Already have an account? <Link to="/login">Sign in</Link>
                  </>
                ) : (
                  <>
                    New to AutoMarket?{' '}
                    <Link to="/signup">Create an account</Link>
                  </>
                )}
              </div>
            </div>

            {errors.form && (
              <div className="am-auth-err am-auth-err--form" role="alert">
                {errors.form}
              </div>
            )}

            <form className="am-auth-form" onSubmit={onSubmit} noValidate>
              {isSignup && (
                <AuthField
                  label="Full name"
                  placeholder="John Car"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  autoComplete="name"
                />
              )}

              <AuthField
                label={isSignup ? 'Email address' : 'Email or username'}
                type={isSignup ? 'email' : 'text'}
                placeholder={isSignup ? 'you@example.com' : 'JohnCar@example.com'}
                value={email}
                onChange={setEmail}
                error={errors.email}
                autoComplete="email"
              />

              <AuthField
                label="Password"
                type="password"
                toggle
                placeholder={
                  isSignup ? 'Create a password' : 'Enter your password'
                }
                value={pw}
                onChange={setPw}
                error={errors.pw}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                showRight={
                  !isSignup && (
                    <Link to="/forgot-password" className="am-auth-forgot">
                      Forgot password?
                    </Link>
                  )
                }
              />

              {isSignup && (
                <AuthField
                  label="Confirm password"
                  type="password"
                  toggle
                  placeholder="Repeat your password"
                  value={pw2}
                  onChange={setPw2}
                  error={errors.pw2}
                  autoComplete="new-password"
                />
              )}

              <button
                type="submit"
                className="am-auth-submit"
                disabled={submitting || (isSignup && !signupReady)}
              >
                {submitting
                  ? isSignup
                    ? 'Creating account…'
                    : 'Signing in…'
                  : isSignup
                    ? 'Create account'
                    : 'Sign in'}
              </button>
            </form>

            <div className="am-auth-meta">
              By continuing you agree to AutoMarket's{' '}
              <Link to="/help">Terms</Link> and{' '}
              <Link to="/help">Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthScreen
