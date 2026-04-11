import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES = '24h'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function authMiddleware(req) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }
  try {
    return verifyToken(auth.slice(7))
  } catch {
    return null
  }
}
