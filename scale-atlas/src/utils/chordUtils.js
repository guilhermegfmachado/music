export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const CHORD_TYPES = [
  // Triads
  { id: 'maj',    label: 'Major',   suffix: '',      group: 'Triads',      intervals: [0, 4, 7] },
  { id: 'min',    label: 'Minor',   suffix: 'm',     group: 'Triads',      intervals: [0, 3, 7] },
  { id: 'pow',    label: '5',       suffix: '5',     group: 'Triads',      intervals: [0, 7] },
  { id: 'dim',    label: 'Dim',     suffix: '\u00b0',    group: 'Triads',      intervals: [0, 3, 6] },
  { id: 'aug',    label: 'Aug',     suffix: '+',     group: 'Triads',      intervals: [0, 4, 8] },
  { id: 'sus2',   label: 'Sus2',    suffix: 'sus2',  group: 'Triads',      intervals: [0, 2, 7] },
  { id: 'sus4',   label: 'Sus4',    suffix: 'sus4',  group: 'Triads',      intervals: [0, 5, 7] },

  // Sevenths
  { id: 'dom7',   label: '7',       suffix: '7',     group: 'Sevenths',    intervals: [0, 4, 7, 10] },
  { id: 'maj7',   label: 'Maj7',    suffix: 'maj7',  group: 'Sevenths',    intervals: [0, 4, 7, 11] },
  { id: 'min7',   label: 'm7',      suffix: 'm7',    group: 'Sevenths',    intervals: [0, 3, 7, 10] },
  { id: 'min7b5', label: 'm7\u266d5',   suffix: 'm7\u266d5',  group: 'Sevenths',    intervals: [0, 3, 6, 10] },
  { id: 'dim7',   label: '\u00b07',     suffix: '\u00b07',    group: 'Sevenths',    intervals: [0, 3, 6, 9] },
  { id: 'minMaj7',label: 'mMaj7',   suffix: 'mMaj7', group: 'Sevenths',    intervals: [0, 3, 7, 11] },
  { id: '7sus4',  label: '7sus4',   suffix: '7sus4', group: 'Sevenths',    intervals: [0, 5, 7, 10] },

  // Sixths & adds
  { id: 'maj6',   label: '6',       suffix: '6',     group: 'Sixths & Adds', intervals: [0, 4, 7, 9] },
  { id: 'min6',   label: 'm6',      suffix: 'm6',    group: 'Sixths & Adds', intervals: [0, 3, 7, 9] },
  { id: 'add9',   label: 'add9',    suffix: 'add9',  group: 'Sixths & Adds', intervals: [0, 4, 7, 14] },
  { id: 'madd9',  label: 'm(add9)', suffix: 'm(add9)', group: 'Sixths & Adds', intervals: [0, 3, 7, 14] },

  // Extended & altered
  { id: 'dom9',   label: '9',       suffix: '9',     group: 'Extended',    intervals: [0, 4, 7, 10, 14] },
  { id: 'maj9',   label: 'Maj9',    suffix: 'maj9',  group: 'Extended',    intervals: [0, 4, 7, 11, 14] },
  { id: 'min9',   label: 'm9',      suffix: 'm9',    group: 'Extended',    intervals: [0, 3, 7, 10, 14] },
  { id: '7b9',    label: '7\u266d9',    suffix: '7\u266d9',   group: 'Extended',    intervals: [0, 4, 7, 10, 13] },
  { id: '7s9',    label: '7\u266f9',    suffix: '7\u266f9',   group: 'Extended',    intervals: [0, 4, 7, 10, 15] },
  { id: '7s5',    label: '7\u266f5',    suffix: '7\u266f5',   group: 'Extended',    intervals: [0, 4, 8, 10] },
  { id: '7b5',    label: '7\u266d5',    suffix: '7\u266d5',   group: 'Extended',    intervals: [0, 4, 6, 10] },
]

/**
 * Find playable guitar chord voicings.
 * @param {number[]} tuningMidi - MIDI values of open strings, LOW to HIGH (6 values)
 * @param {number} rootSemitone - Root note (0=C … 11=B)
 * @param {number[]} intervals  - Intervals in semitones from root
 * @param {number}  maxResults
 * @returns {number[][]} Each voicing: [f0…f5] low→high, -1 = mute, 0 = open
 */
export function findVoicings(tuningMidi, rootSemitone, intervals, maxResults = 4) {
  const chordClasses = new Set(intervals.map(i => (rootSemitone + i) % 12))
  const rootClass = rootSemitone % 12

  // Six strings can't always carry a 5-note chord. Guitarists drop the 5th
  // first (it adds no colour), so treat it as optional on extended voicings.
  const fifthClass = (rootSemitone + 7) % 12
  const dropFifth = chordClasses.size >= 5 && chordClasses.has(fifthClass)
  const requiredClasses = new Set(chordClasses)
  if (dropFifth) requiredClasses.delete(fifthClass)

  // For each string: valid frets (ascending), mute last
  const stringOptions = tuningMidi.map((openMidi) => {
    const opts = []
    for (let fret = 0; fret <= 12; fret++) {
      if (chordClasses.has((openMidi + fret) % 12)) opts.push(fret)
    }
    opts.push(-1)
    return opts
  })

  const numStrings = tuningMidi.length
  const voicings = []

  function search(si, current, minF, maxF) {
    if (si === numStrings) {
      if (current.filter(f => f >= 0).length < 3) return
      const presentClasses = new Set(
        current.map((f, i) => f < 0 ? null : (tuningMidi[i] + f) % 12).filter(x => x !== null)
      )
      if ([...requiredClasses].some(c => !presentClasses.has(c))) return
      voicings.push([...current])
      return
    }
    for (const fret of stringOptions[si]) {
      let nMin = minF, nMax = maxF
      if (fret > 0) {
        nMin = Math.min(minF, fret)
        nMax = Math.max(maxF, fret)
        if (nMax - nMin > 4) continue
      }
      current.push(fret)
      search(si + 1, current, nMin, nMax)
      current.pop()
    }
  }

  search(0, [], Infinity, -Infinity)

  function score(v) {
    const frettedFrets = v.filter(f => f > 0)
    const maxFret = frettedFrets.length > 0 ? Math.max(...frettedFrets) : 0
    const lowestIdx = v.findIndex(f => f >= 0)
    const lowestIsRoot = lowestIdx >= 0 && (tuningMidi[lowestIdx] + v[lowestIdx]) % 12 === rootClass
    const sounding = v.filter(f => f >= 0).length
    const present = new Set(v.map((f, i) => f < 0 ? null : (tuningMidi[i] + f) % 12).filter(x => x !== null))
    const complete = [...chordClasses].every(c => present.has(c))
    return (lowestIsRoot ? 0 : 60) + (complete ? 0 : 25) + maxFret * 4 - sounding * 6
  }

  voicings.sort((a, b) => score(a) - score(b))

  const seen = new Set()
  const unique = []
  for (const v of voicings) {
    const key = v.join(',')
    if (!seen.has(key)) { seen.add(key); unique.push(v) }
  }
  return unique.slice(0, maxResults)
}

/** Convert a voicing to the MIDI notes that will sound */
export function voicingToMidi(voicing, tuningMidi) {
  return voicing
    .map((fret, i) => fret < 0 ? null : tuningMidi[i] + fret)
    .filter(m => m !== null)
}
