import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, title, description, price_type, price, unit, icon, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    sendJson(res, success(data))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch services', -1, 500))
  }
}
