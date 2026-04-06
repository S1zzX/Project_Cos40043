<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      selectedScene: 'mountain'
    }
  },
  computed: {
    nameError() {
      const nameRegex = /^[a-zA-Z\s'-]*$/
      if (this.firstName && !nameRegex.test(this.firstName)) return 'First name should only contain letters.'
      if (this.lastName && !nameRegex.test(this.lastName)) return 'Last name should only contain letters.'
      return ''
    },
    welcomeMessage() {
      const fn = this.firstName.trim()
      const ln = this.lastName.trim()
      if (!this.nameError && (fn || ln)) return `Welcome to S1zz, ${fn} ${ln}! 👋`
      return ''
    },
    sceneImage() {
      return this.selectedScene === 'mountain'
        ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'
        : 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80'
    }
  },
  mounted() {
    document.title = 'About | S1zz'
  }
}
</script>

<template>
  <div class="page-section">
    <div class="container">

      <!-- Page header -->
      <div class="text-center mb-5">
        <span class="section-tag mb-3 d-inline-block">About Us</span>
        <h1 class="fw-bold mb-2">About <span style="color:var(--brand)">S1zz</span></h1>
        <p style="color:var(--text-secondary);max-width:520px;margin:0 auto;font-size:0.9rem;">
          Learn more about who we are and personalise your experience below.
        </p>
      </div>

      <div class="row g-5">
        <!-- Left — description -->
        <div class="col-12 col-lg-6">
          <div class="card p-4 h-100">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div style="width:36px;height:36px;background:var(--brand-light);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <i class="bi bi-bag-heart-fill text-brand"></i>
              </div>
              <h2 class="h5 fw-bold mb-0">Our Story</h2>
            </div>
            <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;">
              S1zz is a modern e-commerce platform built on a passion for quality and convenience. Founded with the belief that online shopping should be enjoyable, transparent, and accessible to everyone.
            </p>
            <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;">
              We curate electronics, fashion, jewellery, and everyday essentials — sourced from trusted suppliers and vetted for quality. Our platform supports independent sellers while delivering a seamless experience.
            </p>
            <p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;" class="mb-0">
              With personalised wishlists, instant cart management, and a growing community of reviewers, S1zz gives you the tools to shop with confidence.
            </p>

            <hr style="border-color:var(--border)">
            <div class="row g-3">
              <div class="col-6">
                <div class="card p-3 text-center" style="background:var(--bg-surface-2);">
                  <div class="fw-bold fs-4" style="color:var(--brand)">5k+</div>
                  <div class="small" style="color:var(--text-muted)">Happy Customers</div>
                </div>
              </div>
              <div class="col-6">
                <div class="card p-3 text-center" style="background:var(--bg-surface-2);">
                  <div class="fw-bold fs-4" style="color:var(--brand-accent)">20+</div>
                  <div class="small" style="color:var(--text-muted)">Products Listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right — interactive -->
        <div class="col-12 col-lg-6">
          <!-- Name inputs -->
          <div class="card p-4 mb-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div style="width:36px;height:36px;background:var(--brand-light);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <i class="bi bi-person text-brand"></i>
              </div>
              <h2 class="h5 fw-bold mb-0">Personalise Your Visit</h2>
            </div>
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label" for="about-first">First Name</label>
                <input id="about-first" v-model="firstName" type="text" class="form-control" placeholder="Jane" />
              </div>
              <div class="col-6">
                <label class="form-label" for="about-last">Last Name</label>
                <input id="about-last" v-model="lastName" type="text" class="form-control" placeholder="Doe" />
              </div>
            </div>
            <transition name="slide-down">
              <div v-if="nameError" class="alert alert-warning mt-3 mb-0 py-2 small">
                <i class="bi bi-exclamation-triangle me-1"></i>{{ nameError }}
              </div>
              <div v-else-if="welcomeMessage" class="alert alert-info mt-3 mb-0 py-2 fw-semibold">
                {{ welcomeMessage }}
              </div>
            </transition>
          </div>

          <!-- Scene picker -->
          <div class="card p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div style="width:36px;height:36px;background:var(--brand-light);border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <i class="bi bi-image text-brand"></i>
              </div>
              <h2 class="h5 fw-bold mb-0">Choose Your Vibe</h2>
            </div>
            <div class="d-flex gap-4 mb-4">
              <div class="form-check">
                <input id="sc-mountain" v-model="selectedScene" class="form-check-input" type="radio" value="mountain" name="scene" />
                <label class="form-check-label fw-medium" for="sc-mountain">🏔️ Mountain</label>
              </div>
              <div class="form-check">
                <input id="sc-ocean" v-model="selectedScene" class="form-check-input" type="radio" value="ocean" name="scene" />
                <label class="form-check-label fw-medium" for="sc-ocean">🌊 Ocean</label>
              </div>
            </div>
            <transition name="fade" mode="out-in">
              <div :key="selectedScene">
                <img :src="sceneImage" :alt="selectedScene" class="w-100 rounded-3"
                  style="height:210px;object-fit:cover;border:1px solid var(--border);" />
                <p class="text-center mt-2 mb-0 fw-semibold small" style="color:var(--brand)">
                  {{ selectedScene === 'mountain' ? '🏔️ Mountain View' : '🌊 Ocean View' }}
                </p>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Built with -->
      <div class="card p-4 mt-5">
        <h2 class="h6 fw-bold text-center mb-4" style="color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;font-size:0.75rem;">Built With</h2>
        <div class="row g-3">
          <div class="col-6 col-md-3" v-for="tech in [
            { name:'Vue.js 3', icon:'bi-filetype-vue' },
            { name:'Bootstrap 5', icon:'bi-bootstrap-fill' },
            { name:'Pinia', icon:'bi-archive-fill' },
            { name:'Vite', icon:'bi-lightning-fill' }
          ]" :key="tech.name">
            <div class="d-flex align-items-center gap-2 p-3 rounded-3" style="background:var(--bg-surface-2);border:1px solid var(--border);">
              <i :class="['bi', tech.icon, 'text-brand fs-5']"></i>
              <span class="fw-semibold" style="font-size:0.875rem;">{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 80px; opacity: 1; }
</style>
