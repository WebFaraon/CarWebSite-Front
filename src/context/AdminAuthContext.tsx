import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AdminAuthContextValue {
  isAdminLoggedIn: boolean
  adminLogin: (username: string, password: string) => boolean
  adminLogout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => localStorage.getItem('isAdminLoggedIn') === 'true'
  )

  function adminLogin(username: string, password: string): boolean {
    if ((username === 'admin' || username === 'admin@admin.com') && password === 'admin') {
      localStorage.setItem('isAdminLoggedIn', 'true')
      setIsAdminLoggedIn(true)
      return true
    }
    return false
  }

  function adminLogout() {
    localStorage.removeItem('isAdminLoggedIn')
    setIsAdminLoggedIn(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
