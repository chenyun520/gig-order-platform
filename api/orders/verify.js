import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { phone } = req.body
    if (!phone) {
      return sendJson(res, fail('Phone number is required'))
    }
    const { rows } = await pool.query(
      `SELECT o.order_no, o.status, o.created_at, o.quoted_price, s.title as service_title
       FROM orders o
       JOIN services s ON o.service_id = s.id
       WHERE o.contact_phone = $1
       ORDER BY o.created_at DESC`,
      [phone]
    )
    sendJson(res, success(rows))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to query orders', -1, 500))
  }
}
