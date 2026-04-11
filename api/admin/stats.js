import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method !== 'GET') return sendJson(res, fail('Method not allowed', -1, 405))

    const [todayOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()'
    )
    const [inProgress] = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status IN ('confirmed','in_progress')"
    )
    const [completed] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = ?',
      ['completed']
    )
    const [totalRevenue] = await pool.query(
      "SELECT COALESCE(SUM(quoted_price), 0) as total FROM orders WHERE status IN ('completed','delivered')"
    )
    const [pendingPayment] = await pool.query(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
    )

    sendJson(res, success({
      todayOrders: todayOrders[0].count,
      inProgress: inProgress[0].count,
      completed: completed[0].count,
      totalRevenue: totalRevenue[0].total,
      pendingPayment: pendingPayment[0].count,
    }))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch stats', -1, 500))
  }
}
