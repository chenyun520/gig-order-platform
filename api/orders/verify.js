import { supabase } from '../_lib/supabase.js'
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
    const { data, error } = await supabase
      .from('orders')
      .select('order_no, status, created_at, quoted_price, services(title)')
      .eq('contact_phone', phone)
      .order('created_at', { ascending: false })
    if (error) throw error

    const result = data.map(o => ({
      order_no: o.order_no,
      status: o.status,
      created_at: o.created_at,
      quoted_price: o.quoted_price,
      service_title: o.services?.title || '',
    }))
    sendJson(res, success(result))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to query orders', -1, 500))
  }
}
