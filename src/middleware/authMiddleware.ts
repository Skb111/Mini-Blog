//middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try{
        const rawAuthHeader = req.headers['authorization'] || req.headers['Authorization'];
        const authHeader = Array.isArray(rawAuthHeader) ? rawAuthHeader[0] : rawAuthHeader;
        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }
        const token = authHeader.slice('Bearer '.length).trim();
        const secret = process.env['JWT_SECRET'] as string ;
        if (!secret) {
            return res.status(500).json({ message: 'JWT secret is missing' });
        }
        const payload = jwt.verify(token, secret) as { id: string; role: string };
        req.userId = payload.id;
        req.role = payload.role;
        next();
        return;
    }catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default requireAuth;