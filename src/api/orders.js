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
}
