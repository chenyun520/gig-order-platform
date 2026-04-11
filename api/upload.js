import { supabase } from './_lib/supabase.js'
import { success, fail, sendJson } from './_lib/response.js'
import { authMiddleware } from './_lib/auth.js'
import { parse } from 'parse-multipart-data'

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const MAX_FILES = 5

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }

  try {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      return sendJson(res, fail('Content-Type must be multipart/form-data'))
    }

    // Parse multipart
    const boundary = contentType.split('boundary=')[1]
    if (!boundary) return sendJson(res, fail('Missing boundary'))

    const bodyBuffer = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(req.body || '', 'binary')
    const parts = parse(bodyBuffer, boundary)

    const filePart = parts.find(p => p.name === 'file')
    if (!filePart || !filePart.data) {
      return sendJson(res, fail('No file provided'))
    }

    if (filePart.data.length > MAX_FILE_SIZE) {
      return sendJson(res, fail('File too large (max 4MB)'))
    }

    const type = (parts.find(p => p.name === 'type')?.data?.toString() || 'attachments')
    const orderId = parts.find(p => p.name === 'order_id')?.data?.toString()
    const orderNo = parts.find(p => p.name === 'order_no')?.data?.toString()
    const phone = parts.find(p => p.name === 'phone')?.data?.toString()

    // Auth: admin via JWT, client via order_no + phone
    const admin = authMiddleware(req)
    let resolvedOrderId = orderId

    if (!admin) {
      // Client upload: verify phone + order_no
      if (!orderNo || !phone) {
        return sendJson(res, fail('Order number and phone required'))
      }
      const { data: order } = await supabase
        .from('orders')
        .select('id, attachment_urls')
        .eq('order_no', orderNo)
        .eq('contact_phone', phone)
        .single()
      if (!order) return sendJson(res, fail('Order not found', -1, 404))
      resolvedOrderId = order.id

      // Check file count limit
      const existing = order.attachment_urls || []
      if (existing.length >= MAX_FILES) {
        return sendJson(res, fail(`Max ${MAX_FILES} files allowed`))
      }
    }

    // Sanitize filename
    const filename = filePart.filename.replace(/[^a-zA-Z0-9._\-\u4e00-\u9fff]/g, '_')
    const storagePath = `${resolvedOrderId}/${type}/${Date.now()}_${filename}`

    // Upload to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from('order-files')
      .upload(storagePath, filePart.data, {
        contentType: filePart.type || 'application/octet-stream',
        upsert: false,
      })
    if (uploadErr) throw uploadErr

    const fileInfo = { name: filePart.filename, path: storagePath, size: filePart.data.length }

    // Update order: append to attachment_urls or deliverable_urls
    const urlField = type === 'deliverables' ? 'deliverable_urls' : 'attachment_urls'
    const { data: order } = await supabase
      .from('orders')
      .select(urlField)
      .eq('id', resolvedOrderId)
      .single()

    const existing = order?.[urlField] || []
    const updated = [...existing, fileInfo]

    const { error: updateErr } = await supabase
      .from('orders')
      .update({ [urlField]: updated })
      .eq('id', resolvedOrderId)
    if (updateErr) throw updateErr

    sendJson(res, success(fileInfo))
  } catch (err) {
    console.error('Upload error:', err)
    sendJson(res, fail('Upload failed: ' + err.message, -1, 500))
  }
}
