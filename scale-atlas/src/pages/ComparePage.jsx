import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { intervalsToSemitones, getIntervalName } from '../utils/scaleUtils.js'
import AudioPlayer from '../components/AudioPlayer.jsx'
import IntervalDiagram from '../components/visualizations/IntervalDiagram.jsx'
import styles from './ComparePage.module.css'

function ScaleSelector({ scales, value, onChange, label }) {
  return (
    <div className={styles.selector}>
      <label className={styles.selectorLabel}>{label}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={styles.selectorInput}
      >
        <option value="">Choose a scale…</option>
        {scales.map(s => (
          <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
        ))}
      </select>
    </div>
  )
}

export default function ComparePage({ scales }) {
  const [searchParams] = useSearchParams()
  const [idA, setIdA] = useState(searchParams.get('a') || '')
  const [idB, setIdB] = useState(searchParams.get('b') || '')

  const scaleA = scales.find(s => s.id === idA)
  const scaleB = scales.find(s => s.id === idB)

  const semisA = scaleA ? new Set(intervalsToSemitones(scaleA.intervalFormula)) : null
  const semisB = scaleB ? new Set(intervalsToSemitones(scaleB.intervalFormula)) : null

  const shared = semisA && semisB
    ? [...semisA].filter(s => semisB.has(s))
    : []

  const onlyA = semisA && semisB
    ? [...semisA].filter(s => !semisB.has(s))
    : []

  const onlyB = semisA && semisB
    ? [...semisB].filter(s => !semisA.has(s))
    : []

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Compare Scales</h1>
        <p className={styles.subtitle}>Select two scales to compare their interval structures, characteristics, and shared tones.</p>

        <div className={styles.selectors}>
          <ScaleSelector scales={scales} value={idA} onChange={setIdA} label="Scale A" />
          <div className={styles.vs}>vs</div>
          <ScaleSelector scales={scales} value={idB} onChange={setIdB} label="Scale B" />
        </div>

        {scaleA && scaleB && (
          <div className={styles.comparison}>
            {/* Side by side info */}
            <div className={styles.sideGrid}>
              {[scaleA, scaleB].map((scale, i) => (
                <div key={scale.id} className={styles.sideCard}>
                  <div className={styles.cardHeader}>
                    <span className={`${styles.badge} ${i === 0 ? styles.badgeA : styles.badgeB}`}>
                      {i === 0 ? 'A' : 'B'}
                    </span>
                    <h2 className={styles.scaleName}>{scale.name}</h2>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className="tag tag-accent">{scale.culture}</span>
                    <span className="tag">{scale.region}</span>
                    <span className="tag">{scale.toneCount} tones</span>
                  </div>
                  <div className={styles.formula}>
                    {scale.intervalFormula.map((n, j) => (
                      <span key={j} className={styles.interval}>{n}</span>
                    ))}
                  </div>
                  <div className={styles.moods}>
                    {scale.characteristics.mood.map(m => (
                      <span key={m} className={`tag tag-${m}`}>{m}</span>
                    ))}
                  </div>
                  <AudioPlayer scale={scale} />
                  <IntervalDiagram scale={scale} />
                </div>
              ))}
            </div>

            {/* Analysis */}
            <div className={styles.analysis}>
              <h3 className={styles.analysisTitle}>Interval Analysis</h3>
              <div className={styles.analysisGrid}>
                <div className={styles.analysisSection}>
                  <h4 className={styles.analysisSubtitle} style={{ color: '#818cf8' }}>
                    Shared tones ({shared.length})
                  </h4>
                  {shared.length === 0 ? (
                    <p className={styles.none}>No shared tones</p>
                  ) : (
                    <div className={styles.toneList}>
                      {shared.map(s => (
                        <span key={s} className={`${styles.tone} ${styles.toneShared}`}>
                          {s} st — {getIntervalName(s)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.analysisSection}>
                  <h4 className={styles.analysisSubtitle} style={{ color: '#34d399' }}>
                    Only in {scaleA.name} ({onlyA.length})
                  </h4>
                  <div className={styles.toneList}>
                    {onlyA.map(s => (
                      <span key={s} className={`${styles.tone} ${styles.toneA}`}>
                        {s} st — {getIntervalName(s)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.analysisSection}>
                  <h4 className={styles.analysisSubtitle} style={{ color: '#f472b6' }}>
                    Only in {scaleB.name} ({onlyB.length})
                  </h4>
                  <div className={styles.toneList}>
                    {onlyB.map(s => (
                      <span key={s} className={`${styles.tone} ${styles.toneB}`}>
                        {s} st — {getIntervalName(s)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.charCompare}>
                <h4 className={styles.analysisSubtitle}>Characteristics</h4>
                <div className={styles.charTableWrap}>
                <table className={styles.charTable}>
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>{scaleA.name}</th>
                      <th>{scaleB.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Tritone', 'hasTritone'],
                      ['Anhemitonic', 'isAnhemitonic'],
                      ['Symmetric', 'isSymmetric'],
                      ['Augmented interval', 'hasAugmentedInterval'],
                    ].map(([label, key]) => (
                      <tr key={key}>
                        <td>{label}</td>
                        <td>{scaleA.characteristics[key] ? '✓' : '–'}</td>
                        <td>{scaleB.characteristics[key] ? '✓' : '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {(!scaleA || !scaleB) && (
          <div className={styles.placeholder}>
            <p>Select two scales above to begin the comparison.</p>
          </div>
        )}
      </div>
    </div>
  )
}
