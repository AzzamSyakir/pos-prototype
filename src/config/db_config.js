import { Client } from 'pg'
import env from "#config/env_config";
import { Pool } from 'pg'

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
  new PostgresDatabase(
    client
  )
  return client
}
async function name(params) {

}
const client = await NewDatabaseClient()
export default client
