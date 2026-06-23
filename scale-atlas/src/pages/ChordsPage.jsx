import { useState, useMemo } from 'react'
import { TUNINGS } from '../data/tunings.js'
import { findVoicings, voicingToMidi, CHORD_TYPES, NOTE_NAMES } from '../utils/chordUtils.js'
import { playMidiNotes, stopAll } from '../utils/audioUtils.js'
import ChordDiagram from '../components/visualizations/ChordDiagram.jsx'
import styles from './ChordsPage.module.css'

const STANDARD = {
  id: 'standard',
  name: 'Standard (EADGBE)',
  midi: [40, 45, 50, 55, 59, 64],
  strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  category: 'Standard',
}
const ALL_TUNINGS = [STANDARD, ...TUNINGS]

const BY_CATEGORY = ALL_TUNINGS.reduce((acc, t) => {
  ;(acc[t.category] = acc[t.category] || []).push(t)
  return acc
}, {})

export default function ChordsPage() {
  const [tuningId, setTuningId] = useState('standard')
  const [rootIdx, setRootIdx] = useState(0)
  const [chordTypeId, setChordTypeId] = useState('maj')
  const [playing, setPlaying] = useState(false)
  const [activeVoicing, setActiveVoicing] = useState(0)

  const tuning = ALL_TUNINGS.find(t => t.id === tuningId) || STANDARD
  const chordType = CHORD_TYPES.find(c => c.id === chordTypeId) || CHORD_TYPES[0]

  const voicings = useMemo(() => {
    setActiveVoicing(0)
    return findVoicings(tuning.midi, rootIdx, chordType.intervals)
  }, [tuning, rootIdx, chordType])

  const chordName = NOTE_NAMES[rootIdx] + chordType.suffix
  const chordNotes = chordType.intervals.map(i => NOTE_NAMES[(rootIdx + i) % 12]).join(' · ')

  async function handlePlay() {
    if (playing) { stopAll(); setPlaying(false); return }
    if (voicings.length === 0) return
    const midiNotes = voicingToMidi(voicings[activeVoicing], tuning.midi)
    setPlaying(true)
    await playMidiNotes(midiNotes)
    setTimeout(() => setPlaying(false), 2000)
  }

  return (
    <div className={styles.page}>
      <div className="container">

        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Chords</h1>
            <p className={styles.subtitle}>Guitar chord shapes across tunings</p>
          </div>
        </header>

        <div className={styles.controls}>
          {/* Tuning */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Tuning</label>
            <select
              className={styles.select}
              value={tuningId}
              onChange={e => setTuningId(e.target.value)}
            >
              {Object.entries(BY_CATEGORY).map(([cat, tunings]) => (
                <optgroup key={cat} label={cat}>
                  {tunings.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className={styles.tuningStrings}>
              {tuning.strings.map((s, i) => (
                <span key={i} className={styles.openNote}>{s.replace(/\d/, '')}</span>
              ))}
            </div>
          </div>

          {/* Root */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Root</label>
            <div className={styles.noteGrid}>
              {NOTE_NAMES.map((n, i) => (
                <button
                  key={n}
                  className={`${styles.noteBtn} ${i === rootIdx ? styles.noteBtnActive : ''}`}
                  onClick={() => setRootIdx(i)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Chord type */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Type</label>
            <div className={styles.typeGrid}>
              {CHORD_TYPES.map(ct => (
                <button
                  key={ct.id}
                  className={`${styles.typeBtn} ${ct.id === chordTypeId ? styles.typeBtnActive : ''}`}
                  onClick={() => setChordTypeId(ct.id)}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chord summary + play */}
        <div className={styles.chordBar}>
          <div className={styles.chordInfo}>
            <span className={styles.chordName}>{chordName}</span>
            <span className={styles.chordNotes}>{chordNotes}</span>
          </div>
          <button
            className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
            onClick={handlePlay}
            disabled={voicings.length === 0}
          >
            {playing ? '■ Stop' : '▶ Play'}
          </button>
        </div>

        {/* Voicings */}
        {voicings.length === 0 ? (
          <div className={styles.empty}>
            No playable voicings found for <strong>{chordName}</strong> in this tuning.
            <br />Try a different chord type or tuning.
          </div>
        ) : (
          <div className={styles.voicings}>
            {voicings.map((v, i) => (
              <div
                key={i}
                className={`${styles.voicingCard} ${i === activeVoicing ? styles.voicingActive : ''}`}
                onClick={() => setActiveVoicing(i)}
              >
                <ChordDiagram
                  voicing={v}
                  tuningMidi={tuning.midi}
                  rootSemitone={rootIdx}
                />
                <div className={styles.voicingLabel}>
                  {v.map(f => f < 0 ? 'x' : f).join(' ')}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className={styles.hint}>
          Click a voicing to select it, then press Play. Diagrams show strings low → high (left → right).
        </p>

      </div>
    </div>
  )
}
