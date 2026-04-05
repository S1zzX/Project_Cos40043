<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

document.title = 'My Profile | S1zz'

const auth = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({ firstName: '', lastName: '' })
const pwErrors = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const saveSuccess = ref(false)
const pwSuccess = ref(false)
const pwError = ref('')
const saving = ref(false)
const savingPw = ref(false)

onMounted(() => {
  if (auth.currentUser) {
    form.firstName = auth.currentUser.firstName || ''
    form.lastName = auth.currentUser.lastName || ''
    form.email = auth.currentUser.email || ''
  }
})

const initials = computed(() => {
  const f = form.firstName?.[0] || ''
  const l = form.lastName?.[0] || ''
  return (f + l).toUpperCase() || '?'
})

function validateProfile() {
  errors.firstName = form.firstName.trim() ? '' : 'First name is required.'
  errors.lastName = form.lastName.trim() ? '' : 'Last name is required.'
  return !errors.firstName && !errors.lastName
}

function validatePassword() {
  pwErrors.currentPassword = passwordForm.currentPassword ? '' : 'Current password is required.'
  pwErrors.newPassword = passwordForm.newPassword.length >= 8 ? '' : 'Min. 8 characters.'
  pwErrors.confirmPassword = passwordForm.newPassword === passwordForm.confirmPassword ? '' : 'Passwords do not match.'
  return !pwErrors.currentPassword && !pwErrors.newPassword && !pwErrors.confirmPassword
}

async function saveProfile() {
  if (!validateProfile()) return
  saving.value = true
  await new Promise(r => setTimeout(r, 300))

  // Update in users list
  const users = JSON.parse(localStorage.getItem('s1zz_users') || '[]')
  const idx = users.findIndex(u => u.id === auth.currentUser.id)
  if (idx !== -1) {
    users[idx].firstName = form.firstName.trim()
    users[idx].lastName = form.lastName.trim()
    localStorage.setItem('s1zz_users', JSON.stringify(users))
  }

  // Update currentUser in auth store + storage
  const updated = { ...auth.currentUser, firstName: form.firstName.trim(), lastName: form.lastName.trim() }
  auth.currentUser.firstName = form.firstName.trim()
  auth.currentUser.lastName = form.lastName.trim()
  localStorage.setItem('s1zz_auth', JSON.stringify(updated))

  saving.value = false
  saveSuccess.value = true
  setTimeout(() => saveSuccess.value = false, 3000)
}

async function changePassword() {
  pwError.value = ''
  if (!validatePassword()) return
  savingPw.value = true
  await new Promise(r => setTimeout(r, 300))

  const users = JSON.parse(localStorage.getItem('s1zz_users') || '[]')
  const idx = users.findIndex(u => u.id === auth.currentUser.id)
  if (idx === -1 || users[idx].password !== passwordForm.currentPassword) {
    pwError.value = 'Current password is incorrect.'
    savingPw.value = false
    return
  }
  users[idx].password = passwordForm.newPassword
  localStorage.setItem('s1zz_users', JSON.stringify(users))

  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  savingPw.value = false
  pwSuccess.value = true
  setTimeout(() => pwSuccess.value = false, 3000)
}

const joinDate = computed(() => {
  if (!auth.currentUser?.id) return ''
  // use a fixed date for seed users, epoch ms for registered ones
  const id = auth.currentUser.id
  if (id === 1 || id === 2) return 'March 2026'
  return new Date(id).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
})
</script>

<template>
  <div class="page-section">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-5">
        <span class="section-tag mb-3 d-inline-block">Account</span>
        <h1 class="fw-bold mb-2">My <span style="color:var(--brand)">Profile</span></h1>
        <p style="color:var(--text-secondary);max-width:440px;margin:0 auto;font-size:0.9rem;">
          Manage your account details and password.
        </p>
      </div>

      <div class="row g-4 justify-content-center">
        <!-- Avatar card -->
        <div class="col-12 col-lg-3">
          <div class="card p-4 text-center h-100">
            <div class="avatar-lg mx-auto mb-3">{{ initials }}</div>
            <div class="fw-bold fs-5">{{ form.firstName }} {{ form.lastName }}</div>
            <div class="small mb-3" style="color:var(--text-muted)">{{ form.email }}</div>
            <span class="badge mx-auto" :style="auth.isAdmin ? 'background:rgba(245,158,11,0.15);color:var(--brand-accent)' : 'background:rgba(108,63,255,0.12);color:var(--brand)'">
              <i :class="auth.isAdmin ? 'bi bi-shield-fill me-1' : 'bi bi-person-fill me-1'"></i>
              {{ auth.isAdmin ? 'Admin' : 'Customer' }}
            </span>
            <div class="small mt-3" style="color:var(--text-muted)">
              <i class="bi bi-calendar3 me-1"></i>Member since {{ joinDate }}
            </div>
          </div>
        </div>

        <!-- Edit forms -->
        <div class="col-12 col-lg-7">
          <!-- Personal info -->
          <div class="card p-4 mb-4">
            <div class="d-flex align-items-center gap-2 mb-4">
              <div style="width:36px;height:36px;background:var(--brand-light);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <i class="bi bi-person text-brand"></i>
              </div>
              <h2 class="h5 fw-bold mb-0">Personal Information</h2>
            </div>

            <form @submit.prevent="saveProfile" novalidate aria-label="Profile form">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label" for="prof-fn">First Name</label>
                  <input id="prof-fn" v-model="form.firstName" type="text"
                    class="form-control" :class="{'is-invalid': errors.firstName}"
                    placeholder="Jane" />
                  <div class="invalid-feedback">{{ errors.firstName }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="prof-ln">Last Name</label>
                  <input id="prof-ln" v-model="form.lastName" type="text"
                    class="form-control" :class="{'is-invalid': errors.lastName}"
                    placeholder="Doe" />
                  <div class="invalid-feedback">{{ errors.lastName }}</div>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="prof-email">Email Address</label>
                <input id="prof-email" :value="form.email" type="email"
                  class="form-control" disabled style="opacity:0.6;cursor:not-allowed;" />
                <div class="form-text small">Email cannot be changed.</div>
              </div>
              <transition name="slide-down">
                <div v-if="saveSuccess" class="alert alert-success py-2 mb-3 small">
                  <i class="bi bi-check-circle me-1"></i>Profile updated successfully!
                </div>
              </transition>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-lg me-2"></i>
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </form>
          </div>

          <!-- Change Password -->
          <div class="card p-4">
            <div class="d-flex align-items-center gap-2 mb-4">
              <div style="width:36px;height:36px;background:var(--brand-light);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <i class="bi bi-lock text-brand"></i>
              </div>
              <h2 class="h5 fw-bold mb-0">Change Password</h2>
            </div>

            <form @submit.prevent="changePassword" novalidate aria-label="Change password form">
              <div class="mb-3">
                <label class="form-label" for="pw-current">Current Password</label>
                <input id="pw-current" v-model="passwordForm.currentPassword" type="password"
                  class="form-control" :class="{'is-invalid': pwErrors.currentPassword}"
                  placeholder="Your current password" autocomplete="current-password" />
                <div class="invalid-feedback">{{ pwErrors.currentPassword }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label" for="pw-new">New Password</label>
                <input id="pw-new" v-model="passwordForm.newPassword" type="password"
                  class="form-control" :class="{'is-invalid': pwErrors.newPassword}"
                  placeholder="Min. 8 characters" autocomplete="new-password" />
                <div class="invalid-feedback">{{ pwErrors.newPassword }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="pw-confirm">Confirm New Password</label>
                <input id="pw-confirm" v-model="passwordForm.confirmPassword" type="password"
                  class="form-control" :class="{'is-invalid': pwErrors.confirmPassword}"
                  placeholder="Repeat new password" autocomplete="new-password" />
                <div class="invalid-feedback">{{ pwErrors.confirmPassword }}</div>
              </div>
              <div v-if="pwError" class="alert alert-danger py-2 mb-3 small">{{ pwError }}</div>
              <transition name="slide-down">
                <div v-if="pwSuccess" class="alert alert-success py-2 mb-3 small">
                  <i class="bi bi-check-circle me-1"></i>Password changed successfully!
                </div>
              </transition>
              <button type="submit" class="btn btn-outline-primary" :disabled="savingPw">
                <span v-if="savingPw" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-lock me-2"></i>
                {{ savingPw ? 'Updating…' : 'Update Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--brand-light);
  color: var(--brand);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--brand);
}
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 80px; opacity: 1; }
</style>
