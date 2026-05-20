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

export function computeModes(intervalFormula) {
  return intervalFormula.map((_, startIdx) => {
    const rotated = [...intervalFormula.slice(startIdx), ...intervalFormula.slice(0, startIdx)]
    return rotated
  })
}

export function findSimilarScales(scale, allScales, limit = 4) {
  const scaleSemitones = intervalsToSemitones(scale.intervalFormula)
  const scaleMoods = scale.characteristics?.mood || []

  const scored = allScales
    .filter(s => s.id !== scale.id)
    .map(s => {
      let score = 0
      const sMoods = s.characteristics?.mood || []
      for (const m of scaleMoods) {
        if (sMoods.includes(m)) score += 3
      }
      const sSemitones = intervalsToSemitones(s.intervalFormula)
      for (const st of scaleSemitones) {
        if (sSemitones.includes(st)) score += 2
      }
      if (s.toneCount === scale.toneCount) score += 1
      return { scale: s, score }
    })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(x => x.scale)
}

export function computeDiatonicChords(intervalFormula) {
  if (intervalFormula.length < 5) return []
  const scale = intervalsToSemitones(intervalFormula)
  const n = scale.length
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX']

  return scale.map((root, i) => {
    const third = scale[(i + 2) % n]
    const fifth = scale[(i + 4) % n]

    let t = third - root
    if (t <= 0) t += 12
    let f = fifth - root
    if (f <= 0) f += 12
    if (f < t) f += 12

    let quality
    if      (t === 4 && f === 7) quality = 'maj'
    else if (t === 3 && f === 7) quality = 'min'
    else if (t === 3 && f === 6) quality = 'dim'
    else if (t === 4 && f === 8) quality = 'aug'
    else                         quality = 'other'

    const label = quality === 'maj' ? ROMAN[i] :
                  quality === 'min' ? ROMAN[i].toLowerCase() :
                  quality === 'dim' ? ROMAN[i].toLowerCase() + '°' :
                  quality === 'aug' ? ROMAN[i] + '+' :
                  ROMAN[i] + '?'

    return { degree: ROMAN[i] || String(i + 1), label, quality }
  })
}

