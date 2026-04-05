<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'
import { useWishlistStore } from '../stores/wishlist.js'
import { useProductsStore } from '../stores/products.js'

const props = defineProps({ product: { type: Object, required: true } })

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const productStore = useProductsStore()

const isWishlisted = computed(() => wishlist.isInWishlist(props.product.id))
const likeCount = computed(() => productStore.getLikeCount(props.product.id))
const isLiked = computed(() => auth.isLoggedIn && productStore.isLikedByUser(props.product.id, auth.currentUser?.id))

const stars = computed(() => {
  const r = Math.round(props.product.rating?.rate || 0)
  return '★'.repeat(r) + '☆'.repeat(5 - r)
})

const shortTitle = computed(() =>
  props.product.title.length > 52 ? props.product.title.slice(0, 52) + '…' : props.product.title
)

function handleCart() { cart.addToCart(props.product) }

function handleWishlist() {
  if (!auth.isLoggedIn) return
  wishlist.toggleWishlist(props.product)
}

function handleLike() {
  if (!auth.isLoggedIn) return
  productStore.toggleLike(props.product.id, auth.currentUser.id)
}
</script>

<template>
  <div class="card h-100" style="transition:box-shadow 0.2s,transform 0.2s;" @mouseenter="$el.style.transform='translateY(-3px)'" @mouseleave="$el.style.transform='translateY(0)'">
    <!-- Image -->
    <div class="position-relative" style="background:var(--bg-surface-2);border-radius:11px 11px 0 0;overflow:hidden;">
      <RouterLink :to="`/products/${product.id}`">
        <img
          :src="product.image"
          :alt="product.title"
          class="w-100"
          style="height:200px;object-fit:contain;padding:1rem;transition:transform 0.3s;"
          @mouseenter="$event.target.style.transform='scale(1.05)'"
          @mouseleave="$event.target.style.transform='scale(1)'"
        />
      </RouterLink>
      <button
        class="btn-wishlist"
        :class="{ active: isWishlisted }"
        @click="handleWishlist"
        :title="auth.isLoggedIn ? 'Toggle wishlist' : 'Login to wishlist'"
      >
        <i :class="isWishlisted ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
    </div>

    <div class="card-body d-flex flex-column p-3">
      <span class="badge-category mb-2 d-inline-block" style="width:fit-content">{{ product.category }}</span>

      <RouterLink :to="`/products/${product.id}`" class="product-title mb-1">{{ shortTitle }}</RouterLink>

      <div class="d-flex align-items-center gap-1 mb-3">
        <span class="stars" style="font-size:0.8rem">{{ stars }}</span>
        <span class="small" style="color:var(--text-muted)">({{ product.rating?.count || 0 }})</span>
      </div>

      <div class="mt-auto">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="product-price">${{ product.price?.toFixed(2) }}</span>
          <button
            v-tooltip="auth.isLoggedIn ? `Like this product (${likeCount})` : 'Login to like products'"
            class="btn-like" :class="{ liked: isLiked }" @click="handleLike">
            <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            <span>{{ likeCount }}</span>
          </button>
        </div>
        <button
          v-tooltip="'Add to cart'"
          class="btn btn-primary w-100 btn-sm" @click="handleCart">
          <i class="bi bi-cart-plus me-1"></i>Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>
