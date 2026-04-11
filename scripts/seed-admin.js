import bcrypt from 'bcryptjs'

const password = process.argv[2] || 'admin123'
const hash = await bcrypt.hash(password, 10)
console.log(`Password hash for "${password}":`)
console.log(hash)
console.log(`\nSQL: INSERT INTO admins (username, password_hash) VALUES ('admin', '${hash}');`)
