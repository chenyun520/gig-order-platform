import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { status, page = 1, limit = 20 } = req.query
      const offset = (parseInt(page) - 1) * parseInt(limit)

      let query = supabase
        .from('orders')
        .select('*, services(title)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, count, error } = await query
      if (error) throw error

      const list = (data || []).map(o => ({
        ...o,
        service_title: o.services?.title || '',
      }))
      list.forEach(o => delete o.services)

      return sendJson(res, success({
        list,
        total: count,
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
