<template>
  <div class="qr-payment">
    <div class="qr-payment__card card">
      <span class="mono-label">订单创建成功</span>
      <div class="qr-payment__order-row">
        <h3 class="qr-payment__order-no">{{ order.order_no }}</h3>
        <button class="btn btn-sm btn-outline" @click="copyOrderNo">复制</button>
      </div>

      <div class="qr-payment__amount" v-if="displayPrice">
        ¥{{ displayPrice }}
      </div>
      <div class="qr-payment__amount qr-payment__amount--pending" v-else>
        待报价
      </div>

      <div class="qr-payment__qr">
        <img src="/qr/payment.jpg" alt="收款码" class="qr-payment__img" />
        <p class="qr-payment__hint">扫码完成付款</p>
      </div>

      <button class="btn btn-primary btn-lg qr-payment__btn" @click="$emit('paid')">
        我已完成付款
      </button>

      <div class="qr-payment__footer">
        <router-link to="/" class="qr-payment__link">← 返回首页</router-link>
        <router-link to="/order/query" class="qr-payment__link">查询订单 →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const toast = useToast()

const props = defineProps({
  order: { type: Object, required: true },
})

defineEmits(['paid'])

const displayPrice = computed(() => {
  if (props.order.quoted_price) return props.order.quoted_price
  if (props.order.price_type !== 'quote' && props.order.price) return props.order.price
  return null
})

function copyOrderNo() {
  navigator.clipboard.writeText(props.order.order_no).then(() => {
    toast.show('订单号已复制')
  }).catch(() => {
    toast.show('订单号已复制')
  })
}
</script>

<style scoped>
.qr-payment {
  display: flex;
  justify-content: center;
  padding: var(--space-8) 0;
}

.qr-payment__card {
  text-align: center;
  padding: var(--space-8);
  max-width: 400px;
  width: 100%;
}

.qr-payment__order-no {
  font-family: var(--font-mono);
  margin: var(--space-2) 0 var(--space-4);
  font-size: 1.25rem;
}

.qr-payment__amount {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-5);
}

.qr-payment__amount--pending {
  font-size: 1.25rem;
  font-weight: 450;
  color: var(--color-gray-500);
}

.qr-payment__qr {
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-payment__img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-md);
}

.qr-payment__hint {
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.qr-payment__btn {
  width: 100%;
}

.qr-payment__order-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-2) 0 var(--space-4);
}

.qr-payment__footer {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.qr-payment__link {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-decoration: none;
}

.qr-payment__link:hover {
  color: var(--color-black);
}
</style>
