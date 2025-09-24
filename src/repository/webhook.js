import db from "#config/db_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */export async function UpdateTransactionStatusByPaymentId(
  stripePaymentId,
  status,
  updatedAt,
  force = false
) {
  const query = `
    UPDATE transactions
    SET status = $1,
        updated_at = $2
    WHERE stripe_payment_id = $3
    ${force ? "" : "AND (status IS NULL OR status != 'succeeded')"}
    RETURNING *;
  `;

  const values = [status, updatedAt, stripePaymentId];

  try {
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Transaction not found");
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to update transaction status: ${err.message}`);
  }
}
