import User from '../models/User.js';
import { sendEmail } from '../utils/emailService.js';

// @desc Send Mail / Broadcast Email to Students (Admin)
// @route POST /api/admin/mail/send
export const sendStudentMail = async (req, res) => {
  try {
    const { recipientType, studentEmail, subject, body } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: 'Email subject is required.' });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: 'Email message body is required.' });
    }

    if (recipientType === 'single') {
      if (!studentEmail || !studentEmail.trim()) {
        return res.status(400).json({ success: false, message: 'Recipient email address is required.' });
      }

      const cleanEmail = studentEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, message: `Invalid recipient email address: "${studentEmail}"` });
      }

      // Send to the exact recipient email entered by admin
      const result = await sendEmail({
        to: cleanEmail,
        subject: subject.trim(),
        text: body.trim(),
      });

      return res.json({
        success: true,
        message: `Email successfully delivered to ${cleanEmail}`,
        recipientCount: 1,
        recipients: [cleanEmail],
        previewUrl: result.previewUrl,
      });
    } else {
      // Broadcast mode: fetch active student users
      const users = await User.find({ role: 'user', isSuspended: false }).select('email name');
      if (!users || users.length === 0) {
        return res.status(400).json({ success: false, message: 'No active student accounts found to send email.' });
      }

      const sentRecipients = [];
      const errors = [];

      for (const u of users) {
        try {
          await sendEmail({
            to: u.email,
            subject: subject.trim(),
            text: body.trim(),
          });
          sentRecipients.push(u.email);
        } catch (err) {
          console.error(`[Admin Mailer] Error sending to ${u.email}:`, err);
          errors.push({ email: u.email, error: err.message });
        }
      }

      if (sentRecipients.length === 0) {
        return res.status(500).json({
          success: false,
          message: 'Failed to deliver emails to all recipients.',
          errors,
        });
      }

      return res.json({
        success: true,
        message: `Email broadcast successfully delivered to ${sentRecipients.length} student(s)!`,
        recipientCount: sentRecipients.length,
        recipients: sentRecipients,
      });
    }
  } catch (error) {
    console.error('[Admin Mail Error]', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while sending email.',
    });
  }
};
