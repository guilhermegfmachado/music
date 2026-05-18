import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import ScaleDetailPage from './pages/ScaleDetailPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import PracticePage from './pages/PracticePage.jsx'
import MapPage from './pages/MapPage.jsx'
import TuningsPage from './pages/TuningsPage.jsx'
import scalesData from './data/scales.json'

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sa-theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sa-theme', theme)
  }, [theme])

  const scales = scalesData.scales

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar theme={theme} onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage scales={scales} />} />
          <Route path="/scale/:id" element={<ScaleDetailPage scales={scales} />} />
          <Route path="/compare" element={<ComparePage scales={scales} />} />
          <Route path="/practice" element={<PracticePage scales={scales} />} />
          <Route path="/map" element={<MapPage scales={scales} />} />
          <Route path="/tunings" element={<TuningsPage scales={scales} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
