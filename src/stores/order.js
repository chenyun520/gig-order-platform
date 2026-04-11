import { defineStore } from 'pinia'
import { ref } from 'vue'
import orderApi from '../api/orders'

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref(null)
  const orderList = ref([])

  async function createOrder(data) {
    const res = await orderApi.create(data)
    if (res.code === 0) {
      currentOrder.value = res.data
      return res.data
    }
    throw new Error(res.message)
  }

  async function fetchOrder(id, phone) {
    const res = await orderApi.getById(id, phone)
    if (res.code === 0) {
      currentOrder.value = res.data
      return res.data
    }
    throw new Error(res.message)
  }

  async function verifyPhone(phone) {
    const res = await orderApi.verify(phone)
    if (res.code === 0) {
      orderList.value = res.data
      return res.data
    }
    throw new Error(res.message)
  }

  return { currentOrder, orderList, createOrder, fetchOrder, verifyPhone }
})
