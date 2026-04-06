<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'
import { useCartStore } from '../stores/cart.js'
import { useThemeStore } from '../stores/theme.js'

export default {
  computed: {
    ...mapStores(useAuthStore, useCartStore, useThemeStore),
    auth() { return this.authStore; },
    cart() { return this.cartStore; },
    theme() { return this.themeStore; }
  },
  methods: {
    logout() {
      this.auth.logout()
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
      <!-- Brand -->
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
        <i class="bi bi-bag-heart-fill"></i>S1zz
      </RouterLink>

      <!-- Mobile controls -->
      <div class="d-flex align-items-center gap-2 d-lg-none">
        <button class="theme-toggle" @click="theme.toggle()" :title="theme.theme === 'dark' ? 'Switch to light' : 'Switch to dark'">
          <i :class="theme.theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
        </button>
        <button class="navbar-toggler border-0 p-1" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false">
          <i class="bi bi-list fs-4" style="color:var(--text-secondary)"></i>
        </button>
      </div>

      <div class="collapse navbar-collapse" id="navMain">
        <!-- Left links -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/"><i class="bi bi-house me-1"></i>Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/products"><i class="bi bi-grid me-1"></i>Shop</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/news"><i class="bi bi-newspaper me-1"></i>News</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/about"><i class="bi bi-info-circle me-1"></i>About</RouterLink>
          </li>
          <li v-if="auth.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/dashboard"><i class="bi bi-speedometer2 me-1"></i>Dashboard</RouterLink>
          </li>
        </ul>

        <!-- Right controls -->
        <ul class="navbar-nav ms-auto align-items-lg-center gap-1">
          <!-- Theme toggle (desktop) -->
          <li class="nav-item d-none d-lg-block">
            <button class="theme-toggle" @click="theme.toggle()" :title="theme.theme === 'dark' ? 'Light mode' : 'Dark mode'">
              <i :class="theme.theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
            </button>
          </li>

          <template v-if="auth.isLoggedIn">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/wishlist" title="Wishlist">
                <i class="bi bi-heart fs-5"></i>
              </RouterLink>
            </li>
            <li v-if="!auth.isAdmin" class="nav-item position-relative">
              <RouterLink class="nav-link" to="/cart" title="Cart" v-badge="cart.totalItems">
                <i class="bi bi-cart3 fs-5"></i>
              </RouterLink>
            </li>

            <!-- User dropdown -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center gap-2 py-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="avatar-circle">{{ auth.currentUser?.firstName?.[0]?.toUpperCase() }}</div>
                <span class="d-none d-lg-inline fw-semibold" style="font-size:0.875rem;color:var(--text-primary)">
                  {{ auth.currentUser?.firstName }}
                </span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <span class="dropdown-item-text small" style="color:var(--text-muted)">{{ auth.currentUser?.email }}</span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <RouterLink class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i>My Profile
                  </RouterLink>
                </li>
                <li>
                  <button class="dropdown-item" style="color:var(--brand-danger)" @click="logout">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link fw-semibold" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="btn btn-primary btn-sm px-3" to="/register">Sign Up</RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
