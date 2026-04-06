
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'

export const useCartStore = defineStore('cart', {
  state: () => ({
    allCarts: {} // This will be persisted by the plugin
  }),
  persist: {
    keys: ['allCarts'],
    debounce: 50 // Optional parameter to override default 250ms delay
  },
  getters: {
    currentCartKey() {
      const auth = useAuthStore()
      return auth.currentUser ? `user_${auth.currentUser.id}` : 'guest'
    },
    items(state) {
      if (!state.allCarts[this.currentCartKey]) {
        return []
      }
      return state.allCarts[this.currentCartKey]
    },
    totalItems() {
      return this.items.reduce((sum, i) => sum + i.quantity, 0)
    },
    totalPrice() {
      return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
  },
  actions: {
    _ensureCartExists() {
      if (!this.allCarts[this.currentCartKey]) {
        this.allCarts[this.currentCartKey] = []
      }
    },
    addToCart(product, qty = 1) {
      this._ensureCartExists()
      const list = this.allCarts[this.currentCartKey]
      const existing = list.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += qty
      } else {
        list.push({ ...product, quantity: qty })
      }
    },
    removeFromCart(productId) {
      this._ensureCartExists()
      this.allCarts[this.currentCartKey] = this.allCarts[this.currentCartKey].filter(i => i.id !== productId)
    },
    updateQuantity(productId, qty) {
      this._ensureCartExists()
      const list = this.allCarts[this.currentCartKey]
      const item = list.find(i => i.id === productId)
      if (item) {
        if (qty <= 0) this.removeFromCart(productId)
        else item.quantity = qty
      }
    },
    clearCart() {
      this.allCarts[this.currentCartKey] = []
    }
  }
})
