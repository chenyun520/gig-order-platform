<template>
  <div class="app">
    <WebcamPixelGrid v-if="!isAdmin" @done="introDone = true" />
    <NavBar v-if="!isAdmin" />
    <router-view />
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Toast from './components/Toast.vue'
import WebcamPixelGrid from './components/WebcamPixelGrid.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const introDone = ref(false)
</script>
