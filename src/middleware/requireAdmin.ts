// middleware/requireAdmin.ts
import type { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  return next();
}
export default requireAdmin;