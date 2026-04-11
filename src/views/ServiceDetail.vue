<template>
  <div class="page">
    <div class="container detail" v-if="service">
      <div class="detail__main">
        <router-link to="/" class="detail__back">← 返回首页</router-link>
        <h1 class="detail__title">{{ service.title }}</h1>
        <div class="detail__price-tag">
          <template v-if="service.price_type !== 'quote'">
            ¥{{ service.price }} / {{ service.unit }}
          </template>
          <template v-else>价格面议</template>
        </div>
        <p class="detail__desc">{{ service.description }}</p>
      </div>

      <div class="detail__side">
        <template v-if="!ordered">
          <OrderForm :service="service" @submitted="handleOrder" />
        </template>
        <template v-else>
          <QrPayment :order="ordered" />
        </template>
      </div>
    </div>
    <div class="container" v-else>
      <p style="text-align:center; padding: 4rem 0; color: var(--color-gray-400)">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import serviceApi from '../api/services'
import orderApi from '../api/orders'
import OrderForm from '../components/OrderForm.vue'
import QrPayment from '../components/QrPayment.vue'

const route = useRoute()
const service = ref(null)
const ordered = ref(null)

onMounted(async () => {
  try {
    const res = await serviceApi.getById(route.params.id)
    service.value = res.data
  } catch (e) {
    console.error(e)
  }
})

async function handleOrder(formData) {
  try {
    const res = await orderApi.create(formData)
    ordered.value = res.data
  } catch (e) {
    alert('下单失败，请稍后重试')
  }
}
</script>

<style scoped>
.page {
  padding: var(--space-8) 0;
  min-height: 80vh;
}

.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: start;
}

.detail__back {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-decoration: none;
  margin-bottom: var(--space-4);
}

.detail__back:hover {
  color: var(--color-black);
}

.detail__title {
  margin-bottom: var(--space-3);
}

.detail__price-tag {
  display: inline-block;
  background: var(--color-black);
  color: var(--color-white);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: var(--space-5);
}

.detail__desc {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-gray-600);
}

@media (max-width: 768px) {
  .detail {
    grid-template-columns: 1fr;
  }
}
</style>
