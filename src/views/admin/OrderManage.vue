<template>
  <div class="manage">
    <div class="manage__header">
      <h2>订单管理</h2>
      <div class="manage__filters">
        <select v-model="filter" class="field__input" style="width:auto" @change="fetchOrders">
          <option value="">全部状态</option>
          <option value="pending">待付款</option>
          <option value="paid">已付款</option>
          <option value="confirmed">已确认</option>
          <option value="in_progress">进行中</option>
          <option value="delivered">已交付</option>
          <option value="completed">已完成</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table class="manage-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>服务</th>
            <th>客户</th>
            <th>金额</th>
            <th>状态</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td><code>{{ o.order_no }}</code></td>
            <td>{{ o.service_title }}</td>
            <td>
              {{ o.contact_name }}
              <br />
              <small style="color: var(--color-gray-400)">{{ o.contact_phone }}</small>
            </td>
            <td>{{ o.quoted_price ? '¥' + o.quoted_price : '-' }}</td>
            <td>
              <span class="order-status" :style="{ background: statusColors[o.status], color: '#fff' }">
                {{ statusLabels[o.status] }}
              </span>
            </td>
            <td>{{ formatDate(o.created_at) }}</td>
            <td>
              <button class="btn btn-outline btn-sm" @click="openAction(o)">操作</button>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="7" style="text-align:center; color: var(--color-gray-400); padding: 2rem">暂无订单</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Action Modal -->
    <div v-if="actionOrder" class="modal-overlay" @click.self="actionOrder = null">
      <div class="card modal">
        <h3 style="margin-bottom: var(--space-3)">订单 {{ actionOrder.order_no }}</h3>
        <p style="font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: var(--space-4)">
          {{ actionOrder.service_title }} — {{ actionOrder.contact_name }}
        </p>

        <div class="field" v-if="actionOrder.status === 'pending' || actionOrder.status === 'paid'">
          <label class="field__label">报价金额</label>
          <input v-model.number="actionPrice" class="field__input" type="number" step="0.01" placeholder="输入报价" />
        </div>

        <div class="field">
          <label class="field__label">备注</label>
          <textarea v-model="actionRemark" class="field__input" rows="2" placeholder="可选备注"></textarea>
        </div>

        <div class="modal__actions">
          <button
            v-for="act in getActions(actionOrder.status)"
            :key="act.status"
            class="btn btn-sm"
            :class="act.btnClass"
            @click="updateStatus(actionOrder, act.status)"
          >
            {{ act.label }}
          </button>
          <button class="btn btn-outline btn-sm" @click="actionOrder = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '../../api/admin'

const orders = ref([])
const filter = ref('')
const actionOrder = ref(null)
const actionPrice = ref(null)
const actionRemark = ref('')

const statusLabels = {
  pending: '待付款', paid: '已付款', confirmed: '已确认',
  in_progress: '进行中', delivered: '已交付', completed: '已完成', rejected: '已拒绝',
}
const statusColors = {
  pending: 'var(--color-pending)', paid: 'var(--color-paid)', confirmed: 'var(--color-confirmed)',
  in_progress: 'var(--color-progress)', delivered: 'var(--color-delivered)',
  completed: 'var(--color-completed)', rejected: 'var(--color-rejected)',
}

function getActions(status) {
  const map = {
    pending: [{ status: 'paid', label: '确认付款', btnClass: 'btn-primary' }],
    paid: [{ status: 'confirmed', label: '确认收款', btnClass: 'btn-primary' }],
    confirmed: [{ status: 'in_progress', label: '开始处理', btnClass: 'btn-primary' }],
    in_progress: [{ status: 'delivered', label: '标记交付', btnClass: 'btn-primary' }],
    delivered: [{ status: 'completed', label: '标记完成', btnClass: 'btn-primary' }],
  }
  const actions = map[status] || []
  if (['pending', 'paid'].includes(status)) {
    actions.push({ status: 'rejected', label: '拒绝', btnClass: 'btn-outline' })
  }
  return actions
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('zh-CN') : ''
}

function openAction(o) {
  actionOrder.value = o
  actionPrice.value = o.quoted_price
  actionRemark.value = ''
}

async function fetchOrders() {
  try {
    const res = await adminApi.getOrders({ status: filter.value || undefined })
    orders.value = res.data?.list || []
  } catch (e) { console.error(e) }
}

async function updateStatus(order, status) {
  try {
    const data = { status }
    if (actionPrice.value) data.quoted_price = actionPrice.value
    if (actionRemark.value) data.remark = actionRemark.value
    await adminApi.updateOrder(order.id, data)
    actionOrder.value = null
    await fetchOrders()
  } catch (e) { alert('操作失败') }
}

onMounted(fetchOrders)
</script>

<style scoped>
.manage__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.manage__filters {
  display: flex;
  gap: var(--space-2);
}

.manage-table {
  width: 100%;
  border-collapse: collapse;
}

.manage-table th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  font-size: 0.8125rem;
  font-weight: 540;
  color: var(--color-gray-500);
  border-bottom: 1px solid var(--color-gray-200);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.manage-table td {
  padding: var(--space-2) var(--space-3);
  font-size: 0.9375rem;
  border-bottom: 1px solid var(--color-gray-100);
  vertical-align: top;
}

.manage-table code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.order-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 540;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  padding: var(--space-6);
  max-width: 480px;
  width: 90%;
}

.modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.field__label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 450;
  margin-bottom: var(--space-1);
}

.field__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-family: var(--font-sans);
}

.field__input:focus {
  outline: dashed 2px var(--color-black);
  outline-offset: -2px;
  border-color: transparent;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
