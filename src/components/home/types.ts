export type FeatureIcon = 'verified' | 'secure' | 'selection' | 'support'
export type SocialPlatform = 'facebook' | 'instagram' | 'x' | 'linkedin'

export interface FeaturedCar {
  id: number
  name: string
  model: string
  year: number
  mileage: string
  price: string
  image: string
  fuel: string
  transmission: string
  body: string
  engine: string
  consumption: string
  features: string[]
}

export interface FeatureItem {
  id: number
  icon: FeatureIcon
  title: string
  description: string
}

export interface StatItem {
  id: number
  value: string
  label: string
}

export interface SocialItem {
  platform: SocialPlatform
  href: string
}
