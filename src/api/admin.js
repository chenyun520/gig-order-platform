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
  reorderServices(orders) {
    return http.patch('/api/admin/services', { orders }).then(r => r.data)
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
  async uploadDeliverable(orderId, file) {
    // Read file as base64 and send as JSON
    const fileB64 = await readFileAsBase64(file)
    const res = await http.post('/api/files', {
      order_id: orderId,
      type: 'deliverables',
      filename: file.name,
      file_b64: fileB64,
    }).then(r => r.data)

    if (res.code !== 0) throw new Error(res.message)
  },
  getLogs(params) {
    return http.get('/api/admin/logs', { params }).then(r => r.data)
  },
  getStats() {
    return http.get('/api/admin/logs?type=stats').then(r => r.data)
  },
  // Notifications (public + admin CRUD in one endpoint)
  getNotifications() {
    return http.get('/api/notifications').then(r => r.data)
  },
  createNotification(data) {
    return http.post('/api/notifications', data).then(r => r.data)
  },
  updateNotification(id, data) {
    return http.put('/api/notifications', { ...data, id }).then(r => r.data)
  },
  deleteNotification(id) {
    return http.delete('/api/notifications', { data: { id } }).then(r => r.data)
  },
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
