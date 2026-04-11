CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price_type VARCHAR(20) NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed','quote','mixed')),
  price NUMERIC(10,2) NULL,
  unit VARCHAR(20) DEFAULT '次',
  icon VARCHAR(255) DEFAULT '',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(20) UNIQUE NOT NULL,
  service_id INT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  contact_name VARCHAR(50) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  requirement_desc TEXT,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  deliverable_urls JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','quoted','paid','confirmed','in_progress','delivered','completed','rejected')),
  quoted_price NUMERIC(10,2) NULL,
  quoted_at TIMESTAMPTZ NULL,
  paid_at TIMESTAMPTZ NULL,
  confirmed_at TIMESTAMPTZ NULL,
  started_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  completed_at TIMESTAMPTZ NULL,
  remark TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_logs (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO admins (username, password_hash) VALUES ('admin', '$2b$10$s0OPCsgf.KFxvHV1pSAxw.IqXzsQFrW0uZw5sjKIxSqLS3zOfIHrm')
ON CONFLICT (username) DO NOTHING;

INSERT INTO services (title, description, price_type, price, unit, icon, sort_order) VALUES
('PPT/课件制作', '专业课件设计，教学PPT、培训课件、学术汇报等', 'fixed', 50.00, '页', 'slides', 1),
('网页开发', '响应式网站、落地页、个人主页等前端开发', 'quote', NULL, '项目', 'code', 2),
('海报设计', '活动海报、宣传图、社交媒体配图', 'fixed', 30.00, '张', 'image', 3),
('数据处理', 'Excel数据处理、数据可视化、报表生成', 'mixed', 100.00, '次', 'data', 4),
('文档排版', '论文排版、文档美化、格式转换', 'fixed', 20.00, '页', 'doc', 5)
ON CONFLICT DO NOTHING;
