import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const saved = localStorage.getItem('s1zz_theme') || 'light'
  const theme = ref(saved)

  function apply(val) {
    document.documentElement.setAttribute('data-theme', val)
    localStorage.setItem('s1zz_theme', val)
  }

  // Apply on init
  apply(theme.value)

  watch(theme, apply)

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
})
