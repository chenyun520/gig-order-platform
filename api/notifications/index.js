import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, content, is_pinned, created_at')
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    sendJson(res, success(data))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Failed to fetch notifications', -1, 500))
  }
}
