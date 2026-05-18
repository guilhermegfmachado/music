import { intervalsToSemitones } from '../../utils/scaleUtils.js'
import styles from './PianoKeyboard.module.css'

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11] // C D E F G A B
const BLACK_KEYS = [1, 3, 6, 8, 10]        // C# D# F# G# A#
const NOTE_LABELS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default function PianoKeyboard({ scale, rootNote = 'C' }) {
  const rootIdx = NOTE_LABELS.indexOf(rootNote)
  const semitones = new Set(intervalsToSemitones(scale.intervalFormula))

  const isInScale = (note) => semitones.has((note - rootIdx + 120) % 12)
  const isRoot = (note) => (note % 12) === rootIdx % 12

  return (
    <div className={styles.wrapper}>
      <div className={styles.keyboard}>
        {[0, 1].map(octave =>
          WHITE_KEYS.map(note => {
            const abs = octave * 12 + note
            const inScale = isInScale(abs)
            const root = isRoot(abs) && octave === 0
            return (
              <div
                key={abs}
                className={`${styles.white} ${inScale ? styles.whiteActive : ''} ${root ? styles.root : ''}`}
                title={NOTE_LABELS[note]}
              >
                {root && <span className={styles.label}>{rootNote}</span>}
                {inScale && !root && <span className={styles.dot} />}
              </div>
            )
          })
        )}
        {[0, 1].map(octave =>
          BLACK_KEYS.map(note => {
            const abs = octave * 12 + note
            const inScale = isInScale(abs)
            const idx = WHITE_KEYS.filter(w => w < note).length
            const leftPct = ((octave * 7 + idx) / 14) * 100 + (100 / 14 / 1.65)
            return (
              <div
                key={abs}
                className={`${styles.black} ${inScale ? styles.blackActive : ''}`}
                style={{ left: `${leftPct}%` }}
                title={NOTE_LABELS[note]}
              >
                {inScale && <span className={styles.dotBlack} />}
              </div>
            )
          })
        )}
      </div>
      <p className={styles.note}>Root = {rootNote} · 12-TET approximation</p>
    </div>
  )
}
