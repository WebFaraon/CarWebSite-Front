import type { FeaturedCar } from '../components/home/types'
import { toCatalogFavoriteId } from '../pages/Catalog/catalog.api'
import type { Offer } from '../pages/Catalog/catalog.types'


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
    image: offer.imageUrl || '',
    images: offer.images.length > 0 ? offer.images : (offer.imageUrl ? [offer.imageUrl] : []),
    fuel: label(offer.fuel),
    transmission: label(offer.transmission),
    body: display(offer.bodyType),
    engine: offer.powerHp ? `${offer.powerHp} hp` : 'N/A',
    consumption: offer.location,
    location: offer.location,
    description: offer.description,
    features: offer.features ?? [],
    offer,
  }
}
