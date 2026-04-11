import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { status, page = 1, limit = 20 } = req.query
      const offset = (parseInt(page) - 1) * parseInt(limit)
      let where = ''
      const params = []
      if (status) {
        where = 'WHERE o.status = ?'
        params.push(status)
      }

      const [rows] = await pool.query(
        `SELECT o.*, s.title as service_title
         FROM orders o
         JOIN services s ON o.service_id = s.id
         ${where}
         ORDER BY o.created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), offset]
      )

      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM orders o ${where}`,
        params
      )

      return sendJson(res, success({
        list: rows,
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
      }))
    }

    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch orders', -1, 500))
  }
}
