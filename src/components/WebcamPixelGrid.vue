<template>
  <div class="wpg-root" v-if="showIntro">
    <!-- All intro visuals — hidden instantly on play -->
    <div class="wpg-scene" ref="sceneEl">
      <!-- Hidden video for webcam capture -->
      <video ref="videoEl" autoplay playsinline muted class="wpg-video" />
      <!-- Hidden canvas for downscaled pixel sampling -->
      <canvas ref="processingCanvas" class="wpg-hidden" />
      <!-- Visible display canvas -->
      <canvas ref="displayCanvas" class="wpg-display" />

      <!-- Gradient overlay -->
      <div class="wpg-overlay" />

      <!-- Content overlay -->
      <div class="wpg-content" ref="contentEl">
      <div class="wpg-badge">
        <span class="wpg-badge-dot" />
        <span>ZQF Design Studio</span>
      </div>
      <h1 class="wpg-title">
        <span class="wpg-line wpg-line--thin">DESIGN</span>
        <span class="wpg-line wpg-line--heavy">THAT</span>
        <span class="wpg-line wpg-line--outline">DELIVERS.</span>
      </h1>
      <button class="wpg-play-btn" @click="enterSite">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36px" height="36px">
          <rect width="36" height="36" x="0" y="0" rx="18" ry="18" fill="#1a1a1a"></rect>
          <path fill="#e8e0d4" d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59 c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29c1.49-0.3,5.21,0.2,5.5,1.28 C40.89,30.29,39.48,38.31,38.67,42z"></path>
          <path fill="#c4b8a8" d="M39.02,42H11.99c-0.22-2.67-0.48-7.05-0.49-12.72c0.83,4.18,1.63,9.59,6.98,9.79 c3.48,0.12,8.27,0.55,9.83-2.45c1.57-3,3.72-8.95,3.51-15.62c-0.19-5.84-1.75-8.2-2.13-8.7c0.59,0.66,3.74,4.49,4.01,11.7 c0.03,0.83,0.06,1.72,0.08,2.66c4.21-0.15,5.93,1.5,6.07,2.35C40.68,33.85,39.8,38.9,39.02,42z"></path>
          <path fill="#0a0a0a" d="M35,27.17c0,3.67-0.28,11.2-0.42,14.83h-2C32.72,38.42,33,30.83,33,27.17 c0-5.54-1.46-12.65-3.55-14.02c-1.65-1.08-5.49-1.48-8.23-0.85c-3.62,0.83-4.57,1.99-6.14,3.92L15,16.32 c-1.31,1.6-2.59,6.92-3,8.96v10.8c0,2.58,0.28,4.61,0.54,5.92H10.5c-0.25-1.41-0.5-3.42-0.5-5.92l0.02-11.09 c0.15-0.77,1.55-7.63,3.43-9.94l0.08-0.09c1.65-2.03,2.96-3.63,7.25-4.61c3.28-0.76,7.67-0.25,9.77,1.13 C33.79,13.6,35,22.23,35,27.17z"></path>
          <path fill="#3a3a3a" d="M17.165,17.283c5.217-0.055,9.391,0.283,9,6.011c-0.391,5.728-8.478,5.533-9.391,5.337 c-0.913-0.196-7.826-0.043-7.696-5.337C9.209,18,13.645,17.32,17.165,17.283z"></path>
          <path fill="#0a0a0a" d="M40.739,37.38c-0.28,1.99-0.69,3.53-1.22,4.62h-2.43c0.25-0.19,1.13-1.11,1.67-4.9 c0.57-4-0.23-11.79-0.93-12.78c-0.4-0.4-2.63-0.8-4.37-0.89l0.1-1.99c1.04,0.05,4.53,0.31,5.71,1.49 C40.689,24.36,41.289,33.53,40.739,37.38z"></path>
          <path fill="#666" d="M10.154,20.201c0.261,2.059-0.196,3.351,2.543,3.546s8.076,1.022,9.402-0.554 c1.326-1.576,1.75-4.365-0.891-5.267C19.336,17.287,12.959,16.251,10.154,20.201z"></path>
          <path fill="#0a0a0a" d="M17.615,29.677c-0.502,0-0.873-0.03-1.052-0.069c-0.086-0.019-0.236-0.035-0.434-0.06 c-5.344-0.679-8.053-2.784-8.052-6.255c0.001-2.698,1.17-7.238,8.986-7.32l0.181-0.002c3.444-0.038,6.414-0.068,8.272,1.818 c1.173,1.191,1.712,3,1.647,5.53c-0.044,1.688-0.785,3.147-2.144,4.217C22.785,29.296,19.388,29.677,17.615,29.677z M17.086,17.973 c-7.006,0.074-7.008,4.023-7.008,5.321c-0.001,3.109,3.598,3.926,6.305,4.27c0.273,0.035,0.48,0.063,0.601,0.089 c0.563,0.101,4.68,0.035,6.855-1.732c0.865-0.702,1.299-1.57,1.326-2.653c0.051-1.958-0.301-3.291-1.073-4.075 c-1.262-1.281-3.834-1.255-6.825-1.222L17.086,17.973z"></path>
          <path fill="#999" d="M15.078,19.043c1.957-0.326,5.122-0.529,4.435,1.304c-0.489,1.304-7.185,2.185-7.185,0.652 C12.328,19.467,15.078,19.043,15.078,19.043z"></path>
        </svg>
        <span class="play-label play-label--now">now!</span>
        <span class="play-label play-label--play">play</span>
      </button>
    </div>
    </div><!-- end .wpg-scene -->

    <!-- Split transition panels -->
    <div class="wpg-split wpg-split--top" ref="splitTop" />
    <div class="wpg-split wpg-split--bottom" ref="splitBottom" />

    <!-- Camera error -->
    <div v-if="cameraError" class="wpg-error" :class="{ 'wpg-error--min': errorMinimized }">
      <template v-if="!errorMinimized">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
        </svg>
        <span class="wpg-error-text">需要摄像头权限</span>
        <button class="wpg-error-btn" @click="requestCamera">开启摄像头</button>
        <button class="wpg-error-close" @click="errorMinimized = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </template>
      <template v-else>
        <div class="wpg-error-icon" @click="errorMinimized = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
          </svg>
          <div class="wpg-error-strike" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])

const gridCols = 60
const gridRows = 40
const maxElevation = 50
const motionSensitivity = 0.25
const elevationSmoothing = 0.2
const darken = 0.6
const gapRatio = 0.05
const borderOpacity = 0.06
const backgroundColor = '#0a0a0a'
const mirror = true

const showIntro = ref(true)
const cameraError = ref(false)
const errorMinimized = ref(false)

const videoEl = ref(null)
const processingCanvas = ref(null)
const displayCanvas = ref(null)
const contentEl = ref(null)
const sceneEl = ref(null)
const splitTop = ref(null)
const splitBottom = ref(null)

let animFrameId = null
let stream = null
let prevFrameData = null
let pixelGrid = null

function initPixelGrid() {
  pixelGrid = []
  for (let row = 0; row < gridRows; row++) {
    pixelGrid[row] = []
    for (let col = 0; col < gridCols; col++) {
      pixelGrid[row][col] = { r: 0, g: 0, b: 0, motion: 0, elevation: 0 }
    }
  }
}

async function requestCamera() {
  cameraError.value = false
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
    })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
      startRendering()
    }
  } catch (err) {
    console.error('Camera access error:', err)
    cameraError.value = true
  }
}

function stopCamera() {
  if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null }
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null }
}

function startRendering() {
  const video = videoEl.value
  const procCanvas = processingCanvas.value
  const dispCanvas = displayCanvas.value
  if (!video || !procCanvas || !dispCanvas) return

  procCanvas.width = gridCols
  procCanvas.height = gridRows
  const procCtx = procCanvas.getContext('2d', { willReadFrequently: true })
  const dpr = window.devicePixelRatio || 1
  const dispCtx = dispCanvas.getContext('2d')

  function render() {
    if (!videoEl.value || videoEl.value.readyState < 2) {
      animFrameId = requestAnimationFrame(render)
      return
    }
    const displayWidth = window.innerWidth
    const displayHeight = window.innerHeight

    if (dispCanvas.width !== Math.round(displayWidth * dpr) || dispCanvas.height !== Math.round(displayHeight * dpr)) {
      dispCanvas.width = displayWidth * dpr
      dispCanvas.height = displayHeight * dpr
      dispCanvas.style.width = displayWidth + 'px'
      dispCanvas.style.height = displayHeight + 'px'
    }
    dispCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    procCtx.save()
    if (mirror) { procCtx.translate(gridCols, 0); procCtx.scale(-1, 1) }
    procCtx.drawImage(video, 0, 0, gridCols, gridRows)
    procCtx.restore()

    const currentFrameData = procCtx.getImageData(0, 0, gridCols, gridRows).data
    dispCtx.fillStyle = backgroundColor
    dispCtx.fillRect(0, 0, displayWidth, displayHeight)

    const cellW = displayWidth / gridCols
    const cellH = displayHeight / gridRows
    const cellSize = Math.max(cellW, cellH)
    const gap = cellSize * gapRatio
    const totalW = cellSize * gridCols
    const totalH = cellSize * gridRows
    const offsetX = (displayWidth - totalW) / 2
    const offsetY = (displayHeight - totalH) / 2

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const idx = (row * gridCols + col) * 4
        let r = currentFrameData[idx], g = currentFrameData[idx + 1], b = currentFrameData[idx + 2]
        const pixel = pixelGrid[row][col]

        if (prevFrameData) {
          const diff = Math.abs(r - prevFrameData[idx]) + Math.abs(g - prevFrameData[idx + 1]) + Math.abs(b - prevFrameData[idx + 2])
          const motion = Math.min(diff / (255 * motionSensitivity), 1)
          pixel.motion = pixel.motion * 0.7 + motion * 0.3
        }

        r = Math.round(r * (1 - darken))
        g = Math.round(g * (1 - darken))
        b = Math.round(b * (1 - darken))
        pixel.r = r; pixel.g = g; pixel.b = b

        const targetElev = pixel.motion * maxElevation
        pixel.elevation += (targetElev - pixel.elevation) * elevationSmoothing

        const x = offsetX + col * cellSize
        const y = offsetY + row * cellSize
        const inner = cellSize - gap
        const elev = pixel.elevation
        const eX = elev * 1.2, eY = elev * 1.8

        if (elev > 0.5) {
          dispCtx.fillStyle = `rgba(0,0,0,${Math.min(elev / maxElevation * 0.4, 0.4)})`
          dispCtx.fillRect(x + eX * 0.5, y + eY * 0.5, inner, inner)
        }
        if (elev > 0.5) {
          dispCtx.fillStyle = `rgb(${Math.max(r-80,0)},${Math.max(g-80,0)},${Math.max(b-80,0)})`
          dispCtx.beginPath()
          dispCtx.moveTo(x + inner, y); dispCtx.lineTo(x + inner + eX, y - eY)
          dispCtx.lineTo(x + inner + eX, y - eY + inner); dispCtx.lineTo(x + inner, y + inner)
          dispCtx.closePath(); dispCtx.fill()
        }
        if (elev > 0.5) {
          dispCtx.fillStyle = `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`
          dispCtx.beginPath()
          dispCtx.moveTo(x, y + inner); dispCtx.lineTo(x + eX, y + inner - eY)
          dispCtx.lineTo(x + inner + eX, y + inner - eY); dispCtx.lineTo(x + inner, y + inner)
          dispCtx.closePath(); dispCtx.fill()
        }

        const boost = 1 + elev * 0.05
        dispCtx.fillStyle = `rgb(${Math.min(Math.round(r*boost),255)},${Math.min(Math.round(g*boost),255)},${Math.min(Math.round(b*boost),255)})`
        dispCtx.fillRect(x - eX, y - eY, inner, inner)

        const bO = borderOpacity + (elev / maxElevation) * 0.04
        dispCtx.strokeStyle = `rgba(255,255,255,${bO})`
        dispCtx.lineWidth = 0.5
        dispCtx.strokeRect(x - eX, y - eY, inner, inner)
      }
    }
    prevFrameData = new Uint8ClampedArray(currentFrameData)
    animFrameId = requestAnimationFrame(render)
  }
  animFrameId = requestAnimationFrame(render)
}

function enterSite() {
  stopCamera()

  // Instantly hide all intro visuals and make root transparent so homepage shows through
  sceneEl.value.style.visibility = 'hidden'

  const rootEl = sceneEl.value.parentElement
  rootEl.style.background = 'transparent'

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = ''
      sessionStorage.setItem('intro_seen', '1')
      window.dispatchEvent(new Event('intro-done'))
      showIntro.value = false
      emit('done')
    }
  })

  tl.set(splitTop.value, { clipPath: 'inset(0 0 0 0)' }, 0)
  tl.set(splitBottom.value, { clipPath: 'inset(0 0 0 0)' }, 0)
  tl.to(splitTop.value, { y: '-100%', duration: 0.8, ease: 'power4.inOut' }, 0)
  tl.to(splitBottom.value, { y: '100%', duration: 0.8, ease: 'power4.inOut' }, 0)
}

onMounted(async () => {
  if (sessionStorage.getItem('intro_seen')) {
    showIntro.value = false
    emit('done')
    return
  }

  document.body.style.overflow = 'hidden'
  initPixelGrid()
  await nextTick()

  // Entrance animation for content
  gsap.fromTo(contentEl.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
  )

  requestCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.wpg-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0a0a0a;
}

.wpg-scene {
  position: absolute;
  inset: 0;
}

.wpg-video, .wpg-hidden {
  position: absolute;
  width: 0; height: 0;
  opacity: 0;
  pointer-events: none;
}

.wpg-display {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  animation: fadeIn 1.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wpg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
}

.wpg-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 2;
}

.wpg-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1.2rem;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.5);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
}

.wpg-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74,222,128,0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.wpg-title {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 1.2rem;
}

.wpg-line {
  line-height: 0.9;
  text-transform: uppercase;
}

.wpg-line--thin {
  font-weight: 100;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.4em;
  margin-bottom: 0.2em;
}

.wpg-line--heavy {
  font-weight: 900;
  font-size: clamp(3.5rem, 10vw, 8rem);
  color: #fff;
  letter-spacing: -0.04em;
  text-shadow: 0 0 80px rgba(255,255,255,0.06);
}

.wpg-line--outline {
  font-weight: 900;
  font-size: clamp(3.5rem, 10vw, 8rem);
  -webkit-text-stroke: 2px rgba(255,255,255,0.5);
  color: transparent;
  letter-spacing: -0.04em;
}

.wpg-sub {
  color: rgba(255,255,255,0.25);
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  font-weight: 300;
  margin-bottom: 3rem;
}

/* Play button */
.wpg-play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 10px;
  min-width: 140px;
  height: 48px;
  color: #e8e0d4;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
  text-transform: uppercase;
  cursor: pointer;
  border: solid 2px rgba(255,255,255,0.15);
  letter-spacing: 1px;
  font-weight: 600;
  font-size: 17px;
  background-color: rgba(255,255,255,0.06);
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
  font-family: inherit;
}

.wpg-play-btn:active { transform: scale(0.92); transition: all 100ms ease; }
.wpg-play-btn svg { transition: all 0.5s ease; z-index: 2; flex-shrink: 0; }

.play-label { transition: all 0.5s ease; }
.play-label--now { position: absolute; left: 0; transform: translateX(-100%); z-index: 2; }
.play-label--play { transition-delay: 0s; }

.wpg-play-btn:hover {
  border-color: rgba(255,255,255,0.3);
  background-color: rgba(255,255,255,0.1);
}
.wpg-play-btn:hover svg { transform: scale(3) translate(50%); }
.wpg-play-btn:hover .play-label--now { transform: translateX(10px); transition-delay: 300ms; }
.wpg-play-btn:hover .play-label--play { transform: translateX(200%); transition-delay: 300ms; }

/* Split panels */
.wpg-split {
  position: absolute;
  left: 0; right: 0;
  height: 50%;
  background: #fefbf4;
  z-index: 10;
  clip-path: inset(0 0 100% 0);
  will-change: transform;
}

.wpg-split--top { top: 0; }
.wpg-split--bottom { bottom: 0; }

/* Error popup */
.wpg-error {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  font-size: 0.85rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.wpg-error--min {
  padding: 0;
  border-radius: 50%;
  width: 40px; height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wpg-error-text { white-space: nowrap; }

.wpg-error-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.wpg-error-btn:hover { background: rgba(255,255,255,0.2); }

.wpg-error-close {
  display: flex; align-items: center; justify-content: center;
  background: none; border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer; padding: 0.2rem;
  transition: color 0.2s;
}
.wpg-error-close:hover { color: rgba(255,255,255,0.8); }

.wpg-error-icon {
  position: relative; cursor: pointer;
  color: rgba(255,255,255,0.4);
}

.wpg-error-strike {
  position: absolute;
  top: 50%; left: 50%;
  width: 24px; height: 2px;
  background: rgba(255,60,60,0.7);
  transform: translate(-50%,-50%) rotate(-45deg);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .wpg-line--heavy, .wpg-line--outline { font-size: clamp(2.5rem, 13vw, 5rem); }
  .wpg-line--thin { font-size: clamp(1rem, 3vw, 1.6rem); }
  .wpg-play-btn { min-width: 120px; height: 42px; font-size: 15px; }
}
</style>
