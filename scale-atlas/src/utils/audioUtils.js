import * as Tone from 'tone'
import { intervalsToMidi } from './scaleUtils.js'

// ── Synth cache ───────────────────────────────────────────────
// One synth per timbre, created once and reused. Previously every
// playback disposed the live synth, which silenced any notes still
// scheduled against it.
const SYNTH_CONFIG = {
  strings:   { oscillator: { type: 'sawtooth' }, envelope: { attack: 0.3,   decay: 0.1,  sustain: 0.8, release: 1.5 }, volume: -8  },
  flute:     { oscillator: { type: 'sine' },     envelope: { attack: 0.1,   decay: 0.05, sustain: 0.9, release: 0.8 }, volume: -6  },
  marimba:   { oscillator: { type: 'triangle' }, envelope: { attack: 0.001, decay: 0.5,  sustain: 0.1, release: 0.5 }, volume: -6  },
  synth_pad: { oscillator: { type: 'square' },   envelope: { attack: 0.5,   decay: 0.2,  sustain: 0.7, release: 2   }, volume: -10 },
  piano:     { oscillator: { type: 'triangle' }, envelope: { attack: 0.02,  decay: 0.1,  sustain: 0.5, release: 0.8 }, volume: -6  },
}

const synths = new Map()

function getSynth(timbre = 'piano') {
  const key = SYNTH_CONFIG[timbre] ? timbre : 'piano'
  if (!synths.has(key)) {
    synths.set(key, new Tone.PolySynth(Tone.Synth, SYNTH_CONFIG[key]).toDestination())
  }
  return synths.get(key)
}

// ── Context unlock ────────────────────────────────────────────
// Mobile browsers suspend (iOS: "interrupted") the AudioContext when the
// tab is backgrounded, the screen locks, or a call comes in. Tone.start()
// only unlocks the first time, so every later play was silent until reload.
// Resume explicitly on every playback.
export async function ensureAudio() {
  try {
    await Tone.start()
  } catch { /* already started */ }

  const ctx = Tone.getContext()
  if (ctx.state !== 'running') {
    try { await ctx.resume() } catch { /* ignore */ }
  }
  const raw = ctx.rawContext ?? ctx._context
  if (raw && raw.state !== 'running' && typeof raw.resume === 'function') {
    try { await raw.resume() } catch { /* ignore */ }
  }
  return Tone.getContext().state === 'running'
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// ── Melodic playback ──────────────────────────────────────────
// Schedules against the shared Transport but tracks its own event ids,
// so stopping a scale no longer wipes a running metronome (and vice versa).
let scheduledIds = []

function clearScheduled() {
  const t = Tone.getTransport()
  scheduledIds.forEach(id => { try { t.clear(id) } catch { /* ignore */ } })
  scheduledIds = []
}

export async function playScale(intervalFormula, { timbre = 'piano', tempo = 120, rootMidi = 60 } = {}) {
  await ensureAudio()
  clearScheduled()

  const s = getSynth(timbre)
  const notes = [...intervalsToMidi(intervalFormula, rootMidi), rootMidi + 12]
  const noteDur = 60 / tempo

  const transport = Tone.getTransport()
  if (transport.state !== 'started') transport.start()

  const base = transport.seconds + 0.1
  notes.forEach((midi, i) => {
    const freq = midiToFreq(midi)
    const id = transport.schedule((time) => {
      s.triggerAttackRelease(freq, noteDur * 0.9, time)
    }, base + i * noteDur)
    scheduledIds.push(id)
  })

  return noteDur * notes.length * 1000
}

export async function playChord(intervalFormula, { timbre = 'piano', rootMidi = 60 } = {}) {
  await ensureAudio()
  const s = getSynth(timbre)
  s.triggerAttackRelease(intervalsToMidi(intervalFormula, rootMidi).map(midiToFreq), '2n')
}

export async function playMidiNotes(midiNotes, timbre = 'piano') {
  await ensureAudio()
  const s = getSynth(timbre)
  s.triggerAttackRelease(midiNotes.map(midiToFreq), '2n')
}

/** Strum a voicing low → high, like a real guitar. */
export async function strumMidiNotes(midiNotes, { timbre = 'piano', spread = 0.035 } = {}) {
  await ensureAudio()
  const s = getSynth(timbre)
  const now = Tone.now() + 0.03
  midiNotes.forEach((midi, i) => {
    s.triggerAttackRelease(midiToFreq(midi), '2n', now + i * spread)
  })
}

/** Stops melodic playback. Leaves the Transport running for other features. */
export function stopAll() {
  clearScheduled()
  synths.forEach(s => { try { s.releaseAll() } catch { /* ignore */ } })
}
