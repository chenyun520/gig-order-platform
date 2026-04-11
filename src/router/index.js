import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/service/:id',
    name: 'ServiceDetail',
    component: () => import('../views/ServiceDetail.vue'),
  },
  {
    path: '/order/query',
    name: 'OrderQuery',
    component: () => import('../views/OrderQuery.vue'),
  },
  {
    path: '/order/:id',
    name: 'OrderStatus',
    component: () => import('../views/OrderStatus.vue'),
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
  },
  {
    path: '/admin',
    component: () => import('../components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/admin/Dashboard.vue'),
      },
      {
        path: 'services',
        name: 'ServiceManage',
        component: () => import('../views/admin/ServiceManage.vue'),
      },
      {
        path: 'orders',
        name: 'OrderManage',
        component: () => import('../views/admin/OrderManage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      return { name: 'AdminLogin' }
    }
  }
})

export default router
