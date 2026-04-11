
import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),
  persist: {
    keys: ['items']
  },
  actions: {
    isInWishlist(productId) {
      return this.items.some(i => i.id === productId)
    },
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.items = this.items.filter(i => i.id !== product.id)
      } else {
        this.items.push(product)
      }
    },
    removeFromWishlist(productId) {
      this.items = this.items.filter(i => i.id !== productId)
    },
    clearWishlist() {
      this.items = []
    }
  }
})
