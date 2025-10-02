import authService from '../services/authService.js';
import asyncHandler from 'express-async-handler';

const registerUser = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(200).json(result);
});

const verifyUserOtp = asyncHandler(async (req, res) => {
    const user = await authService.verifyOtp(req.body);
    const token = authService.generateToken(user.id);
    res.status(200).json({
        message: "Email verified successfully.",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);
    const token = authService.generateToken(user.id);
    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
    });
});

const authController = { registerUser, verifyUserOtp, loginUser };
export default authController;