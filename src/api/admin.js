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
  async uploadDeliverable(orderId, file) {
    // Phase 1: get signed upload URL
    const signRes = await http.post('/api/files', {
      action: 'sign',
      order_id: orderId,
      type: 'deliverables',
      filename: file.name,
      size: file.size,
    }).then(r => r.data)

    if (signRes.code !== 0) throw new Error(signRes.message)

    // Phase 2: upload directly to Supabase Storage
    const uploadRes = await fetch(signRes.data.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })
    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`)
    }

    // Phase 3: confirm
    const fileInfo = { name: file.name, path: signRes.data.path, size: file.size }
    await http.post('/api/files', {
      action: 'confirm',
      order_id: orderId,
      type: 'deliverables',
      file_info: fileInfo,
    }).then(r => r.data)
  },
  getLogs(params) {
    return http.get('/api/admin/logs', { params }).then(r => r.data)
  },
  getStats() {
    return http.get('/api/admin/stats').then(r => r.data)
  },
}
