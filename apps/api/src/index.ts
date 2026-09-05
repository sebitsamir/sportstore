import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { API_ENDPOINTS } from '@sport-store/shared';
import { stubRouter } from './routes/stubs.js';

const app = express();
const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get(`/api${API_ENDPOINTS.HEALTH}`, (_req, res) => {
  res.json({
    ok: true,
    service: 'sport-store-api',
    message: 'Express stub is running. Wire Postgres handlers next.',
  });
});

app.use('/api', stubRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Sport Store API listening on http://localhost:${port}/api`);
});
