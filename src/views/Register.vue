<script>
import { mapStores } from 'pinia'
import { useAuthStore } from '../stores/auth.js'

export default {
  data() {
    return {
      form: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
      errors: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
      globalError: '',
      loading: false,
      strengthLabel: ['', 'Weak', 'Fair', 'Good', 'Strong'],
      strengthColor: ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']
    }
  },
  computed: {
    ...mapStores(useAuthStore),
    auth() { return this.authStore; }
  },
  methods: {
    strengthScore(p) {
      let s = 0
      if (p.length >= 8) s++
      if (/[A-Z]/.test(p)) s++
      if (/[0-9]/.test(p)) s++
      if (/[^A-Za-z0-9]/.test(p)) s++
      return s
    },
    validate() {
      Object.keys(this.errors).forEach(k => this.errors[k] = '')
      let ok = true
      if (!this.form.firstName.trim()) { this.errors.firstName = 'First name is required.'; ok = false }
      if (!this.form.lastName.trim()) { this.errors.lastName = 'Last name is required.'; ok = false }
      if (!this.form.email) { this.errors.email = 'Email is required.'; ok = false }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) { this.errors.email = 'Enter a valid email.'; ok = false }
      if (!this.form.password) { this.errors.password = 'Password is required.'; ok = false }
      else if (this.form.password.length < 8) { this.errors.password = 'Min. 8 characters.'; ok = false }
      else if (!/[A-Z]/.test(this.form.password)) { this.errors.password = 'At least one uppercase letter.'; ok = false }
      if (!this.form.confirmPassword) { this.errors.confirmPassword = 'Please confirm your password.'; ok = false }
      else if (this.form.password !== this.form.confirmPassword) { this.errors.confirmPassword = 'Passwords do not match.'; ok = false }
      return ok
    },
    async handleRegister() {
      if (!this.validate()) return
      this.loading = true
      this.globalError = ''
      await this.auth.initUsers()
      await new Promise(r => setTimeout(r, 350))
      const result = this.auth.register({
        firstName: this.form.firstName.trim(),
        lastName: this.form.lastName.trim(),
        email: this.form.email,
        password: this.form.password
      })
      if (result.success) this.$router.push('/')
      else this.globalError = result.error
      this.loading = false
    }
  }
}
</script>

<template>
  <div class="page-section d-flex align-items-center" style="min-height:82vh;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-7 col-lg-5">
          <div class="card glow-card p-4 p-md-5">
            <div class="text-center mb-4">
              <div class="brand-icon mb-3"><i class="bi bi-person-plus-fill"></i></div>
              <h1 class="h4 fw-bold mb-1">Create your account</h1>
              <p class="small mb-0" style="color:var(--text-muted)">Join S1zz for free today</p>
            </div>

            <div v-if="globalError" class="alert alert-danger py-2 small">{{ globalError }}</div>

            <form @submit.prevent="handleRegister" novalidate aria-label="Registration form">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label" for="reg-fn">First Name</label>
                  <input id="reg-fn" v-model="form.firstName" type="text"
                    class="form-control" :class="{'is-invalid':errors.firstName}"
                    placeholder="Jane" v-focus />
                  <div class="invalid-feedback">{{ errors.firstName }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="reg-ln">Last Name</label>
                  <input id="reg-ln" v-model="form.lastName" type="text"
                    class="form-control" :class="{'is-invalid':errors.lastName}"
                    placeholder="Doe" />
                  <div class="invalid-feedback">{{ errors.lastName }}</div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="reg-email">Email Address</label>
                <input id="reg-email" v-model="form.email" type="email"
                  class="form-control" :class="{'is-invalid':errors.email}"
                  placeholder="you@example.com" autocomplete="email" />
                <div class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="reg-pw">Password</label>
                <input id="reg-pw" v-model="form.password" type="password"
                  class="form-control" :class="{'is-invalid':errors.password}"
                  placeholder="Min. 8 chars with uppercase" autocomplete="new-password" />
                <div class="invalid-feedback">{{ errors.password }}</div>
                <!-- Strength bar -->
                <div v-if="form.password" class="mt-2">
                  <div class="d-flex gap-1 mb-1">
                    <div v-for="n in 4" :key="n" class="flex-grow-1 rounded-pill"
                      style="height:3px;transition:background 0.3s"
                      :style="{ background: n <= strengthScore(form.password) ? strengthColor[strengthScore(form.password)] : 'var(--border)' }">
                    </div>
                  </div>
                  <small :style="{ color: strengthColor[strengthScore(form.password)] }">
                    {{ strengthLabel[strengthScore(form.password)] }}
                  </small>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="reg-cpw">Confirm Password</label>
                <input id="reg-cpw" v-model="form.confirmPassword" type="password"
                  class="form-control" :class="{'is-invalid':errors.confirmPassword}"
                  placeholder="Repeat password" autocomplete="new-password" />
                <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-person-check me-2"></i>
                {{ loading ? 'Creating Account…' : 'Create Account' }}
              </button>
            </form>

            <hr style="border-color:var(--border)">
            <p class="text-center small mb-0" style="color:var(--text-muted)">
              Already have an account?
              <RouterLink to="/login" class="fw-semibold text-brand">Sign In</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
