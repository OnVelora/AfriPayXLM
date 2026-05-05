import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import paymentRoutes from './routes/payments';
import webhookRoutes from './routes/webhooks';
import { errorHandler } from './middleware/errorHandler';
import { stellarMonitor } from './services/stellarMonitor';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AfriPayXLM API running on port ${PORT}`);
  stellarMonitor.start();
});

export default app;
