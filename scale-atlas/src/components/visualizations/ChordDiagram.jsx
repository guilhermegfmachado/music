import styles from './ChordDiagram.module.css'

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const ROWS = 5
const LEFT = 22
const TOP = 24
const SG = 14   // string gap
const FG = 16   // fret gap

const fy = row => TOP + (row - 0.5) * FG   // vertical center of fret row

/**
 * Classic vertical chord diagram.
 * voicing:    [f0…f5] low E → high e; -1 = mute, 0 = open
 * tuningMidi: [midi0…midi5] low → high
 * rootSemitone: 0–11
 * label:      optional chord name shown above
 */
export default function ChordDiagram({ voicing, tuningMidi, rootSemitone, label }) {
  const STR = voicing.length
  const W = LEFT + SG * (STR - 1) + LEFT
  const H = TOP + FG * ROWS + 20
  const sx = i => LEFT + i * SG

  const frettedFrets = voicing.filter(f => f > 0)
  const minFretted = frettedFrets.length > 0 ? Math.min(...frettedFrets) : 0
  const isOpenPos = minFretted <= 1
  const startFret = isOpenPos ? 1 : minFretted

  const nc = (si, fret) => (tuningMidi[si] + fret) % 12
  const isRoot = (si, fret) => nc(si, fret) === rootSemitone % 12

  // Barre: ≥ 2 strings share the minimum fretted fret
  const barreIdxs = voicing.map((f, i) => f === minFretted && minFretted > 0 ? i : -1).filter(i => i >= 0)
  const hasBarre = barreIdxs.length >= 2

  return (
    <div className={styles.wrap}>
      {label && <div className={styles.label}>{label}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}>

        {/* String lines */}
        {Array.from({ length: STR }, (_, i) => (
          <line key={`s${i}`}
            x1={sx(i)} y1={TOP} x2={sx(i)} y2={TOP + ROWS * FG}
            stroke="var(--border)" strokeWidth={0.8}
          />
        ))}

        {/* Fret lines — nut is thick if open position */}
        {Array.from({ length: ROWS + 1 }, (_, r) => (
          <line key={`f${r}`}
            x1={LEFT} y1={TOP + r * FG} x2={sx(STR - 1)} y2={TOP + r * FG}
            stroke={r === 0 && isOpenPos ? 'var(--text)' : 'var(--border)'}
            strokeWidth={r === 0 && isOpenPos ? 3.5 : 0.8}
          />
        ))}

        {/* Fret position label (non-open) */}
        {!isOpenPos && (
          <text x={LEFT - 4} y={TOP + FG * 0.6} fontSize={7.5} textAnchor="end" fill="var(--text-muted)">
            {startFret}fr
          </text>
        )}

        {/* Mute / open string indicators */}
        {voicing.map((fret, i) => {
          const x = sx(i)
          const y = TOP - 11
          if (fret === -1)
            return <text key={`x${i}`} x={x} y={y} fontSize={11} textAnchor="middle" dominantBaseline="middle" fill="var(--text-muted)" fontWeight="500">×</text>
          if (fret === 0)
            return <circle key={`o${i}`} cx={x} cy={y} r={4} fill="none" stroke={isRoot(i, 0) ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth={1.5} />
          return null
        })}

        {/* Barre bar */}
        {hasBarre && (() => {
          const row = minFretted - startFret + 1
          if (row < 1 || row > ROWS) return null
          const y = fy(row)
          const x1 = sx(barreIdxs[0])
          const x2 = sx(barreIdxs[barreIdxs.length - 1])
          const barreRoot = barreIdxs.some(i => isRoot(i, minFretted))
          return (
            <rect key="barre"
              x={x1 - 6} y={y - 6} width={x2 - x1 + 12} height={12} rx={6}
              fill={barreRoot ? 'var(--accent)' : 'var(--text)'}
            />
          )
        })()}

        {/* Individual finger dots */}
        {voicing.map((fret, i) => {
          if (fret <= 0) return null
          const row = fret - startFret + 1
          if (row < 1 || row > ROWS) return null
          if (hasBarre && fret === minFretted && barreIdxs.includes(i)) return null
          const root = isRoot(i, fret)
          return (
            <circle key={`d${i}`}
              cx={sx(i)} cy={fy(row)} r={6}
              fill={root ? 'var(--accent)' : 'var(--text)'}
            />
          )
        })}

        {/* Note names below diagram */}
        {voicing.map((fret, i) => {
          if (fret < 0) return null
          const n = nc(i, fret)
          const root = n === rootSemitone % 12
          return (
            <text key={`n${i}`}
              x={sx(i)} y={TOP + ROWS * FG + 14}
              fontSize={7} textAnchor="middle"
              fill={root ? 'var(--accent)' : 'var(--text-muted)'}
              fontWeight={root ? '600' : '400'}
            >
              {NOTE_NAMES[n]}
            </text>
          )
        })}

      </svg>
    </div>
  )
}
