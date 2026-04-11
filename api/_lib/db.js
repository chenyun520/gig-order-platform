import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  max: 5,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

export default pool
