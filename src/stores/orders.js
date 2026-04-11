import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    allOrders: {} // Persisted
  }),
  persist: {
    keys: ['allOrders']
  },
  getters: {
    currentKey() {
      const auth = useAuthStore()
      return auth.currentUser ? `user_${auth.currentUser.id}` : 'guest'
    },
    orders(state) {
      if (!state.allOrders[this.currentKey]) return []
      // Return order history newest first
      return [...state.allOrders[this.currentKey]].reverse()
    }
  },
  actions: {
    addOrder(cartItems, totalAmount) {
      if (!this.allOrders[this.currentKey]) {
        this.allOrders[this.currentKey] = []
      }
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(cartItems)),
        total: totalAmount
      }
      this.allOrders[this.currentKey].push(order)
      return order
    }
  }
})
