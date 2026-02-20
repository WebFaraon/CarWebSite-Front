import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import SellCar from './pages/SellCar/SellCar.tsx'

function AppRoutes() {
  const location = useLocation()

  return (
    <div className="page-frame" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<SellCar />} />
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
