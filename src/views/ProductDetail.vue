<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'
import { useWishlistStore } from '../stores/wishlist.js'
import { useProductsStore } from '../stores/products.js'
import ReviewCard from '../components/ReviewCard.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const productStore = useProductsStore()

const product = ref(null)
const loading = ref(true)
const reviews = ref([])
const qty = ref(1)
const addedToCart = ref(false)

// Review form
const reviewForm = ref({ rating: 5, comment: '' })
const reviewError = ref('')
const reviewSuccess = ref(false)
const isEditMode = ref(false)
const editingProduct = ref({})

const isWishlisted = computed(() => product.value && wishlist.isInWishlist(product.value.id))
const likeCount = computed(() => product.value ? productStore.getLikeCount(product.value.id) : 0)
const isLiked = computed(() => product.value && auth.isLoggedIn && productStore.isLikedByUser(product.value.id, auth.currentUser?.id))

const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
const avgRating = computed(() => {
  if (!reviews.value.length) return product.value?.rating?.rate || 0
  return reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length
})

async function loadProduct() {
  loading.value = true
  const id = isNaN(route.params.id) ? route.params.id : Number(route.params.id)
  product.value = await productStore.fetchProductById(id)
  reviews.value = productStore.getProductReviews(id)
  loading.value = false
  if (product.value) {
    editingProduct.value = { ...product.value }
    document.title = `${product.value.title} | S1zz`
  }
}

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)

function addToCart() {
  cart.addToCart(product.value, qty.value)
  addedToCart.value = true
  setTimeout(() => addedToCart.value = false, 2000)
}

function toggleLike() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  productStore.toggleLike(product.value.id, auth.currentUser.id)
}

function toggleWishlist() {
  if (!auth.isLoggedIn) { router.push('/login'); return }
  wishlist.toggleWishlist(product.value)
}

function submitReview() {
  reviewError.value = ''
  if (!reviewForm.value.comment.trim()) {
    reviewError.value = 'Please enter a review comment.'
    return
  }
  productStore.addReview({
    productId: product.value.id,
    userId: auth.currentUser.id,
    username: auth.userName,
    rating: reviewForm.value.rating,
    comment: reviewForm.value.comment
  })
  reviews.value = productStore.getProductReviews(product.value.id)
  reviewForm.value = { rating: 5, comment: '' }
  reviewSuccess.value = true
  setTimeout(() => reviewSuccess.value = false, 3000)
}

function deleteReview(reviewId) {
  productStore.deleteReview(reviewId)
  reviews.value = productStore.getProductReviews(product.value.id)
}

function saveEdit() {
  productStore.updateProduct(product.value.id, editingProduct.value)
  product.value = { ...editingProduct.value }
  isEditMode.value = false
}

function deleteProduct() {
  if (confirm('Delete this product? This cannot be undone.')) {
    productStore.deleteProduct(product.value.id)
    router.push('/products')
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <!-- Back button -->
      <button class="btn btn-outline-secondary btn-sm mb-4" @click="router.back()">
        <i class="bi bi-arrow-left me-1"></i>Back
      </button>

      <div v-if="loading" class="loading-overlay"><div class="spinner-custom"></div></div>

      <div v-else-if="!product" class="text-center py-5">
        <i class="bi bi-exclamation-circle fs-1 text-brand"></i>
        <p class="mt-3 text-muted-custom">Product not found.</p>
      </div>

      <template v-else>
        <!-- Admin Edit Modal -->
        <div v-if="auth.isAdmin && product.isCustom" class="alert alert-info d-flex align-items-center gap-3 mb-4 flex-wrap">
          <span class="fw-semibold"><i class="bi bi-shield-check me-1"></i>Admin Controls</span>
          <button class="btn btn-sm btn-outline-primary" @click="isEditMode = !isEditMode">
            <i class="bi bi-pencil me-1"></i>{{ isEditMode ? 'Cancel Edit' : 'Edit Product' }}
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="deleteProduct">
            <i class="bi bi-trash me-1"></i>Delete
          </button>
        </div>

        <!-- Edit Form -->
        <div v-if="isEditMode" class="card p-4 mb-5">
          <h5 class="fw-bold mb-3">Edit Product</h5>
          <div class="row g-3">
            <div class="col-12"><label class="form-label">Title</label><input v-model="editingProduct.title" class="form-control"></div>
            <div class="col-md-6"><label class="form-label">Price</label><input v-model.number="editingProduct.price" type="number" class="form-control"></div>
            <div class="col-md-6"><label class="form-label">Category</label><input v-model="editingProduct.category" class="form-control"></div>
            <div class="col-12"><label class="form-label">Description</label><textarea v-model="editingProduct.description" class="form-control" rows="3"></textarea></div>
            <div class="col-12"><label class="form-label">Image URL</label><input v-model="editingProduct.image" class="form-control"></div>
            <div class="col-12"><button class="btn btn-primary" @click="saveEdit"><i class="bi bi-check me-1"></i>Save Changes</button></div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="row g-5">
          <!-- Image -->
          <div class="col-12 col-md-5">
            <div class="card p-4 text-center">
              <img :src="product.image" :alt="product.title" class="product-img-lg w-100" style="max-height:380px;object-fit:contain;" />
            </div>
          </div>

          <!-- Info -->
          <div class="col-12 col-md-7">
            <span class="badge mb-2 text-capitalize" style="background:rgba(108,63,255,0.2);color:#9b7bff;font-size:0.8rem;">{{ product.category }}</span>
            <h1 class="h3 fw-bold mb-2">{{ product.title }}</h1>
            <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
              <span class="stars">{{ stars(avgRating) }}</span>
              <span class="text-muted-custom small">{{ avgRating.toFixed(1) }} ({{ reviews.length + (product.rating?.count || 0) }} reviews)</span>
            </div>
            <div class="h2 fw-bold mb-3" style="color:var(--brand)">${{ product.price?.toFixed(2) }}</div>
            <p class="text-muted-custom mb-4" style="line-height:1.7">{{ product.description }}</p>

            <!-- Actions -->
            <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
              <div class="input-group" style="width:130px">
                <button class="btn btn-outline-secondary" @click="qty > 1 && qty--">-</button>
                <input v-model.number="qty" type="number" min="1" class="form-control text-center" style="width:50px">
                <button class="btn btn-outline-secondary" @click="qty++">+</button>
              </div>
              <button class="btn btn-primary flex-grow-1" @click="addToCart">
                <i class="bi bi-cart-plus me-2"></i>{{ addedToCart ? '✓ Added!' : 'Add to Cart' }}
              </button>
            </div>
            <div class="d-flex gap-3">
              <button class="btn w-100" :class="isWishlisted ? 'btn-danger' : 'btn-outline-danger'" @click="toggleWishlist">
                <i :class="isWishlisted ? 'bi bi-heart-fill' : 'bi bi-heart'" class="me-2"></i>
                {{ isWishlisted ? 'In Wishlist' : 'Add to Wishlist' }}
              </button>
              <button class="btn w-100" :class="isLiked ? 'btn-outline-danger' : 'btn-outline-secondary'" @click="toggleLike">
                <i :class="isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'" class="me-2"></i>Like ({{ likeCount }})
              </button>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="mt-5 pt-4" style="border-top:1px solid var(--border)">
          <h2 class="h4 fw-bold mb-4">Customer Reviews</h2>
          <div v-if="reviews.length === 0" class="text-muted-custom small mb-4">No reviews yet. Be the first!</div>
          <div v-else>
            <div v-for="review in reviews" :key="review.id" class="position-relative">
              <ReviewCard :review="review" />
              <button
                v-if="auth.isAdmin || (auth.currentUser && auth.currentUser.id === review.userId)"
                class="btn btn-sm btn-outline-danger position-absolute"
                style="top:0.5rem;right:0.5rem;"
                @click="deleteReview(review.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <!-- Review Form -->
          <div v-if="auth.isLoggedIn" class="card p-4 mt-4">
            <h5 class="fw-bold mb-3">Write a Review</h5>
            <div class="mb-3">
              <label class="form-label">Your Rating</label>
              <div class="d-flex gap-2">
                <button
                  v-for="n in 5" :key="n"
                  class="btn btn-sm"
                  :style="{ color: n <= reviewForm.rating ? 'var(--brand-accent)' : 'var(--text-muted)' }"
                  @click="reviewForm.rating = n"
                  style="font-size:1.4rem;background:none;border:none;padding:0;"
                >★</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="review-comment">Your Comment</label>
              <textarea id="review-comment" v-model="reviewForm.comment" class="form-control" rows="3" placeholder="Share your experience…"></textarea>
            </div>
            <div v-if="reviewError" class="alert alert-danger py-2">{{ reviewError }}</div>
            <div v-if="reviewSuccess" class="alert alert-success py-2">Review submitted!</div>
            <button class="btn btn-primary" @click="submitReview">
              <i class="bi bi-send me-2"></i>Submit Review
            </button>
          </div>
          <div v-else class="alert alert-info mt-4">
            <RouterLink to="/login">Login</RouterLink> to write a review.
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
