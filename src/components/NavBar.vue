<template>
  <nav class="nav">
    <div class="container nav-inner">
      <router-link to="/" class="nav-logo">
        <img src="/logo.png" alt="Logo" class="nav-logo__img" />
        <span>张千帆设计公司</span>
      </router-link>

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

        <!-- Dark Mode Toggle -->
        <div class="theme-toggle" @click="open = false">
          <input class="toggle-checkbox" id="toggle-switch" type="checkbox" v-model="isDark" />
          <label class="toggle-switch" for="toggle-switch">
            <div class="toggle-knob">
              <div class="toggle-led"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const open = ref(false)
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark-mode')
  }
})

watch(isDark, (val) => {
  if (val) {
    document.documentElement.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
})

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
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-black);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.nav-logo__img {
  height: 32px;
  width: 32px;
  object-fit: contain;
  border-radius: 4px;
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

/* ============================================
   Dark Mode Toggle Switch
   ============================================ */
.theme-toggle {
  position: relative;
  width: 56px;
  height: 28px;
  background: #d6d6d6;
  border-radius: 50px;
  box-shadow: inset -4px -4px 8px #ffffff, inset 4px 4px 8px #b0b0b0;
  flex-shrink: 0;
}

html.dark-mode .theme-toggle {
  background: #3a3a3a;
  box-shadow: inset -4px -4px 8px #4a4a4a, inset 4px 4px 8px #2a2a2a;
}

.toggle-checkbox {
  display: none;
}

.toggle-switch {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(-50%);
  border-radius: 50px;
  overflow: hidden;
  cursor: pointer;
}

.toggle-knob {
  position: absolute;
  width: 22px;
  height: 22px;
  background: linear-gradient(145deg, #d9d9d9, #bfbfbf);
  border-radius: 50%;
  top: 3px;
  left: 3px;
  box-shadow: -2px -2px 4px #ffffff, 2px 2px 4px #b0b0b0;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5px;
}

.toggle-led {
  width: 8px;
  height: 8px;
  background: grey;
  border-radius: 50%;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
}

.toggle-checkbox:checked + .toggle-switch .toggle-knob {
  left: 31px;
  background: linear-gradient(145deg, #cfcfcf, #a9a9a9);
  box-shadow: -2px -2px 4px #ffffff, 2px 2px 4px #8a8a8a;
}

.toggle-checkbox:checked + .toggle-switch .toggle-led {
  background: yellow;
  box-shadow: 0 0 10px 3px yellow;
}

.toggle-switch:hover .toggle-knob {
  box-shadow: -2px -2px 6px #ffffff, 2px 2px 6px #9b9b9b;
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
    align-items: center;
  }

  .nav-links--open {
    display: flex;
  }
}
</style>
