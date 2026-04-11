import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { id, phone } = req.query
    if (!id || !phone) {
      return sendJson(res, fail('Order ID and phone number are required'))
    }
    const [rows] = await pool.query(
      `SELECT o.*, s.title as service_title, s.description as service_desc, s.price_type, s.unit
       FROM orders o
       JOIN services s ON o.service_id = s.id
       WHERE o.id = ? AND o.contact_phone = ?`,
      [id, phone]
    )
    if (rows.length === 0) {
      return sendJson(res, fail('Order not found', -1, 404))
    }
    // Get logs
    const [logs] = await pool.query(
      'SELECT * FROM order_logs WHERE order_id = ? ORDER BY created_at ASC',
      [id]
    )
    sendJson(res, success({ ...rows[0], logs }))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch order', -1, 500))
  }
}
