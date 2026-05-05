import prisma from '../lib/prisma';
import { verifyUsdcPayment, RECEIVING_ADDRESS } from './stellar';
import { sendWebhook } from './webhook';

const POLL_INTERVAL_MS = 30_000; // 30 seconds
const PAYMENT_EXPIRY_HOURS = 24;

class StellarMonitor {
  private timer: NodeJS.Timeout | null = null;

  start() {
    console.log('Stellar payment monitor started');
    this.timer = setInterval(() => this.checkPendingPayments(), POLL_INTERVAL_MS);
    this.checkPendingPayments(); // run immediately
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  private async checkPendingPayments() {
    const pending = await prisma.payment.findMany({
      where: { status: 'PENDING' },
      include: { merchant: true },
    });

    if (!pending.length) return;

    const expiryThreshold = new Date(Date.now() - PAYMENT_EXPIRY_HOURS * 3600 * 1000);

    for (const payment of pending) {
      // Expire old payments
      if (payment.createdAt < expiryThreshold) {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: 'EXPIRED' } });
        continue;
      }

      const address = RECEIVING_ADDRESS || payment.stellarAddress;
      const { verified, txHash } = await verifyUsdcPayment(payment.memo, payment.amount, address);

      if (verified && txHash) {
        const updated = await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'COMPLETED', txHash },
        });

        if (payment.merchant.webhookUrl) {
          await sendWebhook(updated, payment.merchant.webhookUrl);
        }
      }
    }
  }
}

export const stellarMonitor = new StellarMonitor();
