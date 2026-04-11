<template>
  <div class="login-page">
    <div class="login-card card">
      <h2 class="login-title">管理后台</h2>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label class="field__label">用户名</label>
          <input v-model="username" class="field__input" placeholder="admin" required />
        </div>
        <div class="field">
          <label class="field__label">密码</label>
          <input v-model="password" class="field__input" type="password" placeholder="密码" required />
        </div>
        <p v-if="error" class="login-error">{{ error }}</p>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await adminStore.login(username.value, password.value)
    router.push('/admin')
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
}

.login-card {
  padding: var(--space-8);
  width: 100%;
  max-width: 400px;
}

.login-title {
  margin-bottom: var(--space-6);
  text-align: center;
}

.field {
  margin-bottom: var(--space-4);
}

.field__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 450;
  margin-bottom: var(--space-1);
}

.field__input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-family: var(--font-sans);
}

.field__input:focus {
  outline: dashed 2px var(--color-black);
  outline-offset: -2px;
  border-color: transparent;
}

.login-error {
  color: var(--color-rejected);
  font-size: 0.875rem;
  margin-bottom: var(--space-3);
}
</style>
