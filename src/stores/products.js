import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const REVIEWS_KEY = 's1zz_reviews'
const LIKES_KEY = 's1zz_likes'
const CUSTOM_PRODUCTS_KEY = 's1zz_custom_products'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  function getReviews() {
    try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]') } catch { return [] }
  }
  function saveReviews(r) { localStorage.setItem(REVIEWS_KEY, JSON.stringify(r)) }

  function getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '{}') } catch { return {} }
  }
  function saveLikes(l) { localStorage.setItem(LIKES_KEY, JSON.stringify(l)) }

  function getCustomProducts() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]') } catch { return [] }
  }
  function saveCustomProducts(p) { localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(p)) }

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      const [apiRes, catRes] = await Promise.all([
        axios.get('https://fakestoreapi.com/products'),
        axios.get('https://fakestoreapi.com/products/categories')
      ])
      const custom = getCustomProducts()
      products.value = [...apiRes.data, ...custom]
      categories.value = catRes.data
    } catch (e) {
      error.value = 'Failed to load products. Please try again.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id) {
    // Check custom products first
    const custom = getCustomProducts()
    const customFound = custom.find(p => p.id === id)
    if (customFound) return customFound
    try {
      const res = await axios.get(`https://fakestoreapi.com/products/${id}`)
      return res.data
    } catch {
      return null
    }
  }

  function getProductReviews(productId) {
    return getReviews().filter(r => r.productId === productId)
  }

  function addReview({ productId, userId, username, rating, comment }) {
    const reviews = getReviews()
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
    saveReviews(reviews)
    return review
  }

  function deleteReview(reviewId) {
    const reviews = getReviews().filter(r => r.id !== reviewId)
    saveReviews(reviews)
  }

  function toggleLike(productId, userId) {
    const likes = getLikes()
    if (!likes[productId]) likes[productId] = []
    const idx = likes[productId].indexOf(userId)
    if (idx === -1) likes[productId].push(userId)
    else likes[productId].splice(idx, 1)
    saveLikes(likes)
    return likes[productId]
  }

  function getLikeCount(productId) {
    const likes = getLikes()
    return (likes[productId] || []).length
  }

  function isLikedByUser(productId, userId) {
    const likes = getLikes()
    return (likes[productId] || []).includes(userId)
  }

  // Admin CRUD for custom products
  function createProduct(productData) {
    const custom = getCustomProducts()
    const newProduct = {
      ...productData,
      id: `custom_${Date.now()}`,
      isCustom: true,
      rating: { rate: 0, count: 0 }
    }
    custom.push(newProduct)
    saveCustomProducts(custom)
    products.value.push(newProduct)
    return newProduct
  }

  function updateProduct(id, updates) {
    const custom = getCustomProducts()
    const idx = custom.findIndex(p => p.id === id)
    if (idx !== -1) {
      custom[idx] = { ...custom[idx], ...updates }
      saveCustomProducts(custom)
      const pIdx = products.value.findIndex(p => p.id === id)
      if (pIdx !== -1) products.value[pIdx] = custom[idx]
    }
  }

  function deleteProduct(id) {
    const custom = getCustomProducts().filter(p => p.id !== id)
    saveCustomProducts(custom)
    products.value = products.value.filter(p => p.id !== id)
  }

  const allCategories = computed(() => categories.value)

  return {
    products, categories, loading, error,
    fetchProducts, fetchProductById,
    getProductReviews, addReview, deleteReview,
    toggleLike, getLikeCount, isLikedByUser,
    createProduct, updateProduct, deleteProduct,
    getCustomProducts, allCategories
  }
})
