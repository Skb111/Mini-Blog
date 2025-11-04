// routes/adminRoutes.ts
import express from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/requireAdmin';

const router = express.Router();

router.get('/dashboard', requireAuth, requireAdmin, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
