import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json({ limit: '4mb' }))

// Wrap Vercel handler for Express
function wrap(handlerPath) {
  return async (req, res) => {
    const mod = await import(handlerPath)
    // Build Vercel-compatible req
    const vercelReq = {
      method: req.method,
      body: req.body,
      headers: req.headers,
      query: { ...req.query, ...req.params },
    }
    try {
      await mod.default(vercelReq, res)
    } catch (err) {
      console.error(`Error in ${handlerPath}:`, err)
      res.status(500).json({ code: -1, data: null, message: 'Internal Server Error' })
    }
  }
}

// Wrap for multipart (raw body)
function wrapRaw(handlerPath) {
  return async (req, res) => {
    const mod = await import(handlerPath)
    const vercelReq = {
      method: req.method,
      body: req.body, // express.raw() populates this as Buffer
      headers: req.headers,
      query: { ...req.query, ...req.params },
    }
    try {
      await mod.default(vercelReq, res)
    } catch (err) {
      console.error(`Error in ${handlerPath}:`, err)
      res.status(500).json({ code: -1, data: null, message: 'Internal Server Error' })
    }
  }
}

// Public routes
app.get('/api/services', wrap('./api/services/index.js'))
app.get('/api/services/:id', wrap('./api/services/[id].js'))
app.post('/api/orders', wrap('./api/orders/index.js'))
app.post('/api/orders/verify', wrap('./api/orders/verify.js'))
app.get('/api/orders/:id', wrap('./api/orders/[id].js'))

// Admin routes
app.post('/api/admin/login', wrap('./api/admin/login.js'))
app.get('/api/admin/services', wrap('./api/admin/services.js'))
app.post('/api/admin/services', wrap('./api/admin/services.js'))
app.put('/api/admin/services', wrap('./api/admin/services.js'))
app.delete('/api/admin/services', wrap('./api/admin/services.js'))
app.get('/api/admin/orders', wrap('./api/admin/orders.js'))
app.patch('/api/admin/orders/:id', wrap('./api/admin/orders/[id].js'))
app.get('/api/admin/logs', wrap('./api/admin/logs.js'))
app.get('/api/admin/stats', wrap('./api/admin/stats.js'))
app.delete('/api/admin/orders/:id', wrap('./api/admin/orders/[id].js'))

// File routes (upload + download)
app.post('/api/files', express.raw({ type: 'multipart/form-data', limit: '4mb' }), wrapRaw('./api/files.js'))
app.get('/api/files', wrap('./api/files.js'))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`\n  API server: http://localhost:${PORT}`)
  console.log(`  Frontend:   http://localhost:5173 (run: npm run dev)`)
  console.log(`\n  Test: curl http://localhost:${PORT}/api/services\n`)
})
