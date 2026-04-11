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

    <div class="order-form__actions">
      <button type="button" class="btn btn-primary btn-lg order-form__btn" :disabled="submitting" @click="submit('pay')">
        {{ submitting === 'pay' ? '提交中...' : '立即支付' }}
      </button>
      <button type="button" class="btn btn-outline btn-lg order-form__btn" :disabled="submitting" @click="submit('quote')">
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

const submitting = ref(false)

async function submit(mode) {
  if (!form.contact_name || !form.contact_phone) return
  submitting.value = mode
  try {
    emit('submitted', { ...form, service_id: props.service.id }, mode)
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
</style>
