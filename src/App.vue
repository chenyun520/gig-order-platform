<template>
  <div class="app">
    <NavBar v-if="!isAdmin" />
    <router-view />
    <Footer v-if="!isAdmin" />
    <Toast />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>
