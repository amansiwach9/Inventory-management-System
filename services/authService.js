import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/email.js';

const prisma = new PrismaClient();

const register = async (userData) => {
    const { name, email, password } = userData;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(new Date().getTime() + 10 * 60 * 1000);  

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        // If user exists but is not verified, update their OTP
        if (!user.isVerified) {
            user = await prisma.user.update({
                where: { email },
                data: { otp: hashedOtp, otpExpires },
            });
        } else {
            throw new Error('User already exists and is verified.');
        }
    } else {
        // If user does not exist, create them
        const hashedPassword = await bcrypt.hash(password, salt);
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                otp: hashedOtp,
                otpExpires,
            },
        });
    }
    
    // Send the plain OTP via email
    await sendOtpEmail(email, otp);

    return { message: "OTP sent to your email. Please verify." };
};

const verifyOtp = async (verificationData) => {
    const { email, otp } = verificationData;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('User not found.');
    if (user.isVerified) throw new Error('User is already verified.');
    if (!user.otp || !user.otpExpires) throw new Error('No OTP found for this user.');
    if (new Date() > user.otpExpires) throw new Error('OTP has expired.');

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) throw new Error('Invalid OTP.');

    // Verification successful
    const verifiedUser = await prisma.user.update({
        where: { email },
        data: {
            isVerified: true,
            otp: null,
            otpExpires: null,
        },
    });

    return verifiedUser;
};

const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Please verify your email before logging in.');

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }
    throw new Error('Invalid credentials');
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authService = { register, verifyOtp, login, generateToken };
export default authService;