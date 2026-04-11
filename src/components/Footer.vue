<template>
  <footer class="footer">
    <div class="container footer-inner">
      <span class="footer__brand">张千帆设计公司</span>
      <span class="footer__copy">&copy; {{ year }} All rights reserved.</span>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-200);
  padding: var(--space-4) 0;
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.footer__brand {
  font-weight: 540;
  font-size: 0.875rem;
}

.footer__copy {
  font-size: 0.8125rem;
  color: var(--color-gray-400);
}
</style>
