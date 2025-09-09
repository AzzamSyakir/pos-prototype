import { TransactionRoutes } from './transaction.js';
import { AuthRoutes } from './auth.js';
import { WebhookRoutes } from './webhook.js';
import cors from 'cors';
/**
 * @param {object} deps
 */
export function RegisterRoutes(app) {
  app.use(cors())
  TransactionRoutes(app);
  AuthRoutes(app);
  WebhookRoutes(app);
}
