const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // For development, we'll just log the email instead of sending it
    if (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com')) {
      console.log('=== EMAIL SIMULATION (Development Mode) ===');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Message:', options.message);
      if (options.html) {
        console.log('HTML:', options.html);
      }
      console.log('========================================');
      return { messageId: 'dev-simulation-' + Date.now() };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const message = {
      from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
