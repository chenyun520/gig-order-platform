<template>
  <div class="dashboard">
    <h2 class="dashboard__title">仪表盘</h2>

    <div class="dashboard__stats">
      <StatCard label="今日订单" :value="stats.todayOrders" color="var(--color-paid)" />
      <StatCard label="待处理" :value="stats.pendingPayment" color="var(--color-pending)" />
      <StatCard label="进行中" :value="stats.inProgress" color="var(--color-progress)" />
      <StatCard label="已完成" :value="stats.completed" color="var(--color-completed)" />
      <StatCard label="总收入" :value="'¥' + stats.totalRevenue" />
    </div>

    <div class="dashboard__section">
      <h3>快捷操作</h3>
      <div class="dashboard__actions">
        <router-link to="/admin/orders" class="btn btn-primary">管理订单</router-link>
        <router-link to="/admin/services" class="btn btn-outline">管理服务</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '../../api/admin'
import StatCard from '../../components/StatCard.vue'

const stats = ref({
  todayOrders: 0,
  pendingPayment: 0,
  inProgress: 0,
  completed: 0,
  totalRevenue: 0,
})

onMounted(async () => {
  try {
    const res = await adminApi.getStats()
    if (res.code === 0) stats.value = res.data
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.dashboard__title {
  margin-bottom: var(--space-5);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.dashboard__section h3 {
  margin-bottom: var(--space-3);
}

.dashboard__actions {
  display: flex;
  gap: var(--space-3);
}
</style>
