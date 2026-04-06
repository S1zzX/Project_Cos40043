<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import { useProductsStore } from '../stores/products.js'

export default {
  data() {
    return {
      customProducts: [],
      showForm: false,
      editingId: null,
      successMsg: '',
      form: { title: '', price: '', category: '', description: '', image: '' },
      errors: { title: '', price: '', category: '', description: '' }
    }
  },
  computed: {
    ...mapStores(useAuthStore, useProductsStore),
    categories() {
      return this.productsStore.categories.length ? this.productsStore.categories : ['electronics', "men's clothing", "women's clothing", 'jewelery']
    }
  },
  methods: {
    emptyForm() {
      return { title: '', price: '', category: '', description: '', image: '' }
    },
    validate() {
      let valid = true
      this.errors.title = this.form.title.trim() ? '' : 'Title is required.'
      this.errors.price = (!this.form.price || isNaN(this.form.price) || this.form.price <= 0) ? 'Enter a valid price.' : ''
      this.errors.category = this.form.category.trim() ? '' : 'Category is required.'
      this.errors.description = this.form.description.trim() ? '' : 'Description is required.'
      return !Object.values(this.errors).some(e => e)
    },
    startCreate() {
      Object.assign(this.form, this.emptyForm())
      this.editingId = null
      this.showForm = true
    },
    startEdit(product) {
      Object.assign(this.form, {
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image || ''
      })
      this.editingId = product.id
      this.showForm = true
    },
    saveProduct() {
      if (!this.validate()) return
      const data = {
        title: this.form.title.trim(),
        price: parseFloat(this.form.price),
        category: this.form.category.trim(),
        description: this.form.description.trim(),
        image: this.form.image.trim() || 'https://via.placeholder.com/300x300?text=S1zz'
      }
      if (this.editingId) {
        this.productsStore.updateProduct(this.editingId, data)
        this.successMsg = 'Product updated successfully!'
      } else {
        this.productsStore.createProduct(data)
        this.successMsg = 'Product created successfully!'
      }
      this.customProducts = this.productsStore.getCustomProducts()
      this.showForm = false
      this.editingId = null
      setTimeout(() => this.successMsg = '', 3000)
    },
    deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productsStore.deleteProduct(id)
        this.customProducts = this.productsStore.getCustomProducts()
        this.successMsg = 'Product deleted.'
        setTimeout(() => this.successMsg = '', 3000)
      }
    }
  },
  mounted() {
    this.customProducts = this.productsStore.getCustomProducts()
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <!-- Admin header -->
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 class="fw-bold mb-1">
            <i class="bi bi-speedometer2 me-2 text-brand"></i>Admin Dashboard
          </h1>
          <p class="text-muted-custom mb-0">Manage your custom product listings</p>
        </div>
        <button class="btn btn-primary" @click="startCreate">
          <i class="bi bi-plus-circle me-2"></i>New Product
        </button>
      </div>

      <!-- Success message -->
      <transition name="fade">
        <div v-if="successMsg" class="alert alert-success mb-4">{{ successMsg }}</div>
      </transition>

      <!-- Product Form -->
      <div v-if="showForm" class="card p-4 mb-5 glow-card">
        <h5 class="fw-bold mb-4">{{ editingId ? 'Edit Product' : 'Create New Product' }}</h5>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label" for="dash-title">Title *</label>
            <input id="dash-title" v-model="form.title" type="text" class="form-control" :class="{'is-invalid': errors.title}" placeholder="Product name" />
            <div class="invalid-feedback">{{ errors.title }}</div>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="dash-price">Price (USD) *</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input id="dash-price" v-model="form.price" type="number" step="0.01" class="form-control" :class="{'is-invalid': errors.price}" placeholder="29.99" />
              <div class="invalid-feedback">{{ errors.price }}</div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="dash-category">Category *</label>
            <select id="dash-category" v-model="form.category" class="form-select" :class="{'is-invalid': errors.category}">
              <option value="">Select category…</option>
              <option v-for="cat in categories" :key="cat" :value="cat" class="text-capitalize">{{ cat }}</option>
              <option value="custom">Custom</option>
            </select>
            <div class="invalid-feedback">{{ errors.category }}</div>
          </div>
          <div class="col-12">
            <label class="form-label" for="dash-desc">Description *</label>
            <textarea id="dash-desc" v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" rows="3" placeholder="Product description…"></textarea>
            <div class="invalid-feedback">{{ errors.description }}</div>
          </div>
          <div class="col-12">
            <label class="form-label" for="dash-image">Image URL (optional)</label>
            <input id="dash-image" v-model="form.image" type="url" class="form-control" placeholder="https://example.com/image.jpg" />
          </div>
          <div class="col-12 d-flex gap-3">
            <button class="btn btn-primary" @click="saveProduct">
              <i class="bi bi-check-circle me-2"></i>{{ editingId ? 'Save Changes' : 'Create Product' }}
            </button>
            <button class="btn btn-outline-secondary" @click="showForm = false; editingId = null">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Products Table -->
      <div class="card">
        <div class="card-body">
          <h5 class="fw-bold mb-3">Custom Listings ({{ customProducts.length }})</h5>
          <div v-if="customProducts.length === 0" class="text-center py-4 text-muted-custom">
            <i class="bi bi-box-seam fs-1 d-block mb-2"></i>
            No custom products yet. Click "New Product" to create one.
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle" aria-label="Custom products table">
              <thead>
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col" class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in customProducts" :key="p.id">
                  <td><img :src="p.image" :alt="p.title" style="width:50px;height:50px;object-fit:contain;background:rgba(255,255,255,0.05);border-radius:6px;padding:3px;" /></td>
                  <td class="fw-semibold" style="max-width:250px">
                    <span class="d-inline-block text-truncate" style="max-width:220px">{{ p.title }}</span>
                  </td>
                  <td><span class="badge text-capitalize" style="background:rgba(108,63,255,0.2);color:#9b7bff">{{ p.category }}</span></td>
                  <td class="fw-bold" style="color:var(--brand)">${{ parseFloat(p.price).toFixed(2) }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="startEdit(p)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(p.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="row g-4 mt-3">
        <div class="col-6 col-md-3" v-for="stat in [
          { icon: 'bi-box-seam', label: 'Custom Products', value: customProducts.length, color: 'var(--brand)' },
          { icon: 'bi-people', label: 'Registered Users', value: '2+', color: 'var(--brand-success)' },
          { icon: 'bi-star', label: 'Total Reviews', value: 'Live', color: 'var(--brand-accent)' },
          { icon: 'bi-shield-check', label: 'Admin Role', value: authStore.userName, color: 'var(--brand-danger)' }
        ]" :key="stat.label">
          <div class="card p-3 text-center">
            <i :class="stat.icon" style="font-size:1.5rem;" :style="{color: stat.color}"></i>
            <div class="fw-bold mt-2" :style="{color: stat.color}">{{ stat.value }}</div>
            <div class="small text-muted-custom">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-invalid { border-color: var(--brand-danger) !important; }
.invalid-feedback { display: block; color: var(--brand-danger); font-size: 0.82rem; margin-top: 4px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
