import * as models from '#models/transaction'
import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function UpdateTransactionStatus(transactionId, userId, status, updatedAt) {
  const query = `
    UPDATE transactions
    SET status = $1, updated_at = $2
    WHERE id = $3 AND user_id = $4
    RETURNING id, status, user_id, updated_at;
  `;

  const values = [status, updatedAt, transactionId, userId];

  const result = await db.query(query, values);
  return result.rows[0];
}
