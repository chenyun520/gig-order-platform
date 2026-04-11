import pool from '../_lib/db.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM services ORDER BY sort_order ASC')
      return sendJson(res, success(rows))
    }

    if (req.method === 'POST') {
      const { title, description, price_type, price, unit, icon, sort_order, is_active } = req.body
      if (!title) return sendJson(res, fail('Title is required'))
      const { rows: result } = await pool.query(
        `INSERT INTO services (title, description, price_type, price, unit, icon, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [title, description || '', price_type || 'fixed', price || null, unit || '次', icon || '', sort_order || 0, is_active !== undefined ? is_active : true]
      )
      return sendJson(res, success({ id: result[0].id }))
    }

    if (req.method === 'PUT') {
      const { id, title, description, price_type, price, unit, icon, sort_order, is_active } = req.body
      if (!id) return sendJson(res, fail('Service ID is required'))
      await pool.query(
        `UPDATE services SET title=$1, description=$2, price_type=$3, price=$4, unit=$5, icon=$6, sort_order=$7, is_active=$8 WHERE id=$9`,
        [title, description, price_type, price, unit, icon, sort_order, is_active, id]
      )
      return sendJson(res, success({ updated: true }))
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      if (!id) return sendJson(res, fail('Service ID is required'))
      await pool.query('DELETE FROM services WHERE id = $1', [id])
      return sendJson(res, success({ deleted: true }))
    }

    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Operation failed', -1, 500))
  }
}
