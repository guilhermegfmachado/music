import { Routes, Route } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import scalesData from './data/scales.json'

const ScaleDetailPage = lazy(() => import('./pages/ScaleDetailPage.jsx'))
const ComparePage     = lazy(() => import('./pages/ComparePage.jsx'))
const PracticePage    = lazy(() => import('./pages/PracticePage.jsx'))
const MapPage         = lazy(() => import('./pages/MapPage.jsx'))
const TuningsPage     = lazy(() => import('./pages/TuningsPage.jsx'))
const RhythmsPage     = lazy(() => import('./pages/RhythmsPage.jsx'))
const ChordsPage      = lazy(() => import('./pages/ChordsPage.jsx'))

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
        <Suspense fallback={<div style={{ flex: 1 }} />}>
          <Routes>
            <Route path="/" element={<HomePage scales={scales} />} />
            <Route path="/scale/:id" element={<ScaleDetailPage scales={scales} />} />
            <Route path="/compare" element={<ComparePage scales={scales} />} />
            <Route path="/practice" element={<PracticePage scales={scales} />} />
            <Route path="/map" element={<MapPage scales={scales} theme={theme} />} />
            <Route path="/tunings" element={<TuningsPage scales={scales} />} />
            <Route path="/rhythms" element={<RhythmsPage scales={scales} />} />
            <Route path="/chords" element={<ChordsPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
