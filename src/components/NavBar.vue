<template>
  <nav class="nav">
    <div class="container nav-inner">
      <router-link to="/" class="nav-logo">张千帆设计公司</router-link>

      <button class="nav-toggle" @click="open = !open" aria-label="Toggle menu">
        <span class="nav-toggle-bar" />
        <span class="nav-toggle-bar" />
        <span class="nav-toggle-bar" />
      </button>

      <div class="nav-links" :class="{ 'nav-links--open': open }">
        <router-link to="/" class="nav-link" @click="open = false">首页</router-link>
        <router-link to="/order/query" class="nav-link" @click="open = false">订单查询</router-link>
        <a class="nav-link" @click="goContact">联系我</a>
        <router-link to="/admin/login" class="btn btn-sm btn-outline" @click="open = false">管理</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const open = ref(false)

function goContact() {
  open.value = false
  if (route.path === '/') {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push({ path: '/', hash: '#contact' })
  }
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-200);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-black);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 340;
  color: var(--color-black);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  transition: background 0.15s;
  cursor: pointer;
}

.nav-link:hover {
  background: var(--color-glass-dark);
}

.nav-link.router-link-active {
  background: var(--color-black);
  color: var(--color-white);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.nav-toggle-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-black);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--color-white);
    flex-direction: column;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-gray-200);
    gap: var(--space-2);
  }

  .nav-links--open {
    display: flex;
  }
}
</style>
