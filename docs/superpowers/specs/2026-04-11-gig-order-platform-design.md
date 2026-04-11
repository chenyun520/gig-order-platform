# 兼职下单平台 — 设计文档

**日期：** 2026-04-11
**状态：** 已批准

## 概述

个人接单展示站。站主发布可提供的服务（课件代做、网页开发等），客户浏览服务后直接下单，通过扫码付款+管理员手动确认收款的方式完成交易。包含完整的订单状态跟踪和管理后台。

## 技术架构

**方案：单体 SPA + Serverless API**

```
Vue3 SPA (Vite) → Vercel 静态托管
api/ → Vercel Serverless Functions (Node.js)
         ↓ mysql2/promise
Cloudflare Tunnel → Mac Mini:3306 (MySQL)
```

**技术栈：** Vue3 + Vite + Vue Router + Pinia + TailwindCSS（自定义 token）+ mysql2 + JWT

---

## 数据模型

数据库：`gig_order_db`，共 4 张表。

### admins（管理员）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| password_hash | VARCHAR(255) | bcrypt 哈希 |
| created_at | DATETIME DEFAULT NOW() | 创建时间 |

### services（服务项目）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| title | VARCHAR(100) | 服务名称 |
| description | TEXT | 服务描述 |
| price_type | ENUM('fixed','quote','mixed') | 定价方式 |
| price | DECIMAL(10,2) NULL | 固定价格（quote 时为 NULL） |
| unit | VARCHAR(20) | 单位（次/页/项目） |
| icon | VARCHAR(255) | 图标标识 |
| sort_order | INT DEFAULT 0 | 排序权重 |
| is_active | BOOLEAN DEFAULT TRUE | 是否上架 |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

### orders（订单）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| order_no | VARCHAR(20) UNIQUE | 订单号（GO20260411001） |
| service_id | INT NOT NULL | 关联服务 |
| contact_name | VARCHAR(50) NOT NULL | 客户姓名 |
| contact_phone | VARCHAR(20) NOT NULL | 客户手机号 |
| requirement_desc | TEXT | 需求描述 |
| attachment_urls | JSON | 附件 URL 列表 |
| status | ENUM('pending','paid','confirmed','in_progress','delivered','completed','rejected') DEFAULT 'pending' | 订单状态 |
| quoted_price | DECIMAL(10,2) NULL | 报价金额 |
| paid_at | DATETIME NULL | 付款时间 |
| confirmed_at | DATETIME NULL | 确认收款时间 |
| started_at | DATETIME NULL | 开始处理时间 |
| delivered_at | DATETIME NULL | 交付时间 |
| completed_at | DATETIME NULL | 完成时间 |
| remark | TEXT NULL | 管理员备注 |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

### order_logs（操作日志）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT AUTO_INCREMENT | 主键 |
| order_id | INT NOT NULL | 关联订单 |
| action | VARCHAR(50) NOT NULL | 操作类型 |
| note | TEXT | 备注 |
| created_at | DATETIME DEFAULT NOW() | |

### 状态流转
```
pending(待付款) → paid(已付款) → confirmed(已确认) → in_progress(进行中)
→ delivered(已交付) → completed(已完成)
                    ↘ rejected(已拒绝)
```

---

## API 设计

统一响应格式：`{ code: 0, data, message }`

### 公开接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/services | 服务列表（仅 active） |
| GET | /api/services/:id | 服务详情 |
| POST | /api/orders | 创建订单 |
| GET | /api/orders/:id | 查询订单（需手机号 query param） |
| POST | /api/orders/verify | 手机号验证获取订单列表 |

### 管理接口（需 Authorization: Bearer JWT）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/admin/login | 登录，返回 token |
| GET | /api/admin/services | 服务列表（含 inactive） |
| POST | /api/admin/services | 创建服务 |
| PUT | /api/admin/services/:id | 更新服务 |
| DELETE | /api/admin/services/:id | 删除服务 |
| GET | /api/admin/orders | 订单列表（分页/状态筛选） |
| PATCH | /api/admin/orders/:id | 更新订单状态/报价/备注 |
| GET | /api/admin/logs | 操作日志 |
| GET | /api/admin/stats | 统计数据 |

---

## 前端页面

### 客户端
1. **首页** — Hero 渐变背景 + 服务卡片网格，展示联系方式（QQ/微信）
2. **服务详情** — 服务介绍 + 下单表单（fixed 显示价格，quote 显示"询价"）
3. **下单成功** — 收款二维码 + 订单信息 + "我已完成付款"按钮
4. **订单查询** — 输入手机号+订单号查询
5. **订单状态** — 垂直时间线展示状态流转

### 管理后台
6. **登录** — 简洁密码登录页
7. **仪表盘** — 统计卡片（今日订单/总收入/进行中/已完成）
8. **服务管理** — 服务列表 + 新增/编辑/上下架
9. **订单管理** — 订单列表 + 状态操作 + 报价

### UI 设计规范
- 颜色：纯黑 #000 + 纯白 #fff，渐变仅用于 Hero 区
- 按钮：pill 形（border-radius: 50px）
- 字体：Inter + JetBrains Mono
- 焦点样式：dashed 2px outline
- 间距基线：8px
- 移动端优先响应式
- 卡片：8px border-radius，微妙阴影
- Hero 渐变：绿色/黄色/紫色/粉色多色渐变

---

## 目录结构

```
兼职下单平台/
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
├── api/
│   ├── services/list.js
│   ├── services/[id].js
│   ├── orders/create.js
│   ├── orders/[id].js
│   ├── orders/verify.js
│   ├── admin/login.js
│   ├── admin/services.js
│   ├── admin/orders.js
│   ├── admin/orders/[id].js
│   ├── admin/logs.js
│   ├── admin/stats.js
│   └── _lib/db.js
│   └── _lib/auth.js
│   └── _lib/response.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/index.js
│   ├── stores/admin.js
│   ├── stores/order.js
│   ├── api/services.js
│   ├── api/orders.js
│   ├── api/admin.js
│   ├── views/Home.vue
│   ├── views/ServiceDetail.vue
│   ├── views/OrderQuery.vue
│   ├── views/OrderStatus.vue
│   ├── views/admin/Login.vue
│   ├── views/admin/Dashboard.vue
│   ├── views/admin/ServiceManage.vue
│   ├── views/admin/OrderManage.vue
│   ├── components/NavBar.vue
│   ├── components/ServiceCard.vue
│   ├── components/OrderForm.vue
│   ├── components/OrderTimeline.vue
│   ├── components/QrPayment.vue
│   ├── components/StatCard.vue
│   ├── components/AdminLayout.vue
│   └── assets/styles/variables.css
│   └── assets/styles/global.css
├── public/qr/
├── scripts/init-db.sql
└── docs/superpowers/specs/
```

---

## 环境变量

```
DB_HOST=xxx.cloudflare.tunnel
DB_PORT=3306
DB_USER=gig_admin
DB_PASSWORD=xxx
DB_NAME=gig_order_db
JWT_SECRET=xxx
ADMIN_USERNAME=admin
ADMIN_PASSWORD=xxx
PAYMENT_QR_URL=/qr/payment.jpg
```
