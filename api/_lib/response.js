export function success(data = null, message = 'ok') {
  return { code: 0, data, message }
}

export function fail(message = 'error', code = -1, status = 400) {
  return { code, data: null, message, status }
}

export function sendJson(res, body) {
  const status = body.status || 200
  res.status(status).json(body)
}
