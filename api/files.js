import { supabase } from './_lib/supabase.js'
import { success, fail, sendJson } from './_lib/response.js'
import { authMiddleware } from './_lib/auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await handleDownload(req, res)
    }
    if (req.method === 'POST') {
      return await handleUploadAction(req, res)
    }
    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error('Files handler error:', err)
    sendJson(res, fail('Server error: ' + err.message, -1, 500))
  }
}

/**
 * POST /api/files — two-phase upload
 * Phase 1: { action: 'sign', order_id, order_no?, phone?, type, filename, size }
 *   → returns { upload_url, path }
 * Phase 2: { action: 'confirm', order_id, order_no?, phone?, type, file_info: { name, path, size } }
 *   → updates order's attachment_urls or deliverable_urls
 */
async function handleUploadAction(req, res) {
  const { action } = req.body || {}

  if (action === 'sign') {
    return await signUpload(req, res)
  }
  if (action === 'confirm') {
    return await confirmUpload(req, res)
  }
  return sendJson(res, fail('Invalid action, use "sign" or "confirm"'))
}

async function signUpload(req, res) {
  const { order_id, order_no, phone, type, filename, size } = req.body

  const admin = authMiddleware(req)
  let resolvedOrderId = order_id

  // Auth check
  if (!admin) {
    if (!order_no || !phone) {
      return sendJson(res, fail('Order number and phone required'))
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
  if (!filename) return sendJson(res, fail('filename required'))

  // Build storage path (ASCII only to avoid URL encoding issues)
  const ext = filename.includes('.') ? '.' + filename.split('.').pop() : ''
  const safeName = Date.now() + ext
  const folder = type === 'deliverables' ? 'deliverables' : 'attachments'
  const storagePath = `${resolvedOrderId}/${folder}/${safeName}`

  // Create signed upload URL
  const { data, error } = await supabase.storage
    .from('order-files')
    .createSignedUploadUrl(storagePath)

  if (error) throw error

  sendJson(res, success({
    path: storagePath,
    signedUrl: data.signedUrl,
    token: data.token,
  }))
}

async function confirmUpload(req, res) {
  const { order_id, order_no, phone, type, file_info } = req.body

  if (!file_info || !file_info.path || !file_info.name) {
    return sendJson(res, fail('file_info with path and name required'))
  }

  const admin = authMiddleware(req)
  let resolvedOrderId = order_id

  if (!admin) {
    if (!order_no || !phone) {
      return sendJson(res, fail('Order number and phone required'))
    }
    const { data: order } = await supabase
      .from('orders')
      .select('id')
      .eq('order_no', order_no)
      .eq('contact_phone', phone)
      .single()
    if (!order) return sendJson(res, fail('Order not found', -1, 404))
    resolvedOrderId = order.id
  }

  if (!resolvedOrderId) return sendJson(res, fail('order_id required'))

  // Update order: append file info
  const urlField = type === 'deliverables' ? 'deliverable_urls' : 'attachment_urls'
  const { data: order } = await supabase
    .from('orders')
    .select(urlField)
    .eq('id', resolvedOrderId)
    .single()

  const existing = order?.[urlField] || []
  const updated = [...existing, file_info]

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ [urlField]: updated })
    .eq('id', resolvedOrderId)
  if (updateErr) throw updateErr

  sendJson(res, success({ confirmed: true }))
}

async function handleDownload(req, res) {
  const filePath = req.query.path || ''
  if (!filePath) return sendJson(res, fail('File path required'))

  // Auth check
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

  // Bucket is public, use public URL
  const { data } = supabase.storage
    .from('order-files')
    .getPublicUrl(filePath)

  if (!data?.publicUrl) {
    return sendJson(res, fail('File not found', -1, 404))
  }

  res.redirect(data.publicUrl)
}
