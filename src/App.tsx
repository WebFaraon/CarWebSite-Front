import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import SellCar from './pages/SellCar/SellCar.tsx'
import Login from './pages/Auth/Login.tsx'
import Favorites from './pages/Favorites/Favorites.tsx'
import CatalogPage from './pages/Catalog/CatalogPage.tsx'
import Signup from './pages/Auth/Signup.tsx'
import ContactUs from './pages/ContactUs/ContactUs.tsx'
import CarDetails from './pages/CarDetails/CarDetails.tsx'
import ForgotPassword from './pages/Auth/ForgotPassword.tsx'
import Help from './pages/Help/Help.tsx'
import MyListings from './pages/MyListings/MyListings.tsx'
import AdminDashboard from './pages/Admin/AdminDashboard.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useAdminAuth()
  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/admin/login" replace />
}

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
        <Route path="/car-details" element={<CarDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/offers" element={<CatalogPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </AdminAuthProvider>
  )
}

export default App
