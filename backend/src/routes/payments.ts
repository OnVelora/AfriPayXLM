import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { authenticateApiKey, AuthRequest } from '../middleware/auth';
import { generateMemo, RECEIVING_ADDRESS } from '../services/stellar';
import { convertUsdcToLocal, getSupportedCurrencies } from '../services/fxRates';
import { getAnchorQuote, initiateAnchorDeposit, initiateAnchorWithdrawal } from '../services/anchor';

const router = Router();

const CreatePaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USDC'),
  localCurrency: z.string().default('USD'),
  description: z.string().optional(),
});

// POST /payments/create  (also aliased as POST /create-payment at root)
router.post('/create', authenticateApiKey, async (req: AuthRequest, res, next) => {
  try {
    const { amount, currency, localCurrency, description } = CreatePaymentSchema.parse(req.body);
    const memo = generateMemo();
    const { localAmount, fxRate } = convertUsdcToLocal(amount, localCurrency);
    const stellarAddress = RECEIVING_ADDRESS || 'TESTNET_ADDRESS_NOT_SET';
    const paymentId = uuidv4();
    const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pay/${paymentId}`;

    const payment = await prisma.payment.create({
      data: {
        id: paymentId,
        merchantId: req.merchantId!,
        amount,
        currency,
        localCurrency,
        localAmount,
        fxRate,
        stellarAddress,
        memo,
        description,
        paymentLink,
      },
    });

    res.status(201).json({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      localCurrency: payment.localCurrency,
      localAmount: payment.localAmount,
      fxRate: payment.fxRate,
      stellarAddress: payment.stellarAddress,
      memo: payment.memo,
      paymentLink: payment.paymentLink,
      status: payment.status,
      description: payment.description,
      createdAt: payment.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// GET /payments/status/:id
router.get('/status/:id', async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, amount: true, currency: true, localCurrency: true,
        localAmount: true, fxRate: true, stellarAddress: true, memo: true,
        status: true, txHash: true, description: true, paymentLink: true,
        createdAt: true, updatedAt: true,
      },
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    next(err);
  }
});

// GET /payments  - merchant's payment history
router.get('/', authenticateApiKey, async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string | undefined;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { merchantId: req.merchantId!, ...(status && { status: status as any }) },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, amount: true, currency: true, localCurrency: true,
          localAmount: true, fxRate: true, status: true, txHash: true,
          description: true, paymentLink: true, createdAt: true,
        },
      }),
      prisma.payment.count({ where: { merchantId: req.merchantId! } }),
    ]);

    res.json({ payments, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /payments/fx-rates
router.get('/fx-rates', (_, res) => {
  res.json({ currencies: getSupportedCurrencies() });
});

// POST /payments/anchor/quote
router.post('/anchor/quote', async (req, res) => {
  const { localAmount, localCurrency } = req.body;
  res.json(getAnchorQuote(localAmount, localCurrency));
});

// POST /payments/anchor/deposit
router.post('/anchor/deposit', authenticateApiKey, async (req, res) => {
  const { localAmount, localCurrency } = req.body;
  res.json(initiateAnchorDeposit(localAmount, localCurrency));
});

// POST /payments/anchor/withdraw
router.post('/anchor/withdraw', authenticateApiKey, async (req, res) => {
  const { usdcAmount, localCurrency, bankAccount } = req.body;
  res.json(initiateAnchorWithdrawal(usdcAmount, localCurrency, bankAccount));
});

export default router;
