import type { FeaturedCar } from '../components/home/types'
import { toCatalogFavoriteId } from '../pages/Catalog/catalog.api'
import type { Offer } from '../pages/Catalog/catalog.types'

const FALLBACK_IMAGE = '/template_images/audi-sq7.png'

function label(value?: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'
}

function display(value?: string): string {
  return value || 'N/A'
}

export function featuredCarFromOffer(offer: Offer): FeaturedCar {
  const [name = offer.title, ...modelParts] = offer.title.split(' ')
  const favoriteId = toCatalogFavoriteId(offer.id) ?? Number(offer.id)

  return {
    id: favoriteId,
    name,
    model: modelParts.join(' ') || offer.title,
    year: offer.year,
    mileage: `${new Intl.NumberFormat('de-DE').format(offer.km)} km`,
    price: `${new Intl.NumberFormat('de-DE').format(offer.price)} ${offer.currency}`,
    image: offer.imageUrl || FALLBACK_IMAGE,
    images: offer.images.length > 0 ? offer.images : [offer.imageUrl || FALLBACK_IMAGE],
    fuel: label(offer.fuel),
    transmission: label(offer.transmission),
    body: display(offer.bodyType),
    engine: offer.powerHp ? `${offer.powerHp} hp` : 'N/A',
    consumption: offer.location,
    location: offer.location,
    description: offer.description,
    features: [
      offer.isNew ? 'Active listing' : 'Verified listing',
      `${label(offer.transmission)} transmission`,
      `${display(offer.bodyType)} body type`,
      `Available in ${offer.location}`,
    ],
  }
}
