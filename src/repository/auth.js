import * as models from '#models/auth'
import db from "#config/db_config";
/**
 * @param {import('#entity/auth').UserEntity} userEntity
 */
export async function CreateUser(userEntity, currentTime) {
  const model = new models.UserModel(
    userEntity.id,
    userEntity.name,
    userEntity.email,
    userEntity.password,
    userEntity.phone_number,
    userEntity.stripe_customer_id,
    currentTime,
    currentTime
  );

  const query = `
    INSERT INTO users
      (id, name, email, password, phone_number, stripe_customer_id,  created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    model.id,
    model.name,
    model.email,
    model.password,
    model.phoneNumber,
    model.stripeCustomerId,
    model.created_at,
    model.updated_at
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export async function GetUserCredentialsByEmail(email) {
  const query = `
    SELECT id ,password, stripe_customer_id
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const values = [email];

  const result = await db.query(query, values);
  return result.rows[0] || null;
}

export async function GetUserCredentialsByName(name) {
  const query = `
    SELECT id, password, stripe_customer_id
    FROM users
    WHERE name = $1
    LIMIT 1
  `;

  const values = [name];

  const result = await db.query(query, values);
  return result.rows[0] || null;
}