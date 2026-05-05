import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
  merchantId?: string;
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { merchantId: string };
    req.merchantId = payload.merchantId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export async function authenticateApiKey(req: AuthRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;
  if (!apiKey) return authenticate(req, res, next);

  const merchant = await prisma.merchant.findUnique({ where: { apiKey } });
  if (!merchant) return res.status(401).json({ error: 'Invalid API key' });

  req.merchantId = merchant.id;
  next();
}
