import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import * as Tone from 'tone'
import { ensureAudio } from '../utils/audioUtils.js'
import styles from './RhythmsPage.module.css'

// Time signature → beat groupings (array of accent weights: 2=strong, 1=weak, 0=off)
const TS_PATTERNS = {
  '4/4':   [2, 0, 1, 0, 1, 0, 1, 0],   // 4 quarter beats, 8th-note grid
  '3/4':   [2, 0, 1, 0, 1, 0],
  '2/4':   [2, 0, 1, 0],
  '6/8':   [2, 1, 1, 1, 1, 1],           // 6 eighth beats (2 dotted-quarter groups)
  '12/8':  [2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  '7/8':   [2, 1, 0, 1, 0, 1, 1],        // 2+2+3
  '9/8':   [2, 1, 1, 1, 1, 1, 1, 1, 1], // 3+3+3
  '10/8':  [2, 1, 1, 0, 1, 1, 0, 1, 1, 1], // 3+2+2+3
  '5/4':   [2, 0, 1, 0, 1, 0, 1, 1, 0, 1], // 2+3 in 5 beats
  '10/16': [2, 1, 1, 0, 1, 1, 1, 0, 1, 1], // 2+3+2+3 (Jhaptaal-like)
  '16/16': [2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // 4+4+4+4 (Teentaal)
  'free':  [],
}

function parseTS(ts) {
  if (ts === 'free') return { beats: 0, denom: 4 }
  const [n, d] = ts.split('/').map(Number)
  return { beats: n, denom: d }
}

function getStepDuration(ts) {
  if (ts === '4/4' || ts === '3/4' || ts === '2/4' || ts === '5/4') return '8n'
  if (ts === '10/16' || ts === '16/16') return '16n'
  return '8n'
}

// Collect all rhythm patterns from scales data
function collectRhythms(scales) {
  const seen = new Set()
  const rhythms = []
  for (const scale of scales) {
    for (const rp of scale.rhythmPatterns || []) {
      const key = `${rp.name}-${rp.timeSignature}`
      if (!seen.has(key)) {
        seen.add(key)
        rhythms.push({ ...rp, scaleId: scale.id, scaleName: scale.name, scaleRegion: scale.region })
      }
    }
  }
  return rhythms
}

const TS_GROUPS = [
  { label: 'Simple', filter: ts => ['4/4', '3/4', '2/4'].includes(ts) },
  { label: 'Compound', filter: ts => ['6/8', '12/8'].includes(ts) },
  { label: 'Asymmetric', filter: ts => ['5/4', '7/8', '9/8', '10/8', '10/16', '16/16'].includes(ts) },
  { label: 'Free / Other', filter: ts => ts === 'free' || !['4/4','3/4','2/4','6/8','12/8','5/4','7/8','9/8','10/8','10/16','16/16'].includes(ts) },
]

let accentSynth = null
let clickSynth = null
let metroPart = null

function getOrCreateSynths() {
  if (!accentSynth) {
    accentSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05, octaves: 5,
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 },
    }).toDestination()
    accentSynth.volume.value = -2
  }
  if (!clickSynth) {
    clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.02, octaves: 2,
      envelope: { attack: 0.001, decay: 0.07, sustain: 0, release: 0.01 },
    }).toDestination()
    clickSynth.volume.value = -8
  }
  return { accentSynth, clickSynth }
}

function Metronome({ pattern }) {
  const [bpm, setBpm] = useState(() => {
    if (!pattern) return 80
    const beatStr = pattern.beat || ''
    const match = beatStr.match(/=\s*(\d+)/)
    return match ? parseInt(match[1]) : 80
  })
  const [playing, setPlaying] = useState(false)
  const [curStep, setCurStep] = useState(-1)
  const playingRef = useRef(false)
  const seqRef = useRef(null)

  const ts = pattern?.timeSignature || '4/4'
  const steps = TS_PATTERNS[ts] || TS_PATTERNS['4/4']
  const stepDur = getStepDuration(ts)

  const stopMetronome = useCallback(() => {
    // Dispose only this sequence. Stopping/cancelling the shared Transport
    // would also kill scale playback scheduled by audioUtils.
    if (seqRef.current) { seqRef.current.dispose(); seqRef.current = null }
    playingRef.current = false
    setPlaying(false)
    setCurStep(-1)
  }, [])

  const startMetronome = useCallback(async () => {
    await ensureAudio()
    stopMetronome()
    const { accentSynth, clickSynth } = getOrCreateSynths()
    Tone.getTransport().bpm.value = bpm

    seqRef.current = new Tone.Sequence((time, val) => {
      const w = steps[val]
      if (w === 2) accentSynth.triggerAttackRelease('C1', '16n', time)
      else if (w === 1) clickSynth.triggerAttackRelease('C2', '16n', time)
      Tone.getDraw().schedule(() => {
        setCurStep(val)
      }, time)
    }, Array.from({ length: steps.length }, (_, idx) => idx), stepDur)

    seqRef.current.start(Tone.getTransport().seconds)
    if (Tone.getTransport().state !== 'started') Tone.getTransport().start()
    playingRef.current = true
    setPlaying(true)
  }, [bpm, steps, stepDur, stopMetronome])

  useEffect(() => {
    if (playing) {
      startMetronome()
    }
  }, [bpm])

  useEffect(() => {
    return () => { stopMetronome() }
  }, [pattern])

  function handleToggle() {
    if (playingRef.current) stopMetronome()
    else startMetronome()
  }

  function changeBpm(delta) {
    setBpm(b => Math.max(20, Math.min(300, b + delta)))
  }

  if (ts === 'free') {
    return <p className={styles.freeNote}>This pattern uses free meter — no click track available.</p>
  }

  return (
    <div className={styles.metro}>
      <div className={styles.metroControls}>
        <button className={styles.bpmBtn} onClick={() => changeBpm(-5)}>−5</button>
        <button className={styles.bpmBtn} onClick={() => changeBpm(-1)}>−1</button>
        <div className={styles.bpmDisplay}>
          <span className={styles.bpmNum}>{bpm}</span>
          <span className={styles.bpmLabel}>BPM</span>
        </div>
        <button className={styles.bpmBtn} onClick={() => changeBpm(1)}>+1</button>
        <button className={styles.bpmBtn} onClick={() => changeBpm(5)}>+5</button>
        <button
          className={`${styles.playBtn} ${playing ? styles.playBtnActive : ''}`}
          onClick={handleToggle}
        >
          {playing ? '■ Stop' : '▶ Play'}
        </button>
      </div>

      <div className={styles.beatGrid}>
        {steps.map((w, idx) => (
          <div
            key={idx}
            className={`${styles.beat}
              ${w === 2 ? styles.beatAccent : w === 1 ? styles.beatNormal : styles.beatOff}
              ${curStep === idx && playing ? styles.beatActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function RhythmsPage({ scales }) {
  const [active, setActive] = useState(null)

  // stable across renders — new objects only when scales prop changes
  const rhythms = useMemo(() => collectRhythms(scales), [scales])

  // each item carries its index in rhythms so no indexOf needed
  const grouped = useMemo(() =>
    TS_GROUPS.map(g => ({
      label: g.label,
      items: rhythms.reduce((acc, r, i) => {
        if (g.filter(r.timeSignature)) acc.push({ r, i })
        return acc
      }, []),
    })).filter(g => g.items.length > 0),
  [rhythms])

  const activeRhythm = active !== null ? rhythms[active] : null

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Rhythm Patterns</h1>
        <p className={styles.subtitle}>Explore rhythms from around the world. Select one to practice with a click track.</p>

        <div className={styles.layout}>
          {/* List */}
          <div className={styles.list}>
            {grouped.map(group => (
              <div key={group.label} className={styles.group}>
                <div className={styles.groupLabel}>{group.label}</div>
                {group.items.map(({ r, i }) => (
                  <button
                    key={i}
                    className={`${styles.rhythmBtn} ${active === i ? styles.rhythmBtnActive : ''}`}
                    onClick={() => setActive(prev => prev === i ? null : i)}
                  >
                    <div className={styles.rName}>{r.name}</div>
                    <div className={styles.rMeta}>
                      <span className={styles.rTs}>{r.timeSignature}</span>
                      <span className={styles.rRegion}>{r.scaleRegion}</span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className={styles.detail}>
            {!activeRhythm ? (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>♩</div>
                <p>Select a rhythm pattern to practice</p>
              </div>
            ) : (
              <div className={styles.detailInner}>
                <div className={styles.detailHeader}>
                  <h2 className={styles.detailName}>{activeRhythm.name}</h2>
                  <div className={styles.detailMeta}>
                    <span className={styles.detailTs}>{activeRhythm.timeSignature}</span>
                    {activeRhythm.beat && <span className={styles.detailBeat}>{activeRhythm.beat}</span>}
                  </div>
                </div>

                <p className={styles.detailDesc}>{activeRhythm.description}</p>

                <div className={styles.detailFrom}>
                  <span className={styles.detailFromLabel}>Associated scale:</span>
                  <Link to={`/scale/${activeRhythm.scaleId}`} className={styles.detailFromLink}>
                    {activeRhythm.scaleName} →
                  </Link>
                </div>

                <div className={styles.metroSection}>
                  <div className={styles.metroTitle}>Click Track</div>
                  <Metronome pattern={activeRhythm} />
                </div>

                <div className={styles.beatKey}>
                  <div className={styles.beatKeyItem}><span className={`${styles.beat} ${styles.beatAccent}`} /> Strong beat</div>
                  <div className={styles.beatKeyItem}><span className={`${styles.beat} ${styles.beatNormal}`} /> Weak beat</div>
                  <div className={styles.beatKeyItem}><span className={`${styles.beat} ${styles.beatOff}`} /> Rest</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
