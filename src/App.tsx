import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import SellCar from './pages/SellCar/SellCar.tsx'
import Login from './pages/Auth/Login.tsx'
import CatalogPage from './pages/Catalog/CatalogPage.tsx'
import Signup from './pages/Auth/Signup.tsx'
import ContactUs from './pages/ContactUs/ContactUs.tsx'
import Favorites from './pages/Favorites/Favorites.tsx'

function AppRoutes() {
  const location = useLocation()

  return (
    <div className="page-frame" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/sell" element={<SellCar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/offers" element={<CatalogPage />} />

      </Routes>
    </div>
  )
}

function App() {
  
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App