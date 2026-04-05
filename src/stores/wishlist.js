/**
 * Wishlist Store
 * Also uses usePersistedState composable (Stage 3 integration).
 */
import { defineStore } from 'pinia'
import { usePersistedState } from '../plugins/piniaPersistedPlugin.js'

export const useWishlistStore = defineStore('wishlist', () => {
  const items = usePersistedState('s1zz_wishlist_items', [])

  function isInWishlist(productId) {
    return items.value.some(i => i.id === productId)
  }

  function toggleWishlist(product) {
    if (isInWishlist(product.id)) {
      items.value = items.value.filter(i => i.id !== product.id)
    } else {
      items.value.push(product)
    }
  }

  function removeFromWishlist(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function clearWishlist() {
    items.value = []
  }

  return { items, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist }
})
