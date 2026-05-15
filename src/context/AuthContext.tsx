import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { userApi } from '../services/api'
import type { UserDto } from '../services/api'

interface AuthContextValue {
  isLoggedIn: boolean
  isAdmin: boolean
  user: UserDto | null
  login: (email: string, password: string) => Promise<UserDto>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): UserDto | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as UserDto) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(readStoredUser)
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))

  const isAdmin =
    isLoggedIn && (user?.role === 'Admin' || user?.role === 'Manager')

  async function login(email: string, password: string): Promise<UserDto> {
    const res = await userApi.login(email, password)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))
    setUser(res.user)
    setIsLoggedIn(true)
    return res.user
  }

  function logout() {
    localStorage.removeItem('token')
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
