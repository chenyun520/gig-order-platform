import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { order_id, page = 1, limit = 50 } = req.query
      const offset = (parseInt(page) - 1) * parseInt(limit)
      let where = ''
      const params = []
      if (order_id) {
        where = 'WHERE order_id = ?'
        params.push(order_id)
      }

      const [rows] = await pool.query(
        `SELECT * FROM order_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      )
      return sendJson(res, success(rows))
    }
    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch logs', -1, 500))
  }
}
