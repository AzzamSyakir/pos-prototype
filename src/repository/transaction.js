import * as models from '#models/transaction'
import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function CreateTransaction(trx, currentTime) {
  const model = new models.TransactionModel(
    trx.id,
    trx.amount,
    trx.status,
    trx.paymentMethod,
    currentTime,
    currentTime
  );

  const query = `
    INSERT INTO transactions
      (id, amount, status, payment_method, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    model.id,
    model.amount,
    model.status,
    model.paymentMethod,
    model.created_at,
    model.updated_at
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}