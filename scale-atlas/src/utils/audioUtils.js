import * as Tone from 'tone'
import { intervalsToMidi } from './scaleUtils.js'

let synth = null

function getSynth(timbre) {
  if (synth) {
    synth.dispose()
    synth = null
  }

  switch (timbre) {
    case 'strings':
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.3, decay: 0.1, sustain: 0.8, release: 1.5 },
        volume: -8,
      }).toDestination()
      break
    case 'flute':
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.05, sustain: 0.9, release: 0.8 },
        volume: -6,
      }).toDestination()
      break
    case 'marimba':
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0.1, release: 0.5 },
        volume: -6,
      }).toDestination()
      break
    case 'synth_pad':
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'square' },
        envelope: { attack: 0.5, decay: 0.2, sustain: 0.7, release: 2 },
        volume: -10,
      }).toDestination()
      break
    default:
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
        volume: -6,
      }).toDestination()
  }
  return synth
}

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

export async function playScale(intervalFormula, { timbre = 'piano', tempo = 120, rootMidi = 60 } = {}) {
  await Tone.start()

  const transport = Tone.getTransport()
  transport.stop()
  transport.cancel()
  transport.position = 0

  const s = getSynth(timbre)
  const notes = [...intervalsToMidi(intervalFormula, rootMidi), rootMidi + 12]
  const noteDur = 60 / tempo

  notes.forEach((midi, i) => {
    const freq = midiToFreq(midi)
    transport.schedule((time) => {
      s.triggerAttackRelease(freq, noteDur * 0.9, time)
    }, i * noteDur)
  })

  transport.start('+0.02')
  return noteDur * notes.length * 1000
}

export async function playChord(intervalFormula, { timbre = 'piano', rootMidi = 60 } = {}) {
  await Tone.start()
  const s = getSynth(timbre)
  const notes = intervalsToMidi(intervalFormula, rootMidi)
  const freqs = notes.map(midiToFreq)
  s.triggerAttackRelease(freqs, '2n')
}

export async function playMidiNotes(midiNotes, timbre = 'piano') {
  await Tone.start()
  const s = getSynth(timbre)
  const freqs = midiNotes.map(midiToFreq)
  s.triggerAttackRelease(freqs, '2n')
}

export function stopAll() {
  const transport = Tone.getTransport()
  transport.stop()
  transport.cancel()
  if (synth) {
    synth.releaseAll()
  }
}

