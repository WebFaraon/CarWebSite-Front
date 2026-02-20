import FeaturedCarsSection from '../../components/home/FeaturedCarsSection.tsx'
import HeroSection from '../../components/home/HeroSection.tsx'
import Navbar from '../../components/navbar/Navbar.tsx'
import SiteFooter from '../../components/home/SiteFooter.tsx'
import WhyChooseUsSection from '../../components/home/WhyChooseUsSection.tsx'
import type {
  FeatureItem,
  FeaturedCar,
  SocialItem,
} from '../../components/home/types.ts'
import './Home.css'

const featuredCars: FeaturedCar[] = [
  {
    id: 1,
    name: 'BMW',
    model: 'X5',
    year: 2023,
    mileage: '12,800 mi',
    price: '$58,900',
    image: 'https://placehold.co/600x380/F4F6FB/1F2937?text=BMW+X5',
  },
  {
    id: 2,
    name: 'Audi',
    model: 'A6',
    year: 2022,
    mileage: '18,300 mi',
    price: '$45,600',
    image: 'https://placehold.co/600x380/EEF7FF/1F2937?text=Audi+A6',
  },
  {
    id: 3,
    name: 'Tesla',
    model: 'Model Y',
    year: 2024,
    mileage: '5,100 mi',
    price: '$49,400',
    image: 'https://placehold.co/600x380/F6F9F3/1F2937?text=Tesla+Model+Y',
  },
  {
    id: 4,
    name: 'Mercedes',
    model: 'C-Class',
    year: 2021,
    mileage: '24,900 mi',
    price: '$39,200',
    image: 'https://placehold.co/600x380/FFF8EE/1F2937?text=Mercedes+C-Class',
  },
  {
    id: 5,
    name: 'Toyota',
    model: 'RAV4',
    year: 2023,
    mileage: '9,700 mi',
    price: '$33,800',
    image: 'https://placehold.co/600x380/F4FAFF/1F2937?text=Toyota+RAV4',
  },
  {
    id: 6,
    name: 'Honda',
    model: 'Civic',
    year: 2022,
    mileage: '17,400 mi',
    price: '$26,900',
    image: 'https://placehold.co/600x380/FFF4F4/1F2937?text=Honda+Civic',
  },
  {
    id: 7,
    name: 'Porsche',
    model: 'Macan',
    year: 2024,
    mileage: '3,800 mi',
    price: '$71,500',
    image: 'https://placehold.co/600x380/F5F8FF/1F2937?text=Porsche+Macan',
  },
  {
    id: 8,
    name: 'Lexus',
    model: 'NX',
    year: 2023,
    mileage: '8,300 mi',
    price: '$43,100',
    image: 'https://placehold.co/600x380/F8F7FF/1F2937?text=Lexus+NX',
  },
]

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
  return (
    <>
      <Navbar />
      <main className="home-page">
        <HeroSection />
        <FeaturedCarsSection cars={featuredCars} />
        <WhyChooseUsSection features={features} />
      </main>

      <SiteFooter socialLinks={socialLinks} />
    </>
  )
}

export default Home
