import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { authMiddleware } from '../_lib/auth.js'

export default async function handler(req, res) {
  const admin = authMiddleware(req)
  if (!admin) return sendJson(res, fail('Unauthorized', -1, 401))

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      return sendJson(res, success(data))
    }

    if (req.method === 'POST') {
      const { title, content, is_pinned, is_active } = req.body
      if (!title) return sendJson(res, fail('Title is required'))
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title,
          content: content || '',
          is_pinned: is_pinned || false,
          is_active: is_active !== undefined ? is_active : true,
        })
        .select('id')
        .single()
      if (error) throw error
      return sendJson(res, success({ id: data.id }))
    }

    if (req.method === 'PUT') {
      const { id, title, content, is_pinned, is_active } = req.body
      if (!id) return sendJson(res, fail('Notification ID is required'))
      const { error } = await supabase
        .from('notifications')
        .update({
          title,
          content,
          is_pinned,
          is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
      return sendJson(res, success({ updated: true }))
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      if (!id) return sendJson(res, fail('Notification ID is required'))
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
      if (error) throw error
      return sendJson(res, success({ deleted: true }))
    }

    return sendJson(res, fail('Method not allowed', -1, 405))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Operation failed', -1, 500))
  }
}
