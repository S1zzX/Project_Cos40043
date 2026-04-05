/**
 * Cart Store
 * Stage 3 Demo: uses the usePersistedState composable from the
 * Pinia persistence plugin so cart items auto-sync to localStorage
 * with debounced deep-watch — no manual localStorage calls needed.
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { usePersistedState } from '../plugins/piniaPersistedPlugin.js'
import { useAuthStore } from './auth.js'

export const useCartStore = defineStore('cart', () => {
  const auth = useAuthStore()
  
  // We now store a dictionary mapping user keys to cart arrays
  const allCarts = usePersistedState('s1zz_all_carts', {})

  const currentCartKey = computed(() => {
    return auth.currentUser ? `user_${auth.currentUser.id}` : 'guest'
  })

  // Helper to safely get the current array
  function getItems() {
    if (!allCarts.value[currentCartKey.value]) {
      allCarts.value[currentCartKey.value] = []
    }
    return allCarts.value[currentCartKey.value]
  }

  const items = computed(() => getItems())

  const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, i) => sum + i.price * i.quantity, 0))

  function addToCart(product, qty = 1) {
    const list = getItems()
    const existing = list.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      list.push({ ...product, quantity: qty })
    }
  }

  function removeFromCart(productId) {
    allCarts.value[currentCartKey.value] = getItems().filter(i => i.id !== productId)
  }

  function updateQuantity(productId, qty) {
    const list = getItems()
    const item = list.find(i => i.id === productId)
    if (item) {
      if (qty <= 0) removeFromCart(productId)
      else item.quantity = qty
    }
  }

  function clearCart() {
    allCarts.value[currentCartKey.value] = []
  }

  return { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }
})
