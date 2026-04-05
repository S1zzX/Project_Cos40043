<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const router = useRouter()
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const globalError = ref('')
const loading = ref(false)

function validate() {
  let ok = true
  errors.email = !form.email ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email.' : ''
  errors.password = !form.password ? 'Password is required.' : form.password.length < 6 ? 'Min. 6 characters.' : ''
  if (errors.email || errors.password) ok = false
  return ok
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  globalError.value = ''
  await new Promise(r => setTimeout(r, 350))
  const result = auth.login(form.email, form.password)
  if (result.success) router.push('/')
  else globalError.value = result.error
  loading.value = false
}
</script>

<template>
  <div class="page-section d-flex align-items-center" style="min-height:82vh;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-9 col-md-6 col-lg-5 col-xl-4">
          <div class="card glow-card p-4 p-md-5">
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="brand-icon mb-3"><i class="bi bi-bag-heart-fill"></i></div>
              <h1 class="h4 fw-bold mb-1">Welcome back</h1>
              <p class="small mb-0" style="color:var(--text-muted)">Sign in to your S1zz account</p>
            </div>

            <!-- Demo hint -->
            <div class="alert alert-info small mb-4 py-2">
              <i class="bi bi-info-circle me-1"></i>
              <strong>Demo:</strong> admin@s1zz.com / admin123
            </div>

            <div v-if="globalError" class="alert alert-danger py-2 small">{{ globalError }}</div>

            <form @submit.prevent="handleLogin" novalidate aria-label="Login form">
              <div class="mb-3">
                <label class="form-label" for="login-email">Email Address</label>
                <input id="login-email" v-model="form.email" type="email"
                  class="form-control" :class="{ 'is-invalid': errors.email }"
                  placeholder="you@example.com" autocomplete="email" v-focus />
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="login-password">Password</label>
                <input id="login-password" v-model="form.password" type="password"
                  class="form-control" :class="{ 'is-invalid': errors.password }"
                  placeholder="Enter your password" autocomplete="current-password" />
                <div class="invalid-feedback">{{ errors.password }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ loading ? 'Signing in…' : 'Sign In' }}
              </button>
            </form>

            <hr style="border-color:var(--border)">
            <p class="text-center small mb-0" style="color:var(--text-muted)">
              No account?
              <RouterLink to="/register" class="fw-semibold text-brand">Create one free</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
