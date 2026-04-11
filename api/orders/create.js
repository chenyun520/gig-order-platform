import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { service_id, contact_name, contact_phone, requirement_desc, attachment_urls } = req.body

    if (!service_id || !contact_name || !contact_phone) {
      return sendJson(res, fail('Missing required fields: service_id, contact_name, contact_phone'))
    }

    // Generate order number: GO + date + sequence
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as cnt FROM orders WHERE DATE(created_at) = CURDATE()'
    )
    const seq = String(countResult[0].cnt + 1).padStart(3, '0')
    const order_no = `GO${dateStr}${seq}`

    const [result] = await pool.query(
      `INSERT INTO orders (order_no, service_id, contact_name, contact_phone, requirement_desc, attachment_urls)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_no, service_id, contact_name, contact_phone, requirement_desc || '', JSON.stringify(attachment_urls || [])]
    )

    // Log
    await pool.query(
      'INSERT INTO order_logs (order_id, action, note) VALUES (?, ?, ?)',
      [result.insertId, 'created', '订单创建']
    )

    const [newOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [result.insertId])
    sendJson(res, success(newOrder[0]))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to create order', -1, 500))
  }
}
