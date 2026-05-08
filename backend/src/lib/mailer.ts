import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetLink = async (email: string, token: string) => {
  const scheme = process.env.APP_SCHEME || 'MaternalCare';
  const webUrl = process.env.WEB_URL || 'http://localhost:5173';
  
  // App Link for Mobile
  const appLink = `${scheme.toLowerCase()}://reset-password?token=${token}&email=${email}`;
  // Web Link
  const webLink = `${webUrl}/reset-password?token=${token}&email=${email}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || `"MaternalCare" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - MaternalCare',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #E11D48;">MaternalCare Password Reset</h2>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <a href="${webLink}" style="display: inline-block; padding: 12px 24px; background-color: #E11D48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset on Web</a>
        <p style="margin-top: 20px;">If you are on your mobile phone, you can also use this link to open the app:</p>
        <a href="${appLink}" style="color: #E11D48;">Open in MaternalCare App</a>
        <p style="margin-top: 30px; font-size: 12px; color: #64748B;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] Reset link sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Mailer Error] Failed to send reset link to ${email}:`, error);
    throw error;
  }
};

export const sendResetOtp = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"MaternalCare" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Password Reset OTP - MaternalCare',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; text-align: center;">
        <h2 style="color: #E11D48;">MaternalCare OTP Code</h2>
        <p>Use the 6-digit code below to reset your password:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E11D48; padding: 20px; background-color: #FFF1F2; border-radius: 12px; display: inline-block; margin: 20px 0;">
          ${otp}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #64748B;">This code will expire in 15 minutes. Do not share this code with anyone.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Mailer] OTP sent to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Mailer Error] Failed to send OTP to ${email}:`, error);
    throw error;
  }
};
