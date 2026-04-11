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
  async uploadAttachment(orderNo, phone, file) {
    // Phase 1: get signed upload URL
    const signRes = await http.post('/api/files', {
      action: 'sign',
      order_no: orderNo,
      phone,
      type: 'attachments',
      filename: file.name,
      size: file.size,
    }).then(r => r.data)

    if (signRes.code !== 0) throw new Error(signRes.message)

    // Phase 2: upload directly to Supabase
    await fetch(signRes.data.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    })

    // Phase 3: confirm
    const fileInfo = { name: file.name, path: signRes.data.path, size: file.size }
    await http.post('/api/files', {
      action: 'confirm',
      order_no: orderNo,
      phone,
      type: 'attachments',
      file_info: fileInfo,
    }).then(r => r.data)
  },
}
