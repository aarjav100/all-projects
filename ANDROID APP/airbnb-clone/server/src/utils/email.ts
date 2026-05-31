import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'apikey') {
      console.log(`📧 [DEV] Email to ${to}: ${subject}`);
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@airbnb-clone.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendOtpEmail = async (to: string, otp: string) => {
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #FF385C; font-size: 28px;">Airbnb Clone</h1>
      <p style="font-size: 16px; color: #484848;">Your verification code is:</p>
      <div style="background: #F7F7F7; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #222222;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #717171;">This code expires in 10 minutes. Do not share it with anyone.</p>
    </div>
  `;
  await sendEmail(to, 'Your Verification Code', html);
};

export const sendBookingConfirmation = async (to: string, bookingDetails: any) => {
  const html = `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #FF385C; font-size: 28px;">Booking Confirmed! 🎉</h1>
      <p style="font-size: 16px; color: #484848;">Your booking for <strong>${bookingDetails.listingTitle}</strong> has been confirmed.</p>
      <div style="background: #F7F7F7; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <p><strong>Check-in:</strong> ${bookingDetails.checkIn}</p>
        <p><strong>Check-out:</strong> ${bookingDetails.checkOut}</p>
        <p><strong>Total:</strong> $${bookingDetails.total}</p>
      </div>
    </div>
  `;
  await sendEmail(to, 'Booking Confirmed', html);
};
