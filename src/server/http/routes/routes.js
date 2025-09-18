import { TransactionRoutes } from './transaction.js';
import { AuthRoutes } from './auth.js';
import { WebhookRoutes } from './webhook.js';
import { FinanceRoutes } from './finance.js';
import cors from 'cors';
/**
 * @param {object} deps
 */
export function RegisterRoutes(app) {
  app.use(cors())
  TransactionRoutes(app);
  AuthRoutes(app);
  WebhookRoutes(app);
  FinanceRoutes(app)
}
