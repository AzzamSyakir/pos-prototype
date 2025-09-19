import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function UpdateTransactionStatusByPaymentId(stripePaymentId, status, updatedAt) {
  const query = `
    UPDATE transactions
    SET status = $1,
        updated_at = $2
    WHERE stripe_payment_id = $3  
    AND (status IS NULL OR status != 'succeeded')
    `;
  const values = [status, updatedAt, stripePaymentId];
  await db.query(query, values);
}
