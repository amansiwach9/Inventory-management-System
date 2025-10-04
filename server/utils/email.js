import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpEmail = async (to, otp) => {
  
  const fromEmail = process.env.SENDER_EMAIL;

  const msg = {
    to: to,
    from: fromEmail,
    subject: 'Your Inventory App Verification Code',
    text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`,
    html: `<b>Your OTP for registration is: ${otp}</b><p>It will expire in 10 minutes.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('OTP email sent successfully via SendGrid API');
  } catch (error) {
    console.error('Error sending OTP email via SendGrid API:', error);

    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Could not send verification email.');
  }
};

