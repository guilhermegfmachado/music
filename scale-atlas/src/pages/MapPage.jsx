import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps'
import styles from './MapPage.module.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const REGIONS = [
  { id: 'western-europe',  label: 'Western Europe',        fillL: '#bfdbfe', fillD: '#1e3a5f', active: '#3b82f6' },
  { id: 'eastern-europe',  label: 'Eastern Europe',        fillL: '#c7d2fe', fillD: '#252560', active: '#6366f1' },
  { id: 'middle-east',     label: 'Middle East',           fillL: '#fde68a', fillD: '#3a2800', active: '#f59e0b' },
  { id: 'central-asia',    label: 'Central Asia',          fillL: '#fed7aa', fillD: '#431407', active: '#f97316' },
  { id: 'east-asia',       label: 'East Asia',             fillL: '#fbcfe8', fillD: '#4a0a3a', active: '#ec4899' },
  { id: 'south-asia',      label: 'South Asia',            fillL: '#ddd6fe', fillD: '#2e1065', active: '#8b5cf6' },
  { id: 'southeast-asia',  label: 'Southeast Asia',        fillL: '#a7f3d0', fillD: '#042e1a', active: '#10b981' },
  { id: 'north-africa',    label: 'North Africa',          fillL: '#fef08a', fillD: '#3a2e00', active: '#ca8a04' },
  { id: 'west-africa',     label: 'West Africa',           fillL: '#fecdd3', fillD: '#4a0a20', active: '#f43f5e' },
  { id: 'east-africa',     label: 'East Africa',           fillL: '#fed7aa', fillD: '#3a1c07', active: '#ea580c' },
  { id: 'southern-africa', label: 'Southern Africa',       fillL: '#bae6fd', fillD: '#0c2a40', active: '#0ea5e9' },
  { id: 'north-america',   label: 'North America',         fillL: '#bbf7d0', fillD: '#052e16', active: '#22c55e' },
  { id: 'south-america',   label: 'South America',         fillL: '#d9f99d', fillD: '#1a2e04', active: '#84cc16' },
  { id: 'western',         label: 'Western / Jazz',        fillL: '#e9d5ff', fillD: '#2e1065', active: '#a855f7' },
]

const REGION_BY_ID = Object.fromEntries(REGIONS.map(r => [r.id, r]))

// ISO 3166-1 numeric code → musical region
const CODE_TO_REGION = {
  // Western Europe
  826: 'western-europe', 250: 'western-europe', 276: 'western-europe',
  724: 'western-europe', 620: 'western-europe', 380: 'western-europe',
  528: 'western-europe', 56: 'western-europe',  756: 'western-europe',
  40: 'western-europe',  578: 'western-europe', 752: 'western-europe',
  208: 'western-europe', 246: 'western-europe', 372: 'western-europe',
  300: 'western-europe', 442: 'western-europe', 20: 'western-europe',
  470: 'western-europe', 352: 'western-europe',
  // Eastern Europe / Russia / Caucasus
  616: 'eastern-europe', 203: 'eastern-europe', 703: 'eastern-europe',
  348: 'eastern-europe', 642: 'eastern-europe', 100: 'eastern-europe',
  688: 'eastern-europe', 191: 'eastern-europe', 70: 'eastern-europe',
  807: 'eastern-europe', 499: 'eastern-europe', 8: 'eastern-europe',
  705: 'eastern-europe', 804: 'eastern-europe', 112: 'eastern-europe',
  498: 'eastern-europe', 440: 'eastern-europe', 428: 'eastern-europe',
  233: 'eastern-europe', 643: 'eastern-europe', 268: 'eastern-europe',
  51: 'eastern-europe',  31: 'eastern-europe',
  // Middle East
  792: 'middle-east', 364: 'middle-east', 368: 'middle-east',
  682: 'middle-east', 887: 'middle-east', 512: 'middle-east',
  784: 'middle-east', 634: 'middle-east', 414: 'middle-east',
  48: 'middle-east',  400: 'middle-east', 422: 'middle-east',
  760: 'middle-east', 376: 'middle-east', 275: 'middle-east',
  196: 'middle-east',
  // Central Asia
  398: 'central-asia', 860: 'central-asia', 795: 'central-asia',
  417: 'central-asia', 762: 'central-asia', 4: 'central-asia',
  496: 'central-asia',
  // East Asia
  156: 'east-asia', 392: 'east-asia', 410: 'east-asia',
  408: 'east-asia', 158: 'east-asia',
  // South Asia
  356: 'south-asia', 586: 'south-asia', 50: 'south-asia',
  144: 'south-asia', 524: 'south-asia', 64: 'south-asia',
  462: 'south-asia',
  // Southeast Asia
  764: 'southeast-asia', 704: 'southeast-asia', 104: 'southeast-asia',
  116: 'southeast-asia', 418: 'southeast-asia', 458: 'southeast-asia',
  702: 'southeast-asia', 360: 'southeast-asia', 608: 'southeast-asia',
  96: 'southeast-asia',  626: 'southeast-asia',
  // North Africa
  504: 'north-africa', 12: 'north-africa', 788: 'north-africa',
  434: 'north-africa', 818: 'north-africa', 729: 'north-africa',
  478: 'north-africa',
  // West Africa
  686: 'west-africa', 624: 'west-africa', 324: 'west-africa',
  694: 'west-africa', 430: 'west-africa', 384: 'west-africa',
  288: 'west-africa', 768: 'west-africa', 204: 'west-africa',
  566: 'west-africa', 562: 'west-africa', 466: 'west-africa',
  854: 'west-africa', 270: 'west-africa', 120: 'west-africa',
  266: 'west-africa', 178: 'west-africa', 180: 'west-africa',
  140: 'west-africa', 24: 'west-africa',
  // East Africa
  231: 'east-africa', 232: 'east-africa', 262: 'east-africa',
  706: 'east-africa', 404: 'east-africa', 834: 'east-africa',
  800: 'east-africa', 646: 'east-africa', 108: 'east-africa',
  450: 'east-africa',
  // Southern Africa
  716: 'southern-africa', 710: 'southern-africa', 508: 'southern-africa',
  454: 'southern-africa', 894: 'southern-africa', 516: 'southern-africa',
  72: 'southern-africa',  426: 'southern-africa', 748: 'southern-africa',
  // North America
  840: 'north-america', 124: 'north-america', 484: 'north-america',
  320: 'north-america', 340: 'north-america', 222: 'north-america',
  558: 'north-america', 188: 'north-america', 591: 'north-america',
  192: 'north-america', 332: 'north-america', 388: 'north-america',
  630: 'north-america', 214: 'north-america',
  // South America
  76: 'south-america',  32: 'south-america',  152: 'south-america',
  604: 'south-america', 68: 'south-america',  170: 'south-america',
  218: 'south-america', 862: 'south-america', 600: 'south-america',
  858: 'south-america', 328: 'south-america', 740: 'south-america',
}

function scaleToRegionId(region, culture, tradition) {
  const r = (region || '').toLowerCase()
  const c = (culture || '').toLowerCase()
  const t = (tradition || '').toLowerCase()
  if (r.includes('east asia') || c.includes('japanese') || c.includes('chinese') || c.includes('okinawan') || c.includes('korean')) return 'east-asia'
  if (r.includes('central asia') || c.includes('mongolian') || c.includes('tibetan') || c.includes('uzbek') || c.includes('kazakh')) return 'central-asia'
  if (r.includes('south asia') || r.includes('india') || c.includes('indian') || c.includes('carnatic') || c.includes('hindustani') || c.includes('nepali')) return 'south-asia'
  if (r.includes('southeast asia') || c.includes('javanese') || c.includes('balinese') || c.includes('vietnamese') || c.includes('indonesian')) return 'southeast-asia'
  if (r.includes('middle east') || c.includes('persian') || c.includes('turkish') || c.includes('arabic') || c.includes('ottoman') || c.includes('iraqi')) return 'middle-east'
  if (r === 'russia' || r.includes('eastern europe') || r.includes('balkans') || r.includes('carpathian') || c.includes('bulgarian') || c.includes('romani') || c.includes('ukrainian') || c.includes('hungarian') || c.includes('hutsul')) return 'eastern-europe'
  if (r.includes('north africa') || c.includes('moroccan') || c.includes('gnawa') || c.includes('egyptian') || c.includes('algerian')) return 'north-africa'
  if (r.includes('west africa') || c.includes('mande') || c.includes('west african') || c.includes('yoruba') || c.includes('ewe')) return 'west-africa'
  if (r.includes('east africa') || c.includes('ethiopian') || c.includes('kenyan')) return 'east-africa'
  if (r.includes('southern africa') || c.includes('zimbabwe') || c.includes('shona')) return 'southern-africa'
  if (r.includes('western europe') || r.includes('southern europe') || c.includes('celtic') || c.includes('scottish') || c.includes('flamenco') || c.includes('spanish') || c.includes('european')) return 'western-europe'
  if (r.includes('south america') || c.includes('andean') || c.includes('quechua') || c.includes('latin')) return 'south-america'
  if (r.includes('north america') || c.includes('american') || t.includes('jazz') || t.includes('blues')) return 'north-america'
  if (t.includes('western classical') || t.includes('classical western')) return 'western'
  return 'western'
}

function groupScalesByRegion(scales) {
  const groups = {}
  for (const scale of scales) {
    const rid = scaleToRegionId(scale.region, scale.culture, scale.tradition)
    if (!groups[rid]) groups[rid] = []
    groups[rid].push(scale)
  }
  return groups
}

export default function MapPage({ scales, theme }) {
  const [active, setActive] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '' })
  const isDark = theme === 'dark'
  const groups = groupScalesByRegion(scales)

  const activeRegion = active ? REGION_BY_ID[active] : null
  const activeScales = active ? (groups[active] || []) : []

  function handleCountryClick(geo) {
    const rid = CODE_TO_REGION[geo.id]
    if (rid) setActive(prev => prev === rid ? null : rid)
  }

  function handleMouseEnter(geo, evt) {
    const rid = CODE_TO_REGION[geo.id]
    if (rid) setTooltip({ visible: true, x: evt.clientX, y: evt.clientY, label: REGION_BY_ID[rid]?.label || '' })
  }

  function handleMouseMove(evt) {
    if (tooltip.visible) setTooltip(t => ({ ...t, x: evt.clientX, y: evt.clientY }))
  }

  function handleMouseLeave() {
    setTooltip(t => ({ ...t, visible: false }))
  }

  function getCountryFill(geo) {
    const rid = CODE_TO_REGION[geo.id]
    if (!rid) return isDark ? '#1e2232' : '#e5e7eb'
    const reg = REGION_BY_ID[rid]
    if (!reg) return isDark ? '#1e2232' : '#e5e7eb'
    if (active === rid) return reg.active
    return isDark ? reg.fillD : reg.fillL
  }

  return (
    <div className={styles.page} onMouseMove={handleMouseMove}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Scale Atlas by Region</h1>
          <p className={styles.subtitle}>Click any country or region label to explore its musical traditions.</p>
        </div>

        <div className={styles.mapWrap}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130, center: [15, 20] }}
            width={800}
            height={420}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <Sphere fill={isDark ? '#0f1117' : '#f0f4ff'} stroke={isDark ? '#2a2d3e' : '#cbd5e1'} strokeWidth={0.5} />
            <Graticule stroke={isDark ? '#1e2232' : '#e2e8f0'} strokeWidth={0.3} />
            <Geographies geography={GEO_URL}>
              {({ geographies }) => geographies.length === 0 ? (
                <text x="400" y="210" textAnchor="middle" fill={isDark ? '#4a5568' : '#94a3b8'} fontSize="14">Loading map…</text>
              ) :
                geographies.map(geo => {
                  const rid = CODE_TO_REGION[geo.id]
                  const reg = rid ? REGION_BY_ID[rid] : null
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFill(geo)}
                      stroke={isDark ? '#0a0c14' : '#ffffff'}
                      strokeWidth={0.4}
                      style={{
                        hover: {
                          fill: reg ? reg.active : (isDark ? '#2a2d3e' : '#d1d5db'),
                          cursor: rid ? 'pointer' : 'default',
                          outline: 'none',
                        },
                        pressed: { outline: 'none' },
                        default: { outline: 'none' },
                      }}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={evt => handleMouseEnter(geo, evt)}
                      onMouseLeave={handleMouseLeave}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>

          {tooltip.visible && tooltip.label && (
            <div
              className={styles.tooltip}
              style={{ left: tooltip.x + 14, top: tooltip.y - 36, position: 'fixed' }}
            >
              {tooltip.label}
            </div>
          )}
        </div>

        {/* Legend / region buttons */}
        <div className={styles.legend}>
          {REGIONS.map(r => {
            const count = (groups[r.id] || []).length
            if (count === 0) return null
            return (
              <button
                key={r.id}
                className={`${styles.legendItem} ${active === r.id ? styles.legendActive : ''}`}
                style={{ '--lc': isDark ? r.fillD : r.fillL, '--la': r.active }}
                onClick={() => setActive(prev => prev === r.id ? null : r.id)}
              >
                <span className={styles.legendDot} />
                <span className={styles.legendLabel}>{r.label}</span>
                <span className={styles.legendCount}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Scales panel */}
        {active && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>{activeRegion?.label}</h2>
              <span className={styles.panelCount}>{activeScales.length} scale{activeScales.length !== 1 ? 's' : ''}</span>
              <button className={styles.closeBtn} onClick={() => setActive(null)}>✕</button>
            </div>
            {activeScales.length === 0 ? (
              <p className={styles.empty}>No scales yet for this region.</p>
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
