<script>
import { mapStores } from 'pinia'
import { useWishlistStore } from '../stores/wishlist.js'
import { useCartStore } from '../stores/cart.js'
import ProductCard from '../components/ProductCard.vue'

export default {
  components: {
    ProductCard
  },
  computed: {
    ...mapStores(useWishlistStore, useCartStore),
    wishlist() { return this.wishlistStore; },
    cart() { return this.cartStore; }
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <h1 class="fw-bold mb-2"><i class="bi bi-heart-fill text-brand me-2"></i>My Wishlist</h1>
      <p class="text-muted-custom mb-5">{{ wishlist.items.length }} saved item(s)</p>

      <div v-if="wishlist.items.length === 0" class="text-center py-5">
        <i class="bi bi-heart" style="font-size:4rem;color:var(--text-muted)"></i>
        <h4 class="mt-3 fw-bold">Your wishlist is empty</h4>
        <p class="text-muted-custom">Save your favourite products here!</p>
        <RouterLink to="/products" class="btn btn-primary mt-2">
          <i class="bi bi-grid me-2"></i>Browse Products
        </RouterLink>
      </div>

      <div v-else>
        <div class="d-flex justify-content-end mb-3">
          <button class="btn btn-sm btn-outline-danger" @click="wishlist.clearWishlist()">
            <i class="bi bi-trash me-1"></i>Clear All
          </button>
        </div>
        <div class="row g-4">
          <div v-for="product in wishlist.items" :key="product.id" class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
