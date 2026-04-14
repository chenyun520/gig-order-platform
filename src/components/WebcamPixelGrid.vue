<template>
  <div class="wpg-root" v-if="showIntro">
    <!-- Hidden video for webcam capture -->
    <video ref="videoEl" autoplay playsinline muted class="wpg-video" />

    <!-- Hidden canvas for downscaled pixel sampling -->
    <canvas ref="processingCanvas" class="wpg-hidden" />

    <!-- Visible display canvas -->
    <canvas ref="displayCanvas" class="wpg-display" />

    <!-- Gradient overlay for text readability -->
    <div class="wpg-overlay" />

    <!-- Content overlay -->
    <div class="wpg-content" :class="{ 'wpg-content--visible': webcamReady }">
      <div class="wpg-badge">Webcam Pixel Grid</div>
      <h1 class="wpg-title">
        <span class="wpg-title-line" v-for="(line, i) in titleLines" :key="i">{{ line }}</span>
      </h1>
      <p class="wpg-desc">{{ description }}</p>
      <button class="wpg-btn" @click="enterSite">
        <span>开始体验</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Camera error popup -->
    <div v-if="cameraError" class="wpg-error" :class="{ 'wpg-error--minimized': errorMinimized }">
      <template v-if="!errorMinimized">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span class="wpg-error-text">需要摄像头权限</span>
        <button class="wpg-error-btn" @click="requestCamera">开启摄像头</button>
        <button class="wpg-error-close" @click="errorMinimized = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </template>
      <template v-else>
        <div class="wpg-error-icon" @click="errorMinimized = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <div class="wpg-error-strike" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const emit = defineEmits(['done'])

// Props matching aceternity demo config
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

const titleLines = ['ZQF', 'Design Studio']
const description = '移动你的身体，像素方块会跟随你的动作实时响应'

const showIntro = ref(true)
const webcamReady = ref(false)
const cameraError = ref(false)
const errorMinimized = ref(false)

const videoEl = ref(null)
const processingCanvas = ref(null)
const displayCanvas = ref(null)

let animFrameId = null
let stream = null
let prevFrameData = null
let pixelGrid = null

// Initialize pixel state grid
function initPixelGrid() {
  pixelGrid = []
  for (let row = 0; row < gridRows; row++) {
    pixelGrid[row] = []
    for (let col = 0; col < gridCols; col++) {
      pixelGrid[row][col] = {
        r: 0, g: 0, b: 0,
        motion: 0,
        elevation: 0,
      }
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
      webcamReady.value = true
      startRendering()
    }
  } catch (err) {
    console.error('Camera access error:', err)
    cameraError.value = true
  }
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

    // Resize canvas each frame to match viewport
    if (dispCanvas.width !== Math.round(displayWidth * dpr) || dispCanvas.height !== Math.round(displayHeight * dpr)) {
      dispCanvas.width = displayWidth * dpr
      dispCanvas.height = displayHeight * dpr
      dispCanvas.style.width = displayWidth + 'px'
      dispCanvas.style.height = displayHeight + 'px'
    }
    dispCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Draw video to processing canvas (downscale to grid resolution)
    procCtx.save()
    if (mirror) {
      procCtx.translate(gridCols, 0)
      procCtx.scale(-1, 1)
    }
    procCtx.drawImage(video, 0, 0, gridCols, gridRows)
    procCtx.restore()

    const currentFrameData = procCtx.getImageData(0, 0, gridCols, gridRows).data

    // Clear display
    dispCtx.fillStyle = backgroundColor
    dispCtx.fillRect(0, 0, displayWidth, displayHeight)

    // Calculate cell size (cover fit)
    const cellW = displayWidth / gridCols
    const cellH = displayHeight / gridRows
    const cellSize = Math.max(cellW, cellH)
    const gap = cellSize * gapRatio
    const totalW = cellSize * gridCols
    const totalH = cellSize * gridRows
    const offsetX = (displayWidth - totalW) / 2
    const offsetY = (displayHeight - totalH) / 2

    // Process each pixel
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const idx = (row * gridCols + col) * 4
        let r = currentFrameData[idx]
        let g = currentFrameData[idx + 1]
        let b = currentFrameData[idx + 2]

        const pixel = pixelGrid[row][col]

        // Motion detection
        if (prevFrameData) {
          const prevR = prevFrameData[idx]
          const prevG = prevFrameData[idx + 1]
          const prevB = prevFrameData[idx + 2]
          const diff = Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB)
          const motion = Math.min(diff / (255 * motionSensitivity), 1)
          pixel.motion = pixel.motion * 0.7 + motion * 0.3
        }

        // Darken
        r = Math.round(r * (1 - darken))
        g = Math.round(g * (1 - darken))
        b = Math.round(b * (1 - darken))

        pixel.r = r
        pixel.g = g
        pixel.b = b

        // Elevation smoothing
        const targetElevation = pixel.motion * maxElevation
        pixel.elevation += (targetElevation - pixel.elevation) * elevationSmoothing

        // Draw cell
        const x = offsetX + col * cellSize
        const y = offsetY + row * cellSize
        const innerSize = cellSize - gap
        const elev = pixel.elevation
        const elevX = elev * 1.2
        const elevY = elev * 1.8

        // Shadow
        if (elev > 0.5) {
          dispCtx.fillStyle = `rgba(0,0,0,${Math.min(elev / maxElevation * 0.4, 0.4)})`
          dispCtx.fillRect(x + elevX * 0.5, y + elevY * 0.5, innerSize, innerSize)
        }

        // Right side face (darker)
        if (elev > 0.5) {
          const sideR = Math.max(r - 80, 0)
          const sideG = Math.max(g - 80, 0)
          const sideB = Math.max(b - 80, 0)
          dispCtx.fillStyle = `rgb(${sideR},${sideG},${sideB})`
          dispCtx.beginPath()
          dispCtx.moveTo(x + innerSize, y)
          dispCtx.lineTo(x + innerSize + elevX, y - elevY)
          dispCtx.lineTo(x + innerSize + elevX, y - elevY + innerSize)
          dispCtx.lineTo(x + innerSize, y + innerSize)
          dispCtx.closePath()
          dispCtx.fill()
        }

        // Bottom side face (darker)
        if (elev > 0.5) {
          const sideR = Math.max(r - 50, 0)
          const sideG = Math.max(g - 50, 0)
          const sideB = Math.max(b - 50, 0)
          dispCtx.fillStyle = `rgb(${sideR},${sideG},${sideB})`
          dispCtx.beginPath()
          dispCtx.moveTo(x, y + innerSize)
          dispCtx.lineTo(x + elevX, y + innerSize - elevY)
          dispCtx.lineTo(x + innerSize + elevX, y + innerSize - elevY)
          dispCtx.lineTo(x + innerSize, y + innerSize)
          dispCtx.closePath()
          dispCtx.fill()
        }

        // Top face (main cell) — elevated position
        const brightnessBoost = 1 + elev * 0.05
        const faceR = Math.min(Math.round(r * brightnessBoost), 255)
        const faceG = Math.min(Math.round(g * brightnessBoost), 255)
        const faceB = Math.min(Math.round(b * brightnessBoost), 255)
        dispCtx.fillStyle = `rgb(${faceR},${faceG},${faceB})`
        dispCtx.fillRect(x - elevX, y - elevY, innerSize, innerSize)

        // Border
        const bOpacity = borderOpacity + (elev / maxElevation) * 0.04
        dispCtx.strokeStyle = `rgba(255,255,255,${bOpacity})`
        dispCtx.lineWidth = 0.5
        dispCtx.strokeRect(x - elevX, y - elevY, innerSize, innerSize)
      }
    }

    prevFrameData = new Uint8ClampedArray(currentFrameData)
    animFrameId = requestAnimationFrame(render)
  }

  animFrameId = requestAnimationFrame(render)
}

function enterSite() {
  document.body.style.overflow = ''
  sessionStorage.setItem('intro_seen', '1')
  window.dispatchEvent(new Event('intro-done'))
  showIntro.value = false
  emit('done')
}

function handleResize() {
  // Rendering loop handles resize dynamically via window dimensions
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
  requestCamera()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (stream) stream.getTracks().forEach(t => t.stop())
})
</script>

<style scoped>
.wpg-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0a0a0a;
}

.wpg-video,
.wpg-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.wpg-display {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: wpg-fade-in 1s ease-out;
}

@keyframes wpg-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wpg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 40%,
    transparent 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
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
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  pointer-events: none;
}

.wpg-content--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.wpg-badge {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.wpg-title {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  margin-bottom: 1.5rem;
}

.wpg-title-line {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 800;
  line-height: 1.05;
  color: #fff;
  letter-spacing: -0.03em;
}

.wpg-desc {
  max-width: 420px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.wpg-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 2rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wpg-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.wpg-btn:active {
  transform: translateY(0);
}

.wpg-btn svg {
  transition: transform 0.3s ease;
}

.wpg-btn:hover svg {
  transform: translateX(3px);
}

/* Camera error popup */
.wpg-error {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  z-index: 10;
  transition: all 0.3s ease;
}

.wpg-error--minimized {
  padding: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wpg-error-text {
  white-space: nowrap;
}

.wpg-error-btn {
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.wpg-error-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.wpg-error-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.2rem;
  transition: color 0.2s;
}

.wpg-error-close:hover {
  color: rgba(255, 255, 255, 0.8);
}

.wpg-error-icon {
  position: relative;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
}

.wpg-error-strike {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 2px;
  background: rgba(255, 60, 60, 0.7);
  transform: translate(-50%, -50%) rotate(-45deg);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .wpg-content {
    padding: 1.5rem;
  }

  .wpg-badge {
    font-size: 0.65rem;
    margin-bottom: 1.5rem;
  }

  .wpg-desc {
    font-size: 0.9rem;
    margin-bottom: 2rem;
  }

  .wpg-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
