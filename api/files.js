import { supabase } from './_lib/supabase.js'
import { success, fail, sendJson } from './_lib/response.js'
import { authMiddleware } from './_lib/auth.js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      return await handleUpload(req, res)
    }
    if (req.method === 'GET') {
      return await handleDownload(req, res)
    }
    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error('Files handler error:', err)
    sendJson(res, fail('Server error: ' + err.message, -1, 500))
  }
}

async function handleUpload(req, res) {
  const { order_id, order_no, phone, type, filename, file_b64 } = req.body || {}

  if (!filename || !file_b64) {
    return sendJson(res, fail('filename and file_b64 required'))
  }

  // Auth: admin via JWT, client via order_no + phone
  const admin = authMiddleware(req)
  let resolvedOrderId = order_id

  if (!admin) {
    if (!order_no || !phone) {
      return sendJson(res, fail('order_no and phone required'))
    }
    const { data: order } = await supabase
      .from('orders')
      .select('id, attachment_urls')
      .eq('order_no', order_no)
      .eq('contact_phone', phone)
      .single()
    if (!order) return sendJson(res, fail('Order not found', -1, 404))
    resolvedOrderId = order.id

    // Check file count
    const existing = order.attachment_urls || []
    if (existing.length >= 5) {
      return sendJson(res, fail('Max 5 files allowed'))
    }
  }

  if (!resolvedOrderId) return sendJson(res, fail('order_id required'))

  // Decode base64
  const matches = file_b64.match(/^data:(.+);base64,(.+)$/)
  const rawB64 = matches ? matches[2] : file_b64
  const mimeType = matches ? matches[1] : 'application/octet-stream'
  const buffer = Buffer.from(rawB64, 'base64')

  if (buffer.length > 50 * 1024 * 1024) {
    return sendJson(res, fail('File too large (max 50MB)'))
  }

  // Build storage path (ASCII only)
  const ext = filename.includes('.') ? '.' + filename.split('.').pop().toLowerCase() : ''
  const folder = type === 'deliverables' ? 'deliverables' : 'attachments'
  const storagePath = `${resolvedOrderId}/${folder}/${Date.now()}${ext}`

  // Upload to Supabase Storage
  const { error: uploadErr } = await supabase.storage
    .from('order-files')
    .upload(storagePath, buffer, {
      contentType: mimeType,
      upsert: false,
    })
  if (uploadErr) throw uploadErr

  // Update order: append file info
  const urlField = type === 'deliverables' ? 'deliverable_urls' : 'attachment_urls'
  const { data: order } = await supabase
    .from('orders')
    .select(urlField)
    .eq('id', resolvedOrderId)
    .single()

  const existing = order?.[urlField] || []
  const fileInfo = { name: filename, path: storagePath, size: buffer.length }
  const updated = [...existing, fileInfo]

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ [urlField]: updated })
    .eq('id', resolvedOrderId)
  if (updateErr) throw updateErr

  sendJson(res, success(fileInfo))
}

async function handleDownload(req, res) {
  const filePath = req.query.path || ''
  if (!filePath) return sendJson(res, fail('File path required'))

  const admin = authMiddleware(req)
  if (!admin) {
    const { phone, order_no } = req.query
    if (!phone || !order_no) {
      return sendJson(res, fail('Phone and order_no required', -1, 401))
    }
    const orderId = filePath.split('/')[0]
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('order_no', order_no)
      .eq('contact_phone', phone)
      .single()
    if (!order) return sendJson(res, fail('Access denied', -1, 403))
  }

  // Public bucket - redirect to public URL
  const { data } = supabase.storage
    .from('order-files')
    .getPublicUrl(filePath)

  if (!data?.publicUrl) {
    return sendJson(res, fail('File not found', -1, 404))
  }

  res.redirect(data.publicUrl)
}
