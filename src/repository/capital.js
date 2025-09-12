import db from "#config/db_config";
export async function FetchCapital(userId) {
  const query = `
    SELECT amount, type
    FROM capitals
    WHERE user_id = $1
    LIMIT 1
  `;

  const values = [userId];

  const result = await db.query(query, values);
  return result.rows[0];
}
export async function AddCapital(dto) {
  try {
    const query = `
      INSERT INTO capitals (user_id, amount, type, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *;
    `;

    const values = [dto.userId, dto.amount, dto.targetLevel];

    const result = await db.query(query, values);

    if (!result.rows || result.rows.length === 0) {
      throw new Error("Failed to insert capital");
    }

    return result.rows[0];
  } catch (err) {
    throw new Error(err.message || "Database error while inserting capital");
  }
}
