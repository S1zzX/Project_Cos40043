<script>
import { mapStores } from 'pinia'
import { useProductsStore } from '../stores/products.js'
import ProductCard from '../components/ProductCard.vue'
import PaginationBar from '../components/PaginationBar.vue'

export default {
  components: {
    ProductCard,
    PaginationBar
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      maxPrice: 1000,
      sortBy: 'default',
      currentPage: 1,
      perPage: 12
    }
  },
  computed: {
    ...mapStores(useProductsStore),
    filtered() {
      let list = [...this.productsStore.products]

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase()
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        )
      }
      if (this.selectedCategory !== 'all') {
        list = list.filter(p => p.category === this.selectedCategory)
      }
      list = list.filter(p => p.price <= this.maxPrice)

      if (this.sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
      else if (this.sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
      else if (this.sortBy === 'rating') list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))

      return list
    },
    totalPages() {
      return Math.ceil(this.filtered.length / this.perPage)
    },
    paginated() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    }
  },
  watch: {
    searchQuery() { this.currentPage = 1 },
    selectedCategory() { this.currentPage = 1 },
    maxPrice() { this.currentPage = 1 },
    sortBy() { this.currentPage = 1 }
  },
  methods: {
    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = 'all'
      this.maxPrice = 1000
      this.sortBy = 'default'
    }
  },
  mounted() {
    document.title = 'Shop All Products | S1zz'
    if (this.productsStore.products.length === 0) this.productsStore.fetchProducts()
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <!-- Header -->
      <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 class="fw-bold mb-1">Shop <span style="color:var(--brand)">All Products</span></h1>
          <p class="text-muted-custom mb-0">{{ filtered.length }} products found</p>
        </div>
        <label for="sort-select" class="visually-hidden">Sort products by</label>
        <select id="sort-select" v-model="sortBy" class="form-select" style="width:auto;">
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div class="row g-4">
        <!-- Sidebar Filters -->
        <div class="col-12 col-lg-3">
          <div class="card p-4 sticky-top" style="top:80px">
            <h5 class="fw-bold mb-3"><i class="bi bi-funnel me-2 text-brand"></i>Filters</h5>

            <!-- Search -->
            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted-custom">Search</label>
              <input v-model="searchQuery" type="text" class="form-control form-control-sm" placeholder="Search products…" id="product-search">
            </div>

            <!-- Category -->
            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted-custom">Category</label>
              <div class="d-flex flex-column gap-2">
                <div class="form-check">
                  <input id="cat-all" v-model="selectedCategory" type="radio" class="form-check-input" value="all" name="category">
                  <label class="form-check-label" for="cat-all">All Categories</label>
                </div>
                <div v-for="cat in productsStore.categories" :key="cat" class="form-check">
                  <input :id="`cat-${cat}`" v-model="selectedCategory" type="radio" class="form-check-input" :value="cat" name="category">
                  <label class="form-check-label text-capitalize" :for="`cat-${cat}`">{{ cat }}</label>
                </div>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-4">
              <label class="form-label small fw-semibold text-muted-custom">
                Max Price: <span style="color:var(--brand);font-weight:600">${{ maxPrice }}</span>
              </label>
              <input v-model="maxPrice" type="range" class="form-range" min="10" max="1000" step="10" id="price-range">
              <div class="d-flex justify-content-between small text-muted-custom">
                <span>$10</span><span>$1000</span>
              </div>
            </div>

            <button class="btn btn-outline-secondary btn-sm w-100" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Reset Filters
            </button>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="col-12 col-lg-9">
          <div v-if="productsStore.loading" class="loading-overlay">
            <div class="spinner-custom"></div>
          </div>
          <div v-else-if="productsStore.error" class="alert alert-danger">{{ productsStore.error }}</div>
          <div v-else-if="paginated.length === 0" class="text-center py-5">
            <i class="bi bi-search fs-1" style="color:var(--text-muted)"></i>
            <p class="mt-3 text-muted-custom">No products match your filters.</p>
            <button class="btn btn-outline-primary mt-2" @click="resetFilters">Reset Filters</button>
          </div>
          <div v-else class="row g-4">
            <div v-for="product in paginated" :key="product.id" class="col-12 col-sm-6 col-xl-4 animate-up">
              <ProductCard :product="product" />
            </div>
          </div>
          <div class="mt-5">
            <PaginationBar :current-page="currentPage" :total-pages="totalPages" @page-change="p => currentPage = p" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
