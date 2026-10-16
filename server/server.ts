import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// API routing
app.use('/api/v1', apiRouter);

// Fallback health check
app.get('/', (req, res) => {
  res.send('FUNDI Modular Monolith API Gateway is active. Visit /api/v1/health.');
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[FUNDI API] Server listening on port ${port}`);
  });
}
