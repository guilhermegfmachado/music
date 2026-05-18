import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TUNINGS, barreChordMap, diatonicRole } from '../data/tunings.js'
import styles from './TuningsPage.module.css'

const CHROMA = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

function StringDisplay({ strings, midi }) {
  const noteNames = strings.map(s => s.replace(/\d/g, ''))
  return (
    <div className={styles.stringDisplay}>
      {[...strings].reverse().map((s, i) => {
        const idx = strings.length - 1 - i
        const thickness = (strings.length - 1 - idx) * 0.4 + 0.8
        return (
          <div key={i} className={styles.stringItem}>
            <div className={styles.strLine} style={{ height: `${thickness}px` }} />
            <span className={styles.strNote}>{s}</span>
          </div>
        )
      })}
    </div>
  )
}

function BarreMap({ barreRoot }) {
  if (!barreRoot) return null
  const map = barreChordMap(barreRoot)
  const key = barreRoot
  return (
    <div>
      <h3 className={styles.subLabel}>Barre chord map — strum all strings at each fret</h3>
      <div className={styles.barreGrid}>
        {map.map(({ fret, chord }) => {
          const role = diatonicRole(key, chord)
          const isKeyChord = [0,5,7].includes(fret) // I, IV, V
          return (
            <div
              key={fret}
              className={`${styles.barreCell} ${isKeyChord ? styles.barreCellKey : ''} ${!role.isDiatonic ? styles.barreCellChromatic : ''}`}
            >
              <span className={styles.barreFret}>{fret === 0 ? 'open' : `fr.${fret}`}</span>
              <span className={styles.barreChord}>{chord}</span>
              {role.roman && <span className={styles.barreRoman}>{role.roman}</span>}
            </div>
          )
        })}
      </div>
      <p className={styles.hint}>Highlighted = I, IV, V in key of {key}. Grey = chromatic (outside key).</p>
    </div>
  )
}

function RelatedScales({ scaleIds, scales }) {
  if (!scaleIds?.length || !scales?.length) return null
  const related = scaleIds.map(id => scales.find(s => s.id === id)).filter(Boolean)
  if (!related.length) return null
  return (
    <div>
      <h3 className={styles.subLabel}>Works well with these scales</h3>
      <div className={styles.relatedGrid}>
        {related.map(s => (
          <Link key={s.id} to={`/scale/${s.id}`} className={styles.relatedChip}>
            <span className={styles.relatedName}>{s.name}</span>
            <span className={styles.relatedRegion}>{s.region}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function TuningsPage({ scales }) {
  const [selected, setSelected] = useState(TUNINGS[0].id)
  const tuning = TUNINGS.find(t => t.id === selected)

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Guitar Open Tunings</h1>
          <p className={styles.subtitle}>Reference guide for alternate and open tunings — which chords fall where, and which scales to explore.</p>
        </div>

        <div className={styles.layout}>
          {/* Sidebar tuning selector */}
          <aside className={styles.sidebar}>
            {TUNINGS.map(t => (
              <button
                key={t.id}
                className={`${styles.tuningBtn} ${selected === t.id ? styles.tuningBtnActive : ''}`}
                onClick={() => setSelected(t.id)}
              >
                <span className={styles.tuningName}>{t.name}</span>
                <span className={styles.tuningOpen}>{t.openChord || 'non-open'}</span>
              </button>
            ))}
          </aside>

          {/* Main content */}
          <div className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{tuning.name}</h2>
                <span className={styles.cardTag}>{tuning.famousFor}</span>
              </div>

              <p className={styles.description}>{tuning.description}</p>

              {/* String visualization */}
              <div className={styles.section}>
                <h3 className={styles.subLabel}>String tuning — high to low</h3>
                <StringDisplay strings={tuning.strings} midi={tuning.midi} />
                {tuning.openChord && (
                  <p className={styles.openChordLabel}>Open chord: <strong>{tuning.openChord}</strong></p>
                )}
              </div>

              {/* Barre chord map */}
              {tuning.barreRoot && (
                <div className={styles.section}>
                  <BarreMap barreRoot={tuning.barreRoot} />
                </div>
              )}

              {/* Special notes for non-open tunings */}
              {tuning.barreNote && (
                <div className={styles.section}>
                  <h3 className={styles.subLabel}>Chord positions</h3>
                  <p className={styles.noteText}>{tuning.barreNote}</p>
                </div>
              )}

              {/* Tips */}
              {tuning.tips && (
                <div className={styles.section}>
                  <h3 className={styles.subLabel}>Tips</h3>
                  <p className={styles.noteText}>{tuning.tips}</p>
                </div>
              )}

              {/* Famous players */}
              <div className={styles.section}>
                <h3 className={styles.subLabel}>Known for</h3>
                <div className={styles.playerList}>
                  {tuning.players.map(p => (
                    <span key={p} className={styles.playerChip}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Related scales */}
              <div className={styles.section}>
                <RelatedScales scaleIds={tuning.relatedScaleIds} scales={scales} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
