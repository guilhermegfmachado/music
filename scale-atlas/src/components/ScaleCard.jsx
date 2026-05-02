import { Link } from 'react-router-dom'
import styles from './ScaleCard.module.css'

export default function ScaleCard({ scale, isFavorite, onToggleFavorite }) {
  const moods = scale.characteristics.mood.slice(0, 3)

  return (
    <div className={styles.card}>
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
          {isFavorite ? '♥' : '♡'}
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
