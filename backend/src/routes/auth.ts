import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = RegisterSchema.parse(req.body);
    const hashed = await bcrypt.hash(password, 10);
    const merchant = await prisma.merchant.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true, apiKey: true },
    });
    const token = jwt.sign({ merchantId: merchant.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ merchant, token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const merchant = await prisma.merchant.findUnique({ where: { email } });
    if (!merchant || !(await bcrypt.compare(password, merchant.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ merchantId: merchant.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, merchant: { id: merchant.id, email: merchant.email, name: merchant.name, apiKey: merchant.apiKey } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: req.merchantId },
      select: { id: true, email: true, name: true, apiKey: true, webhookUrl: true, createdAt: true },
    });
    res.json(merchant);
  } catch (err) {
    next(err);
  }
});

router.patch('/webhook-url', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { webhookUrl } = req.body;
    const merchant = await prisma.merchant.update({
      where: { id: req.merchantId },
      data: { webhookUrl },
      select: { webhookUrl: true },
    });
    res.json(merchant);
  } catch (err) {
    next(err);
  }
});

export default router;
