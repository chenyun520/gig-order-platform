import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { id } = req.query
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    if (error || !data) {
      return sendJson(res, fail('Service not found', -1, 404))
    }
    sendJson(res, success(data))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch service', -1, 500))
  }
}
