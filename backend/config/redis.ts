import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

let client: RedisClientType | null = null;

export async function getClient() {
  if (client == null) {
    client = createClient({
      password: process.env.REDIS_PW,
      url: process.env.REDIS_URL,
    });
    try {
      await client.connect();
    } catch (error) {
      console.error("Failed to connect to redis...");
      console.error(error);
      throw error;
    }
  }
  return client;
}
