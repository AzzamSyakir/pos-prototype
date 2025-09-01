import { TransactionRoutes } from './transaction.js';
import { AuthRoutes } from './auth.js';
/**
 * @param {object} deps
 * @param {import('express').Express} deps.app
 */
export function RegisterRoutes(app) {
  TransactionRoutes(app);
  AuthRoutes(app);
}
