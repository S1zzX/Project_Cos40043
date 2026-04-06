import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('s1zz_theme') || 'light'
  }),
  actions: {
    apply(val) {
      document.documentElement.setAttribute('data-theme', val)
      localStorage.setItem('s1zz_theme', val)
    },
    toggle() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      this.apply(this.theme)
    },
    init() {
      this.apply(this.theme)
    }
  }
})
