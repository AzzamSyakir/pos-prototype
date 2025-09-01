// redisconfig.js
import { createClient } from "redis";

/**
 * @typedef {import('redis').RedisClientType} RedisClientType
 */
class Redis {
  /**
   * @param {RedisClientType} client
   */
  constructor(client) {
    this.client = client;
  }

  async set(key, value) {
    return this.client.set(key, value);
  }

  async get(key) {
    return this.client.get(key);
  }

  async del(key) {
    return this.client.del(key);
  }

  async setEx(key, ttl, value) {
    return this.client.setEx(key, ttl, value);
  }
}

let redisInstance = null;

/**
 * @returns {Promise<Redis>}
 */
export async function ConnectRedis() {
  if (redisInstance) return redisInstance;

  const client = createClient();
  client.on("error", (err) => console.error("Redis Client Error:", err));
  await client.connect();

  redisInstance = new Redis(client);
  return redisInstance;
}

/** @type {Redis} */
const redis = await ConnectRedis();
export default redis;
