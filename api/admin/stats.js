import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method !== 'GET') return sendJson(res, fail('Method not allowed', -1, 405))

    const today = new Date().toISOString().slice(0, 10) + 'T00:00:00'
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10) + 'T00:00:00'

    const [todayOrders, inProgress, completed, allOrders, pendingPayment] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today).lt('created_at', tomorrow),
      supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['confirmed', 'in_progress']),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('orders').select('quoted_price').in('status', ['completed', 'delivered']),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    const totalRevenue = (allOrders.data || []).reduce((sum, o) => sum + (parseFloat(o.quoted_price) || 0), 0)

    sendJson(res, success({
      todayOrders: todayOrders.count,
      inProgress: inProgress.count,
      completed: completed.count,
      totalRevenue,
      pendingPayment: pendingPayment.count,
    }))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch stats', -1, 500))
  }
}
