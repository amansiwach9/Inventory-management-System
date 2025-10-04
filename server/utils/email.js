import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to, otp) => {
    const fromAddress = `"Inventory Management" <${process.env.SENDER_EMAIL}>`;
    const mailOptions = {
        from: fromAddress,
        to: to,
        subject: 'Your Verification Code',
        text: `Your OTP for Inventory Management registration is: ${otp}. It will expire in 10 minutes.`,
        html: `<b>Your OTP for Inventory Management registration is: ${otp}</b><p>It will expire in 10 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send verification email.');
    }
};