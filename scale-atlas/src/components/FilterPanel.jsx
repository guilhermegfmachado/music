import styles from './FilterPanel.module.css'
import { getRegions, getCultures, getAllMoods } from '../utils/scaleUtils.js'

export default function FilterPanel({ scales, filters, onChange, onReset }) {
  const regions = getRegions(scales)
  const cultures = getCultures(scales)
  const moods = getAllMoods(scales)
  const toneCounts = [...new Set(scales.map(s => s.toneCount))].sort((a, b) => a - b)

  function set(key, value) {
    onChange({ ...filters, [key]: value })
  }

  const hasFilters = Object.values(filters).some(v => v !== '' && v !== null && v !== undefined)

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>Filters</h3>
        {hasFilters && (
          <button className={styles.resetBtn} onClick={onReset}>Clear all</button>
        )}
      </div>

      <div className={styles.section}>
        <label htmlFor="filter-culture" className={styles.label}>Culture</label>
        <select id="filter-culture" value={filters.culture || ''} onChange={e => set('culture', e.target.value)}>
          <option value="">All cultures</option>
          {cultures.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.section}>
        <label htmlFor="filter-region" className={styles.label}>Region</label>
        <select id="filter-region" value={filters.region || ''} onChange={e => set('region', e.target.value)}>
          <option value="">All regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className={styles.section}>
        <label htmlFor="filter-tones" className={styles.label}>Tone Count</label>
        <select id="filter-tones" value={filters.toneCount || ''} onChange={e => set('toneCount', e.target.value)}>
          <option value="">Any</option>
          {toneCounts.map(n => <option key={n} value={n}>{n} tones</option>)}
        </select>
      </div>

      <div className={styles.section}>
        <label htmlFor="filter-mood" className={styles.label}>Mood</label>
        <select id="filter-mood" value={filters.mood || ''} onChange={e => set('mood', e.target.value)}>
          <option value="">Any mood</option>
          {moods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Characteristics</label>
        <div className={styles.checkGroup}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.isAnhemitonic === true}
              onChange={e => set('isAnhemitonic', e.target.checked ? true : null)}
            />
            No half-steps (anhemitonic)
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.hasTritone === true}
              onChange={e => set('hasTritone', e.target.checked ? true : null)}
            />
            Contains tritone
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={filters.hasAugmentedInterval === true}
              onChange={e => set('hasAugmentedInterval', e.target.checked ? true : null)}
            />
            Augmented interval
          </label>
        </div>
      </div>
    </aside>
  )
}
