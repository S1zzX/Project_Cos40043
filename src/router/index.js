import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

import Home from '../views/Home.vue'
import News from '../views/News.vue'
import About from '../views/About.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Wishlist from '../views/Wishlist.vue'
import OrderHistory from '../views/OrderHistory.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/news', component: News, name: 'News' },
  { path: '/about', component: About, name: 'About' },
  { path: '/products', component: ProductList, name: 'Products' },
  { path: '/products/:id', component: ProductDetail, name: 'ProductDetail' },
  { path: '/cart', component: Cart, name: 'Cart', meta: { requiresAuth: true, restrictAdmin: true } },
  { path: '/wishlist', component: Wishlist, name: 'Wishlist', meta: { requiresAuth: true, restrictAdmin: true } },
  { path: '/orders', component: OrderHistory, name: 'Orders', meta: { requiresAuth: true, restrictAdmin: true } },
  { path: '/profile', component: Profile, name: 'Profile', meta: { requiresAuth: true } },
  { path: '/login', component: Login, name: 'Login', meta: { guestOnly: true } },
  { path: '/register', component: Register, name: 'Register', meta: { guestOnly: true } },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard', meta: { requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/login')
  } else if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else if (to.meta.restrictAdmin && auth.isAdmin) {
    next('/dashboard')
  } else if (to.meta.guestOnly && auth.isLoggedIn) {
    next('/profile')
  } else {
    next()
  }
})

export default router
