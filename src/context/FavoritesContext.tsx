import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { favoriteApi, getApiErrorMessage } from '../services/api'
import { useAuth } from './AuthContext'
import './FavoritesContext.css'

interface FavoriteRecord {
 id: number       // FavoriteData primary key, used for DELETE
carId: number    // Foreign key to the Car entity
}

interface FavoritesContextValue {
  favoriteIds: number[]
  loading: boolean
  error: string
  add: (carId: number) => Promise<void>
  remove: (carId: number) => Promise<void>
  isFavorite: (carId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  const [records, setRecords] = useState<FavoriteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch favorites whenever the user logs in or out
  useEffect(() => {
    if (!isLoggedIn) {
      setRecords([])
      return
    }

    let alive = true
    setLoading(true)
    setError('')

    favoriteApi
      .getMine()
      .then((data) => {
        if (!alive) return
        const arr = (data as FavoriteRecord[]) ?? []
        setRecords(arr)
      })
      .catch((err) => {
         // Skip the global banner since pages handle initial fetch errors via their own UI.
        // The banner is strictly reserved for direct user interactions (e.g., adding/removing a favorite).
        if (alive) console.error('Failed to load favorites:', err)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [isLoggedIn])

  // Auto-dismiss error banner
  useEffect(() => {
    if(!error) return
    const timer = setTimeout(() => setError(''), 5000)
    return () => clearTimeout(timer)
  } , [error])

  const add = useCallback(async (carId: number) => {
    try {
      await favoriteApi.add(carId)
      // Re-fetch to get the new favoriteId assigned by the backend
      const data = await favoriteApi.getMine()
      setRecords((data as FavoriteRecord[]) ?? [])
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }, [])

  const remove = useCallback(async (carId: number) => {
    const target = records.find((r) => r.carId === carId)
    if (!target) return

    try {
      await favoriteApi.remove(target.id)
      setRecords((prev) => prev.filter((r) => r.carId !== carId))
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }, [records])

  const isFavorite = useCallback(
    (carId: number) => records.some((r) => r.carId === carId),
    [records],
  )

  const favoriteIds = records.map((r) => r.carId)

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, loading, error, add, remove, isFavorite }}
    >
      {children}
      {error && (
        <div className='am-favorites-error' role='alert'>
          {error}
          <button
          type="button"
          className='am-favorites-error-close'
          onClick={() => setError('')}
          aria-label='Dismiss error'
        >
           ×
        </button>
        </div>
      )}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}