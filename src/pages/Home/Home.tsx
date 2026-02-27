import { useEffect, useState } from 'react'
import FeaturedCarsSection from '../../components/home/FeaturedCarsSection.tsx'
import HeroSection from '../../components/home/HeroSection.tsx'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection.tsx'
import type {
  FeatureItem,
  SocialItem,
} from '../../components/home/types.ts'
import { featuredCars } from '../../data/featuredCars.ts'
import { getFavoriteIds, setFavoriteIds as storeFavoriteIds } from '../../utils/favoritesStorage.ts'
import './Home.css'

const features: FeatureItem[] = [
  {
    id: 1,
    icon: 'verified',
    title: 'Verified Sellers',
    description:
      'Every seller is checked to keep listings authentic and dependable.',
  },
  {
    id: 2,
    icon: 'secure',
    title: 'Secure Transactions',
    description:
      'Protected payment and documentation flows keep each step transparent.',
  },
  {
    id: 3,
    icon: 'selection',
    title: 'Large Selection',
    description:
      'Thousands of vehicles across top brands, body styles, and budgets.',
  },
  {
    id: 4,
    icon: 'support',
    title: 'Fast Support',
    description:
      'Our team is available to help buyers and sellers close deals quickly.',
  },
]


const socialLinks: SocialItem[] = [
  { platform: 'facebook', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
]

function Home() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const toggleFavorite = (carId: number) => {
    setFavoriteIds((prev) => {
      if (prev.includes(carId)) {
        return prev.filter((id) => id !== carId)
      }
      return [...prev, carId]
    })
  }

  useEffect(() => {
    setFavoriteIds(getFavoriteIds())
  }, [])

  useEffect(() => {
    storeFavoriteIds(favoriteIds)
  }, [favoriteIds])

  return (
    <>
      <Navbar />
      <main className="home-page">
        <HeroSection />
        <FeaturedCarsSection
          cars={featuredCars}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
        <WhyChooseUsSection features={features} />
      </main>

      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Home
