import { intervalsToSemitones } from '../../utils/scaleUtils.js'
import styles from './ViolinFingerboard.module.css'

// Standard violin tuning: G3 D4 A4 E5 (shown high to low, E at top)
const OPEN_NOTES = [76, 69, 62, 55]
const STRING_LABELS = ['E', 'A', 'D', 'G']
const STRING_THICKNESS = [1, 1.5, 2, 2.8]
const SEMITONE_COUNT = 13
// Common reference positions (like fret dots) — semitones 3, 5, 7, 12
const GUIDE_POSITIONS = new Set([3, 5, 7, 12])
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export default function ViolinFingerboard({ scale, rootNote = 'C' }) {
  const rootIdx = NOTE_NAMES.indexOf(rootNote)
  const semitones = new Set(intervalsToSemitones(scale.intervalFormula))

  function isInScale(midi) {
    return semitones.has((midi - rootIdx + 120) % 12)
  }

  function isRoot(midi) {
    return (midi % 12) === rootIdx % 12
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.fingerboard}>
        <div className={styles.nut} />

        <div className={styles.body}>
          {OPEN_NOTES.map((open, strIdx) => (
            <div key={strIdx} className={styles.stringRow}>
              <div className={styles.stringLabel}>{STRING_LABELS[strIdx]}</div>
              <div className={styles.positions}>
                <div
                  className={styles.stringLine}
                  style={{ height: `${STRING_THICKNESS[strIdx]}px` }}
                />
                {Array.from({ length: SEMITONE_COUNT }, (_, pos) => {
                  const midi = open + pos
                  const inScale = isInScale(midi)
                  const root = isRoot(midi)
                  return (
                    <div
                      key={pos}
                      className={`${styles.cell} ${GUIDE_POSITIONS.has(pos) ? styles.guideCell : ''}`}
                    >
                      {inScale && (
                        <div className={`${styles.dot} ${root ? styles.rootDot : ''}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className={styles.posNumbers}>
            {Array.from({ length: SEMITONE_COUNT }, (_, i) => (
              <div key={i} className={`${styles.posNum} ${GUIDE_POSITIONS.has(i) ? styles.guidePosNum : ''}`}>
                {i === 0 ? 'O' : i}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.note}>Root = {rootNote} · Fretless · Amber = root</p>
    </div>
  )
}
