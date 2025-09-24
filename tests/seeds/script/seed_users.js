import db from "#config/db_config";
import bcrypt from "bcryptjs";
import { UserSeedData } from "../data/users.js";

export class UserSeeder {
  constructor(count) {
    this.userSeedData = new UserSeedData(count);
  }
  async Up() {
    console.log("Starting UserSeeder Up...");

    const query = `
    INSERT INTO users (id, name, email, password, stripe_customer_id, phone_number, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

    for (const user of this.userSeedData.data) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const values = [
        user.id,
        user.name,
        user.email,
        hashedPassword,
        user.stripeCustomerId,
        user.phoneNumber,
        user.createdAt,
        user.updatedAt,
      ];
      await db.query(query, values);
      console.log(`Inserted user: ${user.email}`);
    }
  }

  async Down() {
    console.log("Starting UserSeeder Down...");

    const query = `DELETE FROM users WHERE id = ANY($1::uuid[])`;
    const ids = this.userSeedData.data.map((u) => u.id);

    await db.query(query, [ids]);
    console.log(`Deleted ${ids.length} users`);
  }
}
