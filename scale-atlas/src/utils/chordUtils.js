export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const CHORD_TYPES = [
  { id: 'maj',  label: 'Major',    suffix: '',     intervals: [0, 4, 7] },
  { id: 'min',  label: 'Minor',    suffix: 'm',    intervals: [0, 3, 7] },
  { id: 'dom7', label: '7',        suffix: '7',    intervals: [0, 4, 7, 10] },
  { id: 'maj7', label: 'Maj 7',    suffix: 'maj7', intervals: [0, 4, 7, 11] },
  { id: 'min7', label: 'Min 7',    suffix: 'm7',   intervals: [0, 3, 7, 10] },
  { id: 'sus2', label: 'Sus 2',    suffix: 'sus2', intervals: [0, 2, 7] },
  { id: 'sus4', label: 'Sus 4',    suffix: 'sus4', intervals: [0, 5, 7] },
  { id: 'add9', label: 'Add 9',    suffix: 'add9', intervals: [0, 4, 7, 14] },
  { id: 'dim',  label: 'Dim',      suffix: '°',    intervals: [0, 3, 6] },
  { id: 'aug',  label: 'Aug',      suffix: '+',    intervals: [0, 4, 8] },
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

  // For each string: valid frets (ascending), mute last
  const stringOptions = tuningMidi.map((openMidi) => {
    const opts = []
    for (let fret = 0; fret <= 12; fret++) {
      if (chordClasses.has((openMidi + fret) % 12)) opts.push(fret)
    }
    opts.push(-1)
    return opts
  })

  const voicings = []

  function search(si, current, minF, maxF) {
    if (si === 6) {
      if (current.filter(f => f >= 0).length < 3) return
      const presentClasses = new Set(
        current.map((f, i) => f < 0 ? null : (tuningMidi[i] + f) % 12).filter(x => x !== null)
      )
      if ([...chordClasses].some(c => !presentClasses.has(c))) return
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
    return (lowestIsRoot ? 0 : 50) + maxFret * 5 - sounding
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
