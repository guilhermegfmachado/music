import { intervalsToSemitones } from '../../utils/scaleUtils.js'
import styles from './StaffNotation.module.css'

// Treble clef staff note positions for C major scale starting at C4 (MIDI 60)
// y position on staff: C4=0, D4=1, E4=2, F4=3, G4=4, A4=5, B4=6, C5=7
const SEMITONE_TO_LINE = {
  0: 0,  // C
  1: 0,  // C#
  2: 1,  // D
  3: 1,  // D#
  4: 2,  // E
  5: 3,  // F
  6: 3,  // F#
  7: 4,  // G
  8: 4,  // G#
  9: 5,  // A
  10: 5, // A#
  11: 6, // B
}

const NOTE_NAMES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']

export default function StaffNotation({ scale }) {
  const semitones = intervalsToSemitones(scale.intervalFormula)
  const allSemitones = [...semitones, 12] // include octave

  const staffTop = 20
  const lineSpacing = 10
  const noteR = 5
  const startX = 60
  const noteSpacing = 30
  const svgWidth = startX + noteSpacing * allSemitones.length + 20
  const svgHeight = 90

  function noteY(semitone) {
    const line = SEMITONE_TO_LINE[semitone % 12]
    const octaveOffset = semitone >= 12 ? -7 : 0
    return staffTop + (6 - (line + octaveOffset)) * (lineSpacing / 2)
  }

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.svg} style={{ width: '100%', maxWidth: svgWidth }}>
        {/* Staff lines (5 lines) */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1="10"
            y1={staffTop + i * lineSpacing}
            x2={svgWidth - 10}
            y2={staffTop + i * lineSpacing}
            stroke="var(--text)"
            strokeWidth="0.8"
            opacity="0.6"
          />
        ))}

        {/* Treble clef symbol */}
        <text x="14" y={staffTop + 32} fontSize="44" fill="var(--text)" opacity="0.7" fontFamily="serif">𝄞</text>

        {/* Notes */}
        {allSemitones.map((semitone, i) => {
          const x = startX + i * noteSpacing
          const y = noteY(semitone)
          const isRoot = i === 0 || i === allSemitones.length - 1
          const hasAccidental = [1, 3, 6, 8, 10].includes(semitone % 12)
          const noteName = scale.degrees[i] || NOTE_NAMES_SHARP[semitone % 12]

          // Ledger lines
          const needsLedgerBelow = y > staffTop + 4 * lineSpacing + lineSpacing / 2
          const needsLedgerAbove = y < staffTop - lineSpacing / 2

          return (
            <g key={i}>
              {needsLedgerBelow && (
                <line x1={x - 8} y1={staffTop + 5 * lineSpacing} x2={x + 8} y2={staffTop + 5 * lineSpacing}
                  stroke="var(--text)" strokeWidth="0.8" opacity="0.6" />
              )}
              {needsLedgerAbove && (
                <line x1={x - 8} y1={staffTop - lineSpacing} x2={x + 8} y2={staffTop - lineSpacing}
                  stroke="var(--text)" strokeWidth="0.8" opacity="0.6" />
              )}
              {hasAccidental && (
                <text x={x - noteR - 6} y={y + 4} fontSize="9" fill="var(--text)" opacity="0.8">♯</text>
              )}
              <ellipse
                cx={x}
                cy={y}
                rx={noteR}
                ry={noteR * 0.75}
                fill={isRoot ? 'var(--accent)' : 'var(--text)'}
                opacity={isRoot ? 1 : 0.75}
                transform={`rotate(-15, ${x}, ${y})`}
              />
              <line x1={x + noteR} y1={y} x2={x + noteR} y2={y - lineSpacing * 3}
                stroke={isRoot ? 'var(--accent)' : 'var(--text)'}
                strokeWidth="1"
                opacity="0.7"
              />
              <text x={x} y={svgHeight - 4} textAnchor="middle" fontSize="8" fill="var(--text-muted)">
                {noteName}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
