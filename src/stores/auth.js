import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 's1zz_auth'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export const useAuthStore = defineStore('auth', () => {
  const savedUser = loadFromStorage()
  const currentUser = ref(savedUser)

  initUsers()

  const isLoggedIn = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const userName = computed(() => currentUser.value ? `${currentUser.value.firstName} ${currentUser.value.lastName}` : '')

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('s1zz_users') || '[]')
    } catch { return [] }
  }

  function saveUsers(users) {
    localStorage.setItem('s1zz_users', JSON.stringify(users))
  }

  async function initUsers() {
    const existing = getUsers()
    if (existing.length === 0) {
      const seed = [
        { id: 1, firstName: 'Admin', lastName: 'S1zz', email: 'admin@s1zz.com', password: 'admin123', role: 'admin' },
        { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@demo.com', password: 'password123', role: 'user' }
      ]
      saveUsers(seed)
    }
  }

  function login(email, password) {
    const users = getUsers()
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return { success: false, error: 'Invalid email or password.' }
    const { password: _pw, ...safeUser } = user
    currentUser.value = safeUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    return { success: true }
  }

  function register({ firstName, lastName, email, password }) {
    const users = getUsers()
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' }
    }
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      role: 'user'
    }
    users.push(newUser)
    saveUsers(users)
    const { password: _pw, ...safeUser } = newUser
    currentUser.value = safeUser
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { currentUser, isLoggedIn, isAdmin, userName, login, register, logout, initUsers }
})
