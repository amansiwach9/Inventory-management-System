import express from 'express';
import authController from '../controllers/authController.js';
const authRouter = express.Router();

authRouter.post('/register', authController.registerUser);
authRouter.post('/verify-otp', authController.verifyUserOtp);
authRouter.post('/login', authController.loginUser);

export default authRouter;