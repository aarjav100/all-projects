import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For development, use a mock transporter if email credentials are not configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email credentials not configured. Using mock email service for development.');
    return {
      sendMail: async (mailOptions) => {
        console.log('📧 MOCK EMAIL SENT:');
        console.log('   To:', mailOptions.to);
        console.log('   Subject:', mailOptions.subject);
        console.log('   Content:', mailOptions.html ? mailOptions.html.replace(/<[^>]*>/g, '') : mailOptions.text);
        console.log('   ---');
        return { messageId: 'mock-' + Date.now() };
      }
    };
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP email
export const sendOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@erp.com',
      to: email,
      subject: 'Your OTP for Student ERP Admin Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1>Student ERP System</h1>
            <h2>Admin Login OTP</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hello,</p>
            <p>Your OTP for admin login is:</p>
            <div style="background-color: #e8f4fd; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h2 style="color: #2196F3; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p><strong>This OTP will expire in 10 minutes.</strong></p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>Student ERP Team</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 OTP email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    // Don't throw error, just log it and continue
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@erp.com',
      to: email,
      subject: 'Welcome to Student ERP System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1>Student ERP System</h1>
            <h2>Welcome!</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Hello ${firstName},</p>
            <p>Welcome to the Student ERP System! Your account has been successfully created.</p>
            <p>You can now:</p>
            <ul>
              <li>View your courses and enrollments</li>
              <li>Check your grades and attendance</li>
              <li>Pay your fees online</li>
              <li>Communicate with teachers and administrators</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>Student ERP Team</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// Send notification email
export const sendNotification = async (email, subject, message) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@erp.com',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
            <h1>Student ERP System</h1>
            <h2>Notification</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            ${message}
            <p>Best regards,<br>Student ERP Team</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    return false;
  }
};

// Verify OTP (placeholder - actual verification is done in the database)
export const verifyOTP = async (email, otp) => {
  // This function is a placeholder
  // Actual OTP verification is handled in the database
  return true;
}; 