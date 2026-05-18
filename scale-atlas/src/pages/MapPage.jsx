import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './MapPage.module.css'

const REGIONS = [
  { id: 'western-europe',    label: 'Western Europe',     col: 2, row: 1, color: '#dbeafe', darkColor: '#1e2e6a' },
  { id: 'eastern-europe',    label: 'Eastern Europe',     col: 3, row: 1, color: '#e0e7ff', darkColor: '#252060' },
  { id: 'middle-east',       label: 'Middle East',        col: 4, row: 1, color: '#fde68a', darkColor: '#3a2800' },
  { id: 'central-asia',      label: 'Central Asia',       col: 5, row: 1, color: '#fed7aa', darkColor: '#431407' },
  { id: 'east-asia',         label: 'East Asia',          col: 6, row: 1, color: '#fce7f3', darkColor: '#4a0a3a' },
  { id: 'north-america',     label: 'North America',      col: 1, row: 2, color: '#d1fae5', darkColor: '#042e1a' },
  { id: 'north-africa',      label: 'North Africa',       col: 3, row: 2, color: '#fef9c3', darkColor: '#3a2e00' },
  { id: 'south-asia',        label: 'South Asia',         col: 4, row: 2, color: '#ede9fe', darkColor: '#2e1065' },
  { id: 'southeast-asia',    label: 'Southeast Asia',     col: 5, row: 2, color: '#d1fae5', darkColor: '#042e1a' },
  { id: 'south-america',     label: 'South America',      col: 1, row: 3, color: '#dcfce7', darkColor: '#052e16' },
  { id: 'west-africa',       label: 'West Africa',        col: 2, row: 3, color: '#fce7f3', darkColor: '#4a0a3a' },
  { id: 'east-africa',       label: 'East Africa',        col: 3, row: 3, color: '#fef9c3', darkColor: '#3a2e00' },
  { id: 'southern-africa',   label: 'Southern Africa',    col: 3, row: 4, color: '#e0f2fe', darkColor: '#0c3050' },
  { id: 'western',           label: 'Western (Jazz/Theory)', col: 6, row: 2, color: '#e8e5f5', darkColor: '#252238' },
]

// Map region field to region group IDs
function scaleRegionToId(region, culture, tradition) {
  const r = (region || '').toLowerCase()
  const c = (culture || '').toLowerCase()
  const t = (tradition || '').toLowerCase()

  if (r.includes('west africa') || r.includes('southern africa') && c.includes('zimbabwe')) {
    if (r.includes('southern') || c.includes('zimbabw')) return 'southern-africa'
    return 'west-africa'
  }
  if (r.includes('east africa') || c.includes('ethiopian')) return 'east-africa'
  if (r.includes('north africa') || c.includes('moroccan') || c.includes('gnawa')) return 'north-africa'
  if (r.includes('south asia') || c.includes('indian') || c.includes('carnatic') || c.includes('hindustani')) return 'south-asia'
  if (r.includes('east asia') || c.includes('japanese') || c.includes('chinese')) return 'east-asia'
  if (r.includes('southeast asia') || c.includes('javanese') || c.includes('balinese') || c.includes('vietnamese') || c.includes('indonesian')) return 'southeast-asia'
  if (r.includes('middle east') || r.includes('central asia') && (c.includes('persian') || c.includes('turkish') || c.includes('arabic'))) {
    if (c.includes('persian') || c.includes('iranian')) return 'middle-east'
    if (c.includes('turkish') || c.includes('ottoman')) return 'middle-east'
    return 'middle-east'
  }
  if (r.includes('eastern europe') || r.includes('balkans') || r.includes('carpathian') || c.includes('bulgarian') || c.includes('romani') || c.includes('ukrainian') || c.includes('hungarian')) return 'eastern-europe'
  if (r.includes('western europe') || r.includes('southern europe') || c.includes('celtic') || c.includes('scottish') || c.includes('european')) return 'western-europe'
  if (r.includes('north america') || c.includes('american') || t.includes('jazz') || t.includes('blues')) return 'north-america'
  if (r.includes('south america') || c.includes('andean') || c.includes('latin')) return 'south-america'
  if (r.includes('west africa') || c.includes('mande') || c.includes('west african')) return 'west-africa'
  if (r.includes('western') && (t.includes('jazz') || t.includes('classical western'))) return 'western'
  return 'western-europe'
}

function groupScalesByRegion(scales) {
  const groups = {}
  for (const scale of scales) {
    const rid = scaleRegionToId(scale.region, scale.culture, scale.tradition)
    if (!groups[rid]) groups[rid] = []
    groups[rid].push(scale)
  }
  return groups
}

export default function MapPage({ scales }) {
  const [active, setActive] = useState(null)
  const groups = groupScalesByRegion(scales)

  const activeRegion = REGIONS.find(r => r.id === active)
  const activeScales = active ? (groups[active] || []) : []

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Scale Atlas by Region</h1>
          <p className={styles.subtitle}>Browse scales by where they come from. Click a region to explore its musical traditions.</p>
        </div>

        {/* Region grid */}
        <div className={styles.grid}>
          {REGIONS.map(region => {
            const count = (groups[region.id] || []).length
            const isActive = active === region.id
            return (
              <button
                key={region.id}
                className={`${styles.regionCard} ${isActive ? styles.regionCardActive : ''}`}
                style={{
                  gridColumn: region.col,
                  gridRow: region.row,
                  '--region-color': region.color,
                  '--region-dark': region.darkColor,
                }}
                onClick={() => setActive(isActive ? null : region.id)}
              >
                <span className={styles.regionLabel}>{region.label}</span>
                {count > 0 && <span className={styles.regionCount}>{count} scale{count !== 1 ? 's' : ''}</span>}
              </button>
            )
          })}
        </div>

        {/* Scales panel */}
        {active && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>{activeRegion?.label}</h2>
              <button className={styles.closeBtn} onClick={() => setActive(null)}>✕</button>
            </div>
            {activeScales.length === 0 ? (
              <p className={styles.empty}>No scales yet for this region — more coming soon.</p>
            ) : (
              <div className={styles.scaleGrid}>
                {activeScales.map(scale => (
                  <Link key={scale.id} to={`/scale/${scale.id}`} className={styles.scaleCard}>
                    <div className={styles.scaleName}>{scale.name}</div>
                    <div className={styles.scaleMeta}>
                      <span className={styles.scaleCulture}>{scale.culture}</span>
                      <span className={styles.scaleTones}>{scale.toneCount} tones</span>
                    </div>
                    <div className={styles.scaleMoods}>
                      {scale.characteristics.mood.slice(0, 2).map(m => (
                        <span key={m} className={`tag tag-${m}`}>{m}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
