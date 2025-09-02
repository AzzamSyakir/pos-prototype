import { TransactionRoutes } from './transaction.js';
import { AuthRoutes } from './auth.js';
/**
 * @param {object} deps
 */
export function RegisterRoutes(app) {
  TransactionRoutes(app);
  AuthRoutes(app);
}
