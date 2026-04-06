<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import { useProductsStore } from '../stores/products.js'
import ProductCard from '../components/ProductCard.vue'

export default {
  components: {
    ProductCard
  },
  computed: {
    ...mapStores(useAuthStore, useProductsStore),
    auth() { return this.authStore; },
    productStore() { return this.productsStore; },
    featured() {
      return this.productStore.products.slice(0, 4)
    }
  },
  async mounted() {
    document.title = 'Home | S1zz'
    await this.auth.initUsers()
    if (this.productStore.products.length === 0) {
      await this.productStore.fetchProducts()
    }
  }
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero-section page-hero">
      <div class="container">
        <div class="row align-items-center g-5">
          <!-- Text -->
          <div class="col-12 col-lg-6 animate-up">
            <span class="section-tag"><i class="bi bi-stars me-1"></i>Premium Shopping</span>
            <h1 class="display-5 fw-bold mb-3 mt-2" style="color:var(--text-primary)">
              Your favourite store,<br>
              <span style="color:var(--brand)">now online.</span>
            </h1>
            <p class="lead mb-4" style="color:var(--text-secondary);font-size:1rem;">
              Browse thousands of top-quality products across electronics, fashion, jewellery, and more — delivered fast.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <RouterLink to="/products" class="btn btn-primary btn-lg px-4">
                <i class="bi bi-grid me-2"></i>Shop Now
              </RouterLink>
              <RouterLink v-if="!auth.isLoggedIn" to="/register" class="btn btn-outline-primary btn-lg px-4">
                Join Free
              </RouterLink>
            </div>
          </div>
          <!-- Images -->
          <div class="col-12 col-lg-6">
            <div class="row g-3">
              <div class="col-6">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80"
                  alt="Fashion collection"
                  class="w-100 rounded-4"
                  style="height:220px;object-fit:cover;border:1px solid var(--border);"
                />
              </div>
              <div class="col-6">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80"
                  alt="Electronics"
                  class="w-100 rounded-4"
                  style="height:220px;object-fit:cover;border:1px solid var(--border);"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar py-3">
      <div class="container">
        <div class="row text-center g-2">
          <div class="col-6 col-md-3" v-for="s in [
            { n: '20+',  l: 'Products' },
            { n: '4',    l: 'Categories' },
            { n: 'Free', l: 'Shipping $50+' },
            { n: '90d',  l: 'Free Returns' }
          ]" :key="s.l">
            <div class="stat-number">{{ s.n }}</div>
            <div class="stat-label">{{ s.l }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="page-section">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h2 class="fw-bold mb-1">Featured Products</h2>
            <p class="mb-0" style="color:var(--text-muted);font-size:0.875rem;">Handpicked favourites for you</p>
          </div>
          <RouterLink to="/products" class="btn btn-outline-primary btn-sm">
            View All <i class="bi bi-arrow-right ms-1"></i>
          </RouterLink>
        </div>

        <div v-if="productStore.loading" class="loading-overlay">
          <div class="spinner-custom"></div>
        </div>
        <div v-else class="row g-4">
          <div v-for="product in featured" :key="product.id" class="col-12 col-sm-6 col-lg-3">
            <ProductCard :product="product" />
          </div>
        </div>
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="page-section" style="background:var(--bg-surface);border-top:1px solid var(--border);">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-12 col-md-6">
            <span class="section-tag mb-3 d-inline-block">Members Only</span>
            <h2 class="fw-bold mb-3">Exclusive deals<br><span style="color:var(--brand)">every single week.</span></h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">
              Sign up for personalised deals, new collection alerts, and flash sales — straight to your inbox.
            </p>
            <RouterLink v-if="!auth.isLoggedIn" to="/register" class="btn btn-primary mt-3">
              <i class="bi bi-envelope me-2"></i>Create Free Account
            </RouterLink>
            <RouterLink v-else to="/products" class="btn btn-primary mt-3">
              <i class="bi bi-lightning me-2"></i>Shop Today's Deals
            </RouterLink>
          </div>
          <div class="col-12 col-md-6">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80"
              alt="Shopping deals"
              class="w-100 rounded-4"
              style="max-height:260px;object-fit:cover;border:1px solid var(--border);"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
