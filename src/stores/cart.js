/**
 * Cart Store
 * Stage 3 Demo: uses the usePersistedState composable from the
 * Pinia persistence plugin so cart items auto-sync to localStorage
 * with debounced deep-watch — no manual localStorage calls needed.
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { usePersistedState } from '../plugins/piniaPersistedPlugin.js'

export const useCartStore = defineStore('cart', () => {
  // Stage 3: usePersistedState replaces manual localStorage read/write.
  // It rehydrates on init and deep-watches for any nested mutation.
  const items = usePersistedState('s1zz_cart_items', [])

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  function addToCart(product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      items.value.push({ ...product, quantity: qty })
    }
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function updateQuantity(productId, qty) {
    const item = items.value.find(i => i.id === productId)
    if (item) {
      if (qty <= 0) removeFromCart(productId)
      else item.quantity = qty
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }
})
