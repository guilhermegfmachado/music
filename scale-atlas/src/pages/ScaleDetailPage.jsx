import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AudioPlayer from '../components/AudioPlayer.jsx'
import PianoKeyboard from '../components/visualizations/PianoKeyboard.jsx'
import GuitarFretboard from '../components/visualizations/GuitarFretboard.jsx'
import IntervalDiagram from '../components/visualizations/IntervalDiagram.jsx'
import StaffNotation from '../components/visualizations/StaffNotation.jsx'
import { getRelatedScales, getIntervalName, intervalsToSemitones } from '../utils/scaleUtils.js'
import { HeartIcon, PlayIcon, ExternalLinkIcon } from '../components/icons.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js'
import styles from './ScaleDetailPage.module.css'

const VIEWS = ['Piano', 'Fretboard', 'Interval', 'Staff']

export default function ScaleDetailPage({ scales }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const scale = scales.find(s => s.id === id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addViewed } = useRecentlyViewed()
  const [activeView, setActiveView] = useState('Piano')

  useEffect(() => {
    if (scale) addViewed(scale.id)
  }, [scale?.id])

  if (!scale) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p>Scale not found.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>← Back to Atlas</Link>
      </div>
    )
  }

  const related = getRelatedScales(scale, scales)
  const semitones = intervalsToSemitones(scale.intervalFormula)
  const fav = isFavorite(scale.id)

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Svara</Link>
          <span>›</span>
          <span>{scale.region}</span>
          <span>›</span>
          <span>{scale.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.left}>
            <div className={styles.titleRow}>
              <div>
                <h1 className={styles.name}>{scale.name}</h1>
                {scale.aliases?.length > 0 && (
                  <p className={styles.aliases}>{scale.aliases.join(' · ')}</p>
                )}
              </div>
              <button
                className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
                onClick={() => toggleFavorite(scale.id)}
              >
                <HeartIcon size={13} filled={fav} /> {fav ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className={styles.metaRow}>
              <span className="tag tag-accent">{scale.culture}</span>
              <span className="tag">{scale.region}</span>
              {scale.tradition && <span className="tag">{scale.tradition}</span>}
              <span className="tag">{scale.toneCount} tones</span>
            </div>

            <div className={styles.moodRow}>
              {scale.characteristics.mood.map(m => (
                <span key={m} className={`tag tag-${m}`}>{m}</span>
              ))}
            </div>

            {/* Audio player */}
            <AudioPlayer scale={scale} />

            {/* Visualizations */}
            <div className={styles.vizSection}>
              <div className={styles.vizTabs}>
                {VIEWS.map(v => (
                  <button
                    key={v}
                    className={`${styles.vizTab} ${activeView === v ? styles.vizTabActive : ''}`}
                    onClick={() => setActiveView(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className={styles.vizPanel}>
                {activeView === 'Piano' && <PianoKeyboard scale={scale} />}
                {activeView === 'Fretboard' && <GuitarFretboard scale={scale} />}
                {activeView === 'Interval' && <IntervalDiagram scale={scale} />}
                {activeView === 'Staff' && <StaffNotation scale={scale} />}
              </div>
            </div>

            {/* Theory */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Theory</h2>
              <div className={styles.theoryGrid}>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Interval Formula</span>
                  <span className={styles.theoryValue}>{scale.intervalFormula.join(' – ')}</span>
                </div>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Scale Degrees</span>
                  <span className={styles.theoryValue}>{scale.degrees.join(' · ')}</span>
                </div>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Tone Count</span>
                  <span className={styles.theoryValue}>{scale.toneCount}</span>
                </div>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Contains Tritone</span>
                  <span className={styles.theoryValue}>{scale.characteristics.hasTritone ? 'Yes' : 'No'}</span>
                </div>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Anhemitonic</span>
                  <span className={styles.theoryValue}>{scale.characteristics.isAnhemitonic ? 'Yes (no half-steps)' : 'No'}</span>
                </div>
                <div className={styles.theoryItem}>
                  <span className={styles.theoryLabel}>Symmetric</span>
                  <span className={styles.theoryValue}>{scale.characteristics.isSymmetric ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className={styles.intervalTable}>
                <h3 className={styles.subTitle}>Intervals from Root</h3>
                <div className={styles.intervalList}>
                  {semitones.map((s, i) => (
                    <div key={i} className={styles.intervalRow}>
                      <span className={styles.degree}>{scale.degrees[i]}</span>
                      <span className={styles.semiNum}>{s} st</span>
                      <span className={styles.intervalName}>{getIntervalName(s)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <aside className={styles.right}>
            {/* Cultural context */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cultural Context</h2>
              {scale.description.split('\n\n').map((para, i) => (
                <p key={i} className={styles.para}>{para}</p>
              ))}
            </section>

            {scale.usage && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Usage</h2>
                <p className={styles.para}>{scale.usage}</p>
              </section>
            )}

            {scale.characteristicPatterns && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Characteristic Patterns</h2>
                <p className={styles.para}>{scale.characteristicPatterns}</p>
              </section>
            )}

            {scale.songExamples?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Listen</h2>
                <div className={styles.listenList}>
                  {scale.songExamples.map((ex, i) => (
                    <a key={i} href={ex.url} target="_blank" rel="noopener noreferrer" className={styles.listenItem}>
                      <span className={styles.listenIcon}><PlayIcon size={12} /></span>
                      <span className={styles.listenInfo}>
                        <span className={styles.listenTitle}>{ex.title}</span>
                        <span className={styles.listenArtist}>{ex.artist}</span>
                      </span>
                      <span className={styles.listenExternal}><ExternalLinkIcon size={11} /></span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Related Scales</h2>
                <div className={styles.relatedList}>
                  {related.map(r => (
                    <Link key={r.id} to={`/scale/${r.id}`} className={styles.relatedCard}>
                      <span className={styles.relatedName}>{r.name}</span>
                      <span className={styles.relatedRegion}>{r.region}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <div className={styles.compareLink}>
              <Link to={`/compare?a=${scale.id}`} className="btn btn-ghost">
                Compare with another scale →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
