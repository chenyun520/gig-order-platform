import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method !== 'GET') return sendJson(res, fail('Method not allowed', -1, 405))

    // Stats endpoint: /api/admin/logs?type=stats
    if (req.query.type === 'stats') {
      const today = new Date().toISOString().slice(0, 10) + 'T00:00:00'
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10) + 'T00:00:00'

      const [todayOrders, inProgress, completed, allOrders, pendingPayment] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today).lt('created_at', tomorrow),
        supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'in_progress']),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('orders').select('quoted_price').in('status', ['completed', 'delivered']),
        supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'quoted']),
      ])

      const totalRevenue = (allOrders.data || []).reduce((sum, o) => sum + (parseFloat(o.quoted_price) || 0), 0)

      return sendJson(res, success({
        todayOrders: todayOrders.count,
        inProgress: inProgress.count,
        completed: completed.count,
        totalRevenue,
        pendingPayment: pendingPayment.count,
      }))
    }

    // Logs endpoint (default)
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
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch data', -1, 500))
  }
}
