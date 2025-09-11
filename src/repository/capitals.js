import db from "#config/db_config";
export async function FetchUserCapital(userId) {
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