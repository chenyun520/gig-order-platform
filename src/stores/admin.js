import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import adminApi from '../api/admin'

export const useAdminStore = defineStore('admin', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const isLoggedIn = computed(() => !!token.value)

  async function login(username, password) {
    const res = await adminApi.login(username, password)
    if (res.code === 0) {
      token.value = res.data.token
      localStorage.setItem('admin_token', res.data.token)
      return true
    }
    throw new Error(res.message)
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('admin_token')
  }

  return { token, isLoggedIn, login, logout }
})
