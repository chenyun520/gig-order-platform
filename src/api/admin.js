import http from './http'

export default {
  login(username, password) {
    return http.post('/api/admin/login', { username, password }).then(r => r.data)
  },
  getServices() {
    return http.get('/api/admin/services').then(r => r.data)
  },
  createService(data) {
    return http.post('/api/admin/services', data).then(r => r.data)
  },
  updateService(id, data) {
    return http.put('/api/admin/services', { ...data, id }).then(r => r.data)
  },
  deleteService(id) {
    return http.delete('/api/admin/services', { data: { id } }).then(r => r.data)
  },
  getOrders(params) {
    return http.get('/api/admin/orders', { params }).then(r => r.data)
  },
  updateOrder(id, data) {
    return http.patch(`/api/admin/orders/${id}`, data).then(r => r.data)
  },
  deleteOrder(id) {
    return http.delete(`/api/admin/orders/${id}`).then(r => r.data)
  },
  uploadDeliverable(orderId, file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('order_id', orderId)
    formData.append('type', 'deliverables')
    return http.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }).then(r => r.data)
  },
  getLogs(params) {
    return http.get('/api/admin/logs', { params }).then(r => r.data)
  },
  getStats() {
    return http.get('/api/admin/stats').then(r => r.data)
  },
}
