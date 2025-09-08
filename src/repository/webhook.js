import * as models from '#models/transaction'
import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function UpdateLatestTransactionStatusByUserId(userId, status, updatedAt) {
  const query = `
    UPDATE transactions
    SET status = $1,
        updated_at = $2
    WHERE id = (
      SELECT id
      FROM transactions
      WHERE user_id = $3
      ORDER BY created_at DESC
      LIMIT 1
    )
    RETURNING id, status, user_id, updated_at;
  `;

  const values = [status, updatedAt, userId];

  const result = await db.query(query, values);
  return result.rows[0] ?? null;
}


export async function GetUserByStripeCustomerId(customerId) {
  const query = `
    SELECT id
    FROM users
    WHERE stripe_customer_id = $1
    LIMIT 1
  `;

  const values = [customerId];

  const result = await db.query(query, values);
  return result.rows[0];
}
