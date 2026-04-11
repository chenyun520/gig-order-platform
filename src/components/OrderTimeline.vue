<template>
  <div class="timeline">
    <div
      v-for="(step, i) in steps"
      :key="step.key"
      class="timeline-step"
      :class="{
        'timeline-step--active': step.active,
        'timeline-step--done': step.done,
      }"
    >
      <div class="timeline-step__dot" />
      <div class="timeline-step__line" v-if="i < steps.length - 1" />
      <div class="timeline-step__content">
        <span class="timeline-step__label">{{ step.label }}</span>
        <span v-if="step.time" class="timeline-step__time">{{ step.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: { type: Object, required: true },
})

const statusFlow = ['pending', 'paid', 'confirmed', 'in_progress', 'delivered', 'completed']
const statusLabels = {
  pending: '待付款',
  paid: '已付款',
  confirmed: '已确认',
  in_progress: '进行中',
  delivered: '已交付',
  completed: '已完成',
  rejected: '已拒绝',
}

const steps = computed(() => {
  const currentIdx = statusFlow.indexOf(props.order.status)
  const isRejected = props.order.status === 'rejected'

  return statusFlow.map((key, i) => {
    const timeField = `${key}_at`
    return {
      key,
      label: statusLabels[key],
      done: !isRejected && i < currentIdx,
      active: !isRejected && i === currentIdx,
      time: props.order[timeField]
        ? new Date(props.order[timeField]).toLocaleString('zh-CN')
        : null,
    }
  })
})
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: var(--space-6);
}

.timeline-step {
  position: relative;
  padding-bottom: var(--space-5);
  padding-left: var(--space-4);
}

.timeline-step:last-child {
  padding-bottom: 0;
}

.timeline-step__dot {
  position: absolute;
  left: -9px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: var(--radius-circle);
  border: 2px solid var(--color-gray-300);
  background: var(--color-white);
}

.timeline-step--done .timeline-step__dot {
  background: var(--color-black);
  border-color: var(--color-black);
}

.timeline-step--active .timeline-step__dot {
  background: var(--color-white);
  border-color: var(--color-black);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.timeline-step__line {
  position: absolute;
  left: -5px;
  top: 16px;
  bottom: 0;
  width: 2px;
  background: var(--color-gray-200);
}

.timeline-step--done .timeline-step__line {
  background: var(--color-black);
}

.timeline-step__content {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.timeline-step__label {
  font-weight: 450;
  font-size: 1rem;
}

.timeline-step--active .timeline-step__label {
  font-weight: 700;
}

.timeline-step--done .timeline-step__label {
  color: var(--color-gray-500);
}

.timeline-step__time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-gray-400);
}
</style>
