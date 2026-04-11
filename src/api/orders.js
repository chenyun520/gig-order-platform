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
    // Read file as base64 and send as JSON
    const fileB64 = await readFileAsBase64(file)
    const res = await http.post('/api/files', {
      order_no: orderNo,
      phone,
      type: 'attachments',
      filename: file.name,
      file_b64: fileB64,
    }).then(r => r.data)

    if (res.code !== 0) throw new Error(res.message)
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
