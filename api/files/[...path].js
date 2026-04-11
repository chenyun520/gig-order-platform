import { supabase } from '../_lib/supabase.js'
import { fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }

  try {
    const filePath = req.query.path || ''
    if (!filePath) return sendJson(res, fail('File path required'))

    // Auth check: admin JWT or client phone+order_no
    const admin = authMiddleware(req)
    if (!admin) {
      const { phone, order_no } = req.query
      if (!phone || !order_no) {
        return sendJson(res, fail('Phone and order_no required', -1, 401))
      }
      // Verify the order belongs to this phone
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

    // Download from Supabase Storage
    const { data, error } = await supabase.storage
      .from('order-files')
      .download(filePath)

    if (error || !data) {
      return sendJson(res, fail('File not found', -1, 404))
    }

    // Guess content type from filename
    const filename = filePath.split('/').pop()
    const ext = filename.split('.').pop().toLowerCase()
    const mimeMap = {
      pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
      gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
      doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      zip: 'application/zip', rar: 'application/x-rar-compressed',
      txt: 'text/plain', csv: 'text/csv', json: 'application/json',
      mp4: 'video/mp4', mp3: 'audio/mpeg',
    }
    const contentType = mimeMap[ext] || 'application/octet-stream'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename.replace(/^\d+_/, ''))}"`)
    const buffer = Buffer.from(await data.arrayBuffer())
    res.setHeader('Content-Length', buffer.length)
    res.status(200).end(buffer)
  } catch (err) {
    console.error('File download error:', err)
    sendJson(res, fail('Download failed', -1, 500))
  }
}
