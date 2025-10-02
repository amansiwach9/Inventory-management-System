import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, name: true, role: true },
            });
            if (!req.user) {
                 return res.status(401).json({ message: 'User not found.' });
            }
            next();
        } catch (error) {
            // Pass error to the centralized error handler
            const err = new Error('Not authorized, token failed.');
            res.status(401);
            next(err);
        }
    }
    if (!token) {
        const err = new Error('Not authorized, no token.');
        res.status(401);
        next(err);
    }
};

export const permit = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const err = new Error('Forbidden: You do not have the required permissions.');
            res.status(403);
            next(err);
        }
        next();
    };
};