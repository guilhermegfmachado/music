import { useLocalStorage } from './useLocalStorage.js'

export function useRecentlyViewed() {
  const [viewed, setViewed] = useLocalStorage('sa-recent', [])

  function addViewed(scaleId) {
    setViewed(prev => {
      const filtered = prev.filter(id => id !== scaleId)
      return [scaleId, ...filtered].slice(0, 10)
    })
  }

  return { viewed, addViewed }
}
