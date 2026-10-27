import nodemailer from 'nodemailer';

/**
 * Creates and returns a Nodemailer transporter.
 * Configured via environment variables:
 * - SMTP_HOST
 * - SMTP_PORT
 * - SMTP_SECURE (true for 465, false for 587/other)
 * - SMTP_USER
 * - SMTP_PASS
 * - FROM_EMAIL
 */
const getTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Fallback: Create ethereal test account if no SMTP env variables configured
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('[EmailService] Could not create Ethereal test account, using JSON transport fallback.');
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
};

/**
 * Sends an email to a specific recipient.
 * @param {Object} options
 * @param {string} options.to - Exact recipient email address.
 * @param {string} options.subject - Email subject line.
 * @param {string} options.text - Plain text content.
 * @param {string} [options.html] - HTML content.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || typeof to !== 'string') {
    throw new Error('Recipient email address ("to") is required and must be a string.');
  }

  const cleanRecipient = to.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanRecipient)) {
    throw new Error(`Invalid recipient email address format: "${to}"`);
  }

  const transporter = await getTransporter();
  const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER || '"SkillCert Administration" <admin@skillcert.com>';

  const mailOptions = {
    from: fromAddress,
    to: cleanRecipient,
    subject: subject || 'SkillCert Platform Notification',
    text: text || '',
    html: html || `<div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #4f46e5;">SkillCert Certification Board</h2>
      <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${text || ''}</div>
      <hr style="margin-top: 20px; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 11px; color: #64748b;">This email was dispatched to ${cleanRecipient} by SkillCert Administration.</p>
    </div>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log(`[EmailService] Email successfully dispatched to: ${cleanRecipient}`);
  console.log(`[EmailService] MessageID: ${info.messageId}`);

  let previewUrl = null;
  if (nodemailer.getTestMessageUrl(info)) {
    previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[EmailService] Test Preview URL: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    recipient: cleanRecipient,
    previewUrl,
  };
};
