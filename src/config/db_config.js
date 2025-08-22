import { Client } from 'pg'
import env from "#config/env_config";

class PostgresDatabase {
  constructor(client) {
    this.client = client
  }
}
async function NewDatabaseClient() {
  const client = new Client({
    user: env.db.user,
    password: env.db.password,
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
  })
  await client.connect()
  const postgresDb = new PostgresDatabase(
    client
  )
  return postgresDb
}
const client = await NewDatabaseClient()
export default client
