<template>
  <div class="manage">
    <div class="manage__header">
      <h2>订单管理</h2>
      <div class="manage__filters">
        <select v-model="filter" class="field__input" style="width:auto" @change="fetchOrders">
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="quoted">已报价</option>
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
        <div class="modal__header">
          <h3>订单 {{ actionOrder.order_no }}</h3>
          <span class="order-status" :style="{ background: statusColors[actionOrder.status], color: '#fff' }">
            {{ statusLabels[actionOrder.status] }}
          </span>
        </div>
        <p class="modal__info">{{ actionOrder.service_title }} — {{ actionOrder.contact_name }} ({{ actionOrder.contact_phone }})</p>
        <p class="modal__desc" v-if="actionOrder.requirement_desc">{{ actionOrder.requirement_desc }}</p>

        <!-- Client attachments -->
        <div class="modal__section" v-if="actionOrder.attachment_urls && actionOrder.attachment_urls.length > 0">
          <label class="field__label">客户附件</label>
          <div class="modal__file-list">
            <a v-for="f in actionOrder.attachment_urls" :key="f.path"
              :href="getPublicUrl(f.path)" target="_blank" class="modal__file-link">
              {{ f.name }}
            </a>
          </div>
        </div>

        <!-- Deliverables -->
        <div class="modal__section">
          <label class="field__label">交付文件</label>
          <div class="modal__file-list" v-if="actionOrder.deliverable_urls && actionOrder.deliverable_urls.length > 0">
            <a v-for="f in actionOrder.deliverable_urls" :key="f.path"
              :href="getPublicUrl(f.path)" target="_blank" class="modal__file-link">
              {{ f.name }}
            </a>
          </div>
          <label class="modal__upload-btn">
            <input type="file" multiple @change="onDeliverableSelect" style="display:none" />
            <span>+ 上传交付物</span>
          </label>
        </div>

        <!-- Quote input -->
        <div class="field" v-if="['pending', 'quoted'].includes(actionOrder.status)">
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
            :key="act.label"
            class="btn btn-sm"
            :class="act.btnClass"
            @click="handleAction(actionOrder, act)"
          >
            {{ act.label }}
          </button>
          <button class="btn btn-sm btn-delete" @click="deleteOrder(actionOrder)">删除订单</button>
          <button class="btn btn-outline btn-sm" @click="actionOrder = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '../../api/admin'

const SUPABASE_URL = 'https://pwccxvmtcaaxxzajjbrp.supabase.co'

function getPublicUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/order-files/${path}`
}

const orders = ref([])
const filter = ref('')
const actionOrder = ref(null)
const actionPrice = ref(null)
const actionRemark = ref('')

const statusLabels = {
  pending: '待处理', quoted: '已报价', paid: '已付款', confirmed: '已确认',
  in_progress: '进行中', delivered: '已交付', completed: '已完成', rejected: '已拒绝',
}
const statusColors = {
  pending: 'var(--color-pending)', quoted: '#f97316', paid: 'var(--color-paid)', confirmed: 'var(--color-confirmed)',
  in_progress: 'var(--color-progress)', delivered: 'var(--color-delivered)',
  completed: 'var(--color-completed)', rejected: 'var(--color-rejected)',
}

function getActions(status) {
  const map = {
    pending: [
      { label: '设置报价', btnClass: 'btn-primary', action: 'quote' },
      { label: '确认已付款', btnClass: 'btn-outline', action: 'paid' },
    ],
    quoted: [
      { label: '确认已付款', btnClass: 'btn-primary', action: 'paid' },
    ],
    paid: [{ label: '确认收款', btnClass: 'btn-primary', action: 'confirmed' }],
    confirmed: [{ label: '开始处理', btnClass: 'btn-primary', action: 'in_progress' }],
    in_progress: [{ label: '标记交付', btnClass: 'btn-primary', action: 'delivered' }],
    delivered: [{ label: '标记完成', btnClass: 'btn-primary', action: 'completed' }],
  }
  const actions = map[status] || []
  if (['pending', 'quoted', 'paid'].includes(status)) {
    actions.push({ label: '拒绝', btnClass: 'btn-outline', action: 'rejected' })
  }
  return actions
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('zh-CN') : ''
}

function openAction(o) {
  actionOrder.value = { ...o }
  actionPrice.value = o.quoted_price
  actionRemark.value = ''
}

async function fetchOrders() {
  try {
    const res = await adminApi.getOrders({ status: filter.value || undefined })
    orders.value = res.data?.list || []
  } catch (e) { console.error(e) }
}

async function handleAction(order, act) {
  try {
    const data = {}
    if (act.action === 'quote') {
      // Quote only: set price without status change (backend auto-sets quoted)
      if (!actionPrice.value) { alert('请输入报价金额'); return }
      data.quoted_price = actionPrice.value
    } else {
      data.status = act.action
      if (actionPrice.value) data.quoted_price = actionPrice.value
    }
    if (actionRemark.value) data.remark = actionRemark.value
    await adminApi.updateOrder(order.id, data)
    actionOrder.value = null
    await fetchOrders()
  } catch (e) { alert('操作失败') }
}

async function deleteOrder(order) {
  if (!confirm(`确定删除订单 ${order.order_no}？此操作不可恢复。`)) return
  try {
    await adminApi.deleteOrder(order.id)
    actionOrder.value = null
    await fetchOrders()
  } catch (e) { alert('删除失败') }
}

async function onDeliverableSelect(e) {
  const files = Array.from(e.target.files)
  for (const file of files) {
    if (file.size > 50 * 1024 * 1024) { alert(`${file.name} 超过50MB`); continue }
    try {
      await adminApi.uploadDeliverable(actionOrder.value.id, file)
    } catch (err) { alert(`${file.name} 上传失败`) }
  }
  e.target.value = ''
  await fetchOrders()
  // Refresh the modal data
  const updated = orders.value.find(o => o.id === actionOrder.value.id)
  if (updated) actionOrder.value = { ...updated }
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
  max-width: 520px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.modal__info {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: var(--space-3);
}

.modal__desc {
  font-size: 0.875rem;
  background: var(--color-gray-100);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  line-height: 1.5;
}

.modal__section {
  margin-bottom: var(--space-4);
}

.modal__file-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.modal__file-tag {
  font-size: 0.8125rem;
  padding: 4px 10px;
  background: var(--color-gray-100);
  border-radius: var(--radius-pill);
}

.modal__file-link {
  display: inline-block;
  font-size: 0.8125rem;
  padding: 6px 12px;
  background: var(--color-gray-100);
  border-radius: var(--radius-pill);
  color: var(--color-black);
  text-decoration: none;
  transition: background 0.15s;
}

.modal__file-link:hover {
  background: var(--color-gray-200);
}

.modal__upload-btn {
  display: inline-block;
  padding: 6px 14px;
  border: 1px dashed var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
}

.modal__upload-btn:hover {
  border-color: var(--color-black);
  color: var(--color-black);
}

.modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.btn-delete {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
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
