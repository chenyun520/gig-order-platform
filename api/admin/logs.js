import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { order_id, page = 1, limit = 50 } = req.query
      const offset = (parseInt(page) - 1) * parseInt(limit)

      let query = supabase
        .from('order_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1)

      if (order_id) {
        query = query.eq('order_id', order_id)
      }

      const { data, error } = await query
      if (error) throw error
      return sendJson(res, success(data || []))
    }
    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch logs', -1, 500))
  }
}
