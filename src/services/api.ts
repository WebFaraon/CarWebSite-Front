const API_URL = import.meta.env.VITE_API_URL as string

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
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
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
    user: UserDto
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
  }) =>
    request<{ isSuccess: boolean; message: string }>('/api/Session/register', {
      method: 'POST',
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
