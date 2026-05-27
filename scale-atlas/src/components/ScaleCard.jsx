import { Link } from 'react-router-dom'
import { HeartIcon } from './icons.jsx'
import styles from './ScaleCard.module.css'

function regionColor(region) {
  if (!region) return null
  const r = region.toLowerCase()
  if (r.includes('west africa'))    return '#f43f5e'
  if (r.includes('east africa'))    return '#ea580c'
  if (r.includes('southern africa'))return '#0ea5e9'
  if (r.includes('north africa'))   return '#ca8a04'
  if (r.includes('south asia') || r.includes('india')) return '#8b5cf6'
  if (r.includes('east asia'))      return '#ec4899'
  if (r.includes('southeast asia')) return '#10b981'
  if (r.includes('central asia'))   return '#f97316'
  if (r === 'russia' || r.includes('eastern europe')) return '#6366f1'
  if (r.includes('middle east'))    return '#f59e0b'
  if (r.includes('western europe') || r.includes('southern europe')) return '#3b82f6'
  if (r.includes('north america'))  return '#22c55e'
  if (r.includes('south america'))  return '#84cc16'
  if (r === 'global')               return '#94a3b8'
  if (r.includes('western'))        return '#a855f7'
  return null
}

export default function ScaleCard({ scale, isFavorite, onToggleFavorite }) {
  const moods = scale.characteristics.mood.slice(0, 3)
  const accentColor = regionColor(scale.region)

  return (
    <div className={styles.card} style={accentColor ? { '--card-accent': accentColor } : undefined}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.region}>{scale.region}</span>
          <span className={styles.tones}>{scale.toneCount} tones</span>
        </div>
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
          onClick={(e) => { e.preventDefault(); onToggleFavorite(scale.id) }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon size={15} filled={isFavorite} />
        </button>
      </div>

      <Link to={`/scale/${scale.id}`} className={styles.nameLink}>
        <h3 className={styles.name}>{scale.name}</h3>
      </Link>

      {scale.aliases?.[0] && (
        <p className={styles.alias}>{scale.aliases[0]}</p>
      )}

      <p className={styles.description}>
        {scale.description.split('\n\n')[0].slice(0, 140)}…
      </p>

      <div className={styles.tags}>
        {moods.map(mood => (
          <span key={mood} className={`tag tag-${mood}`}>{mood}</span>
        ))}
        {scale.characteristics.isAnhemitonic && (
          <span className="tag">no half-steps</span>
        )}
        {scale.characteristics.hasAugmentedInterval && (
          <span className="tag">augmented</span>
        )}
      </div>

      <div className={styles.intervals}>
        {scale.intervalFormula.map((n, i) => (
          <span key={i} className={styles.interval}>{n}</span>
        ))}
      </div>
    </div>
  )
}
