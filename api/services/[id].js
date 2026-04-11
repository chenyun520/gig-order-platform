import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { id } = req.query
    const [rows] = await pool.query(
      'SELECT * FROM services WHERE id = ? AND is_active = TRUE',
      [id]
    )
    if (rows.length === 0) {
      return sendJson(res, fail('Service not found', -1, 404))
    }
    sendJson(res, success(rows[0]))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch service', -1, 500))
  }
}
