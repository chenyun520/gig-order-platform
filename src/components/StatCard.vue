<template>
  <div class="stat-card card">
    <span class="stat-card__label">{{ label }}</span>
    <span class="stat-card__value" :style="{ color: color || 'var(--color-black)' }">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  color: { type: String, default: '' },
})
</script>

<style scoped>
.stat-card {
  padding: var(--space-5);
}

.stat-card__label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--color-gray-500);
  margin-bottom: var(--space-2);
}

.stat-card__value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  font-feature-settings: "tnum";
}
</style>
