<template>
  <div class="manage">
    <div class="manage__header">
      <h2>服务管理</h2>
      <button class="btn btn-primary btn-sm" @click="showAdd = true">+ 新增服务</button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAdd || editing" class="card manage-form" style="padding: var(--space-4); margin-bottom: var(--space-4)">
      <h3 style="margin-bottom: var(--space-3)">{{ editing ? '编辑服务' : '新增服务' }}</h3>
      <div class="manage-form__grid">
        <div class="field">
          <label class="field__label">名称 *</label>
          <input v-model="form.title" class="field__input" />
        </div>
        <div class="field">
          <label class="field__label">定价方式</label>
          <select v-model="form.price_type" class="field__input">
            <option value="fixed">固定价格</option>
            <option value="quote">询价</option>
            <option value="mixed">混合</option>
          </select>
        </div>
        <div class="field" v-if="form.price_type !== 'quote'">
          <label class="field__label">价格</label>
          <input v-model.number="form.price" class="field__input" type="number" step="0.01" />
        </div>
        <div class="field">
          <label class="field__label">单位</label>
          <input v-model="form.unit" class="field__input" />
        </div>
      </div>
      <div class="field">
        <label class="field__label">描述</label>
        <textarea v-model="form.description" class="field__input" rows="3"></textarea>
      </div>
      <div class="manage-form__actions">
        <button class="btn btn-primary btn-sm" @click="saveService">保存</button>
        <button class="btn btn-outline btn-sm" @click="cancelEdit">取消</button>
      </div>
    </div>

    <!-- Service List -->
    <div class="card">
      <div class="table-scroll">
      <table class="manage-table">
        <thead>
          <tr>
            <th style="width: 48px">排序</th>
            <th>名称</th>
            <th>定价</th>
            <th>价格</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, index) in services" :key="s.id">
            <td>
              <div class="sort-btns">
                <button
                  class="sort-btn"
                  :disabled="index === 0"
                  @click="moveUp(index)"
                  title="上移"
                >&uarr;</button>
                <button
                  class="sort-btn"
                  :disabled="index === services.length - 1"
                  @click="moveDown(index)"
                  title="下移"
                >&darr;</button>
              </div>
            </td>
            <td>{{ s.title }}</td>
            <td>{{ { fixed: '固定', quote: '询价', mixed: '混合' }[s.price_type] }}</td>
            <td>{{ s.price_type !== 'quote' ? '¥' + s.price + '/' + s.unit : '-' }}</td>
            <td>
              <span class="status-dot" :class="s.is_active ? 'status-dot--active' : 'status-dot--inactive'" />
              {{ s.is_active ? '上架' : '下架' }}
            </td>
            <td>
              <button class="btn btn-outline btn-sm" @click="editService(s)">编辑</button>
              <button class="btn btn-outline btn-sm" @click="toggleActive(s)">
                {{ s.is_active ? '下架' : '上架' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '../../api/admin'

const services = ref([])
const showAdd = ref(false)
const editing = ref(null)
const form = ref({ title: '', description: '', price_type: 'fixed', price: null, unit: '次' })

onMounted(fetchServices)

async function fetchServices() {
  try {
    const res = await adminApi.getServices()
    services.value = res.data || []
  } catch (e) { console.error(e) }
}

function editService(s) {
  editing.value = s
  form.value = { ...s }
  showAdd.value = false
}

function cancelEdit() {
  editing.value = null
  showAdd.value = false
  form.value = { title: '', description: '', price_type: 'fixed', price: null, unit: '次' }
}

async function saveService() {
  try {
    if (editing.value) {
      await adminApi.updateService(editing.value.id, form.value)
    } else {
      await adminApi.createService(form.value)
    }
    cancelEdit()
    await fetchServices()
  } catch (e) { alert('保存失败') }
}

async function toggleActive(s) {
  try {
    await adminApi.updateService(s.id, { ...s, is_active: !s.is_active })
    await fetchServices()
  } catch (e) { alert('操作失败') }
}

async function moveUp(index) {
  if (index <= 0) return
  const list = [...services.value]
  const swap = list[index]
  list[index] = list[index - 1]
  list[index - 1] = swap
  await saveOrder(list)
}

async function moveDown(index) {
  if (index >= services.value.length - 1) return
  const list = [...services.value]
  const swap = list[index]
  list[index] = list[index + 1]
  list[index + 1] = swap
  await saveOrder(list)
}

async function saveOrder(list) {
  services.value = list
  const orders = list.map((s, i) => ({ id: s.id, sort_order: i }))
  try {
    await adminApi.reorderServices(orders)
  } catch (e) {
    alert('排序保存失败')
    await fetchServices()
  }
}
</script>

<style scoped>
.manage__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.manage-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.manage-form__actions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
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
}

.manage-table td .btn {
  margin-right: var(--space-1);
}

.sort-btns {
  display: flex;
  gap: 2px;
}

.sort-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-white);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-600);
  transition: all 0.1s;
}

.sort-btn:hover:not(:disabled) {
  background: var(--color-gray-100);
  border-color: var(--color-gray-400);
}

.sort-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.status-dot--active {
  background: var(--color-completed);
}

.status-dot--inactive {
  background: var(--color-gray-300);
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
