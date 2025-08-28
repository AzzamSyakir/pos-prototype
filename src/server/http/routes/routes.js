<<<<<<< Updated upstream
import { TransactionRoutes } from './transaction.js';
/**
 * @param {object} deps
 * @param {import('express').Express} deps.app
 * @param {import('express').Router} deps.router
 */
export function RegisterRoutes(app, router) {
  TransactionRoutes(app, router);
=======
export function NewRoutes(app) {
  app.get('/', (req, res) => {
    res.send('hello world')
  })
>>>>>>> Stashed changes
}
