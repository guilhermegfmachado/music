import { useLocalStorage } from './useLocalStorage.js'

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('sa-favorites', [])

  function toggleFavorite(scaleId) {
    setFavorites(prev =>
      prev.includes(scaleId) ? prev.filter(id => id !== scaleId) : [...prev, scaleId]
    )
  }

  function isFavorite(scaleId) {
    return favorites.includes(scaleId)
  }

  return { favorites, toggleFavorite, isFavorite }
}
