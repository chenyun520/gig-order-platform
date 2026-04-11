import pool from '../../_lib/db.js'
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
      const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id])
      if (existing.length === 0) return sendJson(res, fail('Order not found', -1, 404))

      const updates = []
      const params = []

      if (status) {
        updates.push('status = ?')
        params.push(status)
        // Auto-set timestamp
        if (STATUS_TIMESTAMPS[status]) {
          updates.push(`${STATUS_TIMESTAMPS[status]} = NOW()`)
        }
      }
      if (quoted_price !== undefined) {
        updates.push('quoted_price = ?')
        params.push(quoted_price)
      }
      if (remark !== undefined) {
        updates.push('remark = ?')
        params.push(remark)
      }

      if (updates.length === 0) return sendJson(res, fail('No fields to update'))

      params.push(id)
      await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params)

      // Log
      const action = status || 'updated'
      const note = remark || (quoted_price !== undefined ? `报价: ¥${quoted_price}` : '状态更新')
      await pool.query(
        'INSERT INTO order_logs (order_id, action, note) VALUES (?, ?, ?)',
        [id, action, note]
      )

      const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id])
      return sendJson(res, success(updated[0]))
    }

    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to update order', -1, 500))
  }
}
