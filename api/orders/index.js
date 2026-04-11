import { supabase } from '../_lib/supabase.js'
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

    // Generate order number: GO + date + random 3-digit
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const order_no = `GO${dateStr}${rand}`

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_no,
        service_id,
        contact_name,
        contact_phone,
        requirement_desc: requirement_desc || '',
        attachment_urls: attachment_urls || [],
      })
      .select()
      .single()
    if (error) throw error

    // Log
    await supabase
      .from('order_logs')
      .insert({ order_id: order.id, action: 'created', note: '订单创建' })

    sendJson(res, success(order))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to create order', -1, 500))
  }
}
