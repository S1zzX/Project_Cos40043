<script>
import { mapStores } from 'pinia'
import { useOrdersStore } from '../stores/orders.js'

export default {
  computed: {
    ...mapStores(useOrdersStore),
    hasOrders() {
      return this.ordersStore.orders && this.ordersStore.orders.length > 0
    }
  },
  methods: {
    formatDate(isoString) {
      return new Date(isoString).toLocaleDateString('en-AU', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    }
  },
  mounted() {
    document.title = 'Order History | S1zz'
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">
      <h1 class="fw-bold mb-4" style="text-align: left;"><i class="bi bi-clock-history me-2 text-brand"></i>Order History</h1>

      <div v-if="!hasOrders" class="text-center py-5">
        <i class="bi bi-box-seam" style="font-size:4rem;color:var(--text-muted)"></i>
        <h4 class="mt-3 fw-bold">No orders yet</h4>
        <p class="text-muted-custom">You haven't placed any orders.</p>
        <RouterLink to="/products" class="btn btn-primary mt-2">
          <i class="bi bi-grid me-2"></i>Start Shopping
        </RouterLink>
      </div>

      <div v-else class="row g-4">
        <div class="col-12 col-lg-8 mx-auto">
          <div v-for="order in ordersStore.orders" :key="order.id" class="card p-4 mb-4 order-card">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <div class="mb-2 mb-md-0">
                <h5 class="fw-bold mb-1">Order {{ order.id }}</h5>
                <span class="text-muted-custom small">{{ formatDate(order.date) }}</span>
              </div>
              <div class="text-md-end text-start">
                <span class="badge bg-success mb-1" style="font-size: 0.8rem; padding: 0.35em 0.65em;">Completed</span>
                <div class="fw-bold fs-5" style="color:var(--brand)">${{ order.total.toFixed(2) }}</div>
              </div>
            </div>

            <div class="order-items-container p-3 rounded-3">
              <h6 class="fw-bold mb-3 small text-muted-custom text-uppercase">Items Purchased</h6>
              <div
                v-for="item in order.items"
                :key="item.id"
                class="d-flex align-items-center gap-3 mb-2"
                style="padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);"
              >
                <img :src="item.image" :alt="item.title" style="width:55px;height:55px;object-fit:contain;background:rgba(255,255,255,0.05);border-radius:8px;padding:4px;flex-shrink:0;" />
                <div class="flex-grow-1 min-w-0">
                  <RouterLink :to="`/products/${item.id}`" class="d-block fw-semibold" style="color:var(--brand-text);text-decoration:none;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    {{ item.title }}
                  </RouterLink>
                  <div class="text-muted-custom small mt-1">Qty: {{ item.quantity }} &nbsp;|&nbsp; ${{ item.price.toFixed(2) }} each</div>
                </div>
                <div class="fw-bold text-end flex-shrink-0" style="min-width:60px; font-size: 0.95rem;">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
            
            <div class="mt-3 text-end">
               <RouterLink to="/products" class="btn btn-sm btn-outline-primary">Buy Again</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  transition: border-color var(--transition);
}
.order-card:hover {
  border-color: rgba(108,63,255,0.4);
}
.order-items-container {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
}
.order-items-container > div:last-child {
  border-bottom: none !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}
</style>
