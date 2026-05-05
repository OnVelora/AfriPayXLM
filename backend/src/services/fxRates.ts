// Simulated FX rates: 1 USDC = X local currency
const FX_RATES: Record<string, number> = {
  USD: 1.0,
  NGN: 1580.0,   // Nigerian Naira
  KES: 130.0,    // Kenyan Shilling
  GHS: 15.2,     // Ghanaian Cedi
  ZAR: 18.8,     // South African Rand
  UGX: 3780.0,   // Ugandan Shilling
  TZS: 2650.0,   // Tanzanian Shilling
  ETB: 57.5,     // Ethiopian Birr
  XOF: 620.0,    // West African CFA Franc
  EUR: 0.92,
  GBP: 0.79,
};

export function getFxRate(currency: string): number {
  return FX_RATES[currency.toUpperCase()] ?? 1.0;
}

export function convertUsdcToLocal(usdcAmount: number, currency: string): { localAmount: number; fxRate: number } {
  const fxRate = getFxRate(currency);
  return { localAmount: parseFloat((usdcAmount * fxRate).toFixed(2)), fxRate };
}

export function getSupportedCurrencies(): string[] {
  return Object.keys(FX_RATES);
}
