import { Client } from 'pg'
import env from "#config/env_config";

class PostgresDatabase {
  constructor(client) {
    this.client = client
  }
}
async function NewDatabaseClient() {
  const client = new Client({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
  })
  await client.connect()
  new PostgresDatabase(
    client
  )
  return client
}
const client = await NewDatabaseClient()
export default client
