<template>
  <div class="home">
    <!-- Hero — scroll-driven canvas + 3D animation -->
    <section class="hero" ref="heroSection">
      <canvas ref="heroCanvas"></canvas>
      <div class="hero-content-layer">
        <div class="header" ref="heroHeader">
          <span class="hero-eyebrow">ZQF Design Studio</span>
          <h1 class="hero-title">
            <span class="hero-title-line">Design</span>
            <span class="hero-title-line hero-title-italic">that</span>
            <span class="hero-title-line">delivers.</span>
          </h1>
          <p class="hero-tagline">课件 · 网页 · 海报 · 数据 · 排版</p>
        </div>
      </div>
      <div class="hero-img-container">
        <div class="hero-img" ref="heroImg">
          <div class="hero-fly-text">
            <p class="loader"><span>张千帆设计公司</span></p>
            <span class="hero-fly-line">专业 · 高效 · 用心</span>
            <span class="hero-fly-line hero-fly-line--thin">每一份交付都值得认真对待</span>
            <div class="hero-fly-tags">
              <span>课件设计</span>
              <span>网页开发</span>
              <span>海报排版</span>
              <span>数据处理</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notifications Banner -->
    <section class="noti-banner" v-if="notifications.length">
      <div class="container">
        <div class="noti-banner__inner">
          <div class="noti-banner__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <div class="noti-banner__content">
            <div v-for="n in notifications" :key="n.id" class="noti-banner__item">
              <strong>{{ n.title }}</strong>
              <span v-if="n.content">{{ n.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="section">
      <div class="container">
        <div class="services-header">
          <div>
            <h2 class="section-title">服务项目</h2>
            <p class="section-subtitle">选择你需要的专业服务</p>
          </div>
          <div class="search-wrap">
            <div class="search-poda">
              <div class="search-glow"></div>
              <div class="search-dark-border"></div>
              <div class="search-dark-border"></div>
              <div class="search-dark-border"></div>
              <div class="search-white"></div>
              <div class="search-border"></div>
              <div class="search-main">
                <input placeholder="搜索服务..." type="text" v-model="searchQuery" class="search-input" />
                <div class="search-input-mask"></div>
                <div class="search-pink-mask"></div>
                <div class="search-filter-border"></div>
                <div class="search-filter-icon">
                  <svg preserveAspectRatio="none" height="27" width="27" viewBox="4.8 4.56 14.832 15.408" fill="none">
                    <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" stroke-width="1" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
                <div class="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" height="24" fill="none">
                    <circle stroke="url(#searchGrad)" r="8" cy="11" cx="11"></circle>
                    <line stroke="url(#searchGradL)" y2="16.65" y1="22" x2="16.65" x1="22"></line>
                    <defs>
                      <linearGradient gradientTransform="rotate(50)" id="searchGrad">
                        <stop stop-color="#f8e7f8" offset="0%"></stop>
                        <stop stop-color="#b6a9b7" offset="50%"></stop>
                      </linearGradient>
                      <linearGradient id="searchGradL">
                        <stop stop-color="#b6a9b7" offset="0%"></stop>
                        <stop stop-color="#837484" offset="50%"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="services-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton skeleton-icon"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text skeleton-text--short"></div>
          </div>
        </div>
        <div v-else-if="filteredServices.length" class="services-grid">
          <ServiceCard v-for="s in filteredServices" :key="s.id" :service="s" />
        </div>
        <div v-else class="search-empty">
          <p>没有找到匹配「{{ searchQuery }}」的服务</p>
        </div>
      </div>
    </section>

    <!-- More Cases — warm section -->
    <section class="section cases-section">
      <div class="container">
        <div class="cases-inner">
          <div class="cases-left">
            <span class="mono-label cases-tag">Portfolio</span>
            <h2 class="cases-title">每个项目<br/>都值得认真设计</h2>
            <p class="cases-desc">从课件排版到品牌网页，每一份交付都经过打磨。添加好友查看完整作品集，找到你需要的风格。</p>
            <button class="cases-btn" @click="showCaseModal = true">
              <span>查看案例作品</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
          <div class="cases-right">
            <div class="cases-card">
              <div class="cases-card__img cases-card__img--1"></div>
              <span class="cases-card__label">Courseware Design</span>
            </div>
            <div class="cases-card">
              <div class="cases-card__img cases-card__img--2"></div>
              <span class="cases-card__label">Web Development</span>
            </div>
            <div class="cases-card">
              <div class="cases-card__img cases-card__img--3"></div>
              <span class="cases-card__label">Visual Design</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="cases-stats">
          <div class="stat">
            <span class="stat-num">200+</span>
            <span class="stat-label">完成项目</span>
          </div>
          <div class="stat">
            <span class="stat-num">50+</span>
            <span class="stat-label">合作客户</span>
          </div>
          <div class="stat">
            <span class="stat-num">99%</span>
            <span class="stat-label">好评率</span>
          </div>
          <div class="stat">
            <span class="stat-num">24h</span>
            <span class="stat-label">响应时间</span>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" v-if="showCaseModal" @click.self="showCaseModal = false">
        <div class="modal-box">
          <h3 class="modal-title">查看案例作品</h3>
          <p class="modal-desc">请添加好友查看更多案例作品，沟通更方便~</p>
          <div class="modal-contact-btns">
            <button class="modal-contact-btn qq" @click="copyToClipboard('826857706', 'QQ号已复制，快去添加好友吧~')">
              <svg viewBox="0 0 16 16" fill="currentColor" width="24" height="24"><path d="M6.048 3.323c.022.277-.13.523-.338.55-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333-.027.048-.008.117.037.15.045.035.092.025.119-.003.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098.023-.063.017-.11-.006-.142-.016-.023-.089-.08-.247-.118"/><path d="M11.727 6.719c0-.022.01-.375.01-.557 0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113.36.044 1.401-1.647 1.401-1.647 0 .979.504 2.256 1.594 3.179-.408.126-.907.319-1.228.556-.29.213-.253.43-.201.518.228.386 3.92.246 4.985.126 1.065.12 4.756.26 4.984-.126.052-.088.088-.305-.2-.518-.322-.237-.822-.43-1.23-.557 1.09-.922 1.594-2.2 1.594-3.178 0 0 1.041 1.69 1.401 1.647.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795Z"/></svg>
              <span>QQ: 826857706</span>
            </button>
            <button class="modal-contact-btn wx" @click="copyToClipboard('ZQFservice', '微信号已复制，快去添加好友吧~')">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.68 4.025c-3.837 0-6.953 2.708-6.953 6.048 0 3.342 3.116 6.048 6.953 6.048.748 0 1.47-.1 2.15-.3a.714.714 0 01.574.08l1.432.84a.276.276 0 00.14.045.24.24 0 00.234-.236c0-.058-.023-.115-.038-.17l-.294-1.12a.477.477 0 01.17-.533c1.478-1.094 2.39-2.761 2.39-4.654 0-3.34-3.117-6.048-6.954-6.048h.2zm-2.136 3.34c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948zm4.272 0c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948z"/></svg>
              <span>微信: ZQFservice</span>
            </button>
          </div>
          <button class="modal-close" @click="showCaseModal = false">关闭</button>
        </div>
      </div>
    </section>

    <!-- Footer — sticky reveal style, unified -->
    <footer id="contact" ref="footerEl">
      <div class="footer-container" ref="footerContainer">
        <div class="footer-content">
          <div class="footer-main-block">
            <div class="footer-left">
              <h2 class="footer-heading">开始你的<br/>下一个项目</h2>
              <p class="footer-tagline">专业设计服务，高效交付，值得信赖</p>
              <div class="footer-icons">
                <div class="glass-btn-wrap">
                  <button class="glass-btn" @click="copyToClipboard('826857706', 'QQ号已复制')">
                    <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.048 3.323c.022.277-.13.523-.338.55-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333-.027.048-.008.117.037.15.045.035.092.025.119-.003.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098.023-.063.017-.11-.006-.142-.016-.023-.089-.08-.247-.118"/><path d="M11.727 6.719c0-.022.01-.375.01-.557 0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113.36.044 1.401-1.647 1.401-1.647 0 .979.504 2.256 1.594 3.179-.408.126-.907.319-1.228.556-.29.213-.253.43-.201.518.228.386 3.92.246 4.985.126 1.065.12 4.756.26 4.984-.126.052-.088.088-.305-.2-.518-.322-.237-.822-.43-1.23-.557 1.09-.922 1.594-2.2 1.594-3.178 0 0 1.041 1.69 1.401 1.647.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795Z"/></svg>
                    <span class="glass-btn-text">QQ</span>
                  </button>
                  <div class="glass-btn-shadow"></div>
                </div>
                <div class="glass-btn-wrap">
                  <button class="glass-btn" @click="copyToClipboard('ZQFservice', '微信号已复制')">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.68 4.025c-3.837 0-6.953 2.708-6.953 6.048 0 3.342 3.116 6.048 6.953 6.048.748 0 1.47-.1 2.15-.3a.714.714 0 01.574.08l1.432.84a.276.276 0 00.14.045.24.24 0 00.234-.236c0-.058-.023-.115-.038-.17l-.294-1.12a.477.477 0 01.17-.533c1.478-1.094 2.39-2.761 2.39-4.654 0-3.34-3.117-6.048-6.954-6.048h.2zm-2.136 3.34c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948zm4.272 0c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948z"/></svg>
                    <span class="glass-btn-text">微信</span>
                  </button>
                  <div class="glass-btn-shadow"></div>
                </div>
              </div>
            </div>
            <div class="footer-right">
              <div class="footer-links-col">
                <router-link to="/order/query" class="footer-link-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  查询订单
                </router-link>
                <a class="footer-link-pill" @click="showCaseModal = true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  查看案例
                </a>
                <router-link to="/admin/login" class="footer-link-pill footer-link-pill--subtle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  管理后台
                </router-link>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <span class="footer-brand">
              <img src="/logo.png" alt="" class="footer-logo" />
              张千帆设计公司
            </span>
            <span class="footer-copy">&copy; {{ year }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import serviceApi from '../api/services'
import notificationApi from '../api/notifications'
import ServiceCard from '../components/ServiceCard.vue'
import { useToast } from '../composables/useToast'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const toast = useToast()
const services = ref([])
const notifications = ref([])
const loading = ref(true)
const showCaseModal = ref(false)
const searchQuery = ref('')

// Scroll animation refs
const heroSection = ref(null)
const heroCanvas = ref(null)
const heroHeader = ref(null)
const heroImg = ref(null)
const footerEl = ref(null)
const footerContainer = ref(null)
let lenis = null
let scrollTriggerInstance = null
let footerScrollTrigger = null
let frameImages = []
let videoFrames = { frame: 0 }

const year = new Date().getFullYear()

const frameCount = 198
let framesLoaded = false

const filteredServices = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return services.value
  return services.value.filter(s =>
    s.title.toLowerCase().includes(q) ||
    (s.description && s.description.toLowerCase().includes(q))
  )
})

// Preload frame images immediately (during intro animation)
function preloadFrames() {
  frameImages = []
  let imagesToLoad = frameCount
  const onLoad = () => {
    imagesToLoad--
    if (imagesToLoad <= 0) framesLoaded = true
    // Render first frame ASAP to avoid white flash
    if (imagesToLoad === frameCount - 1 && heroCanvas.value) {
      renderFirstFrame()
    }
  }
  for (let i = 0; i < frameCount; i++) {
    const img = new Image()
    img.onload = onLoad
    img.onerror = onLoad
    img.src = `/frames/Image${i + 1}.jpg`
    frameImages.push(img)
  }
}
preloadFrames()

// Render first frame on canvas as soon as it loads
function renderFirstFrame() {
  const canvas = heroCanvas.value
  if (!canvas) return
  const context = canvas.getContext('2d')
  const img = frameImages[0]
  if (!img || !img.complete || !img.naturalWidth) return

  const pixelRatio = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * pixelRatio
  canvas.height = window.innerHeight * pixelRatio
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  const w = window.innerWidth
  const h = window.innerHeight
  const imageAspect = img.naturalWidth / img.naturalHeight
  const canvasAspect = w / h
  let dw, dh, dx, dy
  if (imageAspect > canvasAspect) {
    dh = h; dw = dh * imageAspect; dx = (w - dw) / 2; dy = 0
  } else {
    dw = w; dh = dw / imageAspect; dx = 0; dy = (h - dh) / 2
  }
  context.drawImage(img, dx, dy, dw, dh)
}

function initScrollAnimation() {
  // Lenis smooth scroll
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  if (!heroSection.value || !heroHeader.value) return

  const canvas = heroCanvas.value
  const context = canvas ? canvas.getContext('2d') : null
  const hero = heroSection.value
  const header = heroHeader.value
  const heroImageEl = heroImg.value
  const navEl = document.querySelector('.nav')

  // Setup canvas size
  function setCanvasSize() {
    if (!canvas) return
    const pixelRatio = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * pixelRatio
    canvas.height = window.innerHeight * pixelRatio
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }
  setCanvasSize()

  // If frames already preloaded, render immediately; otherwise load them
  if (framesLoaded && frameImages.length === frameCount) {
    render()
    setupScrollTrigger()
  } else {
    // Fallback: load if not preloaded yet
    frameImages = []
    let imagesToLoad = frameCount
    const onLoad = () => {
      imagesToLoad--
      if (imagesToLoad <= 0) {
        framesLoaded = true
        render()
        setupScrollTrigger()
      }
    }
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.onload = onLoad
      img.onerror = onLoad
      img.src = `/frames/Image${i + 1}.jpg`
      frameImages.push(img)
    }
  }

  function render() {
    if (!context) return
    const canvasWidth = window.innerWidth
    const canvasHeight = window.innerHeight
    context.clearRect(0, 0, canvasWidth, canvasHeight)

    const img = frameImages[videoFrames.frame]
    if (img && img.complete && img.naturalWidth > 0) {
      const imageAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = canvasWidth / canvasHeight

      let drawWidth, drawHeight, drawX, drawY
      if (imageAspect > canvasAspect) {
        drawHeight = canvasHeight
        drawWidth = drawHeight * imageAspect
        drawX = (canvasWidth - drawWidth) / 2
        drawY = 0
      } else {
        drawWidth = canvasWidth
        drawHeight = drawWidth / imageAspect
        drawX = 0
        drawY = (canvasHeight - drawHeight) / 2
      }
      context.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    }
  }

  function setupScrollTrigger() {
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: `+=${window.innerHeight * 7}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress

        // Canvas frames advance (0 - 0.9)
        const animationProgress = Math.min(progress / 0.9, 1)
        const targetFrame = Math.round(animationProgress * (frameCount - 1))
        videoFrames.frame = targetFrame
        render()

        // Phase 1: Nav fade out (0 - 0.08)
        if (navEl) {
          if (progress <= 0.08) {
            navEl.style.opacity = 1 - progress / 0.08
          } else if (progress <= 0.95) {
            navEl.style.opacity = 0
          } else {
            // Fade back in at end
            navEl.style.opacity = (progress - 0.95) / 0.05
          }
        }

        // Phase 2: Header pushes back in Z and fades (0 - 0.25)
        if (progress <= 0.25) {
          const zProgress = progress / 0.25
          const translateZ = zProgress * -500
          let opacity = 1
          if (progress >= 0.2) {
            const fadeProgress = Math.min((progress - 0.2) / (0.25 - 0.2), 1)
            opacity = 1 - fadeProgress
          }
          header.style.transform = `translate(-50%, -50%) translateZ(${translateZ}px)`
          header.style.opacity = opacity
        } else {
          header.style.opacity = 0
        }

        // Phase 3: Hero text scale-in (0.6 - 0.9)
        if (heroImageEl) {
          if (progress < 0.6) {
            heroImageEl.style.transform = 'scale(0.6)'
            heroImageEl.style.opacity = 0
          } else if (progress >= 0.6 && progress <= 0.9) {
            const imgProgress = (progress - 0.6) / 0.3
            const scale = 0.6 + imgProgress * 0.4
            const opacity = Math.min(imgProgress * 1.5, 1)
            heroImageEl.style.transform = `scale(${scale})`
            heroImageEl.style.opacity = opacity
          } else {
            heroImageEl.style.transform = 'scale(1)'
            heroImageEl.style.opacity = 1
          }
        }
      },
    })

    // Footer sticky reveal
    if (footerEl.value && footerContainer.value) {
      footerScrollTrigger = ScrollTrigger.create({
        trigger: footerEl.value,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const yValue = -35 * (1 - progress)
          footerContainer.value.style.transform = `translateY(${yValue}%)`
        },
      })
    }
  }

  // Handle resize
  const onResize = () => {
    setCanvasSize()
    render()
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', onResize)
}

function destroyScrollAnimation() {
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
    scrollTriggerInstance = null
  }
  if (footerScrollTrigger) {
    footerScrollTrigger.kill()
    footerScrollTrigger = null
  }
  ScrollTrigger.getAll().forEach(st => st.kill())
  if (lenis) {
    gsap.ticker.remove(lenis.raf)
    lenis.destroy()
    lenis = null
  }
  // Restore nav opacity
  const navEl = document.querySelector('.nav')
  if (navEl) gsap.set(navEl, { opacity: 1 })
}

onMounted(async () => {
  try {
    const res = await serviceApi.getList()
    services.value = res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

  // Fetch notifications
  try {
    const res = await notificationApi.getList()
    if (res.code === 0) notifications.value = res.data || []
  } catch (e) {
    console.error(e)
  }

  // Init scroll animation — event-driven approach
  // Listen for custom 'intro-done' event from IntroAnimation, or init immediately if already seen
  await nextTick()
  if (sessionStorage.getItem('intro_seen')) {
    initScrollAnimation()
  } else {
    const onIntroDone = () => {
      window.removeEventListener('intro-done', onIntroDone)
      setTimeout(initScrollAnimation, 200)
    }
    window.addEventListener('intro-done', onIntroDone)
    // Safety fallback: init after 8s regardless
    setTimeout(() => {
      window.removeEventListener('intro-done', onIntroDone)
      if (!lenis) initScrollAnimation()
    }, 8000)
  }

  // Handle hash scroll from other pages
  if (route.hash === '#contact') {
    await nextTick()
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }
})

onUnmounted(() => {
  destroyScrollAnimation()
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
/* ============================================
   Hero Section — vh-style layout
   ============================================ */
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

.hero canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.hero-content-layer {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.header {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: #241910;
  will-change: transform, opacity;
  transform-origin: center;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  opacity: 0.4;
  color: #241910;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 70%;
}

.hero-title-line {
  font-family: var(--font-sans);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 300;
  line-height: 0.95;
  color: #241910;
  letter-spacing: -0.04em;
}

.hero-title-italic {
  font-style: italic;
  font-weight: 300;
  opacity: 0.6;
}

.hero-tagline {
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  opacity: 0.4;
  color: #241910;
  margin-top: 0.5rem;
}

.hero-img-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.hero-img {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: scale(0.6);
  opacity: 0;
  will-change: transform, opacity;
}

/* Hero fly-in text */
.hero-fly-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
}

.hero-fly-line {
  font-family: var(--font-sans);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  line-height: 1.2;
}

.hero-fly-line--thin {
  font-size: clamp(1rem, 1.8vw, 1.375rem);
  font-weight: 340;
  opacity: 0.65;
  letter-spacing: 0.04em;
}

.hero-fly-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.hero-fly-tags span {
  font-size: 0.875rem;
  padding: 6px 16px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  opacity: 0.7;
  backdrop-filter: blur(4px);
}

/* Scan-line text effect */
.loader {
  max-width: fit-content;
  color: rgb(242, 255, 240);
  font-size: clamp(1.5rem, 3.5vw, 2.5rem);
  font-family: var(--font-sans);
  position: relative;
  font-style: italic;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 0.25rem;
}

.loader span {
  animation: cut 2s infinite;
  transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.loader::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background-color: rgba(255, 130, 130, 0.57);
  top: 0px;
  filter: blur(10px);
  animation: scan 2s infinite;
  left: 0;
  z-index: 0;
  transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.loader::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 5px;
  border-radius: 4px;
  background-color: #ff8282;
  top: 0px;
  animation: scan 2s infinite;
  left: 0;
  z-index: 1;
  filter: opacity(0.9);
  transition: 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scan {
  0% { top: 0px; }
  25% { top: 54px; }
  50% { top: 0px; }
  75% { top: 54px; }
}

@keyframes cut {
  0% { clip-path: inset(0 0 0 0); }
  25% { clip-path: inset(100% 0 0 0); }
  50% { clip-path: inset(0 0 100% 0); }
  75% { clip-path: inset(0 0 0 0); }
}

/* Notification banner */
.noti-banner {
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
}

.noti-banner__inner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) 0;
}

.noti-banner__icon {
  flex-shrink: 0;
  color: #d97706;
  margin-top: 2px;
}

.noti-banner__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.noti-banner__item {
  font-size: 0.9375rem;
  color: #92400e;
  line-height: 1.5;
}

.noti-banner__item strong {
  margin-right: var(--space-2);
}

.section {
  padding: var(--space-12) 0;
}

.section-title {
  margin-bottom: var(--space-2);
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 340;
  color: var(--color-gray-500);
}

/* Services header + search layout */
.services-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-8);
}

.services-header .section-title {
  margin-bottom: var(--space-1);
}

/* Search Input */
.search-wrap {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.search-empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-gray-400);
}

.search-poda {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.search-input {
  background-color: #010201;
  border: none;
  width: 301px;
  height: 56px;
  border-radius: 10px;
  color: white;
  padding-inline: 59px;
  font-size: 16px;
  font-family: var(--font-sans);
}

.search-input::placeholder { color: #c0b9c0; }
.search-input:focus { outline: none; }

.search-main { position: relative; }
.search-main:focus-within > .search-input-mask { display: none; }

.search-input-mask {
  pointer-events: none;
  width: 100px; height: 20px;
  position: absolute;
  background: linear-gradient(90deg, transparent, black);
  top: 18px; left: 70px;
}

.search-pink-mask {
  pointer-events: none;
  width: 30px; height: 20px;
  position: absolute;
  background: #cf30aa;
  top: 10px; left: 5px;
  filter: blur(20px);
  opacity: 0.8;
  transition: all 2s;
}

.search-poda:hover > .search-pink-mask { opacity: 0; }

.search-white,
.search-border,
.search-dark-border,
.search-glow {
  max-height: 70px; max-width: 314px;
  height: 100%; width: 100%;
  position: absolute;
  overflow: hidden; z-index: -1;
  border-radius: 12px;
  filter: blur(3px);
}

.search-white { max-height: 63px; max-width: 307px; border-radius: 10px; filter: blur(2px); }
.search-white::before {
  content: ""; z-index: -2; position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(83deg);
  width: 600px; height: 600px;
  background-repeat: no-repeat;
  filter: brightness(1.4);
  background-image: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%);
  transition: all 2s;
}

.search-border { max-height: 59px; max-width: 303px; border-radius: 11px; filter: blur(0.5px); }
.search-border::before {
  content: ""; z-index: -2; position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(70deg);
  width: 600px; height: 600px;
  filter: brightness(1.3);
  background-repeat: no-repeat;
  background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%);
  transition: all 2s;
}

.search-dark-border { max-height: 65px; max-width: 312px; }
.search-dark-border::before {
  content: ""; z-index: -2; position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(82deg);
  width: 600px; height: 600px;
  background-repeat: no-repeat;
  background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%);
  transition: all 2s;
}

.search-glow {
  overflow: hidden; filter: blur(30px); opacity: 0.4;
  max-height: 130px; max-width: 354px;
}
.search-glow::before {
  content: ""; z-index: -2; position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(60deg);
  width: 999px; height: 999px;
  background-repeat: no-repeat;
  background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%);
  transition: all 2s;
}

.search-poda:hover > .search-dark-border::before { transform: translate(-50%, -50%) rotate(-98deg); }
.search-poda:hover > .search-glow::before { transform: translate(-50%, -50%) rotate(-120deg); }
.search-poda:hover > .search-white::before { transform: translate(-50%, -50%) rotate(-97deg); }
.search-poda:hover > .search-border::before { transform: translate(-50%, -50%) rotate(-110deg); }

.search-poda:focus-within > .search-dark-border::before { transform: translate(-50%, -50%) rotate(442deg); transition: all 4s; }
.search-poda:focus-within > .search-glow::before { transform: translate(-50%, -50%) rotate(420deg); transition: all 4s; }
.search-poda:focus-within > .search-white::before { transform: translate(-50%, -50%) rotate(443deg); transition: all 4s; }
.search-poda:focus-within > .search-border::before { transform: translate(-50%, -50%) rotate(430deg); transition: all 4s; }

.search-filter-icon {
  position: absolute; top: 8px; right: 8px;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; max-height: 40px; max-width: 38px;
  height: 100%; width: 100%;
  isolation: isolate; overflow: hidden;
  border-radius: 10px;
  background: linear-gradient(180deg, #161329, black, #1d1b4b);
  border: 1px solid transparent;
}

.search-filter-border {
  height: 42px; width: 40px;
  position: absolute; overflow: hidden;
  top: 7px; right: 7px;
  border-radius: 10px;
}
.search-filter-border::before {
  content: ""; position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg);
  width: 600px; height: 600px;
  background-repeat: no-repeat;
  filter: brightness(1.35);
  background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%);
  animation: searchRotate 4s linear infinite;
}

.search-icon { position: absolute; left: 20px; top: 15px; }

@keyframes searchRotate {
  100% { transform: translate(-50%, -50%) rotate(450deg); }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
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
  .services-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }
  .search-wrap {
    justify-content: flex-start;
  }
  .hero-title-line {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }
  .hero-title {
    width: 90%;
  }
  .hero-img-container {
    width: calc(100% - 2rem);
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

/* ============================================
   Cases Section — warm, clean
   ============================================ */
.cases-section {
  background: #fefbf4;
  color: #241910;
  padding: var(--space-12) 0;
}

.cases-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-10);
}

.cases-left {
  flex: 1;
}

.cases-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.4;
  margin-bottom: var(--space-3);
}

.cases-title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-4);
}

.cases-desc {
  font-size: 0.9375rem;
  font-weight: 340;
  line-height: 1.65;
  opacity: 0.55;
  margin-bottom: var(--space-6);
  max-width: 400px;
}

.cases-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: #241910;
  color: #fefbf4;
  border: none;
  padding: 12px 28px;
  border-radius: var(--radius-pill);
  font-size: 0.9375rem;
  font-weight: 450;
  cursor: pointer;
  transition: opacity 0.15s;
}

.cases-btn:hover {
  opacity: 0.85;
}

.cases-right {
  display: flex;
  gap: var(--space-3);
  flex: 1;
}

.cases-card {
  flex: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cases-card__img {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-lg);
}

.cases-card:nth-child(2) .cases-card__img {
  margin-top: 2rem;
}

.cases-card__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.4;
}

.cases-card__img--1 {
  background: linear-gradient(135deg, #e8d5bc, #d4b896);
}
.cases-card__img--2 {
  background: linear-gradient(135deg, #d4c5b0, #b8a68e);
}
.cases-card__img--3 {
  background: linear-gradient(135deg, #c9b99a, #a89570);
}

/* Stats */
.cases-stats {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid rgba(36, 25, 16, 0.1);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
}

.stat-num {
  font-family: var(--font-mono);
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: #241910;
}

.stat-label {
  font-size: 0.8125rem;
  opacity: 0.4;
  letter-spacing: 0.04em;
}

@media (max-width: 768px) {
  .cases-inner {
    flex-direction: column;
    text-align: center;
  }
  .cases-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cases-desc {
    max-width: 100%;
  }
  .cases-right {
    width: 100%;
  }
  .cases-card__img {
    aspect-ratio: 1;
  }
  .cases-stats {
    flex-wrap: wrap;
    gap: var(--space-4);
  }
  .stat {
    flex: 0 0 40%;
  }
}

/* ============================================
   Footer — sticky reveal, warm tone
   ============================================ */
footer {
  position: relative;
  width: 100%;
  height: 55vh;
  background-color: #241910;
  color: #e8e0d4;
  overflow: hidden;
}

.footer-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 3rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  transform: translateY(-35%);
  will-change: transform;
}

.footer-content {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.footer-main-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.footer-left {
  flex: 3;
}

.footer-right {
  flex: 2;
  display: flex;
  justify-content: flex-end;
}

.footer-heading {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  width: 70%;
  margin-bottom: var(--space-3);
}

.footer-tagline {
  font-size: 0.875rem;
  opacity: 0.4;
  max-width: 280px;
  line-height: 1.5;
  margin-bottom: var(--space-4);
}

.footer-icons {
  display: flex;
  gap: var(--space-3);
}

/* Glassmorphism buttons */
.glass-btn-wrap {
  position: relative;
  width: 90px;
  height: 40px;
  border-radius: 12px;
  overflow: visible;
}

.glass-btn {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(232, 224, 212, 0.12), rgba(232, 224, 212, 0.04));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e8e0d4;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 450;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow:
    inset 0 0.5px 1px rgba(232, 224, 212, 0.2),
    inset 0 -0.5px 1px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  z-index: 1;
  outline: none;
}

.glass-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.glass-btn-text {
  display: inline-block;
  transition: text-shadow 0.2s ease;
}

.glass-btn:hover {
  transform: scale(1.06);
  box-shadow:
    inset 0 0.5px 1px rgba(232, 224, 212, 0.3),
    inset 0 -0.5px 1px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.25);
}

.glass-btn:hover .glass-btn-text {
  text-shadow: 0 0 8px rgba(232, 224, 212, 0.3);
}

.glass-btn:active {
  transform: scale(0.97) rotateX(2deg);
}

.glass-btn-shadow {
  position: absolute;
  bottom: -4px;
  left: 10%;
  width: 80%;
  height: 16px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  filter: blur(8px);
  transition: all 0.2s ease;
  z-index: 0;
}

.glass-btn-wrap:hover .glass-btn-shadow {
  filter: blur(12px);
  opacity: 0.6;
  width: 85%;
  left: 7.5%;
}

.footer-links-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-end;
}

.footer-link-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 20px;
  border-radius: var(--radius-pill);
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(232, 224, 212, 0.55);
  background: rgba(232, 224, 212, 0.05);
  border: 1px solid rgba(232, 224, 212, 0.08);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;
}

.footer-link-pill svg {
  opacity: 0.4;
}

.footer-link-pill:hover {
  background: rgba(232, 224, 212, 0.12);
  color: #e8e0d4;
  border-color: rgba(232, 224, 212, 0.2);
}

.footer-link-pill:hover svg {
  opacity: 0.7;
}

.footer-link-pill--subtle {
  opacity: 0.5;
  font-size: 0.8125rem;
}

.footer-link-pill--subtle:hover {
  opacity: 1;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-8);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(232, 224, 212, 0.08);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.8125rem;
  font-weight: 400;
  opacity: 0.4;
  letter-spacing: 0.02em;
}

.footer-logo {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.footer-copy {
  font-size: 0.75rem;
  opacity: 0.25;
  font-family: var(--font-mono);
  letter-spacing: 0.03em;
}

@media (max-width: 768px) {
  footer {
    height: 60vh;
  }
  .footer-main-block {
    flex-direction: column;
    gap: 2rem;
  }
  .footer-heading {
    width: 100%;
  }
  .footer-tagline {
    max-width: 100%;
  }
  .footer-right {
    justify-content: flex-start;
  }
  .footer-links-col {
    align-items: flex-start;
  }
  .footer-bottom {
    flex-direction: column;
    gap: var(--space-2);
    align-items: flex-start;
  }
}

/* ============================================
   Modal
   ============================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: var(--space-4);
}

.modal-box {
  background: #fefbf4;
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 420px;
  width: 100%;
  text-align: center;
  color: #241910;
}

.modal-title {
  margin-bottom: var(--space-3);
}

.modal-desc {
  opacity: 0.6;
  margin-bottom: var(--space-6);
}

.modal-contact-btns {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.modal-contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
  color: var(--color-white);
}

.modal-contact-btn:hover {
  opacity: 0.85;
}

.modal-contact-btn.qq {
  background: linear-gradient(60deg, rgb(0, 140, 255) 0%, rgb(100, 200, 255) 100%);
}

.modal-contact-btn.wx {
  background: linear-gradient(60deg, rgb(7, 193, 96) 0%, rgb(76, 230, 140) 100%);
}

.modal-close {
  background: none;
  border: 1px solid rgba(36, 25, 16, 0.15);
  padding: 8px 24px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  opacity: 0.5;
  font-size: 0.875rem;
  transition: all 0.15s;
  color: #241910;
}

.modal-close:hover {
  opacity: 1;
  background: rgba(36, 25, 16, 0.05);
}
</style>
