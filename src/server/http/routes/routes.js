import { TransactionRoutes } from './transaction.js';
import { AuthRoutes } from './auth.js';
import { WebhookRoutes } from './webhook.js';
/**
 * @param {object} deps
 */
export function RegisterRoutes(app) {
  TransactionRoutes(app);
  AuthRoutes(app);
  WebhookRoutes(app);

}
