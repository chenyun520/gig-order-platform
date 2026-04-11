import { supabase } from '../_lib/supabase.js'
import { success, fail, sendJson } from '../_lib/response.js'
import { signToken } from '../_lib/auth.js'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, fail('Method not allowed', -1, 405))
  }
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return sendJson(res, fail('Username and password are required'))
    }
    const { data: admins, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
    if (error) throw error
    if (!admins || admins.length === 0) {
      return sendJson(res, fail('Invalid credentials'))
    }
    const admin = admins[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return sendJson(res, fail('Invalid credentials'))
    }
    const token = signToken({ id: admin.id, username: admin.username })
    sendJson(res, success({ token }))
  } catch (err) {
    console.error(err)
    sendJson(res, fail('Login failed', -1, 500))
  }
}
