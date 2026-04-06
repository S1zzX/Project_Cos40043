import { defineStore } from 'pinia'
import axios from 'axios'

const REVIEWS_KEY = 's1zz_reviews'
const LIKES_KEY = 's1zz_likes'
const CUSTOM_PRODUCTS_KEY = 's1zz_custom_products'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    loading: false,
    error: null
  }),
  getters: {
    allCategories: (state) => state.categories
  },
  actions: {
    _getReviews() {
      try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') } catch { return [] }
    },
    _saveReviews(r) { localStorage.setItem(REVIEWS_KEY, JSON.stringify(r)) },

    _getLikes() {
      try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}') } catch { return {} }
    },
    _saveLikes(l) { localStorage.setItem(LIKES_KEY, JSON.stringify(l)) },

    getCustomProducts() {
      try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]') } catch { return [] }
    },
    _saveCustomProducts(p) { localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(p)) },

    _mapDummyProduct(p) {
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category,
        description: p.description,
        image: p.thumbnail || (p.images && p.images[0]) || '',
        rating: { rate: p.rating, count: p.stock }
      }
    },

    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const [apiRes, catRes] = await Promise.all([
          axios.get('https://dummyjson.com/products?limit=0'),
          axios.get('https://dummyjson.com/products/categories')
        ])
        const custom = this.getCustomProducts()
        const mappedApiProducts = apiRes.data.products.map(this._mapDummyProduct)
        this.products = [...mappedApiProducts, ...custom]
        
        const activeCategories = new Set(this.products.map(p => p.category))
        const allFetchedCategories = catRes.data.map(c => typeof c === 'string' ? c : c.slug)
        
        // Filter out categories that are empty
        this.categories = allFetchedCategories.filter(c => activeCategories.has(c))
      } catch (e) {
        this.error = 'Failed to load products. Please try again.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      // Check custom products first
      const custom = this.getCustomProducts()
      const customFound = custom.find(p => p.id === id)
      if (customFound) return customFound
      try {
        const res = await axios.get(`https://dummyjson.com/products/${id}`)
        return this._mapDummyProduct(res.data)
      } catch {
        return null
      }
    },

    getProductReviews(productId) {
      return this._getReviews().filter(r => r.productId === productId)
    },

    addReview({ productId, userId, username, rating, comment }) {
      const reviews = this._getReviews()
      const review = {
        id: Date.now(),
        productId,
        userId,
        username,
        rating,
        comment,
        date: new Date().toLocaleDateString('en-AU')
      }
      reviews.push(review)
      this._saveReviews(reviews)
      return review
    },

    deleteReview(reviewId) {
      const reviews = this._getReviews().filter(r => r.id !== reviewId)
      this._saveReviews(reviews)
    },

    toggleLike(productId, userId) {
      const likes = this._getLikes()
      if (!likes[productId]) likes[productId] = []
      const idx = likes[productId].indexOf(userId)
      if (idx === -1) likes[productId].push(userId)
      else likes[productId].splice(idx, 1)
      this._saveLikes(likes)
      return likes[productId]
    },

    getLikeCount(productId) {
      const likes = this._getLikes()
      return (likes[productId] || []).length
    },

    isLikedByUser(productId, userId) {
      const likes = this._getLikes()
      return (likes[productId] || []).includes(userId)
    },

    createProduct(productData) {
      const custom = this.getCustomProducts()
      const newProduct = {
        ...productData,
        id: `custom_${Date.now()}`,
        isCustom: true,
        rating: { rate: 0, count: 0 }
      }
      custom.push(newProduct)
      this._saveCustomProducts(custom)
      this.products.push(newProduct)
      return newProduct
    },

    updateProduct(id, updates) {
      const custom = this.getCustomProducts()
      const idx = custom.findIndex(p => p.id === id)
      if (idx !== -1) {
        custom[idx] = { ...custom[idx], ...updates }
        this._saveCustomProducts(custom)
        const pIdx = this.products.findIndex(p => p.id === id)
        if (pIdx !== -1) this.products[pIdx] = custom[idx]
      }
    },

    deleteProduct(id) {
      const custom = this.getCustomProducts().filter(p => p.id !== id)
      this._saveCustomProducts(custom)
      this.products = this.products.filter(p => p.id !== id)
    }
  }
})
