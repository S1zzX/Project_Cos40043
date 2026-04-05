import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './style.css'

import App from './App.vue'
import { vFocus, vBadge, vTooltip } from './directives/index.js'
import { piniaPersistedPlugin } from './plugins/piniaPersistedPlugin.js'

const pinia = createPinia()
// Stage 3: Register the advanced Pinia persistence plugin globally
pinia.use(piniaPersistedPlugin)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.directive('focus', vFocus)
app.directive('badge', vBadge)
app.directive('tooltip', vTooltip)
app.mount('#app')
