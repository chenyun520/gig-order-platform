<template>
  <div class="page">
    <div class="container query">
      <h2 class="query__title">查询订单</h2>
      <p class="query__subtitle">输入手机号和订单号查询订单状态</p>

      <form class="query__form" @submit.prevent="search">
        <div class="field">
          <label class="field__label">手机号</label>
          <input v-model="phone" class="field__input" type="tel" placeholder="下单时填写的手机号" required />
        </div>
        <div class="field">
          <label class="field__label">订单号</label>
          <input v-model="orderNo" class="field__input" placeholder="如 GO20260411001" required />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '查询中...' : '查询' }}
        </button>
      </form>

      <p v-if="error" class="query__error">{{ error }}</p>

      <div class="query__divider">
        <span>或</span>
      </div>

      <div class="query__alt">
        <h3 class="query__alt-title">按手机号查询全部订单</h3>
        <form class="query__form" @submit.prevent="searchByPhone">
          <div class="field">
            <label class="field__label">手机号</label>
            <input v-model="phoneOnly" class="field__input" type="tel" placeholder="输入手机号查看所有订单" required />
          </div>
          <button type="submit" class="btn btn-outline" style="width:100%" :disabled="loading">
            {{ loading ? '查询中...' : '查询全部订单' }}
          </button>
        </form>
      </div>

      <div v-if="phoneOrders.length > 0" class="query__results">
        <h3 class="query__alt-title">查询结果</h3>
        <div v-for="o in phoneOrders" :key="o.order_no" class="query__result-card card" @click="goToOrder(o)">
          <div class="query__result-header">
            <span class="query__result-no">{{ o.order_no }}</span>
            <span class="query__result-status" :style="{ color: statusColors[o.status] }">{{ statusLabels[o.status] }}</span>
          </div>
          <div class="query__result-body">
            <span>{{ o.service_title }}</span>
            <span v-if="o.quoted_price" class="query__result-price">¥{{ o.quoted_price }}</span>
          </div>
          <div class="query__result-date">{{ formatDate(o.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import orderApi from '../api/orders'

const router = useRouter()
const phone = ref('')
const orderNo = ref('')
const phoneOnly = ref('')
const loading = ref(false)
const error = ref('')
const phoneOrders = ref([])

const statusLabels = {
  pending: '待付款', paid: '已付款', confirmed: '已确认',
  in_progress: '进行中', delivered: '已交付', completed: '已完成', rejected: '已拒绝',
}
const statusColors = {
  pending: 'var(--color-pending)', paid: 'var(--color-paid)', confirmed: 'var(--color-confirmed)',
  in_progress: 'var(--color-progress)', delivered: 'var(--color-delivered)',
  completed: 'var(--color-completed)', rejected: 'var(--color-rejected)',
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('zh-CN') : ''
}

async function search() {
  error.value = ''
  loading.value = true
  try {
    const res = await orderApi.getById(orderNo.value, phone.value)
    if (res.code === 0) {
      router.push(`/order/${res.data.id}?phone=${phone.value}`)
    } else {
      error.value = res.message || '订单不存在'
    }
  } catch {
    error.value = '查询失败，请检查手机号和订单号'
  } finally {
    loading.value = false
  }
}

async function searchByPhone() {
  error.value = ''
  loading.value = true
  try {
    const res = await orderApi.verify(phoneOnly.value)
    if (res.code === 0) {
      phoneOrders.value = res.data || []
      if (phoneOrders.value.length === 0) {
        error.value = '未找到相关订单'
      }
    }
  } catch {
    error.value = '查询失败'
  } finally {
    loading.value = false
  }
}

function goToOrder(o) {
  router.push(`/order/${o.order_no}?phone=${phoneOnly.value}`)
}
</script>

<style scoped>
.page {
  padding: var(--space-12) 0;
  min-height: 80vh;
}

.query {
  max-width: 480px;
  margin: 0 auto;
}

.query__title {
  margin-bottom: var(--space-2);
}

.query__subtitle {
  color: var(--color-gray-500);
  margin-bottom: var(--space-6);
}

.query__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
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

.query__error {
  margin-top: var(--space-4);
  color: var(--color-rejected);
  font-size: 0.875rem;
}

.query__divider {
  text-align: center;
  margin: var(--space-6) 0;
  position: relative;
}

.query__divider span {
  background: var(--color-white);
  padding: 0 var(--space-3);
  color: var(--color-gray-400);
  font-size: 0.8125rem;
  position: relative;
  z-index: 1;
}

.query__divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--color-gray-200);
}

.query__alt {
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.query__alt-title {
  font-size: 1rem;
  margin-bottom: var(--space-3);
}

.query__results {
  margin-top: var(--space-5);
}

.query__result-card {
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
  cursor: pointer;
}

.query__result-card:hover {
  box-shadow: var(--shadow-md);
}

.query__result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-1);
}

.query__result-no {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 540;
}

.query__result-status {
  font-size: 0.8125rem;
  font-weight: 540;
}

.query__result-body {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.query__result-price {
  font-weight: 540;
}

.query__result-date {
  font-size: 0.75rem;
  color: var(--color-gray-400);
  margin-top: 2px;
}
</style>
