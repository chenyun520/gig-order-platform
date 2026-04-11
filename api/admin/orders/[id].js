import { supabase } from '../../_lib/supabase.js'
import { success, fail, sendJson } from '../../_lib/response.js'
import { authMiddleware } from '../../_lib/auth.js'

const STATUS_TIMESTAMPS = {
  paid: 'paid_at',
  confirmed: 'confirmed_at',
  in_progress: 'started_at',
  delivered: 'delivered_at',
  completed: 'completed_at',
}

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    const { id } = req.query

    if (req.method === 'PATCH') {
      const { status, quoted_price, remark } = req.body

      // Get current order
      const { data: existing, error: fetchErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      if (fetchErr || !existing) return sendJson(res, fail('Order not found', -1, 404))

      const updates = {}
      if (status) {
        updates.status = status
        if (STATUS_TIMESTAMPS[status]) {
          updates[STATUS_TIMESTAMPS[status]] = new Date().toISOString()
        }
      }
      if (quoted_price !== undefined) updates.quoted_price = quoted_price
      if (remark !== undefined) updates.remark = remark

      if (Object.keys(updates).length === 0) return sendJson(res, fail('No fields to update'))

      const { error: updateErr } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
      if (updateErr) throw updateErr

      // Log
      const action = status || 'updated'
      const note = remark || (quoted_price !== undefined ? `报价: ¥${quoted_price}` : '状态更新')
      await supabase
        .from('order_logs')
        .insert({ order_id: id, action, note })

      const { data: updated } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      return sendJson(res, success(updated))
    }

    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to update order', -1, 500))
  }
}
