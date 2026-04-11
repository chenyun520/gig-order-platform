<template>
  <div class="page">
    <div class="container status" v-if="order">
      <router-link to="/" class="status__back">← 返回首页</router-link>

      <div class="status__header">
        <h2 class="status__title">订单 {{ order.order_no }}</h2>
        <span class="status__badge" :style="{ background: statusColor, color: '#fff' }">
          {{ statusLabel }}
        </span>
      </div>

      <div class="status__info">
        <div class="status__row">
          <span class="status__label">服务项目</span>
          <span>{{ order.service_title }}</span>
        </div>
        <div class="status__row" v-if="order.quoted_price || order.price">
          <span class="status__label">金额</span>
          <span class="status__price">¥{{ order.quoted_price || order.price }}</span>
        </div>
        <div class="status__row">
          <span class="status__label">下单时间</span>
          <span>{{ formatDate(order.created_at) }}</span>
        </div>
      </div>

      <div class="status__timeline">
        <h3 class="status__section-title">订单进度</h3>
        <OrderTimeline :order="order" />
      </div>

      <div class="status__remark" v-if="order.remark">
        <h3 class="status__section-title">备注</h3>
        <p>{{ order.remark }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import orderApi from '../api/orders'
import OrderTimeline from '../components/OrderTimeline.vue'

const route = useRoute()
const order = ref(null)

const statusLabels = {
  pending: '待付款', paid: '已付款', confirmed: '已确认',
  in_progress: '进行中', delivered: '已交付', completed: '已完成', rejected: '已拒绝',
}
const statusColors = {
  pending: 'var(--color-pending)', paid: 'var(--color-paid)', confirmed: 'var(--color-confirmed)',
  in_progress: 'var(--color-progress)', delivered: 'var(--color-delivered)',
  completed: 'var(--color-completed)', rejected: 'var(--color-rejected)',
}

const statusLabel = computed(() => statusLabels[order.value?.status] || '')
const statusColor = computed(() => statusColors[order.value?.status] || '#000')

function formatDate(d) {
  return d ? new Date(d).toLocaleString('zh-CN') : ''
}

onMounted(async () => {
  const phone = route.query.phone
  const id = route.params.id
  if (!phone || !id) return
  try {
    const res = await orderApi.getById(id, phone)
    if (res.code === 0) order.value = res.data
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.page {
  padding: var(--space-8) 0;
  min-height: 80vh;
}

.status {
  max-width: 640px;
  margin: 0 auto;
}

.status__back {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-decoration: none;
  margin-bottom: var(--space-4);
}

.status__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.status__badge {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 540;
}

.status__info {
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.status__row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  font-size: 0.9375rem;
}

.status__row + .status__row {
  border-top: 1px solid var(--color-gray-200);
}

.status__label {
  color: var(--color-gray-500);
}

.status__price {
  font-weight: 700;
}

.status__section-title {
  font-size: 1.125rem;
  margin-bottom: var(--space-4);
}

.status__timeline {
  margin-bottom: var(--space-6);
}

.status__remark {
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  font-size: 0.9375rem;
  line-height: 1.6;
}
</style>
