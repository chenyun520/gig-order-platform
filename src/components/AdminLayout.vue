<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar__header">
        <router-link to="/admin" class="admin-sidebar__logo">管理后台</router-link>
      </div>
      <nav class="admin-sidebar__nav">
        <router-link to="/admin" class="admin-sidebar__link" exact-active-class="admin-sidebar__link--active">
          仪表盘
        </router-link>
        <router-link to="/admin/services" class="admin-sidebar__link" active-class="admin-sidebar__link--active">
          服务管理
        </router-link>
        <router-link to="/admin/orders" class="admin-sidebar__link" active-class="admin-sidebar__link--active">
          订单管理
        </router-link>
      </nav>
      <div class="admin-sidebar__footer">
        <router-link to="/" class="admin-sidebar__link">← 返回前台</router-link>
        <button class="admin-sidebar__link" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

function logout() {
  adminStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 220px;
  background: var(--color-gray-900);
  color: var(--color-white);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.admin-sidebar__header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-gray-700);
}

.admin-sidebar__logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-white);
  text-decoration: none;
}

.admin-sidebar__nav {
  flex: 1;
  padding: var(--space-3) 0;
}

.admin-sidebar__link {
  display: block;
  padding: var(--space-2) var(--space-5);
  color: var(--color-gray-400);
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 340;
  transition: all 0.15s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-family: var(--font-sans);
}

.admin-sidebar__link:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.05);
}

.admin-sidebar__link--active {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.admin-sidebar__footer {
  padding: var(--space-3);
  border-top: 1px solid var(--color-gray-700);
}

.admin-main {
  flex: 1;
  background: var(--color-gray-100);
  padding: var(--space-6);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
  .admin-sidebar__header,
  .admin-sidebar__footer {
    display: none;
  }
  .admin-sidebar__nav {
    display: flex;
    padding: 0;
  }
  .admin-sidebar__link {
    white-space: nowrap;
    padding: var(--space-3) var(--space-4);
  }
}
</style>
