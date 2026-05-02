import { intervalsToSemitones } from '../../utils/scaleUtils.js'
import styles from './IntervalDiagram.module.css'

export default function IntervalDiagram({ scale }) {
  const semitones = intervalsToSemitones(scale.intervalFormula)
  const inScale = new Set(semitones)
  const cx = 120, cy = 120, r = 90, innerR = 55
  const total = 12

  function angleOf(semitone) {
    return ((semitone / total) * 2 * Math.PI) - Math.PI / 2
  }

  function point(angle, radius) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const polygonPoints = semitones.map(s => {
    const a = angleOf(s)
    const p = point(a, r * 0.72)
    return `${p.x},${p.y}`
  }).join(' ')

  return (
    <div className={styles.wrapper}>
      <svg viewBox="0 0 240 240" className={styles.svg}>
        {/* Outer circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="1" />
        {/* Inner circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />

        {/* Scale polygon */}
        <polygon points={polygonPoints} fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="1.5" />

        {/* All 12 chromatic positions */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = angleOf(i)
          const outer = point(a, r + 0)
          const label = point(a, r + 14)
          const dot = point(a, r * 0.72)
          const isIn = inScale.has(i)
          const isRoot = i === 0
          const degIdx = semitones.indexOf(i)

          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="var(--border)" strokeWidth="0.5" />
              {isIn && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={isRoot ? 8 : 6}
                  fill={isRoot ? 'var(--accent)' : 'var(--accent)'}
                  fillOpacity={isRoot ? 1 : 0.7}
                />
              )}
              {isIn && (
                <text
                  x={dot.x}
                  y={dot.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="6"
                  fill="white"
                  fontWeight="bold"
                >
                  {scale.degrees[degIdx] || i}
                </text>
              )}
              {!isIn && (
                <circle cx={dot.x} cy={dot.y} r={2} fill="var(--border)" />
              )}
            </g>
          )
        })}
      </svg>
      <p className={styles.label}>{scale.toneCount}-tone — {scale.intervalFormula.join('–')} semitones</p>
    </div>
  )
}
