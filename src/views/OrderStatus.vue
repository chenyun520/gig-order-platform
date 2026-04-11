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
        <div class="status__row" v-if="order.requirement_desc">
          <span class="status__label">需求描述</span>
          <span class="status__desc">{{ order.requirement_desc }}</span>
        </div>
        <div class="status__row" v-if="order.quoted_price">
          <span class="status__label">报价金额</span>
          <span class="status__price">¥{{ order.quoted_price }}</span>
        </div>
        <div class="status__row">
          <span class="status__label">下单时间</span>
          <span>{{ formatDate(order.created_at) }}</span>
        </div>
      </div>

      <!-- 报价待付款：显示收款码 -->
      <div class="status__pay" v-if="showPayment">
        <div class="status__pay-amount" v-if="order.quoted_price">
          应付金额：<strong>¥{{ order.quoted_price }}</strong>
        </div>
        <img src="/qr/payment.jpg" alt="收款码" class="status__pay-qr" />
        <p class="status__pay-hint">扫码完成付款后，联系我确认</p>
        <div class="status__pay-contact">
          <button class="btn btn-outline btn-sm" @click="copyToClipboard('826857706', 'QQ号已复制')">QQ: 826857706</button>
          <button class="btn btn-outline btn-sm" @click="copyToClipboard('ZQFservice', '微信号已复制')">微信: ZQFservice</button>
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

    <div class="container" v-else style="text-align: center; padding: 4rem 0;">
      <p style="color: var(--color-gray-400)">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import orderApi from '../api/orders'
import OrderTimeline from '../components/OrderTimeline.vue'
import { useToast } from '../composables/useToast'

const route = useRoute()
const toast = useToast()
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

// 显示付款区域：待付款 + 有报价
const showPayment = computed(() => {
  return order.value?.status === 'pending' && order.value?.quoted_price
})

function formatDate(d) {
  return d ? new Date(d).toLocaleString('zh-CN') : ''
}

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    toast.show(msg)
  }).catch(() => {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    toast.show(msg)
  })
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
  flex-shrink: 0;
}

.status__desc {
  text-align: right;
  max-width: 70%;
  line-height: 1.5;
}

.status__price {
  font-weight: 700;
  font-size: 1.125rem;
}

/* Payment section */
.status__pay {
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  margin-bottom: var(--space-6);
}

.status__pay-amount {
  font-size: 1.125rem;
  margin-bottom: var(--space-4);
}

.status__pay-amount strong {
  font-size: 1.5rem;
}

.status__pay-qr {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  margin-bottom: var(--space-3);
}

.status__pay-hint {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: var(--space-3);
}

.status__pay-contact {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
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
