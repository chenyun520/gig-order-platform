<template>
  <div class="qr-payment">
    <div class="qr-payment__card card">
      <span class="mono-label">{{ mode === 'pay' ? '订单创建成功' : '需求已提交' }}</span>
      <div class="qr-payment__order-row">
        <h3 class="qr-payment__order-no">{{ order.order_no }}</h3>
        <button class="btn btn-sm btn-outline" @click="copyOrderNo">复制</button>
      </div>

      <!-- 立即支付模式 -->
      <template v-if="mode === 'pay'">
        <div class="qr-payment__amount" v-if="displayPrice">
          ¥{{ displayPrice }}
        </div>
        <div class="qr-payment__amount qr-payment__amount--pending" v-else>
          待报价
        </div>
        <div class="qr-payment__qr">
          <img src="/qr/payment.jpg" alt="收款码" class="qr-payment__img" />
          <p class="qr-payment__hint">扫码完成付款</p>
        </div>
      </template>

      <!-- 获取报价模式 -->
      <template v-else>
        <div class="qr-payment__quote-status">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span>等待报价中</span>
        </div>
        <p class="qr-payment__quote-desc">管理员确认需求后会给出报价，请通过查询订单查看报价金额后再付款。</p>
      </template>

      <!-- 添加好友引导 -->
      <div class="qr-payment__contact">
        <h4 class="qr-payment__contact-title">添加好友，发材料给我</h4>
        <div class="qr-payment__contact-btns">
          <button class="qr-payment__contact-btn" @click="copyToClipboard('826857706', 'QQ号已复制，请前往QQ添加好友')">
            <svg viewBox="0 0 16 16" fill="currentColor" width="20" height="20">
              <path d="M6.048 3.323c.022.277-.13.523-.338.55-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333-.027.048-.008.117.037.15.045.035.092.025.119-.003.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098.023-.063.017-.11-.006-.142-.016-.023-.089-.08-.247-.118"/>
              <path d="M11.727 6.719c0-.022.01-.375.01-.557 0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113.36.044 1.401-1.647 1.401-1.647 0 .979.504 2.256 1.594 3.179-.408.126-.907.319-1.228.556-.29.213-.253.43-.201.518.228.386 3.92.246 4.985.126 1.065.12 4.756.26 4.984-.126.052-.088.088-.305-.2-.518-.322-.237-.822-.43-1.23-.557 1.09-.922 1.594-2.2 1.594-3.178 0 0 1.041 1.69 1.401 1.647.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795ZM9.773 5.53a.1.1 0 0 1-.009.096c-.109.159-1.554.943-3.033.943h-.017c-1.48 0-2.925-.784-3.034-.943a.1.1 0 0 1-.018-.055q0-.022.01-.04c.13-.287 1.43-.606 3.042-.606h.017c1.611 0 2.912.319 3.042.605m-4.32-.989c-.483.022-.896-.529-.922-1.229s.344-1.286.828-1.308c.483-.022.896.529.922 1.23.027.7-.344 1.286-.827 1.307Zm2.538 0c-.484-.022-.854-.607-.828-1.308.027-.7.44-1.25.923-1.23.483.023.853.608.827 1.309-.026.7-.439 1.251-.922 1.23ZM2.928 8.99q.32.063.639.117v2.336s1.104.222 2.21.068V9.363q.49.027.937.023h.017c1.117.013 2.474-.136 3.786-.396.097.622.151 1.386.097 2.284-.146 2.45-1.6 3.99-3.846 4.012h-.091c-2.245-.023-3.7-1.562-3.846-4.011-.054-.9 0-1.663.097-2.285"/>
            </svg>
            <span>QQ: 826857706</span>
            <small>点击复制</small>
          </button>
          <button class="qr-payment__contact-btn" @click="copyToClipboard('ZQFservice', '微信号已复制，请前往微信添加好友')">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.68 4.025c-3.837 0-6.953 2.708-6.953 6.048 0 3.342 3.116 6.048 6.953 6.048.748 0 1.47-.1 2.15-.3a.714.714 0 01.574.08l1.432.84a.276.276 0 00.14.045.24.24 0 00.234-.236c0-.058-.023-.115-.038-.17l-.294-1.12a.477.477 0 01.17-.533c1.478-1.094 2.39-2.761 2.39-4.654 0-3.34-3.117-6.048-6.954-6.048h.2zm-2.136 3.34c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948zm4.272 0c.515 0 .933.425.933.948a.94.94 0 01-.933.947.94.94 0 01-.933-.947c0-.523.418-.948.933-.948z"/>
            </svg>
            <span>微信: ZQFservice</span>
            <small>点击复制</small>
          </button>
        </div>
        <p class="qr-payment__contact-note">加好友后把需求材料发给我，后续沟通都在微信/QQ进行</p>
      </div>

      <div class="qr-payment__footer">
        <router-link to="/" class="qr-payment__link">← 返回首页</router-link>
        <router-link to="/order/query" class="qr-payment__link">查询订单 →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const toast = useToast()

const props = defineProps({
  order: { type: Object, required: true },
  mode: { type: String, default: 'pay' },  // 'pay' or 'quote'
})

const displayPrice = computed(() => {
  if (props.order.quoted_price) return props.order.quoted_price
  if (props.order.price_type !== 'quote' && props.order.price) return props.order.price
  return null
})

function copyOrderNo() {
  navigator.clipboard.writeText(props.order.order_no).then(() => {
    toast.show('订单号已复制')
  }).catch(() => {
    toast.show('订单号已复制')
  })
}

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
.qr-payment {
  display: flex;
  justify-content: center;
  padding: var(--space-8) 0;
}

.qr-payment__card {
  text-align: center;
  padding: var(--space-8);
  max-width: 420px;
  width: 100%;
}

.qr-payment__order-no {
  font-family: var(--font-mono);
  margin: var(--space-2) 0 var(--space-4);
  font-size: 1.25rem;
}

.qr-payment__amount {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-5);
}

.qr-payment__amount--pending {
  font-size: 1.25rem;
  font-weight: 450;
  color: var(--color-gray-500);
}

.qr-payment__qr {
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-payment__img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  box-shadow: var(--shadow-md);
}

.qr-payment__hint {
  margin-top: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.qr-payment__order-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-2) 0 var(--space-4);
}

/* Quote mode */
.qr-payment__quote-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: #fef9c3;
  border-radius: var(--radius-pill);
  font-weight: 540;
  font-size: 0.9375rem;
  margin-bottom: var(--space-3);
}

.qr-payment__quote-status svg {
  color: #ca8a04;
}

.qr-payment__quote-desc {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  line-height: 1.6;
  margin-bottom: var(--space-5);
}

/* Contact section */
.qr-payment__contact {
  background: var(--color-gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
  text-align: left;
}

.qr-payment__contact-title {
  font-size: 0.9375rem;
  font-weight: 540;
  margin-bottom: var(--space-3);
  text-align: center;
}

.qr-payment__contact-btns {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.qr-payment__contact-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--font-sans);
  transition: all 0.15s;
}

.qr-payment__contact-btn:hover {
  border-color: var(--color-black);
  box-shadow: var(--shadow-sm);
}

.qr-payment__contact-btn svg {
  flex-shrink: 0;
  color: var(--color-gray-600);
}

.qr-payment__contact-btn span {
  flex: 1;
  text-align: left;
  font-weight: 540;
}

.qr-payment__contact-btn small {
  color: var(--color-gray-400);
  font-size: 0.75rem;
}

.qr-payment__contact-note {
  margin-top: var(--space-3);
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  text-align: center;
  line-height: 1.5;
}

.qr-payment__footer {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.qr-payment__link {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-decoration: none;
}

.qr-payment__link:hover {
  color: var(--color-black);
}
</style>
