import { supabase } from '../_lib/supabase.js'
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
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, services(title, description, price_type, unit)')
      .eq('order_no', id)
      .eq('contact_phone', phone)
      .single()
    if (error || !order) {
      return sendJson(res, fail('Order not found', -1, 404))
    }

    // Get logs
    const { data: logs } = await supabase
      .from('order_logs')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true })

    // Flatten service info
    const flat = { ...order, service_title: order.services?.title, service_desc: order.services?.description, price_type: order.services?.price_type, unit: order.services?.unit }
    delete flat.services
    flat.logs = logs || []

    sendJson(res, success(flat))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch order', -1, 500))
  }
}
