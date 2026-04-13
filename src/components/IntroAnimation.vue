<template>
  <div class="intro-root" v-if="showIntro">
    <!-- Preloader (top half after split) -->
    <div class="intro-preloader" ref="preloader">
      <div class="intro-title">
        <span v-for="(char, i) in titleChars" :key="'a-' + i" class="intro-char">
          <span class="intro-char-inner">{{ char }}</span>
        </span>
      </div>
      <div class="outro-title">
        <span v-for="(char, i) in outroChars" :key="'b-' + i" class="outro-char">
          <span class="outro-char-inner">{{ char }}</span>
        </span>
      </div>
    </div>

    <!-- Split overlay (bottom half after split) -->
    <div class="intro-split" ref="splitOverlay">
      <div class="intro-title">
        <span v-for="(char, i) in titleChars" :key="'c-' + i" class="intro-char">
          <span class="intro-char-inner">{{ char }}</span>
        </span>
      </div>
      <div class="outro-title">
        <span v-for="(char, i) in outroChars" :key="'d-' + i" class="outro-char">
          <span class="outro-char-inner">{{ char }}</span>
        </span>
      </div>
    </div>

    <!-- Floating tags -->
    <div class="intro-tags" ref="tagsOverlay">
      <div class="intro-tag tag-1">
        <span class="intro-tag-word">课件制作</span>
      </div>
      <div class="intro-tag tag-2">
        <span class="intro-tag-word">网页开发</span>
      </div>
      <div class="intro-tag tag-3">
        <span class="intro-tag-word">海报设计</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['done'])

const showIntro = ref(true)
const preloader = ref(null)
const splitOverlay = ref(null)
const tagsOverlay = ref(null)

const titleText = '张千帆设计'
const outroText = 'QF'
const titleChars = titleText.split('')
const outroChars = outroText.split('')

onMounted(() => {
  // Skip if already seen this session
  if (sessionStorage.getItem('intro_seen')) {
    showIntro.value = false
    emit('done')
    return
  }

  const isMobile = window.innerWidth <= 768

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      sessionStorage.setItem('intro_seen', '1')
      showIntro.value = false
      emit('done')
    }
  })

  // 1. Tags slide in
  tl.to('.intro-tag-word', {
    y: '0%',
    duration: 0.6,
    stagger: 0.08,
  }, 0.3)

  // 2. Title characters slide in
  tl.to('.intro-preloader .intro-char-inner', {
    y: '0%',
    duration: 0.6,
    stagger: 0.04,
  }, 0.3)

  // 3. Title characters slide out (except first)
  tl.to('.intro-preloader .intro-char-inner', {
    y: '100%',
    duration: 0.5,
    stagger: 0.03,
  }, 1.8)

  // 4. Outro characters slide in
  tl.to('.intro-preloader .outro-char-inner', {
    y: '0%',
    duration: 0.6,
    stagger: 0.08,
  }, 2.2)

  // 5. Hold + prepare for split
  tl.to({}, { duration: 0.5 }, 3.0)

  // 6. Tags slide out
  tl.to('.intro-tag-word', {
    y: '100%',
    duration: 0.5,
    stagger: 0.06,
  }, 3.5)

  // 7. Setup clip-paths for split
  tl.call(() => {
    gsap.set(preloader.value, {
      clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
    })
    gsap.set(splitOverlay.value, {
      clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
    })
  }, null, 3.8)

  // 8. Split apart - top goes up, bottom goes down
  tl.to(preloader.value, {
    y: '-100%',
    duration: 1.0,
    ease: 'power4.inOut',
  }, 3.8)

  tl.to(splitOverlay.value, {
    y: '100%',
    duration: 1.0,
    ease: 'power4.inOut',
  }, 3.8)

  // Fade tags overlay
  tl.to(tagsOverlay.value, {
    opacity: 0,
    duration: 0.3,
  }, 3.8)
})
</script>

<style scoped>
.intro-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
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

.intro-tags {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* Title */
.intro-title {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0;
}

.intro-char {
  display: inline-block;
  overflow: hidden;
}

.intro-char-inner {
  display: inline-block;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  transform: translateY(100%);
  will-change: transform;
}

/* Outro */
.outro-title {
  position: absolute;
  left: calc(50% + 4rem);
  display: flex;
  align-items: center;
}

.outro-char {
  display: inline-block;
  overflow: hidden;
}

.outro-char-inner {
  display: inline-block;
  font-size: clamp(5rem, 14vw, 14rem);
  font-weight: 300;
  transform: translateY(100%);
  will-change: transform;
}

/* Tags */
.intro-tag {
  position: absolute;
  width: max-content;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.intro-tag-word {
  display: inline-block;
  transform: translateY(100%);
  will-change: transform;
}

.tag-1 { top: 18%; left: 12%; }
.tag-2 { bottom: 20%; left: 20%; }
.tag-3 { bottom: 32%; right: 12%; }
</style>
