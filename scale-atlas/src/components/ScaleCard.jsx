import { Link } from 'react-router-dom'
import { HeartIcon } from './icons.jsx'
import styles from './ScaleCard.module.css'

function regionColor(region) {
  if (!region) return null
  const r = region.toLowerCase()
  if (r.includes('west africa'))    return '#B84A32'
  if (r.includes('east africa'))    return '#C45214'
  if (r.includes('southern africa'))return '#4A7A8A'
  if (r.includes('north africa'))   return '#B8862A'
  if (r.includes('south asia') || r.includes('india')) return '#7A5A8A'
  if (r.includes('east asia'))      return '#A8506A'
  if (r.includes('southeast asia')) return '#4A8A5A'
  if (r.includes('central asia'))   return '#C2702A'
  if (r === 'russia' || r.includes('eastern europe')) return '#5A6A9A'
  if (r.includes('middle east'))    return '#D9A441'
  if (r.includes('western europe') || r.includes('southern europe')) return '#4A6A8A'
  if (r.includes('north america'))  return '#5A8A4A'
  if (r.includes('south america'))  return '#7A8A3A'
  if (r === 'global')               return '#8A8A7A'
  if (r.includes('western'))        return '#8A5A7A'
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
