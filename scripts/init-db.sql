CREATE DATABASE IF NOT EXISTS gig_order_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gig_order_db;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price_type ENUM('fixed','quote','mixed') NOT NULL DEFAULT 'fixed',
  price DECIMAL(10,2) NULL,
  unit VARCHAR(20) DEFAULT '次',
  icon VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(20) UNIQUE NOT NULL,
  service_id INT NOT NULL,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  requirement_desc TEXT,
  attachment_urls JSON,
  status ENUM('pending','paid','confirmed','in_progress','delivered','completed','rejected') DEFAULT 'pending',
  quoted_price DECIMAL(10,2) NULL,
  paid_at DATETIME NULL,
  confirmed_at DATETIME NULL,
  started_at DATETIME NULL,
  delivered_at DATETIME NULL,
  completed_at DATETIME NULL,
  remark TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed admin (password: admin123, bcrypt hash)
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2b$10$s0OPCsgf.KFxvHV1pSAxw.IqXzsQFrW0uZw5sjKIxSqLS3zOfIHrm');

-- Seed sample services
INSERT IGNORE INTO services (title, description, price_type, price, unit, icon, sort_order) VALUES
('PPT/课件制作', '专业课件设计，教学PPT、培训课件、学术汇报等', 'fixed', 50.00, '页', 'slides', 1),
('网页开发', '响应式网站、落地页、个人主页等前端开发', 'quote', NULL, '项目', 'code', 2),
('海报设计', '活动海报、宣传图、社交媒体配图', 'fixed', 30.00, '张', 'image', 3),
('数据处理', 'Excel数据处理、数据可视化、报表生成', 'mixed', 100.00, '次', 'data', 4),
('文档排版', '论文排版、文档美化、格式转换', 'fixed', 20.00, '页', 'doc', 5);
