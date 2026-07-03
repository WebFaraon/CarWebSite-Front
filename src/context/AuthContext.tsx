import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { userApi } from '../services/api'
import type { AuthUserDto } from '../services/api'

// Login user; profile fields filled after GET /me.
export interface SessionUser extends AuthUserDto{
  phonenumber?: string
  city?: string
  registeredOn?: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  isAdmin: boolean
  user: SessionUser | null
  login: (email: string, password: string) => Promise<SessionUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(readStoredUser)
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))

  const isAdmin =
    isLoggedIn && (user?.role === 'Admin' || user?.role === 'Manager')

  async function login(email: string, password: string): Promise<SessionUser> {
    const res = await userApi.login(email, password)
    localStorage.setItem('token', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('user', JSON.stringify(res.user))
    setUser(res.user)
    setIsLoggedIn(true)
    return res.user
  }

  function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('isAdminLoggedIn')
  setUser(null)
  setIsLoggedIn(false)
}

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
