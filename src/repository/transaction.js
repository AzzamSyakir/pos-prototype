import * as models from '#models/transaction'
import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function CreateTransaction(trx) {
  const model = new models.TransactionModel(
    trx.id,
    trx.amount,
    trx.status,
    trx.paymentMethod,
    trx.userId,
    trx.stripePaymentId,
  );

  const query = `
    INSERT INTO transactions
      (id, amount, status, payment_method, user_id, stripe_payment_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    RETURNING *;
  `;

  const values = [
    model.id,
    model.amount,
    model.status,
    model.paymentMethod,
    model.userId,
    model.stripePaymentId,
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