<template>
  <div class="intro-root" v-if="showIntro">
    <!-- Preloader layer -->
    <div class="intro-preloader" ref="preloader">
      <div class="intro-title">
        <span
          v-for="(char, i) in titleChars"
          :key="'a' + i"
          class="ichar"
          :class="{ 'first-char': i === 0 }"
        >
          <span class="ichar-inner">{{ char }}</span>
        </span>
      </div>
      <div class="outro-title">
        <span v-for="(char, i) in outroChars" :key="'b' + i" class="ochar">
          <span class="ochar-inner">{{ char }}</span>
        </span>
      </div>
    </div>

    <!-- Split overlay — pre-positioned in final state -->
    <div class="intro-split" ref="splitOverlay">
      <div class="intro-title">
        <span
          v-for="(char, i) in titleChars"
          :key="'c' + i"
          class="ichar"
          :class="{ 'first-char': i === 0 }"
        >
          <span class="ichar-inner">{{ char }}</span>
        </span>
      </div>
      <div class="outro-title">
        <span v-for="(char, i) in outroChars" :key="'d' + i" class="ochar">
          <span class="ochar-inner">{{ char }}</span>
        </span>
      </div>
    </div>

    <!-- Floating tags -->
    <div class="intro-tags" ref="tagsOverlay">
      <div class="itag tag-1"><span class="itag-word">Courseware</span></div>
      <div class="itag tag-2"><span class="itag-word">Web Design</span></div>
      <div class="itag tag-3"><span class="itag-word">Visual Design</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])

const showIntro = ref(true)
const preloader = ref(null)
const splitOverlay = ref(null)
const tagsOverlay = ref(null)

// "ZHANG" → Z stays, HANG slides out; "QF" slides in → "ZQF"
const titleText = 'ZHANG'
const outroText = 'QF'
const titleChars = titleText.split('')
const outroChars = outroText.split('')

function cleanup() {
  document.body.style.overflow = ''
  sessionStorage.setItem('intro_seen', '1')
  window.dispatchEvent(new Event('intro-done'))
  showIntro.value = false
  emit('done')
}

onMounted(async () => {
  if (sessionStorage.getItem('intro_seen')) {
    showIntro.value = false
    emit('done')
    return
  }

  document.body.style.overflow = 'hidden'
  await nextTick()

  const isMobile = window.innerWidth <= 768
  const ease = 'expo.inOut'

  // First char final position — "Z" right next to "QF"
  const firstCharFinalX = isMobile ? '3rem' : '5rem'
  const firstCharFinalY = isMobile ? '-0.3rem' : '-0.5rem'
  const firstCharOvershootX = isMobile ? '4rem' : '7rem'
  const outroFinalX = isMobile ? '0' : '0rem'

  try {
    // ===== INITIAL STATES =====
    gsap.set('.intro-preloader .ichar-inner', { y: '-100%' })
    gsap.set('.intro-preloader .ochar-inner', { y: '-100%' })
    gsap.set('.itag-word', { y: '-100%' })

    // Split overlay — FINAL state
    gsap.set('.intro-split .ichar-inner', { y: '0%' })
    gsap.set('.intro-split .ichar:not(.first-char)', { opacity: 0 })
    gsap.set('.intro-split .first-char', {
      x: firstCharFinalX,
      y: firstCharFinalY,
      fontWeight: 900,
      scale: 0.7,
    })
    gsap.set('.intro-split .ochar-inner', { y: '0%' })
    gsap.set('.intro-split .ochar', {
      x: outroFinalX,
      fontSize: isMobile ? '5rem' : '9rem',
      fontWeight: 500,
    })

    // ===== TIMELINE =====
    const tl = gsap.timeline({ defaults: { ease }, onComplete: cleanup })

    // t=0.3 — Tags + Title slide IN
    tl.to('.itag-word', { y: '0%', duration: 0.5, stagger: 0.08 }, 0.3)
    tl.to('.intro-preloader .ichar-inner', { y: '0%', duration: 0.5, stagger: 0.03 }, 0.3)

    // t=1.2 — HANG slides OUT
    tl.to('.intro-preloader .ichar:not(.first-char) .ichar-inner', {
      y: '100%', duration: 0.3, stagger: 0.02,
    }, 1.2)

    // t=1.7 — QF slides IN
    tl.to('.intro-preloader .ochar-inner', {
      y: '0%', duration: 0.5, stagger: 0.05,
    }, 1.7)

    // t=2.4 — Z + QF CONVERGE
    tl.to('.intro-preloader .first-char', {
      x: firstCharOvershootX, duration: 0.6,
    }, 2.4)
    tl.to('.intro-preloader .ochar', {
      x: outroFinalX, duration: 0.6,
    }, 2.4)

    // t=3.2 — TRANSFORM to final form
    tl.to('.intro-preloader .first-char', {
      x: firstCharFinalX, y: firstCharFinalY, scale: 0.7, duration: 0.5,
    }, 3.2)
    tl.call(() => {
      document.querySelectorAll('.intro-preloader .first-char').forEach(el => {
        el.style.fontWeight = '900'
      })
    }, null, 3.2)

    tl.to('.intro-preloader .ochar', {
      x: outroFinalX,
      fontSize: isMobile ? '5rem' : '9rem',
      duration: 0.5,
      onComplete: () => {
        document.querySelectorAll('.intro-preloader .ochar').forEach(el => {
          el.style.fontWeight = '500'
        })
        gsap.set(preloader.value, { clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' })
        gsap.set(splitOverlay.value, { clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' })
      },
    }, 3.2)

    // t=3.8 — Tags slide OUT
    tl.to('.itag-word', { y: '100%', duration: 0.4, stagger: 0.06 }, 3.8)

    // t=4.2 — SPLIT APART
    tl.to(preloader.value, { y: '-100%', duration: 0.7, ease: 'power4.inOut' }, 4.2)
    tl.to(splitOverlay.value, { y: '100%', duration: 0.7, ease: 'power4.inOut' }, 4.2)
    tl.to(tagsOverlay.value, { opacity: 0, duration: 0.3 }, 4.2)

  } catch (e) {
    console.error('Intro animation error:', e)
    cleanup()
  }
})
</script>

<style scoped>
.intro-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.intro-preloader,
.intro-split {
  position: absolute;
  inset: 0;
  background: #0a0a0a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-preloader,
.intro-tags { z-index: 2; }
.intro-split { z-index: 1; }

/* Title "ZHANG" */
.intro-title {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  white-space: nowrap;
}

.ichar {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.ichar-inner {
  display: inline-block;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  will-change: transform;
}

/* Outro "QF" */
.outro-title {
  position: absolute;
  top: 50%;
  left: calc(50% + 3rem);
  transform: translateY(-50%);
  display: flex;
}

.ochar {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.ochar-inner {
  display: inline-block;
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 300;
  will-change: transform;
}

/* Tags */
.intro-tags {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.itag {
  position: absolute;
  width: max-content;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.itag-word {
  display: inline-block;
  will-change: transform;
}

.tag-1 { top: 18%; left: 12%; }
.tag-2 { bottom: 20%; left: 20%; }
.tag-3 { bottom: 32%; right: 12%; }

@media (max-width: 768px) {
  .outro-title { left: calc(50% + 2rem); }
}
</style>
