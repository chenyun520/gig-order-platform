<template>
  <router-link :to="`/service/${service.id}`" class="service-card card">
    <div class="service-card__icon">{{ iconMap[service.icon] || '📋' }}</div>
    <h3 class="service-card__title">{{ service.title }}</h3>
    <p class="service-card__desc">{{ service.description }}</p>
    <div class="service-card__price">
      <span v-if="service.price_type !== 'quote'" class="service-card__amount">
        ¥{{ service.price }}<small>/{{ service.unit }}</small>
      </span>
      <span v-else class="service-card__amount service-card__amount--quote">询价</span>
      <span class="service-card__cta">立即下单 →</span>
    </div>
  </router-link>
</template>

<script setup>
const iconMap = {
  slides: '📑',
  code: '💻',
  image: '🎨',
  data: '📊',
  doc: '📝',
}

defineProps({
  service: { type: Object, required: true },
})
</script>

<style scoped>
.service-card {
  display: block;
  padding: var(--space-6);
  text-decoration: none;
  color: var(--color-black);
  transition: box-shadow 0.2s, transform 0.2s;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.service-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-3);
}

.service-card__title {
  margin-bottom: var(--space-2);
}

.service-card__desc {
  font-size: 0.9375rem;
  color: var(--color-gray-500);
  line-height: 1.5;
  margin-bottom: var(--space-4);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-card__price {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.service-card__amount {
  font-size: 1.25rem;
  font-weight: 700;
  font-feature-settings: "tnum";
}

.service-card__amount small {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-gray-400);
}

.service-card__amount--quote {
  color: var(--color-gray-500);
  font-weight: 450;
  font-size: 1rem;
}

.service-card__cta {
  font-size: 0.8125rem;
  font-weight: 540;
  opacity: 0;
  transition: opacity 0.2s;
}

.service-card:hover .service-card__cta {
  opacity: 1;
}
</style>
