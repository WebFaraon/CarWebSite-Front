const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:5229')
  .replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function readMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const data = body as Record<string, unknown>
    const message = data.message ?? data.detail ?? data.title
    if (typeof message === 'string' && message.trim()) return message
  }

  if (typeof body === 'string' && body.trim()) return body
  return fallback
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0 || error.status === 503) {
      return 'Serviciul este momentan indisponibil. Verificați dacă Backend-ul și SQL Server sunt pornite.'
    }
    return error.message
  }

  if (error instanceof TypeError) {
    return 'Serviciul este momentan indisponibil. Verificați dacă Backend-ul este pornit.'
  }

  return error instanceof Error ? error.message : 'A apărut o eroare neașteptată.'
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch (error) {
    throw new ApiError(getApiErrorMessage(error), 0, error)
  }

  const body = await parseResponseBody(res)
  if (!res.ok) {
    throw new ApiError(readMessage(body, res.statusText), res.status, body)
  }

  return body as T
}
// User returned by login (use UserDto for /me).
export interface AuthUserDto {
  id: number
  fullName: string
  email: string
  role: string
}

export interface UserDto {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  city: string
  role: string
  registeredOn: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: AuthUserDto
}

export interface ProfileResponse {
  isSuccess: boolean
  message?: string
  errorCode?: string
  user?: UserDto
}

export interface BrandDto {
  id: number
  name: string
}

export interface CarImageDto {
  id: number
  url: string
  isCover: boolean
  carId: number
}

export interface AnnouncementDto {
  id: number
  title: string
  status: string
  negotiable: boolean
  showPhone: boolean
  views: number
  inquiries: number
  publishedAt: string
  userId: number
  ownerName: string
  ownerEmail: string
  ownerPhone?: string
  ownerCity?: string
  carId: number
  brand: BrandDto
  model: string
  year: number
  mileage: number
  price: number
  fuelType: string
  transmission: string
  condition: string
  description: string
  bodyType: string
  color?: string
  doors?: number
  seats?: number
  engineSize?: string
  horsepower?: number
  vin?: string
  features?: string[]
  images: CarImageDto[]
}

export interface AnnouncementCreateData {
  title: string
  negotiable: boolean
  showPhone: boolean
  model: string
  year: number
  mileage: number
  price: number
  fuelType: string
  transmission: string
  condition: string
  description: string
  bodyType: string
  color?: string
  doors?: string
  seats?: number
  engineSize?: string
  horsepower?: number
  vin?: string
  brandId: number
  features?: string[]
  images: { url: string; isCover: boolean }[]
}

export const userApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>('/api/Session/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    fullName: string
    email: string
    password: string
    phoneNumber?: string
    city?: string
  }) =>
    request<{ isSuccess: boolean; message: string }>('/api/Session/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
      getProfile: () => request<ProfileResponse>('/api/User/me'),
      updateProfile: (data: { fullName?: string; phoneNumber?: string; city?: string }) =>
      request<ProfileResponse>('/api/User/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}


export interface AnnouncementUpdateData {
  title?: string
  negotiable?: boolean
  showPhone?: boolean
  status?: 'Active' | 'Hidden' | 'Pending'
  model?: string
  year?: number
  mileage?: number
  price?: number
  fuelType?: string
  transmission?: string
  condition?: string
  description?: string
  bodyType?: string
  color?: string
  doors?: string
  seats?: number
  engineSize?: string
  horsepower?: number
  vin?: string
  brandId?: number
  features?: string[]
  images?: { url: string; isCover: boolean }[]
}


export const announcementApi = {
  getAll: () => request<AnnouncementDto[]>('/api/announcement/getAll'),
  
  getById: (id: number) =>
  request<AnnouncementDto>(`/api/announcement?id=${id}`, { method: 'GET' }),
  
  create: (data: AnnouncementCreateData) =>
    request<AnnouncementDto>('/api/announcement', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: AnnouncementUpdateData) =>
    request<unknown>(`/api/announcement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<unknown>(`/api/announcement?id=${id}`, { method: 'DELETE' }),
}


export const brandApi = {
  getAll: () => request<BrandDto[]>('/api/brand/getAll'),
}

export const contactApi = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    request<unknown>('/api/contactmessage', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

export const favoriteApi = {
  getMine: () => request<unknown[]>('/api/favorite'),
  add: (carId: number) =>
    request<unknown>(`/api/favorite?carId=${carId}`, { method: 'POST' }),
  remove: (id: number) =>
    request<unknown>(`/api/favorite/${id}`, { method: 'DELETE' }),
}
