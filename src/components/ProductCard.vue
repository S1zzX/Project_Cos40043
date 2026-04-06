<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'
import { useWishlistStore } from '../stores/wishlist.js'
import { useProductsStore } from '../stores/products.js'

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapStores(useAuthStore, useCartStore, useWishlistStore, useProductsStore),
    auth() { return this.authStore; },
    cart() { return this.cartStore; },
    wishlist() { return this.wishlistStore; },
    productStore() { return this.productsStore; }, // maps to useProductsStore

    isWishlisted() {
      return this.wishlist.isInWishlist(this.product.id)
    },
    likeCount() {
      return this.productStore.getLikeCount(this.product.id)
    },
    isLiked() {
      return this.auth.isLoggedIn && this.productStore.isLikedByUser(this.product.id, this.auth.currentUser?.id)
    },
    stars() {
      const r = Math.round(this.product.rating?.rate || 0)
      return '★'.repeat(r) + '☆'.repeat(5 - r)
    },
    shortTitle() {
      return this.product.title.length > 52 ? this.product.title.slice(0, 52) + '…' : this.product.title
    }
  },
  methods: {
    handleCart() {
      this.cart.addToCart(this.product)
    },
    handleWishlist() {
      if (!this.auth.isLoggedIn) return
      this.wishlist.toggleWishlist(this.product)
    },
    handleLike() {
      if (!this.auth.isLoggedIn) return
      this.productStore.toggleLike(this.product.id, this.auth.currentUser.id)
    }
  }
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
