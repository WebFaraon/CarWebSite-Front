import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import SellCar from './pages/SellCar/SellCar.tsx'
import Login from './pages/Auth/Login.tsx'
<<<<<<< HEAD
import Favorites from './pages/Favorites/Favorites.tsx'
import CatalogPage from './pages/Catalog/CatalogPage.tsx'
import Signup from './pages/Auth/Signup.tsx'
import ContactUs from './pages/ContactUs/ContactUs.tsx'
import CarDetails from './pages/CarDetails/CarDetails.tsx'
import ForgotPassword from './pages/Auth/ForgotPassword.tsx'
=======
import CatalogPage from './pages/Catalog/CatalogPage.tsx'
import Signup from './pages/Auth/Signup.tsx'
import ContactUs from './pages/ContactUs/ContactUs.tsx'
import Favorites from './pages/Favorites/Favorites.tsx'
>>>>>>> victor

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
<<<<<<< HEAD
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
=======
        <Route path="/offers" element={<CatalogPage />} />
>>>>>>> victor

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
