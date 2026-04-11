<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.visible.value" class="toast">{{ toast.message.value }}</div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast'
const toast = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 10px 24px;
  border-radius: 50px;
  background: var(--color-black);
  color: var(--color-white);
  font-size: 0.9375rem;
  font-weight: 450;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.toast-enter-active { animation: toast-in 0.25s ease-out; }
.toast-leave-active { animation: toast-out 0.2s ease-in; }

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(-12px); }
}
</style>
