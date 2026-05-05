import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /webhook - receive external webhook (e.g. from anchor)
router.post('/', async (req, res) => {
  // Acknowledge receipt; real processing would verify signature
  console.log('Webhook received:', JSON.stringify(req.body));
  res.json({ received: true });
});

// GET /webhook/logs - merchant's webhook delivery logs
router.get('/logs', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const logs = await prisma.webhookLog.findMany({
      where: { payment: { merchantId: req.merchantId } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { payment: { select: { id: true, amount: true, status: true } } },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
