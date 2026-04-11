import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, price_type, price, unit, icon, sort_order FROM services WHERE is_active = TRUE ORDER BY sort_order ASC'
    )
    sendJson(res, success(rows))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch services', -1, 500))
  }
}
