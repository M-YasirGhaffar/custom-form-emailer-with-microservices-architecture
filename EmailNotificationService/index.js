require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3003;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, world! This is Email Notification Service.' });
});

app.post('/send-admin-email', async (req, res) => {
  const { email, data, ipAddress, userAgent, referer, headers } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New Form Submission',
    text: `You have received a new form submission.\nEmail: ${email}\nData: ${JSON.stringify(data)}\nIP Address: ${ipAddress}\nUser Agent: ${userAgent}\nReferer: ${referer}\nHeaders: ${JSON.stringify(headers)}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin email sent successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending email to admin:', err);
    res.status(500).json({ success: false, error: 'Error sending admin email' });
  }
});

app.post('/send-auto-reply', async (req, res) => {
  const { email } = req.body;

  const autoReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for your submission',
    text: `Hi, thank you for reaching out to us. We have received your message and will get back to you soon.`,
  };

  try {
    await transporter.sendMail(autoReplyOptions);
    console.log('Auto-reply email sent successfully');
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending auto-reply email:', err);
    res.status(500).json({ success: false, error: 'Error sending auto-reply email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email Notification Service running on port ${PORT}`);
});
