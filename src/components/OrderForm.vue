<template>
  <form class="order-form" @submit.prevent="submit('pay')">
    <h3 class="order-form__title">
      <template v-if="service.price_type !== 'quote'">
        下单 — ¥{{ service.price }}/{{ service.unit }}
      </template>
      <template v-else>
        提交需求
      </template>
    </h3>

    <div class="field">
      <label class="field__label">姓名 *</label>
      <input v-model="form.contact_name" class="field__input" placeholder="你的姓名" required />
    </div>

    <div class="field">
      <label class="field__label">手机号 *</label>
      <input v-model="form.contact_phone" class="field__input" type="tel" placeholder="用于查询订单状态" required />
    </div>

    <div class="field">
      <label class="field__label">需求描述</label>
      <textarea v-model="form.requirement_desc" class="field__input field__textarea" placeholder="请详细描述你的需求..." rows="4"></textarea>
    </div>

    <!-- File upload -->
    <div class="field">
      <label class="field__label">附件材料</label>
      <div class="order-form__files">
        <div class="order-form__file-item" v-for="(f, i) in selectedFiles" :key="i">
          <span class="order-form__file-name">{{ f.name }}</span>
          <span class="order-form__file-size">{{ formatSize(f.size) }}</span>
          <button type="button" class="order-form__file-remove" @click="removeFile(i)">&times;</button>
        </div>
        <label class="order-form__file-add" v-if="selectedFiles.length < 5">
          <input type="file" multiple @change="onFileSelect" style="display:none" />
          <span>+ 选择文件</span>
        </label>
        <p class="order-form__file-hint">最多5个文件，单个不超过4MB</p>
      </div>
    </div>

    <div class="order-form__actions">
      <button type="button" class="btn btn-primary btn-lg order-form__btn" :disabled="!!submitting" @click="submit('pay')">
        {{ submitting === 'pay' ? '提交中...' : '立即支付' }}
      </button>
      <button type="button" class="btn btn-outline btn-lg order-form__btn" :disabled="!!submitting" @click="submit('quote')">
        {{ submitting === 'quote' ? '提交中...' : '提需求获取报价' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  service: { type: Object, required: true },
})

const emit = defineEmits(['submitted'])

const form = reactive({
  contact_name: '',
  contact_phone: '',
  requirement_desc: '',
})

const selectedFiles = ref([])
const submitting = ref(false)

function onFileSelect(e) {
  const files = Array.from(e.target.files)
  const valid = files.filter(f => {
    if (f.size > 4 * 1024 * 1024) {
      alert(`${f.name} 超过4MB限制`)
      return false
    }
    return true
  })
  selectedFiles.value = [...selectedFiles.value, ...valid].slice(0, 5)
  e.target.value = ''
}

function removeFile(i) {
  selectedFiles.value.splice(i, 1)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}

async function submit(mode) {
  if (!form.contact_name || !form.contact_phone) return
  submitting.value = mode
  try {
    emit('submitted', { ...form, service_id: props.service.id }, mode, [...selectedFiles.value])
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.order-form {
  max-width: 480px;
}

.order-form__title {
  margin-bottom: var(--space-5);
}

.field {
  margin-bottom: var(--space-4);
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
  background: var(--color-white);
  transition: border-color 0.15s;
}

.field__input:focus {
  outline: dashed 2px var(--color-black);
  outline-offset: -2px;
  border-color: transparent;
}

.field__textarea {
  resize: vertical;
  min-height: 100px;
}

.order-form__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.order-form__btn {
  width: 100%;
}

/* File upload area */
.order-form__files {
  border: 2px dashed var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
}

.order-form__file-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 10px;
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-1);
  font-size: 0.875rem;
}

.order-form__file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-form__file-size {
  color: var(--color-gray-400);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.order-form__file-remove {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0 4px;
  line-height: 1;
}

.order-form__file-remove:hover {
  color: var(--color-rejected);
}

.order-form__file-add {
  display: block;
  text-align: center;
  padding: var(--space-2);
  cursor: pointer;
  color: var(--color-gray-500);
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.order-form__file-add:hover {
  background: var(--color-gray-200);
}

.order-form__file-hint {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-gray-400);
  margin-top: var(--space-1);
}
</style>
