import axios from 'axios';
import prisma from '../lib/prisma';
import { Payment } from '@prisma/client';

export async function sendWebhook(payment: Payment, webhookUrl: string): Promise<void> {
  const payload = {
    event: 'payment.completed',
    payment: {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      localCurrency: payment.localCurrency,
      localAmount: payment.localAmount,
      fxRate: payment.fxRate,
      status: payment.status,
      txHash: payment.txHash,
      memo: payment.memo,
      createdAt: payment.createdAt,
    },
  };

  let statusCode: number | undefined;
  let success = false;

  try {
    const response = await axios.post(webhookUrl, payload, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json', 'X-AfriPay-Event': 'payment.completed' },
    });
    statusCode = response.status;
    success = response.status >= 200 && response.status < 300;
  } catch (err: any) {
    statusCode = err.response?.status;
  }

  await prisma.webhookLog.create({
    data: { paymentId: payment.id, url: webhookUrl, payload, statusCode, success },
  });

  if (success) {
    await prisma.payment.update({ where: { id: payment.id }, data: { webhookSent: true } });
  }
}
