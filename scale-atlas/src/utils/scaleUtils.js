const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function intervalsToSemitones(intervalFormula) {
  const semitones = [0]
  let sum = 0
  for (let i = 0; i < intervalFormula.length - 1; i++) {
    sum += intervalFormula[i]
    semitones.push(sum)
  }
  return semitones
}

export function intervalsToNoteNames(intervalFormula, rootNote = 'C') {
  const rootIndex = NOTE_NAMES.indexOf(rootNote)
  const semitones = intervalsToSemitones(intervalFormula)
  return semitones.map(s => NOTE_NAMES[(rootIndex + s) % 12])
}

export function intervalsToMidi(intervalFormula, rootMidi = 60) {
  const semitones = intervalsToSemitones(intervalFormula)
  return semitones.map(s => rootMidi + s)
}

export function getIntervalName(semitones) {
  const names = {
    0: 'Unison', 1: 'Minor 2nd', 2: 'Major 2nd', 3: 'Minor 3rd',
    4: 'Major 3rd', 5: 'Perfect 4th', 6: 'Tritone',
    7: 'Perfect 5th', 8: 'Minor 6th', 9: 'Major 6th',
    10: 'Minor 7th', 11: 'Major 7th', 12: 'Octave'
  }
  return names[semitones] || `${semitones} semitones`
}

export function getRegions(scales) {
  const regions = [...new Set(scales.map(s => s.region))].sort()
  return regions
}

export function getCultures(scales) {
  const cultures = [...new Set(scales.map(s => s.culture))].sort()
  return cultures
}

export function getAllMoods(scales) {
  const moods = new Set()
  scales.forEach(s => s.characteristics.mood.forEach(m => moods.add(m)))
  return [...moods].sort()
}

export function getRelatedScales(scale, allScales) {
  if (!scale.relatedScales?.length) return []
  return scale.relatedScales
    .map(id => allScales.find(s => s.id === id))
    .filter(Boolean)
}
