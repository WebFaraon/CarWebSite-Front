import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface AdminAuthContextValue {
  isAdminLoggedIn: boolean
  adminLogin: (email: string, password: string) => Promise<boolean>
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { isAdmin, login, logout } = useAuth()

  async function adminLogin(email: string, password: string): Promise<boolean> {
    const user = await login(email, password)
    return user.role === 'Admin' || user.role === 'Manager'
  }

  function adminLogout() {
    logout()
  }

  return (
    <AdminAuthContext.Provider
      value={{ isAdminLoggedIn: isAdmin, adminLogin, adminLogout }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
