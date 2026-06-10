import type { Offer, Fuel, Transmission } from './catalog.types'
import { announcementApi } from '../../services/api'
import type { AnnouncementDto } from '../../services/api'

export const CATALOG_FAVORITE_ID_OFFSET = 1000

export function toCatalogFavoriteId(offerId: string): number | null {
  const numericId = Number.parseInt(offerId, 10)
  return Number.isInteger(numericId) ? CATALOG_FAVORITE_ID_OFFSET + numericId : null
}

export function fromCatalogFavoriteId(favoriteId: number): string | null {
  if (favoriteId < CATALOG_FAVORITE_ID_OFFSET) return null
  return String(favoriteId - CATALOG_FAVORITE_ID_OFFSET)
}

export function isCatalogFavoriteId(favoriteId: number): boolean {
  return favoriteId >= CATALOG_FAVORITE_ID_OFFSET
}

function mapFuelType(fuelType: string): Fuel {
  const map: Record<string, Fuel> = {
    Petrol: 'petrol',
    Diesel: 'diesel',
    Hybrid: 'hybrid',
    Electric: 'electric',
    LPG: 'gas',
    CNG: 'gas',
    Hydrogen: 'electric',
  }
  return map[fuelType] ?? 'petrol'
}

function mapTransmission(transmission: string): Transmission {
  return transmission === 'Manual' ? 'manual' : 'automatic'
}

function normalizeEnumLabel(value?: string): string | undefined {
  if (!value) return undefined
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^Suv$/, 'SUV')
}

function mapAnnouncementToOffer(a: AnnouncementDto): Offer {
  const coverImage =
    a.images.find((img) => img.isCover)?.url ?? a.images[0]?.url ?? null

  return {
    id: String(a.id),
    title: a.title || `${a.brand.name} ${a.model} ${a.year}`,
    price: Number(a.price),
    currency: 'EUR',
    year: a.year,
    km: a.mileage,
    fuel: mapFuelType(a.fuelType),
    transmission: mapTransmission(a.transmission),
    powerHp: a.horsepower ?? undefined,
    location: a.ownerCity || 'Moldova',
    description: a.description ?? '',
    bodyType: normalizeEnumLabel(a.bodyType),
    condition: normalizeEnumLabel(a.condition),
    color: normalizeEnumLabel(a.color),
    doors: a.doors,
    seats: a.seats,
    engineSize: a.engineSize,
    vin: a.vin,
    negotiable: a.negotiable,
    showPhone: a.showPhone,
    imageUrl: coverImage,
    images: a.images.map((img) => img.url),
    isNew: a.status === 'Active',
  }
}

export async function fetchOffers(): Promise<Offer[]> {
  const announcements = await announcementApi.getAll()
  return announcements.map(mapAnnouncementToOffer)
}
