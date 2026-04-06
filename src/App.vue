<script>
import { mapStores } from 'pinia'
import { useThemeStore } from './stores/theme.js'
import Navbar from './components/Navbar.vue'
import FooterBar from './components/FooterBar.vue'

export default {
  components: {
    Navbar,
    FooterBar
  },
  computed: {
    ...mapStores(useThemeStore)
  },
  mounted() {
    document.documentElement.setAttribute('data-theme', this.themeStore.theme)
  }
}
</script>

<template>
  <div id="app-wrapper">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>

<style scoped>
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content { flex: 1; }
</style>
