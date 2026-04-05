<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

onMounted(() => {
  document.title = 'Page Not Found | S1zz'
})
</script>

<template>
  <div class="page-section">
    <div class="container text-center py-5">
      <h1 class="fw-bold" style="font-size: 6rem; color: var(--brand)">404</h1>
      <h2 class="mb-3">Oops! Page not found</h2>
      <p class="text-muted-custom mb-5">The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/" class="btn btn-primary">
        <i class="bi bi-house me-2"></i>Return Home
      </RouterLink>
    </div>
  </div>
</template>
