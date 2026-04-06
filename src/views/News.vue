<script>
import PaginationBar from '../components/PaginationBar.vue'

export default {
  components: {
    PaginationBar
  },
  data() {
    return {
      allNews: [],
      searchQuery: '',
      currentPage: 1,
      perPage: 6,
      loading: true,
      expandedId: null,
      selectedCategory: 'All'
    }
  },
  computed: {
    categories() {
      return ['All', ...new Set(this.allNews.map(n => n.category))]
    },
    filtered() {
      const q = this.searchQuery.toLowerCase().trim()
      let list = this.allNews
      if (this.selectedCategory !== 'All') list = list.filter(n => n.category === this.selectedCategory)
      if (q) list = list.filter(n =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) || n.date.toLowerCase().includes(q)
      )
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
  methods: {
    async loadNews() {
      try {
        const res = await fetch('/data/news.json')
        this.allNews = await res.json()
      } catch (e) {
        console.error('Failed to load news:', e)
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.currentPage = 1
    },
    selectCategory(cat) {
      this.selectedCategory = cat
      this.currentPage = 1
    },
    catBadgeStyle(cat) {
      const map = {
        'Electronics': { background:'rgba(79,70,229,0.12)', color:'var(--brand)' },
        'Fashion':     { background:'rgba(239,68,68,0.12)', color:'var(--brand-danger)' },
        'Jewellery':   { background:'rgba(245,158,11,0.12)', color:'var(--brand-accent)' },
        'Promotions':  { background:'rgba(16,185,129,0.12)', color:'var(--brand-success)' },
        'Technology':  { background:'rgba(59,130,246,0.12)', color:'#3b82f6' },
        'Company News':{ background:'rgba(107,114,128,0.12)', color:'var(--text-secondary)' }
      }
      return map[cat] || { background:'rgba(107,114,128,0.12)', color:'var(--text-secondary)' }
    }
  },
  mounted() {
    this.loadNews()
    document.title = 'News | S1zz'
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5">
        <span class="section-tag mb-3 d-inline-block">S1zz Journal</span>
        <h1 class="fw-bold mb-2">Latest <span style="color:var(--brand)">News</span></h1>
        <p class="mb-0" style="color:var(--text-muted);max-width:480px;margin:0 auto;font-size:0.9rem;">
          Stay up to date with deals, collections, and company highlights.
        </p>
      </div>

      <!-- Search & Filter -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-7">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input v-model="searchQuery" @input="onSearch" type="text" class="form-control"
              placeholder="Search by title, date, category, or content…" id="news-search" />
            <button v-if="searchQuery" class="btn btn-outline-secondary" @click="searchQuery='';onSearch()">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        <div class="col-12 col-md-5">
          <div class="d-flex gap-2 flex-wrap">
            <button v-for="cat in categories" :key="cat"
              class="btn btn-sm"
              :class="selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'"
              @click="selectCategory(cat)">{{ cat }}</button>
          </div>
        </div>
      </div>

      <p class="small mb-3" style="color:var(--text-muted)">
        Showing {{ paginated.length }} of {{ filtered.length }} articles
      </p>

      <!-- Loading -->
      <div v-if="loading" class="loading-overlay"><div class="spinner-custom"></div></div>

      <!-- No results -->
      <div v-else-if="paginated.length === 0" class="text-center py-5">
        <i class="bi bi-newspaper fs-1" style="color:var(--text-muted)"></i>
        <p class="mt-3 mb-3" style="color:var(--text-muted)">No articles found.</p>
        <button class="btn btn-outline-primary btn-sm" @click="searchQuery='';selectedCategory='All'">Clear filters</button>
      </div>

      <!-- News Grid -->
      <div v-else class="row g-4">
        <div v-for="item in paginated" :key="item.id" class="col-12 col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body d-flex flex-column p-4">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
                <span class="badge fw-semibold" :style="catBadgeStyle(item.category)">{{ item.category }}</span>
                <span class="small" style="color:var(--text-muted)">
                  <i class="bi bi-calendar3 me-1"></i>{{ item.date }}
                </span>
              </div>
              <h5 class="news-title mb-2">{{ item.title }}</h5>
              <p class="news-excerpt flex-grow-1">{{ item.content.slice(0, 130) }}…</p>
              <div class="mt-3 pt-3" style="border-top:1px solid var(--border)">
                <button class="btn btn-outline-primary btn-sm w-100"
                  @click="expandedId = expandedId === item.id ? null : item.id">
                  <i class="bi bi-book me-1"></i>
                  {{ expandedId === item.id ? 'Collapse' : 'Read More' }}
                </button>
              </div>
            </div>
            <transition name="slide">
              <div v-if="expandedId === item.id" class="px-4 pb-4">
                <p class="news-excerpt mb-0">{{ item.content }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-5">
        <PaginationBar :current-page="currentPage" :total-pages="totalPages" @page-change="p => currentPage = p" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
.slide-enter-to, .slide-leave-from { max-height: 600px; opacity: 1; }
</style>
