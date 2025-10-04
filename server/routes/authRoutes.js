import express from 'express';
import authController from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
const authRouter = express.Router();

authRouter.use(authLimiter);

authRouter.post('/register', authController.registerUser);
authRouter.post('/verify-otp', authController.verifyUserOtp);
authRouter.post('/login', authController.loginUser);

export default authRouter;