import db from "#config/db_config";
import { CapitalSeedData } from "../data/capitals.js";

export class CapitalSeeder {
  constructor(userId, count) {
    this.capitalSeedData = new CapitalSeedData(userId, count);
  }

  async Up() {
    console.log("Starting CapitalSeeder Up...");

    const query = `
      INSERT INTO capitals (id, user_id, amount, type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const cap of this.capitalSeedData.data) {
      const values = [
        cap.id,
        cap.user_id,
        cap.amount,
        cap.type,
        cap.createdAt,
        cap.updatedAt,
      ];
      await db.query(query, values);
      console.log(`Inserted capital: ${cap.id} for user ${cap.user_id}`);
    }
  }

  async Down() {
    console.log("Starting CapitalSeeder Down...");

    const query = `DELETE FROM capitals WHERE id = ANY($1::uuid[])`;
    const ids = this.capitalSeedData.data.map((cap) => cap.id);

    await db.query(query, [ids]);
    console.log(`Deleted ${ids.length} capitals`);
  }
}
