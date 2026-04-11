import http from './http'

export default {
  create(data) {
    return http.post('/api/orders', data).then(r => r.data)
  },
  getById(id, phone) {
    return http.get(`/api/orders/${id}?phone=${encodeURIComponent(phone)}`).then(r => r.data)
  },
  verify(phone) {
    return http.post('/api/orders/verify', { phone }).then(r => r.data)
  },
  uploadAttachment(orderNo, phone, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('order_no', orderNo)
    formData.append('phone', phone)
    formData.append('type', 'attachments')
    return http.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }).then(r => r.data)
  },
}
