# ⚡ AfriPayXLM

A Stripe-like payment gateway for Stellar-based USDC payments, built for African markets.

## Features

- **USDC payments on Stellar** — generate payment links with unique memos
- **FX conversion** — simulate rates for NGN, KES, GHS, ZAR, UGX, ETB, XOF, EUR, GBP
- **Webhook system** — automatic POST to your endpoint on payment confirmation
- **Stellar anchor mock** — SEP-24-style fiat on/off-ramp simulation
- **Merchant dashboard** — transaction history, payment links, API key management
- **Auth** — JWT + API key authentication

## Architecture

```
afripayxlm/
├── backend/          # Node.js + TypeScript + Express + Prisma
│   ├── src/
│   │   ├── routes/   # auth, payments, webhooks
│   │   ├── services/ # stellar, fxRates, webhook, anchor, stellarMonitor
│   │   ├── middleware/
│   │   └── lib/
│   └── prisma/
└── frontend/         # React + TypeScript + Vite
    └── src/
        ├── pages/    # Dashboard, Payments, Settings, PaymentPage
        └── components/
```

## Quick Start (Docker)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your Stellar testnet keys

docker-compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Reference

All authenticated endpoints accept either:
- `Authorization: Bearer <jwt>` header
- `X-Api-Key: <apiKey>` header

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register merchant |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current merchant |
| PATCH | `/auth/webhook-url` | Update webhook URL |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/create` | ✓ | Create payment |
| GET | `/payments/status/:id` | — | Get payment status (public) |
| GET | `/payments` | ✓ | List payments |
| GET | `/payments/fx-rates` | — | Supported currencies |
| POST | `/payments/anchor/quote` | — | FX quote |
| POST | `/payments/anchor/deposit` | ✓ | Initiate deposit |
| POST | `/payments/anchor/withdraw` | ✓ | Initiate withdrawal |

### Webhooks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/webhook` | — | Receive external webhook |
| GET | `/webhook/logs` | ✓ | View delivery logs |

### Create Payment Example

```bash
curl -X POST http://localhost:3001/payments/create \
  -H "X-Api-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "localCurrency": "NGN", "description": "Order #123"}'
```

Response:
```json
{
  "id": "uuid",
  "amount": 10,
  "currency": "USDC",
  "localCurrency": "NGN",
  "localAmount": 15800,
  "fxRate": 1580,
  "stellarAddress": "G...",
  "memo": "ABC12345",
  "paymentLink": "http://localhost:5173/pay/uuid",
  "status": "PENDING"
}
```

### Webhook Payload

AfriPayXLM POSTs this to your webhook URL when a payment completes:

```json
{
  "event": "payment.completed",
  "payment": {
    "id": "uuid",
    "amount": 10,
    "currency": "USDC",
    "localCurrency": "NGN",
    "localAmount": 15800,
    "fxRate": 1580,
    "status": "COMPLETED",
    "txHash": "stellar-tx-hash",
    "memo": "ABC12345"
  }
}
```

## Stellar Setup (Testnet)

1. Create a testnet account at https://laboratory.stellar.org
2. Fund it with Friendbot: `https://friendbot.stellar.org?addr=YOUR_ADDRESS`
3. Add a USDC trustline (issuer: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`)
4. Set `STELLAR_RECEIVING_ADDRESS` and `STELLAR_RECEIVING_SECRET` in `.env`

## FX Rates (Simulated)

| Currency | Rate (1 USDC) |
|----------|---------------|
| NGN | 1,580 |
| KES | 130 |
| GHS | 15.2 |
| ZAR | 18.8 |
| UGX | 3,780 |
| ETB | 57.5 |
| XOF | 620 |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `STELLAR_NETWORK` | `testnet` or `mainnet` |
| `STELLAR_HORIZON_URL` | Horizon server URL |
| `STELLAR_RECEIVING_ADDRESS` | Your Stellar address to receive payments |
| `STELLAR_RECEIVING_SECRET` | Your Stellar secret key |
| `FRONTEND_URL` | Frontend URL for CORS and payment links |
