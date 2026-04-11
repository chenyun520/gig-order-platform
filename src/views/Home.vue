<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-content">
        <span class="mono-label hero-tag">专业 · 高效 · 靠谱</span>
        <h1 class="hero-title">从课件到网页<br />一站式设计服务</h1>
        <p class="hero-desc">课件制作 · 网页开发 · 海报设计 · 数据处理 · 文档排版</p>
        <div class="hero-actions">
          <a href="#services" class="btn btn-white btn-lg">浏览服务</a>
          <router-link to="/order/query" class="btn btn-glass btn-lg" style="color: #fff">查询订单</router-link>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="section">
      <div class="container">
        <h2 class="section-title">服务项目</h2>
        <p class="section-subtitle">选择你需要的专业服务</p>
        <div v-if="loading" class="services-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton skeleton-icon"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text skeleton-text--short"></div>
          </div>
        </div>
        <div v-else class="services-grid">
          <ServiceCard v-for="s in services" :key="s.id" :service="s" />
        </div>
      </div>
    </section>

    <!-- More Cases -->
    <section class="section section--light">
      <div class="container" style="text-align: center">
        <h2 class="section-title">更多案例</h2>
        <p class="section-subtitle">浏览更多设计作品与项目案例</p>
        <a href="https://www.cherishbloom.top/" target="_blank" rel="noopener" class="btn btn-primary btn-lg cases-btn">
          查看案例作品
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section section--dark">
      <div class="container contact">
        <h2 class="section-title" style="color: var(--color-white)">联系我</h2>
        <p class="section-subtitle" style="color: rgba(255,255,255,0.6)">
          有任何疑问？随时联系我咨询
        </p>
        <div class="contact-cards">
          <!-- QQ Bloom Button -->
          <button class="bloom-btn" @click="copyToClipboard('826857706', 'QQ号已复制')">
            <div class="bloom-container">
              <div class="button-container-main">
                <div class="button-inner">
                  <div class="back qq-back"></div>
                  <div class="front qq-front">
                    <svg class="bloom-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                </div>
                <div class="button-glass">
                  <div class="back"></div>
                  <div class="front"></div>
                </div>
              </div>
              <div class="bloom bloom1"></div>
              <div class="bloom bloom2"></div>
            </div>
            <span class="bloom-label">QQ</span>
            <span class="bloom-hint">点击复制</span>
          </button>

          <!-- WeChat Bloom Button -->
          <button class="bloom-btn" @click="copyToClipboard('ZQFservice', '微信号已复制')">
            <div class="bloom-container">
              <div class="button-container-main">
                <div class="button-inner">
                  <div class="back wx-back"></div>
                  <div class="front wx-front">
                    <svg class="bloom-svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.68 4.025c-3.837 0-6.953 2.708-6.953 6.048 0 3.342 3.116 6.048 6.953 6.048.748 0 1.47-.1 2.15-.3a.714.714 0 01.574.08l1.432.84a.276.276 0 00.14.045.24.24 0 00.234-.236c0-.058-.023-.115-.038-.17l-.294-1.12a.477.477 0 01.17-.533c1.478-1.094 2.39-2.761 2.39-4.654 0-3.34-3.117-6.048-6.954-6.048h.2zm-2.136 3.34c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948zm4.272 0c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948z"/>
                    </svg>
                  </div>
                </div>
                <div class="button-glass">
                  <div class="back"></div>
                  <div class="front"></div>
                </div>
              </div>
              <div class="bloom bloom1"></div>
              <div class="bloom bloom2"></div>
            </div>
            <span class="bloom-label">微信</span>
            <span class="bloom-hint">点击复制</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import serviceApi from '../api/services'
import ServiceCard from '../components/ServiceCard.vue'
import { useToast } from '../composables/useToast'

const route = useRoute()
const toast = useToast()
const services = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await serviceApi.getList()
    services.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

  // Handle hash scroll from other pages
  if (route.hash === '#contact') {
    await nextTick()
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }
})

function copyToClipboard(text, msg) {
  navigator.clipboard.writeText(text).then(() => {
    toast.show(msg)
  }).catch(() => {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    toast.show(msg)
  })
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #22c55e 0%, #eab308 25%, #8b5cf6 60%, #ec4899 100%);
  padding: var(--space-12) 0;
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.hero-content {
  color: var(--color-white);
}

.hero-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  margin-bottom: var(--space-4);
  color: var(--color-white);
  font-size: 0.8125rem;
  letter-spacing: 0.54px;
}

.hero-title {
  color: var(--color-white);
  margin-bottom: var(--space-4);
  max-width: 600px;
}

.hero-desc {
  font-size: 1.25rem;
  font-weight: 340;
  opacity: 0.9;
  letter-spacing: -0.1px;
  margin-bottom: var(--space-6);
}

.hero-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.section {
  padding: var(--space-12) 0;
}

.section--dark {
  background: var(--color-gray-900);
}

.section--light {
  background: var(--color-gray-100);
}

.section-title {
  margin-bottom: var(--space-2);
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 340;
  color: var(--color-gray-500);
  margin-bottom: var(--space-8);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.cases-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

@media (max-width: 960px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  .hero {
    min-height: 50vh;
    padding: var(--space-8) 0;
  }
}

.loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-gray-400);
}

.skeleton-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.skeleton {
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-bottom: var(--space-3);
}

.skeleton-title {
  width: 60%;
  height: 20px;
  margin-bottom: var(--space-2);
}

.skeleton-text {
  width: 100%;
  height: 14px;
  margin-bottom: var(--space-1);
}

.skeleton-text--short {
  width: 40%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.contact {
  text-align: center;
}

.contact-cards {
  display: flex;
  justify-content: center;
  gap: var(--space-10);
  margin-top: var(--space-6);
  flex-wrap: wrap;
}

.contact-hint {
  margin-top: var(--space-5);
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
}

/* ============================================
   Bloom Button Styles
   ============================================ */
.bloom-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.bloom-btn .bloom-container {
  position: relative;
  transition: all 0.2s ease-in-out;
}

.bloom-btn .bloom-container .button-container-main {
  width: 110px;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: grid;
  place-content: center;
  border-right: 5px solid white;
  border-left: 5px solid rgba(128, 128, 128, 0.147);
  transform: rotate(-45deg);
  transition: all 0.5s ease-in-out;
}

.bloom-btn .bloom-container .button-container-main .button-inner {
  height: 60px;
  aspect-ratio: 1;
  border-radius: 50%;
  position: relative;
  box-shadow: rgba(100, 100, 111, 0.5) -10px 5px 10px 0px;
  transition: all 0.5s ease-in-out;
}

.bloom-btn .bloom-container .button-container-main .button-inner .back {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.bloom-btn .bloom-container .button-container-main .button-inner .front {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  display: grid;
  place-content: center;
}

/* QQ Colors */
.qq-back {
  background: linear-gradient(60deg, rgb(0, 140, 255) 0%, rgb(100, 200, 255) 100%);
}
.qq-front {
  background: linear-gradient(60deg, rgb(0, 120, 215) 0%, rgb(60, 175, 255) 100%);
}

/* WeChat Colors */
.wx-back {
  background: linear-gradient(60deg, rgb(7, 193, 96) 0%, rgb(76, 230, 140) 100%);
}
.wx-front {
  background: linear-gradient(60deg, rgb(6, 165, 80) 0%, rgb(50, 200, 100) 100%);
}

.bloom-btn .bloom-container .button-container-main .button-inner .front .bloom-svg {
  fill: #ffffff;
  opacity: 0.5;
  width: 30px;
  aspect-ratio: 1;
  transform: rotate(45deg);
  transition: all 0.2s ease-in;
}

.bloom-btn .bloom-container .button-container-main .button-glass {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.888) 100%);
  transform: translate(0%, -50%) rotate(0deg);
  transform-origin: bottom center;
  transition: all 0.5s ease-in-out;
}

.bloom-btn .bloom-container .bloom {
  height: 1px;
  width: 1px;
  position: absolute;
  background: white;
}

.bloom-btn .bloom-container .bloom1 {
  top: 10px;
  right: 20px;
  box-shadow:
    rgb(255, 255, 255) 0px 0px 10px 10px,
    rgb(255, 255, 255) 0px 0px 20px 20px;
}

.bloom-btn .bloom-container .bloom2 {
  bottom: 10px;
  left: 20px;
  box-shadow:
    rgba(255, 255, 255, 0.5) 0px 0px 10px 10px,
    rgba(255, 255, 255, 0.5) 0px 0px 30px 20px;
}

.bloom-btn .bloom-container:hover {
  transform: scale(1.1);
}

.bloom-btn .bloom-container:hover .button-container-main .button-glass {
  transform: translate(0%, -40%);
}

.bloom-btn .bloom-container:hover .button-container-main .button-inner .front .bloom-svg {
  opacity: 1;
  filter: drop-shadow(0 0 10px white);
}

.bloom-btn .bloom-container:active {
  transform: scale(0.7);
}

.bloom-btn .bloom-container:active .button-container-main .button-inner {
  transform: scale(1.2);
}

.bloom-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.5);
}

.bloom-value {
  font-size: 1.125rem;
  font-weight: 540;
  color: var(--color-white);
  letter-spacing: -0.01em;
}

.bloom-hint {
  font-size: 0.8125rem;
  font-weight: 340;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: -0.01em;
}
</style>
