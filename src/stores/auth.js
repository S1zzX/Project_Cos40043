import { defineStore } from 'pinia'

const STORAGE_KEY = 's1zz_auth'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: loadFromStorage()
  }),
  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    userName: (state) => state.currentUser ? `${state.currentUser.firstName} ${state.currentUser.lastName}` : ''
  },
  actions: {
    getUsers() {
      try {
        return JSON.parse(localStorage.getItem('s1zz_users') || '[]')
      } catch { return [] }
    },
    saveUsers(users) {
      localStorage.setItem('s1zz_users', JSON.stringify(users))
    },
    async initUsers() {
      const existing = this.getUsers()
      if (existing.length === 0) {
        const seed = [
          { id: 1, firstName: 'Admin', lastName: 'S1zz', email: 'admin@s1zz.com', password: 'admin123', role: 'admin' },
          { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@demo.com', password: 'password123', role: 'user' }
        ]
        this.saveUsers(seed)
      }
    },
    login(email, password) {
      const users = this.getUsers()
      const user = users.find(u => u.email === email && u.password === password)
      if (!user) return { success: false, error: 'Invalid email or password.' }
      const { password: _pw, ...safeUser } = user
      this.currentUser = safeUser
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
      return { success: true }
    },
    register({ firstName, lastName, email, password }) {
      const users = this.getUsers()
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
      this.saveUsers(users)
      const { password: _pw, ...safeUser } = newUser
      this.currentUser = safeUser
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
      return { success: true }
    },
    logout() {
      this.currentUser = null
      localStorage.removeItem(STORAGE_KEY)
    },
    async updateProfile({ firstName, lastName }) {
      if (!this.currentUser) return { success: false, error: 'Not logged in' }
      
      const users = this.getUsers()
      const idx = users.findIndex(u => u.id === this.currentUser.id)
      if (idx !== -1) {
        users[idx].firstName = firstName
        users[idx].lastName = lastName
        this.saveUsers(users)
      }

      this.currentUser.firstName = firstName
      this.currentUser.lastName = lastName
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser))
      return { success: true }
    },
    async changePassword({ currentPassword, newPassword }) {
      if (!this.currentUser) return { success: false, error: 'Not logged in' }

      const users = this.getUsers()
      const idx = users.findIndex(u => u.id === this.currentUser.id)
      if (idx === -1 || users[idx].password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect.' }
      }
      users[idx].password = newPassword
      this.saveUsers(users)
      return { success: true }
    }
  }
})
