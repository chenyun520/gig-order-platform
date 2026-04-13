<template>
  <div class="app">
    <IntroAnimation v-if="!isAdmin" @done="introDone = true" />
    <NavBar v-if="!isAdmin" />
    <router-view />
    <Footer v-if="!isAdmin" />
    <Toast />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Toast from './components/Toast.vue'
import IntroAnimation from './components/IntroAnimation.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const introDone = ref(false)
</script>
