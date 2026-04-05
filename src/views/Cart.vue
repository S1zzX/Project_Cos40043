<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart.js'
import { useAuthStore } from '../stores/auth.js'

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(() => {
  document.title = 'Shopping Cart | S1zz'
})

if (auth.isAdmin) {
  router.push('/dashboard')
}

function checkout() {
  if (cart.items.length === 0) return
  alert('Order placed successfully! Thank you for shopping with S1zz.')
  cart.clearCart()
}

const subtotal = computed(() => cart.totalPrice)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + tax.value)
</script>

<template>
  <div class="page-section">
    <div class="container">
      <h1 class="fw-bold mb-4"><i class="bi bi-cart3 me-2 text-brand"></i>Shopping Cart</h1>

      <div v-if="cart.items.length === 0" class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size:4rem;color:var(--text-muted)"></i>
        <h4 class="mt-3 fw-bold">Your cart is empty</h4>
        <p class="text-muted-custom">Add some products to get started!</p>
        <RouterLink to="/products" class="btn btn-primary mt-2">
          <i class="bi bi-grid me-2"></i>Browse Products
        </RouterLink>
      </div>

      <div v-else class="row g-4">
        <!-- Cart Items -->
        <div class="col-12 col-lg-8">
          <div class="card p-3">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="cart-item d-flex align-items-center gap-3 p-3 mb-2 rounded-3"
            >
              <img :src="item.image" :alt="item.title" style="width:70px;height:70px;object-fit:contain;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px;flex-shrink:0;" />
              <div class="flex-grow-1 min-w-0">
                <RouterLink :to="`/products/${item.id}`" class="d-block fw-semibold" style="color:var(--brand-text);text-decoration:none;font-size:0.9rem;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;">
                  {{ item.title }}
                </RouterLink>
                <div class="text-muted-custom small text-capitalize">{{ item.category }}</div>
                <div class="fw-bold mt-1" style="color:var(--brand)">${{ item.price.toFixed(2) }}</div>
              </div>
              <div class="d-flex align-items-center gap-2 flex-shrink-0">
                <button class="btn btn-sm btn-outline-secondary" style="width:30px;padding:0;" @click="cart.updateQuantity(item.id, item.quantity - 1)">-</button>
                <span class="fw-semibold" style="min-width:24px;text-align:center;">{{ item.quantity }}</span>
                <button class="btn btn-sm btn-outline-secondary" style="width:30px;padding:0;" @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
              </div>
              <div class="fw-bold text-end flex-shrink-0" style="min-width:70px;">${{ (item.price * item.quantity).toFixed(2) }}</div>
              <button class="btn btn-sm btn-outline-danger flex-shrink-0" @click="cart.removeFromCart(item.id)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="d-flex justify-content-end mt-2 pt-2" style="border-top:1px solid var(--border)">
              <button class="btn btn-sm btn-outline-danger" @click="cart.clearCart()">
                <i class="bi bi-trash me-1"></i>Clear Cart
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="col-12 col-lg-4">
          <div class="card p-4 sticky-top" style="top:80px">
            <h5 class="fw-bold mb-4">Order Summary</h5>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted-custom">Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted-custom">GST (10%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted-custom">Shipping</span>
              <span class="text-success">{{ subtotal >= 50 ? 'Free' : '$9.99' }}</span>
            </div>
            <hr style="border-color:var(--border)">
            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold fs-5">Total</span>
              <span class="fw-bold fs-5" style="color:var(--brand)">${{ (total + (subtotal < 50 ? 9.99 : 0)).toFixed(2) }}</span>
            </div>
            <button class="btn btn-primary w-100 btn-lg" @click="checkout">
              <i class="bi bi-credit-card me-2"></i>Checkout
            </button>
            <RouterLink to="/products" class="btn btn-outline-secondary w-100 mt-2">
              Continue Shopping
            </RouterLink>
            <p v-if="subtotal < 50" class="small text-muted-custom text-center mt-3">
              Add ${{ (50 - subtotal).toFixed(2) }} more for free shipping!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  transition: border-color var(--transition);
}
.cart-item:hover { border-color: rgba(108,63,255,0.4); }
</style>
