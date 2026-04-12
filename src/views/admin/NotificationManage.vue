<template>
  <div class="noti-manage">
    <div class="noti-manage__header">
      <h2 class="noti-manage__title">通知通告管理</h2>
      <button class="btn btn-primary" @click="openEditor()">+ 新建通知</button>
    </div>

    <div v-if="loading" style="padding: 2rem; text-align: center; color: var(--color-gray-400)">加载中...</div>

    <div v-else-if="!list.length" style="padding: 2rem; text-align: center; color: var(--color-gray-400)">暂无通知</div>

    <div v-else class="noti-list">
      <div v-for="n in list" :key="n.id" class="noti-card" :class="{ 'noti-card--inactive': !n.is_active }">
        <div class="noti-card__main">
          <div class="noti-card__top">
            <h3 class="noti-card__title">{{ n.title }}</h3>
            <div class="noti-card__badges">
              <span v-if="n.is_pinned" class="badge badge--pinned">置顶</span>
              <span :class="['badge', n.is_active ? 'badge--active' : 'badge--inactive']">
                {{ n.is_active ? '已发布' : '已隐藏' }}
              </span>
            </div>
          </div>
          <p class="noti-card__content">{{ n.content }}</p>
          <span class="noti-card__time">{{ formatDate(n.created_at) }}</span>
        </div>
        <div class="noti-card__actions">
          <button class="btn btn-sm btn-outline" @click="openEditor(n)">编辑</button>
          <button class="btn btn-sm btn-outline" @click="toggleActive(n)">
            {{ n.is_active ? '隐藏' : '发布' }}
          </button>
          <button class="btn btn-sm" style="color: var(--color-rejected)" @click="remove(n.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- Editor Modal -->
    <div class="modal-overlay" v-if="editing" @click.self="editing = null">
      <div class="modal-box">
        <h3 class="modal-box__title">{{ editing.id ? '编辑通知' : '新建通知' }}</h3>
        <div class="field">
          <label class="field__label">标题 *</label>
          <input v-model="editing.title" class="field__input" placeholder="通知标题" />
        </div>
        <div class="field">
          <label class="field__label">内容</label>
          <textarea v-model="editing.content" class="field__input field__textarea" placeholder="通知内容..." rows="4"></textarea>
        </div>
        <div class="field" style="display:flex; gap: 1rem; align-items: center;">
          <label style="display:flex; align-items:center; gap: 6px; cursor:pointer">
            <input type="checkbox" v-model="editing.is_pinned" /> 置顶
          </label>
          <label style="display:flex; align-items:center; gap: 6px; cursor:pointer">
            <input type="checkbox" v-model="editing.is_active" /> 发布
          </label>
        </div>
        <div class="modal-box__actions">
          <button class="btn btn-primary" @click="save" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button class="btn btn-outline" @click="editing = null">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminApi from '../../api/admin'

const list = ref([])
const loading = ref(true)
const editing = ref(null)
const saving = ref(false)

onMounted(fetchList)

async function fetchList() {
  try {
    const res = await adminApi.getNotifications()
    if (res.code === 0) list.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openEditor(item) {
  editing.value = item
    ? { ...item }
    : { title: '', content: '', is_pinned: false, is_active: true }
}

async function save() {
  if (!editing.value.title) return alert('请输入标题')
  saving.value = true
  try {
    const res = editing.value.id
      ? await adminApi.updateNotification(editing.value.id, editing.value)
      : await adminApi.createNotification(editing.value)
    if (res.code === 0) {
      editing.value = null
      await fetchList()
    } else {
      alert(res.message)
    }
  } catch (e) {
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

async function toggleActive(item) {
  try {
    const res = await adminApi.updateNotification(item.id, {
      ...item,
      is_active: !item.is_active,
    })
    if (res.code === 0) await fetchList()
  } catch (e) {
    alert('操作失败')
  }
}

async function remove(id) {
  if (!confirm('确定删除此通知？')) return
  try {
    const res = await adminApi.deleteNotification(id)
    if (res.code === 0) await fetchList()
  } catch (e) {
    alert('删除失败')
  }
}

function formatDate(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.noti-manage__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.noti-manage__title {
  margin: 0;
}

.noti-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.noti-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.noti-card--inactive {
  opacity: 0.6;
}

.noti-card__main {
  flex: 1;
}

.noti-card__top {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.noti-card__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.noti-card__badges {
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 0.6875rem;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 500;
}

.badge--pinned {
  background: #fef3c7;
  color: #92400e;
}

.badge--active {
  background: #d1fae5;
  color: #065f46;
}

.badge--inactive {
  background: var(--color-gray-200);
  color: var(--color-gray-500);
}

.noti-card__content {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin: var(--space-1) 0;
  white-space: pre-line;
}

.noti-card__time {
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

.noti-card__actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: var(--space-4);
}

.modal-box {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 500px;
  width: 100%;
}

.modal-box__title {
  margin-bottom: var(--space-5);
}

.modal-box__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.field {
  margin-bottom: var(--space-3);
}

.field__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 450;
  margin-bottom: var(--space-1);
}

.field__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-family: var(--font-sans);
  background: var(--color-white);
  box-sizing: border-box;
}

.field__textarea {
  resize: vertical;
  min-height: 80px;
}
</style>
