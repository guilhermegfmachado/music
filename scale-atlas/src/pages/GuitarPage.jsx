import { useSearchParams } from 'react-router-dom'
import TuningsPage from './TuningsPage.jsx'
import ChordsPage from './ChordsPage.jsx'
import styles from './GuitarPage.module.css'

const TABS = [
  { id: 'chords',  label: 'Chords',  blurb: 'Chord shapes that re-voice for any tuning' },
  { id: 'tunings', label: 'Tunings', blurb: 'Open, modal and alternative tunings in depth' },
]

export default function GuitarPage({ scales, defaultTab = 'chords' }) {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab') || defaultTab
  const tab = requested === 'tunings' ? 'tunings' : 'chords'
  const active = TABS.find(t => t.id === tab)

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>Guitar</h1>
          <p className={styles.subtitle}>{active.blurb}</p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Guitar tools">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === tab}
              className={`${styles.tab} ${t.id === tab ? styles.tabActive : ''}`}
              onClick={() => setParams(t.id === 'chords' ? {} : { tab: t.id }, { replace: true })}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          {tab === 'chords'
            ? <ChordsPage embedded />
            : <TuningsPage scales={scales} embedded />}
        </div>
      </div>
    </div>
  )
}
