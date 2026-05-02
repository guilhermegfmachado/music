export function searchScales(scales, query) {
  if (!query.trim()) return scales
  const q = query.toLowerCase()
  return scales.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.culture.toLowerCase().includes(q) ||
    s.region.toLowerCase().includes(q) ||
    (s.aliases || []).some(a => a.toLowerCase().includes(q)) ||
    (s.tradition || '').toLowerCase().includes(q)
  )
}

export function filterScales(scales, filters) {
  return scales.filter(s => {
    if (filters.region && s.region !== filters.region) return false
    if (filters.culture && s.culture !== filters.culture) return false
    if (filters.toneCount && s.toneCount !== Number(filters.toneCount)) return false
    if (filters.mood && !s.characteristics.mood.includes(filters.mood)) return false
    if (filters.hasTritone !== null && filters.hasTritone !== undefined) {
      if (s.characteristics.hasTritone !== filters.hasTritone) return false
    }
    if (filters.isAnhemitonic !== null && filters.isAnhemitonic !== undefined) {
      if (s.characteristics.isAnhemitonic !== filters.isAnhemitonic) return false
    }
    if (filters.hasAugmentedInterval !== null && filters.hasAugmentedInterval !== undefined) {
      if (s.characteristics.hasAugmentedInterval !== filters.hasAugmentedInterval) return false
    }
    return true
  })
}
