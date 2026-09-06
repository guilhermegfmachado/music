import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TUNINGS, barreChordMap, diatonicRole } from '../data/tunings.js'
import styles from './TuningsPage.module.css'

const CATEGORIES = ['Standard', 'Modified Standard', 'Open Major', 'Open Minor', 'Modal', 'International', 'Alternative']

function StringDisplay({ strings }) {
  return (
    <div className={styles.stringDisplay}>
      {[...strings].reverse().map((s, i) => {
        const idx = strings.length - 1 - i
        const thickness = (strings.length - 1 - idx) * 0.35 + 0.7
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
      <h3 className={styles.subLabel}>Full-barre chord map — strum all strings at each fret</h3>
      <div className={styles.barreGrid}>
        {map.map(({ fret, chord }) => {
          const role = diatonicRole(key, chord)
          const isKeyChord = [0, 5, 7].includes(fret)
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
      <p className={styles.hint}>Highlighted = I, IV, V in key of {key}. Grey = chromatic.</p>
    </div>
  )
}

const CHORD_COLORS = {
  maj:  { bg: '#d1fae5', border: '#6ee7b7', darkBg: '#042e1a', darkBorder: '#065f46' },
  min:  { bg: '#dbeafe', border: '#93c5fd', darkBg: '#1e2e6a', darkBorder: '#3b4ea0' },
  dom7: { bg: '#fef9c3', border: '#fcd34d', darkBg: '#3a2800', darkBorder: '#92400e' },
  sus2: { bg: '#f3e8ff', border: '#d8b4fe', darkBg: '#2e1065', darkBorder: '#6d28d9' },
  sus4: { bg: '#f3e8ff', border: '#d8b4fe', darkBg: '#2e1065', darkBorder: '#6d28d9' },
  add9: { bg: '#e0f2fe', border: '#7dd3fc', darkBg: '#0c3050', darkBorder: '#0ea5e9' },
  dim:  { bg: '#fce7f3', border: '#f9a8d4', darkBg: '#4a0a3a', darkBorder: '#831843' },
}

function ChordShapes({ shapes }) {
  const [hovered, setHovered] = useState(null)
  if (!shapes?.length) return null

  return (
    <div>
      <h3 className={styles.subLabel}>Common chord shapes</h3>
      <div className={styles.chordGrid}>
        {shapes.map((s, i) => {
          const colors = CHORD_COLORS[s.quality] || CHORD_COLORS.maj
          return (
            <div
              key={i}
              className={styles.chordChip}
              style={{ '--cbg': colors.bg, '--cborder': colors.border }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className={styles.chordChipLabel}>{s.label}</span>
              <span className={styles.chordChipQuality}>{s.quality}</span>
              <span className={styles.chordChipFret}>{s.fret === 0 ? 'open' : `fr.${s.fret}`}</span>
              {hovered === i && (
                <div className={styles.chordTooltip}>{s.how}</div>
              )}
            </div>
          )
        })}
      </div>
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

export default function TuningsPage({ scales, embedded = false }) {
  const [selected, setSelected] = useState(TUNINGS[0].id)
  const tuning = TUNINGS.find(t => t.id === selected)

  const grouped = CATEGORIES.map(cat => ({
    label: cat,
    tunings: TUNINGS.filter(t => t.category === cat),
  })).filter(g => g.tunings.length > 0)

  return (
    <div className={embedded ? '' : styles.page}>
      <div className={embedded ? '' : 'container'}>
        {!embedded && (
          <div className={styles.header}>
            <h1 className={styles.title}>Guitar Tunings Guide</h1>
            <p className={styles.subtitle}>Open, modal, international, and alternative tunings — chord positions, shapes, and scales to explore in each one.</p>
          </div>
        )}

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {grouped.map(group => (
              <div key={group.label} className={styles.sidebarGroup}>
                <div className={styles.sidebarGroupLabel}>{group.label}</div>
                {group.tunings.map(t => (
                  <button
                    key={t.id}
                    className={`${styles.tuningBtn} ${selected === t.id ? styles.tuningBtnActive : ''}`}
                    onClick={() => setSelected(t.id)}
                  >
                    <span className={styles.tuningName}>{t.name}</span>
                    <span className={styles.tuningOpen}>{t.openChord || '—'}</span>
                  </button>
                ))}
              </div>
            ))}
          </aside>

          {/* Main content */}
          <div className={styles.main}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>{tuning.name}</h2>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTag}>{tuning.category}</span>
                    {tuning.openChord && <span className={styles.cardOpen}>Open: <strong>{tuning.openChord}</strong></span>}
                  </div>
                </div>
                <span className={styles.cardFamousFor}>{tuning.famousFor}</span>
              </div>

              <p className={styles.description}>{tuning.description}</p>

              {/* String visualization */}
              <div className={styles.section}>
                <h3 className={styles.subLabel}>String tuning — high to low</h3>
                <StringDisplay strings={tuning.strings} />
                <div className={styles.stringInline}>
                  {tuning.strings.join(' – ')}
                </div>
              </div>

              {/* Barre chord map */}
              {tuning.barreRoot && (
                <div className={styles.section}>
                  <BarreMap barreRoot={tuning.barreRoot} />
                </div>
              )}

              {/* Non-barre chord note */}
              {tuning.barreNote && (
                <div className={styles.section}>
                  <h3 className={styles.subLabel}>Chord positions</h3>
                  <p className={styles.noteText}>{tuning.barreNote}</p>
                </div>
              )}

              {/* Chord shapes */}
              {tuning.chordShapes?.length > 0 && (
                <div className={styles.section}>
                  <ChordShapes shapes={tuning.chordShapes} />
                  <p className={styles.hint}>Hover a chord for fingering hint. Colours: green=major, blue=minor, yellow=dom7, purple=sus/add.</p>
                </div>
              )}

              {/* Tips */}
              {tuning.tips && (
                <div className={styles.section}>
                  <h3 className={styles.subLabel}>Playing tips</h3>
                  <p className={styles.noteText}>{tuning.tips}</p>
                </div>
              )}

              {/* Famous players */}
              <div className={styles.section}>
                <h3 className={styles.subLabel}>Known for · Players</h3>
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
