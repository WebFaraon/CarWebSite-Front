const STORAGE_KEY = 'favoriteCars'

export const getFavoriteIds = (): number[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((value) => Number.isInteger(value))
  } catch {
    return []
  }
}

export const setFavoriteIds = (ids: number[]) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // no-op
  }
}
