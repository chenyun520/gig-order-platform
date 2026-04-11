import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
})

export async function sendOrderEmail(order, serviceTitle) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('Email not configured, skipping notification')
    return
  }

  const statusText = order.quoted_price ? '立即支付' : '需求报价'
  const priceText = order.quoted_price ? `¥${order.quoted_price}` : '待报价'

  await transporter.sendMail({
    from: `"张千帆设计" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `新订单 ${order.order_no} — ${order.contact_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">新订单通知</h2>
        <p style="color: #666; margin-top: 0;">有客户${statusText === '需求报价' ? '提交了需求' : '下了单'}</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; color: #888;">订单号</td><td style="padding: 8px; font-weight: bold;">${order.order_no}</td></tr>
          <tr style="background: #f5f5f5;"><td style="padding: 8px; color: #888;">服务项目</td><td style="padding: 8px;">${serviceTitle}</td></tr>
          <tr><td style="padding: 8px; color: #888;">客户姓名</td><td style="padding: 8px;">${order.contact_name}</td></tr>
          <tr style="background: #f5f5f5;"><td style="padding: 8px; color: #888;">联系电话</td><td style="padding: 8px;">${order.contact_phone}</td></tr>
          <tr><td style="padding: 8px; color: #888;">金额</td><td style="padding: 8px;">${priceText}</td></tr>
          <tr style="background: #f5f5f5;"><td style="padding: 8px; color: #888;">方式</td><td style="padding: 8px;">${statusText}</td></tr>
        </table>
        ${order.requirement_desc ? `<p style="color: #888; font-size: 14px;">需求描述：</p><p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${order.requirement_desc}</p>` : ''}
        <p style="margin-top: 20px;"><a href="https://order.cherishbloom.top/admin/orders" style="background: #000; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">前往管理后台</a></p>
      </div>
    `,
  })
}
