import { useState, useRef, useEffect } from 'react'
import { playScale, stopAll } from '../utils/audioUtils.js'
import styles from './AudioPlayer.module.css'

const TIMBRES = [
  { id: 'piano', label: 'Piano' },
  { id: 'strings', label: 'Strings' },
  { id: 'flute', label: 'Flute' },
  { id: 'marimba', label: 'Marimba' },
  { id: 'synth_pad', label: 'Pad' },
]

const ROOTS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const ROOT_MIDI = { C:60, 'C#':61, D:62, 'D#':63, E:64, F:65, 'F#':66, G:67, 'G#':68, A:69, 'A#':70, B:71 }

export default function AudioPlayer({ scale }) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [timbre, setTimbre] = useState('piano')
  const [tempo, setTempo] = useState(80)
  const [root, setRoot] = useState('C')
  const timeoutRef = useRef(null)
  const playingRef = useRef(false)

  useEffect(() => {
    return () => {
      stopAll()
      clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handlePlay() {
    if (playingRef.current) {
      stopAll()
      clearTimeout(timeoutRef.current)
      playingRef.current = false
      setPlaying(false)
      return
    }
    setError(null)
    playingRef.current = true
    setPlaying(true)
    try {
      const duration = await playScale(scale.intervalFormula, {
        timbre,
        tempo,
        rootMidi: ROOT_MIDI[root],
      })
      timeoutRef.current = setTimeout(() => {
        playingRef.current = false
        setPlaying(false)
      }, duration + 200)
    } catch (e) {
      console.error('Audio playback failed:', e)
      playingRef.current = false
      setPlaying(false)
      setError('Audio failed — tap Play again')
    }
  }

  return (
    <div className={styles.player}>
      <div className={styles.controls}>
        <button className={`${styles.playBtn} ${playing ? styles.playing : ''}`} onClick={handlePlay}>
          {playing ? '■ Stop' : '▶ Play Scale'}
        </button>
        {error && <span className={styles.audioError}>{error}</span>}

        <div className={styles.control}>
          <label>Root</label>
          <select value={root} onChange={e => setRoot(e.target.value)}>
            {ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className={styles.control}>
          <label>Tempo</label>
          <input
            type="range"
            min="40"
            max="200"
            value={tempo}
            onChange={e => setTempo(Number(e.target.value))}
          />
          <span>{tempo} bpm</span>
        </div>
      </div>

      <div className={styles.timbres}>
        {TIMBRES.map(t => (
          <button
            key={t.id}
            className={`${styles.timbreBtn} ${timbre === t.id ? styles.timbreActive : ''}`}
            onClick={() => setTimbre(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
