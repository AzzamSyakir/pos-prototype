import db from "#config/db_config";
export async function FetchOmzet(userId, targetLevel) {
  const validLevels = ['day', 'week', 'month', 'year'];

  let filterQuery = "";
  const values = [userId];

  if (validLevels.includes(targetLevel)) {
    filterQuery = `AND DATE_TRUNC($2, created_at) = DATE_TRUNC($2, NOW())`;
    values.push(targetLevel);
  }

  const query = `
    SELECT COALESCE(SUM(amount), 0) AS total_omzet
    FROM transactions
    WHERE user_id = $1
      AND status = 'succeeded'
      ${filterQuery}
  `;

  const result = await db.query(query, values);
  return result.rows[0]?.total_omzet || 0;
}
