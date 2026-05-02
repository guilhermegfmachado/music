import { intervalsToSemitones } from '../../utils/scaleUtils.js'
import styles from './GuitarFretboard.module.css'

// Standard guitar tuning: E2 A2 D3 G3 B3 E4 (MIDI: 40 45 50 55 59 64)
const OPEN_NOTES = [64, 59, 55, 50, 45, 40] // high to low
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E']
const FRET_COUNT = 13

export default function GuitarFretboard({ scale }) {
  const semitones = new Set(intervalsToSemitones(scale.intervalFormula))

  function isInScale(midi) {
    return semitones.has(midi % 12)
  }

  function isRoot(midi) {
    return (midi % 12) === 0 // C is root
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.fretboard}>
        <div className={styles.stringLabels}>
          {STRING_LABELS.map(l => (
            <div key={l} className={styles.stringLabel}>{l}</div>
          ))}
        </div>

        <div className={styles.frets}>
          {OPEN_NOTES.map((open, stringIdx) => (
            <div key={stringIdx} className={styles.string}>
              <div className={styles.stringLine} />
              {Array.from({ length: FRET_COUNT }, (_, fret) => {
                const midi = open + fret
                const inScale = isInScale(midi)
                const root = isRoot(midi)
                return (
                  <div key={fret} className={styles.fretCell}>
                    {inScale && (
                      <div className={`${styles.dot} ${root ? styles.rootDot : ''}`} />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className={styles.fretNumbers}>
          <div className={styles.fretNumCell}>0</div>
          {Array.from({ length: FRET_COUNT - 1 }, (_, i) => (
            <div key={i + 1} className={styles.fretNumCell}>{i + 1}</div>
          ))}
        </div>
      </div>
      <p className={styles.note}>Root = C. Highlighted dots = scale tones. Filled = root.</p>
    </div>
  )
}
