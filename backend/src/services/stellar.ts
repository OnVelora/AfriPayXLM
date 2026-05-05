import * as StellarSdk from '@stellar/stellar-sdk';

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK = process.env.STELLAR_NETWORK || 'testnet';

const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const USDC_ASSET = NETWORK === 'mainnet'
  ? new StellarSdk.Asset('USDC', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN')
  : new StellarSdk.Asset('USDC', 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'); // testnet USDC issuer

export const RECEIVING_ADDRESS = process.env.STELLAR_RECEIVING_ADDRESS || '';

export function generateMemo(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function verifyUsdcPayment(
  memo: string,
  expectedAmount: number,
  toAddress: string
): Promise<{ verified: boolean; txHash?: string }> {
  try {
    const payments = await server
      .payments()
      .forAccount(toAddress)
      .order('desc')
      .limit(50)
      .call();

    for (const record of payments.records) {
      if (record.type !== 'payment') continue;
      const payment = record as StellarSdk.Horizon.ServerApi.PaymentOperationRecord;

      if (
        payment.asset_code === 'USDC' &&
        payment.to === toAddress &&
        parseFloat(payment.amount) >= expectedAmount
      ) {
        // Check memo on the transaction
        const tx = await payment.transaction();
        const txMemo = tx.memo?.toUpperCase();
        if (txMemo === memo.toUpperCase()) {
          return { verified: true, txHash: payment.transaction_hash };
        }
      }
    }
    return { verified: false };
  } catch (err) {
    console.error('Stellar verification error:', err);
    return { verified: false };
  }
}

export async function getAccountBalance(address: string): Promise<number> {
  try {
    const account = await server.loadAccount(address);
    const usdcBalance = account.balances.find(
      (b) => b.asset_type !== 'native' && (b as any).asset_code === 'USDC'
    );
    return usdcBalance ? parseFloat(usdcBalance.balance) : 0;
  } catch {
    return 0;
  }
}

export { server, USDC_ASSET };
