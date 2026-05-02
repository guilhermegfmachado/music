import { useState, useMemo } from 'react'
import ScaleCard from '../components/ScaleCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import { searchScales, filterScales } from '../utils/searchUtils.js'
import { useFavorites } from '../hooks/useFavorites.js'
import styles from './HomePage.module.css'

const EMPTY_FILTERS = {
  culture: '',
  region: '',
  toneCount: '',
  mood: '',
  hasTritone: null,
  isAnhemitonic: null,
  hasAugmentedInterval: null,
}

export default function HomePage({ scales }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  const results = useMemo(() => {
    const searched = searchScales(scales, query)
    return filterScales(searched, filters)
  }, [scales, query, filters])

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Scale Atlas</h1>
          <p className={styles.subtitle}>
            An encyclopedia of musical scales from world traditions — from Indian ragas to Japanese koto tunings, Arabic maqamat to Western modes.
          </p>
          <div className={styles.searchBar}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search scales, cultures, regions…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
            )}
          </div>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <FilterPanel
          scales={scales}
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />

        <main className={styles.main}>
          <div className={styles.resultsHeader}>
            <span className={styles.count}>
              {results.length} scale{results.length !== 1 ? 's' : ''}
              {query && ` matching "${query}"`}
            </span>
          </div>

          {results.length === 0 ? (
            <div className={styles.empty}>
              <p>No scales match your search.</p>
              <button className="btn btn-ghost" onClick={() => { setQuery(''); resetFilters() }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {results.map(scale => (
                <ScaleCard
                  key={scale.id}
                  scale={scale}
                  isFavorite={isFavorite(scale.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
