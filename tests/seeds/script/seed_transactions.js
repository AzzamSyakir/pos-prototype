import db from "#config/db_config";
import { TransactionSeedData } from "../data/transactions.js";

export class TransactionSeeder {
  constructor(userId, count) {
    this.transactionSeedData = new TransactionSeedData(userId, count);
  }

  async Up() {
    console.log("Starting TransactionSeeder Up...");

    const query = `
      INSERT INTO transactions (id, amount, status, payment_method, user_id, stripe_payment_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    for (const tx of this.transactionSeedData.data) {
      const values = [
        tx.id,
        tx.amount,
        tx.status,
        tx.paymentMethod,
        tx.user_id,
        tx.stripe_payment_id,
        tx.createdAt,
        tx.updatedAt,
      ];
      await db.query(query, values);
      console.log(`Inserted transaction: ${tx.id} for user ${tx.user_id}`);
    }
  }

  async Down() {
    console.log("Starting TransactionSeeder Down...");

    const query = `DELETE FROM transactions WHERE id = ANY($1::uuid[])`;
    const ids = this.transactionSeedData.data.map((tx) => tx.id);

    await db.query(query, [ids]);
    console.log(`Deleted ${ids.length} transactions`);
  }
}