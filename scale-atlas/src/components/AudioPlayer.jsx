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

export default function AudioPlayer({ scale, root: rootProp, setRoot: setRootProp }) {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [timbre, setTimbre] = useState('piano')
  const [tempo, setTempo] = useState(80)
  const [internalRoot, setInternalRoot] = useState('C')
  const [loop, setLoop] = useState(false)
  const timeoutRef = useRef(null)
  const playingRef = useRef(false)
  const loopRef = useRef(false)

  // Use external root/setRoot if provided, otherwise use internal state
  const root = rootProp !== undefined ? rootProp : internalRoot
  const setRoot = setRootProp !== undefined ? setRootProp : setInternalRoot

  // Keep loopRef in sync with loop state so the timeout callback can read it
  useEffect(() => {
    loopRef.current = loop
  }, [loop])

  useEffect(() => {
    return () => {
      stopAll()
      clearTimeout(timeoutRef.current)
    }
  }, [])

  async function startPlay() {
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
        if (loopRef.current) {
          // 400ms pause between repeats
          timeoutRef.current = setTimeout(() => {
            if (playingRef.current) {
              startPlay()
            }
          }, 400)
        } else {
          playingRef.current = false
          setPlaying(false)
        }
      }, duration + 200)
    } catch (e) {
      console.error('Audio playback failed:', e)
      playingRef.current = false
      setPlaying(false)
      setError('Audio failed — tap Play again')
    }
  }

  async function handlePlay() {
    if (playingRef.current) {
      stopAll()
      clearTimeout(timeoutRef.current)
      playingRef.current = false
      setPlaying(false)
      return
    }
    await startPlay()
  }

  return (
    <div className={styles.player}>
      <div className={styles.controls}>
        <button className={`${styles.playBtn} ${playing ? styles.playing : ''}`} onClick={handlePlay}>
          {playing ? '■ Stop' : '▶ Play Scale'}
        </button>
        {error && <span className={styles.audioError}>{error}</span>}

        <div className={styles.control}>
          <label htmlFor="audio-root">Root</label>
          <select id="audio-root" value={root} onChange={e => setRoot(e.target.value)}>
            {ROOTS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className={styles.control}>
          <label htmlFor="audio-tempo">Tempo</label>
          <input
            id="audio-tempo"
            type="range"
            min="40"
            max="200"
            value={tempo}
            aria-label={`Tempo: ${tempo} bpm`}
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
        <button
          className={`${styles.loopBtn} ${loop ? styles.loopBtnActive : ''}`}
          onClick={() => setLoop(l => !l)}
          title="Loop playback"
        >
          ↺ Loop
        </button>
      </div>
    </div>
  )
}
