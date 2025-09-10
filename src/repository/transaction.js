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
    trx.userId,
    trx.StripePaymentId,
    currentTime,
    currentTime
  );

  const query = `
    INSERT INTO transactions
      (id, amount, status, payment_method, user_id, stripe_payment_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    model.id,
    model.amount,
    model.status,
    model.paymentMethod,
    model.userId,
    model.stripePaymentId,
    model.created_at,
    model.updated_at
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function FetchTransaction(userId) {
  const query = `
    SELECT * 
    FROM transactions 
    WHERE user_id = $1
  `;

  const values = [userId];

  const result = await db.query(query, values);
  return result.rows;
}

export async function GetUserEmailByUserId(id) {
  const query = `
    SELECT email
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const values = [id];

  const result = await db.query(query, values);
  const email = result.rows[0].email;
  return email;
}

export async function FetchTransactionOmzet(userId) {
  const query = `
    SELECT COALESCE(SUM(amount), 0) AS total_omzet
    FROM transactions 
    WHERE user_id = $1
      AND status = 'succeeded'
  `;

  const values = [userId];
  const result = await db.query(query, values);

  return result.rows[0]?.total_omzet || 0;
}
