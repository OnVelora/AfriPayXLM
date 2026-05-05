// Mock Stellar SEP-24 anchor for fiat on/off-ramp simulation
import { getFxRate } from './fxRates';

interface AnchorQuote {
  usdcAmount: number;
  localAmount: number;
  localCurrency: string;
  fxRate: number;
  fee: number;
  expiresAt: string;
}

interface AnchorDepositResult {
  id: string;
  stellarAddress: string;
  memo: string;
  expiresAt: string;
}

export function getAnchorQuote(localAmount: number, localCurrency: string): AnchorQuote {
  const fxRate = getFxRate(localCurrency);
  const usdcAmount = parseFloat((localAmount / fxRate).toFixed(6));
  const fee = parseFloat((usdcAmount * 0.005).toFixed(6)); // 0.5% fee
  return {
    usdcAmount: usdcAmount - fee,
    localAmount,
    localCurrency,
    fxRate,
    fee,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
  };
}

export function initiateAnchorDeposit(localAmount: number, localCurrency: string): AnchorDepositResult {
  return {
    id: `anchor_${Math.random().toString(36).substring(2, 10)}`,
    stellarAddress: process.env.STELLAR_RECEIVING_ADDRESS || 'MOCK_STELLAR_ADDRESS',
    memo: Math.random().toString(36).substring(2, 10).toUpperCase(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function initiateAnchorWithdrawal(usdcAmount: number, localCurrency: string, bankAccount: string) {
  const fxRate = getFxRate(localCurrency);
  const fee = parseFloat((usdcAmount * 0.005).toFixed(6));
  return {
    id: `withdrawal_${Math.random().toString(36).substring(2, 10)}`,
    usdcAmount,
    localAmount: parseFloat(((usdcAmount - fee) * fxRate).toFixed(2)),
    localCurrency,
    fxRate,
    fee,
    bankAccount,
    estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
    status: 'pending',
  };
}
